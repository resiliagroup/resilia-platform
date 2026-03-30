'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

/* ── tokens ─────────────────────────────────────────────────────── */
const C = {
  navy950: '#F8FAFC',
  navy900: '#F8FAFC',
  navy800: '#FFFFFF',
  navy700: '#F1F5F9',
  teal:    '#2D8A87',
  tealL:   '#3BA8A5',
  amber:   '#F59E0B',
  green:   '#22C55E',
  muted:   '#94A3B8',
  dim:     '#64748B',
  border:  '#E2E8F0',
}

const FONT = "'Plus Jakarta Sans', sans-serif"

/* ── modules data ────────────────────────────────────────────────── */
const MODULES = [
  {
    code: 'omniRISK', href: '/platform/omnirisk',
    short: 'Quantitative facility risk scoring',
    detail: 'Multi-parameter facility risk scoring — hazard, fragility, exposure and capacity synthesized into a single, auditable resilience index.',
    features: ['URI score for every facility', 'Sector & hazard calibration', 'FEMA mission area alignment'],
  },
  {
    code: 'omniIMPACT', href: '/platform/omniimpact',
    short: 'Business impact analysis & downtime modeling',
    detail: 'Identify critical functions, model downtime costs and establish evidence-based RTO/RPO targets for every business unit.',
    features: ['Critical function prioritization', 'Downtime cost modeling', 'MTPD and RTO/RPO tracking'],
  },
  {
    code: 'omniPLAN', href: '/platform/omniplan',
    short: 'BCM planning with RTO/RPO tracking',
    detail: 'Build, test and maintain business continuity plans aligned to ISO 22301 — with lifecycle management from draft to approved.',
    features: ['Clause-by-clause gap analysis', 'Drill & exercise management', 'Plan lifecycle tracking'],
  },
  {
    code: 'omniCRISIS', href: '/platform/omnicrisis',
    short: 'Real-time crisis command',
    detail: 'ICS-based crisis management with real-time incident tracking, role assignments and structured post-incident review.',
    features: ['ICS role structure', 'Escalation protocols', 'After-action learning'],
  },
  {
    code: 'omniAUDIT', href: '/platform/omniaudit',
    short: 'Compliance scorecards',
    detail: 'Continuous compliance monitoring across Sendai Framework, ISO 22301, BDDK and Basel III — audit-ready at all times.',
    features: ['Multi-framework tracking', 'Evidence collection', 'Automated gap analysis'],
  },
  {
    code: 'omniVENDOR', href: '/platform/omnivendor',
    short: 'Third-party risk assessment',
    detail: 'Score, monitor and tier critical suppliers against disruption risk — from natural hazard cascades to cyber dependencies.',
    features: ['Supplier risk scoring', 'Dependency mapping', 'Cascade analysis'],
  },
  {
    code: 'omniPIPE', href: '/platform/omnipipe',
    short: 'Pipeline & energy risk',
    detail: 'Purpose-built for pipeline operators, LNG terminals and energy distributors — quantitative consequence modeling and structural integrity assessment.',
    features: ['Gas release consequence modeling', 'Pipeline integrity scoring', 'SCADA integration ready'],
    soon: true,
  },
  {
    code: 'omniHRO', href: '/platform/omni-hro',
    short: 'Near miss & reliability culture',
    detail: 'Operational signal intelligence for high-reliability organizations. Near-miss reporting, culture measurement and reliability coefficient scoring.',
    features: ['Structured near-miss reporting', 'HRO alpha coefficient scoring', 'Reliability culture survey'],
    soon: true,
  },
]

