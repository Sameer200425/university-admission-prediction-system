"""
NLP and Data-Driven AI Admission Advisor for Tamil Nadu Engineering Admissions (TNEA).
Features dynamic real-time catalog lookup across 125+ verified colleges, multi-intent classification,
counseling rules, quota evaluation, and scholarship matching.
"""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional
from .colleges import load_all_colleges, get_all_districts


# ----------------------------------------------------------------------
# 1. Comprehensive Domain Knowledge Intents
# ----------------------------------------------------------------------
STATIC_INTENTS: List[Dict[str, Any]] = [
    {
        "intent": "cutoff_calculation",
        "keywords": [
            "calculate cutoff", "cutoff formula", "how to calculate", "pcm marks",
            "tnea formula", "calculate mark", "cutoff score", "marks formula",
            "calculate my cutoff", "engineering cutoff", "aggregate marks"
        ],
        "response": (
            "### 🧮 Official TNEA Cutoff Calculation Formula (Max: 200)\n\n"
            "The Directorate of Technical Education (DoTE), Tamil Nadu calculates engineering aggregate cutoff out of **200 marks** from Class 12 board marks:\n\n"
            "$$\\text{Cutoff} = \\text{Mathematics (100)} + \\frac{\\text{Physics (100)}}{2} + \\frac{\\text{Chemistry (100)}}{2}$$\n\n"
            "**Key Breakdown**:\n"
            "• **Mathematics**: 100 Marks (100% weightage)\n"
            "• **Physics**: 50 Marks (converted from 100 by dividing by 2)\n"
            "• **Chemistry**: 50 Marks (converted from 100 by dividing by 2)\n\n"
            "**Example Calculation**:\n"
            "If your Class 12 scores are **Maths: 94**, **Physics: 88**, **Chemistry: 92**:\n"
            "$$\\text{Cutoff} = 94 + \\frac{88}{2} + \\frac{92}{2} = 94 + 44 + 46 = \\mathbf{184.00}$$\n\n"
            "💡 *Tip*: You can click the **Cutoff Calculator** in the top navigation bar to test various PCM combinations instantly!"
        ),
        "suggestions": [
            "What colleges can I get for 185 cutoff?",
            "Anna University CEG cutoff for BC",
            "Tell me about 7.5% Govt school quota"
        ]
    },
    {
        "intent": "counseling_procedure",
        "keywords": [
            "counseling procedure", "counseling process", "how counseling works",
            "counseling steps", "single window counseling", "tnea steps",
            "admission process", "counseling stages", "how to apply"
        ],
        "response": (
            "### 🏛️ TNEA Single-Window Counseling Process Overview\n\n"
            "The Tamil Nadu Engineering Admissions (TNEA) single-window counseling is conducted fully online in systematic phases:\n\n"
            "1. **Online Registration**: Uploading personal details, community, academic marks, and quota preferences.\n"
            "2. **Certificate Verification**: Online or in-person verification at designated TNEA Facilitation Centres (TFCs).\n"
            "3. **Rank List Publication**: Overall Rank, Community Rank, and 7.5% Special Quota Rank released.\n"
            "4. **Counseling Rounds (Rounds 1 to 4)**: Categorized into cutoff brackets.\n"
            "5. **Choice Filling (3 Days)**: Adding colleges and branches in strict priority order.\n"
            "6. **Tentative Allotment & Confirmation**: Options: *Accept & Join*, *Accept with Upward Movement*, *Decline & Exit*.\n"
            "7. **Provisional Allotment Order**: Download order and report to allotted college with original certificates."
        ),
        "suggestions": [
            "What is Upward Movement in counseling?",
            "Mandatory documents for counseling",
            "What are the counseling round cutoffs?"
        ]
    },
    {
        "intent": "upward_movement",
        "keywords": [
            "upward movement", "what is upward", "accept and upward",
            "tentative allotment", "seat allotment options", "slide"
        ],
        "response": (
            "### 🔄 TNEA Upward Movement Strategy\n\n"
            "When you receive a tentative allotment in your counseling round, you have critical choices:\n\n"
            "• **Accept & Join**: You are fully satisfied with your allotted college & branch. Your seat is confirmed.\n"
            "• **Accept & Upward**: You retain your currently allotted seat as a guaranteed safety net, but if a higher-priority choice from your choice list becomes vacant in the next iteration, you will automatically be promoted to that higher choice.\n"
            "• **Decline & Upward**: You forfeit the allotted seat entirely and wait to see if any higher choice becomes available.\n"
            "• **Decline & Exit**: You quit the single-window counseling.\n\n"
            "⭐ **Advisory**: Choosing **Accept & Upward** is the safest and most effective option for ambitious candidates!"
        ),
        "suggestions": [
            "Choice filling strategy tips",
            "Documents needed for TFC verification",
            "Compare CEG vs SSN"
        ]
    },
    {
        "intent": "counseling_rounds",
        "keywords": [
            "counseling rounds", "round 1 cutoff", "round 2 cutoff",
            "round 3 cutoff", "round 4 cutoff", "rounds schedule", "counseling phases"
        ],
        "response": (
            "### 📅 TNEA Counseling Round Structure (Typical Cutoff Brackets)\n\n"
            "Counseling is conducted in 4 sequential rounds based on aggregate marks:\n\n"
            "• **Round 1 (Cutoff ~200 to 180)**: Top tier candidates; Anna University CEG, MIT, PSG Tech, SSN, CIT seats are primarily filled.\n"
            "• **Round 2 (Cutoff ~179.9 to 160)**: Premier autonomous and reputed aided institutions (Kumaraguru, Sri Krishna, TCE, REC, SVCE).\n"
            "• **Round 3 (Cutoff ~159.9 to 135)**: Established regional colleges, university constituent campuses, and self-financing engineering colleges.\n"
            "• **Round 4 (Cutoff ~134.9 to 77.5)**: Open allocation for remaining vacancies across state-wide colleges.\n"
            "• **Supplementary Counseling**: Held for vacancies remaining after Round 4 and SCA to SC conversion."
        ),
        "suggestions": [
            "Admission chances for 182 cutoff",
            "Colleges in Coimbatore",
            "First graduate concession rules"
        ]
    },
    {
        "intent": "mandatory_documents",
        "keywords": [
            "documents required", "certificates needed", "verification certificates",
            "tfc documents", "mandatory certificates", "documents list", "what documents"
        ],
        "response": (
            "### 📋 Mandatory Certificates for TNEA Verification\n\n"
            "Keep original certificates and 3 sets of self-attested copies ready for TFC verification:\n\n"
            "1. **Class 10 Marksheet** (Permanent proof of Date of Birth)\n"
            "2. **Class 12 (+2) Marksheet** / Official Web Provisional Marksheet\n"
            "3. **Transfer Certificate (TC)** issued by the last attended school\n"
            "4. **Permanent Community Certificate Card** (for BC, BCM, MBC/DNC, SC, SCA, ST applicants)\n"
            "5. **Nativity Certificate** (Mandatory only if Class 8 to 12 studied outside Tamil Nadu)\n"
            "6. **First Graduate Certificate & Joint Declaration** (Signed by parent and applicant for fee concession)\n"
            "7. **7.5% Government School Bonafide Certificate** (Counter-signed by Headmaster & Chief Educational Officer)\n"
            "8. **Income Certificate** (Issued by Tahsildar for SC/ST Post-Matric scholarship eligibility)"
        ),
        "suggestions": [
            "How to get First Graduate certificate?",
            "7.5% Govt School reservation details",
            "TNEA Cutoff Formula"
        ]
    },
    {
        "intent": "community_reservation",
        "keywords": [
            "community quota", "reservation percentage", "reservation policy",
            "quota percentage", "bc quota", "mbc quota", "sc quota", "reservation rules"
        ],
        "response": (
            "### ⚖️ Tamil Nadu 69% Community Reservation Quota Breakdown\n\n"
            "Tamil Nadu operates an inclusive 69% reservation policy across all engineering counseling seats:\n\n"
            "| Quota Category | Reservation % | Description |\n"
            "| :--- | :--- | :--- |\n"
            "| **OC (Open Competition)** | **31.0%** | Open to all candidates strictly by merit |\n"
            "| **BC (Backward Classes)** | **26.5%** | Non-Muslim Backward Classes |\n"
            "| **BCM (BC Muslims)** | **3.5%** | Backward Class Muslim Community |\n"
            "| **MBC / DNC** | **20.0%** | Most Backward Classes & Denotified Communities |\n"
            "| **SC (Scheduled Castes)** | **15.0%** | Scheduled Castes General |\n"
            "| **SCA (SC Arunthathiyar)**| **3.0%** | Preferential reservation within SC quota |\n"
            "| **ST (Scheduled Tribes)** | **1.0%** | Scheduled Tribes |\n\n"
            "⭐ *Note*: In addition, **7.5% horizontal preferential reservation** is applied across all categories for TN Government school students."
        ),
        "suggestions": [
            "7.5% Government School reservation",
            "Post Matric scholarship for SC/ST",
            "Calculate my cutoff"
        ]
    },
    {
        "intent": "govt_school_75_quota",
        "keywords": [
            "7.5", "7.5%", "7.5 quota", "government school quota", "govt school reservation",
            "7.5 reservation", "pudhumai penn", "free education"
        ],
        "response": (
            "### 🎒 Tamil Nadu 7.5% Preferential Quota & Full Fee Waiver\n\n"
            "The Government of Tamil Nadu provides preferential admission and complete financial aid for government school pupils:\n\n"
            "• **Eligibility Criteria**: Must have studied continuously from **Class 6 to Class 12 in Tamil Nadu Government Schools**.\n"
            "• **100% Full Financial Coverage**: The state government bears **100% of Tuition fees, Hostel charges, Mess expenses, Transportation, and Counseling fees** for the entire 4 years!\n"
            "• **Applicable Colleges**: Anna University campuses, Government colleges, Government-Aided colleges, and all Self-Financing colleges.\n"
            "• **Pudhumai Penn Scheme**: Female students from government schools receive **₹1,000/month** credited directly to their bank accounts throughout their 4-year undergraduate degree."
        ),
        "suggestions": [
            "What documents are needed for 7.5% quota?",
            "First Graduate Tuition Concession",
            "Open Scholarship Matcher"
        ]
    },
    {
        "intent": "first_graduate_scheme",
        "keywords": [
            "first graduate", "fg fee", "first graduate concession",
            "fg discount", "fg certificate", "first graduate eligibility"
        ],
        "response": (
            "### 🎓 First Graduate (FG) Tuition Fee Concession\n\n"
            "Implemented by the Directorate of Technical Education (DoTE), Tamil Nadu:\n\n"
            "• **Financial Benefit**:\n"
            "  - **₹25,000 / year** direct tuition reduction in Government & Government-Aided engineering colleges.\n"
            "  - **₹27,500 / year** direct tuition reduction in Self-Financing engineering colleges.\n"
            "  - Total 4-Year Savings: **₹1,00,000 to ₹1,10,000**!\n"
            "• **Income Ceiling**: **NO parental income limit**! Eligibility is based solely on family educational background.\n"
            "• **Eligibility Rule**: No siblings or parents in the applicant's immediate family must have earned a degree.\n"
            "• **How to Claim**: Submit the First Graduate Certificate issued via the Revenue Department e-Seva portal."
        ),
        "suggestions": [
            "Check Post-Matric SC/ST Scholarship",
            "ROI Calculator for engineering",
            "Compare Colleges"
        ]
    },
    {
        "intent": "post_matric_scholarship",
        "keywords": [
            "post matric", "sc st scholarship", "adi dravidar", "scc scholarship",
            "tribal welfare scholarship", "sc scholarship income limit"
        ],
        "response": (
            "### 📜 Post-Matric Scholarship Scheme (SC / ST / SCC)\n\n"
            "Administered by the Adi Dravidar and Tribal Welfare Department, Government of Tamil Nadu:\n\n"
            "• **Target Groups**: Scheduled Castes (SC), Scheduled Tribes (ST), and Scheduled Castes Converted Christians (SCC).\n"
            "• **Income Ceiling**: Annual parental income must be **below ₹2,50,000**.\n"
            "• **Core Financial Aid**:\n"
            "  - **100% Non-Refundable Tuition Fee Waiver** as fixed by the State Fee Regulatory Committee.\n"
            "  - **Maintenance Allowance**: ₹10,000 to ₹20,000/year for hostellers and day scholars.\n"
            "• **Application Portal**: State e-Scholarship Portal (*https://escholarship.tn.gov.in*)."
        ),
        "suggestions": [
            "BC / MBC Welfare Scholarship",
            "AICTE Pragati Scholarship for Girls",
            "Open Scholarship Matcher"
        ]
    },
    {
        "intent": "branch_comparison",
        "keywords": [
            "cse vs it", "cse vs aids", "which branch is best", "ece vs cse",
            "engineering branches", "branch selection", "mechanical vs ece",
            "best branch for placements", "ai and ds vs cse"
        ],
        "response": (
            "### 💻 Engineering Branch Comparison & Placement Outlook\n\n"
            "Choosing the right branch depends on career goals and emerging technological demand:\n\n"
            "1. **Computer Science & Engineering (CSE)**: Deep focus on algorithms, systems, compilers, cloud architectures, and software engineering. Highest volume of on-campus offers.\n"
            "2. **Information Technology (IT)**: Curriculum overlaps ~85% with CSE, focusing on enterprise software, network security, and database systems. Software placement recruiters treat CSE & IT almost identically.\n"
            "3. **Artificial Intelligence & Data Science (AI&DS)**: Specialized in machine learning, neural networks, statistical modeling, and big data pipelines. Rapidly growing demand.\n"
            "4. **Electronics & Communication (ECE)**: Versatile hybrid branch. Eligible for VLSI / semiconductor hardware giants (Qualcomm, Intel, TI) as well as IT product firms.\n"
            "5. **Electrical & Electronics (EEE)**: Strong in electric vehicles (EV), power grids, renewable energy, and robotics automation.\n"
            "6. **Mechanical & Civil**: Foundational core disciplines; high demand in automotive manufacturing, aeronautics, infrastructure, and public sector (PSU) roles."
        ),
        "suggestions": [
            "Compare top CSE colleges in Chennai",
            "Highest placement packages in TN",
            "Calculate my cutoff"
        ]
    },
    {
        "intent": "fee_structure_overview",
        "keywords": [
            "fee structure", "college fees", "tuition fee", "hostel fee",
            "how much fee", "engineering cost", "government college fee"
        ],
        "response": (
            "### 💳 Tamil Nadu Engineering College Fee Structure Guidelines\n\n"
            "Fees across colleges are regulated by the Government of Tamil Nadu Fee Regulatory Committee:\n\n"
            "• **Anna University Campuses (CEG, MIT, ACT, SAP)**: ~₹35,000 to ₹55,000 per year.\n"
            "• **Government & Govt-Aided Colleges (GCT, CIT Coimbatore, TCE)**: ~₹25,000 to ₹45,000 per year.\n"
            "• **Self-Financing Colleges (Non-Accredited Courses)**: ~₹85,000 / year (Government single-window quota).\n"
            "• **Self-Financing Colleges (Accredited Courses - NBA/NAAC)**: ~₹1,10,000 to ₹1,50,000 / year.\n"
            "• **Hostel & Mess Charges**: Approx ₹45,000 to ₹95,000 / year depending on AC/non-AC and institutional facilities.\n\n"
            "💡 *Tip*: Check out our **ROI Calculator** to calculate exact 4-year investment versus expected starting CTC!"
        ),
        "suggestions": [
            "Open ROI Calculator",
            "Colleges with fees under 1 Lakh",
            "First Graduate Concession details"
        ]
    },
    {
        "intent": "choice_filling_tips",
        "keywords": [
            "choice filling tips", "how to fill choices", "choice order",
            "choice filling strategy", "counseling choices", "how many choices"
        ],
        "response": (
            "### 🎯 Strategic 3-Tier Choice Filling Methodology\n\n"
            "To maximize your admission chance without risking seat loss, structure your choices in 3 tiers:\n\n"
            "1. **Tier 1 — Ambitious / Dream Choices (Top 20–30%)**:\n"
            "   Colleges whose historical closing cutoff is 2 to 5 marks above your score. (e.g. CEG, MIT, PSG Tech). There is no penalty for ambitious entries!\n"
            "2. **Tier 2 — Realistic / Target Choices (Middle 50%)**:\n"
            "   Institutions whose closing cutoff closely matches your score within $\\pm 1.5$ marks. You have a solid chance here.\n"
            "3. **Tier 3 — Guaranteed Safety Choices (Bottom 20–30%)**:\n"
            "   Reputed colleges where historical cutoffs are 4 to 8 marks below your score to guarantee you never exit the round empty-handed.\n\n"
            "⚠️ **Crucial Rule**: Fill at least 40 to 80 choices. System evaluates from Choice #1 downwards and locks the first available vacancy!"
        ),
        "suggestions": [
            "Run Admission Predictor",
            "Compare top 3 choices",
            "Cutoff trends for CEG"
        ]
    }
]


