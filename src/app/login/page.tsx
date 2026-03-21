'use client'
import { useState } from 'react'

const C = { navy950: '#060D1A', navy900: '#0A1628', teal: '#2D8A87', tealHov: '#3BA8A5', white: '#FFFFFF', muted: '#94A3B8', dim: '#64748B', border: '#1E3A5F' }
const F = "'Plus Jakarta Sans', sans-serif"

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [hovDemo, setHovDemo]   = useState(false)
  const [focusEmail, setFocusEmail] = useState(false)
  const [focusPwd, setFocusPwd]     = useState(false)

  const inputStyle = (focused: boolean) => ({
    width: '100%', background: C.navy950,
    border: `1px solid ${focused ? C.teal : C.border}`,
    borderRadius: 8, padding: '12px 16px',
    color: C.white, fontSize: 15, outline: 'none',
    fontFamily: F, boxSizing: 'border-box' as const,
    transition: 'border-color .15s',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    } else {
      window.location.href = '/hub'
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: F }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}a{text-decoration:none;color:inherit}::placeholder{color:#475569}`}</style>

      {/* Left column */}
      <div style={{ flex: 1, background: C.navy900, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '48px 64px' }}>
        <a href="/" style={{ fontSize: 13, color: C.dim, marginBottom: 48, display: 'inline-block', cursor: 'pointer', textDecoration: 'none' }}>← Back to omniversel.com</a>

        <a href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
            OMNIVERSEL
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
            Urban Resilience Platform
          </div>
        </a>

        <h1 style={{ fontSize: 36, fontWeight: 700, color: C.white, lineHeight: 1.2, marginBottom: 12 }}>
          Sign in to your<br />workspace.
        </h1>
        <p style={{ fontSize: 16, color: C.muted, marginBottom: 40 }}>Access your organization&apos;s resilience platform.</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Work Email</label>
            <input
              type="email"
              placeholder="you@organization.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusEmail(true)}
              onBlur={() => setFocusEmail(false)}
              style={inputStyle(focusEmail)}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusPwd(true)}
              onBlur={() => setFocusPwd(false)}
              style={inputStyle(focusPwd)}
              required
            />
          </div>

          {error && (
            <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '8px' }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#1E6663' : C.teal,
              color: C.white, fontWeight: 600, fontSize: 15, padding: 14,
              borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: F, transition: 'background .15s',
            }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 12, color: '#475569' }}>or</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        <button
          onMouseEnter={() => setHovDemo(true)}
          onMouseLeave={() => setHovDemo(false)}
          style={{
            width: '100%', background: 'transparent',
            color: hovDemo ? C.white : C.muted,
            border: `1px solid ${hovDemo ? C.teal : C.border}`,
            fontWeight: 600, fontSize: 15, padding: 14,
            borderRadius: 8, cursor: 'pointer', marginTop: 16,
            fontFamily: F, transition: 'all .15s',
          }}>
          Request Demo Access
        </button>

        <p style={{ fontSize: 13, color: C.dim, marginTop: 24 }}>
          Don&apos;t have an account?{' '}
          <a href="mailto:info@omniversel.com" style={{ color: C.teal }}>Contact our team →</a>
        </p>
      </div>

      {/* Right column */}
      <div className="login-right" style={{ flex: 1, background: C.navy950, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 64px' }}>

        {/* Quote card */}
        <div style={{
          background: C.navy900, border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${C.teal}`, borderRadius: 16, padding: 40,
        }}>
          <p style={{ fontSize: 18, color: C.white, fontStyle: 'italic', lineHeight: 1.7 }}>
            &ldquo;Omniversel gave us the first defensible, auditable resilience score we could present to our board and our regulator in the same meeting.&rdquo;
          </p>
          <p style={{ fontSize: 13, color: C.dim, marginTop: 16 }}>
            — Head of Operational Risk, Turkish Financial Institution
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          {[
            { val: '782+', label: 'Facilities Assessed' },
            { val: '94%',  label: 'Compliance Rate' },
            { val: '10',   label: 'Sectors Served' },
          ].map(s => (
            <div key={s.val} style={{
              flex: 1, background: C.navy900, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: 24, textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.teal, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: '#475569', textAlign: 'center', marginTop: 48, lineHeight: 1.6 }}>
          Secured by enterprise-grade infrastructure · GDPR compliant · Data sovereignty guaranteed
        </p>
      </div>
    </div>
  )
}
