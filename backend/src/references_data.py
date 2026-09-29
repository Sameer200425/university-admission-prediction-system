"""
Academic references, team information, and project documentation metadata
as defined in CSE B Mini_Project_Presentation_Template__FINALREVIEW[1].pptx,
Document 2.pdf, and index.pdf.
"""

PROJECT_METADATA = {
    "project_title": "University Admission Prediction System",
    "sub_title": "A Machine Learning and Decision Support Platform for Tamil Nadu Engineering Admissions (TNEA)",
    "department": "Department of Computer Science and Engineering",
    "academic_year": "2024 - 2025",
    "team_members": [
        {
            "name": "PATHAN SAMEER KHAN",
            "reg_no": "3502210579",
            "role": "ML Pipeline & Architecture"
        },
        {
            "name": "YUVARAJ.V",
            "reg_no": "3502210628",
            "role": "Full-Stack Development & Database"
        },
        {
            "name": "PRAGADESH.A",
            "reg_no": "3502210580",
            "role": "Data Preprocessing & Evaluation"
        }
    ],
    "guide": {
        "name": "DR. THILAGAVATH, PH.D",
        "designation": "Assistant Professor",
        "department": "Department of Computer Science and Engineering"
    }
}

# The 6 academic paper references from Slide 16 of the Presentation & Chapter 5 Literature Review
ACADEMIC_REFERENCES = [
    {
        "id": 1,
        "citation": "Al-Barrak, M. A., & Al-Razgan, M. (2016). Predicting students' performance using data mining techniques. International Journal of Computer Applications, 160(7), 24–29.",
        "authors": "Al-Barrak, M. A., & Al-Razgan, M.",
        "year": 2016,
        "title": "Predicting students' performance using data mining techniques",
        "journal": "International Journal of Computer Applications, 160(7), 24–29",
        "relevance": "Provides foundational methodology for student performance prediction using classification algorithms (Decision Trees and Naive Bayes) in educational data mining (EDM)."
    },
    {
        "id": 2,
        "citation": "Ahmed, A. M., Zeki, A. M., & Selamat, A. (2017). A machine learning approach for predicting student admissions. Journal of Theoretical and Applied Information Technology, 95(20), 5354–5364.",
        "authors": "Ahmed, A. M., Zeki, A. M., & Selamat, A.",
        "year": 2017,
        "title": "A machine learning approach for predicting student admissions",
        "journal": "Journal of Theoretical and Applied Information Technology, 95(20), 5354–5364",
        "relevance": "Demonstrates the efficacy of ensemble learning and feature selection on admission probability classification based on high school scores."
    },
    {
        "id": 3,
        "citation": "Kumar, V., & Chadha, A. (2015). Machine learning: Principles and techniques. International Journal of Computer Science and Technology, 6(2), 53–59.",
        "authors": "Kumar, V., & Chadha, A.",
        "year": 2015,
        "title": "Machine learning: Principles and techniques",
        "journal": "International Journal of Computer Science and Technology, 6(2), 53–59",
        "relevance": "Surveys supervised machine learning algorithms, highlighting the trade-offs between Decision Trees, Support Vector Machines (SVM), and Random Forests."
    },
    {
        "id": 4,
        "citation": "Han, J., Kamber, M., & Pei, J. (2012). Data mining: Concepts and techniques (3rd ed.). Morgan Kaufmann.",
        "authors": "Han, J., Kamber, M., & Pei, J.",
        "year": 2012,
        "title": "Data mining: Concepts and techniques (3rd ed.)",
        "journal": "Morgan Kaufmann Publishers",
        "relevance": "Authoritative reference for data preprocessing, handling noisy/missing data, normalization, and k-fold cross-validation techniques implemented in this project."
    },
    {
        "id": 5,
        "citation": "Romero, C., & Ventura, S. (2020). Educational data mining: A review of the state of the art. IEEE Transactions on Systems, Man, and Cybernetics: Systems, 50(3), 778–795.",
        "authors": "Romero, C., & Ventura, S.",
        "year": 2020,
        "title": "Educational data mining: A review of the state of the art",
        "journal": "IEEE Transactions on Systems, Man, and Cybernetics: Systems, 50(3), 778–795",
        "relevance": "Comprehensive state-of-the-art review on EDM, confirming that AI-assisted decision support systems significantly minimize decision regret and dropouts among undergraduate applicants."
    },
    {
        "id": 6,
        "citation": "Yadav, S. K., Bharadwaj, B., & Pal, S. (2012). Data mining applications: A comparative study for predicting student performance. International Journal of Computer Science and Information Security, 10(2), 113–120.",
        "authors": "Yadav, S. K., Bharadwaj, B., & Pal, S.",
        "year": 2012,
        "title": "Data mining applications: A comparative study for predicting student performance",
        "journal": "International Journal of Computer Science and Information Security, 10(2), 113–120",
        "relevance": "Empirical comparison of classifier accuracy that informed our selection of Random Forest over standalone Decision Trees due to variance reduction."
    }
]

