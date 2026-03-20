'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import OmniverselLogo from '@/components/OmniverselLogo'

const N = '#0A1628'; const T = '#2D8A87'
const GR = '#F4F7F6'; const MG = '#566B66'; const BG = '#FFFFFF'; const BORDER = '#E8EDED'
const R_R = '#E30613'; const R_O = '#E56A04'; const R_G = '#2D8A87'

const TABS = [
  { key: 'risk',        label: 'Risk Assessment' },
  { key: 'continuity',  label: 'Business Continuity' },
  { key: 'crisis',      label: 'Crisis Management' },
  { key: 'compliance',  label: 'Compliance' },
] as const

type TabKey = typeof TABS[number]['key']

const TAB_CONTENT: Record<TabKey, { color: string; heading: string; intro: string; points: { title: string; desc: string }[]; paragraphs: string[] }> = {
  risk: {
    color: R_R,
    heading: 'Risk Assessment',
    intro: 'We quantify organizational risk across multiple parameters — hazard exposure, structural fragility, operational capacity and supply-chain dependencies. The result is a facility-level resilience score that prioritizes where action matters most.',
    points: [
      { title: 'Multi-parameter scoring', desc: 'Risk is evaluated across hazard, fragility, exposure, capacity and bottleneck dimensions — not as a single qualitative rating but as a structured, measurable index.' },
      { title: 'Bottleneck identification', desc: 'Inspired by Theory of Constraints, our model identifies the single constraint that would halt system throughput — allowing focused, high-leverage interventions.' },
      { title: 'Sector calibration', desc: 'Scoring weights are calibrated by sector and hazard type. A hospital facing NATECH risk is scored differently from a bank facing cyber exposure — because the stakes differ.' },
      { title: 'FEMA mission area alignment', desc: 'Assessments are structured around Prevention, Protection, Mitigation, Response and Recovery — enabling direct comparison to international preparedness standards.' },
    ],
    paragraphs: [
      'Risk is not a single number. It is a composite of interacting factors — where a facility sits geographically, how its systems are structured, who depends on it, and how much organizational capacity exists to absorb and recover from disruption. Omniversel models each of these dimensions independently, then synthesizes them into a single, auditable resilience index.',
      'Our approach draws on established quantitative risk analysis traditions used in nuclear safety, process industries and critical infrastructure protection. We apply these principles to organizational settings — translating engineering-grade rigor into a format that executive decision-makers can act on.',
    ],
  },
  continuity: {
    color: T,
    heading: 'Business Continuity',
    intro: 'We help organizations build, test and maintain continuity plans that work under real-world conditions. Our approach integrates ISO 22301 requirements with operational reality — not just documentation compliance.',
    points: [
      { title: 'Business impact analysis', desc: 'Critical functions are identified, prioritized by recovery timeline and mapped to their dependencies — staff, systems, suppliers and infrastructure.' },
      { title: 'RTO / RPO / MTD tracking', desc: 'Recovery objectives are defined at function level and tracked continuously. Gaps between target and current capability are surfaced automatically.' },
      { title: 'Plan lifecycle management', desc: 'Continuity plans move through draft → review → approval stages. Drill results and lessons learned feed directly into plan revisions.' },
      { title: 'ISO 22301 gap analysis', desc: 'Clause-by-clause maturity assessment against ISO 22301:2019. Evidence is linked to requirements, and corrective actions are tracked to closure.' },
    ],
    paragraphs: [
      'ISO 22301 provides a process framework for business continuity management. What it does not provide is a quantitative link between risk exposure and continuity investment. Omniversel bridges that gap — connecting BIA outputs to measurable resilience scores, so organizations can justify BCM spending with data rather than intuition.',
      'Recovery Time Objectives and Recovery Point Objectives are not aspirational targets. They are organizational commitments that must be grounded in realistic capability assessments. Omniversel\'s continuity module tests RTO/RPO feasibility against actual capacity scores — revealing gaps before a disruption does.',
    ],
  },
  crisis: {
    color: R_O,
    heading: 'Crisis Management',
    intro: 'When an incident occurs, response speed and coordination determine outcomes. Our crisis management approach is built on ICS principles — clear command structure, role clarity and real-time situational awareness.',
    points: [
      { title: 'Incident Command System', desc: 'Crisis response is organized around ICS roles: Incident Commander, Operations, Logistics, Finance/Admin and Planning sections — adaptable to any incident scale.' },
      { title: 'Near-miss culture', desc: 'Systematic near-miss reporting is embedded as the primary early-warning mechanism — surfacing weak signals before they become critical failures.' },
      { title: 'Escalation protocols', desc: 'Incidents move through defined severity levels with clear escalation triggers. Notifications, documentation and resource requests follow the same structure every time.' },
      { title: 'After-action learning', desc: 'Every exercise and real incident generates lessons that are tracked, assigned and closed. The organization learns systematically rather than informally.' },
    ],
    paragraphs: [
      'Crisis response is not an improvised act — it is a rehearsed capability. The difference between organizations that recover quickly and those that do not is rarely resources. It is structural clarity: who decides, who communicates, and who acts in the first sixty minutes of an incident.',
      'Omniversel\'s crisis module is built on Incident Command System principles adapted for multi-sector institutional environments. Every role, every escalation path, and every communication protocol is pre-defined, tested through simulation, and updated through structured after-action review.',
    ],
  },
  compliance: {
    color: '#6366F1',
    heading: 'Compliance',
    intro: 'Regulatory compliance is not a destination — it is a continuous operational posture. Our compliance framework tracks requirements across multiple standards simultaneously, with evidence collection built into daily workflows.',
    points: [
      { title: 'Multi-framework tracking', desc: 'ISO 22301, Sendai Framework, BDDK, Basel III and JCI requirements are mapped in a single compliance matrix — eliminating duplicate effort across teams.' },
      { title: 'Evidence collection', desc: 'Compliance evidence is captured at the point of activity — drill records, audit reports, near-miss logs — and linked directly to the relevant requirement clause.' },
      { title: 'Gap identification', desc: 'Automated gap analysis surfaces non-conformances before audits occur. Each gap generates a corrective action with owner, deadline and closure criteria.' },
      { title: 'Audit readiness', desc: 'Compliance scorecards are maintained in real time. When an auditor arrives, evidence packages are ready — not assembled under deadline pressure.' },
    ],
    paragraphs: [
      'Compliance is a floor, not a ceiling. Meeting ISO 22301, BDDK operational resilience requirements or Sendai Framework indicators demonstrates a baseline of organizational seriousness. It does not, by itself, indicate that an organization will perform well under pressure.',
      'Omniversel\'s audit module treats compliance as a starting point for continuous improvement rather than a periodic checkbox exercise. Gaps identified through clause-level assessment feed directly into sprint planning — translating regulatory obligations into operational priorities.',
    ],
  },
}


