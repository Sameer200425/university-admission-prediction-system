"""
Root workspace proxy for app.main.
Ensures uvicorn app.main:app works seamlessly from the repository root
as well as with --app-dir backend.
"""

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Import the actual FastAPI instance
from backend.app.main import app
