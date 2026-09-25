import React, { useState, useEffect } from 'react'
import { compareColleges } from '../api'

export default function CollegeComparisonPage({ compareCodes, setCompareCodes, onSelectTrend }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (compareCodes && compareCodes.length >= 2) {
      loadComparison(compareCodes)
    }
  }, [compareCodes])

  const loadComparison = async (codes) => {
    setLoading(true)
    setError('')
    try {
      const res = await compareColleges(codes)
      setData(res)
    } catch (err) {
      setError(err.message || 'Failed to generate comparison matrix.')
    } finally {
      setLoading(false)
    }
  }

  const applyBenchmarkPreset = () => {
    const preset = ['0001', '2006', '5901']
    setCompareCodes(preset)
    loadComparison(preset)
  }

  const removeCollege = (codeToRemove) => {
    if (compareCodes.length <= 2) {
      alert('A minimum of 2 colleges is required for side-by-side comparison.')
      return
    }
    const filtered = compareCodes.filter(c => c !== codeToRemove)
    setCompareCodes(filtered)
    loadComparison(filtered)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hero-glow-bg relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/30 px-3 py-0.5 rounded-full text-xs font-semibold text-indigo-300 mb-2">
              <span>⚖️ Decision Matrix</span>
              <span>•</span>
              <span className="font-mono text-cyan-300">15+ Institutional Parameters</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Side-by-Side College Comparison
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Analyze multi-dimensional parameters including tuition, hostel expenses, placement packages, NIRF rankings, and cutoffs.
            </p>
          </div>

          {/* Benchmark Preset Button (Slide 13) */}
          <button
            onClick={applyBenchmarkPreset}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center gap-2 border border-blue-400/30 cursor-pointer"
            title="Benchmark: CEG Guindy vs PSG College of Technology vs K.L.N. College"
          >
            <span>⚡</span>
            <span>Benchmark: CEG vs PSG Tech vs K.L.N.</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Compiling 15+ comparison dimensions...</p>
        </div>
      ) : data && data.colleges ? (
        <div className="glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#050914] text-white border-b border-white/10">
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-slate-400 w-1/4">
                    Evaluation Parameter
                  </th>
                  {data.colleges.map((c) => (
                    <th key={c.param_code} className="p-4 sm:p-5 border-l border-white/10 min-w-[220px]">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          Code: {c.param_code}
                        </span>
                        <button
                          onClick={() => removeCollege(c.param_code)}
                          className="text-slate-400 hover:text-rose-400 text-xs transition"
                          title="Remove college from comparison"
                        >
                          ✕
                        </button>
                      </div>
                      <span className="text-sm sm:text-base font-black text-white block mt-1.5 leading-snug">
                        {c.param_short_name || c.param_name}
                      </span>
                      <button
                        onClick={() => onSelectTrend(c.param_code)}
                        className="text-[11px] text-cyan-400 hover:underline mt-1 font-semibold block cursor-pointer"
                      >
                        View Cutoff Trend ➔
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.parameters.map((p, idx) => (
                  <tr
                    key={p.key}
                    className={idx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-white/[0.03]'}
                  >
                    <td className="p-4 font-bold text-slate-300">
                      {p.label}
                    </td>
                    {data.colleges.map((c) => {
                      const val = c[p.key]
                      return (
                        <td key={c.param_code} className="p-4 text-slate-200 border-l border-white/10 font-medium">
                          {typeof val === 'object' && val !== null ? (
                            <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                              {Object.entries(val).map(([comm, mark]) => (
                                <span key={comm} className="bg-black/50 text-slate-300 px-1.5 py-0.5 rounded border border-white/10">
                                  <strong>{comm}:</strong> {mark}
                                </span>
                              ))}
                            </div>
                          ) : Array.isArray(val) ? (
                            <span className="text-slate-300 text-xs">{val.join(', ')}</span>
                          ) : p.key.includes('placement') ? (
                            <span className="text-emerald-400 font-bold font-mono">
                              {val ? `${val} LPA` : 'N/A'}
                            </span>
                          ) : p.key.includes('fee') ? (
                            <span className="text-cyan-300 font-bold font-mono">
                              ₹{val ? Number(val).toLocaleString() : 'N/A'}
                            </span>
                          ) : (
                            <span>{val || 'N/A'}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}
