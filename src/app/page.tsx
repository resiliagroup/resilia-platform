'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const N = '#0A1628'
const T = '#2D8A87'
const BG = '#FAFAFA'
const BORDER = '#E5E7EB'

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return scrolled
}

/* ── NAV ───────────────────────────────────────────────────────── */
function Nav() {
  const scrolled = useScrolled()
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
      height: 60,
      background: scrolled ? 'rgba(250,250,250,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent',
      display: 'flex', alignItems: 'center',
      transition: 'background 0.2s, border-color 0.2s',
    }}>
      <div style={{
        maxWidth: 1200, width: '100%', margin: '0 auto',
        padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: N, letterSpacing: -0.5, lineHeight: 1 }}>OMNIVERSEL</span>
            <span style={{ fontSize: 9, fontWeight: 500, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>Urban Resilience Platform</span>
          </div>
        </Link>

        {/* Center links */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {[
            ['Platform', '/platform/omnirisk'],
            ['Solutions', '/solutions'],
            ['Methodology', '/methodology'],
            ['Pricing', '/pricing'],
            ['About', '/about'],
          ].map(([label, href]) => (
            <Link key={label} href={href} style={{
              fontSize: 14, fontWeight: 500, color: '#5A6A7A',
              textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = N)}
              onMouseLeave={e => (e.currentTarget.style.color = '#5A6A7A')}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right CTAs */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/login" style={{
            fontSize: 14, fontWeight: 600, color: N,
            padding: '8px 18px', borderRadius: 8, border: `1px solid ${BORDER}`,
            textDecoration: 'none', background: 'transparent', transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#9CA3AF')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}>
            Sign in
          </Link>
          <Link href="/login" style={{
            fontSize: 14, fontWeight: 700, color: '#fff',
            padding: '8px 20px', borderRadius: 8, background: T,
            textDecoration: 'none', transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Request Demo
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ── DASHBOARD MOCK ─────────────────────────────────────────────── */
function DashboardMock() {
  return (
    <div style={{
      background: N, borderRadius: 16, overflow: 'hidden',
      border: '1px solid #1E2A3A', boxShadow: '0 24px 64px rgba(10,22,40,0.18)',
    }}>
      {/* Titlebar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 18px', borderBottom: '1px solid #1E2A3A', background: '#0D1E34',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 10, fontFamily: 'monospace', letterSpacing: 0.5 }}>
          Omniversel Platform — Live
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          {/* Risk Score */}
          <div style={{ background: '#0D1E34', borderRadius: 10, padding: '16px 18px', border: '1px solid #1E3450' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Facility Risk Score</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: T, fontFamily: 'monospace', lineHeight: 1, marginBottom: 8 }}>78.4</div>
            <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700, color: '#34D399', marginBottom: 10 }}>Resilient</div>
            <div style={{ height: 4, background: '#1E3450', borderRadius: 2 }}>
              <div style={{ width: '78%', height: '100%', background: T, borderRadius: 2 }} />
            </div>
          </div>

          {/* Critical Alerts */}
          <div style={{ background: '#0D1E34', borderRadius: 10, padding: '16px 18px', border: '1px solid #1E3450' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Critical Alerts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { dot: '#EF4444', text: 'Generator backup overdue' },
                { dot: '#F97316', text: 'BCP review pending — Q1' },
                { dot: '#F59E0B', text: 'Supplier Tier-1 gap detected' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{a.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', background: '#0D1E34', borderRadius: 10, border: '1px solid #1E3450', overflow: 'hidden' }}>
          {[['782', 'Facilities'], ['103', 'Critical'], ['94%', 'Compliant']].map(([v, l], i) => (
            <div key={i} style={{
              padding: '12px 16px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid #1E3450' : 'none',
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── MODULE DATA ─────────────────────────────────────────────────── */
const MODULES = [
  {
    code: 'omniRISK', href: '/platform/omnirisk',
    desc: 'Quantitative risk scoring',
    detail: 'Multi-parameter facility risk scoring — hazard, fragility, exposure and capacity synthesized into a single, auditable resilience index.',
    features: ['Facility-level resilience score', 'Sector & hazard calibration', 'FEMA mission area alignment'],
  },
  {
    code: 'omniIMPACT', href: '/platform/omniimpact',
    desc: 'Business impact analysis',
    detail: 'Identify critical functions, model downtime costs and establish evidence-based RTO/RPO targets for every business unit.',
    features: ['Critical function prioritization', 'Downtime cost modeling', 'MTPD and RTO/RPO tracking'],
  },
  {
    code: 'omniPLAN', href: '/platform/omniplan',
    desc: 'ISO 22301 BCM planning',
    detail: 'Build, test and maintain business continuity plans aligned to ISO 22301 — with lifecycle management from draft to approved.',
    features: ['Clause-by-clause gap analysis', 'Drill & exercise management', 'Plan lifecycle tracking'],
  },
  {
    code: 'omniCRISIS', href: '/platform/omnicrisis',
    desc: 'Crisis command center',
    detail: 'ICS-based crisis management with real-time incident tracking, role assignments and structured post-incident review.',
    features: ['ICS role structure', 'Escalation protocols', 'After-action learning'],
  },
  {
    code: 'omniAUDIT', href: '/platform/omniaudit',
    desc: 'Compliance & audit management',
    detail: 'Continuous compliance monitoring across Sendai Framework, ISO 22301, BDDK and Basel III — audit-ready at all times.',
    features: ['Multi-framework tracking', 'Evidence collection', 'Automated gap analysis'],
  },
  {
    code: 'omniVENDOR', href: '/platform/omnivendor',
    desc: 'Supply chain resilience',
    detail: 'Score, monitor and tier critical suppliers against disruption risk — from natural hazard cascades to cyber dependencies.',
    features: ['Supplier risk scoring', 'Dependency mapping', 'Cascade analysis'],
  },
]

/* ── SECTORS ────────────────────────────────────────────────────── */
const SECTORS = [
  { name: 'Banking & Finance',        desc: 'Operational risk inventory and business continuity aligned to BDDK and Basel III requirements.',      ref: 'BDDK · Basel III · ISO 22301' },
  { name: 'Healthcare & Hospital',    desc: 'Critical patient service continuity and emergency operations center integration for medical facilities.', ref: 'JCI · ISO 22301 · Sendai SF' },
  { name: 'Industry & Manufacturing', desc: 'NATECH cascade scenario analysis and supply chain disruption modeling for industrial facilities.',      ref: 'ISO 31000 · RAPID-N · Sendai SF' },
  { name: 'Public & Municipality',    desc: 'Urban-scale vulnerability assessment and investment planning aligned to Sendai Framework priorities.',   ref: 'Sendai SF · ISO 22301' },
  { name: 'Critical Infrastructure',  desc: 'N-1 analysis for energy, water and transport systems with dependency mapping across networks.',          ref: 'ISO 22301 · CIP standards' },
  { name: 'Education Institutions',   desc: 'School disaster risk management plans, drill management and resilience assessment frameworks.',          ref: 'Sendai SF · ISO 22301' },
]

/* ── PAGE ───────────────────────────────────────────────────────── */
export default function HomePage() {
  const [activeModule, setActiveModule] = useState(0)
  const mod = MODULES[activeModule]

  return (
    <div style={{ background: BG, fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        body{-webkit-font-smoothing:antialiased}
        .sector-card:hover{border-left:3px solid ${T}!important;background:#F0F9F8!important}
        .sector-card:hover .sector-arrow{opacity:1!important}
        .mod-row:hover{background:#F0F9F8!important}
      `}</style>

      <Nav />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 120, paddingBottom: 100, padding: '120px 40px 100px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 24 }}>
              Enterprise Resilience Platform
            </div>
            <h1 style={{
              fontSize: 'clamp(48px,6vw,72px)', fontWeight: 800, color: N,
              lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24,
              whiteSpace: 'pre-line',
            }}>
              {'Resilience,\nReimagined.'}
            </h1>
            <p style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
              An integrated platform for organizational resilience — disaster risk assessment, business continuity and crisis management in one workspace.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
              <Link href="/platform/omnirisk" style={{
                fontSize: 16, fontWeight: 700, color: '#fff', background: T,
                padding: '14px 32px', borderRadius: 10, display: 'inline-block', transition: 'opacity 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                Explore Platform
              </Link>
              <Link href="/methodology" style={{
                fontSize: 16, fontWeight: 600, color: N,
                padding: '14px 32px', borderRadius: 10, border: `1px solid ${BORDER}`,
                display: 'inline-block', background: '#fff', transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#9CA3AF')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}>
                Watch Overview
              </Link>
            </div>
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>
              Trusted by critical infrastructure operators across Turkey.
            </p>
          </div>

          {/* Right — Dashboard */}
          <DashboardMock />
        </div>
      </section>

      {/* ── TRUST BAND ────────────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '28px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>
            Trusted across sectors
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
            {['BANKING', 'HEALTHCARE', 'INDUSTRY', 'PUBLIC SECTOR', 'EDUCATION', 'CRITICAL INFRASTRUCTURE'].map((s, i) => (
              <span key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#C4CDD5', letterSpacing: '1.5px' }}>{s}</span>
                {i < 5 && <span style={{ display: 'inline-block', width: 1, height: 14, background: '#D1D5DB', margin: '0 20px' }} />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM MODULES ──────────────────────────────────────── */}
      <section style={{ padding: '120px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, color: N, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 16 }}>
              One platform.<br />
              <span style={{ color: T }}>Six integrated modules.</span>
            </h2>
            <p style={{ fontSize: 18, color: '#6B7280', maxWidth: 540 }}>
              From first assessment to live crisis command — everything in one workspace.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, alignItems: 'start' }}>
            {/* Module list */}
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
              {MODULES.map((m, i) => (
                <div
                  key={m.code}
                  className="mod-row"
                  onClick={() => setActiveModule(i)}
                  style={{
                    padding: '18px 24px',
                    borderBottom: i < MODULES.length - 1 ? `1px solid ${BORDER}` : 'none',
                    borderLeft: activeModule === i ? `3px solid ${T}` : '3px solid transparent',
                    background: activeModule === i ? '#F0F9F8' : '#fff',
                    cursor: 'pointer',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: activeModule === i ? T : N, marginBottom: 3 }}>
                    {m.code}
                  </div>
                  <div style={{ fontSize: 13, color: '#9CA3AF' }}>{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Module detail */}
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: '36px 32px', background: '#fff', minHeight: 360 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>
                {mod.code}
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: N, marginBottom: 16, lineHeight: 1.3 }}>
                {mod.desc}
              </h3>
              <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.75, marginBottom: 28 }}>
                {mod.detail}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {mod.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: T, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: '#374151' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href={mod.href} style={{ fontSize: 14, fontWeight: 600, color: T }}>
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUILT DIFFERENT ───────────────────────────────────────── */}
      <section style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
          {[
            { stat: '782+', body: 'Facilities assessed in a single metropolitan deployment' },
            { stat: '6',    body: 'Integrated modules covering the complete BCM lifecycle' },
            { stat: '03:00', body: 'The hour when systems fail. We\'re already ready.' },
          ].map((d, i) => (
            <div key={i} style={{
              padding: '56px 48px',
              borderRight: i < 2 ? `1px solid ${BORDER}` : 'none',
            }}>
              <div style={{ fontSize: 'clamp(40px,4vw,56px)', fontWeight: 800, color: N, fontFamily: 'DM Mono, monospace', lineHeight: 1, marginBottom: 16 }}>
                {d.stat}
              </div>
              <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.6, maxWidth: 240 }}>{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTORS ───────────────────────────────────────────────── */}
      <section style={{ padding: '120px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 800, color: N, letterSpacing: '-0.02em', marginBottom: 56 }}>
            Purpose-built for every sector.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
            {SECTORS.map((s, i) => (
              <div
                key={i}
                className="sector-card"
                style={{
                  padding: '28px 24px',
                  border: `1px solid ${BORDER}`,
                  borderLeft: '3px solid transparent',
                  borderRadius: 2,
                  background: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: N, marginBottom: 8 }}>{s.name}</h3>
                <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 12 }}>{s.desc}</p>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginBottom: 12 }}>{s.ref}</div>
                <span className="sector-arrow" style={{ fontSize: 13, fontWeight: 600, color: T, opacity: 0, transition: 'opacity 0.15s' }}>
                  View details →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ──────────────────────────────────────────── */}
      <section style={{ padding: '0 40px 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 800, color: N, letterSpacing: '-0.02em', marginBottom: 40 }}>
            Real deployments. Measurable outcomes.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              {
                label: 'Metropolitan Risk Assessment',
                body: '782 facilities. 10 neighborhoods. 6 sectors. 103 critical risk points identified across industrial clusters in metropolitan Istanbul.',
                stat: '782', statLabel: 'Facilities assessed',
                sub: '103 critical · 10 neighborhoods · 6 sectors',
              },
              {
                label: 'Banking Sector BCM',
                body: 'Multi-branch financial institution assessment. BDDK operational resilience requirements mapped. RTO/RPO targets established and verified.',
                stat: 'BDDK', statLabel: 'Requirements mapped',
                sub: 'Basel III aligned · RTO/RPO verified · Audit-ready',
              },
            ].map((cs, i) => (
              <div key={i} style={{ background: N, borderRadius: 16, padding: '48px 40px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>
                  {cs.label}
                </div>
                <div style={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: 800, color: T, fontFamily: 'DM Mono, monospace', lineHeight: 1, marginBottom: 16 }}>
                  {cs.stat}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{cs.statLabel}</div>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 20 }}>{cs.body}</p>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>{cs.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section style={{ background: N, padding: '160px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 20 }}>
            Start measuring resilience.
          </h2>
          <p style={{ fontSize: 18, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 48 }}>
            No commitment. Our advisory team walks you through your first assessment.
          </p>
          <Link href="/login" style={{
            fontSize: 17, fontWeight: 700, color: '#fff', background: T,
            padding: '18px 48px', borderRadius: 12, display: 'inline-block', transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Request Free Assessment →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer style={{ background: '#080F1C', borderTop: '1px solid #1E2A3A', padding: '64px 40px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 64, marginBottom: 48 }}>
            {/* Left */}
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: -0.5, marginBottom: 4 }}>OMNIVERSEL</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Urban Resilience Platform</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
                Quantitative resilience software for organizations operating in complex, high-stakes environments.
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 Omniversel · All rights reserved</p>
            </div>

            {/* Platform + Solutions */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Platform</div>
              {[
                ['Platform Overview', '/platform/omnirisk'],
                ['Solutions', '/solutions'],
                ['Methodology', '/methodology'],
                ['Pricing', '/pricing'],
                ['About', '/about'],
              ].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 12, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
                  {l}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Contact</div>
              <a href="mailto:demo@omniversel.com" style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 12, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
                demo@omniversel.com
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.45)', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1E2A3A', paddingTop: 24 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', textAlign: 'center' }}>
              Omniversel · ITU AYM Partnership · ISO 22301 · Sendai Framework
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
