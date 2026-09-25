import React, { useState, useEffect } from 'react'
import { fetchReferences } from '../api'
import { FileText, BookOpen, Search, Copy, Check, ExternalLink } from 'lucide-react'

export default function DocsPage() {
  const [activeSubTab, setActiveSubTab] = useState('chapters') // 'chapters' or 'references'
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedChapterIdx, setSelectedChapterIdx] = useState(0)
  const [chapterSearch, setChapterSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchReferences()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const copyCitation = (text, id) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const chapters = data?.project_chapters || []
  const references = data?.academic_references || []

  const filteredChapters = chapters.filter((c) =>
    c.title.toLowerCase().includes(chapterSearch.toLowerCase()) ||
    c.chapter_no.toLowerCase().includes(chapterSearch.toLowerCase())
  )

  const currentChapter = chapters[selectedChapterIdx] || null

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-2 border border-slate-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Dossier & Documentation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Project Report & Literature Citations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete 11-Chapter project report covering system requirements, architecture, ML methodology, and peer-reviewed citations.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSubTab('chapters')}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                activeSubTab === 'chapters'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              11-Chapter Report
            </button>
            <button
              onClick={() => setActiveSubTab('references')}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                activeSubTab === 'references'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Slide 16 References
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading documentation dossier...</p>
        </div>
      ) : activeSubTab === 'chapters' ? (
        /* CHAPTERS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chapters Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Table of Contents</h3>
              <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                {chapters.length} Chapters
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                placeholder="Search chapters..."
                className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1 text-xs">
              {filteredChapters.map((ch) => {
                const originalIndex = chapters.findIndex((c) => c.chapter_no === ch.chapter_no)
                const isSelected = selectedChapterIdx === originalIndex
                return (
                  <button
                    key={ch.chapter_no}
                    onClick={() => setSelectedChapterIdx(originalIndex)}
                    className={`w-full text-left p-3 rounded-xl transition flex justify-between items-center cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <div>
                      <span className={`block text-[10px] font-mono ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                        {ch.chapter_no}
                      </span>
                      <span className="block mt-0.5 leading-snug">{ch.title}</span>
                    </div>
                    <span className="text-xs opacity-75">➔</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chapter Reading Pane */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {currentChapter ? (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {currentChapter.chapter_no}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    {currentChapter.title}
                  </h2>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-1">
                  <span className="font-bold text-slate-900 uppercase text-[10px] block">Summary:</span>
                  <p>{currentChapter.summary}</p>
                </div>

                {currentChapter.sections && currentChapter.sections.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Sections & Topics Covered
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {currentChapter.sections.map((sec, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-800">
                              {typeof sec === 'string' ? sec : sec.title}
                            </span>
                            {sec.description && (
                              <p className="text-[11px] text-slate-500 mt-0.5">{sec.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* SLIDE 16 REFERENCES VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {references.map((ref, idx) => {
            const citationText = `${ref.authors || ''} (${ref.year || ''}). ${ref.title || ''}. ${ref.venue || ref.citation || ''}.`
            return (
              <div
                key={ref.id || idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      Ref [{idx + 1}] • {ref.year}
                    </span>
                    <button
                      onClick={() => copyCitation(citationText, ref.id || idx)}
                      className="text-xs text-slate-500 hover:text-blue-600 transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === (ref.id || idx) ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </span>
                      )}
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {ref.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {ref.authors}
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    {ref.venue || ref.citation}
                  </p>
                  {ref.relevance && (
                    <div className="bg-slate-50 p-2 rounded-lg text-[11px] text-slate-600 border border-slate-100">
                      <strong className="text-slate-800">Relevance: </strong>
                      {ref.relevance}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <a
                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(ref.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Google Scholar</span>
                    <ExternalLink className="w-3 h-3" />
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
