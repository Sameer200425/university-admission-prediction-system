# University Admission Prediction System (Tamil Nadu - TNEA)

A comprehensive machine learning and decision support system for predicting engineering college admission chances across Tamil Nadu. Calibrated directly from historical Tamil Nadu Engineering Admissions (TNEA) single-window counseling records (2019–2024), verified institutional criteria, and socio-economic scholarship schemes.

---

## 👥 Academic Project Team & Guide

- **Department**: Department of Computer Science and Engineering
- **Project Title**: UNIVERSITY ADMISSION PREDICTION SYSTEM (Mini-Project)
- **Team Members**:
  - **PATHAN SAMEER KHAN** — Reg No: `3502210579`
  - **YUVARAJ.V** — Reg No: `3502210628`
  - **PRAGADESH.A** — Reg No: `3502210580`
- **Project Guide**:
  - **DR. THILAGAVATH, PH.D**, Assistant Professor, Department of Computer Science and Engineering

---

## 🎯 Key Modules & Features

1. **Admission Chance Predictor (Random Forest Classifier - 94.5% Accuracy)**:
   - Evaluates Class 12 Cutoff mark (out of 200) with Tamil Nadu community quotas (**OC, BC, BCM, MBC/DNC, SC, SCA, ST**) and branches (**CSE, IT, AI&DS, ECE, EEE, Mechanical, Civil**).
   - Categorizes admission chances into:
     - **High Chance (>85%)**: e.g., K.L.N. College of Engineering
     - **Medium Chance (50–85%)**: e.g., Sri Krishna College of Technology
     - **Low Chance (<50%)**: e.g., Anna University (CEG)
   - Built-in **Cutoff Calculator**: $\text{Cutoff} = \text{Maths} (100) + \frac{\text{Physics} (100)}{2} + \frac{\text{Chemistry} (100)}{2}$.

2. **Centralized Directory of 125+ Verified Tamil Nadu Engineering Colleges**:
   - Verified data on TNEA code, NIRF rank, NAAC grade, annual tuition fees, hostel costs, placement statistics (average & highest package), and top recruiters.
   - Dynamic filtering by **District** (e.g., Chennai, Coimbatore, Madurai, Salem), **Max Tuition Fees** (e.g., ₹2,00,000), and Course.

3. **Side-by-Side Comparison Tool (15+ Parameters)**:
   - Compare up to 3 institutions simultaneously across tuition fees, hostel expenses, 4-year total cost, placement averages, NIRF rank, accreditation, top recruiters, and ROI ratios.

4. **Cutoff Trends & Expected Cutoff Forecast (Linear Regression)**:
   - Visual trend line charts analyzing 2019 to 2024 historical cutoffs plus 2025/2026 expected cutoffs projected using Ordinary Least Squares linear regression.

5. **Rule-Based Scholarship Matcher**:
   - Evaluates student parental income, community, first graduate status, and Tamil Nadu government school 7.5% preferential quota.
   - Automatically identifies eligibility for:
     - **Post Matric Scholarship (SC/ST/SCC)** (100% Tuition Fee Waiver + Maintenance)
     - **First Graduate Tuition Fee Concession** (₹25,000–₹27,500/yr)
     - **7.5% Government School Full Fee Assistance Scheme**
     - **Pudhumai Penn Scheme** (₹1,000/month for female students from Govt schools)
     - **AICTE Pragati Scholarship for Girls** (₹50,000/yr)
     - **BC/MBC/DNC Welfare Scholarship**

6. **Return on Investment (ROI) Calculator**:
   - Compares total 4-year financial investment (tuition, hostel, living) against average placement salary package (CTC) to calculate breakeven years and 5-year return on investment (%).

7. **AI Admission Chatbot (NLP Intent Engine)**:
   - Instant query resolution for TNEA cutoffs, counseling procedures, mandatory verification certificates, and college fee structures.

8. **Comprehensive 11-Chapter Project Report Viewer**:
   - Interactive viewer covering all 11 chapters from `index.pdf` and `Document 2.pdf`.

---

## 📚 Academic References (Presentation Slide 16)

