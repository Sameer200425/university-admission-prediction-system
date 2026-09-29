import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { compareColleges, searchColleges } from '../api'
import { GitCompare, X, Check, ArrowRight, Plus, Building, Sparkles } from 'lucide-react'

export default function ComparisonPage({ compareCodes, setCompareCodes, onSelectTrend }) {
  const [searchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableColleges, setAvailableColleges] = useState([])
  const [selectedToAdd, setSelectedToAdd] = useState('')

  useEffect(() => {
    loadAvailableList()
    const queryCodes = searchParams.get('codes')
    if (queryCodes) {
      const parsed = queryCodes.split(',').map(c => c.trim()).filter(Boolean)
      if (parsed.length >= 2) {
        setCompareCodes(parsed)
        loadComparison(parsed)
        return
      }
    }
    if (compareCodes && compareCodes.length >= 2) {
      loadComparison(compareCodes)
    }
  }, [searchParams])

  const loadAvailableList = async () => {
    try {
      const res = await searchColleges({})
      setAvailableColleges(res.colleges || [])
    } catch (err) {
      console.error(err)
    }
  }

  const loadComparison = async (codes) => {
    setLoading(true)
    setError('')
    try {
      const res = await compareColleges(codes)
      setData(res)
    } catch (err) {
      setError(err.message || 'Failed to fetch college comparison.')
    } finally {
      setLoading(false)
    }
  }

  const applySlide13Benchmark = () => {
    const preset = ['0001', '2006', '5901']
    setCompareCodes(preset)
    loadComparison(preset)
  }

  const removeCollege = (codeToRemove) => {
    if (compareCodes.length <= 2) {
      alert('At least 2 colleges are required for side-by-side comparison.')
      return
    }
    const filtered = compareCodes.filter(c => c !== codeToRemove)
    setCompareCodes(filtered)
    loadComparison(filtered)
  }

  const addCollegeToCompare = (code) => {
    if (!code) return
    if (compareCodes.includes(code)) {
      alert('This institution is already in the comparison matrix.')
      return
    }
    if (compareCodes.length >= 3) {
      alert('Maximum of 3 institutions can be compared simultaneously.')
      return
    }
    const updated = [...compareCodes, code]
    setCompareCodes(updated)
    setSelectedToAdd('')
    loadComparison(updated)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-2 border border-purple-200">
              <GitCompare className="w-3.5 h-3.5" />
              <span>Multi-Dimensional Decision Matrix (Up to 3 Institutions)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Side-by-Side College Comparison
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Analyze tuition fees, hostel expenses, 4-year financial commitments, placement averages, and NIRF ranks across up to 3 colleges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={applySlide13Benchmark}
              className="shrink-0 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Benchmark: CEG Guindy vs PSG College of Technology vs K.L.N. College"
            >
              <span>⚡</span>
              <span>Slide 13 Benchmark (CEG vs PSG vs K.L.N.)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selector Toolbar: Add a College if < 3 */}
      {compareCodes.length < 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Plus className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Currently comparing <strong>{compareCodes.length} / 3</strong> colleges. Add another institution:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedToAdd}
              onChange={(e) => setSelectedToAdd(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:border-purple-600 outline-none w-full sm:w-64"
            >
              <option value="">Select college to add...</option>
              {availableColleges
                .filter(c => !compareCodes.includes(c.code))
                .map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
            </select>
            <button
              onClick={() => addCollegeToCompare(selectedToAdd)}
              disabled={!selectedToAdd}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition disabled:opacity-40 cursor-pointer shrink-0"
            >
              + Add
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-7 h-7 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Compiling 15+ institutional dimensions...</p>
        </div>
      ) : !data || !data.colleges || data.colleges.length < 2 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <GitCompare className="w-12 h-12 text-purple-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Select At Least 2 Colleges to Compare</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Add colleges from the Explore Colleges catalog or launch the pre-configured academic benchmark comparison.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={applySlide13Benchmark}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              Load Benchmark Matrix
            </button>
            <Link
              to="/colleges"
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              Browse Colleges Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-slate-300 w-1/4">
                    Evaluation Parameter
                  </th>
                  {data.colleges.map((c) => (
                    <th key={c.param_code} className="p-4 sm:p-5 border-l border-slate-800 min-w-[220px]">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-700">
                          Code: {c.param_code}
                        </span>
                        <button
                          onClick={() => removeCollege(c.param_code)}
                          className="text-slate-400 hover:text-red-400 text-xs transition cursor-pointer p-0.5"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-white block mt-1.5 leading-snug">
                        {c.param_short_name || c.param_name}
                      </span>
                      <button
                        onClick={() => onSelectTrend && onSelectTrend(c.param_code)}
                        className="text-[11px] text-blue-400 hover:underline mt-1 font-semibold block cursor-pointer"
                      >
                        Cutoff Trend ➔
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.parameters.map((p, idx) => (
                  <tr
                    key={p.key}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                  >
                    <td className="p-4 font-bold text-slate-700">
                      {p.label}
                    </td>
                    {data.colleges.map((c) => {
                      const val = c[p.key]
                      return (
                        <td key={c.param_code} className="p-4 text-slate-800 border-l border-slate-100 font-medium">
                          {typeof val === 'object' && val !== null ? (
                            <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                              {Object.entries(val).map(([comm, mark]) => (
                                <span key={comm} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                                  <strong>{comm}:</strong> {mark}
                                </span>
                              ))}
                            </div>
                          ) : Array.isArray(val) ? (
                            <span className="text-slate-700 text-xs">{val.join(', ')}</span>
                          ) : p.key.includes('placement') ? (
                            <span className="text-emerald-700 font-bold font-mono">
                              {val ? `${val} LPA` : 'N/A'}
                            </span>
                          ) : p.key.includes('fee') ? (
                            <span className="text-slate-900 font-bold font-mono">
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
      )}
    </div>
  )
}
