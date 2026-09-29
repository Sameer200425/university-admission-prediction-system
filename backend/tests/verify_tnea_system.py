import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

import requests
import json

BASE = "http://127.0.0.1:8000"

# Check if live server is running, otherwise use FastAPI TestClient
_live_available = False
try:
    _res = requests.get(f"{BASE}/health", timeout=1.0)
    if _res.status_code == 200:
        _live_available = True
except Exception:
    _live_available = False

if not _live_available:
    from fastapi.testclient import TestClient
    from app.main import app
    http_client = TestClient(app)
    print("Live server not detected. Running comprehensive verification via in-memory TestClient.\n")
else:
    class LiveHttpClient:
        def get(self, url, **kwargs):
            return requests.get(f"{BASE}{url}", **kwargs)
        def post(self, url, **kwargs):
            return requests.post(f"{BASE}{url}", **kwargs)
    http_client = LiveHttpClient()
    print("Connected to live server at http://127.0.0.1:8000.\n")

def test_all():
    # 1. Health
    r = http_client.get("/health")
    print("=== 1. HEALTH CHECK ===")
    print(r.status_code, r.json())
    assert r.status_code == 200

    # 2. Auth - Slide 9
    print("\n=== 2. AUTHENTICATION (SLIDE 9) ===")
    r_inv = http_client.post("/auth/login", json={"username": "nonexistent@test.com", "password": "wrong"})
    print("Invalid Login:", r_inv.status_code, r_inv.json())
    assert r_inv.json()["detail"] == "Invalid credentials."

    r_login = http_client.post("/auth/login", json={"username": "sameer@admission.tn.edu", "password": "admin123"})
    print("Valid Login:", r_login.status_code, r_login.json()["user"])
    assert r_login.json()["user"]["full_name"] == "Sameer Khan"

    r_dup = http_client.post("/auth/register", json={"username": "sameer@admission.tn.edu", "password": "pwd", "full_name": "Sameer"})
    print("Duplicate Register:", r_dup.status_code, r_dup.json())
    assert r_dup.json()["detail"] == "Email already exists."

    # 3. Predict Admission - Slide 10
    print("\n=== 3. ADMISSION PREDICTION (SLIDE 10: Cutoff 185, BC, CSE) ===")
    r_pred = http_client.post("/predict", json={"cutoff": 185.0, "community": "BC", "course": "CSE"})
    pred_data = r_pred.json()
    print("Summary:", pred_data["summary"])
    high_names = [c["college_name"] for c in pred_data["high_chance"]]
    med_names = [c["college_name"] for c in pred_data["medium_chance"]]
    low_names = [c["college_name"] for c in pred_data["low_chance"]]

    print("High Chance sample:", high_names[:3])
    print("Medium Chance sample:", med_names[:3])
    print("Low Chance sample:", low_names[:3])

    kln_in_high = any("K.L.N" in n for n in high_names)
    skct_in_med = any("Sri Krishna" in n for n in med_names)
    ceg_in_low = any("Guindy" in n or "CEG" in n for n in low_names)
    print(f"Slide 10 Matches -> K.L.N in High: {kln_in_high}, SKCT in Med: {skct_in_med}, CEG in Low: {ceg_in_low}")
    assert kln_in_high, "K.L.N. College should be in High Chance"
    assert skct_in_med, "Sri Krishna College of Tech should be in Medium Chance"
    assert ceg_in_low, "Anna University CEG should be in Low Chance"

    # 4. Search Colleges - Slide 11 (District Chennai, Max Fees 200000)
    print("\n=== 4. SEARCH COLLEGES (SLIDE 11: Chennai, Max Fees 200000) ===")
    r_search = http_client.post("/colleges/search", json={"district": "Chennai", "max_fees": 200000})
    search_data = r_search.json()
    print(f"Found {search_data['count']} colleges in Chennai with fees <= 2 Lakhs.")
    assert search_data["count"] > 0
    for c in search_data["colleges"][:3]:
        print(f"  - {c['name']} | Fee: Rs.{c['tuition_fee_per_year']} | Dist: {c['district']}")

    # 5. Scholarship Matcher - Slide 11 (Income 150000, Community SC)
    print("\n=== 5. SCHOLARSHIP MATCHER (SLIDE 11: Income 1.5L, SC) ===")
    r_sch = http_client.post("/scholarships/match", json={"annual_income": 150000, "community": "SC", "first_graduate": True})
    sch_data = r_sch.json()
    matched_names = [s["name"] for s in sch_data["matched_scholarships"]]
    print("Matched Schemes:", matched_names)
    assert any("Post Matric" in n for n in matched_names), "Expected Post Matric Scholarship (SC/ST)"
    assert any("First Graduate" in n for n in matched_names), "Expected First Graduate Concession"

    # 6. ROI Calculator - Slide 7
    print("\n=== 6. ROI CALCULATOR ===")
    r_roi = http_client.post("/roi/calculate", json={"annual_tuition_fee": 140000, "annual_hostel_fee": 75000, "avg_placement_package_lpa": 7.5})
    roi_data = r_roi.json()
    inv_str = roi_data['total_4yr_investment_formatted'].replace("₹", "Rs.")
    print(f"Investment: {inv_str} | Breakeven: {roi_data['breakeven_years']} yrs | ROI: {roi_data['roi_percentage']}%")
    assert roi_data["breakeven_years"] > 0

    # 7. AI Chatbot
    print("\n=== 7. AI CHATBOT ===")
    r_chat = http_client.post("/chatbot/message", json={"message": "What is the cutoff for Anna University CEG?"})
    print("Chatbot Response Preview:", r_chat.json()["reply"][:140].replace("\n", " "))
    assert "Anna University" in r_chat.json()["reply"]

    # 8. References - Slide 16 & Team
    print("\n=== 8. ACADEMIC REFERENCES (SLIDE 16) ===")
    r_ref = http_client.get("/references")
    ref_data = r_ref.json()
    team = [m["name"] for m in ref_data["project_metadata"]["team_members"]]
    guide = ref_data["project_metadata"]["guide"]["name"]
    citations = ref_data["academic_references"]
    print(f"Team: {team}")
    print(f"Guide: {guide}")
    print(f"Citations count: {len(citations)}")
    assert "PATHAN SAMEER KHAN" in team
    assert "DR. THILAGAVATH, PH.D" in guide
    assert len(citations) == 6

    print("\n==========================================================")
    print("ALL 8 VERIFICATION SUITES PASSED STRICTLY & COMPREHENSIVELY!")
    print("==========================================================")

if __name__ == "__main__":
    test_all()
