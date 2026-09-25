import React, { useState, useEffect } from 'react'
import { calculateRoi } from '../api'

export default function RoiCalculatorPage() {
  const [form, setRoiForm] = useState({
    annualTuition: '140000',
    annualHostel: '75000',
    annualMisc: '15000',
    avgPlacementLpa: '7.5',
    scholarshipWaiver: '0',
    durationYears: '4'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    runCalculation('140000', '75000', '7.5', '0')
  }, [])

  const runCalculation = async (tuition, hostel, lpa, waiver) => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        annual_tuition: parseFloat(tuition) || 0,
        annual_hostel: parseFloat(hostel) || 0,
        annual_misc: parseFloat(form.annualMisc) || 0,
        avg_placement_lpa: parseFloat(lpa) || 6.0,
        annual_scholarship_waiver: parseFloat(waiver) || 0,
        course_duration_years: parseInt(form.durationYears) || 4
      }
      const data = await calculateRoi(payload)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Failed to compute educational ROI.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hero-glow-bg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 rounded-full text-xs font-semibold text-indigo-300 mb-2">
            <span>📊 Career Financial Intelligence</span>
            <span>•</span>
            <span className="font-mono text-cyan-300">Degree Breakeven & Yield</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Educational Return on Investment (ROI) Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Compare total 4-year financial degree expenditure (tuition, boarding, equipment) against expected campus placement compensation to determine breakeven years and 5-year returns.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Input Form Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
        <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
          <span>💼</span>
          <span>Cost & Placement Parameters</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Annual Tuition Fee (₹)</label>
            <input
              type="number"
              value={form.annualTuition}
              onChange={(e) => setRoiForm({ ...form, annualTuition: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl input-dark text-white font-bold font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Annual Hostel & Living (₹)</label>
            <input
              type="number"
              value={form.annualHostel}
              onChange={(e) => setRoiForm({ ...form, annualHostel: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl input-dark text-white font-bold font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Average Placement CTC (LPA)</label>
            <input
              type="number"
              step="0.25"
              value={form.avgPlacementLpa}
              onChange={(e) => setRoiForm({ ...form, avgPlacementLpa: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl input-dark text-white font-bold font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Annual Scholarship / Waiver (₹)</label>
            <input
              type="number"
              value={form.scholarshipWaiver}
              onChange={(e) => setRoiForm({ ...form, scholarshipWaiver: e.target.value })}
              placeholder="e.g. 25000"
              className="w-full px-3.5 py-2.5 rounded-xl input-dark text-white font-bold font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/5">
          <button
            onClick={() => runCalculation(form.annualTuition, form.annualHostel, form.avgPlacementLpa, form.scholarshipWaiver)}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>⚡</span>
            )}
            <span>Calculate Career ROI</span>
          </button>
        </div>
      </div>

      {/* Output Metric Cards */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total 4-Year Cost</span>
              <span className="text-2xl font-black text-white font-mono block">
                {result.total_4yr_investment_formatted}
              </span>
              <span className="text-[11px] text-slate-400 block">Tuition, Hostel & Expenses</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-blue-500/20 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-400 block tracking-wider">Annual Starting CTC</span>
              <span className="text-2xl font-black text-blue-300 font-mono block">
                {result.annual_starting_ctc_formatted}
              </span>
              <span className="text-[11px] text-slate-400 block">
                {result.avg_placement_package_lpa} LPA Package
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">Breakeven Period</span>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-2xl font-black text-emerald-300 font-mono block">
                  {result.breakeven_years}
                </span>
                <span className="text-xs text-slate-400">Years</span>
              </div>
              <span className="text-[11px] text-slate-400 block">Investment Recovery Horizon</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 glow-primary text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block tracking-wider">5-Year Career Yield</span>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 font-mono block">
                +{result.roi_percentage}%
              </span>
              <span className="text-[11px] font-bold text-emerald-400 block">
                {result.roi_rating || 'Strong Return'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