/* ── page ────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [activeMod, setActiveMod] = useState(0)
  const mod = MODULES[activeMod]

  return (
    <div style={{ fontFamily: FONT, background: C.navy950, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        body{-webkit-font-smoothing:antialiased;background:${C.navy950}}
        .mod-row{cursor:pointer;transition:background .15s}
        .mod-row:hover{background:${C.navy900}!important}
        .sector-card{transition:border-color .18s,transform .18s;cursor:default}
        .sector-card:hover{border-color:${C.teal}!important;transform:translateY(-2px)}
        .cta-pill{transition:background .15s,transform .15s}
        .cta-pill:hover{background:${C.tealL}!important;transform:scale(1.02)}
        .ghost-pill{transition:border-color .15s}
        .ghost-pill:hover{border-color:${C.teal}!important;color:#fff!important}
        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr!important}
          .hero-right{display:none!important}
          .mod-grid{grid-template-columns:1fr!important}
          .metrics-grid{grid-template-columns:repeat(2,1fr)!important}
          .sectors-grid{grid-template-columns:1fr!important}
          .cs-grid{grid-template-columns:1fr!important}
          .footer-grid{grid-template-columns:1fr!important;gap:40px!important}
        }
      `}</style>

      {/* ── NAV ────────────────────────────────────────────────────── */}
      <Nav />

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section style={{
        minHeight: 'calc(100vh - 64px)',
        background: C.navy900,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        padding: '80px 40px',
      }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '70%', height: '100%',
            background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(0,155,141,0.06) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '70%',
            background: 'radial-gradient(ellipse 50% 40% at 10% 80%, rgba(0,155,141,0.04) 0%, transparent 70%)' }} />
        </div>

        <div className="hero-grid" style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '55% 45%', gap: 80, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, color: C.teal,
              letterSpacing: '2px', textTransform: 'uppercase',
              border: `1px solid ${C.teal}40`, borderRadius: 20, padding: '4px 14px', marginBottom: 32,
            }}>
              Enterprise Resilience Platform
            </div>

            <h1 style={{ lineHeight: 1.0, marginBottom: 24 }}>
              <span style={{ display: 'block', fontSize: 'clamp(44px,5.5vw,72px)', fontWeight: 800, color: '#0A1628', letterSpacing: '-0.03em' }}>Quantify Risk.</span>
              <span style={{ display: 'block', fontSize: 'clamp(44px,5.5vw,72px)', fontWeight: 800, color: C.teal, letterSpacing: '-0.03em', marginTop: 4 }}>Ensure Continuity.</span>
              <span style={{ display: 'block', fontSize: 'clamp(44px,5.5vw,72px)', fontWeight: 800, color: '#0A1628', letterSpacing: '-0.03em', marginTop: 4 }}>Manage Crises.</span>
            </h1>

            <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
              An integrated platform for organizational resilience — disaster risk assessment, business continuity and crisis management in one workspace.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
              <Link href="/platform/omnirisk" className="cta-pill" style={{
                fontSize: 16, fontWeight: 600, color: '#0A1628', fontFamily: FONT,
                background: C.teal, padding: '14px 32px', borderRadius: 30, display: 'inline-block',
              }}>
                Explore Platform
              </Link>
              <Link href="/methodology" className="ghost-pill" style={{
                fontSize: 16, fontWeight: 600, color: C.muted, fontFamily: FONT,
                padding: '14px 32px', borderRadius: 30, border: `1px solid ${C.border}`,
                display: 'inline-block',
              }}>
                Watch Overview
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {['ISO 22301 Aligned', 'FEMA Core Capabilities', 'ITU AYM Validated'].map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
                  <span style={{ color: C.green, fontWeight: 700 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — product cards */}
          <div className="hero-right" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { code: 'omniRISK — Quantitative Risk Scoring', sub: 'URI score for every facility. Multi-parameter model.', active: true, href: '/platform/omnirisk' },
              { code: 'omniPLAN — Business Continuity Management', sub: 'ISO 22301 aligned. RTO/RPO tracking.', active: false, href: '/platform/omniplan' },
              { code: 'omniCRISIS — Real-Time Crisis Command', sub: 'Live incident management. Post-event analysis.', active: false, href: '/platform/omnicrisis' },
            ].map((card, i) => (
              <Link key={i} href={card.href} style={{
                display: 'block',
                background: card.active ? C.navy800 : C.navy900,
                border: `1px solid ${card.active ? C.teal : C.border}`,
                borderRadius: 12, padding: '20px 20px 20px 20px',
                textDecoration: 'none',
                transition: 'border-color .15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = card.active ? C.teal : C.border)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: card.active ? C.teal : C.muted, flexShrink: 0, marginTop: 5 }} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: card.active ? '#fff' : C.muted, marginBottom: 4 }}>{card.code}</div>
                      <div style={{ fontSize: 13, color: card.active ? C.muted : '#475569' }}>{card.sub}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 16, color: card.active ? C.teal : '#475569', flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
            <Link href="#modules" style={{ fontSize: 13, color: C.teal, fontWeight: 600, marginTop: 4, fontFamily: FONT }}>
              + 5 more modules →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST BAND ─────────────────────────────────────────────── */}
      <section style={{ background: C.navy950, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '32px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 24 }}>
            Trusted across critical sectors
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {['BANKING','HEALTHCARE','ENERGY','INDUSTRY','PUBLIC SECTOR','EDUCATION','CRITICAL INFRASTRUCTURE'].map(s => (
              <span key={s} style={{ fontSize: 12, fontWeight: 600, color: '#475569', letterSpacing: '1px' }}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM MODULES ───────────────────────────────────────── */}
      <section id="modules" style={{ background: C.navy950, padding: '120px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16 }}>
              THE PLATFORM
            </p>
            <h2 style={{ fontSize: 'clamp(36px,4.5vw,52px)', fontWeight: 800, color: '#0A1628', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16 }}>
              One Platform. <span style={{ color: C.teal }}>Every Risk.</span>
            </h2>
            <p style={{ fontSize: 18, color: C.muted, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
              Six integrated modules covering the complete resilience lifecycle — from first assessment to live crisis command.
            </p>
          </div>

          {/* 2-col layout */}
          <div className="mod-grid" style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 24, alignItems: 'start' }}>
            {/* Left list */}
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              {MODULES.map((m, i) => (
                <div
                  key={m.code}
                  className="mod-row"
                  onClick={() => setActiveMod(i)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: i < MODULES.length - 1 ? `1px solid ${C.border}` : 'none',
                    borderLeft: activeMod === i ? `3px solid ${C.teal}` : '3px solid transparent',
                    background: activeMod === i ? C.navy800 : C.navy950,
                    opacity: m.soon && activeMod !== i ? 0.6 : 1,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: activeMod === i ? '#fff' : C.muted, fontFamily: FONT }}>
                      {m.code}
                    </span>
                    {m.soon && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: C.amber, border: `1px solid ${C.amber}50`, borderRadius: 4, padding: '1px 6px', letterSpacing: 1, textTransform: 'uppercase' as const }}>
                        Soon
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: '#475569' }}>{m.short}</div>
                </div>
              ))}
            </div>

            {/* Right detail */}
            <div style={{ background: C.navy900, border: `1px solid ${C.border}`, borderRadius: 16, padding: '40px 36px', minHeight: 360 }}>
              <div style={{ borderLeft: `3px solid ${C.teal}`, paddingLeft: 16, marginBottom: 20 }}>
                <h3 style={{ fontSize: 28, fontWeight: 700, color: '#0A1628', fontFamily: FONT, marginBottom: 8 }}>{mod.code}</h3>
                <p style={{ fontSize: 16, color: C.muted }}>{mod.short}</p>
              </div>
              <p style={{ fontSize: 15, color: C.dim, lineHeight: 1.75, marginBottom: 28 }}>{mod.detail}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {mod.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: C.teal, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: '#0A1628' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href={mod.href} style={{ fontSize: 14, fontWeight: 600, color: C.teal, fontFamily: FONT }}>
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS BAND ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 40px', background: C.navy950 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="metrics-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden',
          }}>
            {[
              { num: '782+',  title: 'Facilities Assessed',    sub: 'In a single metropolitan deployment' },
              { num: '103',   title: 'Critical Risk Points',   sub: 'Identified across industrial clusters' },
              { num: '94%',   title: 'Compliance Rate',        sub: 'Across assessed organizations' },
              { num: '03:00', title: 'The Hour Systems Fail',  sub: 'We\'re already prepared' },
            ].map((m, i) => (
              <div key={i} style={{
                padding: '48px 32px', textAlign: 'center',
                borderRight: i < 3 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: C.teal, fontFamily: "'DM Mono', monospace", lineHeight: 1, marginBottom: 12 }}>{m.num}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0A1628', marginBottom: 6 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTORS ────────────────────────────────────────────────── */}
      <section style={{ background: C.navy950, padding: '80px 40px 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(32px,4vw,42px)', fontWeight: 800, color: '#0A1628', letterSpacing: '-0.02em', marginBottom: 16 }}>
              Purpose-Built for Every Sector
            </h2>
            <p style={{ fontSize: 18, color: C.muted, maxWidth: 540, margin: '0 auto' }}>
              Sector-specific risk models, regulatory frameworks and compliance requirements — built in.
            </p>
          </div>
          <div className="sectors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { name: 'Banking & Finance',        ref: 'BDDK · Basel III · ISO 22301',  desc: 'Operational risk inventory and business continuity planning aligned to banking regulators.',       href: '/solutions/banking' },
              { name: 'Healthcare & Hospital',    ref: 'JCI · Kaiser HVA · HEICS',      desc: 'Critical patient service continuity and emergency operations center integration.',                 href: '/solutions/health'  },
              { name: 'Industrial & Manufacturing', ref: 'NATECH · SEVESO III · ISO 45001', desc: 'NATECH cascade scenario analysis and supply chain disruption modeling.',                       href: '/solutions'         },
              { name: 'Energy & Utilities',       ref: 'EPDK · Pipeline Safety · SCADA', desc: 'Infrastructure risk modeling for energy distributors, terminals and pipeline operators.',         href: '/solutions/energy'  },
              { name: 'Public Sector',            ref: 'AFAD · Sendai Framework · FEMA',  desc: 'Urban-scale vulnerability assessment and investment planning for municipalities.',               href: '/solutions'         },
              { name: 'Education',                ref: 'Campus Safety · Emergency Planning', desc: 'School disaster risk management plans, drill management and resilience assessment.',           href: '/solutions'         },
            ].map((s, i) => (
              <div key={i} className="sector-card" style={{
                background: C.navy900, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 32,
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A1628', marginBottom: 8 }}>{s.name}</h3>
                <p style={{ fontSize: 12, color: C.dim, marginBottom: 12, letterSpacing: '0.3px' }}>{s.ref}</p>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
                <Link href={s.href} style={{ fontSize: 13, fontWeight: 600, color: C.teal, fontFamily: FONT }}>View solutions →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ───────────────────────────────────────────── */}
      <section style={{ background: C.navy900, padding: '120px 40px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: '#0A1628', letterSpacing: '-0.02em', marginBottom: 48 }}>
            Real Deployments. Measurable Outcomes.
          </h2>
          <div className="cs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              {
                label: 'METROPOLITAN DEPLOYMENT',
                num: '782', numSub: 'facilities assessed across 10 neighborhoods and 6 sectors in metropolitan Istanbul',
                result: '103 critical risk points identified',
              },
              {
                label: 'BANKING SECTOR',
                num: '94%', numSub: 'operational resilience compliance rate achieved across multi-branch assessment',
                result: 'BDDK requirements fully mapped and verified',
              },
            ].map((cs, i) => (
              <div key={i} style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 16, padding: 48 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>{cs.label}</p>
                <div style={{ fontSize: 'clamp(52px,6vw,72px)', fontWeight: 800, color: C.teal, fontFamily: "'DM Mono', monospace", lineHeight: 1, marginBottom: 12 }}>{cs.num}</div>
                <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>{cs.numSub}</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#0A1628' }}>{cs.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section style={{
        padding: '160px 40px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F8FAFC 100%)',
        borderTop: `1px solid ${C.border}`,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800, color: '#0A1628', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16 }}>
            Start measuring resilience.
          </h2>
          <p style={{ fontSize: 20, color: C.muted, lineHeight: 1.7, marginBottom: 48 }}>
            No commitment. Our advisory team walks you through your first assessment.
          </p>
          <Link href="/login" className="cta-pill" style={{
            fontSize: 18, fontWeight: 600, color: '#0A1628', fontFamily: FONT,
            background: C.teal, padding: '18px 48px', borderRadius: 30, display: 'inline-block',
          }}>
            Request Free Assessment →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}
