from __future__ import annotations

import os
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session, select

from .db import User, get_session

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY") or os.getenv("UAPS_JWT_SECRET_KEY") or "uaps-tnea-secret-key-2025"
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM") or "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES") or "120")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token", auto_error=False)


def hash_password(password: str) -> str:
    """
    Standard SHA-256 password hashing as specified in Chapter 7.6.2 and Presentation Slide 8 & 9.
    """
    salt = "tnea_uaps_salt_"
    return hashlib.sha256((salt + password).encode("utf-8")).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies plain password against SHA-256 hash.
    """
    return hash_password(plain_password) == hashed_password


def authenticate_user(session: Session, username_or_email: str, password: str) -> Optional[User]:
    user = session.exec(select(User).where(User.username == username_or_email)).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        user = session.exec(select(User).where(User.username == username)).first()
        return user
    except Exception:
        return None


def get_current_active_user(current_user: Optional[User] = Depends(get_current_user)) -> User:
    if current_user is None or not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials or session expired"
        )
    return current_user


def ensure_demo_users(session: Session) -> None:
    """Ensure default demo account for Pathan Sameer Khan exists for seamless demonstration"""
    demo_sameer = session.exec(select(User).where(User.username == "sameer@admission.tn.edu")).first()
    if not demo_sameer:
        user = User(
            username="sameer@admission.tn.edu",
            full_name="Sameer Khan",
            hashed_password=hash_password("admin123"),
            is_active=True,
            is_admin=True
        )
        session.add(user)
        session.commit()
