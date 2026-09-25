import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchPredictionHistory } from '../api'
import { History, Calculator, Clock, Calendar, ArrowRight, User } from 'lucide-react'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-2 border border-slate-200">
              <History className="w-3.5 h-3.5" />
              <span>Candidate Prediction Logs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Prediction History & Evaluation Logs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Recorded assessment logs from previous admission chance evaluations and counseling scenarios.
            </p>
          </div>

          <Link
            to="/predict"
            className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <span>+ New Prediction</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Retrieving prediction records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Prediction Logs Found</h3>
          <p className="text-xs text-slate-500">You have not executed any saved admission assessments yet.</p>
          <Link
            to="/predict"
            className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm"
          >
            Run First Prediction
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[11px]">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Student ID</th>
                  <th className="p-4">Cutoff Mark</th>
                  <th className="p-4">Community</th>
                  <th className="p-4">Target Course</th>
                  <th className="p-4">Chances Breakdown</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => {
                  const summary = item.result_summary || {}
                  const dateStr = item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 text-slate-500 font-mono text-[11px]">
                        {dateStr}
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800">
                        {item.student_id || 'TNEA-2025-001'}
                      </td>
                      <td className="p-4 font-bold text-blue-700 font-mono text-sm">
                        {item.cutoff}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {item.community}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {item.course}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-[11px]">
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
                      <td className="p-4 text-right">
                        <button
                          onClick={() => navigate(`/predict?cutoff=${item.cutoff}&community=${item.community}&course=${item.course}`)}
                          className="px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition cursor-pointer"
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
        </div>
      )}
    </div>
  )
}