# ----------------------------------------------------------------------
# 2. Dynamic College Catalog Search & Profiler
# ----------------------------------------------------------------------
def search_college_in_catalog(query_text: str) -> Optional[Dict[str, Any]]:
    """
    Scans the 125+ college database for college names, acronyms, or codes.
    """
    colleges = load_all_colleges()
    q = query_text.lower().strip()

    # Direct 4-digit code check
    code_match = re.search(r"\b([0-9]{4})\b", q)
    if code_match:
        target_code = code_match.group(1)
        for c in colleges:
            if str(c.get("code")).strip() == target_code:
                return c

    # Common acronyms & alias mappings
    aliases = {
        "ceg": "0001",
        "guindy": "0001",
        "anna univ": "0001",
        "anna university": "0001",
        "mit": "0004",
        "chromepet": "0004",
        "act": "0002",
        "ssn": "1315",
        "psg": "2006",
        "psg tech": "2006",
        "psg itech": "2377",
        "cit coimbatore": "2007",
        "cit chennai": "1112",
        "gct": "2005",
        "tce": "5008",
        "thiagarajar": "5008",
        "kln": "5901",
        "skcet": "2712",
        "skct": "2718",
        "sri krishna": "2718",
        "kct": "2712",
        "kumaraguru": "2712",
        "rec": "1211",
        "rajalakshmi": "1211",
        "svce": "1219",
        "venkateswara": "1219",
        "st joseph": "1317",
        "rmk": "1113",
        "rmd": "1114",
        "loyola": "1153",
        "licet": "1153",
        "bannari": "2702",
        "bits": "2702",
        "kongu": "2711",
        "mepco": "4960",
        "sona": "2618",
        "gce salem": "2004",
        "velammal": "1120",
    }

    for alias, code in aliases.items():
        if re.search(rf"\b{re.escape(alias)}\b", q):
            for c in colleges:
                if str(c.get("code")).strip() == code:
                    return c

    # Substring search in name / short_name
    for c in colleges:
        name = c.get("name", "").lower()
        short_name = c.get("short_name", "").lower()
        if len(q) >= 4 and (q in name or q in short_name):
            return c

    return None


