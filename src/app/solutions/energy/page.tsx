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

const N='#0A1628'; const A='#F59E0B'; const MG='#566B66'; const BORDER='#E8EDED'

const BADGES = ['EPDK', 'BOTAŞ TSI', 'SEVESO III', 'ISO 55001', 'FEMA REP']

const FEATURES = [
  { title:'RAPID-N Pipeline Modeling', desc:'NATECH-specific risk assessment for pipeline networks — quantifying natural hazard-triggered technological accident probability across seismic, flood, and landslide scenarios.', color:'#D97706' },
  { title:'Domino Effect Analysis', desc:'Multi-facility cascade risk modeling with probability trees. Identify how a failure in one installation propagates through adjacent facilities and shared infrastructure.', color:'#B45309' },
  { title:'SCADA Integration Ready', desc:'Connect to existing SCADA/DCS systems for real-time anomaly detection and automated alert escalation — without replacing your existing operational technology stack.', color:'#92400E' },
]

const NATECH_SCENARIOS = [
  {
    title:'Gas Pipeline NATECH',
    desc:'Earthquake-triggered pipeline rupture with RAPID-N domino cascade modeling. Probability trees for rupture, ignition, and explosion across affected pipeline segments.',
    icon:'🔴',
    color:'#DC2626',
  },
  {
    title:'Refinery Fire Cascade',
    desc:'Chemical plant fire cascading into adjacent facility domino effect analysis. Thermal radiation mapping and blast overpressure modeling for multi-site petrochemical complexes.',
    icon:'🟠',
    color:'#EA580C',
  },
  {
    title:'Power Grid Failure',
    desc:'Cascading electrical outage with critical infrastructure dependency mapping. Identify downstream impacts on water treatment, hospitals, and transport hubs.',
    icon:'🟡',
    color:A,
  },
]

const METRICS = [
  { val:'RAPID-N', label:'Risk Framework',     sub:'NATECH pipeline standard' },
  { val:'3+',      label:'Cascade Levels',     sub:'Domino effect modeling' },
  { val:'SCADA',   label:'Integration',        sub:'Real-time OT connectivity' },
  { val:'SEVESO',  label:'III Compliance',     sub:'EU major hazard directive' },
]

export default function EnergySolutionPage() {
  return (
    <div style={{ background:'#F8F9FA', fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.15)',
            border:'1px solid rgba(245,158,11,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <span style={{ color:'#FCD34D', fontSize:12, fontWeight:600, letterSpacing:1 }}>Energy & Pipeline Infrastructure</span>
          </div>
          <h1 style={{ fontSize:'clamp(30px,4vw,54px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
            Energy & Pipeline Infrastructure<br/>
            <span style={{ color:'#FCD34D' }}>Resilience</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:17, lineHeight:1.75, maxWidth:580, margin:'0 auto 40px' }}>
            NATECH risk modeling for power grids, gas pipelines, LNG terminals and petroleum refineries — built on omniPIPE.
          </p>
          {/* Compliance badges */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {BADGES.map(b => (
              <span key={b} style={{ background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)',
                color:'#FCD34D', fontSize:11, fontWeight:700, padding:'5px 14px', borderRadius:20, letterSpacing:0.5 }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TARGET OPERATORS CALLOUT */}
      <section style={{ padding:'32px 48px', background:'#FFF8E7', borderBottom:`1px solid #FDE68A` }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:12, fontWeight:800, color:'#92400E', letterSpacing:1.5, textTransform:'uppercase', marginBottom:10 }}>
            Target Operators
          </p>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center', alignItems:'center' }}>
            {['BOTAŞ', 'İPRGAZ', 'PetrolOfisi', 'TÜPRAŞ', 'EPDK-licensed operators'].map(op => (
              <span key={op} style={{ fontSize:14, fontWeight:700, color:'#78350F', padding:'6px 18px',
                background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:8 }}>{op}</span>
            ))}
          </div>
        </div>
      </section>

      {/* KEY METRICS */}
      <section style={{ padding:'48px', background:'#fff', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {METRICS.map(m => (
            <div key={m.label}>
              <div style={{ fontSize:m.val.length > 5 ? 22 : 36, fontWeight:800, color:A, fontFamily:'DM Mono,monospace', lineHeight:1 }}>{m.val}</div>
              <div style={{ fontSize:13, fontWeight:700, color:N, marginTop:8 }}>{m.label}</div>
              <div style={{ fontSize:11, color:MG, marginTop:4 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NATECH SCENARIOS */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:12, justifyContent:'center' }}>
            <img src="/icons/Icon_RESP_06_Environ.png" alt="Environmental response" width={40} height={40}
              style={{ objectFit:'contain' }} />
            <h2 style={{ fontSize:28, fontWeight:700, color:N }}>
              NATECH Scenario Library
            </h2>
          </div>
          <p style={{ fontSize:14, color:MG, textAlign:'center', marginBottom:48 }}>
            Natural Hazard-Triggered Technological Accidents — modeled at facility and pipeline network level
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {NATECH_SCENARIOS.map(s => (
              <div key={s.title} style={{ background:'#fff', border:`1px solid ${BORDER}`,
                borderRadius:16, padding:'28px 24px', borderTop:`3px solid ${s.color}` }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:N, marginBottom:12 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:MG, lineHeight:1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:'72px 48px', background:'#fff', borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:12, justifyContent:'center' }}>
            <img src="/icons/Icon_MIT_03_Operational.png" alt="Operational mitigation" width={40} height={40}
              style={{ objectFit:'contain' }} />
            <h2 style={{ fontSize:28, fontWeight:700, color:N }}>
              omniPIPE Core Capabilities
            </h2>
          </div>
          <p style={{ fontSize:14, color:MG, textAlign:'center', marginBottom:48 }}>
            End-to-end pipeline resilience from risk assessment to real-time monitoring
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background:'#F8F9FA', border:`1px solid ${BORDER}`,
                borderRadius:16, padding:'28px 24px', borderTop:`3px solid ${f.color}` }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:N, marginBottom:10 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:MG, lineHeight:1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 48px', background:N, textAlign:'center' }}>
        <h2 style={{ fontSize:30, fontWeight:700, color:'#fff', marginBottom:16 }}>Talk to a pipeline resilience expert →</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:15, marginBottom:32 }}>NATECH risk modeling, RAPID-N analysis, and SCADA integration — for energy operators who need more than generic BCM.</p>
        <Link href="/login" style={{ background:A, color:'#fff', fontWeight:700, fontSize:15, padding:'14px 40px', borderRadius:8, display:'inline-block' }}>Talk to a Pipeline Expert</Link>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · Energy & Pipeline Resilience · EPDK · BOTAŞ TSI · SEVESO III · ISO 55001</p>
      </footer>
    </div>
  )
}
