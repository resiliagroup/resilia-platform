'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { oturumAc, rolHedefi } from '@/lib/auth'

const N = '#0A1628'
const T = '#2D8A87'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = oturumAc(email, password)
      router.push(rolHedefi(user.rol, user.tenant))
    } catch {
      setError('Incorrect email or password.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        .inp{width:100%;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;
             padding:13px 16px;font-size:14px;color:${N};font-family:'DM Sans',sans-serif;
             outline:none;transition:border-color .18s,box-shadow .18s}
        .inp::placeholder{color:#94A3B8}
        .inp:focus{border-color:${T};box-shadow:0 0 0 3px ${T}22}
        .btn-login{width:100%;background:${T};color:#fff;font-weight:700;font-size:15px;
                   padding:14px;border-radius:10px;border:none;cursor:pointer;
                   font-family:'DM Sans',sans-serif;transition:opacity .18s}
        .btn-login:hover:not(:disabled){opacity:0.88}
        .btn-login:disabled{opacity:0.55;cursor:not-allowed}
        .left-panel{display:flex}
        @media(max-width:768px){
          .left-panel{display:none!important}
          .right-panel{padding:32px 20px!important}
        }
      `}</style>

      <div style={{ minHeight:'100vh', display:'flex' }}>

        {/* LEFT: Navy panel */}
        <div className="left-panel" style={{
          width:'48%', minHeight:'100vh', background:N,
          flexDirection:'column', justifyContent:'space-between',
          padding:'52px 56px', borderRight:'1px solid #142340',
        }}>
          {/* Logo */}
          <div>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <span style={{ fontSize:20, fontWeight:800, color:'#fff', letterSpacing:-0.5, lineHeight:1 }}>OMNIVERSEL</span>
              <span style={{ fontSize:10, fontWeight:500, color:'rgba(255,255,255,0.4)', letterSpacing:2, textTransform:'uppercase', marginTop:4 }}>Urban Resilience Platform</span>
            </div>
          </div>

          {/* Tagline + features */}
          <div>
            <h2 style={{ color:'#fff', fontSize:'clamp(28px,3vw,40px)', fontWeight:800,
              lineHeight:1.15, marginBottom:16, letterSpacing:'-0.02em' }}>
              Resilience, Reimagined.
            </h2>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:16, lineHeight:1.7, marginBottom:48, maxWidth:360 }}>
              The integrated platform for disaster risk, business continuity and crisis management.
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
              {[
                'Quantitative risk scoring across all facility types',
                'ISO 22301 and Sendai Framework aligned',
                'Real-time crisis command and sprint planning',
              ].map(item => (
                <div key={item} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:T,
                    flexShrink:0, marginTop:7 }} />
                  <span style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div>
            <div style={{ height:1, background:'#1E3450', marginBottom:20 }} />
            <p style={{ color:'rgba(255,255,255,0.2)', fontSize:11 }}>
              © 2026 Omniversel · ITU AYM Partnership
            </p>
          </div>
        </div>

        {/* RIGHT: Login form */}
        <div className="right-panel" style={{
          flex:1, display:'flex', alignItems:'center', justifyContent:'center',
          background:'#FFFFFF', padding:'48px 32px',
        }}>
          <div style={{ width:'100%', maxWidth:380 }}>

            <h1 style={{ color:N, fontSize:28, fontWeight:700, marginBottom:8 }}>
              Sign In
            </h1>
            <p style={{ color:'#94A3B8', fontSize:14, marginBottom:36 }}>
              Access your organization&apos;s workspace.
            </p>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <input className="inp" type="email" placeholder="Work email"
                value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email" />
              <input className="inp" type="password" placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password" />

              {error && (
                <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8,
                  padding:'10px 14px', color:'#DC2626', fontSize:13 }}>
                  {error}
                </div>
              )}

              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:-4 }}>
                <a href="#" style={{ fontSize:12, color:'#94A3B8', fontWeight:500 }}
                  onMouseEnter={e => (e.currentTarget.style.color = T)}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn-login" disabled={loading} style={{ marginTop:6 }}>
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            <div style={{ marginTop:28, padding:'14px 18px', background:'#F8FAFC',
              border:'1px solid #E2E8F0', borderRadius:10 }}>
              <p style={{ fontSize:12, color:'#94A3B8', lineHeight:1.6 }}>
                To request access, contact{' '}
                <a href="mailto:demo@omniversel.com" style={{ color:T, fontWeight:600 }}>
                  demo@omniversel.com
                </a>
              </p>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
