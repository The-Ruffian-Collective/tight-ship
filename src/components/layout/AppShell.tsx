import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface AppShellProps {
  children: React.ReactNode
  navItems: NavItem[]
}

// Icon components
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const AnchorIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
)

export default function AppShell({ children, navItems }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, organisation, signOut } = useAuth()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
  }

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-navy-900 text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <AnchorIcon />
            <span className="font-display font-bold text-xl tracking-tight">TIGHT SHIP</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-navy-800 transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
        {/* Decorative stripe */}
        <div className="h-1 bg-gradient-to-r from-signal-500 via-signal-400 to-signal-500" />
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-navy-900/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-72 bg-white shadow-nav
          transform transition-transform duration-300 ease-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Desktop header */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-5 border-b border-navy-100">
          <div className="p-2 bg-navy-900 text-white rounded-xl">
            <AnchorIcon />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-navy-900 tracking-tight">TIGHT SHIP</h1>
            <p className="text-xs text-navy-500 font-medium uppercase tracking-wider">Food Safety</p>
          </div>
        </div>

        {/* Mobile spacer for header */}
        <div className="lg:hidden h-16" />

        {/* Organisation info */}
        <div className="px-4 py-4 mx-4 mt-4 lg:mt-0 bg-navy-50 rounded-xl border border-navy-100">
          <p className="text-xs text-navy-500 font-semibold uppercase tracking-wider mb-1">Organisation</p>
          <p className="font-display font-semibold text-navy-900 truncate">
            {organisation?.name || 'Loading...'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <p className="px-4 mb-2 text-xs text-navy-400 font-semibold uppercase tracking-wider">Menu</p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-navy-100 bg-white">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-navy-200 flex items-center justify-center">
              <span className="text-navy-700 font-display font-semibold text-sm">
                {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy-900 truncate text-sm">
                {profile?.full_name || 'Loading...'}
              </p>
              <p className="text-xs text-navy-500 uppercase tracking-wider">
                {profile?.role || '...'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
                       text-navy-600 font-display font-medium uppercase tracking-wide text-sm
                       border-2 border-navy-200 hover:border-signal-500 hover:text-signal-600
                       transition-all duration-200"
          >
            <LogoutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        {/* Desktop header bar */}
        <div className="hidden lg:block h-2 bg-gradient-to-r from-navy-900 via-navy-700 to-navy-900" />

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
