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

const N='#0A1628'; const A='#EF4444'; const MG='#566B66'; const BORDER='#E8EDED'

const BADGES = ['JCI', 'Kaiser HVA', 'HFMEA', 'HEICS', 'ISO 22301', 'Ministry of Health']

const FEATURES = [
  { title:'JCI-Aligned BCP Templates', desc:'Pre-built business continuity plans for JCI standard EM.02, EM.03, and EM.04 — covering utility failures, hazardous materials, and mass casualty response.', color:'#DC2626' },
  { title:'Kaiser HVA Integration', desc:'Hazard Vulnerability Analysis with 43 hospital-specific scenarios including natural disasters, infrastructure failures, and biological events.', color:'#B91C1C' },
  { title:'HEICS Activation Protocol', desc:'Hospital Emergency Incident Command System with automated role assignments, span-of-control enforcement, and real-time resource tracking.', color:'#991B1B' },
]

const METRICS = [
  { val:'78',   label:'Assessment Questions', sub:'Healthcare BCM assessment' },
  { val:'<2h',  label:'ICU RTO',              sub:'Target recovery time' },
  { val:'43',   label:'HVA Scenarios',        sub:'Hospital-specific hazards' },
  { val:'4',    label:'HEICS Command Levels', sub:'Incident command structure' },
]

export default function HealthSolutionPage() {
  return (
    <div style={{ background:'#F8F9FA', fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.15)',
            border:'1px solid rgba(239,68,68,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <span style={{ color:'#FCA5A5', fontSize:12, fontWeight:600, letterSpacing:1 }}>Healthcare & Hospitals</span>
          </div>
          <h1 style={{ fontSize:'clamp(30px,4vw,54px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
            Healthcare & Hospital<br/>
            <span style={{ color:'#FCA5A5' }}>Resilience</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:17, lineHeight:1.75, maxWidth:580, margin:'0 auto 40px' }}>
            From 03:00 ventilator failures to mass casualty events — complete BCM for hospitals and healthcare networks.
          </p>
          {/* Compliance badges */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {BADGES.map(b => (
              <span key={b} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)',
                color:'#FCA5A5', fontSize:11, fontWeight:700, padding:'5px 14px', borderRadius:20, letterSpacing:0.5 }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CRITICAL SCENARIO CALLOUT */}
      <section style={{ padding:'48px', background:'#fff', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:720, margin:'0 auto' }}>
          <div style={{ background:'#FFF5F5', border:`2px solid ${A}`, borderRadius:16, padding:'28px 32px',
            borderLeft:`6px solid ${A}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <img src="/icons/Icon_RESP_12_OnScene.png" alt="On-scene response" width={32} height={32}
                style={{ objectFit:'contain' }} />
              <span style={{ fontSize:12, fontWeight:800, color:A, letterSpacing:1.5, textTransform:'uppercase' }}>
                Critical Scenario
              </span>
            </div>
            <p style={{ fontSize:18, fontWeight:700, color:N, marginBottom:12, lineHeight:1.4 }}>
              03:00 — Ventilator Failure Scenario
            </p>
            <p style={{ fontSize:14, color:'#374151', lineHeight:1.75, marginBottom:12 }}>
              Power outage. 47 ICU patients on ventilators.
            </p>
            <p style={{ fontSize:15, fontWeight:600, color:A }}>
              Do you have a verified BCP that activates in under 60 seconds?
            </p>
          </div>
        </div>
      </section>

      {/* KEY METRICS */}
      <section style={{ padding:'48px', background:'#F8F9FA', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
          {METRICS.map(m => (
            <div key={m.label}>
              <div style={{ fontSize:36, fontWeight:800, color:A, fontFamily:'DM Mono,monospace', lineHeight:1 }}>{m.val}</div>
              <div style={{ fontSize:13, fontWeight:700, color:N, marginTop:8 }}>{m.label}</div>
              <div style={{ fontSize:11, color:MG, marginTop:4 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:'72px 48px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <h2 style={{ fontSize:28, fontWeight:700, color:N, textAlign:'center', marginBottom:12 }}>
            Purpose-Built for Healthcare Institutions
          </h2>
          <p style={{ fontSize:14, color:MG, textAlign:'center', marginBottom:48, maxWidth:560, margin:'0 auto 48px' }}>
            Every module is designed around clinical workflows and regulatory standards for hospitals and healthcare networks.
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

      {/* PUBLIC HEALTH ICON + SECTION */}
      <section style={{ padding:'64px 48px', background:'#F8F9FA', borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <img src="/icons/Icon_RESP_14_PublicHealth.png" alt="Public health response" width={64} height={64}
            style={{ objectFit:'contain', marginBottom:24 }} />
          <h2 style={{ fontSize:24, fontWeight:700, color:N, marginBottom:12 }}>
            Public Health Emergency Readiness
          </h2>
          <p style={{ fontSize:14, color:MG, lineHeight:1.8, maxWidth:560, margin:'0 auto 32px' }}>
            From mass casualty triage protocols to pandemic surge planning — omniCRISIS integrates with your existing HEICS structure to provide unified command visibility across all departments and sites.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, textAlign:'left' }}>
            {[
              { title:'Mass Casualty Triage', desc:'START/SALT protocol integration with real-time patient tracking' },
              { title:'Surge Capacity Modeling', desc:'Dynamic bed and staff surge calculations for pandemic scenarios' },
              { title:'Inter-Hospital Coordination', desc:'Multi-facility resource sharing and patient transfer coordination' },
            ].map(item => (
              <div key={item.title} style={{ background:'#fff', border:`1px solid ${BORDER}`, borderRadius:12, padding:'20px' }}>
                <h4 style={{ fontSize:14, fontWeight:700, color:N, marginBottom:8 }}>{item.title}</h4>
                <p style={{ fontSize:12, color:MG, lineHeight:1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 48px', background:N, textAlign:'center' }}>
        <h2 style={{ fontSize:30, fontWeight:700, color:'#fff', marginBottom:16 }}>Download Healthcare BCM Guide →</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:15, marginBottom:32 }}>JCI, HEICS, and Kaiser HVA aligned — built for hospital resilience teams.</p>
        <Link href="/login" style={{ background:A, color:'#fff', fontWeight:700, fontSize:15, padding:'14px 40px', borderRadius:8, display:'inline-block' }}>Download Healthcare BCM Guide</Link>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · Healthcare Resilience · JCI · Kaiser HVA · HEICS · ISO 22301</p>
      </footer>
    </div>
  )
}
