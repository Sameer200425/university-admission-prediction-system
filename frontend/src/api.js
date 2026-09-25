const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_STORAGE_KEY = 'uaps_token'
const USER_STORAGE_KEY = 'uaps_user'

export function setAuthToken(token, user = null) {
  if (!token) return
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}

function maybeAuthorizationHeader() {
  const token = getAuthToken()
  if (!token) return null
  return `Bearer ${token}`
}

async function apiFetch(path, options = {}) {
  const authorization = maybeAuthorizationHeader()
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(authorization ? { Authorization: authorization } : {})
    }
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401) clearAuthToken()
    const message = data?.detail || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

// ---------------- Authentication ----------------
export async function login(username, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (data?.access_token) {
    setAuthToken(data.access_token, data.user)
  }
  return data
}

export async function register(username, password, full_name = 'Sameer') {
  return apiFetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, full_name })
  })
}

export async function fetchMe() {
  return apiFetch('/auth/me')
}

// ---------------- Cutoff Tools ----------------
export async function calculateCutoff(payload) {
  return apiFetch('/cutoff/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export async function fetchCutoffTrend(collegeCode, course = 'CSE', community = 'BC') {
  const params = new URLSearchParams({ course, community })
  return apiFetch(`/cutoff/trend/${collegeCode}?${params.toString()}`)
}

export async function predictAdmission(payload) {
  return apiFetch('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export async function fetchPredictionHistory() {
  return apiFetch('/predict/history')
}

// ---------------- 125+ Colleges & Search ----------------
export async function fetchColleges() {
  return apiFetch('/colleges/all')
}

export async function searchColleges(payload) {
  return apiFetch('/colleges/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export async function compareColleges(collegeCodes) {
  return apiFetch('/colleges/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ college_codes: collegeCodes })
  })
}

// ---------------- Rule-Based Scholarship Matcher ----------------
export async function matchScholarships(payload) {
  return apiFetch('/scholarships/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export async function fetchAllScholarships() {
  return apiFetch('/scholarships/all')
}

// ---------------- ROI Calculator ----------------
export async function calculateRoi(payload) {
  return apiFetch('/roi/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

// ---------------- AI Chatbot ----------------
export async function sendChatMessage(message) {
  return apiFetch('/chatbot/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
}

// ---------------- References & Project Chapters ----------------
export async function fetchReferences() {
  return apiFetch('/references')
}

export function getApiBaseUrl() {
  return API_BASE_URL
}
