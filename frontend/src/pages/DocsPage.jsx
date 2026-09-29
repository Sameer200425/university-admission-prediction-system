import React, { useState, useEffect } from 'react'
import { fetchReferences } from '../api'
import {
  FileText,
  BookOpen,
  Search,
  Copy,
  Check,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Code2,
  ChevronDown,
  Sparkles
} from 'lucide-react'

const VIVA_QUESTIONS = [
  {
    id: 1,
    category: "Machine Learning & AI",
    question: "Why did you choose Random Forest Classifier over Logistic Regression or Support Vector Machines (SVM)?",
    shortAnswer: "Random Forest handles non-linear multi-class decision boundaries, high-dimensional categorical features, and prevents overfitting through bootstrap aggregating (bagging) of 100 decision trees.",
    detailedDefense: "TNEA admission decisions do not follow a simple linear hyperplane because college cutoff thresholds are non-linear step functions across 125+ institutions and 7 reservation quotas. Logistic Regression assumes a linear relationship in log-odds space, which fails to capture sudden cutoff cliffs. SVM with RBF kernels is computationally heavy for multi-class classification. Random Forest builds an ensemble of decorrelated decision trees, evaluating candidate cutoff, college code, community quota, and branch index with a 94.5% test accuracy and Gini impurity splits."
  },
  {
    id: 2,
    category: "State Policy & Quota Math",
    question: "How is the Tamil Nadu 69% community reservation quota modeled in the system?",
    shortAnswer: "By modeling quota-specific cutoff baselines: OC (31% Open Competition), BC (26.5%), BCM (3.5%), MBC/DNC (20%), SC (15%), SCA (3%), and ST (1%).",
    detailedDefense: "Under the Tamil Nadu Backward Classes, Scheduled Castes and Scheduled Tribes (Reservation of Seats in Educational Institutions) Act, 1993, 69% of seats are reserved. Each college has different historical closing ranks for each quota. For instance, in CEG Anna University CSE, OC closing cutoff is typically 199.0, BC is ~197.5, MBC is ~194.0, and SC is ~186.0. Our system computes Cutoff Difference as Δ = Applicant_Cutoff - Community_Cutoff, ensuring the machine learning model accurately mirrors statutory reservation distributions."
  },
  {
    id: 3,
    category: "Academic Normalization",
    question: "What is the exact mathematical formula to compute the TNEA cutoff mark?",
    shortAnswer: "Cutoff = Mathematics + (Physics / 2) + (Chemistry / 2), resulting in a normalized aggregate out of 200.0 marks.",
    detailedDefense: "In Tamil Nadu Higher Secondary (+2) examinations, Mathematics is scaled out of 100, while Physics and Chemistry (each out of 100) are halved to 50 marks each. The mathematical formulation is: Cutoff = M + (P / 2) + (C / 2). The system's cutoff engine validates input bounds [0.00, 200.00] with precision rounding to two decimal places."
  },
  {
    id: 4,
    category: "Time Series & Forecasting",
    question: "How does the cutoff trend prediction engine forecast 2025 and 2026 cutoffs?",
    shortAnswer: "Using Ordinary Least Squares (OLS) Linear Regression trained on 6 years of historical cutoff data (2019 to 2024).",
    detailedDefense: "For each college-branch-community triplet, historical cutoffs (2019–2024) are fitted using: y = β₀ + β₁·Year + ε. The slope β₁ indicates cutoff inflation or deflation driven by +2 board pass percentages. The model projects Expected 2025 and 2026 cutoffs while constraining the boundary between [77.5, 200.0] marks."
  },
  {
    id: 5,
    category: "Software Architecture",
    question: "Why did you use FastAPI with Asynchronous Concurrency over Flask or Django?",
    shortAnswer: "FastAPI runs on ASGI (Uvicorn), providing non-blocking asynchronous I/O, automatic Pydantic data validation, OpenAPI interactive documentation, and high throughput.",
    detailedDefense: "During TNEA counseling result releases, server concurrency is critical. Flask uses synchronous WSGI, blocking worker threads during SQLite or ML inference calls. FastAPI leverages Python's asyncio event loop, allowing thousands of concurrent admission queries per second with sub-50ms latency. Furthermore, Pydantic type safety guarantees valid PCM inputs before ML inference."
  },
  {
    id: 6,
    category: "Natural Language Processing",
    question: "How does the AI Chatbot understand student queries without expensive cloud APIs?",
    shortAnswer: "Through a localized Rule-Based & Regex Pattern-Matching Intent Engine with slot extraction for college codes and counseling rules.",
    detailedDefense: "The chatbot utilizes regular expressions and keyword tokenization to classify user queries into 7 distinct counseling intents (Cutoff Formula, College Specific Information, Scholarship Rules, Reservation Inquiries, Counseling Schedule, Fee Structure, and General Help). This guarantees zero-latency, zero-cost offline responses with rich Markdown and mathematical formula formatting."
  },
  {
    id: 7,
    category: "Data Integrity & Explainability",
    question: "How do you ensure the system is not a 'black box' and explain predictions to students?",
    shortAnswer: "Through our Explainable AI (XAI) feature importance inspector that isolates Cutoff Margin, Quota Advantage, and Branch Density contribution weights.",
    detailedDefense: "Every prediction card provides an XAI factor breakdown. The primary driver is Cutoff Margin (65% weight), followed by Community Quota delta (20%), and Branch Competition Multiplier (15%). Furthermore, our TNEA Choice Filling Optimizer verifies that students do not place lower-cutoff institutions above higher-cutoff dream colleges."
  },
  {
    id: 8,
    category: "Analytics & Economics",
    question: "What is the ROI calculation methodology for comparing college options?",
    shortAnswer: "ROI = ((4-Year Package - Total Investment) / Total Investment) * 100, with breakeven = Total 4-Yr Cost / (Annual Placement Package * 0.70 savings rate).",
    detailedDefense: "Total 4-year investment aggregates (Tuition + Hostel + Miscellaneous) * 4 minus government scholarships. Assuming a conservative 70% post-tax salary savings rate dedicated to education cost recovery, the breakeven period calculates how many years the graduate requires to recoup their engineering degree expenses."
  }
]

