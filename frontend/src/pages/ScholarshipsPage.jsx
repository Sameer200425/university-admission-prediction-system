import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { matchScholarships } from '../api'
import { Award, CheckCircle2, ExternalLink, IndianRupee, HelpCircle } from 'lucide-react'

export default function ScholarshipsPage() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    annualIncome: searchParams.get('income') || '150000',
    community: searchParams.get('comm') || 'SC',
    firstGraduate: true,
    govtSchoolStudent: false,
    gender: 'ANY',
    marksPercentage: '82'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    executeMatch(form.annualIncome, form.community, form.firstGraduate, form.govtSchoolStudent)
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

  const applySlide11Preset = () => {
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
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-2 border border-emerald-200">
              <Award className="w-3.5 h-3.5" />
              <span>Rule-Based State & National Concessions Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Rule-Based Scholarship Matcher
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Evaluates student socio-economic and community profile against state and national welfare schemes.
            </p>
          </div>

          <button
            onClick={applySlide11Preset}
            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
            title="Apply Slide 11 Case: SC Community & ₹1.5L Annual Income"
          >
            <span>⚡</span>
            <span>Apply Slide 11 Test Case (SC + ₹1.5L Income)</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Form Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h2 className="font-bold text-slate-800 text-sm">Student Socio-Economic Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Annual Family Income (₹)</label>
            <input
              type="number"
              value={form.annualIncome}
              onChange={(e) => setForm({ ...form, annualIncome: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-semibold text-slate-800 text-xs focus:border-blue-600 outline-none"
              placeholder="e.g. 150000"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Community Category</label>
            <select
              value={form.community}
              onChange={(e) => setForm({ ...form, community: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:border-blue-600 outline-none"
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

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="fgCheck"
              checked={form.firstGraduate}
              onChange={(e) => setForm({ ...form, firstGraduate: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="fgCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
              First Graduate in Family (FG)
            </label>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="govtCheck"
              checked={form.govtSchoolStudent}
              onChange={(e) => setForm({ ...form, govtSchoolStudent: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="govtCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
              Govt School 7.5% Quota
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={() => executeMatch(form.annualIncome, form.community, form.firstGraduate, form.govtSchoolStudent)}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
          >
            {loading ? 'Matching...' : 'Evaluate Eligible Scholarships ➔'}
          </button>
        </div>
      </div>

      {/* Matched Scholarships Output */}
      {result && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="font-bold text-emerald-950 text-sm">
                Matched <strong className="text-emerald-700 font-mono text-base">{result.total_matched}</strong> Eligible Concession Schemes
              </span>
              <p className="text-xs text-emerald-700 mt-0.5">
                Evaluated Profile: Income: ₹{Number(result.user_profile.annual_income).toLocaleString()} | Category: {result.user_profile.community}
              </p>
            </div>
            <span className="bg-emerald-600 text-white font-mono font-bold text-xs px-3 py-1 rounded-full">
              Rule-Based Output
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {result.matched_scholarships.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                      {s.type}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Verified Eligible
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {s.name}
                  </h3>
                  <p className="text-xs text-slate-500">{s.provider}</p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <span className="font-bold text-slate-500 block text-[10px] uppercase">Concession Benefit:</span>
                    <span className="font-bold text-emerald-700 text-xs mt-0.5 block">{s.benefit}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 text-[11px] block mb-1">Why you matched:</span>
                    <ul className="space-y-1 text-slate-600 text-[11px]">
                      {s.eligibility_reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={s.portal_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                  >
                    Visit Official Government Portal ↗
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
