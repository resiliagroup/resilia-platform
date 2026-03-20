'use client'
import Link from 'next/link'

const N = '#0A1628'; const T = '#009B8D'; const MG = '#566B66'; const BORDER = '#E8EDED'; const GR = '#F4F7F6'
const ACCENT = '#F97316'

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
    icon: 'Icon_RESP_15_Situational.png',
    title: 'MTPD Calculation',
    desc: 'Maximum Tolerable Period of Disruption modeling per business function. Quantify the tipping point beyond which disruption causes irreversible organizational damage.',
    color: ACCENT,
  },
  {
    icon: 'Icon_RESP_15_Situational.png',
    title: 'Revenue-at-Risk Modeling',
    desc: 'Map each critical function to hourly and daily revenue exposure. Include direct losses, regulatory penalties, contractual breach costs and reputational damage multipliers.',
    color: '#EF4444',
  },
  {
    icon: 'Icon_RESP_15_Situational.png',
    title: 'Critical Function Mapping',
    desc: 'Dependency graph of all critical business processes, their supporting resources, single points of failure, and downstream cascades to other functions.',
    color: '#3B82F6',
  },
]

const IMPACT_TABLE = [
  {
    duration: '0–4 hours',
    financial: { label: 'Low', level: 1 },
    regulatory: { label: 'Low', level: 1 },
    reputational: { label: 'Low', level: 1 },
  },
  {
    duration: '4–24 hours',
    financial: { label: 'Medium', level: 2 },
    regulatory: { label: 'Medium', level: 2 },
    reputational: { label: 'High', level: 3 },
  },
  {
    duration: '24–72 hours',
    financial: { label: 'High', level: 3 },
    regulatory: { label: 'Critical', level: 4 },
    reputational: { label: 'Critical', level: 4 },
  },
]

function impactColor(level: number) {
  if (level === 1) return '#10B981'
  if (level === 2) return '#F59E0B'
  if (level === 3) return '#EF4444'
  return '#7C3AED'
}

function impactBg(level: number) {
  if (level === 1) return 'rgba(16,185,129,0.12)'
  if (level === 2) return 'rgba(245,158,11,0.12)'
  if (level === 3) return 'rgba(239,68,68,0.12)'
  return 'rgba(124,58,237,0.15)'
}

export default function OmniImpactPage() {
  return (
    <div style={{ background:'#F8F9FA', fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(249,115,22,0.15)',
            border:'1px solid rgba(249,115,22,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <img src="/icons/Icon_RESP_15_Situational.png" width={14} height={14} alt="Impact" style={{ objectFit:'contain' }} />
            <span style={{ color:'#FCA57B', fontSize:12, fontWeight:600, letterSpacing:1 }}>omniIMPACT Module</span>
          </div>
          <h1 style={{ fontSize:'clamp(32px,4.5vw,58px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20, letterSpacing:'-0.02em' }}>
            omniIMPACT —<br/>
            <span style={{ color:'#FCA57B' }}>Business Impact Analysis</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:18, lineHeight:1.7, maxWidth:620, margin:'0 auto 48px' }}>
            Quantify the cost of downtime. Map critical functions to revenue impact, regulatory penalties and
            reputational risk — and set defensible RTO/RPO targets.
          </p>

          {/* Downtime Cost Table */}
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:16, overflow:'hidden', maxWidth:680, margin:'0 auto', textAlign:'left' }}>
            {/* Header */}
            <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1.3fr',
              background:'rgba(255,255,255,0.08)', padding:'12px 20px', gap:8 }}>
              {['Downtime Duration', 'Financial Impact', 'Regulatory Risk', 'Reputational Impact'].map(h => (
                <span key={h} style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)',
                  letterSpacing:1, textTransform:'uppercase' }}>{h}</span>
              ))}
            </div>
            {/* Rows */}
            {IMPACT_TABLE.map((row, i) => (
              <div key={row.duration} style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1.3fr',
                padding:'14px 20px', gap:8, borderTop:'1px solid rgba(255,255,255,0.06)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.8)', fontWeight:500,
                  fontFamily:'DM Mono,monospace' }}>{row.duration}</span>
                <span style={{ fontSize:12, fontWeight:700, color: impactColor(row.financial.level),
                  background: impactBg(row.financial.level), borderRadius:4, padding:'2px 8px',
                  display:'inline-block' }}>{row.financial.label}</span>
                <span style={{ fontSize:12, fontWeight:700, color: impactColor(row.regulatory.level),
                  background: impactBg(row.regulatory.level), borderRadius:4, padding:'2px 8px',
                  display:'inline-block' }}>{row.regulatory.label}</span>
                <span style={{ fontSize:12, fontWeight:700, color: impactColor(row.reputational.level),
                  background: impactBg(row.reputational.level), borderRadius:4, padding:'2px 8px',
                  display:'inline-block' }}>{row.reputational.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:30, fontWeight:700, color:N, marginBottom:12 }}>Know your exposure before disruption strikes</h2>
            <p style={{ fontSize:16, color:MG, maxWidth:540, margin:'0 auto' }}>
              Turn business impact analysis from a one-time exercise into a living risk intelligence asset.
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

      {/* METRICS */}
      <section style={{ padding:'48px', background:'#fff', borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {[['BIA','','ISO 22317 Aligned'],['MTPD','','Per Function'],['3','','Impact Dimensions'],['₺→','',' Revenue Mapping']].map(([n,u,l]) => (
            <div key={l}>
              <div style={{ fontSize:36, fontWeight:800, color:ACCENT, fontFamily:'DM Mono,monospace', lineHeight:1 }}>{n}<span style={{ fontSize:16 }}>{u}</span></div>
              <div style={{ fontSize:12, color:MG, marginTop:8, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 48px', background:N, textAlign:'center' }}>
        <h2 style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:16 }}>Quantify your downtime risk →</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, marginBottom:36 }}>
          Build a defensible BIA in hours, not weeks.
        </p>
        <Link href="/login" style={{ background:ACCENT, color:'#fff', fontWeight:700, fontSize:15,
          padding:'14px 40px', borderRadius:8, display:'inline-block' }}>
          Start Free Assessment
        </Link>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · omniIMPACT · ISO 22317 · MTPD · BIA</p>
      </footer>
    </div>
  )
}