def format_college_response(c: Dict[str, Any]) -> Dict[str, Any]:
    """Generates rich markdown profile for matched college."""
    code = c.get("code", "N/A")
    name = c.get("name", "Unknown College")
    district = c.get("district", "Tamil Nadu")
    college_type = c.get("type", "Autonomous / Affiliated")
    nirf = c.get("nirf_rank") or "Not Ranked in Top 100"
    naac = c.get("naac_grade") or "N/A"
    tuition = c.get("tuition_fee_per_year", 0)
    hostel = c.get("hostel_fee_per_year", 0)
    avg_ctc = c.get("avg_placement_lpa", 0)
    high_ctc = c.get("highest_placement_lpa", 0)
    placement_pct = c.get("placement_pct", 0)
    recruiters = ", ".join(c.get("top_recruiters", [])[:5]) or "Major MNCs & IT Leaders"
    courses = ", ".join(c.get("courses", [])[:6]) or "CSE, IT, ECE, EEE, Mechanical"
    cutoffs = c.get("base_cutoff_cse", {})

    cutoff_breakdown = ""
    if cutoffs:
        cutoff_breakdown = (
            "• **Benchmark CSE Cutoffs**:\n"
            f"  - **OC**: {cutoffs.get('OC', 'N/A')} | **BC**: {cutoffs.get('BC', 'N/A')} | **BCM**: {cutoffs.get('BCM', 'N/A')}\n"
            f"  - **MBC**: {cutoffs.get('MBC', 'N/A')} | **SC**: {cutoffs.get('SC', 'N/A')} | **ST**: {cutoffs.get('ST', 'N/A')}\n"
        )

    reply = (
        f"### 🏛️ {name} (TNEA Code: {code})\n\n"
        f"• **Location**: {district} | **Category**: {college_type}\n"
        f"• **Accreditation**: NIRF Rank: **{nirf}** | NAAC Grade: **{naac}**\n"
        f"• **Annual Tuition Fee**: ₹{int(tuition):,} | **Hostel Fee**: ₹{int(hostel):,}/yr\n"
        f"• **Placement Track Record**: **{avg_ctc} LPA** Average CTC (Highest: **{high_ctc} LPA** | {placement_pct}% Placed)\n"
        f"• **Top Hiring Companies**: {recruiters}\n"
        f"• **Available Streams**: {courses}\n"
        f"{cutoff_breakdown}\n"
        f"⭐ *You can compare {name} side-by-side with other colleges on 15+ parameters in the **Compare Colleges** tab!*"
    )

    suggestions = [
        f"Cutoff trend for {code}",
        f"Compare {code} with CEG",
        "Calculate my admission chance"
    ]

    return {
        "reply": reply,
        "intent": "college_profile",
        "suggestions": suggestions
    }


