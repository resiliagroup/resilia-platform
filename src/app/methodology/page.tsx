'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const C = {
  navy950: '#F8FAFC', navy900: '#F8FAFC', navy800: '#FFFFFF',
  teal: '#2D8A87', tealL: '#3BA8A5',
  white: '#FFFFFF', muted: '#374151', dim: '#374151',
  border: '#E2E8F0',
}
const FONT = "'Plus Jakarta Sans', sans-serif"


const TABS = ['Risk Assessment', 'Business Continuity', 'Crisis Management', 'Compliance'] as const
type Tab = typeof TABS[number]

type TabData = {
  heading: string
  subtitle: string
  features: { title: string; desc: string }[]
  quote: string
  prose: string
}

const TAB_DATA: Record<Tab, TabData> = {
  'Risk Assessment': {
    heading: 'Risk Assessment',
    subtitle: 'We quantify organizational risk across multiple parameters — hazard exposure, structural fragility, operational capacity and supply-chain dependencies.',
    features: [
      { title: 'Multi-parameter Scoring', desc: 'Risk evaluated across hazard, fragility, exposure, capacity and bottleneck dimensions — a structured, measurable index.' },
      { title: 'Bottleneck Identification', desc: 'Inspired by Theory of Constraints, our model identifies the single constraint that would halt system throughput — enabling focused, high-leverage interventions.' },
      { title: 'Sector Calibration', desc: 'Scoring weights calibrated by sector and hazard type. A hospital facing NATECH risk is scored differently from a bank facing cyber exposure.' },
      { title: 'FEMA Mission Area Alignment', desc: 'Structured around Prevention, Protection, Mitigation, Response and Recovery — enabling direct comparison to international preparedness standards.' },
    ],
    quote: 'Risk is not a single number. It is a composite of interacting factors — where a facility sits geographically, how its systems are structured, who depends on it, and how much organizational capacity exists to absorb and recover from disruption.',
    prose: 'Our approach draws on established quantitative risk analysis traditions used in nuclear safety, process industries and critical infrastructure protection. We apply these principles to organizational settings — translating engineering-grade rigor into a format that executive decision-makers can act on.',
  },
  'Business Continuity': {
    heading: 'Business Continuity Management',
    subtitle: 'We structure continuity planning around measurable recovery objectives — translating risk assessment outputs into actionable business continuity plans aligned with ISO 22301.',
    features: [
      { title: 'Recovery Time Objectives', desc: 'RTO and RPO targets established from impact analysis data, not organizational preference alone.' },
      { title: 'ISO 22301 Alignment', desc: 'Every plan is structured to satisfy audit requirements under international business continuity standards.' },
      { title: 'Agile Sprint Cycles', desc: 'Continuity program development managed in 15-day sprint cycles — enabling iterative improvement rather than infrequent annual reviews.' },
      { title: 'Multi-Scenario Planning', desc: 'Plans cover earthquake, flood, NATECH, cyber and supply chain disruption scenarios — calibrated to Istanbul\'s multi-hazard environment.' },
    ],
    quote: 'ISO 22301 provides a process framework for business continuity management. What it does not provide is a quantitative link between risk exposure and continuity investment. Omniversel bridges that gap — connecting BIA outputs to measurable resilience scores.',
    prose: 'Recovery Time Objectives and Recovery Point Objectives are not aspirational targets. They are organizational commitments that must be grounded in realistic capability assessments. Our continuity module tests RTO/RPO feasibility against actual capacity scores — revealing gaps before a disruption does.',
  },
  'Crisis Management': {
    heading: 'Crisis Management',
    subtitle: 'When an incident occurs, response speed and coordination determine outcomes. Our crisis management approach is built on ICS principles — clear command structure, role clarity and real-time situational awareness.',
    features: [
      { title: 'Real-Time Command', desc: 'Crisis command dashboards provide live situational awareness across facilities and stakeholder groups.' },
      { title: 'Autonomous Response Squads', desc: 'Pre-trained crisis squads with clear authority boundaries — reducing response latency when time is critical.' },
      { title: 'Near-Miss Integration', desc: 'Near-miss signals are captured and fed back into the risk model — improving foresight, not just hindsight.' },
      { title: 'Post-Incident Analysis', desc: 'Every crisis event generates a structured debrief — accelerating organizational learning.' },
    ],
    quote: 'Crisis response is not an improvised act — it is a rehearsed capability. The difference between organizations that recover quickly and those that do not is rarely resources. It is structural clarity: who decides, who communicates, and who acts in the first sixty minutes.',
    prose: 'Omniversel\'s crisis module is built on Incident Command System principles adapted for multi-sector institutional environments. Every role, every escalation path, and every communication protocol is pre-defined, tested through simulation, and updated through structured after-action review.',
  },
  'Compliance': {
    heading: 'Regulatory Compliance',
    subtitle: 'Regulatory compliance is not a destination — it is a continuous operational posture. Our compliance framework tracks requirements across multiple standards simultaneously, with evidence collection built into daily workflows.',
    features: [
      { title: 'BDDK Alignment', desc: 'Banking assessments structured to meet Turkish Banking Regulation and Supervision Agency operational resilience requirements.' },
      { title: 'ISO 22301 Readiness', desc: 'Platform outputs are designed to support third-party certification audits.' },
      { title: 'Sendai Framework Mapping', desc: 'Municipal and public sector assessments mapped to the Sendai Framework for Disaster Risk Reduction 2015–2030.' },
      { title: 'Audit Trail Generation', desc: 'Every assessment generates a complete audit trail — defensible in regulatory proceedings.' },
    ],
    quote: 'Compliance is a floor, not a ceiling. Meeting ISO 22301, BDDK operational resilience requirements or Sendai Framework indicators demonstrates a baseline of organizational seriousness. It does not, by itself, indicate that an organization will perform well under pressure.',
    prose: 'Omniversel\'s audit module treats compliance as a starting point for continuous improvement rather than a periodic checkbox exercise. Gaps identified through clause-level assessment feed directly into sprint planning — translating regulatory obligations into operational priorities.',
  },
}

