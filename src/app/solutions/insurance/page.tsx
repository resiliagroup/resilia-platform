import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = { title: 'Insurance Solutions', description: 'Portfolio risk intelligence for insurance carriers — facility scoring, CAT exposure analysis.' }

const C = {
  navy950: '#F8FAFC', navy900: '#F8FAFC',
  teal: '#2D8A87',
  white: '#FFFFFF', muted: '#94A3B8', dim: '#64748B',
  border: '#E2E8F0',
}
const FONT = "'Plus Jakarta Sans', sans-serif"


const CHALLENGES = [
  { title: 'Underwriting Without Ground Truth', desc: 'Insurance carriers underwrite organizational resilience without access to independent, quantitative facility assessments. Self-reported data from policyholders creates adverse selection risk and mispriced premiums across entire portfolios.' },
  { title: 'Catastrophe Concentration Risk', desc: 'Portfolio exposure to correlated catastrophe events — earthquake, flood, NATECH — is difficult to quantify without facility-level risk data. Concentration in high-hazard zones may not be visible until a major loss event occurs.' },
  { title: 'Regulatory Capital Requirements', desc: 'Solvency II and local regulatory frameworks require insurers to demonstrate quantitative understanding of catastrophe exposure. Qualitative assessments no longer satisfy regulatory expectations for operational risk capital modeling.' },
]

const FEATURES = [
  { title: 'Facility-Level Risk Scoring', desc: 'Independent resilience scores for insured facilities — providing carriers with objective, auditable risk data that does not rely on policyholder self-reporting. Scores cover earthquake, flood, NATECH, fire and operational hazard dimensions.' },
  { title: 'Portfolio Concentration Analysis', desc: 'Aggregate risk scoring across insured portfolios — identifying geographic and sectoral concentrations before they become catastrophe losses. Correlation between facilities in the same hazard zone quantified explicitly.' },
  { title: 'Underwriting Support', desc: 'Risk assessment reports structured for underwriting use — providing the data inputs needed for accurate premium calculation, policy condition setting and reinsurance treaty design.' },
  { title: 'Claims Validation', desc: 'Pre-loss baseline assessments provide an independent reference point for claims validation — reducing moral hazard and supporting faster, more defensible claims settlement.' },
]

const USE_CASES = [
  { title: 'Commercial Lines Underwriting', desc: 'Independent facility risk assessments for commercial property, business interruption and liability underwriting — reducing information asymmetry between carrier and policyholder.' },
  { title: 'Portfolio CAT Exposure Review', desc: 'Systematic risk scoring across existing portfolios — identifying concentration risk, mispriced accounts and reinsurance optimization opportunities before renewal.' },
  { title: 'Parametric Product Development', desc: 'Facility-level risk data supporting the design of parametric insurance products — enabling faster claims settlement and more accurate trigger calibration.' },
]

export default function InsurancePage() {
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
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginBottom: 16, letterSpacing: '0.06em' }}>Solutions / Insurance</p>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Insurance &amp; Reinsurance</p>
          <h1 style={{ fontSize: 'clamp(38px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em', maxWidth: 760 }}>
            Portfolio Risk Intelligence<br /><span style={{ color: C.teal }}>for Insurance Carriers.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 640, lineHeight: 1.75, marginBottom: 36 }}>
            Quantitative facility-level risk scoring and catastrophe exposure assessment for insurance carriers and reinsurers — enabling defensible underwriting decisions, portfolio concentration analysis and regulatory capital optimization.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 14, padding: '13px 28px', borderRadius: 9999, display: 'inline-block' }}>Request Insurance Demo</Link>
            <Link href="/methodology" style={{ border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 14, padding: '12px 24px', borderRadius: 9999, display: 'inline-block' }}>View Methodology →</Link>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Portfolio Risk Scoring', 'CAT Exposure Analysis', 'ISO 22301'].map(b => (
              <span key={b} style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 9999, border: `1px solid ${C.border}`, color: C.muted }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>The Challenge</p>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 56, letterSpacing: '-0.02em' }}>
            Insurance Portfolios Carry Risk<br />That Cannot Be Self-Reported.
          </h2>
          <div className="g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
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
        <div className="g2" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 72, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>The Omniversel Approach</p>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 40, letterSpacing: '-0.02em' }}>
              Independent Risk Intelligence<br />for Underwriters and Actuaries.
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
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>CAT Risk</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>Catastrophe Modeling</div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Earthquake, flood and NATECH scenarios modeled at facility level — producing the granular exposure data that portfolio-level CAT models require.</p>
            </div>
            <div style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal, lineHeight: 1, marginBottom: 12, letterSpacing: '0.04em' }}>Solvency II</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.white, marginBottom: 16, lineHeight: 1.4 }}>Regulatory Alignment</div>
              <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>Assessment outputs structured to support Solvency II operational risk capital requirements and local regulatory reporting obligations.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: C.navy950, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Use Cases</p>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: C.white, lineHeight: 1.1, marginBottom: 56, letterSpacing: '-0.02em' }}>
            From Single Account to<br />Portfolio-Wide Risk Intelligence.
          </h2>
          <div className="g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {USE_CASES.map(u => (
              <div key={u.title} className="ch" style={{ background: C.navy900, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.teal}`, borderRadius: 12, padding: 32 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 12 }}>{u.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #FFFFFF, #F8FAFC)', borderTop: `1px solid ${C.border}`, padding: '100px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, marginBottom: 20, letterSpacing: '-0.02em', maxWidth: 640, margin: '0 auto 20px' }}>
          Improving underwriting accuracy across your portfolio?
        </h2>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Our advisory team works with insurance carriers and reinsurers to deliver independent, quantitative facility risk data at portfolio scale.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 15, padding: '16px 36px', borderRadius: 9999, display: 'inline-block' }}>Request Insurance Demo</Link>
          <a href="mailto:info@omniversel.com" style={{ border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 15, padding: '15px 32px', borderRadius: 9999, display: 'inline-block', textDecoration: 'none' }}>Contact Insurance Advisory Team</a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
