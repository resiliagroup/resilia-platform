import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = { title: 'omniVENDOR — Third-Party Risk', description: 'Supply chain and vendor risk assessment — URI-aligned scoring, concentration analysis.' }

const C = { navy950:'#060D1A', navy900:'#0A1628', teal:'#2D8A87', white:'#FFFFFF', muted:'#94A3B8', dim:'#64748B', border:'#1E3A5F' }
const F = "'Plus Jakarta Sans',sans-serif"

const STEPS = [
  { n:'01', title:'Vendor Inventory', desc:'Complete third-party vendor inventory structured by service category, facility dependency and operational criticality — mapping which vendors are essential to which processes across the organization.' },
  { n:'02', title:'Resilience Scoring', desc:'Each vendor assessed on a URI-aligned resilience score — evaluating financial stability, geographic concentration, business continuity capability and contractual recovery provisions.' },
  { n:'03', title:'Concentration Analysis', desc:'Single points of failure identified across the supply chain — including geographic clusters, shared infrastructure dependencies and over-reliance on individual vendors within critical service categories.' },
]
const FEATURES = [
  { title:'URI-Aligned Scoring', desc:'Vendor resilience scores calibrated to the same Unified Risk Index methodology as omniRISK facility assessments — enabling direct comparison of vendor and facility risk across the portfolio.' },
  { title:'Criticality Tiering', desc:'Vendors classified into Tier 1, 2 and 3 criticality levels based on process dependency, substitutability and recovery time impact — focusing oversight effort on the suppliers that matter most.' },
  { title:'Geographic Concentration', desc:'Supply chain geographic clustering identified and scored — revealing exposure to regional disruption scenarios where multiple vendors share the same earthquake zone, flood plain or political risk profile.' },
  { title:'Financial Resilience', desc:'Vendor financial health indicators monitored alongside operational resilience scores — providing early warning of suppliers whose financial distress may translate into supply chain disruption.' },
  { title:'Contractual Gap Analysis', desc:'BCM and recovery provisions in vendor contracts reviewed against omniIMPACT RTO/RPO requirements — identifying contractual gaps where vendor recovery commitments fall short of operational needs.' },
  { title:'Regulatory Reporting', desc:'Supply chain resilience documentation formatted for BDDK third-party risk management requirements and ISO 22301 supply chain continuity clause evidence.' },
]
const STATS = [
  { val:'Tier 1–3', label:'Vendor Criticality Model', sub:'Risk-based oversight tiers' },
  { val:'URI-Aligned', label:'Scoring Methodology', sub:'Consistent with omniRISK' },
  { val:'Geographic', label:'Concentration Mapping', sub:'Regional disruption exposure' },
  { val:'BDDK Ready', label:'Regulatory Output', sub:'Third-party risk reporting' },
]
const INTEG = [
  { mod:'omniRISK', desc:'Vendor URI scores calibrated to the same methodology as facility assessments — enabling unified risk reporting across the internal and external risk portfolio.' },
  { mod:'omniIMPACT', desc:'RTO/RPO requirements from omniIMPACT used to benchmark vendor contractual recovery provisions — identifying critical gaps before they become incident-day failures.' },
  { mod:'omniAUDIT', desc:'Vendor resilience assessments mapped to BDDK third-party risk management and ISO 22301 supply chain requirements — supporting automated compliance scoring.' },
]

