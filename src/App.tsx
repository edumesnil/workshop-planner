import { Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './components/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { DashboardPage } from './pages/DashboardPage'
import { WorkshopsPage } from './pages/WorkshopsPage'
import { ToolsPage } from './pages/ToolsPage'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshops"
          element={
            <ProtectedRoute>
              <WorkshopsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools"
          element={
            <ProtectedRoute>
              <ToolsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App