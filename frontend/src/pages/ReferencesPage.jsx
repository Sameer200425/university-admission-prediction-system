import React, { useState, useEffect } from 'react'
import { fetchReferences } from '../api'

export default function ReferencesPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchReferences()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const staticReferences = [
    {
      id: 1,
      title: "Predicting students' performance using data mining techniques",
      authors: "Al-Barrak, M. A., & Al-Razgan, M.",
      year: 2016,
      venue: "International Journal of Computer Applications, 160(7), 24–29",
      tags: ["Data Mining", "Performance Prediction"]
    },
    {
      id: 2,
      title: "A machine learning approach for predicting student admissions",
      authors: "Ahmed, A. M., Zeki, A. M., & Selamat, A.",
      year: 2017,
      venue: "Journal of Theoretical and Applied Information Technology, 95(20), 5354–5364",
      tags: ["Admission Prediction", "Supervised Learning"]
    },
    {
      id: 3,
      title: "Machine learning: Principles and techniques",
      authors: "Kumar, V., & Chadha, A.",
      year: 2015,
      venue: "International Journal of Computer Science and Technology, 6(2), 53–59",
      tags: ["Machine Learning", "Algorithmic Foundations"]
    },
    {
      id: 4,
      title: "Data mining: Concepts and techniques",
      authors: "Han, J., Kamber, M., & Pei, J.",
      year: 2012,
      venue: "Morgan Kaufmann (3rd ed.)",
      tags: ["Core Textbook", "Classification & Regression"]
    },
    {
      id: 5,
      title: "Educational data mining: A review of the state of the art",
      authors: "Romero, C., & Ventura, S.",
      year: 2020,
      venue: "IEEE Transactions on Systems, Man, and Cybernetics: Systems, 50(3), 778–795",
      tags: ["EDM Survey", "IEEE Transactions"]
    },
    {
      id: 6,
      title: "Data mining applications: A comparative study for predicting student performance",
      authors: "Yadav, S. K., Bharadwaj, B., & Pal, S.",
      year: 2012,
      venue: "International Journal of Computer Science and Information Security, 10(2), 113–120",
      tags: ["Comparative Algorithms", "Decision Trees"]
    }
  ]

  const referencesList = (data && data.references && data.references.length > 0) ? data.references : staticReferences

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hero-glow-bg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-0.5 rounded-full text-xs font-semibold text-blue-300 mb-2">
            <span>📚 Academic Peer-Reviewed Literature</span>
            <span>•</span>
            <span className="font-mono text-cyan-300">Algorithmic Foundations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academic Citations & Bibliography
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Foundational research in Educational Data Mining (EDM), Random Forest ensembles, and student admission chance forecasting.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading academic bibliography...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {referencesList.map((ref, idx) => {
            const citationText = `${ref.authors} (${ref.year}). ${ref.title}. ${ref.venue}.`
            return (
              <div
                key={ref.id || idx}
                className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4 group hover:border-blue-500/40 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      Ref [{idx + 1}] • {ref.year}
                    </span>

                    <button
                      onClick={() => copyToClipboard(citationText, ref.id || idx)}
                      className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === (ref.id || idx) ? (
                        <span className="text-emerald-400 font-bold">✓ Copied!</span>
                      ) : (
                        <span>📋 Copy Citation</span>
                      )}
                    </button>
                  </div>

                  <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug group-hover:text-cyan-300 transition">
                    {ref.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-medium">
                    {ref.authors}
                  </p>

                  <p className="text-xs text-slate-400 italic">
                    {ref.venue}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {(ref.tags || ['Educational Data Mining', 'Machine Learning']).map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] bg-black/40 text-slate-400 px-2 py-0.5 rounded border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(ref.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Scholar</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
