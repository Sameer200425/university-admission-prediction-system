import React, { useState, useEffect } from 'react'

export default function CutoffCalculatorModal({ isOpen, onClose, onApplyCutoff }) {
  const [maths, setMaths] = useState(95)
  const [physics, setPhysics] = useState(90)
  const [chemistry, setChemistry] = useState(90)
  const [calculatedCutoff, setCalculatedCutoff] = useState(185.0)

  useEffect(() => {
    const m = parseFloat(maths) || 0
    const p = parseFloat(physics) || 0
    const c = parseFloat(chemistry) || 0
    const cutoff = m + (p / 2) + (c / 2)
    setCalculatedCutoff(Math.min(200, Math.max(0, parseFloat(cutoff.toFixed(2)))))
  }, [maths, physics, chemistry])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-2xl glass-panel p-6 sm:p-8 relative border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl text-cyan-400">
            🧮
          </div>
          <div>
            <h3 className="text-lg font-black text-white leading-tight">
              TNEA PCM Cutoff Calculator
            </h3>
            <p className="text-xs text-slate-400">
              Official Formula: <span className="text-cyan-300 font-mono">Maths + (Physics / 2) + (Chemistry / 2)</span>
            </p>
          </div>
        </div>

        {/* Live Cutoff Highlight Display */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-[#070d1e] border border-blue-500/30 text-center relative overflow-hidden">
          <span className="text-[11px] uppercase tracking-wider text-blue-300 font-bold block mb-1">
            Calculated Engineering Cutoff
          </span>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300">
            {calculatedCutoff.toFixed(2)}
            <span className="text-sm text-slate-400 font-normal font-sans ml-1">/ 200</span>
          </div>
          <div className="mt-2 flex justify-center items-center gap-3 text-xs text-slate-300">
            <span>Maths: <strong>{maths}</strong></span>
            <span>•</span>
            <span>Physics: <strong>{physics}</strong></span>
            <span>•</span>
            <span>Chemistry: <strong>{chemistry}</strong></span>
          </div>
        </div>

        {/* Sliders and Inputs */}
        <div className="space-y-4 text-xs">
          {/* Maths */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-300">Mathematics (out of 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={maths}
                onChange={(e) => setMaths(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-16 px-2 py-1 text-center font-bold text-cyan-300 bg-black/40 border border-white/10 rounded-lg text-xs"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={maths}
              onChange={(e) => setMaths(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Physics */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-300">Physics (out of 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={physics}
                onChange={(e) => setPhysics(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-16 px-2 py-1 text-center font-bold text-blue-300 bg-black/40 border border-white/10 rounded-lg text-xs"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={physics}
              onChange={(e) => setPhysics(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Chemistry */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-slate-300">Chemistry (out of 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={chemistry}
                onChange={(e) => setChemistry(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-16 px-2 py-1 text-center font-bold text-indigo-300 bg-black/40 border border-white/10 rounded-lg text-xs"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={chemistry}
              onChange={(e) => setChemistry(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApplyCutoff(calculatedCutoff.toFixed(2))
              onClose()
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Apply to Admission Predictor</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  )
}
