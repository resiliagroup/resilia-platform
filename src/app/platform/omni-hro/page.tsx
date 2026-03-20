'use client'
import { useState } from 'react'
import Link from 'next/link'

const N = '#0A1628'; const MG = '#566B66'; const BORDER = '#E8EDED'; const GR = '#F4F7F6'
const ACCENT = '#06B6D4'

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

const PIPELINE_STAGES = [
  {
    step: '01',
    title: 'Near Miss Capture',
    desc: 'Structured near miss reporting with severity classification, contributing factors, and affected systems. Raw event data enriched with contextual metadata.',
    detail: 'Raw event data',
    color: '#F97316',
  },
  {
    step: '02',
    title: 'HRO Alpha Calculation',
    desc: 'Weick & Sutcliffe five principles translated into measurable inputs. The alpha coefficient synthesizes near-miss rate, simplification score, and expertise deference index.',
    detail: 'α = f(NM rate, simplification score, expertise deference)',
    color: ACCENT,
  },
  {
    step: '03',
    title: 'URI Impact',
    desc: 'The calculated HRO Alpha feeds directly into the HFER-720 URI formula as the final multiplier — a high-reliability culture translates to a measurably lower risk score.',
    detail: 'α feeds directly into HFER-720 formula',
    color: '#10B981',
  },
]

