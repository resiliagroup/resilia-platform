'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Plus_Jakarta_Sans } from 'next/font/google'

const font = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })

const FEATURES = [
  { tag: 'omniRISK',   desc: 'Facility-level URI scoring with NATECH analysis' },
  { tag: 'omniIMPACT', desc: 'Business Impact Analysis aligned with BDDK ISEDES' },
  { tag: 'omniPLAN',   desc: 'ISO 22301 compliant BCP scenario management' },
  { tag: 'omniAUDIT',  desc: 'BDDK Climate Guide & Basel IV compliance tracking' },
]

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [focusEmail, setFocusEmail] = useState(false)
  const [focusPwd, setFocusPwd]     = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createBrowserClient(
      'https://gqguwgbopgnpwzjwcexl.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550'
    )

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    } else {
      await supabase.auth.getSession()
      window.location.replace('/hub')
    }
  }

  return (
    <div className={font.className}>
      <style>{`
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #2A4266; }
        .login-wrap { display: flex; min-height: 100vh; background: #0A1628; }
        .login-left {
          width: 60%;
          background: #060D1A;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .login-right {
          width: 40%;
          background: #0A1628;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }
        .login-form-box {
          width: 100%;
          max-width: 360px;
        }
        @media (max-width: 768px) {
          .login-wrap { flex-direction: column; }
          .login-left { display: none; }
          .login-right {
            width: 100%;
            min-height: 100vh;
            padding: 32px 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        @media (min-width: 769px) { .mobile-logo { display: none !important; } }
      `}</style>

      <div className="login-wrap">

      {/* ── Left panel 60% ── */}
      <div className="login-left">
        <div>
          {/* Logo */}
          <a href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 80 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.4px' }}>
              OMNIVERSEL
            </div>
            <div style={{ fontSize: 11, color: '#2D8A87', marginTop: 4, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Urban Resilience Platform
            </div>
          </a>

          {/* Headline */}
          <div style={{ maxWidth: 520, marginBottom: 56 }}>
            <div style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#2D8A87',
              letterSpacing: '2px', textTransform: 'uppercase',
              border: '1px solid #2D8A8740', borderRadius: 20,
              padding: '4px 14px', marginBottom: 28,
            }}>
              Enterprise Resilience Platform
            </div>
            <h1 style={{
              fontSize: 40, fontWeight: 800, color: '#FFFFFF',
              lineHeight: 1.08, letterSpacing: '-0.8px', marginBottom: 20,
            }}>
              Quantify Risk.<br />
              Ensure Continuity.<br />
              Manage Crises.
            </h1>
            <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, fontWeight: 400 }}>
              An integrated platform for organizational resilience — disaster risk assessment, business continuity and crisis management in one workspace.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {FEATURES.map(f => (
              <div key={f.tag} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#2D8A87', marginTop: 7, flexShrink: 0,
                }} />
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{f.tag}</span>
                  <span style={{ fontSize: 14, color: '#4A6FA5' }}> — {f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust badges */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['ISO 22301 Aligned', 'FEMA Core Capabilities', 'ITU AYM Validated'].map(b => (
            <div key={b} style={{
              background: '#080F1E',
              border: '1px solid #0F2240',
              borderRadius: 6, padding: '5px 14px',
              fontSize: 11, color: '#2A4266', fontWeight: 500,
            }}>{b}</div>
          ))}
        </div>
      </div>

      {/* ── Right panel 40% ── */}
      <div className="login-right">

        <div className="login-form-box">

          <div className="mobile-logo" style={{ textAlign: 'center', marginBottom: 32 }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 22, letterSpacing: 2 }}>OMNIVERSEL</div>
              <div style={{ color: '#2D8A87', fontSize: 12, marginTop: 4 }}>Urban Resilience Platform</div>
            </a>
          </div>

          <div style={{
            display: 'inline-block', background: '#0D1F3C',
            border: '1px solid #1E3A5F', borderRadius: 6,
            padding: '4px 12px', fontSize: 11, color: '#2D8A87',
            fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 20,
          }}>
            Platform Access
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#FFFFFF', marginBottom: 8, letterSpacing: '-0.3px' }}>
            Sign in to your workspace
          </h2>
          <p style={{ fontSize: 14, color: '#2A4266', marginBottom: 40 }}>
            Use your organizational credentials to continue.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{
                fontSize: 11, fontWeight: 600, color: '#4A6FA5',
                display: 'block', marginBottom: 8,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>Work Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusEmail(true)}
                onBlur={() => setFocusEmail(false)}
                placeholder="you@organization.com"
                required
                style={{
                  width: '100%', background: '#060D1A',
                  border: `1px solid ${focusEmail ? '#2D8A87' : '#1E3A5F'}`,
                  borderRadius: 8, padding: '12px 16px',
                  color: '#FFFFFF', fontSize: 14, outline: 'none',
                  transition: 'border-color .15s',
                  boxShadow: focusEmail ? '0 0 0 3px #2D8A8722' : 'none',
                }}
              />
            </div>

            <div>
              <label style={{
                fontSize: 11, fontWeight: 600, color: '#4A6FA5',
                display: 'block', marginBottom: 8,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusPwd(true)}
                onBlur={() => setFocusPwd(false)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', background: '#060D1A',
                  border: `1px solid ${focusPwd ? '#2D8A87' : '#1E3A5F'}`,
                  borderRadius: 8, padding: '12px 16px',
                  color: '#FFFFFF', fontSize: 14, outline: 'none',
                  transition: 'border-color .15s',
                  boxShadow: focusPwd ? '0 0 0 3px #2D8A8722' : 'none',
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#1A0808', border: '1px solid #3F1515',
                borderRadius: 8, padding: '10px 14px',
                color: '#EF4444', fontSize: 13, lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#1B5E5B' : '#2D8A87',
                border: 'none', borderRadius: 8, padding: '13px',
                color: '#FFFFFF', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background .15s', marginTop: 4,
                letterSpacing: '0.01em',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: 32, paddingTop: 28, borderTop: '1px solid #1E3A5F' }}>
            <p style={{ fontSize: 13, color: '#2A4266', textAlign: 'center' }}>
              Don&apos;t have access?{' '}
              <a
                href="https://omniversel.com/contact"
                style={{ color: '#2D8A87', textDecoration: 'none', fontWeight: 600 }}
              >
                Request access →
              </a>
            </p>
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#162035', textAlign: 'center', marginTop: 48, paddingTop: 24, borderTop: '1px solid #0F1E30' }}>
          © 2026 Omniversel · omniversel.com
        </p>
      </div>
    </div>
    </div>
  )
}
