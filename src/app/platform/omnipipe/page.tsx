'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const C = { navy950:'#F8FAFC', navy900:'#FFFFFF', teal:'#2D8A87', amber:'#F59E0B', white:'#0A1628', muted:'#64748B', dim:'#374151', border:'#E2E8F0' }
const F = "'Plus Jakarta Sans',sans-serif"

const CAPABILITIES = [
  { n:'01', title:'Consequence Modeling', desc:'Quantitative consequence analysis for pipeline failure scenarios — modeling blast radius, toxic dispersion, thermal radiation and pressure wave effects calibrated to pipeline diameter, operating pressure and product type.' },
  { n:'02', title:'Pipeline Integrity Assessment', desc:'Structured integrity management framework covering corrosion, mechanical damage, geotechnical hazard and third-party interference risk — integrated with EPDK operational safety requirements.' },
  { n:'03', title:'QRA Output', desc:'Quantitative Risk Assessment outputs formatted for EPDK regulatory submission — including individual risk contours, societal risk F-N curves and ALARP demonstration documentation.' },
]
const OPERATORS = [
  { title:'Gas Distribution Networks', desc:'Natural gas transmission and distribution operators — covering trunk lines, city gate stations, distribution mains and service connections across urban and rural geographies.' },
  { title:'LNG Terminals', desc:'Liquefied natural gas import, storage and regasification terminals — addressing cryogenic hazard, BLEVE scenarios and emergency response planning for port and coastal facility operations.' },
  { title:'Oil and Petrochemical', desc:'Crude oil and refined product pipelines — covering spill consequence modeling, contamination zone analysis and emergency response planning for onshore and near-shore pipeline corridors.' },
  { title:'Power Generation', desc:'Gas-fired power generation facilities with pipeline supply dependency — addressing supply disruption scenarios, fuel switching capability and grid stability implications of extended gas supply interruption.' },
]

