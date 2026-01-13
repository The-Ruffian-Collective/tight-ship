import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ManagerDashboard from './pages/manager/Dashboard'
import ManagerTasks from './pages/manager/Tasks'
import ManagerLog from './pages/manager/Log'
import StaffDashboard from './pages/staff/Dashboard'
import StaffChecklist from './pages/staff/Checklist'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-navy-200 border-t-navy-900 mx-auto" />
          <p className="mt-4 text-navy-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function RoleBasedRedirect() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-navy-200 border-t-navy-900 mx-auto" />
          <p className="mt-4 text-navy-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (profile?.role === 'manager') {
    return <Navigate to="/manager" replace />
  }

  return <Navigate to="/staff" replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Manager routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/tasks"
            element={
              <ProtectedRoute>
                <ManagerTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/log"
            element={
              <ProtectedRoute>
                <ManagerLog />
              </ProtectedRoute>
            }
          />

          {/* Staff routes */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/checklist"
            element={
              <ProtectedRoute>
                <StaffChecklist />
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
