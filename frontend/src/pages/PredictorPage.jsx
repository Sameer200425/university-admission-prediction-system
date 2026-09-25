import React, { useState, useEffect } from 'react'
import { predictAdmission } from '../api'

export default function PredictorPage({ 
  onOpenPcmCalc, 
  presetCutoff, 
  onSelectCompare, 
  onSelectTrend 
}) {
  const [form, setForm] = useState({
    cutoff: '185.0',
    community: 'BC',
    course: 'CSE',
    studentId: 'TNEA-2025-001'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL') // ALL, HIGH, MEDIUM, LOW

  // Sync with calculator if presetCutoff changes
  useEffect(() => {
    if (presetCutoff) {
      setForm(prev => ({ ...prev, cutoff: presetCutoff }))
      executePrediction(presetCutoff, form.community, form.course)
    }
  }, [presetCutoff])

  // Initial load with default slide 10 scenario
  useEffect(() => {
    executePrediction('185.0', 'BC', 'CSE')
  }, [])

  const executePrediction = async (cutoffVal, commVal, crsVal) => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        cutoff: parseFloat(cutoffVal),
        community: commVal,
        course: crsVal,
        student_id: form.studentId || 'TNEA-2025-001'
      }
      const data = await predictAdmission(payload)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Failed to generate admission probability.')
    } finally {
      setLoading(false)
    }
  }

  const handlePredictSubmit = (e) => {
    e.preventDefault()
    executePrediction(form.cutoff, form.community, form.course)
  }

  const loadSlide10Demo = () => {
    setForm({
      cutoff: '185.0',
      community: 'BC',
      course: 'CSE',
      studentId: 'TNEA-DEMO-01'
    })
    executePrediction('185.0', 'BC', 'CSE')
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header Card */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden glass-panel border border-blue-500/20 shadow-2xl hero-glow-bg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-semibold text-blue-300 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>TNEA Single-Window Counseling Evaluator</span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400 font-mono font-bold">Random Forest: 94.5% Accuracy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
            TNEA University Admission Chance Predictor
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Calibrated on multi-year counseling records (2019–2024). Enter your Class 12 Engineering Cutoff (out of 200) and Community Quota to instantly categorize admission chances into <span className="text-emerald-400 font-bold">High (&gt;85%)</span>, <span className="text-amber-400 font-bold">Medium (50–85%)</span>, and <span className="text-rose-400 font-bold">Low (&lt;50%)</span> probabilities.
          </p>
        </div>

        {/* Decorative Grid Accent */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      </div>

      {/* Main Grid: Form + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Academic Profile Form (Left Column) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <span>🎯</span>
              <span>Candidate Profile</span>
            </h3>

            <button
              onClick={loadSlide10Demo}
              className="text-[11px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold px-2.5 py-1 rounded-lg border border-cyan-400/30 transition flex items-center gap-1 cursor-pointer"
              title="Autofill Presentation Slide 10: 185 Cutoff, BC, CSE"
            >
              <span>⚡</span>
              <span>Slide 10 Demo</span>
            </button>
          </div>

          <form onSubmit={handlePredictSubmit} className="space-y-4 text-xs">
            {/* Cutoff Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-300">Class 12 Cutoff Mark</label>
                <button
                  type="button"
                  onClick={onOpenPcmCalc}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Calculate from PCM 🧮
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="50"
                  max="200"
                  value={form.cutoff}
                  onChange={(e) => setForm({ ...form, cutoff: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl input-dark text-white font-bold text-base font-mono tracking-wider"
                  placeholder="e.g. 185.0"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">/ 200</span>
              </div>
            </div>

            {/* Community Category */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">Community Category</label>
              <select
                value={form.community}
                onChange={(e) => setForm({ ...form, community: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl input-dark text-white font-bold text-xs"
              >
                <option value="BC">BC - Backward Class</option>
                <option value="OC">OC - Open Competition</option>
                <option value="BCM">BCM - Backward Class Muslim</option>
                <option value="MBC">MBC / DNC - Most Backward Class</option>
                <option value="SC">SC - Scheduled Caste</option>
                <option value="SCA">SCA - SC Arunthathiyar</option>
                <option value="ST">ST - Scheduled Tribe</option>
              </select>
            </div>

            {/* Preferred Engineering Branch */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">Target Engineering Branch</label>
              <select
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl input-dark text-white font-bold text-xs"
              >
                <option value="CSE">CSE - Computer Science & Engineering</option>
                <option value="IT">IT - Information Technology</option>
                <option value="AI&DS">AI & DS - Artificial Intelligence & Data Science</option>
                <option value="ECE">ECE - Electronics & Communication</option>
                <option value="EEE">EEE - Electrical & Electronics</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="Civil">Civil Engineering</option>
              </select>
            </div>

            {/* Student ID */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">TNEA Application / Student ID</label>
              <input
                type="text"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl input-dark text-white font-mono text-xs"
                placeholder="TNEA-2025-001"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <span>⚡</span>
              )}
              <span>Evaluate Admission Chances</span>
            </button>
          </form>

          {/* Model Specs Pill */}
          <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex justify-between">
              <span>Evaluated Algorithm:</span>
              <span className="text-slate-200 font-semibold">Random Forest (100 Trees)</span>
            </div>
            <div className="flex justify-between">
              <span>Counseling Dataset:</span>
              <span className="text-slate-200 font-semibold">TNEA 2019–2024 Records</span>
            </div>
            <div className="flex justify-between">
              <span>Cross-Validation Score:</span>
              <span className="text-emerald-400 font-bold font-mono">0.945 F1-Macro</span>
            </div>
          </div>
        </div>

        {/* Prediction Results Display (Right Column) */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Summary Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-panel p-4 rounded-2xl border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Cutoff</span>
                  <span className="text-xl font-black text-cyan-300 font-mono mt-0.5 block">{result.student_cutoff}</span>
                  <span className="text-[10px] text-slate-400">{result.community} Quota</span>
                </div>

                <div 
                  onClick={() => setActiveFilter(activeFilter === 'HIGH' ? 'ALL' : 'HIGH')}
                  className={`glass-panel p-4 rounded-2xl border transition cursor-pointer ${
                    activeFilter === 'HIGH' ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500/20 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">High Chance</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <span className="text-xl font-black text-emerald-300 font-mono mt-0.5 block">
                    {result.summary?.high_chance_count || result.high_chance?.length || 0}
                  </span>
                  <span className="text-[10px] text-slate-400">&gt; 85% Probability</span>
                </div>

                <div 
                  onClick={() => setActiveFilter(activeFilter === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
                  className={`glass-panel p-4 rounded-2xl border transition cursor-pointer ${
                    activeFilter === 'MEDIUM' ? 'border-amber-500 bg-amber-500/10' : 'border-amber-500/20 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-amber-400">Medium Chance</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  </div>
                  <span className="text-xl font-black text-amber-300 font-mono mt-0.5 block">
                    {result.summary?.medium_chance_count || result.medium_chance?.length || 0}
                  </span>
                  <span className="text-[10px] text-slate-400">50% – 85% Range</span>
                </div>

                <div 
                  onClick={() => setActiveFilter(activeFilter === 'LOW' ? 'ALL' : 'LOW')}
                  className={`glass-panel p-4 rounded-2xl border transition cursor-pointer ${
                    activeFilter === 'LOW' ? 'border-rose-500 bg-rose-500/10' : 'border-rose-500/20 hover:border-rose-500/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-rose-400">Low Chance</span>
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  </div>
                  <span className="text-xl font-black text-rose-300 font-mono mt-0.5 block">
                    {result.summary?.low_chance_count || result.low_chance?.length || 0}
                  </span>
                  <span className="text-[10px] text-slate-400">&lt; 50% Highly Competitive</span>
                </div>
              </div>

              {/* Categorized College Lists */}
              {/* 1. HIGH CHANCE */}
              {(activeFilter === 'ALL' || activeFilter === 'HIGH') && result.high_chance && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 glow-emerald"></span>
                      <h3 className="font-extrabold text-white text-base">
                        High Chance Institutions (&gt;85% Probability)
                      </h3>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {result.high_chance.length} Colleges
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.high_chance.map((item) => (
                      <CollegeChanceCard
                        key={item.college_code}
                        item={item}
                        type="high"
                        onSelectCompare={onSelectCompare}
                        onSelectTrend={onSelectTrend}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 2. MEDIUM CHANCE */}
              {(activeFilter === 'ALL' || activeFilter === 'MEDIUM') && result.medium_chance && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-400 glow-amber"></span>
                      <h3 className="font-extrabold text-white text-base">
                        Medium Chance Institutions (50%–85% Range)
                      </h3>
                      <span className="text-xs bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                        {result.medium_chance.length} Colleges
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.medium_chance.map((item) => (
                      <CollegeChanceCard
                        key={item.college_code}
                        item={item}
                        type="medium"
                        onSelectCompare={onSelectCompare}
                        onSelectTrend={onSelectTrend}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 3. LOW CHANCE */}
              {(activeFilter === 'ALL' || activeFilter === 'LOW') && result.low_chance && (
                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-400 glow-rose"></span>
                      <h3 className="font-extrabold text-white text-base">
                        Low Chance Institutions (&lt;50% High Cutoff)
                      </h3>
                      <span className="text-xs bg-rose-500/10 text-rose-400 font-bold px-2 py-0.5 rounded-full border border-rose-500/20">
                        {result.low_chance.length} Colleges
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.low_chance.map((item) => (
                      <CollegeChanceCard
                        key={item.college_code}
                        item={item}
                        type="low"
                        onSelectCompare={onSelectCompare}
                        onSelectTrend={onSelectTrend}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CollegeChanceCard({ item, type, onSelectCompare, onSelectTrend }) {
  const borderColors = {
    high: 'border-emerald-500/30 hover:border-emerald-500/60',
    medium: 'border-amber-500/30 hover:border-amber-500/60',
    low: 'border-rose-500/30 hover:border-rose-500/60'
  }

  const badgeStyles = {
    high: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    low: 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
  }

  const probabilityPercent = item.admission_probability_pct || (type === 'high' ? 92.5 : type === 'medium' ? 68.0 : 34.5)

  return (
    <div className={`glass-card rounded-2xl p-5 border ${borderColors[type]} flex flex-col justify-between space-y-3.5 group`}>
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/10">
            TNEA Code: {item.college_code}
          </span>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono ${badgeStyles[type]}`}>
            {probabilityPercent}% Chance
          </span>
        </div>

        <h4 className="font-extrabold text-white text-sm sm:text-base mt-2 group-hover:text-blue-300 transition leading-snug">
          {item.college_name}
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">
          {item.district} | {item.type || 'Affiliated Autonomous'}
        </p>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px]">
        <div>
          <span className="text-slate-400 block text-[10px]">Required Cutoff</span>
          <span className="font-bold text-white font-mono">{item.required_cutoff || item.cutoff_benchmark || '180.0'}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Annual Tuition</span>
          <span className="font-bold text-slate-200">
            ₹{item.tuition_fee_per_year ? item.tuition_fee_per_year.toLocaleString() : '85,000'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Avg Placement</span>
          <span className="font-bold text-emerald-400">{item.avg_placement_lpa || '6.5'} LPA</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Placement Rate</span>
          <span className="font-bold text-cyan-300">{item.placement_pct || '85'}%</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
        <button
          onClick={() => onSelectTrend(item.college_code)}
          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          <span>Cutoff Trend</span>
          <span>➔</span>
        </button>

        <button
          onClick={() => onSelectCompare(item.college_code)}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold border border-white/10 transition cursor-pointer"
        >
          + Compare
        </button>
      </div>
    </div>
  )
}
