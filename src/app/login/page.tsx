'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  async function handleLogin() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        window.location.href = searchParams.get('next') || '/hub/site-haritasi'
      } else {
        setError(data.error || 'Geçersiz e-posta veya şifre.')
        setLoading(false)
      }
    } catch {
      setError('Bağlantı hatası.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .lp{min-height:100vh;background:#F8FAFC;display:flex}
        .lp-left{flex:3;background:#F8FAFC;padding:60px 48px;display:flex;flex-direction:column;justify-content:center}
        .lp-right{flex:2;background:#F8FAFC;border-left:1px solid #E2E8F0;display:flex;align-items:center;justify-content:center;padding:40px 32px}
        .lp-form{width:100%;max-width:360px}
        @media(max-width:768px){.lp{flex-direction:column}.lp-left{display:none}.lp-right{flex:1;border-left:none;min-height:100vh;padding:48px 24px}}
      `}</style>
      <div className="lp">
        <div className="lp-left">
          <div style={{marginBottom:48}}>
            <a href="/" style={{textDecoration:'none'}}>
              <div style={{color:'#0A1628',fontWeight:800,fontSize:20,letterSpacing:2}}>OMNIVERSEL</div>
              <div style={{color:'#2D8A87',fontSize:12,marginTop:4}}>Urban Resilience Platform</div>
            </a>
          </div>
          <div style={{fontSize:'clamp(24px,3.5vw,42px)',fontWeight:800,lineHeight:1.12,color:'#0A1628',marginBottom:16}}>
            <span>Quantify Risk.</span><br/>
            <span style={{color:'#2D8A87'}}>Ensure Continuity.</span><br/>
            <span>Manage Crises.</span>
          </div>
          <div style={{fontSize:14,color:'#374151',maxWidth:480,lineHeight:1.7,marginBottom:40}}>
            An integrated platform for organizational resilience.
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {['omniRISK — Facility-level URI scoring with NATECH analysis','omniIMPACT — BIA aligned with BDDK ISEDES','omniPLAN — ISO 22301 compliant BCP management','omniAUDIT — BDDK Climate Guide & Basel IV tracking'].map(item=>(
              <div key={item} style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'#374151'}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#2D8A87',flexShrink:0}}></div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="lp-right">
          <div className="lp-form">
            <div style={{textAlign:'center',marginBottom:32}}>
              <div style={{color:'#0A1628',fontWeight:800,fontSize:20,letterSpacing:2}}>OMNIVERSEL</div>
              <div style={{color:'#2D8A87',fontSize:12,marginTop:4}}>Urban Resilience Platform</div>
            </div>
            <div style={{fontSize:18,fontWeight:700,color:'#0A1628',marginBottom:4}}>Platform Access</div>
            <div style={{fontSize:13,color:'#374151',marginBottom:28}}>Sign in to your workspace</div>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:11,color:'#374151',marginBottom:6,letterSpacing:1}}>WORK EMAIL</label>
              <input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleLogin()}
                placeholder="you@organization.com"
                style={{width:'100%',background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:10,padding:'12px 14px',color:'#0A1628',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div style={{marginBottom:24}}>
              <label style={{display:'block',fontSize:11,color:'#374151',marginBottom:6,letterSpacing:1}}>PASSWORD</label>
              <input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleLogin()}
                placeholder="••••••••"
                style={{width:'100%',background:'#FFFFFF',border:'1px solid #E2E8F0',borderRadius:10,padding:'12px 14px',color:'#0A1628',fontSize:14,outline:'none',boxSizing:'border-box'}}/>
            </div>
            {error&&<div style={{color:'#EF4444',fontSize:13,marginBottom:16,padding:'10px 12px',background:'rgba(239,68,68,0.08)',borderRadius:8}}>{error}</div>}
            <button onClick={handleLogin} disabled={loading}
              style={{width:'100%',background:'#2D8A87',border:'none',borderRadius:10,padding:'13px',color:'#fff',fontSize:15,fontWeight:600,cursor:'pointer'}}>
              {loading?'Signing in...':'Sign In'}
            </button>
            <div style={{textAlign:'center',marginTop:24,fontSize:12,color:'#374151'}}>
              © 2026 Omniversel · <a href="/" style={{color:'#2D8A87',textDecoration:'none'}}>omniversel.com</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
