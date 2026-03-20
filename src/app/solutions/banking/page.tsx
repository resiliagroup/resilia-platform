'use client'
import Link from 'next/link'

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

const N='#0A1628'; const T='#009B8D'; const MG='#566B66'; const BORDER='#E8EDED'

const BADGES = ['BDDK ISP', 'Basel III', 'ISO 22301', 'BIS Operational Resilience', 'SWIFT CSP']

const FEATURES = [
  { title:'BDDK 24-Hour Rule Compliance', desc:'Automated tracking of BDDK\'s 24-hour maximum acceptable downtime requirement for core banking systems — with real-time breach alerts.', color:'#1565C0' },
  { title:'Basel III Operational Risk', desc:'Map operational risk events to Basel III Pillar 2 categories. Generate Board-ready risk reports aligned to BCBS 239 principles.', color:'#1E40AF' },
  { title:'HIFYEA v2.0 — 73-Question Assessment', desc:'Purpose-built for Turkish banks: 73 questions covering BDDK requirements, Basel III categories, and FEMA mission area alignment.', color:'#2563EB' },
]

const METRICS = [
  { val:'<4h',  label:'Target RTO',     sub:'Core banking systems' },
  { val:'<1h',  label:'Target RPO',     sub:'Transaction data' },
  { val:'24h',  label:'BDDK Rule',      sub:'Max acceptable downtime' },
  { val:'73',   label:'HIFYEA Questions', sub:'Banking assessment' },
]

export default function BankingSolutionPage() {
  return (
    <div style={{ background:'#F8F9FA', fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(37,99,235,0.15)',
            border:'1px solid rgba(37,99,235,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <span style={{ color:'#93C5FD', fontSize:12, fontWeight:600, letterSpacing:1 }}>Banking & Financial Services</span>
          </div>
          <h1 style={{ fontSize:'clamp(30px,4vw,54px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
            Banking & Financial Services<br/>
            <span style={{ color:'#93C5FD' }}>Resilience</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:17, lineHeight:1.75, maxWidth:580, margin:'0 auto 40px' }}>
            BDDK and Basel III aligned operational resilience — purpose-built for Turkish financial institutions.
            From 73-question assessments to real-time crisis command.
          </p>
          {/* Compliance badges */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {BADGES.map(b => (
              <span key={b} style={{ background:'rgba(37,99,235,0.15)', border:'1px solid rgba(37,99,235,0.3)',
                color:'#93C5FD', fontSize:11, fontWeight:700, padding:'5px 14px', borderRadius:20, letterSpacing:0.5 }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* KEY METRICS */}
      <section style={{ padding:'48px', background:'#fff', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {METRICS.map(m => (
            <div key={m.label}>
              <div style={{ fontSize:36, fontWeight:800, color:'#1565C0', fontFamily:'DM Mono,monospace', lineHeight:1 }}>{m.val}</div>
              <div style={{ fontSize:13, fontWeight:700, color:N, marginTop:8 }}>{m.label}</div>
              <div style={{ fontSize:11, color:MG, marginTop:4 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <h2 style={{ fontSize:28, fontWeight:700, color:N, textAlign:'center', marginBottom:48 }}>
            Purpose-Built for Financial Institutions
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
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

      {/* HIFYEA PREVIEW */}
      <section style={{ padding:'64px 48px', background:'#fff', borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <h2 style={{ fontSize:26, fontWeight:700, color:N, marginBottom:8, textAlign:'center' }}>
            HIFYEA Banking Assessment v2.0
          </h2>
          <p style={{ color:MG, fontSize:14, textAlign:'center', marginBottom:36 }}>
            73 questions · BDDK + Basel III + FEMA aligned · Score range: 0–720
          </p>
          <div style={{ background:'#F8F9FA', borderRadius:16, border:`1px solid ${BORDER}`, overflow:'hidden' }}>
            <div style={{ background:N, padding:'12px 20px', display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>Question Category</span>
              <span style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>Questions</span>
            </div>
            {[
              ['H — Hazard & Systemic Risk', '18 questions'],
              ['F — Fragility & Operational Dependencies', '16 questions'],
              ['E — Exposure & Systemic Importance', '14 questions'],
              ['C — Capacity (BDDK + Basel III)', '25 questions'],
            ].map(([cat, q]) => (
              <div key={cat} style={{ padding:'14px 20px', borderBottom:`1px solid ${BORDER}`,
                display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:N, fontWeight:500 }}>{cat}</span>
                <span style={{ fontSize:12, fontWeight:700, color:'#1565C0', fontFamily:'DM Mono,monospace' }}>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 48px', background:N, textAlign:'center' }}>
        <h2 style={{ fontSize:30, fontWeight:700, color:'#fff', marginBottom:16 }}>Assess your bank&apos;s resilience →</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:15, marginBottom:32 }}>Free HIFYEA assessment for qualified financial institutions.</p>
        <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:15, padding:'14px 40px', borderRadius:8, display:'inline-block' }}>Start Assessment</Link>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · Banking & Finance Resilience · BDDK · Basel III · ISO 22301</p>
      </footer>
    </div>
  )
}