export default function MethodologyPage() {
  const [active, setActive] = useState<Tab>('Risk Assessment')
  const d = TAB_DATA[active]

  return (
    <div style={{ background: C.navy900, fontFamily: FONT, minHeight: '100vh', color: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
      `}</style>
      <Nav />

      {/* HERO */}
      <section style={{ background: C.navy900, padding: '120px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 700, height: 600,
          background: 'radial-gradient(circle at 100% 0%, rgba(45,138,135,0.08) 0%, transparent 60%)',
          pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginBottom: 24, letterSpacing: '0.08em' }}>Methodology</p>
          <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em' }}>
            A Rigorous Approach<br />
            <span style={{ color: C.teal }}>to Organizational Resilience.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 680, lineHeight: 1.75, marginBottom: 40 }}>
            A multi-parameter, academically grounded framework for quantitative risk assessment, business continuity management and crisis preparedness — developed in collaboration with ITU AYM.
          </p>

          {/* Tab pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActive(tab)}
                style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 9999,
                  border: `1px solid ${active === tab ? C.teal : C.border}`,
                  background: active === tab ? C.teal : C.navy800,
                  color: active === tab ? C.white : C.muted,
                  cursor: 'pointer', fontFamily: FONT, transition: 'all 0.18s' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CORE METHODOLOGY — TAB CONTENT */}
      <section style={{ background: C.navy950, padding: '80px 48px' }}>
        <div className="g2" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 72 }}>
          {/* Left */}
          <div>
            <h3 style={{ fontSize: 'clamp(24px,2.5vw,32px)', fontWeight: 800, color: C.white, marginBottom: 16, letterSpacing: '-0.01em' }}>
              {d.heading}
            </h3>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, marginBottom: 40 }}>
              {d.subtitle}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {d.features.map(f => (
                <div key={f.title} style={{ borderLeft: `2px solid ${C.teal}`, paddingLeft: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6 }}>{f.title}</div>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: C.navy900, border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${C.teal}`, borderRadius: 16, padding: 40 }}>
              <p style={{ fontSize: 18, color: C.white, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 16 }}>
                &ldquo;{d.quote}&rdquo;
              </p>
              <p style={{ fontSize: 13, color: C.dim }}>— Omniversel Methodology Framework</p>
            </div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{d.prose}</p>
          </div>
        </div>
      </section>

      {/* ACCESS CTA */}
      <section style={{ background: C.navy900, borderTop: `1px solid ${C.border}`, padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 800, color: C.white, marginBottom: 16, letterSpacing: '-0.01em' }}>
          See the Methodology in Action
        </h2>
        <p style={{ fontSize: 18, color: C.muted, marginBottom: 40 }}>
          Our approach is embedded directly into the Omniversel platform.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ border: `1px solid ${C.border}`, color: C.muted,
            fontWeight: 600, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block' }}>
            Platform Login
          </Link>
          <a href="mailto:info@omniversel.com" style={{ background: C.teal, color: C.white,
            fontWeight: 700, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block' }}>
            Contact Methodology Team
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}
