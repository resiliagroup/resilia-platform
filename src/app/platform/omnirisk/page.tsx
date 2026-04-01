import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = { title: 'omniRISK — Quantitative Risk Scoring', description: 'Multi-parameter URI scoring for every facility. Audit-ready, sector-calibrated, defensible.' }

const C = { navy950:'#F8FAFC', navy900:'#FFFFFF', teal:'#2D8A87', white:'#0A1628', muted:'#64748B', dim:'#374151', border:'#E2E8F0' }
const F = "'Plus Jakarta Sans',sans-serif"

const STEPS = [
  { n:'01', title:'Data Collection', desc:'Structured facility data is collected across six dimensions: geographic hazard exposure, structural characteristics, operational capacity, supply chain dependencies, near-miss history and existing mitigation measures.' },
  { n:'02', title:'URI Calculation', desc:'The Unified Risk Index is calculated using a validated multi-parameter formula: URI = (H × F × E × B) / (1 + k(s,t) × C²) × HRO_alpha — where each parameter is scored independently and weighted by sector and hazard type.' },
  { n:'03', title:'Actionable Output', desc:'Assessment results are delivered as a structured resilience report — including the URI score, parameter breakdown, peer comparison, priority action recommendations and regulatory compliance mapping.' },
]
const FEATURES = [
  { title:'Multi-Parameter Scoring', desc:'Risk evaluated across hazard (H), fragility (F), exposure (E), bottleneck (B), mitigation capacity (C) and HRO coefficient — not as a single qualitative rating.' },
  { title:'Sector Calibration', desc:'Scoring weights adjusted by sector and hazard type. Banking, healthcare, industrial and public sector assessments use sector-specific parameter weightings.' },
  { title:'k(s,t) Matrix', desc:'Dynamic sector-hazard interaction matrix — capturing how the relationship between sector vulnerability and hazard type changes across different operational contexts.' },
  { title:'HRO Alpha Coefficient', desc:'High Reliability Organization adjustments applied based on near-miss reporting culture, exercise frequency and autonomous response capability — rewarding resilience investment.' },
  { title:'Bottleneck Analysis', desc:'Theory of Constraints methodology applied to identify the single operational constraint whose failure would halt organizational throughput — enabling focused, high-leverage intervention.' },
  { title:'Audit Trail', desc:'Every assessment generates a complete, timestamped audit trail — defensible in regulatory proceedings, board-level reporting and insurance underwriting processes.' },
]
const STATS = [
  { val:'782+', label:'Facilities Scored', sub:'Across metropolitan Istanbul' },
  { val:'6', label:'Parameter Dimensions', sub:'Per facility assessment' },
  { val:'10', label:'Sectors Supported', sub:'With calibrated weightings' },
  { val:'< 48h', label:'Assessment Turnaround', sub:'From data collection to report' },
]
const INTEG = [
  { mod:'omniIMPACT', desc:'URI scores feed directly into business impact analysis — quantifying the financial and operational cost of each risk scenario.' },
  { mod:'omniPLAN', desc:'Risk assessment outputs drive BCM plan prioritization — ensuring continuity plans address the highest-URI facilities first.' },
  { mod:'omniCRISIS', desc:'Live risk data informs crisis command decisions — providing real-time context during incident response.' },
]

export default function OmniRiskPage() {
  return (
    <div style={{ background:C.navy900, fontFamily:F, minHeight:'100vh', color:C.white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}a{text-decoration:none;color:inherit}.ch{transition:border-color .2s,transform .2s}.ch:hover{border-color:#2D8A87!important;transform:translateY(-2px)}`}</style>
      <Nav />

      <section style={{ background:C.navy900, padding:'120px 48px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:700, height:600, background:'radial-gradient(circle at 100% 0%, rgba(45,138,135,0.12) 0%, transparent 65%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
          <p style={{ fontSize:12, color:C.muted, fontWeight:500, marginBottom:16 }}>Platform / omniRISK</p>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:20 }}>omniRISK</p>
          <h1 style={{ fontSize:'clamp(38px,5vw,60px)', fontWeight:800, lineHeight:1.08, marginBottom:24, letterSpacing:'-0.02em', maxWidth:720 }}>
            Quantitative Risk Scoring<br /><span style={{ color:C.teal }}>for Every Facility.</span>
          </h1>
          <p style={{ fontSize:18, color:C.muted, maxWidth:640, lineHeight:1.75, marginBottom:36 }}>
            omniRISK produces a defensible, auditable Unified Risk Index for every assessed facility — integrating hazard exposure, structural fragility, operational capacity and supply-chain bottleneck dimensions into a single, actionable score.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:32 }}>
            <Link href="/login" style={{ background:C.teal, color:C.white, fontWeight:700, fontSize:14, padding:'13px 28px', borderRadius:9999, display:'inline-block' }}>Request Demo</Link>
            <Link href="/methodology" style={{ border:`1px solid ${C.border}`, color:C.muted, fontWeight:600, fontSize:14, padding:'12px 24px', borderRadius:9999, display:'inline-block' }}>View Methodology →</Link>
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {['Multi-Parameter Model','Sector Calibrated','Audit Ready'].map(b => (
              <span key={b} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:9999, border:`1px solid ${C.border}`, color:C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.navy950, padding:'80px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>How It Works</p>
          <h2 style={{ fontSize:'clamp(28px,3.5vw,42px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>From Data to Decision<br />in Three Steps.</h2>
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
          <h2 style={{ fontSize:'clamp(26px,3vw,38px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>Everything You Need to<br />Quantify Organizational Risk.</h2>
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
              <div style={{ fontSize:42, fontWeight:800, color:C.teal, lineHeight:1, marginBottom:8 }}>{s.val}</div>
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
        <h2 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:C.white, marginBottom:40, letterSpacing:'-0.02em', maxWidth:560, margin:'0 auto 40px' }}>Start measuring risk across your facilities.</h2>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" style={{ background:C.teal, color:C.white, fontWeight:700, fontSize:15, padding:'16px 36px', borderRadius:9999, display:'inline-block' }}>Request Demo</Link>
          <a href="mailto:info@omniversel.com" style={{ border:`1px solid ${C.border}`, color:C.muted, fontWeight:600, fontSize:15, padding:'15px 32px', borderRadius:9999, display:'inline-block' }}>Contact Advisory Team</a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
