import { useState } from 'react'
import { clearAuthSession, getStoredAuthSession } from './api/auth'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import './App.css'

function App() {
  const [mode, setMode] = useState('login')
  const [session, setSession] = useState(() => getStoredAuthSession())

  const handleSignOut = () => {
    clearAuthSession()
    setSession(null)
    setMode('login')
  }

  if (session?.user) {
    return (
      <Dashboard
        user={session.user}
        token={session.token}
        onSignOut={handleSignOut}
      />
    )
  }

  return (
    <main className="auth-screen">
      <section className="brand-panel" aria-label="ProposalPro">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            PP
          </div>
          <span>ProposalPro</span>
        </div>

        <div className="brand-copy">
          <p className="eyebrow">Proposal workspace</p>
          <h1>Keep every deal moving with less friction.</h1>
          <p>
            Sign in to manage client-ready proposals, approvals, and follow-up
            work from one focused place.
          </p>
        </div>

        <div className="proposal-preview" aria-hidden="true">
          <div className="preview-topline">
            <span></span>
            <span></span>
          </div>
          <div className="preview-title"></div>
          <div className="preview-grid">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="preview-total">
            <span></span>
            <strong>$18,400</strong>
          </div>
        </div>
      </section>

      <section className="auth-panel" aria-label="Authentication form">
        <div className="mode-toggle" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            className={mode === 'login' ? 'is-active' : ''}
            onClick={() => setMode('login')}
            role="tab"
            aria-selected={mode === 'login'}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'is-active' : ''}
            onClick={() => setMode('signup')}
            role="tab"
            aria-selected={mode === 'signup'}
          >
            Signup
          </button>
        </div>

        {mode === 'login' ? (
          <Login onSuccess={setSession} onModeChange={setMode} />
        ) : (
          <Signup onSuccess={setSession} onModeChange={setMode} />
        )}
      </section>
    </main>
  )
}

export default App
