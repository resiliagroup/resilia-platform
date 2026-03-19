'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import OmniverselLogo from '@/components/OmniverselLogo'

const N = '#0A1628'; const T = '#2D8A87'; const G = '#E8C97A'
const GR = '#F4F7F6'; const MG = '#566B66'; const BG = '#FFFFFF'; const BORDER = '#E8EDED'
const R_R = '#E30613'; const R_O = '#E56A04'; const R_Y = '#FFC801'; const R_G = '#2D8A87'

export default function MethodologyPage() {
  const [activeTab, setActiveTab] = useState<'hfer' | 'hro' | 'toc' | 'fema'>('hfer')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
      `}</style>

      <header style={{ position:'sticky', top:0, zIndex:100, height:64, background:'rgba(255,255,255,0.97)',
        backdropFilter:'blur(12px)', borderBottom:`1px solid ${BORDER}`,
        display:'flex', alignItems:'center', padding:'0 48px' }}>
        <div style={{ maxWidth:1200, width:'100%', margin:'0 auto',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/"><OmniverselLogo width={200} height={50} light /></Link>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:6, color:MG, fontSize:14, fontWeight:500,
            padding:'8px 16px', borderRadius:8, border:`1px solid ${BORDER}`, transition:'all .18s' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3M7 11l-4-4 4-4" stroke={MG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Home
          </Link>
        </div>
      </header>

      <section style={{ background:`linear-gradient(135deg, ${N} 0%, #0F2847 100%)`,
        padding:'80px 48px 64px', textAlign:'center' }}>
        <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
          textTransform:'uppercase', marginBottom:16 }}>Scientific Methodology</p>
        <h1 style={{ color:'#fff', fontSize:'clamp(32px,4.5vw,56px)', fontWeight:700,
          lineHeight:1.1, marginBottom:20, maxWidth:800, margin:'0 auto 20px' }}>
          HFER-720 &amp; Agile<br/>
          <span style={{ color:T }}>Resilience Framework</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:17, lineHeight:1.8,
          maxWidth:600, margin:'0 auto 40px' }}>
          TOC bottleneck analysis, HRO field sensitivity, Lean financial focus and
          FEMA Core Capabilities — integrated in one academic methodology.
        </p>
        <div style={{ display:'inline-block', background:'rgba(255,255,255,0.06)',
          border:`1.5px solid ${T}50`, borderRadius:16, padding:'20px 32px' }}>
          <span style={{ fontSize:'clamp(16px,2.2vw,24px)', fontWeight:800,
            fontFamily:'DM Mono,monospace', color:'#fff', letterSpacing:1 }}>
            URI = (H × F × E × B) / (1 + k(s,t) × C²) × HRO_α
          </span>
        </div>
      </section>

      <section style={{ background:GR, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', overflowX:'auto' }}>
          {([
            { key:'hfer', label:'HFER-720 Formula' },
            { key:'hro',  label:'HRO Methodology' },
            { key:'toc',  label:'TOC Bottleneck Analysis' },
            { key:'fema', label:'FEMA Core Capabilities' },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ flexShrink:0, padding:'18px 28px', border:'none', background:'transparent',
                fontSize:14, fontWeight:activeTab===tab.key?700:500,
                color:activeTab===tab.key?T:MG, cursor:'pointer',
                borderBottom:activeTab===tab.key?`2px solid ${T}`:'2px solid transparent',
                fontFamily:"'DM Sans',sans-serif", transition:'all .18s', whiteSpace:'nowrap' as const }}>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ padding:'64px 48px', background:BG }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>

          {activeTab === 'hfer' && (
            <div>
              <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
                textTransform:'uppercase', marginBottom:12 }}>omniRISK Core Model</p>
              <h2 style={{ color:N, fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
                lineHeight:1.15, marginBottom:16 }}>
                HFER-720: Unified Risk Index
              </h2>
              <p style={{ color:MG, fontSize:16, lineHeight:1.85, maxWidth:680, marginBottom:48 }}>
                Developed in collaboration with ITU AYM, the HFER-720 model integrates hazard (H),
                fragility (F), exposure (E) and capacity (C²) components with sector calibration
                to produce a facility-level Unified Risk Index (URI).
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
                gap:20, marginBottom:56 }}>
                {[
                  { sym:'H', name:'Hazard', color:R_R, desc:'Seismic zone, flood area, NATECH hazard density and recurrence periods.' },
                  { sym:'F', name:'Fragility', color:R_O, desc:'Structural weakness, personnel dependency and single-point-of-failure risk.' },
                  { sym:'E', name:'Exposure', color:R_Y, desc:'Affected population, critical asset concentration and service dependency depth.' },
                  { sym:'B', name:'Bottleneck', color:'#8B5CF6', desc:'TOC-based constraint point that can lock the entire system — chain-break risk.' },
                  { sym:'C²', name:'Capacity', color:R_G, desc:'Preparedness, response and recovery capacity with exponential (nonlinear) contribution.' },
                  { sym:'k(s,t)', name:'Sector Factor', color:T, desc:'Calibration by sector and hazard type. Health-NATECH: k=3.5 · Finance-Cyber: k=5.1' },
                  { sym:'HRO_α', name:'HRO Multiplier', color:'#F97316', desc:'Resilience multiplier exceeding 1.0 driven by near-miss reporting and drill completion.' },
                ].map(f => (
                  <div key={f.sym} style={{ background:GR, border:`1px solid ${BORDER}`,
                    borderTop:`4px solid ${f.color}`, borderRadius:12, padding:'24px 20px' }}>
                    <div style={{ fontSize:28, fontWeight:800, fontFamily:'DM Mono,monospace',
                      color:f.color, marginBottom:10 }}>{f.sym}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:N, marginBottom:8 }}>{f.name}</div>
                    <p style={{ fontSize:13, color:MG, lineHeight:1.7 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ background:GR, border:`1px solid ${BORDER}`, borderRadius:16,
                padding:'32px', marginBottom:48 }}>
                <h3 style={{ color:N, fontSize:18, fontWeight:700, marginBottom:24 }}>
                  k(s,t) Sector × Hazard Calibration Matrix
                </h3>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                    <thead>
                      <tr style={{ background:N, color:'#fff' }}>
                        {['Sector','Earthquake','Flood','NATECH','Cyber','Operational'].map(h => (
                          <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontWeight:600, fontSize:12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Banking',     '2.1','1.8','1.5','5.1','4.2'],
                        ['Health',      '3.8','2.9','3.5','2.8','3.1'],
                        ['Industry',    '2.6','3.1','4.8','2.2','2.4'],
                        ['Public',      '3.2','3.4','2.8','3.0','2.6'],
                        ['Education',   '3.0','2.6','1.9','1.8','2.0'],
                        ['Crit. Infra.','4.1','3.8','4.2','4.5','3.8'],
                      ].map((row, i) => (
                        <tr key={i} style={{ background:i%2===0?BG:GR }}>
                          {row.map((cell, j) => (
                            <td key={j} style={{ padding:'10px 14px', color:j===0?N:T,
                              fontWeight:j===0?600:700,
                              fontFamily:j>0?'DM Mono,monospace':'inherit',
                              borderBottom:`1px solid ${BORDER}` }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ background:`${T}08`, border:`1px solid ${T}25`, borderRadius:12, padding:'24px 28px' }}>
                <p style={{ fontSize:12, fontWeight:700, color:T, letterSpacing:2,
                  textTransform:'uppercase', marginBottom:14 }}>Academic References</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    'UNDRR (2015). Sendai Framework for Disaster Risk Reduction 2015–2030. United Nations.',
                    'ISO 22301:2019. Business Continuity Management Systems – Requirements.',
                    'ISO 31000:2018. Risk Management – Guidelines.',
                    'Goldratt, E.M. (1984). The Goal: A Process of Ongoing Improvement. Theory of Constraints.',
                    'Weick, K.E. & Sutcliffe, K.M. (2007). Managing the Unexpected: Resilient Performance in an Age of Uncertainty.',
                    'FEMA (2019). National Preparedness Goal – Core Capabilities. U.S. Department of Homeland Security.',
                    'RAPID-N (2021). Natech Risk Assessment and Management Tool. European Commission JRC.',
                  ].map((ref, i) => (
                    <div key={i} style={{ display:'flex', gap:10 }}>
                      <span style={{ color:T, fontWeight:700, flexShrink:0, fontSize:12,
                        fontFamily:'DM Mono,monospace', marginTop:2 }}>[{i+1}]</span>
                      <span style={{ fontSize:13, color:MG, lineHeight:1.65 }}>{ref}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hro' && (
            <div>
              <p style={{ color:'#F97316', fontSize:12, fontWeight:700, letterSpacing:3,
                textTransform:'uppercase', marginBottom:12 }}>High Reliability Organization</p>
              <h2 style={{ color:N, fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
                lineHeight:1.15, marginBottom:16 }}>
                High Reliability Organization Theory
              </h2>
              <p style={{ color:MG, fontSize:16, lineHeight:1.85, maxWidth:680, marginBottom:48 }}>
                Derived by Weick &amp; Sutcliffe (2007) from analysis of nuclear energy, aviation and
                naval operations, HRO methodology measures the capacity to manage unexpected events
                through five core principles.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24, marginBottom:48 }}>
                {[
                  { no:'01', title:'Preoccupation with Failure', color:'#F97316',
                    desc:'Small anomalies and near-miss events are systematically reported. The assumption of success is rejected; every signal is a potential warning.',
                    hro:'Preoccupation with Failure' },
                  { no:'02', title:'Reluctance to Simplify', color:R_R,
                    desc:'Complex situations are not reduced to a single explanation. Different perspectives are evaluated and contextual diversity is maintained.',
                    hro:'Reluctance to Simplify' },
                  { no:'03', title:'Sensitivity to Operations', color:R_O,
                    desc:'Real-time operational status is monitored. The situational awareness of field personnel is prioritized over hierarchy.',
                    hro:'Sensitivity to Operations' },
                  { no:'04', title:'Commitment to Resilience', color:R_G,
                    desc:'The capacity to rapidly adapt to unexpected situations is developed. Authority is delegated to expert personnel, not surrendered to ritual procedures.',
                    hro:'Commitment to Resilience' },
                  { no:'05', title:'Deference to Expertise', color:T,
                    desc:'In a crisis, expertise — not hierarchy — takes precedence. Decision authority is delegated to the person closest to the issue.',
                    hro:'Deference to Expertise' },
                ].map(p => (
                  <div key={p.no} style={{ background:GR, border:`1px solid ${BORDER}`,
                    borderLeft:`4px solid ${p.color}`, borderRadius:12, padding:'28px 24px' }}>
                    <div style={{ fontSize:32, fontWeight:800, color:`${p.color}30`,
                      fontFamily:'DM Mono,monospace', lineHeight:1, marginBottom:8 }}>{p.no}</div>
                    <div style={{ fontSize:16, fontWeight:700, color:N, marginBottom:6 }}>{p.title}</div>
                    <div style={{ fontSize:10, fontWeight:600, color:p.color, letterSpacing:1,
                      textTransform:'uppercase', marginBottom:12 }}>{p.hro}</div>
                    <p style={{ fontSize:13, color:MG, lineHeight:1.75 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ background:`${'#F97316'}0D`, border:`1px solid ${'#F97316'}30`,
                borderRadius:12, padding:'24px 28px' }}>
                <p style={{ fontSize:14, fontWeight:600, color:N, lineHeight:1.75 }}>
                  <strong style={{ color:'#F97316' }}>HRO_α Multiplier:</strong>{' '}
                  Calculated from near-miss reporting rate, drill completion score and command maturity
                  values in the platform. When HRO_α exceeds 1.0, it acts as a risk-reducing multiplier
                  in the URI formula. An organization with zero near-miss reports gets α = 1.20
                  (high but invisible risk). An active reporting organization gets α = 0.85
                  (risk systematically under control).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'toc' && (
            <div>
              <p style={{ color:R_R, fontSize:12, fontWeight:700, letterSpacing:3,
                textTransform:'uppercase', marginBottom:12 }}>Theory of Constraints</p>
              <h2 style={{ color:N, fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
                lineHeight:1.15, marginBottom:16 }}>
                TOC Bottleneck Analysis
              </h2>
              <p style={{ color:MG, fontSize:16, lineHeight:1.85, maxWidth:680, marginBottom:48 }}>
                Goldratt&apos;s (1984) Theory of Constraints addresses the inadequacy of traditional
                approaches that treat 500 risks with equal weight. By identifying the single constraint
                point that will lock the system, resource allocation is maximized.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',
                gap:20, marginBottom:48 }}>
                {[
                  { step:'1', title:'Identify the Constraint', color:R_R, desc:'Identify the single bottleneck that most limits system throughput across the facility network. B (Bottleneck) score is auto-calculated.' },
                  { step:'2', title:'Exploit the Constraint', color:R_O, desc:'Maximize the use of existing bottleneck capacity at full efficiency. Optimize output with existing resources before additional investment.' },
                  { step:'3', title:'Subordinate Everything Else', color:R_Y, desc:'Adjust all non-constraint processes to the speed of the bottleneck. System optimization rather than local optimization.' },
                  { step:'4', title:'Elevate the Constraint', color:R_G, desc:'Eliminate the bottleneck through necessary investment and action plans. Manage with 15-day action cycles via omniSPRINT.' },
                  { step:'5', title:'Repeat', color:T, desc:'When the old bottleneck is resolved, the system finds a new constraint. Continuous improvement cycle increases HRO maturity.' },
                ].map(s => (
                  <div key={s.step} style={{ background:GR, border:`1px solid ${BORDER}`,
                    borderRadius:12, padding:'24px 20px', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:12, right:16, fontSize:48, fontWeight:800,
                      color:`${s.color}15`, fontFamily:'DM Mono,monospace', lineHeight:1 }}>{s.step}</div>
                    <div style={{ width:32, height:32, borderRadius:8, background:`${s.color}14`,
                      border:`2px solid ${s.color}30`, display:'flex', alignItems:'center',
                      justifyContent:'center', marginBottom:14 }}>
                      <span style={{ fontSize:14, fontWeight:800, color:s.color, fontFamily:'DM Mono,monospace' }}>{s.step}</span>
                    </div>
                    <div style={{ fontSize:15, fontWeight:700, color:N, marginBottom:8 }}>{s.title}</div>
                    <p style={{ fontSize:13, color:MG, lineHeight:1.7, position:'relative', zIndex:1 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ background:`${R_R}0D`, border:`1px solid ${R_R}30`,
                borderRadius:12, padding:'24px 28px' }}>
                <p style={{ fontSize:14, fontWeight:600, color:N, lineHeight:1.75 }}>
                  <strong style={{ color:R_R }}>Application in omniRISK:</strong>{' '}
                  The B (Bottleneck) parameter automatically identifies the single failure point
                  (Single Point of Failure) within the facility network that would halt the entire system.
                  Dependency chain analysis is calculated using a graph algorithm that models cascade effects
                  including supply chain and critical infrastructure connections.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'fema' && (
            <div>
              <p style={{ color:'#3B7EC8', fontSize:12, fontWeight:700, letterSpacing:3,
                textTransform:'uppercase', marginBottom:12 }}>FEMA National Preparedness Goal</p>
              <h2 style={{ color:N, fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
                lineHeight:1.15, marginBottom:16 }}>
                32 Core Capabilities Framework
              </h2>
              <p style={{ color:MG, fontSize:16, lineHeight:1.85, maxWidth:680, marginBottom:48 }}>
                The 32 Core Capability areas of FEMA&apos;s (2019) National Preparedness Goal form
                the backbone of omniRISK&apos;s Manageability (C) dimension.
                HIFYEA question sets are designed according to this framework.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
                gap:24, marginBottom:48 }}>
                {[
                  { faz:'Prevention', color:'#15803D', icon:'/icons/fema/Icon_PREVENT_01_Planning.png',
                    desc:'Detect, deter and stop threats before they occur.',
                    caps:[
                      { icon:'/icons/fema/Icon_PREVENT_01_Planning.png',     label:'Planning' },
                      { icon:'/icons/fema/Icon_PREVENT_04_Intelligence.png', label:'Intelligence & Information Sharing' },
                      { icon:'/icons/fema/Icon_PREVENT_05_Interdiction.png', label:'Interdiction & Disruption' },
                      { icon:'/icons/fema/Icon_PREVENT_06_Screening.png',    label:'Screening, Search & Detection' },
                    ] },
                  { faz:'Protection', color:'#0F766E', icon:'/icons/fema/Icon_PROTECT_08_Cyber.png',
                    desc:'Safeguard the homeland against acts of terrorism and man-made or natural disasters.',
                    caps:[
                      { icon:'/icons/fema/Icon_PROTECT_08_Cyber.png',    label:'Cybersecurity' },
                      { icon:'/icons/fema/Icon_PROTECT_09_Physical.png', label:'Physical Protective Measures' },
                      { icon:'/icons/fema/Icon_PROTECT_11_Supply.png',   label:'Supply Chain Integrity' },
                      { icon:'/icons/fema/Icon_PROTECT_10_Risk.png',     label:'Risk Management' },
                    ] },
                  { faz:'Mitigation', color:'#B45309', icon:'/icons/fema/Icon_MIT_06_Risk.png',
                    desc:'Reduce loss of life and property by lessening the impact of disasters.',
                    caps:[
                      { icon:'/icons/fema/Icon_MIT_06_Risk.png',      label:'Risk & Hazard Identification' },
                      { icon:'/icons/fema/Icon_MIT_04_Community.png', label:'Community Resilience' },
                      { icon:'/icons/fema/Icon_MIT_05_LongTerm.png',  label:'Long-Term Vulnerability Reduction' },
                      { icon:'/icons/fema/Icon_MIT_01_Planning.png',  label:'Mitigation Planning' },
                    ] },
                  { faz:'Response', color:'#C2410C', icon:'/icons/fema/Icon_RESP_12_OnScene.png',
                    desc:'Save lives, protect property and meet basic needs immediately after an incident.',
                    caps:[
                      { icon:'/icons/fema/Icon_RESP_12_OnScene.png',      label:'On-scene Security & Protection' },
                      { icon:'/icons/fema/Icon_RESP_15_Situational.png',  label:'Situational Assessment' },
                      { icon:'/icons/fema/Icon_RESP_14_PublicHealth.png', label:'Public Health & Medical' },
                      { icon:'/icons/fema/Icon_RESP_09_Logistics.png',    label:'Logistics & Supply Chain' },
                    ] },
                  { faz:'Recovery', color:'#B91C1C', icon:'/icons/fema/Icon_REC_04_Infrastructure.png',
                    desc:'Recover through timely restoration, strengthening and revitalization.',
                    caps:[
                      { icon:'/icons/fema/Icon_REC_04_Infrastructure.png', label:'Infrastructure Systems' },
                      { icon:'/icons/fema/Icon_REC_05_Econ.png',           label:'Economic Recovery' },
                      { icon:'/icons/fema/Icon_REC_06_Health.png',         label:'Health & Social Services' },
                      { icon:'/icons/fema/Icon_REC_08_Natural.png',        label:'Natural & Cultural Resources' },
                    ] },
                ].map(f => (
                  <div key={f.faz} style={{ background:GR, border:`1px solid ${BORDER}`,
                    borderRadius:16, padding:'28px', borderTop:`4px solid ${f.color}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                      <img src={f.icon} alt={f.faz} style={{ width:36, height:36, objectFit:'contain' }}/>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:f.color,
                          letterSpacing:2, textTransform:'uppercase' }}>FEMA Mission Area</div>
                        <div style={{ fontSize:18, fontWeight:700, color:N }}>{f.faz}</div>
                      </div>
                    </div>
                    <p style={{ fontSize:13, color:MG, lineHeight:1.7, marginBottom:16 }}>{f.desc}</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {f.caps.map(c => (
                        <div key={c.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <img src={c.icon} alt={c.label} style={{ width:20, height:20, objectFit:'contain', flexShrink:0 }}/>
                          <span style={{ fontSize:12, color:N, fontWeight:500 }}>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:`${'#3B7EC8'}0D`, border:`1px solid ${'#3B7EC8'}30`,
                borderRadius:12, padding:'24px 28px' }}>
                <p style={{ fontSize:14, fontWeight:600, color:N, lineHeight:1.75 }}>
                  <strong style={{ color:'#3B7EC8' }}>HIFYEA Integration:</strong>{' '}
                  The Manageability section of Banking and Industry HIFYEA question sets is directly
                  mapped to FEMA Core Capabilities phases: Y1-Y6 Prevention,
                  Y7-Y13 Protection, Y14-Y23 Mitigation, Y24-Y36 Response, Y37-Y45 Recovery.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ background:N, padding:'64px 48px', textAlign:'center' }}>
        <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
          textTransform:'uppercase', marginBottom:16 }}>Access the Platform</p>
        <h2 style={{ color:'#fff', fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
          lineHeight:1.15, marginBottom:20 }}>
          Download Methodology Documents
        </h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, lineHeight:1.75,
          maxWidth:480, margin:'0 auto 40px' }}>
          HFER-720 technical documentation, sector calibration guide and
          HIFYEA question set design methodology.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:15,
            padding:'14px 36px', borderRadius:8, display:'inline-block', transition:'opacity .18s' }}>
            Platform Login
          </Link>
          <a href="mailto:info@omniversel.com" style={{ border:'1.5px solid rgba(255,255,255,0.2)',
            color:'rgba(255,255,255,0.72)', fontWeight:600, fontSize:15, padding:'13px 32px',
            borderRadius:8, display:'inline-block', transition:'border-color .18s' }}>
            Technical Inquiry
          </a>
        </div>
      </section>
    </>
  )
}