# ----------------------------------------------------------------------
# 3. Dynamic District Lookup
# ----------------------------------------------------------------------
def search_district_colleges(query_text: str) -> Optional[Dict[str, Any]]:
    """Checks if the user asks for colleges in a specific Tamil Nadu district."""
    districts = get_all_districts()
    q = query_text.lower()

    matched_district = None
    for d in districts:
        if d.lower() in q:
            matched_district = d
            break

    if not matched_district:
        return None

    colleges = load_all_colleges()
    district_colleges = [c for c in colleges if c.get("district", "").lower() == matched_district.lower()]

    if not district_colleges:
        return None

    # Sort by NIRF or highest placement
    district_colleges.sort(key=lambda x: (x.get("nirf_rank") or 999, -float(x.get("avg_placement_lpa", 0))))

    top_list = district_colleges[:6]
    lines = []
    for c in top_list:
        nirf_str = f"NIRF #{c.get('nirf_rank')}" if c.get("nirf_rank") else "Reputed"
        lines.append(
            f"• **[{c.get('code')}] {c.get('name')}**: {nirf_str} | Avg CTC: ₹{c.get('avg_placement_lpa')} LPA | Fee: ₹{int(c.get('tuition_fee_per_year', 0)):,}/yr"
        )

    reply = (
        f"### 📍 Premier Engineering Colleges in {matched_district} ({len(district_colleges)} Total)\n\n"
        + "\n".join(lines) +
        f"\n\n🔍 *Explore all {len(district_colleges)} institutions with fee and course filters in the **Colleges Directory** tab.*"
    )

    suggestions = [
        f"Colleges in {matched_district} under 1 Lakh",
        f"Compare {top_list[0].get('code')} vs {top_list[1].get('code') if len(top_list) > 1 else '0001'}",
        "Calculate PCM Cutoff"
    ]

    return {
        "reply": reply,
        "intent": "district_colleges",
        "suggestions": suggestions
    }


