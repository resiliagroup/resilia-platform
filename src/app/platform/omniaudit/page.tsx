'use client'
import Link from 'next/link'

const N = '#0A1628'; const T = '#009B8D'; const MG = '#566B66'; const BORDER = '#E8EDED'; const GR = '#F4F7F6'
const ACCENT = '#10B981'

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
    icon: 'Icon_PROTECT_10_Risk.png',
    title: 'Sendai SF Progress Tracking',
    desc: 'Monitor your progress against all four Sendai Framework priorities and seven global targets. Automated evidence collection maps your activities to SF indicators.',
    color: ACCENT,
  },
  {
    icon: 'Icon_PROTECT_10_Risk.png',
    title: 'ISO 22301 Clause-by-Clause',
    desc: 'Full ISO 22301:2019 clause-level maturity assessment with evidence upload, gap flags, corrective action plans and re-assessment scheduling.',
    color: '#3B82F6',
  },
  {
    icon: 'Icon_PROTECT_10_Risk.png',
    title: 'Regulatory Gap Analysis',
    desc: 'Automated gap analysis across BDDK operational resilience requirements, Basel III business continuity standards and sector-specific regulatory obligations.',
    color: '#6366F1',
  },
]

const SCORECARD = [
  { label: 'Sendai Priority 1 — Understanding Risk', score: 78, color: '#10B981' },
  { label: 'ISO 22301 Clause 6 — Planning', score: 65, color: '#3B82F6' },
  { label: 'BDDK Operational Resilience', score: 82, color: '#8B5CF6' },
  { label: 'Basel III Business Continuity', score: 71, color: '#F97316' },
]

export default function OmniAuditPage() {
  return (
    <div style={{ background:'#F8F9FA', fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(16,185,129,0.15)',
            border:'1px solid rgba(16,185,129,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <img src="/icons/Icon_PROTECT_10_Risk.png" width={14} height={14} alt="Audit" style={{ objectFit:'contain' }} />
            <span style={{ color:'#6EE7B7', fontSize:12, fontWeight:600, letterSpacing:1 }}>omniAUDIT Module</span>
          </div>
          <h1 style={{ fontSize:'clamp(32px,4.5vw,58px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20, letterSpacing:'-0.02em' }}>
            omniAUDIT —<br/>
            <span style={{ color:'#6EE7B7' }}>Compliance & Audit Management</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:18, lineHeight:1.7, maxWidth:620, margin:'0 auto 48px' }}>
            Track your Sendai Framework progress, ISO 22301 compliance gaps, and regulatory audit readiness —
            all in one dashboard.
          </p>

          {/* Scorecard with progress bars */}
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:16, padding:'28px 32px', maxWidth:640, margin:'0 auto', textAlign:'left' }}>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:700,
              letterSpacing:2, textTransform:'uppercase', marginBottom:24, textAlign:'center' }}>
              Compliance Scorecard
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {SCORECARD.map(item => (
                <div key={item.label}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:13, color:'rgba(255,255,255,0.75)', fontWeight:500 }}>{item.label}</span>
                    <span style={{ fontSize:13, color:item.color, fontWeight:700,
                      fontFamily:'DM Mono,monospace' }}>{item.score}%</span>
                  </div>
                  <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${item.score}%`, background:item.color,
                      borderRadius:3, transition:'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:30, fontWeight:700, color:N, marginBottom:12 }}>Always audit-ready</h2>
            <p style={{ fontSize:16, color:MG, maxWidth:540, margin:'0 auto' }}>
              Continuous compliance monitoring so you are never caught off guard by an audit.
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
            Frameworks Supported
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            {['Sendai Framework', 'ISO 22301', 'BDDK', 'Basel III', 'JCI', 'FEMA NPG'].map(b => (
              <span key={b} style={{ background:GR, border:`1px solid ${BORDER}`, borderRadius:20,
                padding:'6px 18px', fontSize:13, fontWeight:600, color:N }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section style={{ padding:'48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {[['4','','Sendai SF Priorities'],['6+','','Compliance Frameworks'],['100','%','Audit Trail'],['RT','','Real-Time Monitoring']].map(([n,u,l]) => (
            <div key={l} style={{ background:'#fff', border:`1px solid ${BORDER}`, borderRadius:12, padding:'28px 16px' }}>
              <div style={{ fontSize:36, fontWeight:800, color:ACCENT, fontFamily:'DM Mono,monospace', lineHeight:1 }}>{n}<span style={{ fontSize:16 }}>{u}</span></div>
              <div style={{ fontSize:12, color:MG, marginTop:8, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 48px', background:N, textAlign:'center' }}>
        <h2 style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:16 }}>Start your compliance audit →</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, marginBottom:36 }}>
          Get your Sendai Framework progress score in under 30 minutes.
        </p>
        <Link href="/login" style={{ background:ACCENT, color:'#fff', fontWeight:700, fontSize:15,
          padding:'14px 40px', borderRadius:8, display:'inline-block' }}>
          Run Gap Analysis
        </Link>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · omniAUDIT · Sendai SF · ISO 22301 · BDDK</p>
      </footer>
    </div>
  )
}
