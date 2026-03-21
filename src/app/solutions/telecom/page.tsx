import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = { title: 'Telecommunications Solutions', description: 'Network resilience for telecom operators — BTK aligned, ISO 22301, node-level risk scoring.' }

const C = {
  navy950: '#060D1A', navy900: '#0A1628',
  teal: '#2D8A87',
  white: '#FFFFFF', muted: '#94A3B8', dim: '#64748B',
  border: '#1E3A5F',
}
const FONT = "'Plus Jakarta Sans', sans-serif"


const CHALLENGES = [
  { title: 'Critical Infrastructure Dependency', desc: 'Telecommunications networks underpin every other critical infrastructure sector — healthcare, finance, energy, emergency services. A network outage does not affect only the operator: it cascades across the entire economy and society.' },
  { title: 'Regulatory Continuity Requirements', desc: 'BTK and international telecom regulators impose increasingly stringent business continuity and network resilience requirements. Operators must demonstrate quantitative preparedness — not merely document intentions.' },
  { title: 'Multi-Site Network Complexity', desc: 'Telecom infrastructure spans thousands of sites — base stations, data centers, switching facilities, cable routes — each with distinct risk profiles. Aggregate resilience cannot be assessed without facility-level risk data.' },
]

const FEATURES = [
  { title: 'BTK Compliance Mapping', desc: 'Business continuity assessments structured to meet BTK (Information Technologies and Communication Authority) operational resilience requirements — audit-ready outputs supporting regulatory submissions.' },
  { title: 'Network Node Risk Scoring', desc: 'Individual resilience scores for data centers, switching facilities, base stations and cable infrastructure — identifying the highest-criticality nodes for priority investment and redundancy planning.' },
  { title: 'Service Continuity Planning', desc: 'RTO and RPO targets established for each service tier — voice, data, emergency communications — ensuring continuity plans reflect actual regulatory and commercial obligations.' },
  { title: 'Multi-Hazard Site Assessment', desc: 'Earthquake, flood, power outage, fire and physical security scenarios assessed across the network footprint — with cascade modeling showing how single-node failures propagate to service disruption.' },
]

const USE_CASES = [
  { title: 'Data Center BCM', desc: 'Comprehensive business continuity planning for carrier-grade data centers — covering power, cooling, connectivity, physical security and IT system recovery across all hazard scenarios.' },
  { title: 'Network Infrastructure Assessment', desc: 'Systematic risk scoring across the network footprint — base stations, switching centers, cable routes — identifying single points of failure and cascade risk pathways.' },
  { title: 'Regulatory Continuity Submission', desc: 'Assessment and documentation outputs structured to meet BTK business continuity reporting requirements — supporting licence renewal, operational approval and regulatory audit processes.' },
]

export default function TelecomPage() {
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
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginBottom: 16, letterSpacing: '0.06em' }}>Solutions / Telecommunications</p>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Telecommunications &amp; Networks</p>
          <h1 style={{ fontSize: 'clamp(38px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em', maxWidth: 760 }}>
            Network Resilience and<br /><span style={{ color: C.teal }}>Continuity for Telecoms.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 640, lineHeight: 1.75, marginBottom: 36 }}>
            Quantitative business continuity management and critical infrastructure risk assessment for telecommunications operators — aligned to BTK regulatory requirements, BEREC guidelines and ISO 22301 continuity standards.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 14, padding: '13px 28px', borderRadius: 9999, display: 'inline-block' }}>Request Telecom Demo</Link>
            <Link href="/methodology" style={{ border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 9999, display: 'inline-block' }}>View Methodology →</Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['BTK Aligned', 'Network Continuity', 'ISO 22301'].map(b => (
              <span key={b} style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 9999, border: `1px solid ${C.border}`, color: C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>The Challenge</p>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 56, letterSpacing: '-0.02em' }}>
            Telecom Outages Cascade<br />Across the Entire Economy.
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
              Node-Level Risk Intelligence<br />for Network Operators.
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
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>BTK</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>Regulatory Alignment</div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Assessment methodology aligned to Turkish telecommunications regulatory requirements — supporting compliance submissions and operational review processes.</p>
            </div>
            <div style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>Network Resilience</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>Node-Level Scoring</div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Individual risk scores across network infrastructure — enabling prioritized investment in the nodes whose failure would cause the greatest service impact.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Use Cases</p>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 56, letterSpacing: '-0.02em' }}>
            From Data Center to<br />Network-Wide Resilience.
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
          Strengthening network resilience across your infrastructure?
        </h2>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Our advisory team works with telecommunications operators to build quantitative, regulatory-compliant resilience programs.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 15, padding: '16px 36px', borderRadius: 9999, display: 'inline-block' }}>Request Telecom Demo</Link>
          <a href="mailto:info@omniversel.com" style={{ border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block', textDecoration: 'none' }}>Contact Telecom Advisory Team</a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
