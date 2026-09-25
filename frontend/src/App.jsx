import React, { useState } from 'react'
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import CutoffCalculatorModal from './components/CutoffCalculatorModal'
import ChatbotDrawer from './components/ChatbotDrawer'

// Page Components
import HomePage from './pages/HomePage'
import PredictPage from './pages/PredictPage'
import CollegesPage from './pages/CollegesPage'
import ComparisonPage from './pages/ComparisonPage'
import AnalyticsPage from './pages/AnalyticsPage'
import HistoryPage from './pages/HistoryPage'
import ScholarshipsPage from './pages/ScholarshipsPage'
import ReferencesPage from './pages/ReferencesPage'

function AppContent() {
  const [showCalculator, setShowCalculator] = useState(false)
  const [compareCodes, setCompareCodes] = useState(['0001', '2006', '5901'])
  const [selectedTrendCode, setSelectedTrendCode] = useState('0001')
  const navigate = useNavigate()

  const handleApplyCutoff = (cutoffVal) => {
    setShowCalculator(false)
    navigate(`/predict?cutoff=${cutoffVal}`)
  }

  const handleSelectCompare = (code) => {
    if (!compareCodes.includes(code)) {
      setCompareCodes([...compareCodes.slice(-2), code])
    }
    navigate(`/compare?codes=${[...compareCodes.slice(-2), code].join(',')}`)
  }

  const handleSelectTrend = (code) => {
    setSelectedTrendCode(code)
    navigate(`/analytics?college=${code}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar onOpenCalculator={() => setShowCalculator(true)} />

      {/* Main Page Routing Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route
            path="/"
            element={<HomePage onOpenCalculator={() => setShowCalculator(true)} />}
          />
          <Route
            path="/predict"
            element={
              <PredictPage
                onOpenCalculator={() => setShowCalculator(true)}
                onSelectCompare={handleSelectCompare}
                onSelectTrend={handleSelectTrend}
              />
            }
          />
          <Route
            path="/colleges"
            element={
              <CollegesPage
                onSelectCompare={handleSelectCompare}
                onSelectTrend={handleSelectTrend}
              />
            }
          />
          <Route
            path="/compare"
            element={
              <ComparisonPage
                compareCodes={compareCodes}
                setCompareCodes={setCompareCodes}
                onSelectTrend={handleSelectTrend}
              />
            }
          />
          <Route
            path="/analytics"
            element={<AnalyticsPage selectedCollegeCode={selectedTrendCode} />}
          />
          <Route
            path="/scholarships"
            element={<ScholarshipsPage />}
          />
          <Route
            path="/history"
            element={<HistoryPage />}
          />
          <Route
            path="/references"
            element={<ReferencesPage />}
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Floating Counselor */}
      <AuthModal />
      <CutoffCalculatorModal
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onApplyCutoff={handleApplyCutoff}
      />
      <ChatbotDrawer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}
