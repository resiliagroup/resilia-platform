import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = { title: 'omniAUDIT — Compliance Management', description: 'Compliance scorecards and regulatory gap tracking — BDDK, ISO 22301, AFAD, Sendai Framework.' }

const C = { navy950:'#F8FAFC', navy900:'#FFFFFF', teal:'#2D8A87', white:'#0A1628', muted:'#64748B', dim:'#374151', border:'#E2E8F0' }
const F = "'Plus Jakarta Sans',sans-serif"

const STEPS = [
  { n:'01', title:'Framework Mapping', desc:'Regulatory and standards requirements mapped at clause level — covering ISO 22301, BDDK, AFAD, Sendai Framework and FEMA Core Capabilities — with each omniPlatform output linked to its relevant compliance evidence.' },
  { n:'02', title:'Scorecard Generation', desc:'Automated compliance scorecards generated from platform data — showing current compliance status, evidence coverage and gap severity across all mapped frameworks without manual evidence assembly.' },
  { n:'03', title:'Gap Remediation', desc:'Identified compliance gaps assigned as tracked action items — with due dates, owners and completion evidence linked directly to the relevant scorecard clause, closing the loop between assessment and remediation.' },
]
const FEATURES = [
  { title:'Multi-Framework Coverage', desc:'ISO 22301, BDDK BCM Regulation, AFAD DRRP requirements, Sendai Framework and FEMA Core Capabilities — all mapped in a single compliance environment without duplication.' },
  { title:'Automated Scorecards', desc:'Compliance scorecards generated automatically from omniRISK, omniIMPACT, omniPLAN and omniCRISIS outputs — eliminating manual evidence assembly for routine audit preparation.' },
  { title:'Gap Prioritization', desc:'Compliance gaps ranked by severity, regulatory deadline and remediation effort — enabling resource allocation decisions based on actual risk exposure rather than document order.' },
  { title:'Evidence Management', desc:'Every piece of compliance evidence timestamped, versioned and linked to its specific clause requirement — providing auditors with a traceable, defensible evidence trail.' },
  { title:'Audit Preparation', desc:'Audit-ready documentation packages generated on demand — pre-formatted for BDDK, ISO 22301 certification body and AFAD regulatory submission requirements.' },
  { title:'Regulatory Change Tracking', desc:'Framework updates monitored and mapped to existing evidence — flagging which compliance items require review when BDDK, ISO or AFAD requirements are revised.' },
]
const STATS = [
  { val:'6+', label:'Frameworks Covered', sub:'ISO, BDDK, AFAD, FEMA, Sendai' },
  { val:'Automated', label:'Scorecard Generation', sub:'No manual evidence assembly' },
  { val:'Zero', label:'Manual Evidence Entry', sub:'Platform data drives compliance' },
  { val:'24h', label:'Audit Package Turnaround', sub:'From request to delivery' },
]
const INTEG = [
  { mod:'omniRISK', desc:'URI scores and assessment reports provide evidence for ISO 22301 clause 6 (risk assessment) and BDDK facility resilience requirements.' },
  { mod:'omniPLAN', desc:'BCM plan documentation maps to ISO 22301 clause 8 requirements — supporting third-party certification audit without restructuring.' },
  { mod:'omniCRISIS', desc:'Incident response logs and exercise records provide evidence for ISO 22301 clause 9 (performance evaluation) and AFAD exercise requirements.' },
]

export default function OmniAuditPage() {
  return (
    <div style={{ background:C.navy900, fontFamily:F, minHeight:'100vh', color:C.white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}a{text-decoration:none;color:inherit}.ch{transition:border-color .2s,transform .2s}.ch:hover{border-color:#2D8A87!important;transform:translateY(-2px)}`}</style>
      <Nav />

      <section style={{ background:C.navy900, padding:'120px 48px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:700, height:600, background:'radial-gradient(circle at 100% 0%, rgba(45,138,135,0.12) 0%, transparent 65%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
          <p style={{ fontSize:12, color:C.muted, fontWeight:500, marginBottom:16 }}>Platform / omniAUDIT</p>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:20 }}>omniAUDIT</p>
          <h1 style={{ fontSize:'clamp(38px,5vw,60px)', fontWeight:800, lineHeight:1.08, marginBottom:24, letterSpacing:'-0.02em', maxWidth:760 }}>
            Regulatory Mapping<br /><span style={{ color:C.teal }}>and Compliance Scorecards.</span>
          </h1>
          <p style={{ fontSize:18, color:C.muted, maxWidth:640, lineHeight:1.75, marginBottom:36 }}>
            omniAUDIT translates platform outputs into regulatory compliance evidence — automating scorecard generation across ISO 22301, BDDK, AFAD and FEMA frameworks without manual evidence assembly.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:32 }}>
            <Link href="/login" style={{ background:C.teal, color:C.white, fontWeight:700, fontSize:14, padding:'13px 28px', borderRadius:9999, display:'inline-block' }}>Request Demo</Link>
            <Link href="/methodology" style={{ border:`1px solid ${C.border}`, color:C.muted, fontWeight:600, fontSize:14, padding:'12px 24px', borderRadius:9999, display:'inline-block' }}>View Methodology →</Link>
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {['Regulatory Mapping','Gap Analysis','Audit Ready'].map(b => (
              <span key={b} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:9999, border:`1px solid ${C.border}`, color:C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.navy950, padding:'80px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>How It Works</p>
          <h2 style={{ fontSize:'clamp(28px,3.5vw,42px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>From Platform Data<br />to Audit-Ready Evidence.</h2>
          <div className="g3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
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
          <h2 style={{ fontSize:'clamp(26px,3vw,38px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>Turn Compliance from<br />a Burden into a Baseline.</h2>
          <div className="g3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
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
        <div className="g4" style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32 }}>
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
          <div className="g3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {INTEG.map(i => (
              <div key={i.mod} className="ch" style={{ background:C.navy950, border:`1px solid ${C.border}`, borderTop:`3px solid ${C.teal}`, borderRadius:12, padding:28 }}>
                <div style={{ fontSize:15, fontWeight:800, color:C.teal, marginBottom:10 }}>{i.mod}</div>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.75 }}>{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:'linear-gradient(135deg, #FFFFFF, #F8FAFC)', borderTop:`1px solid ${C.border}`, padding:'100px 48px', textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:C.white, marginBottom:40, letterSpacing:'-0.02em', maxWidth:600, margin:'0 auto 40px' }}>Make compliance evidence a by-product of operations, not a project.</h2>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" style={{ background:C.teal, color:C.white, fontWeight:700, fontSize:15, padding:'16px 36px', borderRadius:9999, display:'inline-block' }}>Request Demo</Link>
          <a href="mailto:info@omniversel.com" style={{ border:`1px solid ${C.border}`, color:C.muted, fontWeight:600, fontSize:15, padding:'15px 32px', borderRadius:9999, display:'inline-block' }}>Contact Advisory Team</a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
