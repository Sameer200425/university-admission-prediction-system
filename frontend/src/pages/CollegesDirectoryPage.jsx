import React, { useState, useEffect } from 'react'
import { searchColleges } from '../api'

export default function CollegesDirectoryPage({ onSelectCompare, onSelectTrend }) {
  const [colleges, setColleges] = useState([])
  const [districts, setDistricts] = useState([])
  const [filterDistrict, setFilterDistrict] = useState('All')
  const [filterMaxFees, setFilterMaxFees] = useState('')
  const [filterCourse, setFilterCourse] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCollegesList('All', '', 'ALL', '')
  }, [])

  const fetchCollegesList = async (dist, maxFee, crs, query) => {
    setLoading(true)
    try {
      const payload = {
        district: dist !== 'All' ? dist : undefined,
        max_fees: maxFee ? Number(maxFee) : undefined,
        course: crs !== 'ALL' ? crs : undefined,
        query: query.trim() || undefined
      }
      const res = await searchColleges(payload)
      setColleges(res.colleges || [])
      if (res.districts && districts.length === 0) {
        setDistricts(res.districts)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Slide 11 Preset: Chennai & Max Fees: 2,00,000
  const applySlide11TestScenario = () => {
    setFilterDistrict('Chennai')
    setFilterMaxFees('200000')
    setFilterCourse('ALL')
    setSearchQuery('')
    fetchCollegesList('Chennai', '200000', 'ALL', '')
  }

  const handleResetFilters = () => {
    setFilterDistrict('All')
    setFilterMaxFees('')
    setFilterCourse('ALL')
    setSearchQuery('')
    fetchCollegesList('All', '', 'ALL', '')
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden hero-glow-bg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 px-3 py-0.5 rounded-full text-xs font-semibold text-blue-300 mb-2">
              <span>🏛️ Centralized Registry</span>
              <span>•</span>
              <span className="font-mono text-cyan-300">110+ Verified Institutions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tamil Nadu Engineering Colleges Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Explore accredited institutions with verified NIRF ranks, NAAC grades, tuition fees, and campus placement packages.
            </p>
          </div>

          {/* Slide 11 Test Case Preset Button */}
          <button
            onClick={applySlide11TestScenario}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center gap-2 border border-blue-400/30 cursor-pointer"
            title="Slide 11 Scenario: Chennai district with fees below ₹2,00,000"
          >
            <span>⚡</span>
            <span>Apply Slide 11 Test Case (Chennai &lt; 2L)</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* District Dropdown */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">District / Region</label>
            <select
              value={filterDistrict}
              onChange={(e) => {
                setFilterDistrict(e.target.value)
                fetchCollegesList(e.target.value, filterMaxFees, filterCourse, searchQuery)
              }}
              className="w-full px-3 py-2.5 rounded-xl input-dark text-white font-semibold text-xs"
            >
              <option value="All">All Districts (Tamil Nadu)</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Max Fees Input */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Max Annual Tuition (₹)</label>
            <input
              type="number"
              value={filterMaxFees}
              onChange={(e) => {
                setFilterMaxFees(e.target.value)
                fetchCollegesList(filterDistrict, e.target.value, filterCourse, searchQuery)
              }}
              placeholder="e.g. 200000"
              className="w-full px-3 py-2.5 rounded-xl input-dark text-white font-semibold text-xs"
            />
          </div>

          {/* Branch Filter */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Engineering Course</label>
            <select
              value={filterCourse}
              onChange={(e) => {
                setFilterCourse(e.target.value)
                fetchCollegesList(filterDistrict, filterMaxFees, e.target.value, searchQuery)
              }}
              className="w-full px-3 py-2.5 rounded-xl input-dark text-white font-semibold text-xs"
            >
              <option value="ALL">All Engineering Branches</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="AI&DS">AI & Data Science (AI&DS)</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="EEE">Electrical (EEE)</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">Search Name or Code</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                fetchCollegesList(filterDistrict, filterMaxFees, filterCourse, e.target.value)
              }}
              placeholder="e.g. CEG, PSG, 0001, 2718..."
              className="w-full px-3 py-2.5 rounded-xl input-dark text-white font-semibold text-xs"
            />
          </div>
        </div>

        {/* Filter Badges & Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-medium">
            <span>Showing <strong className="text-cyan-300 font-mono text-sm">{colleges.length}</strong> accredited institutions</span>
            {filterDistrict !== 'All' && (
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-md font-semibold">
                District: {filterDistrict}
              </span>
            )}
            {filterMaxFees && (
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-md font-semibold">
                Fees ≤ ₹{Number(filterMaxFees).toLocaleString()}
              </span>
            )}
          </div>

          {(filterDistrict !== 'All' || filterMaxFees || searchQuery || filterCourse !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="text-slate-400 hover:text-white underline transition cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Colleges Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Querying institutional database...</p>
        </div>
      ) : colleges.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-white/10 space-y-3">
          <span className="text-3xl">🔍</span>
          <h3 className="text-base font-bold text-white">No Colleges Match Criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your maximum tuition fee limit or choosing "All Districts" to broaden your results.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {colleges.map((c) => (
            <div
              key={c.code}
              className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="bg-blue-500/10 text-cyan-300 border border-blue-500/20 font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg">
                    TNEA: {c.code}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {c.nirf_rank && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        NIRF #{c.nirf_rank}
                      </span>
                    )}
                    {c.naac_grade && (
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        NAAC {c.naac_grade}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-extrabold text-white text-base mt-2.5 group-hover:text-cyan-300 transition leading-snug">
                  {c.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <span>📍 {c.district}</span>
                  <span>•</span>
                  <span>{c.type}</span>
                </p>
              </div>

              {/* Key Institutional Metrics */}
              <div className="bg-black/40 rounded-xl p-3 text-xs space-y-1.5 border border-white/5 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Annual Tuition:</span>
                  <span className="font-bold text-white">₹{c.tuition_fee_per_year?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hostel & Living:</span>
                  <span className="font-bold text-slate-300">₹{c.hostel_fee_per_year?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Placement CTC:</span>
                  <span className="font-bold text-emerald-400 font-mono">₹{c.avg_placement_lpa} LPA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Highest Package:</span>
                  <span className="font-bold text-cyan-300 font-mono">₹{c.highest_placement_lpa} LPA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Placement Rate:</span>
                  <span className="font-bold text-slate-200">{c.placement_pct}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                <button
                  onClick={() => onSelectTrend(c.code)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Cutoff Trend</span>
                  <span>➔</span>
                </button>

                <button
                  onClick={() => onSelectCompare(c.code)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-bold border border-white/10 transition cursor-pointer"
                >
                  + Compare
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
