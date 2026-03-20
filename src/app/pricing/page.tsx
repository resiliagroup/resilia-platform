'use client'
import Link from 'next/link'

function PageNav() {
  return (
    <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:200,
      height:64, background:'rgba(255,255,255,0.97)', backdropFilter:'blur(12px)',
      borderBottom:'1px solid #E8EDED', display:'flex', alignItems:'center',
      padding:'0 48px' }}>
      <div style={{ maxWidth:1200, width:'100%', margin:'0 auto',
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ textDecoration:'none' }}>
          <div style={{ display:'flex', flexDirection:'column' }}>
            <span style={{ fontSize:17, fontWeight:800, color:'#0A1628', letterSpacing:-0.5, lineHeight:1 }}>OMNIVERSEL</span>
            <span style={{ fontSize:9, fontWeight:500, color:'#566B66', letterSpacing:1.5, textTransform:'uppercase', marginTop:2 }}>Urban Resilience OS</span>
          </div>
        </a>
        <div style={{ display:'flex', gap:24, alignItems:'center' }}>
          <a href="/platform/omnirisk" style={{ fontSize:13, color:'#566B66', fontWeight:500, textDecoration:'none' }}>Platform</a>
          <a href="/solutions" style={{ fontSize:13, color:'#566B66', fontWeight:500, textDecoration:'none' }}>Solutions</a>
          <a href="/pricing" style={{ fontSize:13, color:'#566B66', fontWeight:500, textDecoration:'none' }}>Pricing</a>
          <a href="/login" style={{ background:'#2D8A87', color:'#fff', fontWeight:700,
            fontSize:13, padding:'9px 22px', borderRadius:6, textDecoration:'none' }}>
            Request Demo
          </a>
        </div>
      </div>
    </header>
  )
}

const N='#0A1628'; const T='#009B8D'; const MG='#566B66'; const BORDER='#E8EDED'; const GR='#F4F7F6'

const PLANS = [
  {
    name: 'Starter',
    tagline: 'Single facility assessment',
    price: 'Free',
    priceSub: 'No credit card required',
    color: '#6B7280',
    accent: '#F3F4F6',
    features: [
      '1 facility assessment',
      'omniRISK URI score',
      'FEMA mission area mapping',
      'PDF report export',
      '14-day access',
      'Email support',
    ],
    cta: 'Start for free',
    ctaHref: '/login',
    popular: false,
  },
  {
    name: 'Professional',
    tagline: 'Up to 50 facilities, full omniRISK suite',
    price: 'Contact for pricing',
    priceSub: 'Annual billing',
    color: T,
    accent: `${T}10`,
    features: [
      'Up to 50 facilities',
      'All 6 omniRISK modules',
      'omniSPRINT agile board',
      'Near-miss event tracking',
      'omniPLAN BCM templates',
      'omniCRISIS command center',
      'PDF + Excel reports',
      'Priority support',
      'Onboarding session',
    ],
    cta: 'Contact Sales',
    ctaHref: 'mailto:info@omniversel.com',
    popular: true,
  },
  {
    name: 'Enterprise',
    tagline: 'Unlimited facilities, white-label, API access',
    price: 'Contact for pricing',
    priceSub: 'Custom contract',
    color: '#8B5CF6',
    accent: '#F5F3FF',
    features: [
      'Unlimited facilities',
      'All modules incl. omniPIPE + omniHRO',
      'White-label deployment',
      'REST API access',
      'Custom k(s,t) matrix calibration',
      'Dedicated account manager',
      'SLA guarantee',
      'On-site training',
      'Regulatory reporting package',
    ],
    cta: 'Contact Enterprise',
    ctaHref: 'mailto:enterprise@omniversel.com',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div style={{ background:GR, fontFamily:"'DM Sans',sans-serif", minHeight:'100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>
      <PageNav />

      {/* HEADER */}
      <section style={{ paddingTop:110, paddingBottom:60, paddingLeft:48, paddingRight:48,
        background:N, textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(32px,4vw,52px)', fontWeight:800, color:'#fff', marginBottom:16, letterSpacing:'-0.02em' }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:17, maxWidth:520, margin:'0 auto' }}>
          Start free. Scale with your resilience program. No surprise charges.
        </p>
      </section>

      {/* PLANS */}
      <section style={{ padding:'60px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto',
          display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, alignItems:'start' }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{ background:'#fff', borderRadius:20,
              border: plan.popular ? `2px solid ${T}` : `1px solid ${BORDER}`,
              padding:'32px 28px', position:'relative',
              boxShadow: plan.popular ? `0 8px 40px ${T}20` : '0 1px 4px rgba(0,0,0,0.05)' }}>
              {plan.popular && (
                <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)',
                  background:T, color:'#fff', fontSize:11, fontWeight:800,
                  padding:'5px 18px', borderRadius:20, letterSpacing:1, textTransform:'uppercase', whiteSpace:'nowrap' }}>
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom:24 }}>
                <h3 style={{ fontSize:20, fontWeight:800, color:N, marginBottom:4 }}>{plan.name}</h3>
                <p style={{ fontSize:13, color:MG }}>{plan.tagline}</p>
              </div>
              <div style={{ marginBottom:28, paddingBottom:24, borderBottom:`1px solid ${BORDER}` }}>
                <div style={{ fontSize:plan.price==='Free'?44:20, fontWeight:800,
                  color:plan.price==='Free'?T:N, fontFamily:'DM Mono,monospace', lineHeight:1 }}>
                  {plan.price}
                </div>
                <div style={{ fontSize:12, color:MG, marginTop:6 }}>{plan.priceSub}</div>
              </div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:'#374151' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0, marginTop:1 }}>
                      <circle cx="8" cy="8" r="7" fill={`${plan.color}15`}/>
                      <path d="M5 8l2.5 2.5L11 5.5" stroke={plan.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={plan.ctaHref}
                style={{ display:'block', textAlign:'center', padding:'13px 24px', borderRadius:10,
                  background: plan.popular ? T : 'transparent',
                  border: plan.popular ? 'none' : `1.5px solid ${plan.color}`,
                  color: plan.popular ? '#fff' : plan.color,
                  fontWeight:700, fontSize:14, transition:'opacity .18s' }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ / Compliance note */}
      <section style={{ padding:'48px', background:'#fff', borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:720, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:N, marginBottom:16 }}>
            All plans include
          </h2>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            {['FEMA NPG alignment','ISO 22301 templates','Sendai SF tracking','AFAD compatible','Turkish language support','GDPR compliant data storage'].map(item => (
              <span key={item} style={{ fontSize:12, fontWeight:600, padding:'6px 14px',
                borderRadius:20, background:`${T}10`, color:T, border:`1px solid ${T}25` }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'64px 48px', background:N, textAlign:'center' }}>
        <h2 style={{ fontSize:28, fontWeight:700, color:'#fff', marginBottom:12 }}>Ready to get started?</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:15, marginBottom:32 }}>No commitment. Start with a free assessment today.</p>
        <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:15, padding:'14px 40px', borderRadius:8, display:'inline-block' }}>
          Start Free Assessment
        </Link>
      </section>

      <footer style={{ background:'#080F1C', padding:'24px 48px', textAlign:'center' }}>
        <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>© 2026 Omniversel · Pricing · All rights reserved</p>
      </footer>
    </div>
  )
}
