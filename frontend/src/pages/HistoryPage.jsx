import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchPredictionHistory, clearPredictionHistory, seedPredictionHistory } from '../api'
import {
  History,
  Calculator,
  Clock,
  Calendar,
  ArrowRight,
  User,
  Trash2,
  Download,
  RefreshCw,
  Search,
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Layers,
  GraduationCap
} from 'lucide-react'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [communityFilter, setCommunityFilter] = useState('ALL')
  const navigate = useNavigate()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchPredictionHistory()
      setHistory(res.history || [])
    } catch (err) {
      setError(err.message || 'Failed to load prediction history.')
    } finally {
      setLoading(false)
    }
  }

  const handleSeedLogs = async () => {
    setSeeding(true)
    setError('')
    try {
      const res = await seedPredictionHistory()
      setHistory(res.history || [])
    } catch (err) {
      setError(err.message || 'Failed to seed sample prediction logs.')
    } finally {
      setSeeding(false)
    }
  }

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all stored admission prediction records?")) return
    try {
      await clearPredictionHistory()
      setHistory([])
    } catch (err) {
      setError(err.message || 'Failed to clear history.')
    }
  }

  const exportToCSV = () => {
    if (!history.length) return
    const headers = [
      'Timestamp',
      'Student ID / Candidate',
      'Cutoff Mark (out of 200)',
      'Community',
      'Target Course',
      'High Chance Colleges',
      'Medium Chance Colleges',
      'Low Chance Colleges',
      'Top Recommended Institution'
    ]
    const rows = history.map(item => [
      item.created_at ? new Date(item.created_at).toISOString() : '',
      `"${item.student_id || 'TNEA-2025-001'}"`,
      item.cutoff,
      item.community,
      item.course,
      item.result_summary?.high_chance_count || 0,
      item.result_summary?.medium_chance_count || 0,
      item.result_summary?.low_chance_count || 0,
      `"${item.result_summary?.top_recommendation || 'N/A'}"`
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `tnea_prediction_logs_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered dataset
  const filteredHistory = history.filter(item => {
    const matchesSearch =
      searchTerm === '' ||
      (item.student_id && item.student_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.course && item.course.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.result_summary?.top_recommendation && item.result_summary.top_recommendation.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCommunity = communityFilter === 'ALL' || item.community === communityFilter
    return matchesSearch && matchesCommunity
  })

  // Quick summary statistics
  const totalEvaluations = history.length
  const avgCutoff = totalEvaluations > 0
    ? (history.reduce((acc, curr) => acc + (parseFloat(curr.cutoff) || 0), 0) / totalEvaluations).toFixed(2)
    : '0.00'
  const maxCutoff = totalEvaluations > 0
    ? Math.max(...history.map(item => parseFloat(item.cutoff) || 0)).toFixed(2)
    : '0.00'

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-blue-200">
              <History className="w-3.5 h-3.5" />
              <span>Slide 16 System Verification & Audit Trail</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Prediction History & Evaluation Logs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Recorded assessment logs from previous admission chance evaluations, verified against Tamil Nadu TNEA counseling cutoffs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadHistory}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh logs from server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={handleSeedLogs}
              disabled={seeding}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Load team members sample evaluation records"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{seeding ? 'Loading...' : 'Load Sample Logs'}</span>
            </button>

            {history.length > 0 && (
              <>
                <button
                  onClick={exportToCSV}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Export records to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={handleClearHistory}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Clear all stored logs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Clear Logs</span>
                </button>
              </>
            )}

            <Link
              to="/predict"
              className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>+ New Prediction</span>
            </Link>
          </div>
        </div>

        {/* Real-time Summary Cards */}
        {totalEvaluations > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-blue-500" /> Total Predictions
              </span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{totalEvaluations}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" /> Average Cutoff
              </span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{avgCutoff} <span className="text-xs text-slate-400 font-normal">/ 200</span></p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-500" /> Highest Cutoff
              </span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{maxCutoff} <span className="text-xs text-slate-400 font-normal">/ 200</span></p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-purple-500" /> Core Engine
              </span>
              <p className="text-base font-bold text-slate-900 mt-1">Random Forest</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading && history.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Retrieving prediction assessment records...</p>
        </div>
      ) : history.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
            <History className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">No Prediction Records Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Any admission chance calculation you run on the Predictor page will be automatically saved here for review.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleSeedLogs}
              disabled={seeding}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{seeding ? 'Populating Records...' : 'Load Academic Sample Logs'}</span>
            </button>
            <Link
              to="/predict"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Run First Prediction</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Table with Filters */
        <div className="space-y-4">
          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidate, course or college..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-blue-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-[11px] font-semibold text-slate-500 mr-1 shrink-0">Community:</span>
              {['ALL', 'OC', 'BC', 'BCM', 'MBC', 'SC', 'ST'].map(comm => (
                <button
                  key={comm}
                  onClick={() => setCommunityFilter(comm)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer shrink-0 ${
                    communityFilter === comm
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {comm}
                </button>
              ))}
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[11px]">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Candidate / Reg No</th>
                    <th className="p-4">Cutoff Mark</th>
                    <th className="p-4">Quota</th>
                    <th className="p-4">Target Course</th>
                    <th className="p-4">Chances Breakdown</th>
                    <th className="p-4">Top Recommendation</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.map((item) => {
                    const summary = item.result_summary || {}
                    const dateStr = item.created_at
                      ? new Date(item.created_at).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Recent'

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {dateStr}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-800 font-mono">
                            {item.student_id || 'TNEA-2025-001'}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-blue-700 font-mono text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {item.cutoff}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[11px] border border-slate-200">
                            {item.community}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-800">
                          {item.course}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              High: {summary.high_chance_count || 0}
                            </span>
                            <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Med: {summary.medium_chance_count || 0}
                            </span>
                            <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Low: {summary.low_chance_count || 0}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 max-w-[220px]">
                          <span className="text-slate-700 font-medium text-[11px] truncate block" title={summary.top_recommendation || 'Evaluated Colleges'}>
                            {summary.top_recommendation || 'Available in Report'}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/predict?cutoff=${item.cutoff}&community=${item.community}&course=${item.course}&student_id=${encodeURIComponent(item.student_id || '')}`)}
                            className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition cursor-pointer border border-blue-200"
                            title="Re-run assessment with these parameters"
                          >
                            Re-run ➔
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredHistory.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No prediction logs match your search filter "{searchTerm}".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
