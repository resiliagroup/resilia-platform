'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'

const C = { navy950:'#060D1A', navy900:'#0A1628', teal:'#2D8A87', amber:'#F59E0B', white:'#FFFFFF', muted:'#94A3B8', dim:'#64748B', border:'#1E3A5F' }
const F = "'Plus Jakarta Sans',sans-serif"

const PRINCIPLES = [
  { n:'01', title:'Preoccupation with Failure', desc:'High Reliability Organizations treat near-misses as evidence of systemic vulnerabilities, not lucky escapes. omniHRO structures the capture and analysis of near-miss events as the primary leading indicator of future catastrophic failure.' },
  { n:'02', title:'Reluctance to Simplify', desc:'HROs resist the temptation to reduce complex situations to familiar categories. omniHRO supports structured multi-dimensional analysis that captures operational complexity rather than forcing it into predefined risk boxes.' },
  { n:'03', title:'Sensitivity to Operations', desc:'Frontline awareness of system state is the first line of defense in HRO theory. omniHRO enables systematic collection of operational anomaly data from facility-level personnel — the people closest to failure signals.' },
]
const PLANNED = [
  { title:'Near-Miss Capture', desc:'Structured near-miss reporting workflow — capturing event details, contributing factors, system state and immediate response across all facility types.' },
  { title:'HRO Culture Scoring', desc:'Organization-level HRO maturity scored across the five Weick-Sutcliffe principles — tracking improvement over time and benchmarking against sector peers.' },
  { title:'Anomaly Pattern Analysis', desc:'Near-miss events analyzed for patterns across facilities, time periods and hazard categories — identifying systemic vulnerabilities before they produce catastrophic outcomes.' },
  { title:'Leading Indicator Dashboard', desc:'Real-time dashboard of leading resilience indicators — near-miss frequency, reporting culture metrics, exercise participation and anomaly resolution rates.' },
  { title:'omniCRISIS Integration', desc:'Near-miss data captured during crisis response events fed automatically into the HRO analytics engine — closing the learning loop between incident response and organizational resilience.' },
  { title:'Board Culture Reporting', desc:'HRO maturity reports formatted for board-level communication — translating operational culture metrics into strategic resilience investment decisions.' },
]

