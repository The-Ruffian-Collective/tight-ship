import { Link } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import { useAuth } from '../../hooks/useAuth'

// Icon components
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const ChecklistIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const navItems = [
  { label: 'Dashboard', href: '/staff', icon: <DashboardIcon /> },
  { label: 'Checklist', href: '/staff/checklist', icon: <ChecklistIcon /> },
]

export default function StaffDashboard() {
  const { organisation, profile } = useAuth()

  // Get current time for greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <AppShell navItems={navItems}>
      <div className="max-w-2xl animate-fade-in">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-navy-900 tracking-tight">
            {greeting}, {profile?.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="mt-2 text-navy-600">
            <span className="font-semibold">{organisation?.name}</span>
          </p>
        </div>

        {/* Today's status */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <ClockIcon />
            <h2 className="font-display text-lg font-semibold text-navy-900">Today's Progress</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-navy-50 rounded-xl">
              <p className="text-sm font-semibold text-navy-500 uppercase tracking-wider mb-1">Outstanding</p>
              <p className="font-display text-3xl font-bold text-navy-900">--</p>
            </div>
            <div className="p-4 bg-maritime-50 rounded-xl">
              <p className="text-sm font-semibold text-maritime-600 uppercase tracking-wider mb-1">Completed</p>
              <p className="font-display text-3xl font-bold text-maritime-700">--</p>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <Link
          to="/staff/checklist"
          className="block card group hover:shadow-card-hover transition-all duration-200 border-2 border-navy-200 hover:border-signal-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-signal-500 text-white flex items-center justify-center">
                <ChecklistIcon />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-navy-900 group-hover:text-signal-600 transition-colors">
                  Start Checklist
                </h3>
                <p className="text-navy-500">Complete your daily tasks</p>
              </div>
            </div>
            <div className="text-navy-400 group-hover:text-signal-500 group-hover:translate-x-1 transition-all">
              <ArrowRightIcon />
            </div>
          </div>
        </Link>

        {/* Tips section */}
        <div className="mt-8 p-5 bg-navy-100 rounded-xl">
          <p className="text-sm text-navy-600">
            <span className="font-semibold">Tip:</span> Complete tasks as you go through your shift.
            If a reading is out of range or you select "No", you'll need to add a comment explaining the situation.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
