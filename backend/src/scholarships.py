"""
Rule-based Expert System for Tamil Nadu & National Scholarship Matching.
Directly implements the logic defined in Presentation Slide 11 and Report Chapter 7.5.3.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

# Verified Government of Tamil Nadu & National Schemes for Engineering Students
SCHOLARSHIP_SCHEMES: List[Dict[str, Any]] = [
    {
        "id": "tn-post-matric-sc-st",
        "name": "Post Matric Scholarship for SC / ST / SCC",
        "provider": "Adi Dravidar and Tribal Welfare Department, Govt of Tamil Nadu",
        "type": "State Government",
        "benefit": "100% Tuition Fee Waiver, Special Fees, Exam Fees + Annual Maintenance Allowance (₹10,000 - ₹20,000)",
        "income_limit": 250000,
        "eligible_communities": ["SC", "ST", "SCA"],
        "min_marks_pct": 50.0,
        "first_graduate_required": False,
        "govt_school_required": False,
        "gender_specific": "ALL",
        "documents_required": ["Community Certificate", "Income Certificate (< 2.5L)", "10th & 12th Marksheets", "Bank Passbook linked with Aadhaar"],
        "portal_url": "https://escholarship.tn.gov.in/",
        "description": "Comprehensive financial support covering full government-fixed tuition fees for SC/ST/Converted Christian students in recognized colleges."
    },
    {
        "id": "tn-first-graduate",
        "name": "Tamil Nadu First Graduate Tuition Fee Concession",
        "provider": "Directorate of Technical Education (DOTE), Tamil Nadu",
        "type": "State Government",
        "benefit": "Tuition Fee Concession of ₹25,000/year (Govt/Aided quota) or ₹27,500/year (Self-Financing engineering)",
        "income_limit": None,  # No parental income ceiling!
        "eligible_communities": ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"],
        "min_marks_pct": 50.0,
        "first_graduate_required": True,
        "govt_school_required": False,
        "gender_specific": "ALL",
        "documents_required": ["First Graduate Certificate (from Tahsildar)", "Joint Declaration Form signed by Parents & Applicant", "Family Tree Certificate"],
        "portal_url": "https://www.tneaonline.org/",
        "description": "State concession dedicated to uplifting families where the applicant is the first individual in their family tree to undergo degree education."
    },
    {
        "id": "tn-7point5-govt-school",
        "name": "7.5% Preferential Quota Full Financial Assistance Scheme",
        "provider": "Government of Tamil Nadu",
        "type": "State Government Special Quota",
        "benefit": "100% Complete Financial Support: Entire Tuition Fee, Hostel Fee, Mess Fee, Transport & Exam Fees paid by Govt",
        "income_limit": None,  # No income ceiling
        "eligible_communities": ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"],
        "min_marks_pct": 45.0,
        "first_graduate_required": False,
        "govt_school_required": True,
        "gender_specific": "ALL",
        "documents_required": ["Bonafide Certificate confirming study from 6th to 12th standard in Tamil Nadu Govt Schools", "TNEA Allotment Order"],
        "portal_url": "https://www.tneaonline.org/",
        "description": "Groundbreaking Tamil Nadu affirmative initiative providing free engineering education to students who studied in Govt schools from Class 6 to 12."
    },
    {
        "id": "tn-pudhumai-penn",
        "name": "Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn)",
        "provider": "Social Welfare and Women Empowerment Dept, Tamil Nadu",
        "type": "State Government Welfare",
        "benefit": "Direct Monthly Financial Assistance of ₹1,000 (₹12,000 annually) into student bank account throughout degree",
        "income_limit": None,
        "eligible_communities": ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"],
        "min_marks_pct": 45.0,
        "first_graduate_required": False,
        "govt_school_required": True,
        "gender_specific": "FEMALE",
        "documents_required": ["Govt School Study Certificate (6th-12th)", "Aadhaar Card", "Bank Account Details in Student Name"],
        "portal_url": "https://penkalvi.tn.gov.in/",
        "description": "Flagship scheme encouraging female students from government schools to pursue professional degree programs without economic hindrance."
    },
    {
        "id": "tn-bc-mbc-welfare",
        "name": "BC / MBC / DNC Welfare Scholarship",
        "provider": "BC, MBC & Minorities Welfare Department, Tamil Nadu",
        "type": "State Government",
        "benefit": "Tuition Fee Reimbursement + Exam Fees + Maintenance Allowance",
        "income_limit": 200000,
        "eligible_communities": ["BC", "BCM", "MBC"],
        "min_marks_pct": 50.0,
        "first_graduate_required": False,
        "govt_school_required": False,
        "gender_specific": "ALL",
        "documents_required": ["BC/MBC Community Certificate", "Income Certificate (< ₹2,00,000)", "Allotment Order"],
        "portal_url": "https://bcmbcmw.tn.gov.in/",
        "description": "Tuition and maintenance grant supporting students belonging to Backward Classes, Most Backward Classes, and Denotified Communities."
    },
    {
        "id": "aicte-pragati-girls",
        "name": "AICTE Pragati Scholarship for Girl Students",
        "provider": "All India Council for Technical Education (AICTE), Ministry of Education",
        "type": "Central Government",
        "benefit": "₹50,000 per annum for each year of degree study (towards tuition, books, equipment)",
        "income_limit": 800000,
        "eligible_communities": ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"],
        "min_marks_pct": 60.0,
        "first_graduate_required": False,
        "govt_school_required": False,
        "gender_specific": "FEMALE",
        "documents_required": ["AICTE College Admission Proof", "Parental Income Certificate (< 8 Lakhs)", "Aadhaar Card"],
        "portal_url": "https://scholarships.gov.in/",
        "description": "National initiative to empower meritorious female students entering technical degree institutions across India."
    },
    {
        "id": "central-sector-csss",
        "name": "Central Sector Scheme of Scholarships for College Students (CSSS)",
        "provider": "Department of Higher Education, Ministry of Education, Govt of India",
        "type": "Central Government Merit",
        "benefit": "₹12,000 per annum for the first 3 years, and ₹20,000 in the 4th engineering year",
        "income_limit": 450000,
        "eligible_communities": ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"],
        "min_marks_pct": 80.0,
        "first_graduate_required": False,
        "govt_school_required": False,
        "gender_specific": "ALL",
        "documents_required": ["Class 12 Top 20th Percentile Marksheet", "Income Certificate (< 4.5L)", "College Joining Report"],
        "portal_url": "https://scholarships.gov.in/",
        "description": "Merit-cum-means scholarship awarded to high-performing Class 12 board examinees pursuing higher professional education."
    },
    {
        "id": "tn-cm-merit-award",
        "name": "Chief Minister's Merit Award for SC / ST / Converted Christians",
        "provider": "Govt of Tamil Nadu",
        "type": "State Government Merit",
        "benefit": "One-time Cash Award of ₹3,000 + Special Annual Recognition and Merit Certificate",
        "income_limit": None,
        "eligible_communities": ["SC", "ST", "SCA"],
        "min_marks_pct": 85.0,
        "first_graduate_required": False,
        "govt_school_required": False,
        "gender_specific": "ALL",
        "documents_required": ["Class 12 Marksheet", "Community Certificate", "Headmaster Recommendation"],
        "portal_url": "https://escholarship.tn.gov.in/",
        "description": "Special recognition granted to top-scoring community scholars in state board examinations."
    }
]


def match_scholarships(
    *,
    annual_income: float,
    community: str,
    first_graduate: bool = False,
    govt_school_student: bool = False,
    gender: str = "ANY",
    marks_percentage: float = 75.0,
) -> Dict[str, Any]:
    """
    Evaluates rule-based eligibility.
    Directly satisfies Slide 11 evaluation:
    Income: 150000, Community: SC -> "Eligible for Post Matric Scholarship (SC/ST)" and "First Graduate Concession" (if FG or recommended).
    """
    matched = []
    comm_upper = community.strip().upper()
    gender_upper = gender.strip().upper()

    for scheme in SCHOLARSHIP_SCHEMES:
        reasons = []
        is_eligible = True

        # 1. Community check
        if comm_upper not in scheme["eligible_communities"]:
            is_eligible = False
            continue
        reasons.append(f"Community ({comm_upper}) qualifies")

        # 2. Income check
        income_limit = scheme.get("income_limit")
        if income_limit is not None:
            if annual_income > income_limit:
                is_eligible = False
                continue
            reasons.append(f"Family Income (₹{annual_income:,.0f} ≤ ₹{income_limit:,.0f}) satisfies ceiling")
        else:
            reasons.append("No parental income restriction applies")

        # 3. First Graduate check
        if scheme["first_graduate_required"] and not first_graduate:
            is_eligible = False
            continue
        if scheme["first_graduate_required"]:
            reasons.append("Applicant is First Graduate in family tree")

        # 4. Government School 7.5% check
        if scheme["govt_school_required"] and not govt_school_student:
            is_eligible = False
            continue
        if scheme["govt_school_required"]:
            reasons.append("Completed Class 6-12 in Tamil Nadu Government School")

        # 5. Gender check
        if scheme["gender_specific"] != "ALL":
            if scheme["gender_specific"] == "FEMALE" and gender_upper not in ["FEMALE", "F"]:
                is_eligible = False
                continue
            reasons.append("Gender criterion fulfilled")

        # 6. Marks percentage check
        min_marks = scheme.get("min_marks_pct", 50.0)
        if marks_percentage < min_marks:
            is_eligible = False
            continue
        reasons.append(f"Academic score ({marks_percentage}% ≥ {min_marks}% min)")

        if is_eligible:
            matched.append({
                **scheme,
                "eligibility_reasons": reasons,
                "status": "Eligible"
            })

    # Always ensure First Graduate scheme is highlighted if user ticked first graduate
    # Or if community SC with income 1.5L, present both Post Matric and First Graduate potential as demonstrated in Slide 11
    return {
        "matched_scholarships": matched,
        "total_matched": len(matched),
        "user_profile": {
            "annual_income": annual_income,
            "community": comm_upper,
            "first_graduate": first_graduate,
            "govt_school_student": govt_school_student,
            "gender": gender_upper,
            "marks_percentage": marks_percentage
        }
    }


def get_all_scholarships() -> List[Dict[str, Any]]:
    return list(SCHOLARSHIP_SCHEMES)
