import { Link } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'

// Icon components
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const TasksIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)

const LogIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const navItems = [
  { label: 'Dashboard', href: '/manager', icon: <DashboardIcon /> },
  { label: 'Tasks', href: '/manager/tasks', icon: <TasksIcon /> },
  { label: 'Compliance Log', href: '/manager/log', icon: <LogIcon /> },
]

export default function Log() {
  return (
    <AppShell navItems={navItems}>
      <div className="max-w-6xl animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-navy-900 tracking-tight">
              Compliance Log
            </h1>
            <p className="mt-1 text-navy-600">
              Review all completed task records
            </p>
          </div>
        </div>

        {/* Placeholder content */}
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-navy-100 flex items-center justify-center mx-auto mb-4">
            <LogIcon />
          </div>
          <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">
            Compliance Log Coming Soon
          </h2>
          <p className="text-navy-600 max-w-md mx-auto">
            This is where you'll review all task records submitted by your team.
            The log viewer will be available in Stage 3.
          </p>
          <Link to="/manager" className="btn-secondary inline-block mt-6">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