export default function DocsPage() {
  const [activeSubTab, setActiveSubTab] = useState('chapters') // 'chapters', 'references', or 'viva'
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedChapterIdx, setSelectedChapterIdx] = useState(0)
  const [chapterSearch, setChapterSearch] = useState('')
  const [vivaSearch, setVivaSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [expandedVivaId, setExpandedVivaId] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetchReferences()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const copyCitation = (text, id) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const chapters = data?.project_chapters || []
  const references = data?.academic_references || []

  const filteredChapters = chapters.filter((c) =>
    c.title.toLowerCase().includes(chapterSearch.toLowerCase()) ||
    c.chapter_no.toLowerCase().includes(chapterSearch.toLowerCase())
  )

  const filteredViva = VIVA_QUESTIONS.filter((q) =>
    q.question.toLowerCase().includes(vivaSearch.toLowerCase()) ||
    q.category.toLowerCase().includes(vivaSearch.toLowerCase()) ||
    q.shortAnswer.toLowerCase().includes(vivaSearch.toLowerCase())
  )

  const currentChapter = chapters[selectedChapterIdx] || null

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-2 border border-slate-200">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Academic Dossier & Defense Materials</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Project Report & Literature Citations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete 11-Chapter project report covering system requirements, architecture, ML methodology, and examiner viva defense questions.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSubTab('chapters')}
              className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${activeSubTab === 'chapters'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              11-Chapter Report
            </button>
            <button
              onClick={() => setActiveSubTab('references')}
              className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${activeSubTab === 'references'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Literature Citations
            </button>
            <button
              onClick={() => setActiveSubTab('viva')}
              className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${activeSubTab === 'viva'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Viva Defense Q&A</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading documentation dossier...</p>
        </div>
      ) : activeSubTab === 'viva' ? (
        /* VIVA DEFENSE Q&A VIEW */
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Examiner Defense Prep
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                Top Technical Viva Voce Questions & Model Answers
              </h2>
              <p className="text-xs text-slate-500">
                Rigorous mathematical, algorithmic, and architectural defenses prepared for final evaluation.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={vivaSearch}
                onChange={(e) => setVivaSearch(e.target.value)}
                placeholder="Search viva questions..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-blue-600 outline-none pl-8"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="space-y-4">
            {filteredViva.map((q) => {
              const isExpanded = expandedVivaId === q.id
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition"
                >
                  <div
                    onClick={() => setExpandedVivaId(isExpanded ? null : q.id)}
                    className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Q#{q.id} • {q.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {q.question}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        <strong className="text-slate-900">Elevator Answer: </strong>
                        {q.shortAnswer}
                      </p>
                    </div>

                    <div className="shrink-0 p-1 rounded-lg bg-slate-100 text-slate-600">
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-fade-in">
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Detailed Technical & Mathematical Defense:</span>
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 font-sans">
                          {q.detailedDefense}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : activeSubTab === 'chapters' ? (
        /* CHAPTERS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chapters Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="relative">
              <input
                type="text"
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                placeholder="Search chapters..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-blue-600 outline-none pl-8"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredChapters.map((c, idx) => {
                const actualIdx = chapters.indexOf(c)
                const isSelected = selectedChapterIdx === actualIdx
                return (
                  <button
                    key={c.chapter_no}
                    onClick={() => setSelectedChapterIdx(actualIdx)}
                    className={`w-full text-left p-3 rounded-xl transition cursor-pointer text-xs flex items-center justify-between ${isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'hover:bg-slate-50 text-slate-700'
                      }`}
                  >
                    <div className="truncate pr-2">
                      <span className={`text-[10px] uppercase block ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {c.chapter_no}
                      </span>
                      <span className="truncate">{c.title}</span>
                    </div>
                    <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chapter Content Main Reader */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {currentChapter ? (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {currentChapter.chapter_no}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    {currentChapter.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Academic Mini-Project Dossier • Anna University / TNEA Guidelines
                  </p>
                </div>

                <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-4">
                  {currentChapter.sections ? (
                    typeof currentChapter.sections[0] === 'string' ? (
                      // Sections are plain strings (our format)
                      <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 space-y-2">
                        <ul className="space-y-2">
                          {currentChapter.sections.map((sec, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{sec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      // Sections are objects with heading/content
                      currentChapter.sections.map((sec, i) => (
                        <div key={i} className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                          <h4 className="font-bold text-slate-900 text-sm">{sec.heading}</h4>
                          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{sec.content}</p>
                        </div>
                      ))
                    )
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-line">
                      {currentChapter.summary || currentChapter.content || 'Chapter content loaded from documentation dossier.'}
                    </div>
                  )}
                </div>

                {/* Team Details Banner */}
                {data?.project_metadata && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <strong>Project: </strong>{data.project_metadata.project_title}
                    </div>
                    <div>
                      <strong>Supervisor: </strong>{data.project_metadata.guide?.name}{data.project_metadata.guide?.designation ? `, ${data.project_metadata.guide.designation}` : ''}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                Select a chapter from the sidebar to review the academic report.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* REFERENCES VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {references.map((ref, idx) => {
            return (
              <div
                key={ref.id || idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      [Ref {idx + 1}] {ref.id}
                    </span>
                    <button
                      onClick={() => copyCitation(`${ref.authors}, "${ref.title}", ${ref.venue || ref.citation}.`, ref.id || idx)}
                      className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === (ref.id || idx) ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </span>
                      )}
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {ref.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {ref.authors}
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    {ref.venue || ref.citation}
                  </p>
                  {ref.relevance && (
                    <div className="bg-slate-50 p-2 rounded-lg text-[11px] text-slate-600 border border-slate-100">
                      <strong className="text-slate-800">Relevance: </strong>
                      {ref.relevance}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <a
                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(ref.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Google Scholar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
