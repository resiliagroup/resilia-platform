'use client'

import { useState, Suspense } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

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
      setError('Geçersiz e-posta veya şifre.')
      setLoading(false)
    } else {
      const next = searchParams.get('next') || '/hub'
      router.replace(next)
    }
  }

  return (
    <>
      <style>{`
        .lp { min-height: 100vh; background: #060D1A; display: flex; }
        .lp-left { flex: 3; background: #060D1A; padding: 60px 48px; display: flex; flex-direction: column; justify-content: center; }
        .lp-right { flex: 2; background: #0A1628; border-left: 1px solid #1E3A5F; display: flex; align-items: center; justify-content: center; padding: 40px 32px; }
        .lp-form { width: 100%; max-width: 360px; }
        @media (max-width: 768px) {
          .lp { flex-direction: column; }
          .lp-left { display: none; }
          .lp-right { flex: 1; border-left: none; min-height: 100vh; padding: 48px 24px; align-items: center; justify-content: center; }
        }
      `}</style>
      <div className="lp">
        <div className="lp-left">
          <div style={{marginBottom:48}}>
            <a href="/" style={{textDecoration:'none'}}>
              <div style={{color:'#fff',fontWeight:800,fontSize:20,letterSpacing:2}}>OMNIVERSEL</div>
              <div style={{color:'#2D8A87',fontSize:12,marginTop:4}}>Urban Resilience Platform</div>
            </a>
          </div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(45,138,135,0.1)',border:'1px solid rgba(45,138,135,0.25)',borderRadius:20,padding:'5px 14px',fontSize:11,color:'#2D8A87',letterSpacing:2,marginBottom:24}}>
            Enterprise Resilience Platform
          </div>
          <div style={{fontSize:'clamp(24px,3.5vw,42px)',fontWeight:800,lineHeight:1.12,color:'#fff',marginBottom:16}}>
            <span>Quantify Risk.</span><br/>
            <span style={{color:'#2D8A87'}}>Ensure Continuity.</span><br/>
            <span>Manage Crises.</span>
          </div>
          <div style={{fontSize:14,color:'#64748B',maxWidth:480,lineHeight:1.7,marginBottom:40}}>
            An integrated platform for organizational resilience — disaster risk assessment, business continuity and crisis management in one workspace.
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {['omniRISK — Facility-level URI scoring with NATECH analysis','omniIMPACT — Business Impact Analysis aligned with BDDK ISEDES','omniPLAN — ISO 22301 compliant BCP scenario management','omniAUDIT — BDDK Climate Guide & Basel IV compliance tracking'].map(item => (
              <div key={item} style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'#94A3B8'}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#2D8A87',flexShrink:0}}></div>
                {item}
              </div>
            ))}
          </div>
          <div style={{marginTop:48,fontSize:11,color:'#334155'}}>ISO 22301 Aligned · FEMA Core Capabilities · ITU AYM Validated</div>
        </div>

        <div className="lp-right">
          <div className="lp-form">
            <div style={{textAlign:'center',marginBottom:32}}>
              <a href="/" style={{textDecoration:'none'}}>
                <div style={{color:'#fff',fontWeight:800,fontSize:20,letterSpacing:2}}>OMNIVERSEL</div>
                <div style={{color:'#2D8A87',fontSize:12,marginTop:4}}>Urban Resilience Platform</div>
              </a>
            </div>
            <div style={{fontSize:18,fontWeight:700,color:'#fff',marginBottom:4}}>Platform Access</div>
            <div style={{fontSize:13,color:'#64748B',marginBottom:28}}>Sign in to your workspace</div>
            <form onSubmit={handleLogin}>
              <div style={{marginBottom:16}}>
                <label style={{display:'block',fontSize:11,color:'#64748B',marginBottom:6,letterSpacing:1}}>WORK EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                  required
                  style={{width:'100%',background:'#060D1A',border:'1px solid #1E3A5F',borderRadius:10,padding:'12px 14px',color:'#fff',fontSize:14,outline:'none',boxSizing:'border-box'}}
                />
              </div>
              <div style={{marginBottom:24}}>
                <label style={{display:'block',fontSize:11,color:'#64748B',marginBottom:6,letterSpacing:1}}>PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{width:'100%',background:'#060D1A',border:'1px solid #1E3A5F',borderRadius:10,padding:'12px 14px',color:'#fff',fontSize:14,outline:'none',boxSizing:'border-box'}}
                />
              </div>
              {error && <div style={{color:'#EF4444',fontSize:13,marginBottom:16,padding:'10px 12px',background:'rgba(239,68,68,0.08)',borderRadius:8}}>{error}</div>}
              <button
                type="submit"
                disabled={loading}
                style={{width:'100%',background:'#2D8A87',border:'none',borderRadius:10,padding:'13px',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer'}}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div style={{textAlign:'center',marginTop:24,fontSize:12,color:'#334155'}}>
              © 2026 Omniversel · <a href="/" style={{color:'#2D8A87',textDecoration:'none'}}>omniversel.com</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
