import { useState, useEffect, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import type { Organisation } from '../../types/database'

// Anchor icon SVG
const AnchorIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
)

type SignupMode = 'manager' | 'staff'

export default function Signup() {
  const [mode, setMode] = useState<SignupMode>('manager')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [orgName, setOrgName] = useState('')
  const [selectedOrgId, setSelectedOrgId] = useState('')
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingOrgs, setLoadingOrgs] = useState(false)
  const { signUp, signUpStaff } = useAuth()
  const navigate = useNavigate()

  // Fetch organisations for staff signup
  useEffect(() => {
    if (mode === 'staff') {
      setLoadingOrgs(true)
      supabase
        .from('organisations')
        .select('*')
        .order('name')
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching organisations:', error)
          } else {
            setOrganisations(data || [])
          }
          setLoadingOrgs(false)
        })
    }
  }, [mode])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'manager') {
      const { error } = await signUp(email, password, fullName, orgName)
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        navigate('/')
      }
    } else {
      if (!selectedOrgId) {
        setError('Please select an organisation')
        setLoading(false)
        return
      }
      const { error } = await signUpStaff(email, password, fullName, selectedOrgId)
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        navigate('/')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      {/* Decorative header stripe */}
      <div className="h-2 bg-gradient-to-r from-navy-900 via-navy-700 to-navy-900" />

      <div className="flex-1 flex items-center justify-center p-6 py-10">
        <div className="w-full max-w-md">
          {/* Logo and brand */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-navy-900 text-white rounded-2xl mb-6 shadow-card">
              <AnchorIcon />
            </div>
            <h1 className="font-display text-4xl font-bold text-navy-900 tracking-tight">
              TIGHT SHIP
            </h1>
            <p className="mt-2 text-navy-600 font-body">
              Get your kitchen compliant
            </p>
          </div>

          {/* Signup card */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-display text-2xl font-semibold text-navy-900 mb-6">
              Create Account
            </h2>

            {/* Mode toggle */}
            <div className="flex bg-navy-100 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setMode('manager')}
                className={`flex-1 py-2.5 px-4 rounded-md font-display font-medium text-sm uppercase tracking-wide transition-all duration-200 ${
                  mode === 'manager'
                    ? 'bg-white text-navy-900 shadow-card'
                    : 'text-navy-600 hover:text-navy-800'
                }`}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => setMode('staff')}
                className={`flex-1 py-2.5 px-4 rounded-md font-display font-medium text-sm uppercase tracking-wide transition-all duration-200 ${
                  mode === 'staff'
                    ? 'bg-white text-navy-900 shadow-card'
                    : 'text-navy-600 hover:text-navy-800'
                }`}
              >
                Staff
              </button>
            </div>

            {/* Mode description */}
            <div className="mb-6 p-3 bg-navy-50 rounded-lg border border-navy-100">
              <p className="text-sm text-navy-700">
                {mode === 'manager' ? (
                  <>
                    <span className="font-semibold">Managers</span> create and manage their organisation's tasks,
                    review compliance logs, and oversee staff activity.
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Staff</span> complete daily checklists and log task records
                    for their organisation.
                  </>
                )}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-signal-50 border-l-4 border-signal-500 text-signal-800 rounded-r-lg animate-fade-in">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="input-label">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  placeholder="John Smith"
                  required
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="email" className="input-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@kitchen.co.uk"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="input-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              {mode === 'manager' ? (
                <div>
                  <label htmlFor="orgName" className="input-label">
                    Organisation Name
                  </label>
                  <input
                    id="orgName"
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="input-field"
                    placeholder="The Crown & Anchor"
                    required
                  />
                  <p className="mt-1.5 text-xs text-navy-500">
                    Your kitchen, restaurant, or venue name
                  </p>
                </div>
              ) : (
                <div>
                  <label htmlFor="organisation" className="input-label">
                    Select Organisation
                  </label>
                  <select
                    id="organisation"
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    className="input-field appearance-none cursor-pointer"
                    required
                    disabled={loadingOrgs}
                  >
                    <option value="">
                      {loadingOrgs ? 'Loading...' : 'Choose your organisation'}
                    </option>
                    {organisations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                  {!loadingOrgs && organisations.length === 0 && (
                    <p className="mt-1.5 text-xs text-signal-600">
                      No organisations found. Ask your manager to sign up first.
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : mode === 'manager' ? (
                  'Create Organisation'
                ) : (
                  'Join Organisation'
                )}
              </button>
            </form>
          </div>

          {/* Sign in link */}
          <p className="mt-8 text-center text-navy-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-navy-900 hover:text-signal-600 transition-colors underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-sm text-navy-500">
        <p>Keep your kitchen compliant</p>
      </div>
    </div>
  )
}
