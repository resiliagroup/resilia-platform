'use client'
import React from 'react'
import Link from 'next/link'
import OmniverselLogo from '@/components/OmniverselLogo'

const N = '#0A1628'; const T = '#2D8A87'
const GR = '#F4F7F6'; const MG = '#566B66'; const BG = '#FFFFFF'; const BORDER = '#E8EDED'
const R_R = '#E30613'; const R_O = '#E56A04'; const R_Y = '#FFC801'

const blogPosts = [
  {
    category: 'Methodology', categoryColor: T,
    title: 'Quantitative Risk Scoring: A Multi-Parameter Approach',
    summary: 'How multi-dimensional scoring integrates hazard exposure, structural fragility, operational capacity and supply-chain bottlenecks into a single actionable resilience index.',
    readTime: '8 min', date: 'March 2026', tag: 'Risk Assessment',
  },
  {
    category: 'Concept', categoryColor: R_O,
    title: 'What is NATECH? Natural Hazard Triggered Technological Accidents',
    summary: 'Secondary accidents triggered in industrial facilities after earthquakes and floods, the RAPID-N methodology and NATECH risk mapping in industrial zones.',
    readTime: '6 min', date: 'February 2026', tag: 'NATECH',
  },
  {
    category: 'Policy', categoryColor: '#7B5EA7',
    title: 'Sendai Framework and Municipalities: Practical Implementation',
    summary: 'Discover the 4 priorities of the 2015–2030 Sendai Framework, practical implementation steps for municipalities, and how to track Sendai compliance with omniRISK.',
    readTime: '10 min', date: 'January 2026', tag: 'Sendai',
  },
  {
    category: 'HRO', categoryColor: '#F97316',
    title: 'Near-Miss Culture: Small Signals Predict Major Failures',
    summary: 'How Weick & Sutcliffe\'s HRO methodology is adapted to organizations, how the near-miss reporting cycle improves the HRO_α multiplier, and sector-specific examples.',
    readTime: '7 min', date: 'December 2025', tag: 'HRO',
  },
  {
    category: 'Case Study', categoryColor: R_R,
    title: 'Banking Sector BCM: BDDK Guidelines & Basel III Integration',
    summary: 'BCP preparation under the BDDK Business Continuity Management Guideline, Basel III operational risk matrix and the design logic of the HIFYEA banking question set.',
    readTime: '9 min', date: 'November 2025', tag: 'Banking',
  },
  {
    category: 'Case Study', categoryColor: T,
    title: 'Beylikdüzü Pilot: HFER Scoring Across 782 Facilities',
    summary: 'Findings from the implementation project covering 10 neighborhoods, 6 sectors and 782 facilities: 103 critical facilities, NATECH risk map and Sendai compliance improvement.',
    readTime: '12 min', date: 'October 2025', tag: 'Case Study',
  },
]

const caseStudies = [
  {
    sehir: 'Beylikdüzü, Istanbul',
    sektor: 'Multi-Sector Urban',
    baslik: 'Urban Resilience Scoring — Multi-Sector Assessment',
    metrikler: [
      { v:'782', l:'Facilities Scored' },
      { v:'103', l:'Critical Risk Flagged' },
      { v:'+34%', l:'Sendai Compliance Gain' },
    ],
    detay: '10 neighborhoods · 6 sectors · CBS-integrated mapping · NATECH hotspot identification',
    tarih: 'Q4 2025',
    renk: T,
  },
  {
    sehir: 'Major Turkish Bank',
    sektor: 'Banking & Finance',
    baslik: 'HIFYEA v2.0 Banking Assessment',
    metrikler: [
      { v:'73', l:'Questions Evaluated' },
      { v:'BDDK', l:'Regulatory Aligned' },
      { v:'Basel III', l:'Op-Risk Mapped' },
    ],
    detay: 'Full BDDK ISP alignment · Basel III operational risk matrix · FEMA phase mapping',
    tarih: 'Q1 2026',
    renk: '#1565C0',
  },
  {
    sehir: 'District Hospital Group',
    sektor: 'Health & Hospital',
    baslik: 'Critical Care Continuity Assessment',
    metrikler: [
      { v:'ISO', l:'22301 Aligned' },
      { v:'HAP', l:'Standard Met' },
      { v:'-28%', l:'Vulnerability Reduction' },
    ],
    detay: 'Sendai SF-3 alignment · OES integration · Medical infrastructure BIA',
    tarih: 'Q2 2026',
    renk: '#C62828',
  },
]

