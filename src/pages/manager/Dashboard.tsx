import { Link } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import { useAuth } from '../../hooks/useAuth'

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

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const navItems = [
  { label: 'Dashboard', href: '/manager', icon: <DashboardIcon /> },
  { label: 'Tasks', href: '/manager/tasks', icon: <TasksIcon /> },
  { label: 'Compliance Log', href: '/manager/log', icon: <LogIcon /> },
]

export default function ManagerDashboard() {
  const { organisation, profile } = useAuth()

  return (
    <AppShell navItems={navItems}>
      <div className="max-w-4xl animate-fade-in">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-navy-900 tracking-tight">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Manager'}
          </h1>
          <p className="mt-2 text-navy-600">
            Managing <span className="font-semibold">{organisation?.name}</span>
          </p>
        </div>

        {/* Stats cards - placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-navy-500 uppercase tracking-wider">Today's Tasks</span>
              <span className="w-3 h-3 rounded-full bg-maritime-500 animate-pulse-slow" />
            </div>
            <p className="font-display text-3xl font-bold text-navy-900">--</p>
            <p className="text-sm text-navy-500 mt-1">Completion rate</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-navy-500 uppercase tracking-wider">Flagged Items</span>
              <span className="w-3 h-3 rounded-full bg-signal-500" />
            </div>
            <p className="font-display text-3xl font-bold text-navy-900">--</p>
            <p className="text-sm text-navy-500 mt-1">Require attention</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-navy-500 uppercase tracking-wider">Overdue</span>
              <span className="w-3 h-3 rounded-full bg-navy-300" />
            </div>
            <p className="font-display text-3xl font-bold text-navy-900">--</p>
            <p className="text-sm text-navy-500 mt-1">Tasks past schedule</p>
          </div>
        </div>

        {/* Quick actions */}
        <h2 className="font-display text-xl font-semibold text-navy-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/manager/tasks"
            className="card group hover:shadow-card-hover transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center text-navy-600 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                <TasksIcon />
              </div>
              <div>
                <h3 className="font-display font-semibold text-navy-900">Manage Tasks</h3>
                <p className="text-sm text-navy-500">Create and edit task templates</p>
              </div>
            </div>
            <ArrowRightIcon />
          </Link>

          <Link
            to="/manager/log"
            className="card group hover:shadow-card-hover transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center text-navy-600 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                <LogIcon />
              </div>
              <div>
                <h3 className="font-display font-semibold text-navy-900">Compliance Log</h3>
                <p className="text-sm text-navy-500">Review completed task records</p>
              </div>
            </div>
            <ArrowRightIcon />
          </Link>
        </div>

        {/* Getting started notice */}
        <div className="mt-8 p-6 bg-maritime-50 rounded-xl border border-maritime-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-maritime-600 text-white flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-semibold text-maritime-900 mb-1">Getting Started</h3>
              <p className="text-maritime-700 text-sm">
                Head to <Link to="/manager/tasks" className="font-semibold underline underline-offset-2 hover:text-maritime-900">Tasks</Link> to create your first task templates.
                You can start with our Quick Start templates or create custom ones for your kitchen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
