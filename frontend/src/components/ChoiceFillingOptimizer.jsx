import React, { useState, useEffect } from 'react'
import {
  ListOrdered,
  ArrowUp,
  ArrowDown,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Download,
  Copy,
  Check,
  Building,
  Plus
} from 'lucide-react'

export default function ChoiceFillingOptimizer({ result, studentCutoff, targetCourse }) {
  const [choices, setChoices] = useState([])
  const [copied, setCopied] = useState(false)

  // Auto-populate when result changes
  useEffect(() => {
    if (result) {
      // Pick top 3 high and top 2 medium to initiate a smart pyramid
      const initial = [
        ...(result.high_chance || []).slice(0, 4),
        ...(result.medium_chance || []).slice(0, 3)
      ]
      setChoices(initial)
    }
  }, [result])

  const moveUp = (index) => {
    if (index === 0) return
    const updated = [...choices]
    const temp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = temp
    setChoices(updated)
  }

  const moveDown = (index) => {
    if (index === choices.length - 1) return
    const updated = [...choices]
    const temp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = temp
    setChoices(updated)
  }

  const removeChoice = (index) => {
    setChoices(choices.filter((_, idx) => idx !== index))
  }

  const autoSortByCutoff = () => {
    // Sort descending by expected_cutoff (TNEA Golden Counseling Rule: Highest cutoff first)
    const sorted = [...choices].sort((a, b) => {
      const cutA = parseFloat(a.expected_cutoff || a.base_cutoff || 175)
      const cutB = parseFloat(b.expected_cutoff || b.base_cutoff || 175)
      return cutB - cutA
    })
    setChoices(sorted)
  }

  // TNEA Priority Inversion Detector
  const detectInversions = () => {
    const warnings = []
    for (let i = 1; i < choices.length; i++) {
      const prev = choices[i - 1]
      const curr = choices[i]
      const prevCut = parseFloat(prev.expected_cutoff || prev.base_cutoff || 175)
      const currCut = parseFloat(curr.expected_cutoff || curr.base_cutoff || 175)

      // If current choice has higher cutoff than previous choice by more than 1.5 marks
      if (currCut - prevCut > 1.5) {
        warnings.push({
          index: i + 1,
          currName: curr.short_name || curr.college_name,
          prevName: prev.short_name || prev.college_name,
          currCut,
          prevCut,
          diff: (currCut - prevCut).toFixed(1)
        })
      }
    }
    return warnings
  }

  const inversions = detectInversions()

  const copyChoiceList = () => {
    const text = choices
      .map((c, i) => `${i + 1}. [TNEA ${c.college_code}] ${c.college_name} - ${c.course || targetCourse || 'CSE'} (Cutoff: ${c.expected_cutoff || 180})`)
      .join('\n')
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-1 border border-indigo-200">
            <ListOrdered className="w-3.5 h-3.5" />
            <span>TNEA Single-Window Counseling Strategy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Choice Filling & Priority Order Optimizer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Arrange colleges in strict descending order of preference. The AI detects dangerous "priority inversions" that could cause you to lose a premier seat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={autoSortByCutoff}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Auto-arrange from highest cutoff to safe backup institutions"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Auto-Sort by Cutoff</span>
          </button>
          <button
            onClick={copyChoiceList}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Copy formatted choice list for DOTE portal"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Choice List'}</span>
          </button>
        </div>
      </div>

      {/* AI Strategy Validation Status */}
      {inversions.length > 0 ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{inversions.length} Choice Priority Inversion(s) Detected!</span>
          </div>
          <p className="text-amber-700 leading-relaxed">
            In TNEA counseling, choice allocations stop at the <em>first</em> college where your cutoff qualifies. If you rank an easier institution above a premier one, you will never be considered for the premier one.
          </p>
          <ul className="list-disc list-inside space-y-1 pt-1 text-[11px] font-medium text-amber-800">
            {inversions.map((inv, idx) => (
              <li key={idx}>
                Choice #{inv.index} (<strong>{inv.currName}</strong>, req {inv.currCut}) is ranked below Choice #{inv.index - 1} (<strong>{inv.prevName}</strong>, req {inv.prevCut}). 
                <span className="text-rose-700 font-bold ml-1">Move Choice #{inv.index} UP!</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Optimal Counseling Hierarchy: Choices are correctly organized in descending benchmark order without risky inversions.</span>
        </div>
      )}

      {/* Choice List Interactive Items */}
      {choices.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
          Your choice filling basket is currently empty. Run an admission prediction to populate recommended options.
        </div>
      ) : (
        <div className="space-y-2.5">
          {choices.map((choice, index) => {
            const reqCutoff = choice.expected_cutoff || choice.base_cutoff || 180.0
            const delta = (studentCutoff - reqCutoff).toFixed(1)
            const isDream = Number(delta) < -1.0
            const isSafe = Number(delta) >= 2.0

            return (
              <div
                key={choice.college_code + index}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition gap-3"
              >
                {/* Priority Rank & College Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    #{index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Code {choice.college_code}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {choice.college_name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>{choice.district}</span>
                      <span>•</span>
                      <span>Branch: <strong className="text-slate-700">{choice.course || targetCourse || 'CSE'}</strong></span>
                      <span>•</span>
                      <span>Benchmark: <strong className="text-slate-800 font-mono">{reqCutoff}</strong></span>
                      <span>•</span>
                      <span className={Number(delta) >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {Number(delta) >= 0 ? `+${delta} safe` : `${delta} reach`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Priority Reordering Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isDream ? 'bg-purple-100 text-purple-800' : isSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isDream ? 'Dream Reach' : isSafe ? 'Safe Backup' : 'Realistic Match'}
                  </span>

                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Move up in priority"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === choices.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Move down in priority"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeChoice(index)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer ml-1"
                    title="Remove from choices"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
