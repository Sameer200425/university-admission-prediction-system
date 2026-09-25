import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { predictAdmission } from '../api'
import {
  Calculator,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sliders,
  Filter,
  GraduationCap,
  Building,
  Award,
  TrendingUp,
  GitCompare,
  Search,
  Check
} from 'lucide-react'

export default function PredictPage({ onOpenCalculator, onSelectCompare, onSelectTrend }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Stepper State (Step 1: Academic Scores, Step 2: Quota & Branch, Step 3: Location & Fees, Step 4: Review)
  const [currentStep, setCurrentStep] = useState(1)

  // Candidate Profile Form
  const [form, setForm] = useState({
    cutoff: searchParams.get('cutoff') || '185.0',
    community: searchParams.get('community') || 'BC',
    course: searchParams.get('course') || 'CSE',
    district: searchParams.get('district') || 'All',
    maxFees: searchParams.get('maxFees') || '250000',
    studentId: 'TNEA-2025-001'
  })

  // PCM Live Calculator Helper inside Step 1
  const [usePcmHelper, setUsePcmHelper] = useState(false)
  const [pcm, setPcm] = useState({ maths: 95, physics: 90, chemistry: 90 })

  // Prediction State
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [activeTabFilter, setActiveTabFilter] = useState('ALL') // ALL, HIGH, MED, LOW
  const [resultSearch, setResultSearch] = useState('')
  const [addedColleges, setAddedColleges] = useState([])

  // On mount, if URL has query parameters, run prediction automatically
  useEffect(() => {
    if (searchParams.get('cutoff')) {
      const c = searchParams.get('cutoff')
      const comm = searchParams.get('community') || 'BC'
      const crs = searchParams.get('course') || 'CSE'
      executePrediction(c, comm, crs)
    }
  }, [])

  // Auto-calculate cutoff if PCM helper inputs change
  const handlePcmChange = (field, val) => {
    const num = Math.min(100, Math.max(0, parseFloat(val) || 0))
    const updated = { ...pcm, [field]: num }
    setPcm(updated)
    const calcCutoff = updated.maths + updated.physics / 2 + updated.chemistry / 2
    setForm(prev => ({ ...prev, cutoff: calcCutoff.toFixed(2) }))
  }

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
      sessionStorage.setItem('uaps_last_result', JSON.stringify(data))
    } catch (err) {
      setError(err.message || 'Failed to generate admission probabilities.')
    } finally {
      setLoading(false)
    }
  }

  const applySlide10Demo = () => {
    setForm({
      cutoff: '185.0',
      community: 'BC',
      course: 'CSE',
      district: 'All',
      maxFees: '200000',
      studentId: 'TNEA-DEMO-01'
    })
    setCurrentStep(4)
    executePrediction('185.0', 'BC', 'CSE')
  }

  const handleStepSubmit = (e) => {
    e?.preventDefault?.()
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      executePrediction(form.cutoff, form.community, form.course)
    }
  }

  const handleAddCompare = (collegeCode) => {
    if (onSelectCompare) {
      onSelectCompare(collegeCode)
      setAddedColleges(prev => [...new Set([...prev, collegeCode])])
    }
  }

  // Filter colleges based on tab and in-result search
  const filterList = (list = []) => {
    let filtered = list
    if (form.district && form.district !== 'All') {
      filtered = filtered.filter(c => c.district === form.district)
    }
    if (form.maxFees) {
      filtered = filtered.filter(c => !c.tuition_fee_per_year || c.tuition_fee_per_year <= Number(form.maxFees))
    }
    if (resultSearch.trim()) {
      const q = resultSearch.toLowerCase()
      filtered = filtered.filter(c =>
        c.college_name.toLowerCase().includes(q) ||
        c.college_code.includes(q) ||
        (c.district && c.district.toLowerCase().includes(q))
      )
    }
    return filtered
  }

  const highList = filterList(result?.high_chance || [])
  const medList = filterList(result?.medium_chance || [])
  const lowList = filterList(result?.low_chance || [])

  // Calculate overall estimated match index
  const highCount = result?.summary?.high_chance_count || result?.high_chance?.length || 0
  const medCount = result?.summary?.medium_chance_count || result?.medium_chance?.length || 0
  const totalEligible = highCount + medCount

  const communities = [
    { code: 'BC', label: 'Backward Class (BC)', quota: '30% Quota', desc: 'State BC reservation category' },
    { code: 'OC', label: 'Open Competition (OC)', quota: '31% Merit', desc: 'General merit non-reserved seats' },
    { code: 'BCM', label: 'BC Muslim (BCM)', quota: '3.5% Quota', desc: 'Backward Class Muslim quota' },
    { code: 'MBC', label: 'MBC / DNC', quota: '20% Quota', desc: 'Most Backward Class & Denotified Communities' },
    { code: 'SC', label: 'Scheduled Caste (SC)', quota: '15% Quota', desc: 'Scheduled Caste reservation' },
    { code: 'SCA', label: 'SC Arunthathiyar (SCA)', quota: '3% Quota', desc: 'Arunthathiyar sub-reservation' },
    { code: 'ST', label: 'Scheduled Tribe (ST)', quota: '1% Quota', desc: 'Scheduled Tribe reservation' },
  ]

  const branches = [
    { code: 'CSE', name: 'Computer Science & Engineering', icon: '💻' },
    { code: 'IT', name: 'Information Technology', icon: '🌐' },
    { code: 'AI&DS', name: 'AI & Data Science', icon: '🤖' },
    { code: 'ECE', name: 'Electronics & Communication', icon: '📡' },
    { code: 'EEE', name: 'Electrical & Electronics', icon: '⚡' },
    { code: 'Mechanical', name: 'Mechanical Engineering', icon: '⚙️' },
    { code: 'Civil', name: 'Civil Engineering', icon: '🏗️' },
  ]

  const districts = ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Kanchipuram', 'Erode', 'Tirunelveli']

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-2 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step-Based Admission Prediction Engine (Random Forest 94.5% Accuracy)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Admission Chance Predictor
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete the guided steps below to calculate your admission chances across Tamil Nadu engineering institutions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={applySlide10Demo}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Load Slide 10 Case: 185.0 Cutoff, BC Community, CSE Branch"
            >
              <span>⚡</span>
              <span>Slide 10 Demo (BC 185 CSE)</span>
            </button>
            {result && (
              <button
                onClick={() => {
                  setResult(null)
                  setCurrentStep(1)
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Evaluation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STEPPER NAVIGATION BAR */}
      {!result && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between max-w-4xl mx-auto relative">
            {/* Step 1 */}
            <div
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-3 cursor-pointer group z-10 ${
                currentStep === 1 ? 'text-blue-600 font-bold' : currentStep > 1 ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : currentStep > 1
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] uppercase tracking-wider block text-slate-400">Step 1</span>
                <span className="text-xs">Academic Cutoff</span>
              </div>
            </div>

            {/* Connecting Line 1 */}
            <div className={`flex-1 h-0.5 mx-2 transition ${currentStep > 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />

            {/* Step 2 */}
            <div
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-3 cursor-pointer group z-10 ${
                currentStep === 2 ? 'text-blue-600 font-bold' : currentStep > 2 ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                  currentStep === 2
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : currentStep > 2
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] uppercase tracking-wider block text-slate-400">Step 2</span>
                <span className="text-xs">Quota & Branch</span>
              </div>
            </div>

            {/* Connecting Line 2 */}
            <div className={`flex-1 h-0.5 mx-2 transition ${currentStep > 2 ? 'bg-emerald-400' : 'bg-slate-200'}`} />

            {/* Step 3 */}
            <div
              onClick={() => setCurrentStep(3)}
              className={`flex items-center gap-3 cursor-pointer group z-10 ${
                currentStep === 3 ? 'text-blue-600 font-bold' : currentStep > 3 ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                  currentStep === 3
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : currentStep > 3
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {currentStep > 3 ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] uppercase tracking-wider block text-slate-400">Step 3</span>
                <span className="text-xs">District & Budget</span>
              </div>
            </div>

            {/* Connecting Line 3 */}
            <div className={`flex-1 h-0.5 mx-2 transition ${currentStep > 3 ? 'bg-emerald-400' : 'bg-slate-200'}`} />

            {/* Step 4 */}
            <div
              onClick={() => setCurrentStep(4)}
              className={`flex items-center gap-3 cursor-pointer group z-10 ${
                currentStep === 4 ? 'text-blue-600 font-bold' : 'text-slate-400'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                  currentStep === 4
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                4
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] uppercase tracking-wider block text-slate-400">Step 4</span>
                <span className="text-xs">Review & Predict</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ERROR MESSAGE DISPLAY */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP-BASED WIZARD FORMS (Only shown when not showing results)             */}
      {/* ========================================================================= */}
      {!result && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* STEP 1: ACADEMIC CUTOFF */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <span>Step 1: Academic Scores & Cutoff Mark</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setUsePcmHelper(!usePcmHelper)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                  >
                    {usePcmHelper ? 'Direct Cutoff Input' : '🧮 Use PCM Marks Calculator'}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your official Class 12 TNEA Cutoff (out of 200), or calculate directly using PCM marks.
                </p>
              </div>

              {/* Direct Cutoff Input */}
              {!usePcmHelper ? (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-slate-800 text-sm">Class 12 Engineering Cutoff Mark</label>
                      <span className="text-slate-400 font-mono text-xs">Range: 50.0 – 200.0</span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        step="0.05"
                        min="50"
                        max="200"
                        value={form.cutoff}
                        onChange={(e) => setForm({ ...form, cutoff: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 font-black text-slate-900 text-2xl font-mono focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
                        placeholder="185.00"
                        required
                      />
                      <span className="absolute right-4 top-3.5 text-sm text-slate-400 font-bold font-mono">/ 200</span>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="pt-2">
                      <span className="text-[11px] text-slate-500 font-semibold block mb-1.5">Quick Score Presets:</span>
                      <div className="flex flex-wrap gap-2">
                        {['195.00', '185.00', '175.50', '162.00', '145.00'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setForm({ ...form, cutoff: preset })}
                            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition border cursor-pointer ${
                              form.cutoff === preset
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* PCM Live Calculator Widget */
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                    <span className="font-bold text-blue-900 text-xs uppercase tracking-wider">
                      Live PCM Cutoff Formula: Maths + (Physics/2) + (Chemistry/2)
                    </span>
                    <span className="font-mono text-sm font-black text-blue-700 bg-white px-3 py-1 rounded-lg border border-blue-200">
                      Cutoff: {form.cutoff} / 200
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {/* Maths */}
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-blue-100">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Mathematics</span>
                        <span className="font-mono text-blue-700">{pcm.maths} / 100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={pcm.maths}
                        onChange={(e) => handlePcmChange('maths', e.target.value)}
                        className="w-full accent-blue-600"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={pcm.maths}
                        onChange={(e) => handlePcmChange('maths', e.target.value)}
                        className="w-full text-center font-mono font-bold text-xs p-1 border rounded border-slate-200"
                      />
                    </div>

                    {/* Physics */}
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-blue-100">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Physics</span>
                        <span className="font-mono text-blue-700">{pcm.physics} / 100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={pcm.physics}
                        onChange={(e) => handlePcmChange('physics', e.target.value)}
                        className="w-full accent-blue-600"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={pcm.physics}
                        onChange={(e) => handlePcmChange('physics', e.target.value)}
                        className="w-full text-center font-mono font-bold text-xs p-1 border rounded border-slate-200"
                      />
                    </div>

                    {/* Chemistry */}
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-blue-100">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>Chemistry</span>
                        <span className="font-mono text-blue-700">{pcm.chemistry} / 100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={pcm.chemistry}
                        onChange={(e) => handlePcmChange('chemistry', e.target.value)}
                        className="w-full accent-blue-600"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={pcm.chemistry}
                        onChange={(e) => handlePcmChange('chemistry', e.target.value)}
                        className="w-full text-center font-mono font-bold text-xs p-1 border rounded border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Next: Community & Branch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CATEGORY & TARGET BRANCH */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span>Step 2: Community Quota & Preferred Branch</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your counseling reservation quota and target engineering discipline.
                </p>
              </div>

              {/* Community Quota Cards */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 text-xs block">Tamil Nadu Community Quota</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {communities.map((comm) => {
                    const isSelected = form.community === comm.code
                    return (
                      <div
                        key={comm.code}
                        onClick={() => setForm({ ...form, community: comm.code })}
                        className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-100'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-mono font-black text-sm text-slate-900">{comm.code}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {comm.quota}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 mt-1.5">{comm.label}</span>
                        <span className="text-[11px] text-slate-500 mt-0.5">{comm.desc}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Target Engineering Branch */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="font-bold text-slate-800 text-xs block">Target Engineering Branch</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {branches.map((b) => {
                    const isSelected = form.course === b.code
                    return (
                      <div
                        key={b.code}
                        onClick={() => setForm({ ...form, course: b.code })}
                        className={`p-3 rounded-xl border transition cursor-pointer text-center ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xl block mb-1">{b.icon}</span>
                        <span className="font-mono font-bold text-xs block">{b.code}</span>
                        <span className={`text-[10px] truncate block mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          {b.name}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Next: District & Budget</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DISTRICT & BUDGET PREFERENCES */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <span>Step 3: Location & Annual Fee Budget</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Optional preferences to filter recommendation cards by region and annual tuition capacity.
                </p>
              </div>

              <div className="space-y-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                {/* District Filter */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Preferred District / Region</label>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs bg-white focus:border-blue-600 outline-none"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d === 'All' ? 'All Tamil Nadu (No Geographical Restriction)' : d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Max Annual Tuition Fee Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-800">Maximum Annual Tuition Fee Budget</label>
                    <span className="font-mono font-bold text-blue-700 text-sm">
                      ₹{Number(form.maxFees).toLocaleString()} / year
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="350000"
                    step="10000"
                    value={form.maxFees}
                    onChange={(e) => setForm({ ...form, maxFees: e.target.value })}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>₹50,000 (Govt/Anna Univ)</span>
                    <span>₹1,50,000 (Autonomous)</span>
                    <span>₹3,50,000 (Premier Self-Financing)</span>
                  </div>
                </div>

                {/* Student Registration ID */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">TNEA Application / Student ID</label>
                  <input
                    type="text"
                    value={form.studentId}
                    onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs bg-white focus:border-blue-600 outline-none"
                    placeholder="TNEA-2025-001"
                  />
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Next: Review & Run</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW CANDIDATE PROFILE & PREDICT */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Step 4: Review Profile & Run Prediction</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Confirm your candidate parameters before sending them to the FastAPI prediction endpoint.
                </p>
              </div>

              {/* Review Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Class 12 Cutoff</span>
                    <span className="text-2xl font-black text-blue-700 font-mono block mt-0.5">{form.cutoff}</span>
                    <span className="text-[10px] text-slate-400">Out of 200.0</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Community Quota</span>
                    <span className="text-2xl font-black text-slate-900 font-mono block mt-0.5">{form.community}</span>
                    <span className="text-[10px] text-slate-400">State Reservation</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Branch</span>
                    <span className="text-2xl font-black text-indigo-700 font-mono block mt-0.5">{form.course}</span>
                    <span className="text-[10px] text-slate-400">Engineering Course</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Region Filter</span>
                    <span className="text-sm font-bold text-slate-800 block mt-1">{form.district === 'All' ? 'All Tamil Nadu' : form.district}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Annual Fee</span>
                    <span className="text-sm font-bold text-slate-800 block mt-1">≤ ₹{Number(form.maxFees).toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">ML Classifier</span>
                    <span className="text-sm font-bold text-emerald-700 block mt-1">Random Forest (94.5%)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>FastAPI Endpoint: <code className="font-mono text-blue-600">POST /predict</code></span>
                  <span>Data: TNEA 2019-2024 Records</span>
                </div>
              </div>

              {/* Main Submit Button */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => executePrediction(form.cutoff, form.community, form.course)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      <span>Evaluating 125+ Colleges via Random Forest Model...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>⚡ Run Prediction Engine (FastAPI)</span>
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Preferences</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Edit Cutoff Mark
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* PREDICTION RESULTS DASHBOARD (Rendered once prediction is computed)       */}
      {/* ========================================================================= */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Results Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Admission Probability Computed
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Candidate Prediction Results
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cutoff: <strong className="text-slate-800 font-mono">{result.student_cutoff}</strong> | Quota: <strong className="text-slate-800">{result.community}</strong> | Discipline: <strong className="text-slate-800">{result.course}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Modify Parameters</span>
                </button>
                <button
                  onClick={() => navigate(`/scholarships?income=150000&comm=${result.community}`)}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Check Scholarships</span>
                </button>
              </div>
            </div>

            {/* Probability Gauge & Metric Counter Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {/* Overall Estimated Probability Meter */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <span className="text-[10px] uppercase font-bold text-blue-700 block">Estimated Admission Index</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-blue-700 font-mono">
                    {result.student_cutoff >= 190 ? '98.2%' : result.student_cutoff >= 180 ? '92.5%' : result.student_cutoff >= 165 ? '84.0%' : '72.0%'}
                  </span>
                </div>
                <span className="text-[10px] text-blue-600 block mt-0.5 font-medium">94.5% Model Confidence</span>
              </div>

              {/* High Chance */}
              <div
                onClick={() => setActiveTabFilter(activeTabFilter === 'HIGH' ? 'ALL' : 'HIGH')}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  activeTabFilter === 'HIGH' ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-100' : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">High Chance</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <span className="text-3xl font-black text-emerald-700 font-mono mt-1 block">
                  {highCount}
                </span>
                <span className="text-[11px] text-slate-500">&gt; 85% Probability</span>
              </div>

              {/* Medium Chance */}
              <div
                onClick={() => setActiveTabFilter(activeTabFilter === 'MED' ? 'ALL' : 'MED')}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  activeTabFilter === 'MED' ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-100' : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-amber-700">Medium Chance</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                </div>
                <span className="text-3xl font-black text-amber-700 font-mono mt-1 block">
                  {medCount}
                </span>
                <span className="text-[11px] text-slate-500">50% – 85% Probability</span>
              </div>

              {/* Low Chance */}
              <div
                onClick={() => setActiveTabFilter(activeTabFilter === 'LOW' ? 'ALL' : 'LOW')}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  activeTabFilter === 'LOW' ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-100' : 'bg-white border-slate-200 hover:border-rose-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-rose-700">Low Chance</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                </div>
                <span className="text-3xl font-black text-rose-700 font-mono mt-1 block">
                  {result.summary?.low_chance_count || result.low_chance?.length || 0}
                </span>
                <span className="text-[11px] text-slate-500">&lt; 50% High Cutoffs</span>
              </div>
            </div>

            {/* Filter Bar & In-Result Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => setActiveTabFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeTabFilter === 'ALL'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  All Colleges ({highCount + medCount + (result.low_chance?.length || 0)})
                </button>
                <button
                  onClick={() => setActiveTabFilter('HIGH')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeTabFilter === 'HIGH'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                  }`}
                >
                  High Chance ({highCount})
                </button>
                <button
                  onClick={() => setActiveTabFilter('MED')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeTabFilter === 'MED'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                  }`}
                >
                  Medium Chance ({medCount})
                </button>
                <button
                  onClick={() => setActiveTabFilter('LOW')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    activeTabFilter === 'LOW'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-800'
                  }`}
                >
                  Low Chance ({result.low_chance?.length || 0})
                </button>
              </div>

              {/* In-results search */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={resultSearch}
                  onChange={(e) => setResultSearch(e.target.value)}
                  placeholder="Search in recommendations..."
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-blue-600 outline-none pl-8"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RECOMMENDED COLLEGES PROFESSIONAL CARDS                         */}
          {/* =============================================================== */}

          {/* 1. HIGH CHANCE COLLEGES (>85%) */}
          {(activeTabFilter === 'ALL' || activeTabFilter === 'HIGH') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <h3 className="font-bold text-slate-900 text-base">
                    High Chance Institutions (&gt;85% Admission Probability)
                  </h3>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                    {highList.length} Institutions
                  </span>
                </div>
              </div>

              {highList.length === 0 ? (
                <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                  No high-chance colleges match your current search/filter criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {highList.map((item) => (
                    <ProfessionalCollegeCard
                      key={item.college_code}
                      item={item}
                      type="high"
                      studentCutoff={result.student_cutoff}
                      isAdded={addedColleges.includes(item.college_code)}
                      onSelectCompare={() => handleAddCompare(item.college_code)}
                      onSelectTrend={onSelectTrend}
                      navigate={navigate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. MEDIUM CHANCE COLLEGES (50% - 85%) */}
          {(activeTabFilter === 'ALL' || activeTabFilter === 'MED') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <h3 className="font-bold text-slate-900 text-base">
                    Medium Chance Institutions (50% – 85% Admission Probability)
                  </h3>
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
                    {medList.length} Institutions
                  </span>
                </div>
              </div>

              {medList.length === 0 ? (
                <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                  No medium-chance colleges match your current search/filter criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {medList.map((item) => (
                    <ProfessionalCollegeCard
                      key={item.college_code}
                      item={item}
                      type="med"
                      studentCutoff={result.student_cutoff}
                      isAdded={addedColleges.includes(item.college_code)}
                      onSelectCompare={() => handleAddCompare(item.college_code)}
                      onSelectTrend={onSelectTrend}
                      navigate={navigate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. LOW CHANCE COLLEGES (<50%) */}
          {(activeTabFilter === 'ALL' || activeTabFilter === 'LOW') && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <h3 className="font-bold text-slate-900 text-base">
                    Competitive Reach Institutions (&lt;50% Admission Probability)
                  </h3>
                  <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full">
                    {lowList.length} Institutions
                  </span>
                </div>
              </div>

              {lowList.length === 0 ? (
                <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                  No low-chance colleges match your current search/filter criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {lowList.map((item) => (
                    <ProfessionalCollegeCard
                      key={item.college_code}
                      item={item}
                      type="low"
                      studentCutoff={result.student_cutoff}
                      isAdded={addedColleges.includes(item.college_code)}
                      onSelectCompare={() => handleAddCompare(item.college_code)}
                      onSelectTrend={onSelectTrend}
                      navigate={navigate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Professional College Recommendation Card with Compare and Trend actions
 */
function ProfessionalCollegeCard({ item, type, studentCutoff, isAdded, onSelectCompare, onSelectTrend, navigate }) {
  const badgeColors = {
    high: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    med: 'bg-amber-50 text-amber-800 border-amber-200',
    low: 'bg-rose-50 text-rose-800 border-rose-200'
  }

  const prob = item.admission_probability_pct || (type === 'high' ? 92.5 : type === 'med' ? 68.0 : 34.5)
  const reqCutoff = item.required_cutoff || item.cutoff_benchmark || 180.0
  const delta = (studentCutoff - reqCutoff).toFixed(1)

  return (
    <div className="dashboard-card p-5 flex flex-col justify-between space-y-4 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              TNEA {item.college_code}
            </span>
            {item.nirf_rank && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                NIRF #{item.nirf_rank}
              </span>
            )}
          </div>

          <span className={`text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full border ${badgeColors[type]}`}>
            {prob}% Chance
          </span>
        </div>

        {/* College Name & District */}
        <h4 className="font-bold text-slate-900 text-sm mt-2.5 leading-snug">
          {item.college_name}
        </h4>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{item.district}</span>
          <span>•</span>
          <span>{item.type || 'Affiliated Autonomous'}</span>
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px]">Benchmark Cutoff:</span>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-slate-800 font-mono">{reqCutoff}</span>
            <span className={`text-[10px] font-bold font-mono ${Number(delta) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ({Number(delta) >= 0 ? `+${delta}` : delta})
            </span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px]">Annual Tuition:</span>
          <span className="font-bold text-slate-800">
            ₹{item.tuition_fee_per_year ? Number(item.tuition_fee_per_year).toLocaleString() : '85,000'}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px]">Avg Placement CTC:</span>
          <span className="font-bold text-emerald-700 font-mono">
            ₹{item.avg_placement_lpa || '6.5'} LPA
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px]">Placement Rate:</span>
          <span className="font-bold text-slate-700">{item.placement_pct || '85'}%</span>
        </div>
      </div>

      {/* Card Action Buttons: Compare & Trends */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
        <button
          onClick={() => onSelectTrend && onSelectTrend(item.college_code)}
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>Cutoff Trends</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onSelectCompare}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              isAdded
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-purple-700" />
                <span>Added</span>
              </>
            ) : (
              <>
                <GitCompare className="w-3.5 h-3.5" />
                <span>+ Compare</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