1. **Al-Barrak, M. A., & Al-Razgan, M. (2016)**. *Predicting students' performance using data mining techniques*. International Journal of Computer Applications, 160(7), 24–29.
2. **Ahmed, A. M., Zeki, A. M., & Selamat, A. (2017)**. *A machine learning approach for predicting student admissions*. Journal of Theoretical and Applied Information Technology, 95(20), 5354–5364.
3. **Kumar, V., & Chadha, A. (2015)**. *Machine learning: Principles and techniques*. International Journal of Computer Science and Technology, 6(2), 53–59.
4. **Han, J., Kamber, M., & Pei, J. (2012)**. *Data mining: Concepts and techniques* (3rd ed.). Morgan Kaufmann.
5. **Romero, C., & Ventura, S. (2020)**. *Educational data mining: A review of the state of the art*. IEEE Transactions on Systems, Man, and Cybernetics: Systems, 50(3), 778–795.
6. **Yadav, S. K., Bharadwaj, B., & Pal, S. (2012)**. *Data mining applications: A comparative study for predicting student performance*. International Journal of Computer Science and Information Security, 10(2), 113–120.

---

## 🏛️ System Architecture (Recruiter-Friendly Overview)

```
┌─────────────────────────────────────────────────────────┐
│                 UAPS Frontend (React 18)                │
│   Tailwind CSS • React Router v6 • Lucide React • Vite  │
│                                                         │
│  ┌──────────────┐ ┌───────────────┐ ┌────────────────┐  │
│  │ Step Wizard  │ │ 125+Directory │ │ 15+ Compare    │  │
│  │ (Multi-Step) │ │ (Dist/Fee/Crs)│ │ (Up to 3 Inst.)│  │
│  └──────────────┘ └───────────────┘ └────────────────┘  │
│  ┌──────────────┐ ┌───────────────┐ ┌────────────────┐  │
│  │ OLS Trends   │ │ Scholarships  │ │ AI Chatbot     │  │
│  │ & ROI Engine │ │ (Rule-Based)  │ │ (NLP Intent)   │  │
│  └──────────────┘ └───────────────┘ └────────────────┘  │
└────────────────────────────┬────────────────────────────┘
                             │ JSON REST APIs (Fetch / Axios)
┌────────────────────────────▼────────────────────────────┐
│                 UAPS Backend (FastAPI)                  │
│      Asynchronous REST Service • Pydantic Validation    │
│                                                         │
│  ┌───────────────────────┐   ┌────────────────────────┐ │
│  │ Random Forest (94.5%) │   │ OLS Trend Forecasting  │ │
│  │ (Joblib Serialized)   │   │ (Linear Regression)    │ │
│  └───────────────────────┘   └────────────────────────┘ │
│  ┌───────────────────────┐   ┌────────────────────────┐ │
│  │ SQLite Relational DB  │   │ NLP Counseling Intent  │ │
│  │ (Colleges, Cutoffs)   │   │ Engine & Dictionary    │ │
│  └───────────────────────┘   └────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

- **Frontend**: Clean, modern React 18 SPA built with Vite and styled with Tailwind CSS. State management via React Context (`AuthContext`) and React Router v6 hash routing.
- **Backend**: Asynchronous, high-throughput Python REST service using FastAPI, Uvicorn, and Scikit-Learn.
- **Clean Separation**: 100% decoupled client-server architecture with zero legacy server-side template dependencies (no Flask, Jinja2, or Bootstrap).

---

## 🚀 Getting Started

### 1. Backend (FastAPI + Scikit-Learn)

```powershell
# From workspace root
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

### 2. Frontend (React 18 + Vite + Tailwind CSS)

```powershell
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
- Web Application URL: `http://127.0.0.1:5173`

---

## 🧪 Verified Presentation Test Cases

- **Slide 9**:
  - Valid login: Redirects to Dashboard immediately.
  - Invalid password: Displays `"Invalid credentials."`
  - Duplicate registration: Displays `"Email already exists."`
- **Slide 10**:
  - Dynamic user greeting: Displays `"Welcome, Sameer"`.
  - Cutoff: `185.0`, Community: `BC`, Course: `CSE` $\rightarrow$
    - **High Chance**: K.L.N. College of Engineering (Code 5901)
    - **Medium Chance**: Sri Krishna College of Technology (Code 2718)
    - **Low Chance**: Anna University (CEG) (Code 0001)
- **Slide 11**:
  - Filter: District: `"Chennai"` and Max Fees: `₹2,00,000` $\rightarrow$ Filters to 28 Chennai colleges with fees below ₹2 Lakhs.
  - Scholarship: Annual Income: `₹1,50,000`, Community: `SC` $\rightarrow$ Matches Post Matric Scholarship (SC/ST) and First Graduate Concession.