export default function OmniHROPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div style={{ background:C.navy900, fontFamily:F, minHeight:'100vh', color:C.white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}a{text-decoration:none;color:inherit}.ch{transition:border-color .2s,transform .2s}.ch:hover{border-color:#2D8A87!important;transform:translateY(-2px)}`}</style>
      <Nav />

      <section style={{ background:C.navy900, padding:'120px 48px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:700, height:600, background:'radial-gradient(circle at 100% 0%, rgba(45,138,135,0.10) 0%, transparent 65%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
          <p style={{ fontSize:12, color:C.muted, fontWeight:500, marginBottom:16 }}>Platform / omniHRO</p>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase' }}>omniHRO</p>
            <span style={{ fontSize:10, fontWeight:700, color:C.amber, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', padding:'3px 10px', borderRadius:9999, letterSpacing:'0.08em', textTransform:'uppercase' }}>Coming Soon</span>
          </div>
          <h1 style={{ fontSize:'clamp(38px,5vw,60px)', fontWeight:800, lineHeight:1.08, marginBottom:24, letterSpacing:'-0.02em', maxWidth:760 }}>
            High Reliability Organization<br /><span style={{ color:C.teal }}>Near-Miss Analytics.</span>
          </h1>
          <p style={{ fontSize:18, color:C.muted, maxWidth:640, lineHeight:1.75, marginBottom:36 }}>
            omniHRO brings High Reliability Organization theory into operational practice — structuring near-miss capture, culture scoring and leading indicator analysis to build organizational resilience before the next major event.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {['Near-Miss Analytics','HRO Culture','Leading Indicators'].map(b => (
              <span key={b} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:9999, border:`1px solid ${C.border}`, color:C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.navy950, padding:'80px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>HRO Foundation</p>
          <h2 style={{ fontSize:'clamp(28px,3.5vw,42px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:16, letterSpacing:'-0.02em' }}>The Five Principles of<br />High Reliability Organizations.</h2>
          <p style={{ fontSize:16, color:C.muted, maxWidth:680, lineHeight:1.75, marginBottom:56 }}>Weick and Sutcliffe identified five organizational properties that distinguish high-reliability organizations — those that operate in high-hazard environments with consistently low failure rates. omniHRO operationalizes these principles.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {PRINCIPLES.map(p => (
              <div key={p.n} style={{ background:C.navy900, border:`1px solid ${C.border}`, borderRadius:12, padding:32, position:'relative', overflow:'hidden' }}>
                <div style={{ fontSize:80, fontWeight:800, color:C.teal, opacity:0.08, lineHeight:1, position:'absolute', top:8, right:16, pointerEvents:'none' }}>{p.n}</div>
                <div style={{ fontSize:13, fontWeight:700, color:C.teal, marginBottom:12 }}>{p.n}</div>
                <h3 style={{ fontSize:18, fontWeight:700, color:C.white, marginBottom:12 }}>{p.title}</h3>
                <p style={{ fontSize:14, color:C.muted, lineHeight:1.8 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:C.navy900, padding:'100px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <p style={{ fontSize:11, fontWeight:700, color:C.teal, letterSpacing:'0.14em', textTransform:'uppercase' }}>Planned Capabilities</p>
            <span style={{ fontSize:10, fontWeight:700, color:C.amber, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', padding:'3px 10px', borderRadius:9999, letterSpacing:'0.08em', textTransform:'uppercase' }}>Expected Q3 2026</span>
          </div>
          <h2 style={{ fontSize:'clamp(26px,3vw,38px)', fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:56, letterSpacing:'-0.02em' }}>Measure Culture Before<br />Culture Produces a Crisis.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {PLANNED.map(f => (
              <div key={f.title} className="ch" style={{ background:C.navy950, border:`1px dashed ${C.border}`, borderRadius:12, padding:28 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <h3 style={{ fontSize:16, fontWeight:700, color:C.white }}>{f.title}</h3>
                  <span style={{ fontSize:9, fontWeight:700, color:C.amber, background:'rgba(245,158,11,0.10)', border:'1px solid rgba(245,158,11,0.25)', padding:'2px 7px', borderRadius:9999, letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>Planned</span>
                </div>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:'linear-gradient(135deg, #0F2240, #060D1A)', borderTop:`1px solid ${C.border}`, padding:'100px 48px', textAlign:'center' }}>
        <div style={{ display:'inline-block', background:'rgba(245,158,11,0.10)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:9999, padding:'6px 18px', marginBottom:24 }}>
          <span style={{ fontSize:11, fontWeight:700, color:C.amber, letterSpacing:'0.10em', textTransform:'uppercase' }}>Early Access — Q3 2026</span>
        </div>
        <h2 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:C.white, marginBottom:16, letterSpacing:'-0.02em', maxWidth:600, margin:'0 auto 16px' }}>Be the first to build HRO culture into your resilience program.</h2>
        <p style={{ fontSize:16, color:C.muted, maxWidth:520, margin:'0 auto 40px', lineHeight:1.7 }}>Join the omniHRO early access list to receive development updates, methodology previews and priority access at launch.</p>
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
            <p style={{ fontSize:13, color:C.muted, marginTop:6 }}>We will be in touch ahead of the Q3 2026 launch.</p>
          </div>
        )}
        <p style={{ fontSize:12, color:C.dim, marginTop:20 }}>No spam. Unsubscribe at any time.</p>
      </section>

      <footer style={{ background:C.navy950, borderTop:`1px solid ${C.border}`, padding:'32px 0', textAlign:'center' }}>
        <p style={{ fontSize:12, color:C.dim }}>© 2026 Omniversel · All rights reserved</p>
      </footer>
    </div>
  )
}
