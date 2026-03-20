'use client'
import Link from 'next/link'

const N = '#0A1628'; const T = '#009B8D'; const MG = '#566B66'; const BORDER = '#E8EDED'; const GR = '#F4F7F6'
const ACCENT = '#6366F1'

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
    icon: 'Icon_PROTECT_11_Supply.png',
    title: 'Supplier Risk Scoring',
    desc: 'Multi-dimensional risk scoring across financial stability, geographic concentration, cyber posture, regulatory compliance and historical disruption records.',
    color: ACCENT,
  },
  {
    icon: 'Icon_PROTECT_11_Supply.png',
    title: 'Dependency Mapping',
    desc: 'Visual graph of supplier dependencies, single-source vulnerabilities, and tiered supply chain cascades — from Tier 1 to Tier 3 sub-suppliers.',
    color: '#8B5CF6',
  },
  {
    icon: 'Icon_PROTECT_11_Supply.png',
    title: 'NATECH Cascade Analysis',
    desc: 'Model how natural hazard events trigger technological failures across your supply network — earthquake disrupting energy supply disrupting production disrupting delivery.',
    color: '#EC4899',
  },
]

const SUPPLIER_TABLE = [
  {
    name: 'Akenerji',
    category: 'Energy',
    dependency: 'Critical',
    score: '4.2 / 5',
    status: { label: 'Review', ok: false },
  },
  {
    name: 'Turkcell',
    category: 'Telecom',
    dependency: 'High',
    score: '2.8 / 5',
    status: { label: 'OK', ok: true },
  },
  {
    name: 'Suez Water',
    category: 'Water',
    dependency: 'Critical',
    score: '3.9 / 5',
    status: { label: 'Review', ok: false },
  },
]

export default function OmniVendorPage() {
  return (
    <div style={{ background:'#F8F9FA', fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(99,102,241,0.15)',
            border:'1px solid rgba(99,102,241,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <img src="/icons/Icon_PROTECT_11_Supply.png" width={14} height={14} alt="Vendor" style={{ objectFit:'contain' }} />
            <span style={{ color:'#A5B4FC', fontSize:12, fontWeight:600, letterSpacing:1 }}>omniVENDOR Module</span>
          </div>
          <h1 style={{ fontSize:'clamp(32px,4.5vw,58px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20, letterSpacing:'-0.02em' }}>
            omniVENDOR —<br/>
            <span style={{ color:'#A5B4FC' }}>Supply Chain Resilience</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:18, lineHeight:1.7, maxWidth:620, margin:'0 auto 48px' }}>
            Score, monitor and tier your third-party suppliers against disruption risk —
            from NATECH cascades to cyber dependencies.
          </p>

          {/* Supplier Risk Table */}
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:16, overflow:'hidden', maxWidth:700, margin:'0 auto', textAlign:'left' }}>
            {/* Header */}
            <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr 1.2fr 1fr 1fr',
              background:'rgba(255,255,255,0.08)', padding:'12px 20px', gap:8 }}>
              {['Supplier', 'Category', 'Dependency', 'Risk Score', 'Status'].map(h => (
                <span key={h} style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)',
                  letterSpacing:1, textTransform:'uppercase' }}>{h}</span>
              ))}
            </div>
            {/* Rows */}
            {SUPPLIER_TABLE.map((row, i) => (
              <div key={row.name} style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr 1.2fr 1fr 1fr',
                padding:'14px 20px', gap:8, borderTop:'1px solid rgba(255,255,255,0.06)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontWeight:600 }}>{row.name}</span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>{row.category}</span>
                <span style={{ fontSize:12, fontWeight:600,
                  color: row.dependency === 'Critical' ? '#F87171' : '#FBBF24' }}>
                  {row.dependency}
                </span>
                <span style={{ fontSize:13, color: parseFloat(row.score) >= 4 ? '#F87171' : parseFloat(row.score) >= 3.5 ? '#FBBF24' : '#34D399',
                  fontWeight:700, fontFamily:'DM Mono,monospace' }}>{row.score}</span>
                <span style={{ fontSize:12, fontWeight:700,
                  color: row.status.ok ? '#34D399' : '#FBBF24' }}>
                  {row.status.ok ? '✓' : '⚠'} {row.status.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:30, fontWeight:700, color:N, marginBottom:12 }}>Know your supply chain blind spots</h2>
            <p style={{ fontSize:16, color:MG, maxWidth:540, margin:'0 auto' }}>
              Third-party risk doesn't stop at Tier 1. Map the full chain.
            </p>
          </div>
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

      {/* COMPLIANCE BADGES */}
      <section style={{ padding:'40px 48px', background:'#fff', borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:11, fontWeight:700, color:MG, letterSpacing:2, textTransform:'uppercase', marginBottom:24 }}>
            Coverage Areas
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            {['NATECH Risk', 'Cyber Dependencies', 'Geographic Risk', 'Tier 1–3 Mapping', 'ISO 28000', 'BDDK TPRM'].map(b => (
              <span key={b} style={{ background:GR, border:`1px solid ${BORDER}`, borderRadius:20,
                padding:'6px 18px', fontSize:13, fontWeight:600, color:N }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section style={{ padding:'48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {[['3','','Supplier Tiers Mapped'],['360','°','Risk View'],['NATECH','','Cascade Modeling'],['RT','','Live Monitoring']].map(([n,u,l]) => (
            <div key={l} style={{ background:'#fff', border:`1px solid ${BORDER}`, borderRadius:12, padding:'28px 16px' }}>
              <div style={{ fontSize:36, fontWeight:800, color:ACCENT, fontFamily:'DM Mono,monospace', lineHeight:1 }}>{n}<span style={{ fontSize:16 }}>{u}</span></div>
              <div style={{ fontSize:12, color:MG, marginTop:8, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 48px', background:N, textAlign:'center' }}>
        <h2 style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:16 }}>Map your supply chain risk →</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, marginBottom:36 }}>
          Score your top 20 suppliers in your first session.
        </p>
        <Link href="/login" style={{ background:ACCENT, color:'#fff', fontWeight:700, fontSize:15,
          padding:'14px 40px', borderRadius:8, display:'inline-block' }}>
          Start Free Assessment
        </Link>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · omniVENDOR · Supply Chain Resilience · ISO 28000</p>
      </footer>
    </div>
  )
}