# ----------------------------------------------------------------------
# 4. Main NLP Intent Matching Engine
# ----------------------------------------------------------------------
def process_chat_message(user_message: str) -> Dict[str, Any]:
    """
    Intelligent NLP Intent Classifier and response generator.
    """
    clean_msg = user_message.lower().strip()
    if not clean_msg:
        return {
            "reply": "Hello! I am your **UAPS Admissions Advisory Assistant**. Please ask any question regarding TNEA engineering cutoffs, college comparisons, scholarships, or counseling procedures.",
            "intent": "empty",
            "suggestions": [
                "How to calculate TNEA cutoff?",
                "What is Anna University CEG cutoff?",
                "Tell me about 7.5% Govt school quota",
                "Top colleges in Chennai"
            ]
        }

    # 1. Check for specific College inquiry (dynamic lookup)
    matched_college = search_college_in_catalog(clean_msg)
    if matched_college:
        return format_college_response(matched_college)

    # 2. Check for District inquiry (dynamic lookup)
    district_result = search_district_colleges(clean_msg)
    if district_result:
        return district_result

    # Helper for root stemming
    def _stem(w: str) -> str:
        w = w.lower()
        for suff in ["ation", "tion", "ing", "ed", "es", "e", "s"]:
            if w.endswith(suff) and len(w) - len(suff) >= 4:
                return w[:-len(suff)]
        return w

    msg_roots = set(_stem(w) for w in re.findall(r"\b[a-z0-9]+\b", clean_msg))

    # 3. Match against Static Knowledge Intents with stem-aware scoring
    best_intent = None
    best_score = 0

    for item in STATIC_INTENTS:
        score = 0
        for kw in item["keywords"]:
            if kw in clean_msg:
                # Direct phrase match: maximum weight
                score += len(kw.split()) * 4 + 5
            else:
                # Word-order independent stem matching
                kw_roots = set(_stem(w) for w in re.findall(r"\b[a-z0-9]+\b", kw.lower()))
                if kw_roots and kw_roots.issubset(msg_roots):
                    score += len(kw_roots) * 3 + 3
                elif len(kw_roots.intersection(msg_roots)) >= 2:
                    score += len(kw_roots.intersection(msg_roots)) * 2

        if score > best_score:
            best_score = score
            best_intent = item

    if best_intent and best_score >= 3:
        return {
            "reply": best_intent["response"],
            "intent": best_intent["intent"],
            "suggestions": best_intent.get("suggestions", [])
        }

    # 4. Numeric Cutoff Detection (e.g. "I have 185", "cutoff 172.5")
    numbers = re.findall(r"\b(1[0-9]{2}(?:\.[0-9]+)?|200)\b", clean_msg)
    if numbers:
        cutoff_val = float(numbers[0])
        tier = "Elite Tier" if cutoff_val >= 195 else "Premier Tier" if cutoff_val >= 185 else "Autonomous Tier" if cutoff_val >= 165 else "Regional Tier"
        return {
            "reply": (
                f"### 🎯 Evaluation for Class 12 Cutoff: **{cutoff_val}** ({tier})\n\n"
                f"Based on historical TNEA single-window counseling calibrations:\n"
                f"• **Cutoff Range**: {cutoff_val} / 200.00\n"
                f"• **High Chance Candidates**: Will find strong allocation probabilities in premier regional and autonomous institutions for CSE / IT / ECE.\n"
                f"• **Top Aspirations**: You can run our **Admission Predictor** to see exact calibrated probabilities across **125+ colleges** categorized into High Chance (>85%), Medium Chance (50–85%), and Low Chance (<50%).\n\n"
                f"👉 *Navigate to the **Admission Predictor** tab to see your complete list of institutions.*"
            ),
            "intent": "cutoff_numeric_analysis",
            "suggestions": [
                f"Colleges in Chennai for {cutoff_val}",
                "How does community quota affect cutoffs?",
                "First Graduate concession eligibility"
            ]
        }

    # 5. Polite Greetings & System Info
    greetings = ["hi", "hello", "vanakkam", "hey", "good morning", "good evening", "namaste"]
    if any(re.search(rf"\b{g}\b", clean_msg) for g in greetings):
        return {
            "reply": (
                "Vanakkam! I am the **UAPS Admissions Advisory Assistant**.\n\n"
                "I can assist you with:\n"
                "• **Cutoff Analysis & College Forecasts** (e.g., 'Cutoff for PSG Tech', 'Colleges for 185 cutoff')\n"
                "• **Counseling Rules & Strategy** (e.g., 'How choice filling works', 'What is Upward Movement?')\n"
                "• **State Scholarships & Aid** (e.g., '7.5% Govt School quota', 'First Graduate concession')\n"
                "• **College Comparison & Fees** (e.g., 'Compare CEG vs SSN', 'Top colleges in Coimbatore')\n\n"
                "What would you like to know today?"
            ),
            "intent": "greeting",
            "suggestions": [
                "How to calculate TNEA cutoff?",
                "Tell me about First Graduate concession",
                "What are the counseling rounds?",
                "Top colleges in Chennai"
            ]
        }

    # 6. Intelligent Fallback with Directed Suggestions
    return {
        "reply": (
            "### 🤖 UAPS Admission Intelligence Advisor\n\n"
            "I could not locate an exact match for your specific phrasing, but I can assist with any of the following topics:\n\n"
            "• **College Profiles & Placements**: Ask about any college by name or code (e.g., *'Anna University CEG'*, *'PSG Tech'*, *'SSN'*, *'SKCT'*, *'CIT'*, *'TCE'*).\n"
            "• **District Hubs**: Ask for top institutions by region (e.g., *'Colleges in Chennai'*, *'Colleges in Coimbatore'*).\n"
            "• **Cutoff Inquiries**: Ask how cutoffs are calculated or provide your score (e.g., *'Cutoff 182 BC'*, *'Cutoff formula'*).\n"
            "• **Counseling Rules**: Learn about choice filling, mandatory certificates, and upward movement.\n"
            "• **Scholarships**: Discover First Graduate, 7.5% school quota, and Post-Matric schemes."
        ),
        "intent": "fallback",
        "suggestions": [
            "How to calculate TNEA cutoff?",
            "What is Anna University CEG cutoff?",
            "Colleges in Coimbatore",
            "First Graduate concession rules",
            "What is Upward Movement in counseling?"
        ]
    }
