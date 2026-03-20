'use client'
import Link from 'next/link'

const N = '#0A1628'; const T = '#009B8D'; const MG = '#566B66'; const BORDER = '#E8EDED'; const GR = '#F4F7F6'
const ACCENT = '#3B82F6'

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
    icon: 'Icon_PREVENT_01_Planning.png',
    title: 'RTO/RPO/MTD Tracking',
    desc: 'Define and monitor Recovery Time Objectives, Recovery Point Objectives, and Maximum Tolerable Downtime at every critical business function level.',
    color: ACCENT,
  },
  {
    icon: 'Icon_PREVENT_01_Planning.png',
    title: 'ISO 22301 Gap Analysis',
    desc: 'Clause-by-clause maturity scoring against ISO 22301:2019. Automated gap identification with prioritized remediation roadmaps and evidence collection.',
    color: '#6366F1',
  },
  {
    icon: 'Icon_PREVENT_01_Planning.png',
    title: 'Drill & Exercise Management',
    desc: 'Schedule, execute and evaluate tabletop exercises, drills and full-scale simulations. Track lessons learned and drive continuous improvement cycles.',
    color: '#10B981',
  },
]

const BCP_TABLE = [
  { fn: 'Emergency Hotline (112)', mtd: '1h', rto: '15min', rpo: '0min', bia: { label:'Complete', ok:true }, plan: { label:'Approved', ok:true } },
  { fn: 'BETS Municipal IT', mtd: '8h', rto: '4h', rpo: '1h', bia: { label:'Update Req.', ok:false }, plan: { label:'Draft', ok:false } },
  { fn: 'Flood Response System', mtd: '2h', rto: '1h', rpo: '0min', bia: { label:'Complete', ok:true }, plan: { label:'Approved', ok:true } },
]

const BADGES = ['JCI', 'BDDK', 'Basel III', 'ISO 22301', 'Sendai SF']

export default function OmniPlanPage() {
  return (
    <div style={{ background:'#F8F9FA', fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(59,130,246,0.15)',
            border:'1px solid rgba(59,130,246,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <img src="/icons/Icon_PREVENT_01_Planning.png" width={14} height={14} alt="Planning" style={{ objectFit:'contain' }} />
            <span style={{ color:'#93C5FD', fontSize:12, fontWeight:600, letterSpacing:1 }}>omniPLAN Module</span>
          </div>
          <h1 style={{ fontSize:'clamp(32px,4.5vw,58px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20, letterSpacing:'-0.02em' }}>
            omniPLAN —<br/>
            <span style={{ color:'#93C5FD' }}>ISO 22301 Business Continuity Planning</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:18, lineHeight:1.7, maxWidth:620, margin:'0 auto 40px' }}>
            Design, test and maintain business continuity plans aligned to ISO 22301, JCI, BDDK and Basel III —
            with RTO/RPO/MTD tracking at every function.
          </p>

          {/* BCP Table mockup */}
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:16, overflow:'hidden', maxWidth:760, margin:'0 auto', textAlign:'left' }}>
            {/* Table header */}
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1.4fr 1.4fr',
              background:'rgba(255,255,255,0.08)', padding:'10px 20px', gap:8 }}>
              {['Function','MTD','RTO','RPO','BIA Status','Plan Status'].map(h => (
                <span key={h} style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)',
                  letterSpacing:1, textTransform:'uppercase' }}>{h}</span>
              ))}
            </div>
            {/* Table rows */}
            {BCP_TABLE.map((row, i) => (
              <div key={row.fn} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1.4fr 1.4fr',
                padding:'14px 20px', gap:8, borderTop:'1px solid rgba(255,255,255,0.06)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontWeight:500 }}>{row.fn}</span>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontFamily:'DM Mono,monospace' }}>{row.mtd}</span>
                <span style={{ fontSize:13, color:ACCENT, fontFamily:'DM Mono,monospace', fontWeight:600 }}>{row.rto}</span>
                <span style={{ fontSize:13, color:ACCENT, fontFamily:'DM Mono,monospace', fontWeight:600 }}>{row.rpo}</span>
                <span style={{ fontSize:12, color: row.bia.ok ? '#34D399' : '#FBBF24', fontWeight:600 }}>
                  {row.bia.ok ? '✓' : '⚠'} {row.bia.label}
                </span>
                <span style={{ fontSize:12, color: row.plan.ok ? '#34D399' : '#FBBF24', fontWeight:600 }}>
                  {row.plan.ok ? '✓' : ''} {row.plan.label}
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
            <h2 style={{ fontSize:30, fontWeight:700, color:N, marginBottom:12 }}>Everything you need for ISO 22301</h2>
            <p style={{ fontSize:16, color:MG, maxWidth:540, margin:'0 auto' }}>
              From BIA to live drill tracking — omniPLAN covers the full BCP lifecycle.
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
            Compliance Frameworks Covered
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            {BADGES.map(b => (
              <span key={b} style={{ background:GR, border:`1px solid ${BORDER}`, borderRadius:20,
                padding:'6px 18px', fontSize:13, fontWeight:600, color:N }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS ROW */}
      <section style={{ padding:'48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {[['22301','','ISO Standard'],['3','','Key Objectives: RTO/RPO/MTD'],['5+','','Compliance Frameworks'],['100','%','Audit Trail Coverage']].map(([n,u,l]) => (
            <div key={l} style={{ background:'#fff', border:`1px solid ${BORDER}`, borderRadius:12, padding:'28px 16px' }}>
              <div style={{ fontSize:36, fontWeight:800, color:ACCENT, fontFamily:'DM Mono,monospace', lineHeight:1 }}>{n}<span style={{ fontSize:18 }}>{u}</span></div>
              <div style={{ fontSize:12, color:MG, marginTop:8, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 48px', background:N, textAlign:'center' }}>
        <h2 style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:16 }}>Build your first BCP →</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, marginBottom:36 }}>
          ISO 22301 compliant plans in minutes, not months.
        </p>
        <Link href="/login" style={{ background:ACCENT, color:'#fff', fontWeight:700, fontSize:15,
          padding:'14px 40px', borderRadius:8, display:'inline-block' }}>
          Start Free Assessment
        </Link>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · omniPLAN · ISO 22301 · BDDK · Basel III</p>
      </footer>
    </div>
  )
}
