import React from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  ShieldCheck,
  Cpu,
  Database,
  BarChart3,
  Layers,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs mt-24">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: System Identity & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">UAPS</span>
                <span className="text-[10px] text-slate-400 font-medium block leading-none">
                  University Admission Prediction System
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Machine learning decision support platform for engineering admissions. Trained on 110,000+ historical single-window counseling cutoff records to provide calibrated allocation probabilities, institutional trends, and financial aid insights.
            </p>

            <div className="space-y-2 pt-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Random Forest: 94.5% Accuracy</span>
              </div>
              <div className="block text-[11px] text-slate-400">
                <span className="text-blue-400 font-semibold">125+</span> Verified Institutions &bull; <span className="text-indigo-400 font-semibold">7</span> Quota Categories
              </div>
            </div>
          </div>

          {/* Column 2: Core Capabilities & Algorithms */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Core Capabilities</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-200">ML Chance Predictor:</strong> Random Forest model evaluated across OC, BC, BCM, MBC, SC, SCA, ST quotas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-200">Cutoff Forecasting:</strong> Ordinary Least Squares (OLS) linear trend projections from 2019 to 2026.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-200">Institutional Comparison:</strong> 15+ metrics including NIRF, NAAC, tuition, hostel, and placement CTC.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-200">Financial Aid Matcher:</strong> Rule-based engine for Post-Matric, First Graduate, and 7.5% school quotas.</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Decision & Analytical Modules */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Platform Modules</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/predict" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Admission Chance Predictor</span>
                  <span className="text-[10px] text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-900/40">RF Model</span>
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>125+ Colleges Directory</span>
                  <span className="text-[10px] text-slate-500">Filter Engine</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Side-by-Side Comparison</span>
                  <span className="text-[10px] text-slate-500">15+ Params</span>
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Cutoff Trends & Forecasting</span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-900/40">OLS Model</span>
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Scholarships & Concessions</span>
                  <span className="text-[10px] text-slate-500">Rule-Based</span>
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Prediction Audit Logs</span>
                  <span className="text-[10px] text-slate-500">User History</span>
                </Link>
              </li>
              <li>
                <Link to="/references" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Academic Literature</span>
                  <span className="text-[10px] text-slate-500">References</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Technical Architecture */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Technical Stack</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-300 font-semibold">Machine Learning</span>
                  <span className="text-slate-400 font-mono">Scikit-Learn</span>
                </div>
                <p className="text-[10px] text-slate-500">Random Forest Classifier (n_estimators=100)</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-300 font-semibold">Backend Service</span>
                  <span className="text-slate-400 font-mono">FastAPI</span>
                </div>
                <p className="text-[10px] text-slate-500">Asynchronous REST API & Pydantic Validation</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-300 font-semibold">Frontend Client</span>
                  <span className="text-slate-400 font-mono">React 18 + Vite</span>
                </div>
                <p className="text-[10px] text-slate-500">Single Page Architecture & Tailwind CSS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Advisory Strip */}
        <div className="pt-10 mt-10 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p className="text-slate-400">
            &copy; 2025–2026 <strong className="text-white">University Admission Prediction System (UAPS)</strong>. All rights reserved.
          </p>

          <p className="text-[11px] text-slate-400 text-center max-w-xl">
            <strong className="text-slate-300">Decision Advisory:</strong> Predictions and cutoff projections are data-driven estimates calibrated on historical counseling statistics to support institutional guidance.
          </p>

          <div className="flex items-center space-x-4 shrink-0">
            <Link to="/references" className="text-slate-400 hover:text-white transition">
              Academic References
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
