import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  GraduationCap,
  Calculator,
  Compass,
  Building2,
  GitCompare,
  TrendingUp,
  Award,
  History,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react'

export default function Navbar({ onOpenCalculator }) {
  const { user, handleLogout, openAuth } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  // Close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setUserDropdownOpen(false)
  }, [location.pathname])

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Structured, logically ordered navigation hierarchy
  const navigationItems = [
    { to: '/', label: 'Overview', icon: Compass },
    { to: '/predict', label: 'Admission Predictor', icon: Sparkles },
    { to: '/colleges', label: 'Colleges Directory', icon: Building2 },
    { to: '/compare', label: 'Compare Colleges', icon: GitCompare },
    { to: '/analytics', label: 'Cutoff Trends', icon: TrendingUp },
    { to: '/scholarships', label: 'Scholarships & Aid', icon: Award },
    { to: '/history', label: 'Prediction Logs', icon: History },
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Institutional Brand Identity */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-900/10 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight font-headline group-hover:text-blue-700 transition">
                  UAPS
                </span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                  TN Admissions
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-none mt-0.5">
                University Admission Prediction System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Logically Structured) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Right Action Tools & User Profile */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            {/* Quick PCM Cutoff Calculator Utility */}
            <button
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50/90 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-all cursor-pointer shadow-2xs"
              title="Class 12 PCM Cutoff Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>Cutoff Calculator</span>
            </button>

            {/* Vertical Divider */}
            <div className="h-5 w-px bg-slate-200" />

            {/* User Session State */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-900 to-blue-700 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {user.full_name || 'Sameer'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block leading-none">
                      {user.is_admin ? 'Administrator' : 'Student Candidate'}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{user.full_name || 'Sameer'}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.username}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {user.is_admin ? 'Admin Verified' : 'TNEA Applicant'}
                      </span>
                    </div>

                    <Link
                      to="/history"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition"
                    >
                      <History className="w-4 h-4 text-slate-400" />
                      <span>My Prediction Logs</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        handleLogout()
                        setUserDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuth('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Clean, Accessible Layout) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1.5 shadow-lg animate-fade-in">
          {/* Quick Cutoff Calculator for Mobile */}
          <div className="pb-2.5 mb-2.5 border-b border-slate-100">
            <button
              onClick={() => {
                onOpenCalculator()
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>PCM Cutoff Calculator</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>

          {/* User Session in Mobile */}
          <div className="pt-3.5 mt-2 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between px-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Logged in as</span>
                  <strong className="text-slate-800">{user.full_name || 'Sameer'}</strong>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    openAuth('login')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuth('register')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-center"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
