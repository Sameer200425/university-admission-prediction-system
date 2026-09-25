import React, { useState, useEffect } from 'react'
import { fetchCutoffTrend, calculateRoi } from '../api'
import { TrendingUp, BarChart3, LineChart, Award, DollarSign, Calculator, ArrowRight } from 'lucide-react'

export default function AnalyticsPage({ selectedCollegeCode = '0001' }) {
  // Trends State (Slide 14)
  const [collegeCode, setCollegeCode] = useState(selectedCollegeCode)
  const [course, setCourse] = useState('CSE')
  const [community, setCommunity] = useState('BC')
  const [trendData, setTrendData] = useState(null)
  const [trendLoading, setTrendLoading] = useState(false)
  const [trendError, setTrendError] = useState('')

  // ROI State (Slide 7)
  const [roiForm, setRoiForm] = useState({
    annualTuition: '140000',
    annualHostel: '75000',
    annualMisc: '15000',
    avgPlacementLpa: '7.5',
    scholarshipWaiver: '0',
    durationYears: '4'
  })
  const [roiResult, setRoiResult] = useState(null)
  const [roiLoading, setRoiLoading] = useState(false)

  useEffect(() => {
    loadTrends(collegeCode, course, community)
    runRoiCalculation(roiForm.annualTuition, roiForm.annualHostel, roiForm.avgPlacementLpa, roiForm.scholarshipWaiver)
  }, [])

  const loadTrends = async (code, crs, comm) => {
    setTrendLoading(true)
    setTrendError('')
    try {
      const data = await fetchCutoffTrend(code, crs, comm)
      setTrendData(data)
    } catch (err) {
      setTrendError(err.message || 'Failed to load cutoff trend analysis.')
    } finally {
      setTrendLoading(false)
    }
  }

  const runRoiCalculation = async (tuition, hostel, lpa, waiver) => {
    setRoiLoading(true)
    try {
      const payload = {
        annual_tuition_fee: parseFloat(tuition) || 0,
        annual_hostel_fee: parseFloat(hostel) || 0,
        annual_misc_fee: parseFloat(roiForm.annualMisc) || 0,
        avg_placement_package_lpa: parseFloat(lpa) || 6.0,
        scholarship_waiver_per_year: parseFloat(waiver) || 0,
        course_duration_years: parseInt(roiForm.durationYears) || 4
      }
      const data = await calculateRoi(payload)
      setRoiResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setRoiLoading(false)
    }
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* SECTION 1: CUTOFF TRENDS & FORECAST (SLIDE 14) */}
      <section className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-2 border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Ordinary Least Squares Linear Regression Model</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Historical Cutoff Trends & Forecast
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visual analysis of single-window admission cutoffs (2019–2024) and projected 2025/2026 expected cutoffs.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={collegeCode}
                onChange={(e) => {
                  setCollegeCode(e.target.value)
                  loadTrends(e.target.value, course, community)
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 text-xs focus:border-blue-600 outline-none"
              >
                <option value="0001">0001 - Anna University (CEG)</option>
                <option value="0004">0004 - Madras Inst of Tech (MIT)</option>
                <option value="1315">1315 - SSN College of Engineering</option>
                <option value="2006">2006 - PSG College of Technology</option>
                <option value="2007">2007 - CIT Coimbatore</option>
                <option value="2718">2718 - Sri Krishna College of Tech</option>
                <option value="5901">5901 - K.L.N. College of Engg</option>
              </select>

              <select
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value)
                  loadTrends(collegeCode, e.target.value, community)
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 text-xs focus:border-blue-600 outline-none"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="AI&DS">AI & DS</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="Mechanical">Mechanical</option>
              </select>

              <select
                value={community}
                onChange={(e) => {
                  setCommunity(e.target.value)
                  loadTrends(collegeCode, course, e.target.value)
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 text-xs focus:border-blue-600 outline-none"
              >
                <option value="BC">BC</option>
                <option value="OC">OC</option>
                <option value="BCM">BCM</option>
                <option value="MBC">MBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
          </div>

          {trendError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg">{trendError}</div>
          )}

          {trendLoading ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Computing Linear Regression Forecast...</p>
            </div>
          ) : trendData && trendData.trend_data ? (
            <div className="space-y-6">
              {/* Forecast summary metric strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Institution & Branch</span>
                  <span className="text-base font-bold text-slate-900 block mt-1">{trendData.college_name}</span>
                  <span className="text-slate-500 mt-1 block">Course: <strong>{trendData.course}</strong> | Category: <strong>{trendData.community}</strong></span>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Expected 2025 Cutoff</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-emerald-700 font-mono">{trendData.expected_2025_cutoff}</span>
                    <span className="text-slate-500">/ 200</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 mt-0.5 block font-medium">Linear Model Projection (OLS)</span>
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                  <span className="text-[10px] uppercase font-bold text-indigo-800 block">Expected 2026 Cutoff</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-indigo-700 font-mono">{trendData.expected_2026_cutoff}</span>
                    <span className="text-slate-500">/ 200</span>
                  </div>
                  <span className="text-[11px] text-indigo-600 mt-0.5 block font-medium">2-Year Horizon Trajectory</span>
                </div>
              </div>

              {/* Visual SVG Trend Graph */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Cutoff Trajectory (2019 – 2026)
                  </h3>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span> Historical (2019-24)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block"></span> Projected (2025-26*)</span>
                  </div>
                </div>

                <div className="h-60 flex items-end justify-between gap-2 pt-6 pb-2 px-4 border-b border-slate-700">
                  {trendData.trend_data.map((pt) => {
                    const minScale = 140
                    const maxScale = 200
                    const heightPct = Math.max(12, Math.min(100, ((pt.cutoff - minScale) / (maxScale - minScale)) * 100))
                    return (
                      <div key={pt.year} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className={`text-[10px] font-mono font-bold ${pt.is_forecast ? 'text-emerald-300' : 'text-slate-300'}`}>
                          {pt.cutoff}
                        </span>

                        <div className="w-full max-w-[40px] bg-slate-800 rounded-t-lg relative flex items-end justify-center h-40 overflow-hidden">
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full rounded-t-md transition-all duration-500 ${
                              pt.is_forecast ? 'bg-emerald-400' : 'bg-blue-600'
                            }`}
                          ></div>
                        </div>

                        <span className={`text-xs font-bold ${pt.is_forecast ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {pt.year}{pt.is_forecast && '*'}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <p className="text-[11px] text-slate-400 mt-3 text-right">
                  * Extrapolated using Ordinary Least Squares linear regression.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* SECTION 2: ROI & BREAKEVEN CALCULATOR (SLIDE 7) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-2 border border-blue-200">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Degree Yield & Breakeven Analytics</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Educational Return on Investment (ROI) Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Calculates 4-year degree expenditures against expected campus placement package compensation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Annual Tuition Fee (₹)</label>
            <input
              type="number"
              value={roiForm.annualTuition}
              onChange={(e) => setRoiForm({ ...roiForm, annualTuition: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-semibold text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Annual Hostel & Living (₹)</label>
            <input
              type="number"
              value={roiForm.annualHostel}
              onChange={(e) => setRoiForm({ ...roiForm, annualHostel: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-semibold text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Average Placement CTC (LPA)</label>
            <input
              type="number"
              step="0.5"
              value={roiForm.avgPlacementLpa}
              onChange={(e) => setRoiForm({ ...roiForm, avgPlacementLpa: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-semibold text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Annual Scholarship Concession (₹)</label>
            <input
              type="number"
              value={roiForm.scholarshipWaiver}
              onChange={(e) => setRoiForm({ ...roiForm, scholarshipWaiver: e.target.value })}
              placeholder="e.g. 25000"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-semibold text-slate-800 text-xs"
            />
          </div>
        </div>

        <button
          onClick={() => runRoiCalculation(roiForm.annualTuition, roiForm.annualHostel, roiForm.avgPlacementLpa, roiForm.scholarshipWaiver)}
          disabled={roiLoading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
        >
          Compute Career ROI
        </button>

        {roiResult && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total 4-Yr Cost</span>
              <span className="text-xl font-bold text-slate-900 font-mono block mt-1">{roiResult.total_4yr_investment_formatted}</span>
              <span className="text-[10px] text-slate-400">Tuition + Hostel</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Starting Salary</span>
              <span className="text-xl font-bold text-blue-700 font-mono block mt-1">{roiResult.annual_starting_ctc_formatted}</span>
              <span className="text-[10px] text-slate-400">{roiResult.avg_placement_package_lpa} LPA Package</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Breakeven Horizon</span>
              <span className="text-xl font-bold text-emerald-700 font-mono block mt-1">{roiResult.breakeven_years} Yrs</span>
              <span className="text-[10px] text-slate-400">Recovery Time</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">5-Year Yield</span>
              <span className="text-xl font-bold text-indigo-700 font-mono block mt-1">+{roiResult.roi_percentage}%</span>
              <span className="text-[10px] font-bold text-emerald-700">{roiResult.roi_rating}</span>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
