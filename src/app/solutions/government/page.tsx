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
  { title: 'Continuity of Government Operations', desc: 'Government institutions carry essential public service obligations that cannot be suspended during crisis events. Emergency management, public health, utilities regulation and national security functions must be maintained — regardless of the disruption scenario.' },
  { title: 'Cross-Agency Coordination Complexity', desc: 'Effective government resilience requires coordinated planning across dozens of ministries, agencies and local bodies — each with distinct mandates, risk profiles and operational cultures. Fragmented planning produces critical gaps that become visible only during actual events.' },
  { title: 'Public Accountability', desc: 'Government institutions are accountable to citizens, parliaments and international bodies for demonstrating preparedness. Resilience programs must be transparent, auditable and communicable to non-technical stakeholders — including elected officials and the public.' },
]

const FEATURES = [
  { title: 'AFAD Regulatory Framework', desc: 'Assessment methodology fully aligned to AFAD national disaster risk reduction planning requirements — supporting compliance with Turkish emergency management regulations and national resilience reporting obligations.' },
  { title: 'Sendai Framework Implementation', desc: 'Government resilience programs structured around the four Sendai Framework priorities: understanding disaster risk, strengthening governance, investing in resilience, and enhancing preparedness for effective response.' },
  { title: 'FEMA Core Capabilities Mapping', desc: 'Assessment outputs mapped across all five mission areas — Prevention, Protection, Mitigation, Response and Recovery — enabling systematic gap identification across the full spectrum of emergency management capabilities.' },
  { title: 'Continuity of Operations Planning', desc: 'COOP frameworks developed for essential government functions — ensuring that critical services remain available to citizens during facility loss, system failure or extended disruption scenarios.' },
]

const USE_CASES = [
  { title: 'National Ministry BCM', desc: 'Business continuity planning for government ministries — maintaining essential public services, regulatory operations and interagency coordination across all disruption scenarios.' },
  { title: 'Municipal Disaster Risk Reduction', desc: 'Comprehensive DRRP development aligned to AFAD and Sendai Framework — covering hazard assessment, critical infrastructure protection and community resilience planning.' },
  { title: 'Inter-Agency Exercise Program', desc: 'Tabletop and functional exercises testing coordination across multiple government agencies — identifying gaps, building relationships and improving response protocols before a real event.' },
]

export default function GovernmentPage() {
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
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginBottom: 16, letterSpacing: '0.06em' }}>Solutions / Government</p>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>National &amp; Local Government</p>
          <h1 style={{ fontSize: 'clamp(38px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em', maxWidth: 760 }}>
            Resilience Infrastructure<br /><span style={{ color: C.teal }}>for Government Institutions.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 640, lineHeight: 1.75, marginBottom: 36 }}>
            Quantitative disaster risk assessment, emergency management planning and business continuity management for national ministries, regulatory agencies and local government bodies — aligned to AFAD, Sendai Framework and FEMA Core Capabilities.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 14, padding: '13px 28px', borderRadius: 9999, display: 'inline-block' }}>Request Government Demo</Link>
            <Link href="/methodology" style={{ border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 9999, display: 'inline-block' }}>View Methodology →</Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['AFAD Aligned', 'Sendai Framework', 'FEMA Core Capabilities'].map(b => (
              <span key={b} style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 9999, border: `1px solid ${C.border}`, color: C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>The Challenge</p>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 56, letterSpacing: '-0.02em' }}>
            Government Resilience Requires<br />Coordination Across Every Agency.
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
              Standards-Aligned Resilience<br />for Public Institutions.
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
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>39 Districts</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>Istanbul Replication Model</div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Omniversel methodology validated in Beylikduzu and structured for replication across all 39 Istanbul metropolitan districts.</p>
            </div>
            <div style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>National Scale</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>Ministry-Level BCM</div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Business continuity planning frameworks applicable at ministry level — covering essential public services, regulatory functions and interagency coordination.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Use Cases</p>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 56, letterSpacing: '-0.02em' }}>
            From Ministry to Municipality,<br />Resilience at Every Level.
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
          Building resilience across your government institution?
        </h2>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Our public sector advisory team works with ministries and government agencies to implement standards-aligned resilience programs at national and local scale.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 15, padding: '16px 36px', borderRadius: 9999, display: 'inline-block' }}>Request Government Demo</Link>
          <a href="mailto:info@omniversel.com" style={{ border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block', textDecoration: 'none' }}>Contact Government Advisory Team</a>
        </div>
      </section>

      <footer style={{ background: C.navy950, borderTop: `1px solid ${C.border}`, padding: '32px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: C.dim }}>© 2026 Omniversel · All rights reserved</p>
      </footer>
    </div>
  )
}
