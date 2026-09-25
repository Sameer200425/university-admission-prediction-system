import React, { useState, useEffect } from 'react'
import { fetchCutoffTrend } from '../api'

export default function CutoffTrendsPage({ selectedCollegeCode = '0001' }) {
  const [collegeCode, setCollegeCode] = useState(selectedCollegeCode)
  const [course, setCourse] = useState('CSE')
  const [community, setCommunity] = useState('BC')
  const [trendData, setTrendData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (selectedCollegeCode) {
      setCollegeCode(selectedCollegeCode)
    }
  }, [selectedCollegeCode])

  useEffect(() => {
    loadTrends(collegeCode, course, community)
  }, [collegeCode, course, community])

  const loadTrends = async (code, crs, comm) => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchCutoffTrend(code, crs, comm)
      setTrendData(data)
    } catch (err) {
      setError(err.message || 'Failed to load cutoff trend analysis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hero-glow-bg relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <span>📈 Linear Regression Model</span>
              <span>•</span>
              <span className="font-mono text-cyan-300">2019–2026 Cutoff Trajectory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Historical Cutoff Trends & Expected Forecast
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Evaluates 6 years of historical counseling cutoffs and projects 2025/2026 expected cutoffs using Ordinary Least Squares (OLS) regression.
            </p>
          </div>

          {/* Controls Filter Strip */}
          <div className="flex flex-wrap items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/10 text-xs">
            <select
              value={collegeCode}
              onChange={(e) => setCollegeCode(e.target.value)}
              className="px-3 py-1.5 rounded-xl input-dark text-white font-bold text-xs"
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
              onChange={(e) => setCourse(e.target.value)}
              className="px-3 py-1.5 rounded-xl input-dark text-white font-bold text-xs"
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
              onChange={(e) => setCommunity(e.target.value)}
              className="px-3 py-1.5 rounded-xl input-dark text-white font-bold text-xs"
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
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Computing Linear Regression Cutoff Trend...</p>
        </div>
      ) : trendData && trendData.trend_data ? (
        <div className="space-y-6">
          {/* Summary Forecast Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-blue-500/20">
              <span className="text-[10px] font-bold text-blue-400 uppercase block tracking-wider">Institution Profile</span>
              <span className="text-lg font-black text-white block mt-1 leading-snug">{trendData.college_name}</span>
              <span className="text-xs text-slate-400 mt-1 block">
                Branch: <strong className="text-cyan-300">{trendData.course}</strong> | Category: <strong className="text-cyan-300">{trendData.community}</strong>
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 glow-emerald">
              <span className="text-[10px] font-bold text-emerald-400 uppercase block tracking-wider">Expected 2025 Cutoff</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-emerald-300 font-mono">{trendData.expected_2025_cutoff}</span>
                <span className="text-xs text-slate-400">/ 200</span>
              </div>
              <span className="text-xs text-emerald-400/90 mt-1 block font-medium">
                Linear Model Projection (OLS)
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30">
              <span className="text-[10px] font-bold text-indigo-400 uppercase block tracking-wider">Expected 2026 Cutoff</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-indigo-300 font-mono">{trendData.expected_2026_cutoff}</span>
                <span className="text-xs text-slate-400">/ 200</span>
              </div>
              <span className="text-xs text-indigo-400/90 mt-1 block font-medium">
                Projected 2-Year Trend Outlook
              </span>
            </div>
          </div>

          {/* Visual Trend Chart */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="font-extrabold text-white text-base">
                  Cutoff Trajectory Chart (2019 – 2026)
                </h3>
                <p className="text-xs text-slate-400">
                  Visual comparison between historical single-window records and upcoming counseling thresholds.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded bg-gradient-to-t from-blue-600 to-cyan-400 inline-block"></span>
                  <span>Historical (2019–2024)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded bg-gradient-to-t from-emerald-600 to-emerald-400 border border-emerald-300 inline-block"></span>
                  <span>Projected (2025–2026*)</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive SVG / Bar Graph */}
            <div className="h-64 sm:h-72 flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-3 px-2 sm:px-6 border-b border-white/10">
              {trendData.trend_data.map((pt) => {
                const minScale = 140
                const maxScale = 200
                const heightPct = Math.max(12, Math.min(100, ((pt.cutoff - minScale) / (maxScale - minScale)) * 100))
                return (
                  <div key={pt.year} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className={`text-[11px] font-mono font-bold transition ${
                      pt.is_forecast ? 'text-emerald-300' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {pt.cutoff}
                    </span>

                    <div className="w-full max-w-[48px] bg-black/50 rounded-t-xl relative flex items-end justify-center h-48 overflow-hidden border-x border-t border-white/10">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full transition-all duration-700 rounded-t-lg ${
                          pt.is_forecast
                            ? 'bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-300 shadow-lg shadow-emerald-500/20'
                            : 'bg-gradient-to-t from-blue-700 via-indigo-600 to-cyan-400 shadow-lg shadow-blue-500/20'
                        }`}
                      ></div>
                    </div>

                    <span className={`text-xs font-bold ${
                      pt.is_forecast ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {pt.year}
                      {pt.is_forecast && '*'}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-slate-400 gap-2">
              <span>* 2025 and 2026 projected cutoffs computed via scikit-learn LinearRegression model.</span>
              <span className="font-mono text-cyan-300">Baseline Range: 140.0 – 200.0 Marks</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
