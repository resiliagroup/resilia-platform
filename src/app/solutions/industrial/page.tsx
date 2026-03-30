import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = { title: 'Industrial Solutions', description: 'Process safety and operational resilience for industrial facilities — NATECH, SEVESO III, ISO 45001.' }

const C = {
  navy950: '#F8FAFC', navy900: '#F8FAFC', navy800: '#FFFFFF',
  teal: '#2D8A87',
  white: '#FFFFFF', muted: '#374151', dim: '#374151',
  border: '#E2E8F0',
}
const FONT = "'Plus Jakarta Sans', sans-serif"


const CHALLENGES = [
  {
    title: 'NATECH Cascade Risk',
    desc: 'Industrial facilities in seismically active regions face Natural Hazard-Triggered Technological Accidents — where earthquake or flood directly initiates chemical release, fire or explosion. Standard risk frameworks do not model these interactions.',
  },
  {
    title: 'Process Safety Complexity',
    desc: 'Manufacturing operations depend on tightly coupled processes where a single failure can cascade across production lines, utilities and safety systems simultaneously — with consequences extending beyond the facility boundary.',
  },
  {
    title: 'Regulatory Compliance Pressure',
    desc: 'SEVESO III and national regulations require documented, quantitative risk assessments for major hazard installations. Qualitative methods are insufficient for permitting, licensing and operational approval.',
  },
]

const FEATURES = [
  {
    title: 'NATECH Risk Modeling',
    desc: 'Natural hazard-triggered technological accident scenarios modeled explicitly — covering earthquake-induced storage tank failure, flood-driven chemical release and seismic structural damage to process units.',
  },
  {
    title: 'Process Hazard Analysis',
    desc: 'Systematic identification of failure modes across production processes — integrated with quantitative consequence modeling to prioritize risk reduction investment.',
  },
  {
    title: 'Facility-Level Resilience Scoring',
    desc: 'Each production unit, storage area and utility system receives an individual resilience score — enabling targeted capital allocation and regulatory justification.',
  },
  {
    title: 'Emergency Response Integration',
    desc: 'Consequence-based emergency plans developed from risk assessment outputs — defining exclusion zones, evacuation routes and community notification procedures.',
  },
]

const USE_CASES = [
  {
    title: 'Chemical Plant Risk Assessment',
    desc: 'Full quantitative risk assessment for chemical manufacturing facilities — individual and societal risk calculations, consequence modeling and regulatory submission packages.',
  },
  {
    title: 'Manufacturing BCM',
    desc: 'Business continuity plans covering production line failure, supply chain disruption, utility outage and personnel safety scenarios — maintaining output under adverse conditions.',
  },
  {
    title: 'Industrial Park Assessment',
    desc: 'Multi-facility risk assessment across industrial zones — identifying shared infrastructure dependencies and cascade failure pathways between co-located operations.',
  },
]

export default function IndustrialPage() {
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
            Solutions / Industrial &amp; Manufacturing
          </p>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>
            Industrial &amp; Manufacturing
          </p>
          <h1 style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em', maxWidth: 760 }}>
            Process Safety and<br />
            Operational Resilience<br />
            <span style={{ color: C.teal }}>for Industrial Facilities.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 640, lineHeight: 1.75, marginBottom: 36 }}>
            Quantitative risk assessment and business continuity management for manufacturing plants, chemical facilities and industrial complexes — calibrated to NATECH scenarios, SEVESO III requirements and ISO 45001 occupational safety standards.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 14,
              padding: '13px 28px', borderRadius: 9999, display: 'inline-block' }}>
              Request Industrial Demo
            </Link>
            <Link href="/methodology" style={{ border: `1px solid ${C.border}`, color: C.muted,
              fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 9999, display: 'inline-block' }}>
              View Methodology →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['NATECH Assessment', 'SEVESO III', 'ISO 45001'].map(b => (
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
            Industrial Risk Extends<br />Beyond the Facility Boundary.
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
              Quantitative Risk Intelligence<br />for Industrial Operations.
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
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>NATECH</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>
                Multi-Hazard Modeling
              </div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Earthquake, flood, storm and fire scenarios modeled simultaneously — capturing cascade interactions invisible in single-hazard frameworks.
              </p>
            </div>
            <div style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>ISO 45001</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>
                Safety Management
              </div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Operational resilience assessments integrated with occupational health and safety management system requirements.
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
            From Single Plant to<br />Industrial Zone, Quantified Risk.
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
          letterSpacing: '-0.02em', maxWidth: 640, margin: '0 auto 20px' }}>
          Assessing risk for a major hazard installation?
        </h2>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Our process safety team works with industrial operators to develop defensible, submission-ready quantitative risk assessments.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 15,
            padding: '16px 36px', borderRadius: 9999, display: 'inline-block' }}>
            Request Industrial Demo
          </Link>
          <a href="mailto:info@omniversel.com" style={{ border: `1px solid ${C.border}`, color: C.muted,
            fontWeight: 600, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block', textDecoration: 'none' }}>
            Contact Industrial Advisory Team
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
