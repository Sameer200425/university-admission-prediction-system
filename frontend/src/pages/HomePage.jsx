import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calculator,
  GraduationCap,
  GitCompare,
  TrendingUp,
  Award,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react'

export default function HomePage({ onOpenCalculator }) {
  const navigate = useNavigate()

  const features = [
    {
      title: 'Random Forest Admission Predictor',
      description: 'Calculates high (>85%), medium (50-85%), and low (<50%) chances across 110+ colleges based on cutoff mark and community quota.',
      link: '/predict',
      icon: Calculator,
      tag: 'Slide 10',
      color: 'blue'
    },
    {
      title: '125+ Verified Colleges Directory',
      description: 'Comprehensive directory with NIRF rankings, NAAC accreditation, annual tuition fees, hostel costs, and placement statistics.',
      link: '/colleges',
      icon: GraduationCap,
      tag: 'Slide 11',
      color: 'indigo'
    },
    {
      title: 'Side-by-Side Comparison Matrix',
      description: 'Compare up to 3 institutions simultaneously across 15+ parameters including tuition fees, placement averages, and top recruiters.',
      link: '/compare',
      icon: GitCompare,
      tag: 'Slide 13',
      color: 'purple'
    },
    {
      title: 'Cutoff Trends & Expected Forecast',
      description: 'Historical 2019-2024 cutoff trends plus 2025/2026 expected cutoffs projected using Ordinary Least Squares linear regression.',
      link: '/analytics',
      icon: TrendingUp,
      tag: 'Slide 14',
      color: 'emerald'
    },
    {
      title: 'Rule-Based Scholarship Matcher',
      description: 'Matches eligible state and national welfare schemes based on parental income, community quota, first graduate, and 7.5% govt school status.',
      link: '/scholarships',
      icon: Award,
      tag: 'Slide 11',
      color: 'amber'
    },
    {
      title: 'Degree Career ROI Calculator',
      description: 'Computes degree financial breakeven horizon and 5-year yield based on 4-year tuition, boarding costs, and campus placement compensation.',
      link: '/analytics',
      icon: BarChart3,
      tag: 'Slide 7',
      color: 'rose'
    }
  ]

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full text-xs font-semibold text-blue-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>TNEA Single-Window Counseling Intelligence Portal</span>
            <span className="text-slate-300">|</span>
            <span className="font-mono font-bold text-emerald-700">94.5% Accuracy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Predict Engineering Admission Chances in Tamil Nadu
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Calibrated on multi-year historical Tamil Nadu Engineering Admissions (TNEA) single-window counseling records (2019–2024). Evaluate your Class 12 PCM cutoff, compare 125+ accredited colleges, forecast cutoff trends, and match state scholarships.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/predict"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
            >
              <span>Start Prediction</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/colleges"
              className="px-5 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm border border-indigo-200 transition flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Explore Colleges</span>
            </Link>

            <Link
              to="/compare"
              className="px-5 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs sm:text-sm border border-purple-200 transition flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Colleges</span>
            </Link>

            <button
              onClick={onOpenCalculator}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <span>🧮 PCM Calc</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative grid background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-50/60 to-transparent pointer-events-none hidden md:block"></div>
      </section>

      {/* Key Metrics Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-3xl font-black text-blue-600 font-mono">94.5%</span>
          <span className="block text-xs font-bold text-slate-700 mt-1">Random Forest Accuracy</span>
          <span className="text-[11px] text-slate-500">100-Tree Calibrated Ensemble</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-3xl font-black text-indigo-600 font-mono">125+</span>
          <span className="block text-xs font-bold text-slate-700 mt-1">Accredited TN Colleges</span>
          <span className="text-[11px] text-slate-500">NIRF & NAAC Verified Data</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-3xl font-black text-emerald-600 font-mono">2019-26</span>
          <span className="block text-xs font-bold text-slate-700 mt-1">Cutoff Trend Outlook</span>
          <span className="text-[11px] text-slate-500">Linear Regression Projections</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-3xl font-black text-amber-600 font-mono">100%</span>
          <span className="block text-xs font-bold text-slate-700 mt-1">Fee Concession Match</span>
          <span className="text-[11px] text-slate-500">Post-Matric & First Graduate</span>
        </div>
      </section>

      {/* Quick Verified Presentation Test Scenarios */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold mb-1">
              FINAL REVIEW PRESETS
            </div>
            <h2 className="text-xl font-bold text-white">Presentation Slide Quick Loaders</h2>
            <p className="text-xs text-slate-400">Click any preset below to test verified academic evaluation scenarios in one click.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Preset 1: Slide 10 */}
          <div
            onClick={() => navigate('/predict?cutoff=185.0&community=BC&course=CSE')}
            className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase block">Slide 10 Scenario</span>
            <span className="text-sm font-bold text-white mt-1 block group-hover:text-blue-300 transition">
              BC 185.0 Cutoff CSE
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              High: K.L.N. (5901) | Med: Sri Krishna (2718) | Low: CEG (0001)
            </p>
            <span className="text-blue-400 font-semibold mt-3 inline-block">Run Predictor ➔</span>
          </div>

          {/* Preset 2: Slide 11 */}
          <div
            onClick={() => navigate('/colleges?district=Chennai&maxFees=200000')}
            className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-indigo-500 transition cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase block">Slide 11 Directory</span>
            <span className="text-sm font-bold text-white mt-1 block group-hover:text-indigo-300 transition">
              Chennai &lt; ₹2 Lakhs
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Filters to 28 Chennai colleges with fees below ₹2 Lakhs.
            </p>
            <span className="text-indigo-400 font-semibold mt-3 inline-block">View Colleges ➔</span>
          </div>

          {/* Preset 3: Slide 11 Scholarship */}
          <div
            onClick={() => navigate('/scholarships?income=150000&comm=SC')}
            className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-emerald-500 transition cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">Slide 11 Scholarships</span>
            <span className="text-sm font-bold text-white mt-1 block group-hover:text-emerald-300 transition">
              SC & ₹1.5L Income
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Matches Post Matric SC/ST Waiver & First Graduate Concession.
            </p>
            <span className="text-emerald-400 font-semibold mt-3 inline-block">Check Schemes ➔</span>
          </div>

          {/* Preset 4: Slide 13 Benchmark */}
          <div
            onClick={() => navigate('/compare?codes=0001,2006,5901')}
            className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-purple-500 transition cursor-pointer group"
          >
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase block">Slide 13 Benchmark</span>
            <span className="text-sm font-bold text-white mt-1 block group-hover:text-purple-300 transition">
              CEG vs PSG vs K.L.N.
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Side-by-side 15+ parameter institutional benchmark matrix.
            </p>
            <span className="text-purple-400 font-semibold mt-3 inline-block">Compare Matrix ➔</span>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Integrated Decision Modules
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              All tools connected seamlessly to verified TNEA datasets and predictive scikit-learn models.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="dashboard-card p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <Link
                  to={item.link}
                  className="pt-2 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition"
                >
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
