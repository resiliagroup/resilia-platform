import Link from 'next/link'

const C = {
  navy950: '#060D1A', navy900: '#0A1628', navy800: '#0F2240',
  teal: '#2D8A87',
  white: '#FFFFFF', muted: '#94A3B8', dim: '#64748B',
  border: '#1E3A5F',
}
const FONT = "'Plus Jakarta Sans', sans-serif"

function Nav() {
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 64, background: 'rgba(6,13,26,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center',
      padding: '0 48px', fontFamily: FONT }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: C.white, letterSpacing: -0.5, lineHeight: 1 }}>OMNIVERSEL</span>
            <span style={{ fontSize: 9, fontWeight: 500, color: C.dim, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Urban Resilience OS</span>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Link href="/platform/omnirisk" style={{ fontSize: 13, color: C.muted, fontWeight: 500, textDecoration: 'none' }}>Platform</Link>
          <Link href="/solutions" style={{ fontSize: 13, color: C.white, fontWeight: 600, textDecoration: 'none' }}>Solutions</Link>
          <Link href="/methodology" style={{ fontSize: 13, color: C.muted, fontWeight: 500, textDecoration: 'none' }}>Methodology</Link>
          <Link href="/pricing" style={{ fontSize: 13, color: C.muted, fontWeight: 500, textDecoration: 'none' }}>Pricing</Link>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{ fontSize: 13, color: C.muted, fontWeight: 600, textDecoration: 'none',
            padding: '8px 18px', border: `1px solid ${C.border}`, borderRadius: 9999 }}>Sign In</Link>
          <Link href="/login" style={{ fontSize: 13, color: C.white, fontWeight: 700, textDecoration: 'none',
            background: C.teal, padding: '8px 20px', borderRadius: 9999 }}>Request Demo</Link>
        </div>
      </div>
    </header>
  )
}

const CHALLENGES = [
  {
    title: 'Patient Safety Under Disruption',
    desc: 'Healthcare facilities cannot simply suspend operations during a crisis. Patient safety, critical care continuity and medical supply chains must be maintained under all hazard scenarios — including simultaneous multi-hazard events.',
  },
  {
    title: 'Complex Interdependencies',
    desc: 'Hospital operations depend on power, water, medical gases, pharmaceutical supply chains and IT systems. Failure in any single dependency propagates rapidly through clinical operations.',
  },
  {
    title: 'Accreditation Requirements',
    desc: 'JCI and national accreditation standards increasingly require documented, tested emergency operations plans. Self-reported compliance is no longer sufficient.',
  },
]

const FEATURES = [
  {
    title: 'Kaiser HVA Integration',
    desc: "Hazard Vulnerability Analysis methodology adapted for Turkish hospital environments — covering earthquake, flood, NATECH, pandemic and infrastructure failure scenarios.",
  },
  {
    title: 'HEICS Alignment',
    desc: 'Crisis command structures aligned to Hospital Emergency Incident Command System — enabling rapid, coordinated response across clinical and administrative functions.',
  },
  {
    title: 'Critical Process Mapping',
    desc: 'Life-critical processes identified and prioritized. RTO targets established for ICU, emergency, pharmacy, laboratory and surgical operations.',
  },
  {
    title: 'Supply Chain Resilience',
    desc: 'Medical supply dependencies mapped and stress-tested. Alternative supplier networks and inventory buffers assessed and documented.',
  },
]

const USE_CASES = [
  {
    title: 'Hospital Emergency Operations Plan',
    desc: 'Full EOP development covering all hazard scenarios, command structures, patient evacuation and clinical continuity protocols.',
  },
  {
    title: 'Multi-Site Health Network BCM',
    desc: 'Enterprise continuity planning across hospital networks — maintaining care delivery standards when individual facilities are compromised.',
  },
  {
    title: 'JCI Accreditation Support',
    desc: 'Assessment and documentation outputs structured to support JCI Emergency Management chapter requirements.',
  },
]

export default function HealthPage() {
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
            Solutions / Healthcare
          </p>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>
            Healthcare &amp; Hospitals
          </p>
          <h1 style={{ fontSize: 'clamp(38px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em', maxWidth: 720 }}>
            Resilience Planning<br />
            <span style={{ color: C.teal }}>for Healthcare Systems.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 640, lineHeight: 1.75, marginBottom: 36 }}>
            Quantitative disaster risk and business continuity assessment calibrated to JCI accreditation requirements, Kaiser HVA methodology and HEICS protocols — built for hospitals and health networks operating in multi-hazard environments.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 14,
              padding: '13px 28px', borderRadius: 9999, display: 'inline-block' }}>
              Request Healthcare Demo
            </Link>
            <Link href="/methodology" style={{ border: `1px solid ${C.border}`, color: C.muted,
              fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 9999, display: 'inline-block' }}>
              View Methodology →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['JCI Aligned', 'Kaiser HVA', 'HEICS Protocol'].map(b => (
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
            Healthcare Resilience Demands<br />Precision, Not Approximation.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
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
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 72, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>The Omniversel Approach</p>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 40, letterSpacing: '-0.02em' }}>
              Sector-Calibrated Assessment<br />for Healthcare.
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
              <div style={{ fontSize: 56, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12 }}>78</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>
                Healthcare facilities assessed
              </div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Across Istanbul metropolitan area, spanning tertiary hospitals and primary care networks.
              </p>
            </div>
            <div style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>HFMEA</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>
                Failure Mode Analysis
              </div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Applied to critical clinical processes — identifying failure points before they become incidents.
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
            Built for Every Level<br />of the Healthcare Organization.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
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
      <section style={{ background: 'linear-gradient(135deg, #0F2240, #060D1A)',
        borderTop: `1px solid ${C.border}`, padding: '100px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, marginBottom: 20,
          letterSpacing: '-0.02em', maxWidth: 680, margin: '0 auto 20px' }}>
          Ready to strengthen your hospital&apos;s emergency preparedness?
        </h2>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Our advisory team works with healthcare organizations to develop compliant, operationally tested resilience programs.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 15,
            padding: '16px 36px', borderRadius: 9999, display: 'inline-block' }}>
            Request Healthcare Demo
          </Link>
          <a href="mailto:info@omniversel.com" style={{ border: `1px solid ${C.border}`, color: C.muted,
            fontWeight: 600, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block' }}>
            Contact Advisory Team
          </a>
        </div>
      </section>

      <footer style={{ background: C.navy950, borderTop: `1px solid ${C.border}`, padding: '32px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: C.dim }}>© 2026 Omniversel · All rights reserved</p>
      </footer>
    </div>
  )
}
