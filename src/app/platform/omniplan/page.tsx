import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = { title: 'omniPLAN — BCM Planning', description: 'ISO 22301-aligned business continuity planning with RTO/RPO tracking and exercise management.' }

const C = { navy950:'#F8FAFC', navy900:'#FFFFFF', teal:'#2D8A87', white:'#0A1628', muted:'#64748B', dim:'#374151', border:'#E2E8F0' }
const F = "'Plus Jakarta Sans',sans-serif"

const STEPS = [
  { n:'01', title:'Plan Development', desc:'Business continuity plans developed using ISO 22301-aligned templates — covering scope, policy, risk treatment, continuity strategies, response procedures and recovery plans.' },
  { n:'02', title:'RTO/RPO Integration', desc:'Recovery objectives from omniIMPACT analysis embedded directly into plan structure — ensuring continuity strategies are designed around actual impact data.' },
  { n:'03', title:'Testing and Maintenance', desc:'Exercise program managed within omniPLAN — scheduling tabletop, functional and full-scale exercises with automated debrief capture and plan update workflows.' },
]
const FEATURES = [
  { title:'ISO 22301 Templates', desc:'Plan structure aligned to ISO 22301 clause requirements — supporting third-party certification audit without restructuring.' },
  { title:'RTO/RPO Tracking', desc:'Recovery objectives tracked at process level — with automated alerts when operational changes create RTO/RPO gaps.' },
  { title:'Multi-Scenario Coverage', desc:'Plans cover earthquake, flood, cyber, operational and supply chain disruption scenarios — calibrated to each facility\'s specific risk profile.' },
  { title:'Exercise Management', desc:'Exercise program planning, execution and debrief captured in a single workflow — with action tracking and plan update integration.' },
  { title:'Version Control', desc:'Full version history maintained for all plans — supporting audit requirements and enabling rapid rollback when plan updates introduce errors.' },
  { title:'Regulatory Output', desc:'Plan documentation formatted for BDDK, ISO 22301 and AFAD regulatory submissions — reducing compliance reporting effort.' },
]
const STATS = [
  { val:'ISO 22301', label:'Aligned Methodology', sub:'International BCM standard' },
  { val:'3', label:'Exercise Types Supported', sub:'Tabletop, functional, full-scale' },
  { val:'Multi-scenario', label:'Plan Coverage', sub:'All major disruption types' },
  { val:'Audit ready', label:'Output Format', sub:'Regulatory and third-party' },
]
const INTEG = [
  { mod:'omniIMPACT', desc:'RTO/RPO targets from omniIMPACT drive BCM plan structure — ensuring plans are grounded in quantitative impact data.' },
  { mod:'omniCRISIS', desc:'Activated plans from omniPLAN feed directly into omniCRISIS command workflows — tested procedures available at incident activation.' },
  { mod:'omniAUDIT', desc:'Plan documentation linked to ISO 22301 clause requirements — supporting automated compliance scorecard generation.' },
]

export default function OmniPlanPage() {
  return (
    <div style={{ background:C.navy900, fontFamily:F, minHeight:'100vh', color:C.white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}a{text-decoration:none;color:inherit}.ch{transition:border-color .2s,transform .2s}.ch:hover{border-color:#2D8A87!important;transform:translateY(-2px)}`}</style>
      <Nav />

      <section style={{ background:C.navy900, padding:'120px 48px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:700, height:600, background:'radial-gradient(circle at 100% 0%, rgba(45,138,135,0.12) 0%, transparent 65%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
          <p style={{ fontSize:12, color:C.muted, fontWeight:500, marginBottom:16 }}>Platform / omniPLAN</p>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:20 }}>omniPLAN</p>
          <h1 style={{ fontSize:'clamp(38px,5vw,60px)', fontWeight:800, lineHeight:1.08, marginBottom:24, letterSpacing:'-0.02em', maxWidth:760 }}>
            ISO 22301-Aligned BCM Planning<br /><span style={{ color:C.teal }}>with RTO/RPO Tracking.</span>
          </h1>
          <p style={{ fontSize:18, color:C.muted, maxWidth:640, lineHeight:1.75, marginBottom:36 }}>
            omniPLAN provides a structured environment for developing, maintaining and testing business continuity plans — built on ISO 22301 requirements and driven by omniIMPACT data.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:32 }}>
            <Link href="/login" style={{ background:C.teal, color:C.white, fontWeight:700, fontSize:14, padding:'13px 28px', borderRadius:9999, display:'inline-block' }}>Request Demo</Link>
            <Link href="/methodology" style={{ border:`1px solid ${C.border}`, color:C.muted, fontWeight:600, fontSize:14, padding:'12px 24px', borderRadius:9999, display:'inline-block' }}>View Methodology →</Link>
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {['ISO 22301','BCM Templates','Exercise Management'].map(b => (
              <span key={b} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:9999, border:`1px solid ${C.border}`, color:C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.navy950, padding:'80px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>How It Works</p>
          <h2 style={{ fontSize:'clamp(28px,3.5vw,42px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>From Impact Data to<br />Tested, Auditable Plans.</h2>
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
          <h2 style={{ fontSize:'clamp(26px,3vw,38px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>Build BCM Plans That Satisfy<br />Auditors and Executives Alike.</h2>
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
        <h2 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:C.white, marginBottom:40, letterSpacing:'-0.02em', maxWidth:600, margin:'0 auto 40px' }}>Build BCM plans that satisfy auditors and executives alike.</h2>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" style={{ background:C.teal, color:C.white, fontWeight:700, fontSize:15, padding:'16px 36px', borderRadius:9999, display:'inline-block' }}>Request Demo</Link>
          <a href="mailto:info@omniversel.com" style={{ border:`1px solid ${C.border}`, color:C.muted, fontWeight:600, fontSize:15, padding:'15px 32px', borderRadius:9999, display:'inline-block' }}>Contact Advisory Team</a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