const reports = [
  { title:'Organizational Resilience Assessment Guide', size:'2.4 MB', pages:'48', tag:'Whitepaper',  icon:'/icons/fema/Icon_MIT_06_Risk.png' },
  { title:'Banking Sector BCM Assessment Guide',        size:'1.8 MB', pages:'36', tag:'Framework',  icon:'/icons/fema/Icon_PROTECT_10_Risk.png' },
  { title:'International Standards Alignment Guide',    size:'3.1 MB', pages:'64', tag:'Reference',   icon:'/icons/fema/Icon_PREVENT_01_Planning.png' },
  { title:'NATECH Risk Assessment Methodology',         size:'2.0 MB', pages:'52', tag:'Methodology', icon:'/icons/fema/Icon_RESP_08_Fire.png' },
]

export default function ResourcesPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:${GR};color:${N}}
        a{text-decoration:none;color:inherit}
        .blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        @media(max-width:1100px){.blog-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.blog-grid{grid-template-columns:1fr}}
        .case-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        @media(max-width:900px){.case-grid{grid-template-columns:1fr}}
      `}</style>

      <nav style={{ position:'sticky', top:0, zIndex:100, background:N,
        borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 40px',
        height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <OmniverselLogo />
        <Link href="/" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600,
          color:'#FFFFFF', textDecoration:'none', display:'flex', alignItems:'center', gap:6,
          opacity:0.85, transition:'opacity 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.opacity='1')}
          onMouseLeave={e => (e.currentTarget.style.opacity='0.85')}>
          ← Home
        </Link>
      </nav>

      <section style={{ background:N, padding:'72px 40px 64px', textAlign:'center' }}>
        <span style={{ fontSize:12, fontWeight:700, color:T, letterSpacing:'0.14em',
          textTransform:'uppercase', display:'block', marginBottom:18 }}>KNOWLEDGE BASE</span>
        <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:800, color:'#FFFFFF',
          lineHeight:1.15, marginBottom:20, maxWidth:700, margin:'0 auto 20px' }}>
          Resources &amp; Research
        </h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,0.65)', maxWidth:560,
          margin:'0 auto', lineHeight:1.7 }}>
          Technical reports, case studies and methodology articles from the Omniversel team.
        </p>
      </section>

      {/* Blog posts */}
      <section style={{ maxWidth:1280, margin:'0 auto', padding:'60px 40px 0' }}>
        <h2 style={{ fontSize:24, fontWeight:700, color:N, marginBottom:32 }}>Latest Articles</h2>
        <div className="blog-grid">
          {blogPosts.map((post, i) => (
            <div key={i} style={{ background:BG, borderRadius:12, overflow:'hidden',
              border:`1px solid ${BORDER}`, boxShadow:'0 2px 8px rgba(10,22,40,.05)',
              display:'flex', flexDirection:'column' }}>
              <div style={{ padding:'24px 24px 0' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:post.categoryColor,
                    background:`${post.categoryColor}14`, padding:'3px 10px', borderRadius:20,
                    letterSpacing:0.5 }}>{post.category}</span>
                  <span style={{ fontSize:11, color:MG }}>{post.readTime} read · {post.date}</span>
                </div>
                <h3 style={{ fontSize:16, fontWeight:700, color:N, marginBottom:10, lineHeight:1.4 }}>{post.title}</h3>
                <p style={{ fontSize:13, color:MG, lineHeight:1.65, marginBottom:16 }}>{post.summary}</p>
              </div>
              <div style={{ padding:'0 24px 20px', marginTop:'auto' }}>
                <span style={{ display:'inline-block', fontSize:11, fontWeight:600, color:T,
                  background:`${T}10`, border:`1px solid ${T}25`, borderRadius:4,
                  padding:'2px 8px', marginRight:8 }}>{post.tag}</span>
                <span style={{ fontSize:12, color:T, fontWeight:600, cursor:'pointer' }}>Read →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section style={{ maxWidth:1280, margin:'0 auto', padding:'60px 40px 0' }}>
        <h2 style={{ fontSize:24, fontWeight:700, color:N, marginBottom:32 }}>Case Studies</h2>
        <div className="case-grid">
          {caseStudies.map((cs, i) => (
            <div key={i} style={{ background:BG, borderRadius:16, border:`1px solid ${BORDER}`,
              borderTop:`4px solid ${cs.renk}`, padding:'28px',
              boxShadow:'0 2px 8px rgba(10,22,40,.05)' }}>
              <div style={{ fontSize:10, fontWeight:700, color:cs.renk, letterSpacing:1.5,
                textTransform:'uppercase', marginBottom:6 }}>{cs.sektor}</div>
              <div style={{ fontSize:12, color:MG, marginBottom:12 }}>{cs.sehir}</div>
              <h3 style={{ fontSize:17, fontWeight:700, color:N, marginBottom:20 }}>{cs.baslik}</h3>
              <div style={{ display:'flex', gap:10, marginBottom:20 }}>
                {cs.metrikler.map((m, j) => (
                  <div key={j} style={{ flex:1, textAlign:'center', background:GR,
                    borderRadius:8, padding:'10px 6px', borderTop:`2px solid ${cs.renk}` }}>
                    <div style={{ fontSize:18, fontWeight:800, color:cs.renk,
                      fontFamily:'DM Mono,monospace' }}>{m.v}</div>
                    <div style={{ fontSize:9, color:MG, fontWeight:600, marginTop:4,
                      textTransform:'uppercase', letterSpacing:0.3 }}>{m.l}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:12, color:MG, lineHeight:1.6, marginBottom:14 }}>{cs.detay}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:11, color:MG }}>{cs.tarih}</span>
                <span style={{ fontSize:12, color:T, fontWeight:600, cursor:'pointer' }}>View Case →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reports */}
      <section style={{ maxWidth:1280, margin:'0 auto', padding:'60px 40px' }}>
        <h2 style={{ fontSize:24, fontWeight:700, color:N, marginBottom:32 }}>Reports &amp; Whitepapers</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
          {reports.map((r, i) => (
            <div key={i} style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:12,
              padding:'20px 22px', display:'flex', alignItems:'center', gap:16,
              boxShadow:'0 1px 4px rgba(10,22,40,.04)', cursor:'pointer',
              transition:'box-shadow .18s, border-color .18s' }}>
              <img src={r.icon} alt={r.title} style={{ width:40, height:40, objectFit:'contain', flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:10, fontWeight:700, color:T, letterSpacing:1,
                  textTransform:'uppercase', marginBottom:4 }}>{r.tag}</div>
                <div style={{ fontSize:14, fontWeight:600, color:N, lineHeight:1.35,
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.title}</div>
                <div style={{ fontSize:11, color:MG, marginTop:3 }}>{r.pages} pages · {r.size}</div>
              </div>
              <div style={{ fontSize:18, color:T, flexShrink:0 }}>↓</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:T, padding:'64px 40px', textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, color:'#FFFFFF',
          marginBottom:16, lineHeight:1.2 }}>Ready to Get Started?</h2>
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:16, marginBottom:32, lineHeight:1.65 }}>
          Schedule a free demo and see how Omniversel maps to your sector requirements.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" style={{ background:'#FFFFFF', color:N, fontWeight:700, fontSize:15,
            padding:'14px 32px', borderRadius:8, display:'inline-block' }}>
            Free Demo
          </Link>
          <Link href="/methodology" style={{ border:'2px solid rgba(255,255,255,0.7)', color:'#FFFFFF',
            fontWeight:600, fontSize:15, padding:'13px 32px', borderRadius:8, display:'inline-block' }}>
            Methodology →
          </Link>
        </div>
      </section>
    </>
  )
}