# The complete 11-Chapter Table of Contents and chapter briefs from Document 2.pdf & index.pdf
PROJECT_CHAPTERS = [
    {
        "chapter_no": "Chapter 1",
        "title": "Introduction",
        "sections": [
            "1.1 Introduction",
            "1.2 Educational Landscape in Tamil Nadu (GER, 500+ Engineering Colleges, 2.5L+ Students)",
            "1.3 Challenges in Current Admission System (Information Asymmetry, Obscure Fees)",
            "1.4 Role of Technology in Modern Education (AI-enabled decision support)",
            "1.5 Motivation Behind the Project (Overcoming peer anxiety, democratization)",
            "1.6 Project Vision and Scope (One-stop counseling for TN engineering & arts)",
            "1.7 Target Users (Class 12 students, parents, school counselors)",
            "1.8 Expected Impact (80% reduction in research time, reduced dropout)",
            "1.9 Innovation and Uniqueness (Random Forest, ROI Calculator, Scholarship Matcher, AI Chatbot)",
            "1.10 Organization of the Report"
        ]
    },
    {
        "chapter_no": "Chapter 2",
        "title": "Problem Statement",
        "sections": [
            "2.1 Context and Background",
            "2.2 Current Challenges and Pain Points (Information fragmentation, cutoff volatility, limited scholarship awareness)",
            "2.3 Problem Magnitude and Urgency (8 lakh Class 12 graduates, 2-month critical counseling window)",
            "2.4 Existing Solutions and Limitations (Govt portals non-predictive, commercial agents ₹5k-25k)",
            "2.5 Gap Analysis (Need for free, holistic, predictive and financial planning platform)",
            "2.6 Problem Statement Summary",
            "2.7 Research Questions",
            "2.8 Proposed Solution Approach (ML + Web app)",
            "2.9 Expected Outcomes (>90% accuracy, accessible interface)"
        ]
    },
    {
        "chapter_no": "Chapter 3",
        "title": "Objectives",
        "sections": [
            "3.1 Primary Objectives: Accurate Prediction System (High/Medium/Low), Centralized 125+ College Repository, Personalized Guidance",
            "3.2 Secondary Objectives: Accessibility, Data Security, Bridging Urban-Rural Gap",
            "3.3 Technical Objectives: Random Forest Classifier, Sub-2-second latency, Mobile-first responsive UI",
            "3.4 Functional Objectives: Search & filter, side-by-side comparison on 15+ parameters",
            "3.5 Long-Term Objectives: Multilingual expansion, continuous model retraining",
            "3.6 Success Criteria: >99% uptime, >90% prediction accuracy (achieved 94.5%)"
        ]
    },
    {
        "chapter_no": "Chapter 4",
        "title": "Scope of the Project",
        "sections": [
            "4.1 Introduction to Project Scope",
            "4.2 Functional Scope: Admission prediction, 125+ verified college database, scholarship matching, ROI calculation, chatbot",
            "4.3 Technical Scope: Python backend, Scikit-learn, SQLite, React 18 & Tailwind CSS responsive UI",
            "4.4 Data Scope: 5 years of historical TNEA cutoff records (2019-2024)",
            "4.5 User Scope: Students, parents, counselors, admins",
            "4.6 Geographic Scope: Tamil Nadu state borders",
            "4.7 Time Scope: Operational for the active admission season",
            "4.8 Limitations and Constraints"
        ]
    },
    {
        "chapter_no": "Chapter 5",
        "title": "Literature Review",
        "sections": [
            "5.1 Introduction to Literature Review in Educational Data Mining (EDM)",
            "5.2 Machine Learning in Education (Al-Barrak & Al-Razgan, Ahmed et al.)",
            "5.3 Survey of Existing Admission Systems (Shiksha, CollegeDunia, TNEA Online)",
            "5.4 Classification Algorithms: Decision Trees vs SVM vs Random Forest",
            "5.5 Regression Models for Cutoff Trend Prediction",
            "5.6 NLP in Education (Chatbots for administrative FAQ resolution)",
            "5.7 Comparative Analysis of Existing Systems",
            "5.8 Research Gaps Identified"
        ]
    },
    {
        "chapter_no": "Chapter 6",
        "title": "System Analysis",
        "sections": [
            "6.1 Requirements Analysis (Functional and Non-Functional)",
            "6.2 Feasibility Study (Technical, Economic, Operational, Schedule)",
            "6.3 System Modeling (Use Case Diagrams, Data Flow Diagrams DFD Level 0/1, Sequence Diagrams)",
            "6.4 Data Modeling (ER Diagrams, Database Normalization to 3NF)",
            "6.5 Machine Learning Requirements",
            "6.6 Hardware/Software Specifications"
        ]
    },
    {
        "chapter_no": "Chapter 7",
        "title": "System Design",
        "sections": [
            "7.1 System Architecture: Modern Client-Server API pattern",
            "7.2 Database Design: Users, Colleges, Cutoffs, Scholarships tables",
            "7.3 Machine Learning Model Design: Feature engineering, cutoff differences, 80-20 train-test split",
            "7.4 User Interface Design: Responsive layouts, cards, and step-based prediction flow",
            "7.5 Algorithm Design: Random Forest classification + Linear Regression trend extrapolation",
            "7.6 Security Design: SHA-256 password hashing, session tokens, input validation",
            "7.7 Chatbot Design: Intent classification, dictionary lookup, AJAX communication"
        ]
    },
    {
        "chapter_no": "Chapter 8",
        "title": "Implementation",
        "sections": [
            "8.1 Implementation Environment: VS Code, Python 3.11, Chrome DevTools",
            "8.2 Database Implementation: SQLite database with schema initialization",
            "8.3 Machine Learning Implementation: Scikit-learn Random Forest Classifier, Joblib serialization",
            "8.4 Backend Implementation: FastAPI high-performance asynchronous REST endpoints for /predict, /colleges, /scholarships, /roi",
            "8.5 Frontend Implementation: React 18 + Tailwind CSS with modular component architecture",
            "8.6 Chatbot Implementation: Interactive widget with AJAX query resolution",
            "8.7 Code Snippets: Key predict(), get_scholarships(), calculate_roi() functions"
        ]
    },
    {
        "chapter_no": "Chapter 9",
        "title": "Testing",
        "sections": [
            "9.1 Testing Strategy: Hybrid White Box + Black Box testing",
            "9.2 Unit Testing: Individual ROI formulas, Cutoff calculations, and password hashes",
            "9.3 Integration Testing: Auth tokens, database queries, and ML prediction calls",
            "9.4 System Testing: End-to-end flows (Register -> Predict -> Compare -> Match Scholarship)",
            "9.5 Performance Testing: Sub-1.5 second API response times under simulated concurrency",
            "9.6 Security Testing: SQL injection prevention, XSS mitigation, SHA-256 integrity",
            "9.7 ML Testing: 94.5% test accuracy, 5-fold cross-validation, confusion matrix analysis",
            "9.8 Documented Test Cases: Input -> Expected -> Actual -> Result"
        ]
    },
    {
        "chapter_no": "Chapter 10",
        "title": "Results and Discussion",
        "sections": [
            "10.1 System Functionality Demonstration: Working Predictor, College Catalog, Chatbot",
            "10.2 Model Performance: Precision (0.94), Recall (0.95), F1-Score (0.945)",
            "10.3 Test Scenario Evaluation: Cutoff 185, BC, CSE -> High: KLN, Med: SKCT, Low: CEG",
            "10.4 System Performance: Average response time < 1.2s",
            "10.5 Feature-wise Analysis: Search efficiency, rule-based scholarship accuracy, ROI clarity",
            "10.6 Visual Results: Historical cutoff trend charts and admission probability distributions",
            "10.7 Limitations Observed: Data dependence on annual counseling publication"
        ]
    },
    {
        "chapter_no": "Chapter 11",
        "title": "Conclusion and Future Work",
        "sections": [
            "11.1 Summary of the Project",
            "11.2 Key Achievements: 125+ verified colleges integrated, 94.5% ML accuracy, complete decision support",
            "11.3 Objectives Fulfilled",
            "11.4 Future Enhancements: Multi-language (Tamil) support, live counseling API integration, mobile app",
            "11.5 Commercialization & Social Impact: Free access for rural and economically weaker students"
        ]
    }
]
