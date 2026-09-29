from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, select

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from src.auth import (
    authenticate_user,
    create_access_token,
    ensure_demo_users,
    get_current_active_user,
    get_current_user,
    hash_password,
)
from src.cache import cache_client, cache_key, init_cache
from src.chatbot_nlp import process_chat_message
from src.colleges import (
    compare_colleges_15_params,
    get_all_districts,
    get_college_by_code,
    load_all_colleges,
    search_and_filter_colleges,
)
from src.db import (
    PredictionLog,
    User,
    create_db_and_tables,
    create_prediction_log,
    get_session,
    seed_demo_prediction_logs,
    seed_tn_colleges,
)
from src.prediction_api import PredictionAPI
from src.references_data import ACADEMIC_REFERENCES, PROJECT_CHAPTERS, PROJECT_METADATA
from src.roi_calculator import calculate_college_roi
from src.scholarships import get_all_scholarships, match_scholarships

api = PredictionAPI(models_path=str(BASE_DIR / "models"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    for session in get_session():
        seed_tn_colleges(session)
        ensure_demo_users(session)
        seed_demo_prediction_logs(session)
    api.load_model()
    try:
        await init_cache()
    except Exception:
        pass
    print("University Admission Prediction System API started successfully.")
    yield


app = FastAPI(
    title="University Admission Prediction System (TNEA)",
    description="Machine Learning and Decision Support Platform for Tamil Nadu Engineering Admissions",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS middleware supporting credentials and local development ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------
# Request & Response Schemas
# -------------------------------------------------------------
class AuthLoginRequest(BaseModel):
    username: str
    password: str


class AuthRegisterRequest(BaseModel):
    username: str
    password: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str
    is_admin: bool = False


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class CutoffCalcRequest(BaseModel):
    maths: float
    physics: float
    chemistry: float


class PredictionRequest(BaseModel):
    cutoff: float
    community: str = "BC"
    course: str = "CSE"
    preferred_districts: Optional[List[str]] = None
    max_tuition_fee: Optional[float] = None
    student_id: Optional[str] = "TNEA-2025-001"


class CollegeSearchRequest(BaseModel):
    district: Optional[str] = None
    max_fees: Optional[float] = None
    course: Optional[str] = None
    college_type: Optional[str] = None
    query: Optional[str] = None
    limit: int = 150


class CompareRequest(BaseModel):
    college_codes: List[str]


class ScholarshipMatchRequest(BaseModel):
    annual_income: float
    community: str
    first_graduate: bool = False
    govt_school_student: bool = False
    gender: str = "ANY"
    marks_percentage: float = 75.0


class RoiCalcRequest(BaseModel):
    annual_tuition_fee: float
    annual_hostel_fee: float = 0.0
    annual_misc_fee: float = 15000.0
    avg_placement_package_lpa: float
    scholarship_waiver_per_year: float = 0.0
    course_duration_years: int = 4


class ChatMessageRequest(BaseModel):
    message: str


# -------------------------------------------------------------
# Authentication Routes (Exact Slide 9 specifications)
# -------------------------------------------------------------
@app.post("/auth/register", response_model=UserResponse)
def register(request: AuthRegisterRequest, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.username == request.username.strip())).first()
    if existing:
        # Exact observed output from Slide 9
        raise HTTPException(status_code=400, detail="Email already exists.")

    user = User(
        username=request.username.strip(),
        full_name=request.full_name.strip() if request.full_name else "Sameer",
        hashed_password=hash_password(request.password),
        is_active=True,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "is_admin": user.is_admin,
    }


@app.post("/auth/login", response_model=AuthTokenResponse)
def login(request: AuthLoginRequest, session: Session = Depends(get_session)):
    user = authenticate_user(session, request.username.strip(), request.password)
    if not user:
        # Exact observed output from Slide 9
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    token = create_access_token({"sub": user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name or "Sameer",
            "is_admin": user.is_admin,
        },
    }


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_active_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "full_name": current_user.full_name or "Sameer",
        "is_admin": current_user.is_admin,
    }


# -------------------------------------------------------------
# Cutoff Calculation (out of 200)
# -------------------------------------------------------------
@app.post("/cutoff/calculate")
def calculate_cutoff_endpoint(request: CutoffCalcRequest):
    return PredictionAPI.calculate_cutoff_from_pcm(
        maths=request.maths,
        physics=request.physics,
        chemistry=request.chemistry,
    )


# -------------------------------------------------------------
# Admission Prediction (Core Module - Slide 10)
# -------------------------------------------------------------
@app.post("/predict")
def predict_admission_endpoint(
    request: PredictionRequest,
    current_user: Optional[User] = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    result = api.predict_admission(
        applicant_cutoff=request.cutoff,
        community=request.community,
        course=request.course,
        preferred_districts=request.preferred_districts,
        max_tuition_fee=request.max_tuition_fee,
    )

    # Always log the candidate prediction so it immediately appears in History & Evaluation Logs
    try:
        top_rec = ""
        if result.get("high_chance") and len(result["high_chance"]) > 0:
            top_rec = result["high_chance"][0].get("college_name") or result["high_chance"][0].get("short_name", "")
        elif result.get("medium_chance") and len(result["medium_chance"]) > 0:
            top_rec = result["medium_chance"][0].get("college_name") or result["medium_chance"][0].get("short_name", "")

        summary_data = dict(result.get("summary", {}))
        if top_rec:
            summary_data["top_recommendation"] = top_rec

        student_identifier = request.student_id or ("Sameer Khan" if current_user else "TNEA-2025-001")

        create_prediction_log(
            session,
            user_id=current_user.id if current_user else None,
            student_id=student_identifier,
            cutoff=request.cutoff,
            community=request.community,
            course=request.course,
            result_summary=summary_data,
        )
    except Exception as e:
        print(f"Prediction log storage error: {e}")

    return result


@app.get("/predict/history")
def get_prediction_history(
    session: Session = Depends(get_session),
    limit: int = 100,
):
    # Slide 16: Retrieve all evaluation audit logs so examiners can view all assessments
    query = select(PredictionLog).order_by(PredictionLog.created_at.desc()).limit(limit)
    logs = session.exec(query).all()
    return {"history": logs, "count": len(logs)}


@app.post("/predict/history/seed")
def seed_prediction_history_endpoint(
    session: Session = Depends(get_session),
):
    # Force seed or ensure initial demo records exist
    seed_demo_prediction_logs(session, force=True)
    query = select(PredictionLog).order_by(PredictionLog.created_at.desc()).limit(100)
    logs = session.exec(query).all()
    return {"status": "seeded", "history": logs, "count": len(logs)}


@app.delete("/predict/history")
def clear_prediction_history(
    session: Session = Depends(get_session),
):
    logs = session.exec(select(PredictionLog)).all()
    count = len(logs)
    for log in logs:
        session.delete(log)
    session.commit()
    return {"status": "cleared", "deleted_count": count}


# -------------------------------------------------------------
# Cutoff Trends & Expected Cutoffs (Linear Regression)
# -------------------------------------------------------------
@app.get("/cutoff/trend/{college_code}")
def cutoff_trend_endpoint(
    college_code: str,
    course: str = Query("CSE"),
    community: str = Query("BC"),
):
    return api.get_cutoff_trends(college_code=college_code, course=course, community=community)


# -------------------------------------------------------------
# 80+ Tamil Nadu Colleges Catalog & Search Filter (Slide 11)
# -------------------------------------------------------------
@app.get("/colleges/all")
async def get_all_colleges_endpoint():
    key = cache_key("catalog", "all")
    cached = await cache_client.get_json(key)
    if cached:
        return cached
    colleges = load_all_colleges()
    result = {"colleges": colleges, "count": len(colleges), "districts": get_all_districts()}
    await cache_client.set_json(key, result, ttl_seconds=600)
    return result


@app.post("/colleges/search")
def search_colleges_endpoint(request: CollegeSearchRequest):
    filtered = search_and_filter_colleges(
        district=request.district,
        max_fees=request.max_fees,
        course=request.course,
        college_type=request.college_type,
        query=request.query,
        limit=request.limit,
    )
    return {"colleges": filtered, "count": len(filtered)}


@app.get("/colleges/{college_code}")
def get_single_college_endpoint(college_code: str):
    c = get_college_by_code(college_code)
    if not c:
        raise HTTPException(status_code=404, detail="College not found")
    return c


# -------------------------------------------------------------
# Side-by-Side College Comparison (15+ Parameters - Slide 13)
# -------------------------------------------------------------
@app.post("/colleges/compare")
def compare_colleges_endpoint(request: CompareRequest):
    if not request.college_codes:
        raise HTTPException(status_code=400, detail="Please provide at least 2 college codes to compare.")
    return compare_colleges_15_params(request.college_codes)


# -------------------------------------------------------------
# Rule-Based Scholarship Matcher (Slide 11)
# -------------------------------------------------------------
@app.post("/scholarships/match")
def match_scholarships_endpoint(request: ScholarshipMatchRequest):
    return match_scholarships(
        annual_income=request.annual_income,
        community=request.community,
        first_graduate=request.first_graduate,
        govt_school_student=request.govt_school_student,
        gender=request.gender,
        marks_percentage=request.marks_percentage,
    )


@app.get("/scholarships/all")
async def all_scholarships_endpoint():
    key = cache_key("scholarships", "all")
    cached = await cache_client.get_json(key)
    if cached:
        return cached
    schemes = get_all_scholarships()
    result = {"scholarships": schemes, "count": len(schemes)}
    await cache_client.set_json(key, result, ttl_seconds=600)
    return result


# -------------------------------------------------------------
# Return on Investment (ROI) Calculator (Slide 7)
# -------------------------------------------------------------
@app.post("/roi/calculate")
def roi_calculate_endpoint(request: RoiCalcRequest):
    return calculate_college_roi(
        annual_tuition_fee=request.annual_tuition_fee,
        annual_hostel_fee=request.annual_hostel_fee,
        annual_misc_fee=request.annual_misc_fee,
        avg_placement_package_lpa=request.avg_placement_package_lpa,
        scholarship_waiver_per_year=request.scholarship_waiver_per_year,
        course_duration_years=request.course_duration_years,
    )


# -------------------------------------------------------------
# AI Chatbot (AJAX / NLP - Slide 7 & 8)
# -------------------------------------------------------------
@app.post("/chatbot/message")
def chatbot_message_endpoint(request: ChatMessageRequest):
    return process_chat_message(request.message)


# -------------------------------------------------------------
# References, Team & Project Documentation (Slide 16 & Document 2.pdf)
# -------------------------------------------------------------
@app.get("/references")
async def get_references_endpoint():
    key = cache_key("references", "all")
    cached = await cache_client.get_json(key)
    if cached:
        return cached
    data = {
        "project_metadata": PROJECT_METADATA,
        "academic_references": ACADEMIC_REFERENCES,
        "project_chapters": PROJECT_CHAPTERS,
    }
    await cache_client.set_json(key, data, ttl_seconds=600)
    return data


# -------------------------------------------------------------
# Health & Status Check
# -------------------------------------------------------------
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "system": "University Admission Prediction System (Tamil Nadu - TNEA)",
        "model_loaded": api.is_loaded,
        "model_accuracy": "94.5%",
        "total_colleges": len(load_all_colleges()),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
