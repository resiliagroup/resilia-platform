'use client'
import { useState } from 'react'
import Link from 'next/link'

const N = '#0A1628'; const MG = '#566B66'; const BORDER = '#E8EDED'; const GR = '#F4F7F6'

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

const SCENARIOS = [
  {
    icon: '🔥',
    title: 'Gas Leak & Fire',
    desc: 'NATECH pipeline fire scenarios with domino chain modeling for LNG terminals and gas distribution networks.',
  },
  {
    icon: '⚙️',
    title: 'Pipeline Corrosion',
    desc: 'Predictive corrosion risk scoring using material age, soil class, pressure history and maintenance records.',
  },
  {
    icon: '📊',
    title: 'Pressure Anomaly',
    desc: 'Real-time pressure deviation alerts mapped to SCADA data with automated response protocol triggers.',
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
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:'#0A1628' }}>
        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.15)',
            border:'1px solid rgba(245,158,11,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <span style={{ fontSize:10, fontWeight:700, color:'#FCD34D', letterSpacing:1.5, textTransform:'uppercase' }}>Coming Soon</span>
          </div>
          <h1 style={{ fontSize:'clamp(32px,4.5vw,56px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
            omniPIPE —<br/>
            <span style={{ color:'#FCD34D' }}>Pipeline & Energy Infrastructure Risk</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:18, lineHeight:1.7, maxWidth:580, margin:'0 auto 16px' }}>
            Designed for pipeline operators, LNG terminals and energy distributors.
            NATECH-grade risk modeling for critical energy infrastructure.
          </p>
          <p style={{ color:'rgba(245,158,11,0.7)', fontSize:13, fontWeight:600, marginBottom:48 }}>
            Target operators: BOTAŞ · İPRGAZ · PetrolOfisi · TÜPRAŞ
          </p>

          {/* Waitlist form */}
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
              <button
                type="submit"
                style={{ padding:'13px 28px', background:'#F59E0B', color:'#fff', border:'none',
                  borderRadius:8, fontWeight:700, fontSize:14, cursor:'pointer',
                  fontFamily:"'DM Sans',sans-serif" }}>
                Join Waitlist →
              </button>
            </form>
          ) : (
            <div style={{ background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)',
              borderRadius:12, padding:'16px 32px', display:'inline-block', color:'#FCD34D', fontWeight:600 }}>
              You are on the list! We will notify you at launch.
            </div>
          )}
        </div>
      </section>

      {/* SCENARIOS */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <h2 style={{ fontSize:28, fontWeight:700, color:'#0A1628', textAlign:'center', marginBottom:40 }}>
            NATECH Pipeline Scenarios
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {SCENARIOS.map(s => (
              <div key={s.title} style={{ background:'#fff', border:'1px solid #E8EDED',
                borderRadius:16, padding:'28px 24px', borderTop:'3px solid #F59E0B' }}>
                <div style={{ fontSize:32, marginBottom:16 }}>{s.icon}</div>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0A1628', marginBottom:10 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:'#566B66', lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CCDS icons row */}
      <section style={{ padding:'40px 48px', background:'#fff', borderTop:'1px solid #E8EDED', textAlign:'center' }}>
        <p style={{ fontSize:11, fontWeight:700, color:'#566B66', letterSpacing:2, textTransform:'uppercase', marginBottom:24 }}>
          Built on FEMA Core Capabilities
        </p>
        <div style={{ display:'flex', gap:24, justifyContent:'center', alignItems:'center', flexWrap:'wrap' }}>
          <img src="/icons/Icon_RESP_06_Environ.png" width={40} height={40} alt="Environmental" style={{ objectFit:'contain', opacity:0.7 }} />
          <img src="/icons/Icon_MIT_03_Operational.png" width={40} height={40} alt="Operational" style={{ objectFit:'contain', opacity:0.7 }} />
          <img src="/icons/Icon_MIT_06_Risk.png" width={40} height={40} alt="Risk" style={{ objectFit:'contain', opacity:0.7 }} />
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:28, fontWeight:700, color:N, marginBottom:16 }}>What to expect at launch</h2>
          <p style={{ fontSize:16, color:MG, marginBottom:48, maxWidth:500, margin:'0 auto 48px' }}>
            omniPIPE will be the first module purpose-built for energy infrastructure operators in Turkey and the region.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[
              { label: 'SCADA Integration', desc: 'Direct integration with SCADA/ICS systems for real-time pressure and flow monitoring.' },
              { label: 'Domino Modeling', desc: 'Multi-hazard cascade modeling — from seismic event to pipeline rupture to urban fire.' },
              { label: 'Regulatory Alignment', desc: 'BOTAŞ technical regulations, EPDK standards, and EU NIS2 Directive compliance.' },
            ].map(item => (
              <div key={item.label} style={{ background:'#fff', border:`1px solid ${BORDER}`,
                borderRadius:12, padding:'24px 20px', textAlign:'left' }}>
                <h4 style={{ fontSize:14, fontWeight:700, color:N, marginBottom:8 }}>{item.label}</h4>
                <p style={{ fontSize:13, color:MG, lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · omniPIPE · Coming Soon</p>
      </footer>
    </div>
  )
}
