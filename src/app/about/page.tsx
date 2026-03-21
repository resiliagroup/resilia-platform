'use client'
import Link from 'next/link'
import Nav from '@/components/Nav'

const C = {
  navy950: '#060D1A', navy900: '#0A1628', navy800: '#0F2240',
  teal: '#2D8A87', tealL: '#3BA8A5',
  white: '#FFFFFF', muted: '#94A3B8', dim: '#64748B',
  border: '#1E3A5F',
}
const FONT = "'Plus Jakarta Sans', sans-serif"


const MILESTONES = [
  {
    year: '2001',
    text: 'ITU AYM established through tripartite agreement between ITU, Turkish Prime Ministry Crisis Management Directorate, and FEMA. Transfer of American and Japanese disaster management knowledge into Turkish institutional practice began.',
  },
  {
    year: '2001–2020',
    text: 'Over two decades, ITU AYM trained more than 5,000 local government officials and institutional leaders across Turkey. The Center published 23 reference volumes — the only comprehensive disaster management library in Turkish.',
  },
  {
    year: '2024',
    text: 'Omniversel founded to translate ITU AYM\'s accumulated knowledge into a digital platform. Quantitative resilience methodology developed and validated across field implementations in metropolitan Istanbul.',
  },
  {
    year: '2025–',
    text: 'The Omniversel ecosystem expanded to platform software, organizational consulting, field assessment services and an operational fire testing laboratory. Growth toward a fully integrated resilience services model continues.',
  },
]

const MODEL_CARDS = [
  { title: 'Platform', desc: 'SaaS resilience software for quantitative risk scoring, BCM planning and crisis management.' },
  { title: 'Consulting', desc: 'Sector-calibrated facility assessments, business continuity plan development and drill management.' },
  { title: 'Testing & Investigation', desc: 'Fire testing laboratory, NATECH field analysis and expert witness services for regulatory proceedings.' },
  { title: 'Research & Training', desc: 'Joint R&D with ITU AYM, professional resilience training programs and capacity development.' },
]

export default function AboutPage() {
  return (
    <div style={{ background: C.navy900, fontFamily: FONT, minHeight: '100vh', color: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
      `}</style>
      <Nav />

      {/* HERO */}
      <section style={{ background: C.navy900, paddingTop: 120, paddingBottom: 80, padding: '120px 48px 80px',
        position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 600, height: 600,
          background: 'radial-gradient(circle at 0% 0%, rgba(45,138,135,0.10) 0%, transparent 70%)',
          pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginBottom: 24, letterSpacing: '0.08em' }}>About</p>
          <h1 style={{ fontSize: 'clamp(40px,5vw,64px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.02em' }}>
            Building Resilience<br />
            <span style={{ color: C.teal }}>Through Science.</span>
          </h1>
          <p style={{ fontSize: 20, color: C.muted, maxWidth: 600, lineHeight: 1.7, marginBottom: 32 }}>
            Omniversel is a resilience analytics company developing an academically grounded, operationally tested platform for multi-hazard organizational risk management.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Academic Foundation', active: true },
              { label: 'Field Validated', active: false },
              { label: 'Operationally Trusted', active: false },
            ].map(b => (
              <span key={b.label} style={{
                fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 9999,
                border: `1px solid ${b.active ? C.teal : C.border}`,
                color: b.active ? C.teal : C.muted,
              }}>{b.label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Our Mission</p>
            <h2 style={{ fontSize: 'clamp(32px,3.5vw,42px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
              Quantify Risk.<br />
              Enable Resilience.<br />
              <span style={{ color: C.teal }}>Save Lives.</span>
            </h2>
            <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.75 }}>
              We believe every organization deserves access to the same risk intelligence tools used by the world&apos;s most resilient institutions.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { stat: '782+', label: 'Facilities assessed', sub: 'Across metropolitan Istanbul' },
              { stat: '5,000+', label: 'Professionals trained', sub: 'By ITU AYM since 2001' },
              { stat: '23', label: 'Reference volumes', sub: 'Only disaster management library in Turkish' },
            ].map(s => (
              <div key={s.stat} style={{ background: C.navy900, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 6 }}>{s.stat}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.white, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: C.dim }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section style={{ background: C.navy900, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Our Approach</p>
          <h2 style={{ fontSize: 'clamp(30px,3.5vw,42px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
            Measurement, Not Description.
          </h2>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 700, lineHeight: 1.75, marginBottom: 56 }}>
            Omniversel is built on a fundamental conviction: organizational resilience can be measured, not merely described.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>
              Our platform applies quantitative risk analysis methods — drawing from process safety, disaster science and business continuity management — to produce defensible, auditable resilience scores that support real decisions. We work across sectors where the cost of failure is high: critical infrastructure, healthcare, financial services and public administration.
            </p>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>
              In each domain, we calibrate our methodology to the regulatory environment, hazard profile and operational structure of the institution — rather than applying a single generic framework. Every assessment produces an auditable output: a structured resilience index that executives can act on and regulators can verify.
            </p>
          </div>
        </div>
      </section>

      {/* ACADEMIC PARTNERSHIP */}
      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 80 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Academic Partnership</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: C.white, lineHeight: 1.25, marginBottom: 20 }}>
              Istanbul Technical University Disaster Management Research and Implementation Center
            </h2>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, marginBottom: 20 }}>
              Our methodology is grounded in peer-reviewed disaster risk science and validated through field implementations across urban multi-hazard environments.
            </p>
            <p style={{ fontSize: 14, color: C.dim, lineHeight: 1.8 }}>
              ITU AYM was established in 2001 through a tripartite agreement between Istanbul Technical University, the Turkish Prime Ministry Crisis Management Directorate, and FEMA (U.S. Federal Emergency Management Agency) — beginning the systematic transfer of American and Japanese disaster management knowledge into Turkish institutional practice.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {MILESTONES.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: i < MILESTONES.length - 1 ? 36 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 80 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.teal, whiteSpace: 'nowrap' }}>{m.year}</span>
                  {i < MILESTONES.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: C.border, marginTop: 8 }} />
                  )}
                </div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, paddingTop: 2, paddingBottom: i < MILESTONES.length - 1 ? 36 : 0 }}>
                  {m.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR MODEL */}
      <section style={{ background: C.navy900, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>An Integrated Resilience Organization</p>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 700, color: C.white, textAlign: 'center', marginBottom: 12, letterSpacing: '-0.01em' }}>
            Omniversel operates across four practice areas — each reinforcing the others.
          </h2>
          <div style={{ height: 56 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {MODEL_CARDS.map(card => (
              <div key={card.title} style={{ background: C.navy950, border: `1px solid ${C.border}`,
                borderTop: `3px solid ${C.teal}`, borderRadius: 12, padding: 32,
                transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 12 }}>{card.title}</div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #0F2240, #060D1A)',
        borderTop: `1px solid ${C.border}`, padding: '100px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, marginBottom: 20, letterSpacing: '-0.02em' }}>
          Start Your Resilience Journey
        </h2>
        <p style={{ fontSize: 18, color: C.muted, marginBottom: 40, lineHeight: 1.6 }}>
          Organizations that take resilience seriously choose Omniversel.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 15,
            padding: '16px 40px', borderRadius: 9999, display: 'inline-block' }}>
            Request Demo
          </Link>
          <Link href="/methodology" style={{ border: `1px solid ${C.border}`, color: C.muted,
            fontWeight: 600, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block' }}>
            Our Methodology →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.navy950, borderTop: `1px solid ${C.border}`,
        padding: '32px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: C.dim }}>© 2026 Omniversel · All rights reserved</p>
      </footer>
    </div>
  )
}
