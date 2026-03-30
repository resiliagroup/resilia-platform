'use client'
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


function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="7" fill={`${color}20`} />
      <path d="M5 8l2.5 2.5L11 5.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const STARTER_FEATURES = [
  '1 facility assessment',
  'Resilience score & report',
  'PDF report export',
  '14-day access',
  'Email support',
]

const PRO_FEATURES = [
  'Up to 50 facilities',
  'All 6 platform modules',
  'Agile sprint board',
  'Near-miss event tracking',
  'BCM plan templates',
  'Crisis command center',
  'PDF + Excel reports',
  'Priority support',
  'Onboarding session',
  'Quarterly review call',
]

const ENT_FEATURES = [
  'Unlimited facilities',
  'All modules incl. pipeline & HRO',
  'White-label deployment',
  'REST API access',
  'Dedicated account manager',
  'SLA guarantee',
  'On-site training',
  'Regulatory reporting package',
  'Custom integrations',
  'Executive dashboard',
]

const INCLUDES = [
  {
    title: 'Regulatory Alignment',
    body: 'Every assessment structured around international BCM and disaster risk standards. Compliance outputs generated automatically.',
  },
  {
    title: 'Data Security',
    body: 'GDPR-compliant infrastructure. Organizational risk data never leaves your jurisdiction without explicit authorization.',
  },
  {
    title: 'Implementation Support',
    body: 'Every plan includes onboarding from our advisory team — ensuring your first assessment reflects your real risk profile.',
  },
]

export default function PricingPage() {
  return (
    <div style={{ background: C.navy900, fontFamily: FONT, minHeight: '100vh', color: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
      `}</style>
      <Nav />

      {/* HERO */}
      <section style={{ background: C.navy900, padding: '100px 48px 60px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Pricing</p>
        <h1 style={{ fontSize: 'clamp(36px,4.5vw,56px)', fontWeight: 800, color: C.white, marginBottom: 20, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Simple, Transparent Pricing.
        </h1>
        <p style={{ fontSize: 20, color: C.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
          Start free. Scale with your resilience program. No surprise charges.
        </p>
      </section>

      {/* PLANS */}
      <section style={{ padding: '60px 48px 80px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', gap: 24, justifyContent: 'center',
          alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* STARTER */}
          <div className="price-card" style={{ background: C.navy900, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, width: 340 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Starter</p>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: C.white, lineHeight: 1.25, marginBottom: 28 }}>
              Single Facility<br />Assessment
            </h3>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 48, fontWeight: 800, color: C.teal, lineHeight: 1 }}>Free</span>
            </div>
            <p style={{ fontSize: 12, color: C.dim, marginBottom: 28 }}>No credit card required</p>
            <div style={{ height: 1, background: C.border, marginBottom: 28 }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {STARTER_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.white }}>
                  <CheckIcon color={C.teal} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '12px 24px', borderRadius: 9999,
              border: `1px solid ${C.teal}`, color: C.teal, fontWeight: 700, fontSize: 14 }}>
              Start for Free
            </Link>
          </div>

          {/* PROFESSIONAL */}
          <div className="price-card" style={{ background: C.navy800, border: `2px solid ${C.teal}`, borderRadius: 16, padding: 40, width: 380,
            position: 'relative', boxShadow: `0 8px 40px rgba(45,138,135,0.15)` }}>
            <div style={{ position: 'absolute', top: -14, right: 28,
              background: C.teal, color: C.white, fontSize: 11, fontWeight: 800,
              padding: '4px 12px', borderRadius: 9999, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Most Popular
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Professional</p>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: C.white, lineHeight: 1.25, marginBottom: 28 }}>
              Up to 50 Facilities,<br />Full Platform Suite
            </h3>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: C.white, lineHeight: 1 }}>Contact for pricing</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 28 }}>Annual billing · All modules included</p>
            <div style={{ height: 1, background: C.border, marginBottom: 28 }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {PRO_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.white }}>
                  <CheckIcon color={C.teal} />
                  {f}
                </li>
              ))}
            </ul>
            <a href="mailto:info@omniversel.com" style={{ display: 'block', textAlign: 'center', padding: '14px 24px', borderRadius: 9999,
              background: C.teal, color: C.white, fontWeight: 700, fontSize: 14 }}>
              Contact Sales
            </a>
          </div>

          {/* ENTERPRISE */}
          <div className="price-card" style={{ background: C.navy900, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, width: 340 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Enterprise</p>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: C.white, lineHeight: 1.25, marginBottom: 28 }}>
              Unlimited Facilities,<br />White-Label &amp; API
            </h3>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: C.white, lineHeight: 1 }}>Contact for pricing</span>
            </div>
            <p style={{ fontSize: 12, color: C.dim, marginBottom: 28 }}>Custom contract · Dedicated support</p>
            <div style={{ height: 1, background: C.border, marginBottom: 28 }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {ENT_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.white }}>
                  <CheckIcon color={C.muted} />
                  {f}
                </li>
              ))}
            </ul>
            <a href="mailto:enterprise@omniversel.com" style={{ display: 'block', textAlign: 'center', padding: '12px 24px', borderRadius: 9999,
              border: `1px solid ${C.border}`, color: C.muted, fontWeight: 700, fontSize: 14 }}>
              Contact Enterprise
            </a>
          </div>

        </div>
      </section>

      {/* ALL PLANS INCLUDE */}
      <section style={{ background: C.navy950, padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, textAlign: 'center', marginBottom: 56, letterSpacing: '-0.01em' }}>
            All Plans Include
          </h2>
          <div className="g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {INCLUDES.map(col => (
              <div key={col.title} style={{ background: C.navy900, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 32 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 12 }}>{col.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{col.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: 'linear-gradient(135deg, #FFFFFF, #F8FAFC)',
        borderTop: `1px solid ${C.border}`, padding: '100px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: C.white, marginBottom: 20, letterSpacing: '-0.02em' }}>
          Ready to get started?
        </h2>
        <p style={{ fontSize: 18, color: C.muted, marginBottom: 40 }}>
          No commitment. Start with a free assessment today.
        </p>
        <Link href="/login" style={{ background: C.teal, color: C.white, fontWeight: 700,
          fontSize: 15, padding: '16px 40px', borderRadius: 9999, display: 'inline-block' }}>
          Start Free Assessment
        </Link>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}
