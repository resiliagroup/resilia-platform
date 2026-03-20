'use client'
import { useState } from 'react'
import Link from 'next/link'

const N = '#0A1628'; const T = '#2D8A87'; const MG = '#566B66'; const BORDER = '#E8EDED'; const GR = '#F4F7F6'

function PageNav() {
  return (
    <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:200,
      height:64, background:'rgba(255,255,255,0.97)', backdropFilter:'blur(12px)',
      borderBottom:'1px solid #E8EDED', display:'flex', alignItems:'center',
      padding:'0 48px' }}>
      <div style={{ maxWidth:1200, width:'100%', margin:'0 auto',
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ textDecoration:'none' }}>
          <div style={{ display:'flex', flexDirection:'column' }}>
            <span style={{ fontSize:17, fontWeight:800, color:'#0A1628', letterSpacing:-0.5, lineHeight:1 }}>OMNIVERSEL</span>
            <span style={{ fontSize:9, fontWeight:500, color:'#566B66', letterSpacing:1.5, textTransform:'uppercase', marginTop:2 }}>Urban Resilience OS</span>
          </div>
        </a>
        <div style={{ display:'flex', gap:24, alignItems:'center' }}>
          <a href="/platform/omnirisk" style={{ fontSize:13, color:'#566B66', fontWeight:500, textDecoration:'none' }}>Platform</a>
          <a href="/solutions" style={{ fontSize:13, color:'#566B66', fontWeight:500, textDecoration:'none' }}>Solutions</a>
          <a href="/pricing" style={{ fontSize:13, color:'#566B66', fontWeight:500, textDecoration:'none' }}>Pricing</a>
          <a href="/login" style={{ background:'#2D8A87', color:'#fff', fontWeight:700,
            fontSize:13, padding:'9px 22px', borderRadius:6, textDecoration:'none' }}>
            Request Demo
          </a>
        </div>
      </div>
    </header>
  )
}

const FEATURES = [
  {
    title: 'Gas Release Modeling',
    desc: 'Consequence modeling for gas leaks, jet fires and vapor cloud explosions across pipeline and terminal scenarios.',
    color: '#F59E0B',
  },
  {
    title: 'Structural Integrity Assessment',
    desc: 'Corrosion prediction, pressure anomaly detection and material fatigue scoring based on operational history.',
    color: '#EF4444',
  },
  {
    title: 'Cascade Risk Analysis',
    desc: 'Multi-hazard domino modeling from seismic events through infrastructure failure to urban impact zones.',
    color: '#6366F1',
  },
]

export default function OmniPipePage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) {
      const existing = JSON.parse(localStorage.getItem('omniPIPE_waitlist') ?? '[]')
      localStorage.setItem('omniPIPE_waitlist', JSON.stringify([...existing, { email, ts: new Date().toISOString() }]))
      setSubmitted(true)
    }
  }

  return (
    <div style={{ background:'#F8F9FA', fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(45,138,135,0.15)',
            border:'1px solid rgba(45,138,135,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <span style={{ fontSize:10, fontWeight:700, color:'#5EEAD4', letterSpacing:1.5, textTransform:'uppercase' }}>Coming Soon</span>
          </div>
          <h1 style={{ fontSize:'clamp(32px,4.5vw,56px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20, letterSpacing:'-0.02em' }}>
            omniPIPE —<br/>
            <span style={{ color:'#5EEAD4' }}>Energy Infrastructure Risk</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:18, lineHeight:1.7, maxWidth:580, margin:'0 auto 48px' }}>
            Purpose-built for pipeline operators, LNG terminals and energy distributors across Turkey and the region.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@company.com"
                required
                style={{ padding:'13px 20px', borderRadius:8, border:'1px solid rgba(255,255,255,0.2)',
                  background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14,
                  fontFamily:"'DM Sans',sans-serif", outline:'none', minWidth:280 }}
              />
              <button type="submit"
                style={{ padding:'13px 28px', background:T, color:'#fff', border:'none',
                  borderRadius:8, fontWeight:700, fontSize:14, cursor:'pointer',
                  fontFamily:"'DM Sans',sans-serif" }}>
                Join Waitlist
              </button>
            </form>
          ) : (
            <div style={{ background:'rgba(45,138,135,0.15)', border:'1px solid rgba(45,138,135,0.3)',
              borderRadius:12, padding:'16px 32px', display:'inline-block', color:'#5EEAD4', fontWeight:600 }}>
              You are on the list. We will notify you at launch.
            </div>
          )}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:28, fontWeight:700, color:N, marginBottom:12 }}>Core Capabilities</h2>
            <p style={{ fontSize:16, color:MG, maxWidth:500, margin:'0 auto' }}>
              Quantitative risk analysis designed for energy infrastructure complexity.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background:'#fff', border:`1px solid ${BORDER}`,
                borderRadius:16, padding:'28px 24px', borderTop:`3px solid ${f.color}` }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:N, marginBottom:10 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:MG, lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section style={{ padding:'72px 48px', background:'#fff', borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:28, fontWeight:700, color:N, marginBottom:12 }}>What to expect at launch</h2>
            <p style={{ fontSize:16, color:MG, maxWidth:500, margin:'0 auto' }}>
              omniPIPE will be the first module purpose-built for energy infrastructure operators in the region.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[
              {
                label: 'SCADA Integration',
                desc: 'Direct integration with SCADA/ICS systems for real-time pressure and flow monitoring with automated protocol triggers.',
              },
              {
                label: 'Regulatory Alignment',
                desc: 'Coverage of EPDK requirements, EU NIS2 Directive obligations and international pipeline safety standards.',
              },
              {
                label: 'Quantitative Risk Assessment',
                desc: 'Individual and societal risk contour modeling to support land-use planning and safety case development.',
              },
            ].map(item => (
              <div key={item.label} style={{ background:GR, border:`1px solid ${BORDER}`,
                borderRadius:12, padding:'24px 20px' }}>
                <h4 style={{ fontSize:14, fontWeight:700, color:N, marginBottom:8 }}>{item.label}</h4>
                <p style={{ fontSize:13, color:MG, lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · omniPIPE · Energy Infrastructure Risk</p>
      </footer>
    </div>
  )
}
