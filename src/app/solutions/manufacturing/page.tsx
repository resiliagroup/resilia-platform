import Link from 'next/link'
import Nav from '@/components/Nav'

const C = {
  navy950: '#060D1A', navy900: '#0A1628',
  teal: '#2D8A87',
  white: '#FFFFFF', muted: '#94A3B8', dim: '#64748B',
  border: '#1E3A5F',
}
const FONT = "'Plus Jakarta Sans', sans-serif"


const CHALLENGES = [
  { title: 'Production Continuity Under Disruption', desc: 'Manufacturing operations face constant pressure to maintain output schedules. A single facility disruption — equipment failure, supplier outage, natural hazard event — can halt production lines, breach customer contracts and generate significant financial loss.' },
  { title: 'Supply Chain Interdependency', desc: 'Modern manufacturing depends on tightly integrated supply chains where tier-1, tier-2 and tier-3 supplier failures propagate rapidly to finished goods production. Single-source dependencies create fragility that is often invisible until disruption occurs.' },
  { title: 'Multi-Site Operational Complexity', desc: 'Multi-plant manufacturers must maintain consistent resilience standards across geographically dispersed facilities with different hazard profiles, workforce compositions and regulatory environments.' },
]

const FEATURES = [
  { title: 'Production Process Risk Scoring', desc: 'Facility-level resilience scores for each production unit, warehouse and utility system — identifying the processes whose failure would have the greatest impact on output continuity and customer commitments.' },
  { title: 'Supply Chain Dependency Mapping', desc: 'Critical supplier dependencies mapped and stress-tested across tier-1 and tier-2 supply chains. Single-source risks identified and alternative sourcing strategies documented.' },
  { title: 'Multi-Site BCM Framework', desc: 'Enterprise continuity plans covering all manufacturing sites — with cross-site resource sharing protocols, production transfer procedures and consolidated crisis command structure.' },
  { title: 'Workforce Safety Integration', desc: 'Operational resilience planning integrated with workforce safety management — ensuring that continuity plans do not compromise occupational health and safety standards under pressure.' },
]

const USE_CASES = [
  { title: 'Plant Business Continuity Plan', desc: 'Comprehensive BCP for manufacturing facilities — covering equipment failure, utility outage, supplier disruption, natural hazard and workforce safety scenarios.' },
  { title: 'Supply Chain Resilience Assessment', desc: 'Systematic mapping and scoring of supply chain dependencies — identifying single points of failure and developing alternative sourcing and inventory strategies.' },
  { title: 'Multi-Site Resilience Program', desc: 'Enterprise resilience program spanning all manufacturing facilities — with consistent methodology, consolidated reporting and integrated crisis management across the organization.' },
]

export default function ManufacturingPage() {
  return (
    <div style={{ background: C.navy900, fontFamily: FONT, minHeight: '100vh', color: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        .ch{transition:border-color 0.2s,transform 0.2s}
        .ch:hover{border-color:#2D8A87!important;transform:translateY(-2px)}
      `}</style>
      <Nav />

      <section style={{ background: C.navy900, padding: '120px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 700, height: 600,
          background: 'radial-gradient(circle at 100% 0%, rgba(45,138,135,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginBottom: 16, letterSpacing: '0.06em' }}>Solutions / Manufacturing</p>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Manufacturing &amp; Supply Chain</p>
          <h1 style={{ fontSize: 'clamp(38px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em', maxWidth: 760 }}>
            Operational Continuity<br /><span style={{ color: C.teal }}>for Manufacturing Organizations.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 640, lineHeight: 1.75, marginBottom: 36 }}>
            Quantitative risk assessment and business continuity management for discrete and process manufacturers — covering production continuity, supply chain resilience and workforce safety across multi-site operations.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 14, padding: '13px 28px', borderRadius: 9999, display: 'inline-block' }}>Request Manufacturing Demo</Link>
            <Link href="/methodology" style={{ border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 9999, display: 'inline-block' }}>View Methodology →</Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Production Continuity', 'Supply Chain Risk', 'ISO 45001'].map(b => (
              <span key={b} style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 9999, border: `1px solid ${C.border}`, color: C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>The Challenge</p>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 56, letterSpacing: '-0.02em' }}>
            Production Disruption Has<br />Immediate Commercial Consequences.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {CHALLENGES.map(c => (
              <div key={c.title} className="ch" style={{ background: C.navy900, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 14 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.navy900, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 72, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>The Omniversel Approach</p>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 40, letterSpacing: '-0.02em' }}>
              From Plant Floor to<br />Enterprise-Wide Continuity.
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
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>Multi-Site</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>Enterprise Assessment</div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Consistent risk scoring methodology applied across all manufacturing sites — enabling direct comparison and consolidated reporting to executive and board level.</p>
            </div>
            <div style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>Supply Chain</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>Dependency Analysis</div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Tier-1 and tier-2 supplier risk mapped and scored — identifying the supply chain vulnerabilities most likely to disrupt production continuity.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Use Cases</p>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 56, letterSpacing: '-0.02em' }}>
            From Single Plant to<br />Enterprise Supply Chain Resilience.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {USE_CASES.map(u => (
              <div key={u.title} className="ch" style={{ background: C.navy900, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.teal}`, borderRadius: 12, padding: 32 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 12 }}>{u.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #0F2240, #060D1A)', borderTop: `1px solid ${C.border}`, padding: '100px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, marginBottom: 20, letterSpacing: '-0.02em', maxWidth: 640, margin: '0 auto 20px' }}>
          Protecting production continuity across your operations?
        </h2>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Our advisory team works with manufacturers to build resilience programs that protect output, supply chains and workforce safety simultaneously.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 15, padding: '16px 36px', borderRadius: 9999, display: 'inline-block' }}>Request Manufacturing Demo</Link>
          <a href="mailto:info@omniversel.com" style={{ border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block', textDecoration: 'none' }}>Contact Manufacturing Advisory Team</a>
        </div>
      </section>

      <footer style={{ background: C.navy950, borderTop: `1px solid ${C.border}`, padding: '32px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: C.dim }}>© 2026 Omniversel · All rights reserved</p>
      </footer>
    </div>
  )
}
