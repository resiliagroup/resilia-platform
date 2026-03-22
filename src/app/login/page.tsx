'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Plus_Jakarta_Sans } from 'next/font/google'

const font = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })

const FEATURES = [
  { tag: 'omniRISK', desc: 'Çok katmanlı risk skorlama ve senaryo analizi' },
  { tag: 'omniIMPACT', desc: 'İş etki analizi ve finansal kayıp modelleme' },
  { tag: 'omniPLAN', desc: 'BCP senaryo editörü, RTO/RPO takibi, tatbikat takvimi' },
  { tag: 'omniAUDIT', desc: 'BDDK, İSEDES ve Basel IV uyum denetimi' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusEmail, setFocusEmail] = useState(false)
  const [focusPwd, setFocusPwd] = useState(false)

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
      setError('E-posta veya şifre hatalı.')
      setLoading(false)
    } else {
      await supabase.auth.getSession()
      window.location.replace('/hub')
    }
  }

  return (
    <div className={font.className} style={{ minHeight: '100vh', display: 'flex', background: '#060D1A' }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::placeholder{color:#334155}
        @media(max-width:768px){.login-left{display:none!important}.login-right{width:100%!important;padding:40px 24px!important}}
      `}</style>

      {/* Left panel — 60% */}
      <div className="login-left" style={{
        width: '60%', padding: '64px 72px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', borderRight: '1px solid #0F2240',
      }}>
        <div>
          {/* Logo */}
          <div style={{ marginBottom: 72 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
              OMNIVERSEL
            </div>
            <div style={{ fontSize: 12, color: '#2D8A87', marginTop: 3, fontWeight: 500, letterSpacing: '0.05em' }}>
              URBAN RESILIENCE PLATFORM
            </div>
          </div>

          {/* Headline */}
          <div style={{ maxWidth: 480 }}>
            <div style={{
              display: 'inline-block', background: '#0D2137', border: '1px solid #1E3A5F',
              borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#2D8A87',
              fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24,
            }}>
              Enterprise Risk Intelligence
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 20 }}>
              Türkiye&apos;nin İlk<br />
              <span style={{ color: '#2D8A87' }}>Kentsel Dirençlilik</span><br />
              Platformu
            </h1>
            <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.7, marginBottom: 48 }}>
              BDDK, AFAD ve Basel IV uyumlu risk yönetimi.<br />
              Kurumunuzun dirençlilik skorunu gerçek zamanlı izleyin.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.tag} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  minWidth: 8, height: 8, borderRadius: '50%', background: '#2D8A87',
                  marginTop: 6,
                }} />
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>{f.tag}</span>
                  <span style={{ fontSize: 13, color: '#64748B' }}> — {f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badges */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 48 }}>
          {['BDDK Uyumlu', 'ISO 22301', 'KVKK & GDPR', 'SOC 2'].map(b => (
            <div key={b} style={{
              background: '#0D2137', border: '1px solid #1E3A5F',
              borderRadius: 6, padding: '5px 12px', fontSize: 11,
              color: '#64748B', fontWeight: 500,
            }}>{b}</div>
          ))}
        </div>
      </div>

      {/* Right panel — 40% */}
      <div className="login-right" style={{
        width: '40%', padding: '64px 56px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', background: '#0A1628',
      }}>
        <div style={{ maxWidth: 360, width: '100%', margin: '0 auto' }}>

          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#FFFFFF', marginBottom: 8 }}>
            Hesabınıza giriş yapın
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 40 }}>
            Kurumsal kimlik bilgilerinizi kullanın.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 8, letterSpacing: '0.04em' }}>
                KURUMSAL E-POSTA
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusEmail(true)}
                onBlur={() => setFocusEmail(false)}
                placeholder="ad@kurum.com"
                required
                style={{
                  width: '100%', background: '#060D1A',
                  border: `1px solid ${focusEmail ? '#2D8A87' : '#1E3A5F'}`,
                  borderRadius: 8, padding: '12px 16px', color: '#FFFFFF',
                  fontSize: 14, outline: 'none', transition: 'border-color .15s',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 8, letterSpacing: '0.04em' }}>
                ŞİFRE
              </label>
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
                  borderRadius: 8, padding: '12px 16px', color: '#FFFFFF',
                  fontSize: 14, outline: 'none', transition: 'border-color .15s',
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#1A0A0A', border: '1px solid #3F1515',
                borderRadius: 8, padding: '10px 14px',
                color: '#EF4444', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#1E6663' : '#2D8A87',
                border: 'none', borderRadius: 8, padding: '13px',
                color: '#FFFFFF', fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background .15s', marginTop: 4,
              }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
            </button>
          </form>

          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid #1E3A5F' }}>
            <p style={{ fontSize: 12, color: '#334155', textAlign: 'center' }}>
              Hesap talebi için{' '}
              <a href="mailto:info@omniversel.com" style={{ color: '#2D8A87', textDecoration: 'none' }}>
                info@omniversel.com
              </a>
            </p>
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#1E3A5F', textAlign: 'center', marginTop: 'auto', paddingTop: 48 }}>
          © 2026 Omniversel. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  )
}
