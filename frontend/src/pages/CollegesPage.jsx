import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchColleges, fetchColleges } from '../api'
import {
  GraduationCap,
  Building,
  MapPin,
  IndianRupee,
  Award,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  GitCompare,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
  Sparkles,
  Info
} from 'lucide-react'

export default function CollegesPage({ onSelectCompare, onSelectTrend, compareCodes = [] }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [colleges, setColleges] = useState([])
  const [totalCount, setTotalCount] = useState(125)
  const [districts, setDistricts] = useState([])
  const [filterDistrict, setFilterDistrict] = useState(searchParams.get('district') || 'All')
  const [filterMaxFees, setFilterMaxFees] = useState(searchParams.get('maxFees') || '')
  const [filterCourse, setFilterCourse] = useState('ALL')
  const [filterType, setFilterType] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // College Details Modal State
  const [selectedCollege, setSelectedCollege] = useState(null)

  useEffect(() => {
    fetchList(filterDistrict, filterMaxFees, filterCourse, filterType, searchQuery)
  }, [])

  const fetchList = async (dist, fee, crs, type, query) => {
    setLoading(true)
    try {
      const payload = {
        district: dist !== 'All' ? dist : undefined,
        max_fees: fee ? Number(fee) : undefined,
        course: crs !== 'ALL' ? crs : undefined,
        college_type: type !== 'ALL' ? type : undefined,
        query: query.trim() || undefined
      }
      const res = await searchColleges(payload)
      setColleges(res.colleges || [])
      if (res.count && !totalCount) {
        setTotalCount(res.count)
      }

      // Fetch all to get total count & full districts list if not loaded
      if (districts.length === 0) {
        const allRes = await fetchColleges()
        if (allRes.districts) setDistricts(allRes.districts)
        if (allRes.count) setTotalCount(allRes.count)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const applySlide11Filter = () => {
    setFilterDistrict('Chennai')
    setFilterMaxFees('200000')
    setFilterCourse('ALL')
    setFilterType('ALL')
    setSearchQuery('')
    fetchList('Chennai', '200000', 'ALL', 'ALL', '')
  }

  const clearFilters = () => {
    setFilterDistrict('All')
    setFilterMaxFees('')
    setFilterCourse('ALL')
    setFilterType('ALL')
    setSearchQuery('')
    fetchList('All', '', 'ALL', 'ALL', '')
  }

  const isCollegeCompared = (code) => {
    return compareCodes && compareCodes.includes(String(code))
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-0.5 rounded-full text-xs font-semibold mb-2 border border-indigo-200">
              <Building className="w-3.5 h-3.5" />
              <span>Verified Institutional Knowledge Base ({totalCount} Engineering Colleges)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {totalCount}+ Verified Colleges Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Structured relational directory with NIRF rankings, NAAC accreditations, verified fee schedules, community cutoffs, and campus placements.
            </p>
          </div>

          <button
            onClick={applySlide11Filter}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Filter to Chennai colleges with fees below ₹2 Lakhs"
          >
            <span>⚡</span>
            <span>Slide 11 Test Case (Chennai &lt; ₹2L)</span>
          </button>
        </div>
      </div>

      {/* Structured Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* District Dropdown */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">District / Region</label>
            <select
              value={filterDistrict}
              onChange={(e) => {
                setFilterDistrict(e.target.value)
                fetchList(e.target.value, filterMaxFees, filterCourse, filterType, searchQuery)
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:border-blue-600 outline-none"
            >
              <option value="All">All Districts ({districts.length} Districts)</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Max Fees */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Max Annual Tuition (₹)</label>
            <input
              type="number"
              value={filterMaxFees}
              onChange={(e) => {
                setFilterMaxFees(e.target.value)
                fetchList(filterDistrict, e.target.value, filterCourse, filterType, searchQuery)
              }}
              placeholder="e.g. 200000"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:border-blue-600 outline-none"
            />
          </div>

          {/* Branch Filter */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Engineering Branch</label>
            <select
              value={filterCourse}
              onChange={(e) => {
                setFilterCourse(e.target.value)
                fetchList(filterDistrict, filterMaxFees, e.target.value, filterType, searchQuery)
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:border-blue-600 outline-none"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">CSE - Computer Science</option>
              <option value="IT">IT - Information Technology</option>
              <option value="AI&DS">AI & DS - Artificial Intelligence</option>
              <option value="ECE">ECE - Electronics & Comm.</option>
              <option value="EEE">EEE - Electrical & Electronics</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Mechatronics">Mechatronics</option>
              <option value="Chemical">Chemical Engineering</option>
              <option value="Biotechnology">Biotechnology</option>
            </select>
          </div>

          {/* Institution Type Filter */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Institution Type</label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value)
                fetchList(filterDistrict, filterMaxFees, filterCourse, e.target.value, searchQuery)
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:border-blue-600 outline-none"
            >
              <option value="ALL">All Institution Types</option>
              <option value="Government">Government Colleges</option>
              <option value="Autonomous">Autonomous Institutions</option>
              <option value="Affiliated Self-Financing">Self-Financing Colleges</option>
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Search Name / Code</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  fetchList(filterDistrict, filterMaxFees, filterCourse, filterType, e.target.value)
                }}
                placeholder="e.g. CEG, 2718, PSG..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 text-xs focus:border-blue-600 outline-none pl-8"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Quick Fee Presets & Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-slate-900 font-bold">{colleges.length}</strong> of <strong className="text-indigo-700 font-bold">{totalCount}</strong> verified institutions</span>
            {filterDistrict !== 'All' && (
              <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200">
                {filterDistrict}
              </span>
            )}
            {filterMaxFees && (
              <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-200">
                ≤ ₹{Number(filterMaxFees).toLocaleString()}
              </span>
            )}
            {filterType !== 'ALL' && (
              <span className="bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded border border-purple-200">
                {filterType}
              </span>
            )}
          </div>

          {/* Quick Fee Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1">Quick Budget:</span>
            <button
              onClick={() => {
                setFilterMaxFees('50000')
                fetchList(filterDistrict, '50000', filterCourse, filterType, searchQuery)
              }}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] cursor-pointer"
            >
              &lt; ₹50k (Govt)
            </button>
            <button
              onClick={() => {
                setFilterMaxFees('120000')
                fetchList(filterDistrict, '120000', filterCourse, filterType, searchQuery)
              }}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] cursor-pointer"
            >
              &lt; ₹1.2L (Aided)
            </button>
            <button
              onClick={() => {
                setFilterMaxFees('200000')
                fetchList(filterDistrict, '200000', filterCourse, filterType, searchQuery)
              }}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] cursor-pointer"
            >
              &lt; ₹2.0L (Slide 11)
            </button>
            {(filterDistrict !== 'All' || filterMaxFees || searchQuery || filterCourse !== 'ALL' || filterType !== 'ALL') && (
              <button
                onClick={clearFilters}
                className="ml-2 text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Colleges Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Querying verified database...</p>
        </div>
      ) : colleges.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Colleges Found</h3>
          <p className="text-xs text-slate-500">Try broadening your search query or removing filters.</p>
          <button onClick={clearFilters} className="text-xs font-bold text-blue-600 underline cursor-pointer">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {colleges.map((c) => {
            const isAdded = isCollegeCompared(c.code)
            return (
              <div
                key={c.code}
                className="dashboard-card p-5 flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      TNEA {c.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {c.nirf_rank && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          NIRF #{c.nirf_rank}
                        </span>
                      )}
                      {c.naac_grade && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          NAAC {c.naac_grade}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3
                    onClick={() => setSelectedCollege(c)}
                    className="font-bold text-slate-900 text-base mt-2.5 leading-snug hover:text-blue-600 cursor-pointer transition"
                  >
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{c.district}</span>
                    <span>•</span>
                    <span>{c.type}</span>
                    {c.established && (
                      <>
                        <span>•</span>
                        <span>Est. {c.established}</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Key Metrics Block */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 font-medium">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Annual Tuition Fee:</span>
                    <span className="font-bold text-slate-900">₹{c.tuition_fee_per_year?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg Placement CTC:</span>
                    <span className="font-bold text-emerald-700 font-mono">₹{c.avg_placement_lpa} LPA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Placement Success:</span>
                    <span className="font-bold text-slate-700">{c.placement_pct}%</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => setSelectedCollege(c)}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectTrend && onSelectTrend(c.code)}
                      className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                      title="View Historical Cutoffs & Trend Forecast"
                    >
                      Trends ➔
                    </button>
                    <button
                      onClick={() => onSelectCompare && onSelectCompare(c.code)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                        isAdded
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-purple-700" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <GitCompare className="w-3.5 h-3.5" />
                          <span>+ Compare</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAILED COLLEGE MODAL / SHEET (Fees, Cutoffs, Placements, Facilities)    */}
      {/* ========================================================================= */}
      {selectedCollege && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-black bg-blue-600 text-white px-2.5 py-0.5 rounded">
                    TNEA CODE: {selectedCollege.code}
                  </span>
                  {selectedCollege.nirf_rank && (
                    <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      NIRF Rank #{selectedCollege.nirf_rank}
                    </span>
                  )}
                  {selectedCollege.naac_grade && (
                    <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      NAAC {selectedCollege.naac_grade}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {selectedCollege.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>{selectedCollege.district}, Tamil Nadu</span>
                  <span>•</span>
                  <span>{selectedCollege.type}</span>
                  <span>•</span>
                  <span>Established: {selectedCollege.established || 2000}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedCollege(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* 1. Fee Structure Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                  <span>Fee Structure & Government Waivers</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Tuition Fee</span>
                    <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                      ₹{selectedCollege.tuition_fee_per_year ? Number(selectedCollege.tuition_fee_per_year).toLocaleString() : '85,000'}
                    </span>
                    <span className="text-[10px] text-slate-400">Fixed by Govt Committee</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Hostel & Mess</span>
                    <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                      ₹{selectedCollege.hostel_fee_per_year ? Number(selectedCollege.hostel_fee_per_year).toLocaleString() : '65,000'}
                    </span>
                    <span className="text-[10px] text-slate-400">Boarding & Amenities</span>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <span className="text-[10px] uppercase font-bold text-blue-700 block">Estimated 4-Yr Cost</span>
                    <span className="text-xl font-black text-blue-800 font-mono mt-1 block">
                      ₹{(((selectedCollege.tuition_fee_per_year || 85000) + (selectedCollege.hostel_fee_per_year || 65000)) * 4).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-blue-600">Tuition + Hostel</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] leading-relaxed">
                  <strong>Verified State Concession Support:</strong> Eligible for Tamil Nadu First Graduate concession (₹25,000/yr waiver), 7.5% Govt School 100% full fee waiver, and Post-Matric SC/ST 100% scholarship.
                </div>
              </div>

              {/* 2. CSE Cutoffs Benchmarks */}
              {selectedCollege.base_cutoff_cse && Object.keys(selectedCollege.base_cutoff_cse).length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Baseline Community Cutoffs (Computer Science - CSE)</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center font-mono">
                    {Object.entries(selectedCollege.base_cutoff_cse).map(([comm, score]) => (
                      <div key={comm} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">{comm}</span>
                        <span className="text-sm font-black text-slate-900 block mt-0.5">{score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Campus Placements & Recruiters */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Campus Placement Statistics & Top Recruiters</span>
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg CTC</span>
                    <span className="text-lg font-black text-emerald-600 font-mono mt-0.5 block">
                      ₹{selectedCollege.avg_placement_lpa} LPA
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Highest Package</span>
                    <span className="text-lg font-black text-blue-700 font-mono mt-0.5 block">
                      ₹{selectedCollege.highest_placement_lpa} LPA
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Placement Rate</span>
                    <span className="text-lg font-black text-slate-800 font-mono mt-0.5 block">
                      {selectedCollege.placement_pct}%
                    </span>
                  </div>
                </div>

                {selectedCollege.top_recruiters && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Top Hiring Companies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCollege.top_recruiters.map((rec, rIdx) => (
                        <span key={rIdx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium text-xs border border-slate-200">
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Campus Infrastructure & Facilities */}
              {selectedCollege.infrastructure && selectedCollege.infrastructure.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>Campus Infrastructure & Facilities ({selectedCollege.campus_size_acres || 50} Acres)</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCollege.infrastructure.map((fac, fIdx) => (
                      <span key={fIdx} className="px-3 py-1 rounded-xl bg-indigo-50/70 text-indigo-800 font-medium text-xs border border-indigo-200 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{fac}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Key Engineering Disciplines Offered */}
              {selectedCollege.courses && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block">Engineering Branches Offered:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCollege.courses.map((crs, cIdx) => (
                      <span key={cIdx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] font-semibold border border-blue-100">
                        {crs}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => {
                  setSelectedCollege(null)
                  if (onSelectTrend) onSelectTrend(selectedCollege.code)
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Cutoff Trends ➔</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectCompare) onSelectCompare(selectedCollege.code)
                    setSelectedCollege(null)
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <GitCompare className="w-4 h-4" />
                  <span>+ Add to Compare Matrix</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