export default function MethodologyPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('risk')
  const content = TAB_CONTENT[activeTab]

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
          textTransform:'uppercase', marginBottom:16 }}>Our Approach</p>
        <h1 style={{ color:'#fff', fontSize:'clamp(32px,4.5vw,56px)', fontWeight:700,
          lineHeight:1.1, marginBottom:20, maxWidth:800, margin:'0 auto 20px' }}>
          Methodology
        </h1>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:17, lineHeight:1.8,
          maxWidth:600, margin:'0 auto' }}>
          A multi-parameter, academically grounded approach to organizational resilience —
          developed in collaboration with ITU AYM.
        </p>
      </section>

      <section style={{ background:GR, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', overflowX:'auto' }}>
          {TABS.map(tab => (
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
          <p style={{ color:content.color, fontSize:12, fontWeight:700, letterSpacing:3,
            textTransform:'uppercase', marginBottom:12 }}>Core Methodology</p>
          <h2 style={{ color:N, fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
            lineHeight:1.15, marginBottom:16 }}>
            {content.heading}
          </h2>
          <p style={{ color:MG, fontSize:16, lineHeight:1.85, maxWidth:680, marginBottom:48 }}>
            {content.intro}
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',
            gap:24, marginBottom:56 }}>
            {content.points.map((p, i) => (
              <div key={i} style={{ background:GR, border:`1px solid ${BORDER}`,
                borderLeft:`4px solid ${content.color}`, borderRadius:12, padding:'28px 24px' }}>
                <div style={{ fontSize:15, fontWeight:700, color:N, marginBottom:10 }}>{p.title}</div>
                <p style={{ fontSize:13, color:MG, lineHeight:1.75 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:720 }}>
            {content.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize:15, color:MG, lineHeight:1.85 }}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:N, padding:'64px 48px', textAlign:'center' }}>
        <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
          textTransform:'uppercase', marginBottom:16 }}>Access the Platform</p>
        <h2 style={{ color:'#fff', fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
          lineHeight:1.15, marginBottom:20 }}>
          See the methodology in action
        </h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, lineHeight:1.75,
          maxWidth:480, margin:'0 auto 40px' }}>
          Our approach is embedded directly into the Omniversel platform.
          For methodology inquiries, contact our team.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:15,
            padding:'14px 36px', borderRadius:8, display:'inline-block', transition:'opacity .18s' }}>
            Platform Login
          </Link>
          <a href="mailto:info@omniversel.com" style={{ border:'1.5px solid rgba(255,255,255,0.2)',
            color:'rgba(255,255,255,0.72)', fontWeight:600, fontSize:15, padding:'13px 32px',
            borderRadius:8, display:'inline-block', transition:'border-color .18s' }}>
            Contact Methodology Team
          </a>
        </div>
      </section>
    </>
  )
}
