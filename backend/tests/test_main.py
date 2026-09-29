"""
Comprehensive automated test suite for University Admission Prediction System (TNEA).
Tests core FastAPI endpoints, ML inference, Slide 9, 10, 11, 13, 14 test cases,
scholarships, ROI calculation, authentication, and NLP chatbot.
"""

from __future__ import annotations

import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.main import app
from src.prediction_api import PredictionAPI

client = TestClient(app)


# -------------------------------------------------------------
# 1. System Health & Catalog Initialization
# -------------------------------------------------------------
def test_system_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["total_colleges"] >= 80
    assert "94.5%" in data["model_accuracy"]


def test_colleges_all_endpoint():
    res = client.get("/colleges/all")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 80
    assert len(data["districts"]) > 10
    assert "Chennai" in data["districts"]
    assert "Coimbatore" in data["districts"]


# -------------------------------------------------------------
# 2. Cutoff Formula Calculation (Maths + Physics/2 + Chemistry/2)
# -------------------------------------------------------------
def test_cutoff_calculation():
    # 95 Maths + 90 Physics + 90 Chemistry -> 95 + 45 + 45 = 185.00
    res = client.post("/cutoff/calculate", json={"maths": 95, "physics": 90, "chemistry": 90})
    assert res.status_code == 200
    data = res.json()
    assert data["cutoff"] == 185.00
    assert data["max_cutoff"] == 200.00
    assert data["maths"] == 95.0
    assert data["physics"] == 90.0
    assert data["chemistry"] == 90.0


