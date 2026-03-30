import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = { title: 'Public Sector Solutions', description: 'Urban resilience planning for municipalities — AFAD, Sendai Framework, FEMA Core Capabilities.' }

const C = {
  navy950: '#060D1A', navy900: '#0A1628', navy800: '#FFFFFF',
  teal: '#2D8A87',
  white: '#FFFFFF', muted: '#94A3B8', dim: '#64748B',
  border: '#1E3A5F',
}
const FONT = "'Plus Jakarta Sans', sans-serif"


const CHALLENGES = [
  {
    title: 'Multi-Hazard Urban Environments',
    desc: 'Turkish municipalities face simultaneous exposure to earthquake, flood, NATECH and climate-related hazards. Effective urban resilience planning requires a framework that addresses all hazard types within a single, coherent methodology.',
  },
  {
    title: 'Cross-Institutional Coordination',
    desc: 'Public sector resilience depends on coordination across multiple agencies — municipalities, emergency services, utilities, hospitals and central government. Fragmented planning produces gaps that become critical during actual events.',
  },
  {
    title: 'Accountability and Transparency',
    desc: 'Public institutions are accountable to citizens and national regulators for demonstrating preparedness. Assessments must be defensible, auditable and communicated clearly to non-technical stakeholders.',
  },
]

const FEATURES = [
  {
    title: 'AFAD Regulatory Alignment',
    desc: 'Assessment methodology aligned to AFAD (Disaster and Emergency Management Presidency) requirements for municipal disaster risk reduction plans — supporting compliance with national emergency management regulations.',
  },
  {
    title: 'Sendai Framework Mapping',
    desc: 'Municipal resilience programs structured around the Sendai Framework for Disaster Risk Reduction 2015-2030 — enabling international benchmarking and reporting.',
  },
  {
    title: 'FEMA Core Capabilities Integration',
    desc: 'Assessment outputs mapped to all five FEMA mission areas: Prevention, Protection, Mitigation, Response and Recovery — enabling systematic gap identification across 32 core capabilities.',
  },
  {
    title: 'Multi-Hazard Scenario Planning',
    desc: 'Emergency operations plans covering earthquake, flood, industrial accident, pandemic and extreme weather scenarios — calibrated to the specific hazard profile of each municipality.',
  },
]

const USE_CASES = [
  {
    title: 'Municipal Disaster Risk Reduction Plan',
    desc: 'Comprehensive DRRP development aligned to AFAD and Sendai Framework requirements — covering all hazard types, vulnerable populations and critical infrastructure dependencies.',
  },
  {
    title: 'Critical Infrastructure Assessment',
    desc: 'Systematic risk scoring across municipal infrastructure — water, energy, transportation, healthcare and communications — identifying the highest-priority resilience investments.',
  },
  {
    title: 'Inter-Agency Coordination Framework',
    desc: 'Multi-agency emergency coordination protocols developed across municipal services, emergency response units and supporting institutions — tested through tabletop exercises.',
  },
]

export default function PublicSectorPage() {
  return (
    <div style={{ background: C.navy900, fontFamily: FONT, minHeight: '100vh', color: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .ch { transition: border-color 0.2s, transform 0.2s; }
        .ch:hover { border-color: #2D8A87 !important; transform: translateY(-2px); }
      `}</style>
      <Nav />

      {/* HERO */}
      <section style={{ background: C.navy900, padding: '120px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 700, height: 600,
          background: 'radial-gradient(circle at 100% 0%, rgba(45,138,135,0.10) 0%, transparent 65%)',
          pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginBottom: 16, letterSpacing: '0.06em' }}>
            Solutions / Public Sector
          </p>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>
            Public Sector &amp; Municipalities
          </p>
          <h1 style={{ fontSize: 'clamp(38px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em', maxWidth: 760 }}>
            Urban Resilience Planning<br />
            <span style={{ color: C.teal }}>for Public Institutions.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 640, lineHeight: 1.75, marginBottom: 36 }}>
            Quantitative disaster risk assessment and emergency management planning for municipalities, government agencies and public administration — aligned to AFAD regulatory requirements, the Sendai Framework for Disaster Risk Reduction and FEMA Core Capabilities.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 14,
              padding: '13px 28px', borderRadius: 9999, display: 'inline-block' }}>
              Request Public Sector Demo
            </Link>
            <Link href="/methodology" style={{ border: `1px solid ${C.border}`, color: C.muted,
              fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 9999, display: 'inline-block' }}>
              View Methodology →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['AFAD Aligned', 'Sendai Framework', 'FEMA Core Capabilities'].map(b => (
              <span key={b} style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 9999,
                border: `1px solid ${C.border}`, color: C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CHALLENGE */}
      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>The Challenge</p>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 56, letterSpacing: '-0.02em' }}>
            Public Sector Resilience Demands<br />Coordination at Scale.
          </h2>
          <div className="g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {CHALLENGES.map(c => (
              <div key={c.title} className="ch" style={{ background: C.navy900, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 32 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 14 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section style={{ background: C.navy900, padding: '100px 48px' }}>
        <div className="g2" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 72, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>The Omniversel Approach</p>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 40, letterSpacing: '-0.02em' }}>
              Standards-Aligned Planning<br />for Public Administration.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {FEATURES.map(f => (
                <div key={f.title} style={{ borderLeft: `2px solid ${C.teal}`, paddingLeft: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 6 }}>{f.title}</div>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40 }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12 }}>782+</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>
                Facilities Assessed
              </div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Across 10 neighborhoods and 6 sectors in metropolitan Istanbul — the largest urban resilience deployment in Turkey.
              </p>
            </div>
            <div style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.02em' }}>Beylikduzu</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>
                Pilot Municipality
              </div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                The Omniversel methodology was first validated at scale across Beylikduzu district — now serving as a replication model for 39 Istanbul municipalities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Use Cases</p>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 56, letterSpacing: '-0.02em' }}>
            Built for Every Level<br />of Public Administration.
          </h2>
          <div className="g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {USE_CASES.map(u => (
              <div key={u.title} className="ch" style={{ background: C.navy900, border: `1px solid ${C.border}`,
                borderTop: `3px solid ${C.teal}`, borderRadius: 12, padding: 32 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 12 }}>{u.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #FFFFFF, #F8FAFC)',
        borderTop: `1px solid ${C.border}`, padding: '100px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, marginBottom: 20,
          letterSpacing: '-0.02em', maxWidth: 680, margin: '0 auto 20px' }}>
          Strengthening resilience across your municipality?
        </h2>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Our public sector advisory team works with municipalities and government agencies to implement standards-aligned urban resilience programs.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 15,
            padding: '16px 36px', borderRadius: 9999, display: 'inline-block' }}>
            Request Public Sector Demo
          </Link>
          <a href="mailto:info@omniversel.com" style={{ border: `1px solid ${C.border}`, color: C.muted,
            fontWeight: 600, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block', textDecoration: 'none' }}>
            Contact Public Sector Advisory Team
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