export default function OmniPipePage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div style={{ background:C.navy900, fontFamily:F, minHeight:'100vh', color:C.white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}a{text-decoration:none;color:inherit}.ch{transition:border-color .2s,transform .2s}.ch:hover{border-color:#2D8A87!important;transform:translateY(-2px)}`}</style>
      <Nav />

      <section style={{ background:C.navy900, padding:'120px 48px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:700, height:600, background:'radial-gradient(circle at 100% 0%, rgba(45,138,135,0.10) 0%, transparent 65%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
          <p style={{ fontSize:12, color:C.muted, fontWeight:500, marginBottom:16 }}>Platform / omniPIPE</p>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase' }}>omniPIPE</p>
            <span style={{ fontSize:10, fontWeight:700, color:C.amber, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', padding:'3px 10px', borderRadius:9999, letterSpacing:'0.08em', textTransform:'uppercase' }}>Coming Soon</span>
          </div>
          <h1 style={{ fontSize:'clamp(38px,5vw,60px)', fontWeight:800, lineHeight:1.08, marginBottom:24, letterSpacing:'-0.02em', maxWidth:760 }}>
            Pipeline and LNG<br /><span style={{ color:C.teal }}>Risk and Consequence Modeling.</span>
          </h1>
          <p style={{ fontSize:18, color:C.muted, maxWidth:640, lineHeight:1.75, marginBottom:36 }}>
            omniPIPE extends Omniversel methodology to pipeline infrastructure — providing quantitative consequence modeling, integrity assessment and EPDK-aligned QRA outputs for gas, LNG and liquid hydrocarbon operators.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {['Pipeline Risk','LNG Safety','EPDK Compliance'].map(b => (
              <span key={b} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:9999, border:`1px solid ${C.border}`, color:C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.navy950, padding:'80px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase' }}>Planned Capabilities</p>
            <span style={{ fontSize:10, fontWeight:700, color:C.amber, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', padding:'3px 10px', borderRadius:9999, letterSpacing:'0.08em', textTransform:'uppercase' }}>Expected Q4 2026</span>
          </div>
          <h2 style={{ fontSize:'clamp(28px,3.5vw,42px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>Quantitative Risk Analysis<br />for Pipeline Infrastructure.</h2>
          <div className="g3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {CAPABILITIES.map(c => (
              <div key={c.n} style={{ background:C.navy900, border:`1px dashed ${C.border}`, borderRadius:12, padding:32, position:'relative', overflow:'hidden' }}>
                <div style={{ fontSize:80, fontWeight:800, color:C.teal, opacity:0.08, lineHeight:1, position:'absolute', top:8, right:16, pointerEvents:'none' }}>{c.n}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.teal }}>{c.n}</div>
                  <span style={{ fontSize:9, fontWeight:700, color:C.amber, background:'rgba(245,158,11,0.10)', border:'1px solid rgba(245,158,11,0.25)', padding:'2px 7px', borderRadius:9999, letterSpacing:'0.06em', textTransform:'uppercase' }}>Planned</span>
                </div>
                <h3 style={{ fontSize:18, fontWeight:700, color:C.white, marginBottom:12 }}>{c.title}</h3>
                <p style={{ fontSize:14, color:C.muted, lineHeight:1.8 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.navy900, padding:'100px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>Target Operators</p>
          <h2 style={{ fontSize:'clamp(26px,3vw,38px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>Built for Energy Infrastructure<br />Operators Across the Value Chain.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }}>
            {OPERATORS.map(o => (
              <div key={o.title} className="ch" style={{ background:C.navy950, border:`1px solid ${C.border}`, borderTop:`3px solid ${C.teal}`, borderRadius:12, padding:32 }}>
                <h3 style={{ fontSize:17, fontWeight:700, color:C.white, marginBottom:12 }}>{o.title}</h3>
                <p style={{ fontSize:14, color:C.muted, lineHeight:1.8 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:'linear-gradient(135deg, #FFFFFF, #F8FAFC)', borderTop:`1px solid ${C.border}`, padding:'100px 48px', textAlign:'center' }}>
        <div style={{ display:'inline-block', background:'rgba(245,158,11,0.10)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:9999, padding:'6px 18px', marginBottom:24 }}>
          <span style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.10em', textTransform:'uppercase' }}>Early Access — Q4 2026</span>
        </div>
        <h2 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:C.white, marginBottom:16, letterSpacing:'-0.02em', maxWidth:600, margin:'0 auto 16px' }}>Get early access to pipeline-specific QRA and consequence modeling.</h2>
        <p style={{ fontSize:16, color:C.muted, maxWidth:520, margin:'0 auto 40px', lineHeight:1.7 }}>Join the omniPIPE early access list. We will share methodology previews and EPDK alignment documentation ahead of the Q4 2026 launch.</p>
        {!submitted ? (
          <div style={{ display:'flex', gap:0, justifyContent:'center', maxWidth:480, margin:'0 auto' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ flex:1, background:'rgba(255,255,255,0.06)', border:`1px solid ${C.border}`, borderRight:'none', borderRadius:'9999px 0 0 9999px', padding:'14px 20px', fontSize:14, color:C.white, outline:'none', fontFamily:F }}
            />
            <button
              onClick={() => { if (email) setSubmitted(true) }}
              style={{ background:C.teal, color:C.white, fontWeight:700, fontSize:14, padding:'14px 28px', borderRadius:'0 9999px 9999px 0', border:'none', cursor:'pointer', fontFamily:F, whiteSpace:'nowrap' }}
            >
              Join Waitlist
            </button>
          </div>
        ) : (
          <div style={{ background:'rgba(45,138,135,0.12)', border:`1px solid ${C.teal}`, borderRadius:12, padding:'20px 32px', maxWidth:480, margin:'0 auto' }}>
            <p style={{ fontSize:15, fontWeight:600, color:C.teal }}>You are on the list.</p>
            <p style={{ fontSize:13, color:C.muted, marginTop:6 }}>We will be in touch ahead of the Q4 2026 launch.</p>
          </div>
        )}
        <p style={{ fontSize:12, color:C.dim, marginTop:20 }}>No spam. Unsubscribe at any time.</p>
      </section>

      <Footer />
    </div>
  )
}
