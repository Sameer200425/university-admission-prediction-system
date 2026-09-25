import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal() {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    authLoading,
    authError,
    setAuthError,
    handleLogin,
    handleRegister
  } = useAuth()

  const [form, setForm] = useState({
    username: '',
    password: '',
    full_name: 'Sameer'
  })
  const [showPassword, setShowPassword] = useState(false)

  if (!showAuthModal) return null

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      setAuthError('Please fill in both email and password.')
      return
    }

    if (authMode === 'login') {
      await handleLogin(form.username, form.password)
    } else {
      await handleRegister(form.username, form.password, form.full_name)
    }
  }

  const fillDemoAccount = () => {
    setForm({
      username: 'sameer@admission.tn.edu',
      password: 'password123',
      full_name: 'Sameer'
    })
    setAuthError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md rounded-2xl glass-panel p-6 sm:p-8 relative border border-white/10 shadow-2xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] mx-auto mb-3 shadow-lg shadow-blue-500/25">
            <div className="w-full h-full bg-[#070d1e] rounded-[11px] flex items-center justify-center text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              TN
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {authMode === 'login' ? 'Sign In to TNEA Portal' : 'Create Student Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access personalized admission forecasting and historical cutoff analytics
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-black/40 p-1 rounded-xl mb-5 border border-white/5">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setAuthError('') }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'login'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setAuthError('') }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert Box */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{authError}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          {authMode === 'register' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="e.g. Sameer Khan"
                className="w-full px-3.5 py-2.5 rounded-xl input-dark text-xs"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email / Student ID</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="sameer@admission.tn.edu"
              className="w-full px-3.5 py-2.5 rounded-xl input-dark text-xs"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-semibold">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl input-dark text-xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {authLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : null}
            <span>{authMode === 'login' ? 'Sign In to Portal' : 'Register Account'}</span>
          </button>
        </form>

        {/* Demo Credentials Quick-Loader */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={fillDemoAccount}
            className="text-[11px] text-slate-400 hover:text-cyan-300 transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <span>⚡</span>
            <span>Click to autofill Presentation Demo Credentials (Sameer)</span>
          </button>
        </div>
      </div>
    </div>
  )
}
