import React, { createContext, useContext, useState, useEffect } from 'react'
import { login, register, fetchMe, getStoredUser, clearAuthToken, setAuthToken } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return getStoredUser() || { full_name: 'Sameer', username: 'sameer@admission.tn.edu' }
  })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    fetchMe()
      .then(currentUser => {
        if (currentUser) setUser(currentUser)
      })
      .catch(() => {})
  }, [])

  const handleLogin = async (username, password) => {
    setAuthLoading(true)
    setAuthError('')
    try {
      const res = await login(username, password)
      if (res && res.user) {
        setUser(res.user)
      } else {
        setUser({ full_name: 'Sameer', username })
      }
      setShowAuthModal(false)
      return { success: true }
    } catch (err) {
      const msg = err.message || 'Invalid credentials.'
      setAuthError(msg)
      return { success: false, error: msg }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleRegister = async (username, password, full_name) => {
    setAuthLoading(true)
    setAuthError('')
    try {
      await register(username, password, full_name)
      // Auto login on successful register
      return await handleLogin(username, password)
    } catch (err) {
      const msg = err.message || 'Registration failed.'
      setAuthError(msg)
      return { success: false, error: msg }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    setUser(null)
  }

  const openAuth = (mode = 'login') => {
    setAuthMode(mode)
    setAuthError('')
    setShowAuthModal(true)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
        authLoading,
        authError,
        setAuthError,
        handleLogin,
        handleRegister,
        handleLogout,
        openAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
