import React, { useState, useEffect } from 'react'
import { matchScholarships } from '../api'

export default function ScholarshipMatcherPage() {
  const [form, setForm] = useState({
    annualIncome: '150000',
    community: 'SC',
    firstGraduate: true,
    govtSchoolStudent: false,
    gender: 'ANY',
    marksPercentage: '82'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    executeMatch(150000, 'SC', true, false)
  }, [])

  const executeMatch = async (income, comm, fg, govt) => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        annual_income: parseFloat(income) || 0,
        community: comm,
        first_graduate: Boolean(fg),
        govt_school_student: Boolean(govt),
        gender: form.gender || 'ANY',
        marks_percentage: parseFloat(form.marksPercentage) || 75
      }
      const data = await matchScholarships(payload)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Failed to match scholarship schemes.')
    } finally {
      setLoading(false)
    }
  }

  const applySlide11TestCase = () => {
    setForm({
      annualIncome: '150000',
      community: 'SC',
      firstGraduate: true,
      govtSchoolStudent: false,
      gender: 'ANY',
      marksPercentage: '80'
    })
    executeMatch(150000, 'SC', true, false)
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hero-glow-bg relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <span>💰 Socio-Economic Concessions</span>
              <span>•</span>
              <span className="font-mono text-cyan-300">Rule-Based Expert Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              State & National Scholarship Matcher
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Evaluates student parental income, Tamil Nadu community quota, first graduate eligibility, and the 7.5% government school preferential quota.
            </p>
          </div>

          {/* Slide 11 Test Case Button */}
          <button
            onClick={applySlide11TestCase}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 border border-emerald-400/30 cursor-pointer"
            title="Apply Presentation Slide 11: SC Community & ₹1.5L Annual Income"
          >
            <span>⚡</span>
            <span>Apply Slide 11 Test Case (SC + 1.5L)</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Input Parameters Form Card */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
        <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
          <span>📋</span>
          <span>Student Socio-Economic & Category Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Annual Income */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Annual Family Income (₹)</label>
            <input
              type="number"
              value={form.annualIncome}
              onChange={(e) => setForm({ ...form, annualIncome: e.target.value })}
              placeholder="e.g. 150000"
              className="w-full px-3.5 py-2.5 rounded-xl input-dark text-white font-bold font-mono text-xs"
            />
          </div>

          {/* Community */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Community Category</label>
            <select
              value={form.community}
              onChange={(e) => setForm({ ...form, community: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl input-dark text-white font-bold text-xs"
            >
              <option value="SC">SC - Scheduled Caste</option>
              <option value="SCA">SCA - SC Arunthathiyar</option>
              <option value="ST">ST - Scheduled Tribe</option>
              <option value="BC">BC - Backward Class</option>
              <option value="BCM">BCM - Backward Class Muslim</option>
              <option value="MBC">MBC / DNC - Most Backward Class</option>
              <option value="OC">OC - Open Competition</option>
            </select>
          </div>

          {/* First Graduate Checkbox */}
          <div className="flex items-center space-x-2.5 pt-6 sm:pt-7">
            <input
              type="checkbox"
              id="fgCheck"
              checked={form.firstGraduate}
              onChange={(e) => setForm({ ...form, firstGraduate: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="fgCheck" className="text-xs font-bold text-slate-200 cursor-pointer">
              First Graduate in Family (FG)
            </label>
          </div>

          {/* Govt School Checkbox */}
          <div className="flex items-center space-x-2.5 pt-6 sm:pt-7">
            <input
              type="checkbox"
              id="govtCheck"
              checked={form.govtSchoolStudent}
              onChange={(e) => setForm({ ...form, govtSchoolStudent: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="govtCheck" className="text-xs font-bold text-slate-200 cursor-pointer">
              Govt School (6–12) 7.5% Quota
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/5">
          <button
            onClick={() => executeMatch(form.annualIncome, form.community, form.firstGraduate, form.govtSchoolStudent)}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>🔍</span>
            )}
            <span>Evaluate Scheme Eligibility</span>
          </button>
        </div>
      </div>

      {/* Matched Scholarships Output */}
      {result && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-emerald-500/5">
            <div>
              <span className="font-extrabold text-white text-sm">
                Matched <strong className="text-emerald-400 font-mono text-base">{result.total_matched}</strong> Concession & Scholarship Schemes
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated Profile: Income: ₹{Number(result.user_profile.annual_income).toLocaleString()} | Category: {result.user_profile.community}
              </p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/20">
              Rule-Based Verification Passed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {result.matched_scholarships.map((s) => (
              <div
                key={s.id}
                className="glass-card rounded-2xl p-5 border border-emerald-500/20 flex flex-col justify-between space-y-4 group hover:border-emerald-500/50 transition"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                      {s.type}
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      ✓ Verified Eligible
                    </span>
                  </div>

                  <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-cyan-300 transition">
                    {s.name}
                  </h3>
                  <p className="text-xs text-slate-400">{s.provider}</p>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-xs">
                    <span className="font-bold text-slate-400 block text-[10px] uppercase">Concession Benefit:</span>
                    <span className="font-bold text-emerald-400 text-xs mt-0.5 block">{s.benefit}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5 text-xs">
                  <div>
                    <span className="font-bold text-slate-300 text-[11px] block mb-1">Eligibility Criteria Met:</span>
                    <ul className="space-y-1 text-slate-400 text-[11px]">
                      {s.eligibility_reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">✓</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={s.portal_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white font-bold text-xs border border-white/10 transition"
                  >
                    Open Official Government Portal ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
