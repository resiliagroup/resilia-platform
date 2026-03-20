'use client'
import React from 'react'
import Link from 'next/link'
import OmniverselLogo from '@/components/OmniverselLogo'

const N = '#0A1628'; const T = '#2D8A87'
const GR = '#F4F7F6'; const MG = '#566B66'; const BG = '#FFFFFF'; const BORDER = '#E8EDED'

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:${BG};color:${N}}
        a{text-decoration:none;color:inherit}
      `}</style>

      <nav style={{ position:'sticky', top:0, zIndex:100, background:N,
        borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 40px',
        height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <OmniverselLogo />
        <Link href="/" style={{ fontSize:14, fontWeight:600, color:'#FFFFFF', display:'flex',
          alignItems:'center', gap:6, opacity:0.85, transition:'opacity 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity='1')}
          onMouseLeave={e => (e.currentTarget.style.opacity='0.85')}>
          ← Home
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ background:N, padding:'80px 40px 72px', textAlign:'center' }}>
        <span style={{ fontSize:12, fontWeight:700, color:T, letterSpacing:'0.14em',
          textTransform:'uppercase', display:'block', marginBottom:18 }}>ABOUT OMNIVERSEL</span>
        <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:800, color:'#FFFFFF',
          lineHeight:1.15, marginBottom:20, maxWidth:700, margin:'0 auto 20px' }}>
          Building Resilience Through Science
        </h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.65)', maxWidth:580,
          margin:'0 auto', lineHeight:1.7 }}>
          Omniversel is a resilience analytics company developing a resilience analytics platform —
          an academically grounded, operationally tested business continuity and disaster risk
          management system for multi-hazard environments.
        </p>
      </section>

      {/* Mission */}
      <section style={{ maxWidth:1100, margin:'0 auto', padding:'72px 40px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          <div>
            <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
              textTransform:'uppercase', marginBottom:16 }}>Our Mission</p>
            <h2 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:700, color:N,
              lineHeight:1.2, marginBottom:20 }}>
              Quantify Risk. Enable Resilience. Save Lives.
            </h2>
            <p style={{ color:MG, fontSize:16, lineHeight:1.85, marginBottom:20 }}>
              We believe that every organization — regardless of sector or size — deserves
              access to the same risk intelligence tools used by the world&apos;s most
              resilient institutions.
            </p>
            <p style={{ color:MG, fontSize:16, lineHeight:1.85 }}>
              The Omniversel platform was developed in collaboration with ITU AYM
              (Istanbul Technical University Disaster Management Center) and validated across
              real-world implementations in Istanbul, Beylikdüzü and multiple Turkish municipalities.
            </p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[
              { icon:'/icons/fema/Icon_PREVENT_01_Planning.png', title:'Academic Foundation', desc:'Grounded in peer-reviewed disaster risk science, international standards and field-validated methodology.' },
              { icon:'/icons/fema/Icon_RESP_15_Situational.png', title:'Field Validated', desc:'Tested across 782+ facilities in urban multi-hazard environments across metropolitan Istanbul.' },
              { icon:'/icons/fema/Icon_REC_05_Econ.png',         title:'Operationally Trusted', desc:'Applied across banking, healthcare, industrial and public sector organizations in Turkey.' },
            ].map((v, i) => (
              <div key={i} style={{ background:GR, border:`1px solid ${BORDER}`, borderRadius:12,
                padding:'20px', display:'flex', gap:16, alignItems:'flex-start' }}>
                <img src={v.icon} alt={v.title} style={{ width:36, height:36, objectFit:'contain', flexShrink:0, marginTop:2 }}/>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:N, marginBottom:6 }}>{v.title}</div>
                  <p style={{ fontSize:13, color:MG, lineHeight:1.65 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach + Partnership */}
      <section style={{ background:GR, borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`,
        padding:'72px 40px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64 }}>
          <div>
            <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
              textTransform:'uppercase', marginBottom:16 }}>Our Approach</p>
            <p style={{ color:MG, fontSize:16, lineHeight:1.85, marginBottom:20 }}>
              Omniversel is built on a fundamental conviction: that organizational resilience can be measured, not merely described. Our platform applies quantitative risk analysis methods — drawing from process safety, disaster science and business continuity management — to produce defensible, auditable resilience scores that support real decisions.
            </p>
            <p style={{ color:MG, fontSize:16, lineHeight:1.85 }}>
              We work across sectors where the cost of failure is high: critical infrastructure, healthcare, financial services and public administration. In each domain, we calibrate our methodology to the regulatory environment, hazard profile and operational structure of the institution — rather than applying a single generic framework.
            </p>
          </div>
          <div>
            <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
              textTransform:'uppercase', marginBottom:16 }}>Academic Partnership</p>
            <p style={{ color:MG, fontSize:16, lineHeight:1.85, marginBottom:20 }}>
              Omniversel was developed in collaboration with the Istanbul Technical University Disaster Management Research and Application Center (ITU AYM). Our methodology is grounded in peer-reviewed disaster risk science and validated through field implementations across urban multi-hazard environments.
            </p>
            <p style={{ color:MG, fontSize:16, lineHeight:1.85 }}>
              The platform has been applied across 782 facilities in metropolitan Istanbul, spanning banking, healthcare, industrial and public sector institutions. Each implementation contributes to a growing evidence base for quantitative urban resilience assessment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:T, padding:'64px 40px', textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, color:'#FFFFFF',
          marginBottom:16, lineHeight:1.2 }}>Start Your Resilience Journey</h2>
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:16, marginBottom:32, lineHeight:1.65 }}>
          Organizations that take resilience seriously choose Omniversel.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" style={{ background:'#FFFFFF', color:N, fontWeight:700, fontSize:15,
            padding:'14px 32px', borderRadius:8, display:'inline-block' }}>
            Request Demo
          </Link>
          <Link href="/methodology" style={{ border:'2px solid rgba(255,255,255,0.7)', color:'#FFFFFF',
            fontWeight:600, fontSize:15, padding:'13px 32px', borderRadius:8, display:'inline-block' }}>
            Our Methodology →
          </Link>
        </div>
      </section>
    </>
  )
}
