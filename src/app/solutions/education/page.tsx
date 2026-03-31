import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = { title: 'Education Solutions', description: 'Emergency preparedness for educational institutions — campus safety, EOP, academic continuity.' }

const C = {
  navy950: '#F8FAFC', navy900: '#FFFFFF', navy800: '#F1F5F9',
  teal: '#2D8A87',
  white: '#0A1628', muted: '#64748B', dim: '#374151',
  border: '#E2E8F0',
}
const FONT = "'Plus Jakarta Sans', sans-serif"


const CHALLENGES = [
  {
    title: 'Duty of Care for Students and Staff',
    desc: 'Educational institutions carry a legal and ethical duty of care for thousands of students and staff. A single preparedness failure can have irreversible consequences — making systematic, documented risk assessment a non-negotiable institutional responsibility.',
  },
  {
    title: 'Complex Campus Environments',
    desc: 'University campuses operate as small cities — with laboratories, dormitories, sports facilities, medical centers and administrative buildings presenting diverse hazard profiles and evacuation challenges.',
  },
  {
    title: 'Continuity of Academic Operations',
    desc: 'Beyond immediate safety, educational institutions must plan for continuity of academic programs, examination schedules, research operations and student welfare services during extended disruption scenarios.',
  },
]

const FEATURES = [
  {
    title: 'Campus Hazard Assessment',
    desc: 'Systematic risk scoring across all campus buildings, laboratories and public spaces — identifying structural vulnerabilities, hazardous material locations and high-occupancy areas requiring priority intervention.',
  },
  {
    title: 'Emergency Operations Plan Development',
    desc: 'Comprehensive EOP covering fire, earthquake, chemical incident, active threat and severe weather scenarios — with clear command structures, communication protocols and evacuation procedures.',
  },
  {
    title: 'Continuity of Academic Operations',
    desc: 'Business continuity plans maintaining academic program delivery, student welfare services and administrative functions during facility loss, technology failure or extended disruption.',
  },
  {
    title: 'Drill and Exercise Program',
    desc: 'Structured exercise program testing emergency response capabilities across faculties, dormitories and administrative units — with post-exercise debrief and plan improvement cycle.',
  },
]

const USE_CASES = [
  {
    title: 'University Emergency Operations Plan',
    desc: 'Full EOP development for university campuses — covering all hazard scenarios, student evacuation, laboratory safety, dormitory protocols and crisis communication.',
  },
  {
    title: 'School District Risk Assessment',
    desc: 'Systematic risk scoring across school buildings within a district — identifying the highest-priority facilities for structural improvement and emergency planning investment.',
  },
  {
    title: 'Research Facility Continuity',
    desc: 'Business continuity planning for research laboratories and data centers — covering equipment protection, data backup, intellectual property preservation and research program continuity.',
  },
]

export default function EducationPage() {
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
            Solutions / Education
          </p>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>
            Education &amp; Campus Safety
          </p>
          <h1 style={{ fontSize: 'clamp(38px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em', maxWidth: 760 }}>
            Emergency Preparedness<br />
            <span style={{ color: C.teal }}>for Educational Institutions.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 640, lineHeight: 1.75, marginBottom: 36 }}>
            Quantitative disaster risk assessment and emergency operations planning for universities, schools and campus environments — covering multi-hazard scenarios, student safety protocols and institutional continuity requirements.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 14,
              padding: '13px 28px', borderRadius: 9999, display: 'inline-block' }}>
              Request Education Demo
            </Link>
            <Link href="/methodology" style={{ border: `1px solid ${C.border}`, color: C.muted,
              fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 9999, display: 'inline-block' }}>
              View Methodology →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Campus Safety', 'Emergency Operations Plan', 'ISO 22301'].map(b => (
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
            Educational Institutions Bear<br />a Duty of Care at Scale.
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
              Systematic Preparedness<br />for Every Campus Environment.
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
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>Education</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>
                Institutional Continuity
              </div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Academic programs, examination schedules and research operations covered under quantitative continuity planning — not generic checklists.
              </p>
            </div>
            <div style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>Campus Safety</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>
                Multi-Building Assessment
              </div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Individual risk scores for each campus building — enabling prioritized investment and transparent communication to students, staff and regulators.
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
            From Single Campus to<br />District-Wide Preparedness.
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
          Protecting students, staff and academic continuity?
        </h2>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Our advisory team works with educational institutions to develop systematic, auditable emergency preparedness programs.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 15,
            padding: '16px 36px', borderRadius: 9999, display: 'inline-block' }}>
            Request Education Demo
          </Link>
          <a href="mailto:info@omniversel.com" style={{ border: `1px solid ${C.border}`, color: C.muted,
            fontWeight: 600, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block', textDecoration: 'none' }}>
            Contact Education Advisory Team
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
