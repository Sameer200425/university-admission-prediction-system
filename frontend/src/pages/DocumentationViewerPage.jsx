import React, { useState, useEffect } from 'react'
import { fetchReferences } from '../api'

export default function DocumentationViewerPage() {
  const [chapters, setChapters] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchReferences()
      .then((res) => {
        if (res && res.project_chapters) {
          setChapters(res.project_chapters)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filteredChapters = chapters.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.chapter_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.summary && c.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const currentChapter = chapters[selectedIdx] || null

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hero-glow-bg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 rounded-full text-xs font-semibold text-indigo-300 mb-2">
            <span>📑 Comprehensive Academic Dossier</span>
            <span>•</span>
            <span className="font-mono text-cyan-300">11 Full Chapters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Project Report Documentation & Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Structured Chapter-by-Chapter design and implementation documentation corresponding to <span className="font-mono text-cyan-300">index.pdf</span> and <span className="font-mono text-cyan-300">Document 2.pdf</span>.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading 11 project chapters...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chapter Outline Navigation (Left Column) */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-sm">Chapter Index</h3>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {chapters.length} Chapters
              </span>
            </div>

            {/* Search filter */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters & topics..."
              className="w-full px-3 py-2 rounded-xl input-dark text-xs text-white"
            />

            <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
              {filteredChapters.map((ch) => {
                const originalIndex = chapters.findIndex((c) => c.chapter_no === ch.chapter_no)
                const isSelected = selectedIdx === originalIndex
                return (
                  <button
                    key={ch.chapter_no}
                    onClick={() => setSelectedIdx(originalIndex)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition flex justify-between items-center cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 border border-blue-400/30'
                        : 'bg-black/30 hover:bg-black/50 text-slate-300 font-medium border border-white/5'
                    }`}
                  >
                    <div className="pr-2">
                      <span className={`block text-[10px] font-mono ${isSelected ? 'text-cyan-200' : 'text-slate-400'}`}>
                        {ch.chapter_no}
                      </span>
                      <span className="block font-bold text-xs mt-0.5 leading-snug">
                        {ch.title}
                      </span>
                    </div>
                    <span className="text-sm shrink-0">➔</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chapter Reader Pane (Right Column) */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            {currentChapter ? (
              <div className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                      {currentChapter.chapter_no}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Department Academic Report</span>
                  </div>
                  <h2 className="text-2xl font-black text-white leading-tight">
                    {currentChapter.title}
                  </h2>
                </div>

                {/* Chapter Summary */}
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed space-y-1">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[10px] block">Executive Summary:</span>
                  <p>{currentChapter.summary || 'Comprehensive details outlining the design, implementation, and academic verification of the University Admission Prediction System.'}</p>
                </div>

                {/* Sections List */}
                {currentChapter.sections && currentChapter.sections.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-slate-300">
                      Chapter Breakdown & Sections
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {currentChapter.sections.map((sec, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-3"
                        >
                          <span className="w-5 h-5 rounded-md bg-blue-500/20 text-cyan-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <h5 className="font-bold text-white text-xs leading-snug">
                              {typeof sec === 'string' ? sec : sec.title || `Section ${idx + 1}`}
                            </h5>
                            {sec.description && (
                              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                                {sec.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Insights Callout */}
                {currentChapter.key_takeaways && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1 text-emerald-200">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-300 block">Key Takeaways & Evaluation:</span>
                    <p>{currentChapter.key_takeaways}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                Select a chapter from the index to view complete documentation.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
