import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Anchor icon SVG
const AnchorIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      {/* Decorative header stripe */}
      <div className="h-2 bg-gradient-to-r from-navy-900 via-navy-700 to-navy-900" />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo and brand */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-navy-900 text-white rounded-2xl mb-6 shadow-card">
              <AnchorIcon />
            </div>
            <h1 className="font-display text-4xl font-bold text-navy-900 tracking-tight">
              TIGHT SHIP
            </h1>
            <p className="mt-2 text-navy-600 font-body">
              Food safety compliance, simplified
            </p>
          </div>

          {/* Login card */}
          <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-display text-2xl font-semibold text-navy-900 mb-6">
              Sign In
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-signal-50 border-l-4 border-signal-500 text-signal-800 rounded-r-lg animate-fade-in">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

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
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-navy-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            New to Tight Ship?{' '}
            <Link
              to="/signup"
              className="font-semibold text-navy-900 hover:text-signal-600 transition-colors underline underline-offset-2"
            >
              Create an account
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
