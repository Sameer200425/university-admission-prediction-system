from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional

from sqlalchemy import Column
from sqlalchemy.types import JSON
from sqlmodel import Field, Session, SQLModel, create_engine, select

from pathlib import Path

from .colleges import load_all_colleges

_BASE_DIR = Path(__file__).resolve().parent.parent
_DEFAULT_DB_PATH = (_BASE_DIR / "data" / "app.db").resolve()
_DEFAULT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)

DATABASE_URL = (
    os.getenv("DATABASE_URL")
    or os.getenv("UAPS_DATABASE_URL")
    or f"sqlite:///{_DEFAULT_DB_PATH.as_posix()}"
)

_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=_connect_args)


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    full_name: Optional[str] = Field(default="Sameer")
    hashed_password: str
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TNCollege(SQLModel, table=True):
    __tablename__ = "tn_colleges"
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(index=True, unique=True)
    name: str
    short_name: str
    district: str
    type: str
    established: int
    nirf_rank: Optional[int] = None
    naac_grade: Optional[str] = None
    tuition_fee_per_year: float
    hostel_fee_per_year: float
    avg_placement_lpa: float
    highest_placement_lpa: float
    placement_pct: float
    courses: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    top_recruiters: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    infrastructure: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    base_cutoff_cse: Dict[str, float] = Field(default_factory=dict, sa_column=Column(JSON))


class PredictionLog(SQLModel, table=True):
    __tablename__ = "prediction_logs"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    student_id: Optional[str] = None
    cutoff: float
    community: str
    course: str
    result_summary: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CommunityPost(SQLModel, table=True):
    __tablename__ = "community_posts"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    author: str
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Iterable[Session]:
    with Session(engine) as session:
        yield session


def seed_tn_colleges(session: Session) -> None:
    existing = session.exec(select(TNCollege)).first()
    if existing:
        return

    colleges = load_all_colleges()
    for c in colleges:
        item = TNCollege(
            code=str(c.get("code")),
            name=c.get("name", ""),
            short_name=c.get("short_name", ""),
            district=c.get("district", ""),
            type=c.get("type", ""),
            established=int(c.get("established", 2000)),
            nirf_rank=c.get("nirf_rank"),
            naac_grade=c.get("naac_grade"),
            tuition_fee_per_year=float(c.get("tuition_fee_per_year", 0)),
            hostel_fee_per_year=float(c.get("hostel_fee_per_year", 0)),
            avg_placement_lpa=float(c.get("avg_placement_lpa", 0)),
            highest_placement_lpa=float(c.get("highest_placement_lpa", 0)),
            placement_pct=float(c.get("placement_pct", 0)),
            courses=c.get("courses", []),
            top_recruiters=c.get("top_recruiters", []),
            infrastructure=c.get("infrastructure", []),
            base_cutoff_cse=c.get("base_cutoff_cse", {})
        )
        session.add(item)
    session.commit()
    print(f"Seeded {len(colleges)} Tamil Nadu colleges into SQLite database.")


def create_prediction_log(
    session: Session,
    *,
    user_id: Optional[int] = None,
    student_id: Optional[str] = None,
    cutoff: float,
    community: str,
    course: str,
    result_summary: Dict[str, Any]
) -> PredictionLog:
    log = PredictionLog(
        user_id=user_id,
        student_id=student_id or "TN-STU-001",
        cutoff=cutoff,
        community=community,
        course=course,
        result_summary=result_summary
    )
    session.add(log)
    session.commit()
    session.refresh(log)
    return log