export default function OmniVendorPage() {
  return (
    <div style={{ background:C.navy900, fontFamily:F, minHeight:'100vh', color:C.white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}a{text-decoration:none;color:inherit}.ch{transition:border-color .2s,transform .2s}.ch:hover{border-color:#2D8A87!important;transform:translateY(-2px)}`}</style>
      <Nav />

      <section style={{ background:C.navy900, padding:'120px 48px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:700, height:600, background:'radial-gradient(circle at 100% 0%, rgba(45,138,135,0.12) 0%, transparent 65%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
          <p style={{ fontSize:12, color:C.muted, fontWeight:500, marginBottom:16 }}>Platform / omniVENDOR</p>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:20 }}>omniVENDOR</p>
          <h1 style={{ fontSize:'clamp(38px,5vw,60px)', fontWeight:800, lineHeight:1.08, marginBottom:24, letterSpacing:'-0.02em', maxWidth:760 }}>
            Vendor Risk Scoring<br /><span style={{ color:C.teal }}>and Supply Chain Resilience.</span>
          </h1>
          <p style={{ fontSize:18, color:C.muted, maxWidth:640, lineHeight:1.75, marginBottom:36 }}>
            omniVENDOR extends the Unified Risk Index methodology to third-party vendors — scoring supplier resilience, mapping concentration risk and aligning contractual recovery provisions to operational RTO/RPO requirements.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:32 }}>
            <Link href="/login" style={{ background:C.teal, color:C.white, fontWeight:700, fontSize:14, padding:'13px 28px', borderRadius:9999, display:'inline-block' }}>Request Demo</Link>
            <Link href="/methodology" style={{ border:`1px solid ${C.border}`, color:C.muted, fontWeight:600, fontSize:14, padding:'12px 24px', borderRadius:9999, display:'inline-block' }}>View Methodology →</Link>
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {['Vendor Risk Scoring','Supply Chain','Dependency Analysis'].map(b => (
              <span key={b} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:9999, border:`1px solid ${C.border}`, color:C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.navy950, padding:'80px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>How It Works</p>
          <h2 style={{ fontSize:'clamp(28px,3.5vw,42px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>From Vendor Inventory<br />to Concentration Risk Intelligence.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {STEPS.map(s => (
              <div key={s.n} style={{ background:C.navy900, border:`1px solid ${C.border}`, borderRadius:12, padding:32, position:'relative', overflow:'hidden' }}>
                <div style={{ fontSize:80, fontWeight:800, color:C.teal, opacity:0.08, lineHeight:1, position:'absolute', top:8, right:16, pointerEvents:'none' }}>{s.n}</div>
                <div style={{ fontSize:13, fontWeight:700, color:C.teal, marginBottom:12 }}>{s.n}</div>
                <h3 style={{ fontSize:18, fontWeight:700, color:C.white, marginBottom:12 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:C.muted, lineHeight:1.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.navy900, padding:'100px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>Key Features</p>
          <h2 style={{ fontSize:'clamp(26px,3vw,38px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>Know the Resilience of Every<br />Supplier in Your Chain.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="ch" style={{ background:C.navy950, border:`1px solid ${C.border}`, borderRadius:12, padding:28 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:C.white, marginBottom:10 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.navy950, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'60px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32 }}>
          {STATS.map(s => (
            <div key={s.val} style={{ textAlign:'center' }}>
              <div style={{ fontSize:32, fontWeight:800, color:C.teal, lineHeight:1, marginBottom:8 }}>{s.val}</div>
              <div style={{ fontSize:14, fontWeight:600, color:C.white, marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:12, color:C.dim }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background:C.navy900, padding:'80px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <h2 style={{ fontSize:'clamp(24px,3vw,34px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:48, letterSpacing:'-0.01em' }}>Connects to the Full Platform.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {INTEG.map(i => (
              <div key={i.mod} className="ch" style={{ background:C.navy950, border:`1px solid ${C.border}`, borderTop:`3px solid ${C.teal}`, borderRadius:12, padding:28 }}>
                <div style={{ fontSize:15, fontWeight:800, color:C.teal, marginBottom:10 }}>{i.mod}</div>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.75 }}>{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:'linear-gradient(135deg, #0F2240, #060D1A)', borderTop:`1px solid ${C.border}`, padding:'100px 48px', textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:C.white, marginBottom:40, letterSpacing:'-0.02em', maxWidth:600, margin:'0 auto 40px' }}>Extend resilience intelligence across your entire supply chain.</h2>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" style={{ background:C.teal, color:C.white, fontWeight:700, fontSize:15, padding:'16px 36px', borderRadius:9999, display:'inline-block' }}>Request Demo</Link>
          <a href="mailto:info@omniversel.com" style={{ border:`1px solid ${C.border}`, color:C.muted, fontWeight:600, fontSize:15, padding:'15px 32px', borderRadius:9999, display:'inline-block' }}>Contact Advisory Team</a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
