'use client'
import Link from 'next/link'

const N = '#0A1628'; const T = '#009B8D'; const MG = '#566B66'; const BORDER = '#E8EDED'; const GR = '#F4F7F6'
const ACCENT = '#8B5CF6'

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
    icon: 'Icon_RESP_12_OnScene.png',
    title: 'HEICS Protocol Integration',
    desc: 'Hospital Emergency Incident Command System protocols built-in. Pre-defined role assignments, activation checklists and escalation paths for every hazard type.',
    color: ACCENT,
  },
  {
    icon: 'Icon_RESP_03_OpCoord.png',
    title: 'Real-Time Task Tracking',
    desc: 'Live incident dashboard with task assignment, status updates and resource tracking across all ICS sections — Operations, Logistics, Planning and Finance.',
    color: '#EC4899',
  },
  {
    icon: 'Icon_RESP_12_OnScene.png',
    title: 'Automated Post-Mortem',
    desc: 'Structured After Action Review templates automatically populated from incident data. Lessons learned feed directly into the omniAUDIT compliance loop.',
    color: '#F97316',
  },
]

const ICS_SECTIONS = [
  { label: 'Operations', color: '#EF4444', desc: 'Tactical response, resource deployment' },
  { label: 'Logistics', color: '#F97316', desc: 'Resources, facilities, services' },
  { label: 'Planning', color: '#3B82F6', desc: 'Situation status, documentation' },
  { label: 'Finance', color: '#10B981', desc: 'Cost tracking, procurement' },
]

export default function OmniCrisisPage() {
  return (
    <div style={{ background:'#F8F9FA', fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(139,92,246,0.15)',
            border:'1px solid rgba(139,92,246,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <img src="/icons/Icon_RESP_12_OnScene.png" width={14} height={14} alt="Crisis" style={{ objectFit:'contain' }} />
            <span style={{ color:'#C4B5FD', fontSize:12, fontWeight:600, letterSpacing:1 }}>omniCRISIS Module</span>
          </div>
          <h1 style={{ fontSize:'clamp(32px,4.5vw,58px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20, letterSpacing:'-0.02em' }}>
            omniCRISIS —<br/>
            <span style={{ color:'#C4B5FD' }}>Real-Time Crisis Command</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:18, lineHeight:1.7, maxWidth:620, margin:'0 auto 48px' }}>
            From early warning to post-mortem — a full incident command system with HEICS protocol integration,
            real-time task tracking, and structured lessons-learned.
          </p>

          {/* ICS Command Hierarchy */}
          <div style={{ maxWidth:720, margin:'0 auto' }}>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:700,
              letterSpacing:2, textTransform:'uppercase', marginBottom:20 }}>ICS Command Structure</p>

            {/* Incident Commander */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
              <div style={{ background:'rgba(139,92,246,0.2)', border:'2px solid rgba(139,92,246,0.5)',
                borderRadius:10, padding:'14px 36px', textAlign:'center' }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#C4B5FD' }}>Incident Commander</span>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:4 }}>Strategic oversight · Media · Safety</div>
              </div>
            </div>

            {/* Connector line */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:0 }}>
              <div style={{ width:2, height:20, background:'rgba(255,255,255,0.15)' }} />
            </div>
            {/* Horizontal line */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:0, position:'relative' }}>
              <div style={{ width:'80%', height:2, background:'rgba(255,255,255,0.15)', marginTop:0 }} />
            </div>

            {/* Section nodes */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:0 }}>
              {ICS_SECTIONS.map(s => (
                <div key={s.label} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ width:2, height:20, background:'rgba(255,255,255,0.15)', marginBottom:0 }} />
                  <div style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${s.color}40`,
                    borderTop:`2px solid ${s.color}`, borderRadius:8, padding:'12px 8px', textAlign:'center', width:'100%' }}>
                    <span style={{ fontSize:12, fontWeight:700, color:s.color }}>{s.label}</span>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:6, lineHeight:1.5 }}>{s.desc}</div>
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
            <h2 style={{ fontSize:30, fontWeight:700, color:N, marginBottom:12 }}>Command. Coordinate. Recover.</h2>
            <p style={{ fontSize:16, color:MG, maxWidth:540, margin:'0 auto' }}>
              Every phase of incident response, managed in one system.
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
            Protocol Compatibility
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            {['HEICS', 'ICS-100', 'NIMS Compatible', 'FEMA Response', 'ISO 22320'].map(b => (
              <span key={b} style={{ background:GR, border:`1px solid ${BORDER}`, borderRadius:20,
                padding:'6px 18px', fontSize:13, fontWeight:600, color:N }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section style={{ padding:'48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {[['<5','min','Mean Detection to Activation'],['4','','ICS Sections Supported'],['100','%','Audit Trail'],['AAR','','Auto Post-Mortem']].map(([n,u,l]) => (
            <div key={l} style={{ background:'#fff', border:`1px solid ${BORDER}`, borderRadius:12, padding:'28px 16px' }}>
              <div style={{ fontSize:36, fontWeight:800, color:ACCENT, fontFamily:'DM Mono,monospace', lineHeight:1 }}>{n}<span style={{ fontSize:16 }}>{u}</span></div>
              <div style={{ fontSize:12, color:MG, marginTop:8, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 48px', background:N, textAlign:'center' }}>
        <h2 style={{ fontSize:32, fontWeight:700, color:'#fff', marginBottom:16 }}>Activate your command center →</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, marginBottom:36 }}>
          Be ready before the next incident. Start a free simulation today.
        </p>
        <Link href="/login" style={{ background:ACCENT, color:'#fff', fontWeight:700, fontSize:15,
          padding:'14px 40px', borderRadius:8, display:'inline-block' }}>
          Request Demo
        </Link>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · omniCRISIS · HEICS · ICS-100 · NIMS Compatible</p>
      </footer>
    </div>
  )
}
