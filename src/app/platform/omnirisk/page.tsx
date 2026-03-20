'use client'
import Link from 'next/link'

const N = '#0A1628'; const T = '#009B8D'; const MG = '#566B66'; const BORDER = '#E8EDED'; const GR = '#F4F7F6'

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
    icon: 'Icon_MIT_06_Risk.png',
    title: 'Multi-Dimensional Risk Scoring',
    desc: 'Risk is evaluated across hazard, fragility, exposure, capacity and supply-chain bottleneck dimensions — producing a single, actionable facility-level resilience index.',
    color: '#EF4444',
  },
  {
    icon: 'Icon_PREVENT_04_Intelligence.png',
    title: 'Operational Reliability Tracking',
    desc: 'Near-miss reporting, drill completion and command maturity are continuously tracked — translating operational behavior into measurable resilience performance.',
    color: '#F97316',
  },
  {
    icon: 'Icon_MIT_03_Operational.png',
    title: 'Sector & Hazard Calibration',
    desc: 'Scoring is calibrated per sector and hazard type. A hospital facing NATECH risk is assessed differently from a bank facing cyber exposure — because the stakes differ.',
    color: '#3B82F6',
  },
]

export default function OmniRiskPage() {
  return (
    <div style={{ background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.15)',
            border:'1px solid rgba(239,68,68,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <img src="/icons/Icon_MIT_06_Risk.png" width={14} height={14} alt="Risk" style={{ objectFit:'contain' }} />
            <span style={{ color:'#F87171', fontSize:12, fontWeight:600, letterSpacing:1 }}>omniRISK Module</span>
          </div>
          <h1 style={{ fontSize:'clamp(32px,4.5vw,58px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20, letterSpacing:'-0.02em' }}>
            omniRISK —<br/>
            <span style={{ color:'#F87171' }}>Quantitative Risk Intelligence</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:18, lineHeight:1.7, maxWidth:600, margin:'0 auto 40px' }}>
            omniRISK transforms facility-level data into a single, actionable resilience score —
            structured around FEMA mission areas and Sendai Framework targets.
          </p>
          <div style={{ display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap' }}>
            {[['Hazard','Physical & environmental threat level'],['Fragility','Structural & operational weakness'],['Exposure','Affected population & asset concentration'],['Capacity','Preparedness & recovery capability']].map(([k,v]) => (
              <div key={k} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:10, padding:'14px 20px', textAlign:'left', minWidth:160 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#F87171', marginBottom:4 }}>{k}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', lineHeight:1.5 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background:'#fff', border:`1px solid ${BORDER}`,
                borderRadius:16, padding:'28px 24px', borderTop:`3px solid ${f.color}` }}>
                <img src={`/icons/${f.icon}`} width={36} height={36} alt={f.title} style={{ objectFit:'contain', marginBottom:16 }} />
                <h3 style={{ fontSize:16, fontWeight:700, color:N, marginBottom:10 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:MG, lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS ROW */}
      <section style={{ padding:'48px', background:'#fff', borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {[['Multi','','Dimensional scoring'],['32','','FEMA Core Capabilities'],['5','','Mission areas covered'],['5','','HRO reliability principles']].map(([n,u,l]) => (
            <div key={l}>
              <div style={{ fontSize:40, fontWeight:800, color:'#EF4444', fontFamily:'DM Mono,monospace', lineHeight:1 }}>{n}<span style={{ fontSize:20 }}>{u}</span></div>
              <div style={{ fontSize:12, color:MG, marginTop:8, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 48px', background:N, textAlign:'center' }}>
        <h2 style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:16 }}>See omniRISK in action →</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, marginBottom:36 }}>Free 14-day assessment for your first facility.</p>
        <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:15, padding:'14px 40px', borderRadius:8, display:'inline-block' }}>Start Free Assessment</Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · omniRISK · ISO 22301 · FEMA NPG</p>
      </footer>
    </div>
  )
}