# -------------------------------------------------------------
# 3. Slide 10 Admission Chance Prediction Test Scenario
# Cutoff: 185.0, Community: BC, Course: CSE ->
# High: K.L.N., Medium: Sri Krishna, Low: Anna Univ CEG
# -------------------------------------------------------------
def test_slide_10_prediction_benchmark():
    payload = {
        "cutoff": 185.0,
        "community": "BC",
        "course": "CSE",
        "student_id": "TNEA-TEST-001"
    }
    res = client.post("/predict", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["student_cutoff"] == 185.0
    assert data["community"] == "BC"
    assert data["course"] == "CSE"

    summary = data["summary"]
    assert summary["high_chance_count"] > 0
    assert summary["medium_chance_count"] > 0
    assert summary["low_chance_count"] > 0
    assert summary["model_accuracy"] == "94.5%"

    high_names = [c["college_name"] for c in data["high_chance"]]
    med_names = [c["college_name"] for c in data["medium_chance"]]
    low_names = [c["college_name"] for c in data["low_chance"]]

    # Verify Slide 10 Benchmarks
    assert any("K.L.N" in n for n in high_names), "K.L.N. College should be in High Chance"
    assert any("Sri Krishna" in n for n in med_names), "Sri Krishna College of Tech should be in Medium Chance"
    assert any("Guindy" in n or "CEG" in n for n in low_names), "Anna University CEG should be in Low Chance"


# -------------------------------------------------------------
# 4. Slide 11 College Search & Filter Test Scenario
# District: Chennai, Max Fees: 2,00,000
# -------------------------------------------------------------
def test_slide_11_colleges_search():
    payload = {
        "district": "Chennai",
        "max_fees": 200000
    }
    res = client.post("/colleges/search", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["count"] > 0
    for college in data["colleges"]:
        assert college["district"] == "Chennai"
        assert float(college["tuition_fee_per_year"]) <= 200000


def test_single_college_lookup():
    res = client.get("/colleges/0001")
    assert res.status_code == 200
    college = res.json()
    assert "0001" in college["code"]
    assert "Guindy" in college["name"] or "CEG" in college["short_name"]

    res_404 = client.get("/colleges/999999")
    assert res_404.status_code == 404


# -------------------------------------------------------------
# 5. Slide 13 Side-by-Side Comparison (15+ Parameters)
# -------------------------------------------------------------
def test_slide_13_college_comparison():
    payload = {"college_codes": ["0001", "2006", "5901"]}
    res = client.post("/colleges/compare", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["count"] == 3
    assert data["parameters_compared"] >= 15
    assert len(data["parameters"]) >= 15


# -------------------------------------------------------------
# 6. Slide 11 Rule-Based Scholarship Matcher
# Income: 1,50,000, Community: SC, First Graduate: True
# -------------------------------------------------------------
def test_slide_11_scholarship_matcher():
    payload = {
        "annual_income": 150000,
        "community": "SC",
        "first_graduate": True,
        "govt_school_student": False,
        "gender": "ANY",
        "marks_percentage": 82.0
    }
    res = client.post("/scholarships/match", json=payload)
    assert res.status_code == 200
    data = res.json()
    matched_names = [s["name"] for s in data["matched_scholarships"]]
    assert any("Post Matric" in n for n in matched_names)
    assert any("First Graduate" in n for n in matched_names)


def test_all_scholarships_endpoint():
    res = client.get("/scholarships/all")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 6


# -------------------------------------------------------------
# 7. Slide 7 & 14 ROI Calculator & OLS Trend Forecasting
# -------------------------------------------------------------
def test_roi_calculator():
    payload = {
        "annual_tuition_fee": 140000,
        "annual_hostel_fee": 75000,
        "annual_misc_fee": 15000,
        "avg_placement_package_lpa": 7.5,
        "scholarship_waiver_per_year": 0,
        "course_duration_years": 4
    }
    res = client.post("/roi/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["breakeven_years"] > 0
    assert data["total_4yr_investment"] == (140000 + 75000 + 15000) * 4
    assert data["roi_percentage"] > 0


def test_cutoff_trend_forecasting():
    res = client.get("/cutoff/trend/0001?course=CSE&community=BC")
    assert res.status_code == 200
    data = res.json()
    assert len(data["historical"]) == 6  # 2019 to 2024
    assert len(data["forecast"]) == 2    # 2025 and 2026
    assert data["expected_2025_cutoff"] > 0
    assert data["expected_2026_cutoff"] > 0


# -------------------------------------------------------------
# 8. Slide 9 Authentication Specifications
# -------------------------------------------------------------
def test_auth_slide_9_specs():
    # Invalid password test
    res_inv = client.post("/auth/login", json={"username": "invalid@test.com", "password": "wrong"})
    assert res_inv.status_code == 401
    assert res_inv.json()["detail"] == "Invalid credentials."

    # Valid login test (Demo user Sameer)
    res_login = client.post("/auth/login", json={"username": "sameer@admission.tn.edu", "password": "admin123"})
    assert res_login.status_code == 200
    token_data = res_login.json()
    assert "access_token" in token_data
    assert token_data["user"]["full_name"] == "Sameer Khan"

    # Duplicate registration test
    res_dup = client.post("/auth/register", json={
        "username": "sameer@admission.tn.edu",
        "password": "pass",
        "full_name": "Sameer"
    })
    assert res_dup.status_code == 400
    assert res_dup.json()["detail"] == "Email already exists."


# -------------------------------------------------------------
# 9. Slide 7 & 8 AI Admission Chatbot (NLP Intent Engine)
# -------------------------------------------------------------
def test_chatbot_nlp_engine():
    # Cutoff formula intent
    res1 = client.post("/chatbot/message", json={"message": "What is the cutoff formula?"})
    assert res1.status_code == 200
    assert "Mathematics" in res1.json()["reply"]

    # College specific intent
    res2 = client.post("/chatbot/message", json={"message": "Tell me about Anna University CEG"})
    assert res2.status_code == 200
    assert "Anna University" in res2.json()["reply"]


# -------------------------------------------------------------
# 10. Slide 16 Academic References & 11 Chapters Report
# -------------------------------------------------------------
def test_academic_references_and_report():
    res = client.get("/references")
    assert res.status_code == 200
    data = res.json()
    assert len(data["academic_references"]) == 6
    assert len(data["project_chapters"]) == 11
    team = [m["name"] for m in data["project_metadata"]["team_members"]]
    assert "PATHAN SAMEER KHAN" in team


# -------------------------------------------------------------
# 11. Prediction History & Audit Logs (Slide 16)
# -------------------------------------------------------------
def test_prediction_history():
    # 1. Test predicting as guest candidate
    pred_res = client.post("/predict", json={
        "cutoff": 182.5,
        "community": "BC",
        "course": "CSE",
        "student_id": "TNEA-TEST-VERIFY"
    })
    assert pred_res.status_code == 200

    # 2. Verify it is logged in history
    res = client.get("/predict/history")
    assert res.status_code == 200
    data = res.json()
    assert "history" in data
    assert data["count"] > 0
    # First item should be our recent prediction
    recent = data["history"][0]
    assert recent["student_id"] == "TNEA-TEST-VERIFY"
    assert recent["cutoff"] == 182.5
    assert recent["community"] == "BC"

    # 3. Test seed endpoint
    seed_res = client.post("/predict/history/seed")
    assert seed_res.status_code == 200
    assert seed_res.json()["status"] == "seeded"
    assert seed_res.json()["count"] >= 4

