"""
Tamil Nadu Engineering Colleges Catalog, Search & Filtering, and 15+ Parameter Comparison Engine.
Loaded with 125+ verified engineering institutions across Tamil Nadu.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

BASE_DIR = Path(__file__).resolve().parent.parent
COLLEGES_FILE = BASE_DIR / "data" / "raw" / "tn_colleges_80_plus.json"

_COLLEGES_CACHE: List[Dict[str, Any]] = []


def load_all_colleges(force_reload: bool = False) -> List[Dict[str, Any]]:
    global _COLLEGES_CACHE
    if _COLLEGES_CACHE and not force_reload:
        return _COLLEGES_CACHE

    if COLLEGES_FILE.exists():
        with open(COLLEGES_FILE, "r", encoding="utf-8") as f:
            _COLLEGES_CACHE = json.load(f)
            return _COLLEGES_CACHE

    return []


def get_all_districts() -> List[str]:
    colleges = load_all_colleges()
    districts = sorted(list(set(c.get("district", "") for c in colleges if c.get("district"))))
    return districts


def search_and_filter_colleges(
    *,
    district: Optional[str] = None,
    max_fees: Optional[float] = None,
    course: Optional[str] = None,
    college_type: Optional[str] = None,
    query: Optional[str] = None,
    limit: int = 150,
) -> List[Dict[str, Any]]:
    """
    Filter colleges dynamically.
    Matches Presentation Slide 11:
    District: "Chennai" AND Max Fees: "200000" -> Instant updates
    """
    colleges = load_all_colleges()
    filtered = []

    q_clean = (query or "").strip().lower()
    dist_clean = (district or "").strip().lower()
    type_clean = (college_type or "").strip().lower()
    course_clean = (course or "").strip().upper()

    for c in colleges:
        # District filter
        if dist_clean and dist_clean != "all":
            if c.get("district", "").lower() != dist_clean:
                continue

        # Max tuition fees filter
        if max_fees is not None and max_fees > 0:
            if float(c.get("tuition_fee_per_year", 0)) > float(max_fees):
                continue

        # College type filter
        if type_clean and type_clean != "all":
            if type_clean not in c.get("type", "").lower():
                continue

        # Course offered filter
        if course_clean and course_clean != "ALL":
            courses = [co.upper() for co in c.get("courses", [])]
            if course_clean not in courses:
                continue

        # Free text query search
        if q_clean:
            searchable_text = f"{c.get('name', '')} {c.get('short_name', '')} {c.get('code', '')} {c.get('district', '')}".lower()
            if q_clean not in searchable_text:
                continue

        filtered.append(c)

    return filtered[:limit]


def get_college_by_code(code: str) -> Optional[Dict[str, Any]]:
    colleges = load_all_colleges()
    for c in colleges:
        if str(c.get("code")).strip() == str(code).strip():
            return c
    return None


def compare_colleges_15_params(college_codes: List[str]) -> Dict[str, Any]:
    """
    Side-by-side comparison tool comparing colleges on 15+ parameters
    as specified in Presentation Slide 13 and Report Chapter 3.1.4 & 4.2.4.
    """
    colleges = load_all_colleges()
    selected_colleges = []

    for code in college_codes:
        for c in colleges:
            if str(c.get("code")).strip() == str(code).strip():
                # Compute derived parameters
                tuition = float(c.get("tuition_fee_per_year", 0))
                hostel = float(c.get("hostel_fee_per_year", 0))
                total_4yr_cost = (tuition + hostel) * 4
                avg_ctc = float(c.get("avg_placement_lpa", 0))
                
                # ROI score: (Annual CTC in Lakhs * 4 / Total Cost in Lakhs)
                cost_lakhs = total_4yr_cost / 100000.0
                roi_ratio = round((avg_ctc * 4) / max(0.5, cost_lakhs), 2)

                comp_item = {
                    "param_code": c.get("code"),
                    "param_name": c.get("name"),
                    "param_short_name": c.get("short_name"),
                    "param_district": c.get("district"),
                    "param_type": c.get("type"),
                    "param_established": c.get("established"),
                    "param_nirf_rank": c.get("nirf_rank"),
                    "param_naac_grade": c.get("naac_grade"),
                    "param_annual_tuition": f"₹{tuition:,.0f}",
                    "param_annual_hostel": f"₹{hostel:,.0f}",
                    "param_total_4yr_cost": f"₹{total_4yr_cost:,.0f}",
                    "param_avg_placement_lpa": f"₹{avg_ctc} LPA",
                    "param_highest_placement_lpa": f"₹{c.get('highest_placement_lpa', 0)} LPA",
                    "param_placement_rate": f"{c.get('placement_pct', 0)}%",
                    "param_top_recruiters": ", ".join(c.get("top_recruiters", [])[:4]),
                    "param_courses": ", ".join(c.get("courses", [])),
                    "param_campus_acres": f"{c.get('campus_size_acres', 0)} Acres",
                    "param_infrastructure": ", ".join(c.get("infrastructure", [])[:4]),
                    "param_base_cutoffs": c.get("base_cutoff_cse", {}),
                    "param_roi_ratio": f"{roi_ratio}x (4-Yr Return)"
                }
                selected_colleges.append(comp_item)
                break

    parameters_list = [
        {"key": "param_code", "label": "1. TNEA College Code"},
        {"key": "param_name", "label": "2. College Name"},
        {"key": "param_district", "label": "3. District / Location"},
        {"key": "param_type", "label": "4. Institution Type"},
        {"key": "param_established", "label": "5. Year Established"},
        {"key": "param_nirf_rank", "label": "6. NIRF Ranking"},
        {"key": "param_naac_grade", "label": "7. NAAC Accreditation"},
        {"key": "param_annual_tuition", "label": "8. Annual Tuition Fee"},
        {"key": "param_annual_hostel", "label": "9. Annual Hostel Fee"},
        {"key": "param_total_4yr_cost", "label": "10. Total 4-Year Cost (Tuition+Hostel)"},
        {"key": "param_avg_placement_lpa", "label": "11. Average Placement Package (CTC)"},
        {"key": "param_highest_placement_lpa", "label": "12. Highest Placement Package (CTC)"},
        {"key": "param_placement_rate", "label": "13. Placement Percentage"},
        {"key": "param_top_recruiters", "label": "14. Top Recruiters"},
        {"key": "param_courses", "label": "15. Key Courses Offered"},
        {"key": "param_campus_acres", "label": "16. Campus Size"},
        {"key": "param_infrastructure", "label": "17. Key Infrastructure Facilities"},
        {"key": "param_roi_ratio", "label": "18. Return on Investment (ROI) Multiplier"}
    ]

    return {
        "colleges": selected_colleges,
        "parameters": parameters_list,
        "parameters_compared": len(parameters_list),
        "count": len(selected_colleges)
    }