export default function OmniHROPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) {
      const existing = JSON.parse(localStorage.getItem('omniHRO_waitlist') ?? '[]')
      localStorage.setItem('omniHRO_waitlist', JSON.stringify([...existing, { email, ts: new Date().toISOString() }]))
      setSubmitted(true)
    }
  }

  return (
    <div style={{ background:'#F8F9FA', fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:80, paddingLeft:48, paddingRight:48, background:N }}>
        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(6,182,212,0.15)',
            border:'1px solid rgba(6,182,212,0.3)', borderRadius:20, padding:'5px 16px', marginBottom:28 }}>
            <span style={{ fontSize:10, fontWeight:700, color:'#67E8F9', letterSpacing:1.5, textTransform:'uppercase' }}>Coming Soon</span>
          </div>
          <h1 style={{ fontSize:'clamp(32px,4.5vw,56px)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
            omniHRO —<br/>
            <span style={{ color:'#67E8F9' }}>High Reliability Organization Engine</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:18, lineHeight:1.7, maxWidth:600, margin:'0 auto 16px' }}>
            Near miss analysis, HRO Alpha scoring and reliability culture measurement —
            turning operational signals into resilience intelligence.
          </p>
          <p style={{ color:'rgba(6,182,212,0.7)', fontSize:13, fontWeight:600, marginBottom:48 }}>
            Based on Weick & Sutcliffe (2007) HRO framework · Novaces operational reliability methodology
          </p>

          {/* Waitlist form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@company.com"
                required
                style={{ padding:'13px 20px', borderRadius:8, border:'1px solid rgba(255,255,255,0.2)',
                  background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:14,
                  fontFamily:"'DM Sans',sans-serif", outline:'none', minWidth:280 }}
              />
              <button
                type="submit"
                style={{ padding:'13px 28px', background:ACCENT, color:'#fff', border:'none',
                  borderRadius:8, fontWeight:700, fontSize:14, cursor:'pointer',
                  fontFamily:"'DM Sans',sans-serif" }}>
                Join Waitlist →
              </button>
            </form>
          ) : (
            <div style={{ background:'rgba(6,182,212,0.15)', border:'1px solid rgba(6,182,212,0.3)',
              borderRadius:12, padding:'16px 32px', display:'inline-block', color:'#67E8F9', fontWeight:600 }}>
              You are on the list! We will notify you at launch.
            </div>
          )}
        </div>
      </section>

      {/* HRO PIPELINE — 3 connected stages */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <h2 style={{ fontSize:28, fontWeight:700, color:N, textAlign:'center', marginBottom:16 }}>
            From Near Miss to URI Score
          </h2>
          <p style={{ fontSize:16, color:MG, textAlign:'center', marginBottom:52, maxWidth:480, margin:'0 auto 52px' }}>
            Three stages transform raw operational signals into a measurable resilience coefficient.
          </p>

          {/* Connected boxes */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr auto 1fr', gap:0, alignItems:'center' }}>
            {PIPELINE_STAGES.map((stage, i) => (
              <>
                <div key={stage.step} style={{ background:'#fff', border:`1px solid ${BORDER}`,
                  borderRadius:16, padding:'28px 24px', borderTop:`3px solid ${stage.color}`,
                  position:'relative' }}>
                  <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
                    width:32, height:32, borderRadius:8, background:`${stage.color}20`,
                    marginBottom:16 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:stage.color,
                      fontFamily:'DM Mono,monospace' }}>{stage.step}</span>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:N, marginBottom:10 }}>{stage.title}</h3>
                  <p style={{ fontSize:13, color:MG, lineHeight:1.7, marginBottom:16 }}>{stage.desc}</p>
                  <div style={{ background:`${stage.color}10`, border:`1px solid ${stage.color}30`,
                    borderRadius:6, padding:'6px 12px' }}>
                    <span style={{ fontSize:11, color:stage.color, fontWeight:600,
                      fontFamily:'DM Mono,monospace' }}>{stage.detail}</span>
                  </div>
                </div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <div key={`arrow-${i}`} style={{ display:'flex', alignItems:'center', justifyContent:'center',
                    padding:'0 12px' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <div style={{ width:32, height:2, background:`${BORDER}` }} />
                      <span style={{ fontSize:16, color:MG }}>→</span>
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* HRO 5 PRINCIPLES */}
      <section style={{ padding:'72px 48px', background:'#fff', borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <h2 style={{ fontSize:26, fontWeight:700, color:N, textAlign:'center', marginBottom:12 }}>
            The 5 HRO Principles (Weick & Sutcliffe, 2007)
          </h2>
          <p style={{ fontSize:15, color:MG, textAlign:'center', marginBottom:48, maxWidth:500, margin:'0 auto 48px' }}>
            omniHRO operationalizes each principle into a measurable score that feeds the alpha coefficient.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16 }}>
            {[
              { num: '1', label: 'Preoccupation with Failure', short: 'Near miss tracking & weak signal detection' },
              { num: '2', label: 'Reluctance to Simplify', short: 'Complexity indicators & assumption audits' },
              { num: '3', label: 'Sensitivity to Operations', short: 'Frontline signal amplification rate' },
              { num: '4', label: 'Commitment to Resilience', short: 'Recovery speed & workaround capability' },
              { num: '5', label: 'Deference to Expertise', short: 'Expert escalation & decision authority mapping' },
            ].map(p => (
              <div key={p.num} style={{ background:GR, border:`1px solid ${BORDER}`,
                borderRadius:12, padding:'20px 16px', textAlign:'center' }}>
                <div style={{ fontSize:28, fontWeight:800, color:ACCENT, fontFamily:'DM Mono,monospace',
                  lineHeight:1, marginBottom:12 }}>{p.num}</div>
                <h4 style={{ fontSize:12, fontWeight:700, color:N, marginBottom:8, lineHeight:1.4 }}>{p.label}</h4>
                <p style={{ fontSize:11, color:MG, lineHeight:1.6 }}>{p.short}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERENCE */}
      <section style={{ padding:'32px 48px', background:GR, borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:12, color:MG, fontStyle:'italic', lineHeight:1.8 }}>
            Based on Weick, K.E. & Sutcliffe, K.M. (2007). <em>Managing the Unexpected: Resilient Performance in an Age of Uncertainty.</em> Jossey-Bass. ·
            Novaces Operational Reliability Methodology (2012). · HFER-720 URI formula © Omniversel 2026.
          </p>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section style={{ padding:'72px 48px', background:'#F8F9FA' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:28, fontWeight:700, color:N, marginBottom:48 }}>What omniHRO will deliver</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[
              { label: 'Near Miss Database', desc: 'Structured repository with taxonomy, severity, causal chains and corrective actions.' },
              { label: 'Culture Pulse Survey', desc: 'Validated 24-item HRO culture survey deployed to frontline staff quarterly.' },
              { label: 'URI Feed Integration', desc: 'Alpha coefficient updated in real-time, flowing directly into your HFER-720 risk scores.' },
            ].map(item => (
              <div key={item.label} style={{ background:'#fff', border:`1px solid ${BORDER}`,
                borderRadius:12, padding:'24px 20px', textAlign:'left', borderTop:`3px solid ${ACCENT}` }}>
                <h4 style={{ fontSize:14, fontWeight:700, color:N, marginBottom:8 }}>{item.label}</h4>
                <p style={{ fontSize:13, color:MG, lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · omniHRO · High Reliability Organization Engine · Coming Soon</p>
      </footer>
    </div>
  )
}
