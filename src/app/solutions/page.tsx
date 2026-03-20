'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import OmniverselLogo from '@/components/OmniverselLogo'

const N = '#0A1628'; const T = '#2D8A87'
const GR = '#F4F7F6'; const MG = '#566B66'; const BG = '#FFFFFF'; const BORDER = '#E8EDED'

const SECTORS = [
  {
    title: 'Banking & Finance',
    icon: '/icons/fema/Icon_PROTECT_10_Risk.png',
    color: '#1565C0',
    desc: 'Operational risk inventory, ISP development and Basel III compliance-aligned institutional resilience. BDDK regulatory mapping included.',
    standards: ['ISO 22301', 'Basel III', 'BDDK'],
    femaIcons: ['/icons/fema/Icon_PROTECT_08_Cyber.png', '/icons/fema/Icon_RESP_04_Infrastructure.png'],
  },
  {
    title: 'Health & Hospital',
    icon: '/icons/fema/Icon_REC_06_Health.png',
    color: '#C62828',
    desc: 'Critical patient service continuity, medical infrastructure vulnerability assessment and emergency operations center integration.',
    standards: ['ISO 22301', 'Sendai SF-3', 'HAP'],
    femaIcons: ['/icons/fema/Icon_REC_06_Health.png', '/icons/fema/Icon_RESP_14_PublicHealth.png'],
  },
  {
    title: 'Industry & Manufacturing',
    icon: '/icons/fema/Icon_RESP_04_Infrastructure.png',
    color: '#E56A04',
    desc: 'NATECH cascade scenario analysis, supply chain disruption modeling and ALARP-principle risk intervention for industrial facilities.',
    standards: ['RAPID-N', 'ISO 31000', 'SEVESO'],
    femaIcons: ['/icons/fema/Icon_RESP_08_Fire.png', '/icons/fema/Icon_MIT_03_Operational.png'],
  },
  {
    title: 'Public & Municipality',
    icon: '/icons/fema/Icon_PREVENT_03_Op_Coord.png',
    color: '#2D8A87',
    desc: 'Urban-scale facility vulnerability assessment and investment planning aligned to Sendai Framework priorities and local government mandates.',
    standards: ['Sendai', 'omniRISK', 'Local Gov'],
    femaIcons: ['/icons/fema/Icon_PREVENT_03_Op_Coord.png', '/icons/fema/Icon_MIT_04_Community.png'],
  },
  {
    title: 'Education Institutions',
    icon: '/icons/fema/Icon_PROTECT_07_Access.png',
    color: '#3B7EC8',
    desc: 'School disaster risk management plans, drill management and resilience assessment under Sendai SF-2 framework for educational facilities.',
    standards: ['AFAD', 'MoNE', 'Sendai SF-2'],
    femaIcons: ['/icons/fema/Icon_PROTECT_07_Access.png', '/icons/fema/Icon_PREVENT_01_Planning.png'],
  },
  {
    title: 'Critical Infrastructure',
    icon: '/icons/fema/Icon_RESP_04_Infrastructure.png',
    color: '#FFC801',
    desc: 'N-1 analysis for energy, water and transport systems, dependency mapping and CIP standard compliance across interconnected networks.',
    standards: ['CIP', 'ISO 22301', 'SCADA'],
    femaIcons: ['/icons/fema/Icon_RESP_04_Infrastructure.png', '/icons/fema/Icon_REC_04_Infrastructure.png'],
  },
  {
    title: 'Tourism & Hospitality',
    icon: '/icons/fema/Icon_MIT_04_Community.png',
    color: '#7B5EA7',
    desc: 'Guest safety protocols, evacuation planning and seasonal business continuity plan development for hospitality operations.',
    standards: ['ISO 22301', 'NFPA 101', 'TÜRSAB'],
    femaIcons: ['/icons/fema/Icon_MIT_04_Community.png', '/icons/fema/Icon_RESP_02_Public.png'],
  },
  {
    title: 'Logistics & Supply Chain',
    icon: '/icons/fema/Icon_PROTECT_11_Supply.png',
    color: '#2D8A87',
    desc: 'Critical supplier vulnerability scoring, alternative route planning and supply chain resilience modeling for logistics networks.',
    standards: ['ISO 28000', 'ISO 22301', 'INCOTERMS'],
    femaIcons: ['/icons/fema/Icon_PROTECT_11_Supply.png', '/icons/fema/Icon_RESP_09_Logistics.png'],
  },
]

function SectorCard({ sector }: { sector: typeof SECTORS[number] }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: BG,
        border: `1px solid ${hovered ? T : BORDER}`,
        borderRadius: 12,
        borderTop: `4px solid ${sector.color}`,
        padding: '28px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 32px rgba(45,138,135,0.14)' : '0 2px 8px rgba(10,22,40,0.06)',
      }}>
      <div style={{ width: 44, height: 44 }}>
        <img src={sector.icon} alt={sector.title} style={{ width: 44, height: 44, objectFit: 'contain' }}/>
      </div>

      <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize: 17, fontWeight: 700, color: N, margin: 0, lineHeight: 1.3 }}>
        {sector.title}
      </h3>

      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize: 14, color: MG, margin: 0, lineHeight: 1.6, flexGrow: 1 }}>
        {sector.desc}
      </p>

      <div style={{ marginTop: 4 }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: T,
          letterSpacing: '0.01em', cursor: 'pointer' }}>
          View Details →
        </span>
      </div>
    </div>
  )
}

export default function SolutionsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:${GR}}
        .sector-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        @media(max-width:1100px){.sector-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.sector-grid{grid-template-columns:1fr}}
        .cta-buttons{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
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

      <section style={{ background:N, padding:'80px 40px 72px', textAlign:'center' }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color:T,
          letterSpacing:'0.14em', textTransform:'uppercase', display:'block', marginBottom:18 }}>
          SECTOR SOLUTIONS
        </span>
        <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(28px,5vw,48px)',
          fontWeight:800, color:'#FFFFFF', lineHeight:1.15, marginBottom:20,
          maxWidth:700, margin:'0 auto 20px' }}>
          Sector Solutions
        </h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:17, color:'rgba(255,255,255,0.65)',
          maxWidth:580, margin:'0 auto', lineHeight:1.7 }}>
          Every sector has a distinct risk profile, regulatory framework and operational vulnerability structure.
          Omniversel calibrates to each.
        </p>
      </section>

      <main style={{ maxWidth:1280, margin:'0 auto', padding:'60px 40px' }}>
        <div className="sector-grid">
          {SECTORS.map((s) => <SectorCard key={s.title} sector={s}/>)}
        </div>
      </main>

      <section style={{ background:T, padding:'64px 40px', textAlign:'center' }}>
        <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(22px,3vw,34px)',
          fontWeight:800, color:'#FFFFFF', marginBottom:32, lineHeight:1.2 }}>
          Request a Sector Demo
        </h2>
        <div className="cta-buttons">
          <button style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700,
            color:N, background:'#FFFFFF', border:'none', borderRadius:8,
            padding:'14px 32px', cursor:'pointer', letterSpacing:'0.01em', transition:'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity='0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity='1')}>
            Request Demo
          </button>
          <button style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700,
            color:'#FFFFFF', background:'transparent', border:'2px solid rgba(255,255,255,0.7)',
            borderRadius:8, padding:'14px 32px', cursor:'pointer', letterSpacing:'0.01em',
            transition:'border-color 0.15s,opacity 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#FFFFFF'; e.currentTarget.style.opacity='0.9' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.7)'; e.currentTarget.style.opacity='1' }}>
            Contact Us
          </button>
        </div>
      </section>
    </>
  )
}
