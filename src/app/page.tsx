import Link from 'next/link'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import styles from './home.module.css'
import HomeNav from '@/components/home/HomeNav'
import HomeFooter from '@/components/home/HomeFooter'
import HeroField from '@/components/home/HeroField'
import Reveal from '@/components/home/Reveal'
import FacilityCloud from '@/components/home/FacilityCloud'
import {
  RiskMotif, ImpactMotif, PlanMotif, CrisisMotif, AuditMotif, VendorMotif, SoonMotif,
} from '@/components/home/Motifs'

const MODULES = [
  {
    code: 'omniRISK', href: '/platform/omnirisk', span: styles.c7, dark: true, Motif: RiskMotif,
    title: 'Quantitative facility risk scoring',
    text: 'Hazard, fragility, exposure and capacity synthesized into a single, auditable resilience index.',
    features: ['URI score for every facility', 'Sector & hazard calibration', 'FEMA mission area alignment'],
  },
  {
    code: 'omniIMPACT', href: '/platform/omniimpact', span: styles.c5, Motif: ImpactMotif,
    title: 'Business impact analysis & downtime modeling',
    text: 'Identify critical functions, model downtime costs and set evidence-based RTO/RPO targets.',
    features: ['Critical function prioritization', 'MTPD and RTO/RPO tracking'],
  },
  {
    code: 'omniPLAN', href: '/platform/omniplan', span: styles.c4, Motif: PlanMotif,
    title: 'Business continuity planning',
    text: 'Plans aligned to ISO 22301, from draft to approved, with drills and exercises.',
    features: ['Clause-by-clause gap analysis', 'Plan lifecycle tracking'],
  },
  {
    code: 'omniCRISIS', href: '/platform/omnicrisis', span: styles.c4, Motif: CrisisMotif,
    title: 'Real-time crisis command',
    text: 'ICS-based incident tracking, role assignments and structured post-incident review.',
    features: ['ICS role structure', 'After-action learning'],
  },
  {
    code: 'omniAUDIT', href: '/platform/omniaudit', span: styles.c4, Motif: AuditMotif,
    title: 'Compliance scorecards',
    text: 'Continuous monitoring across Sendai Framework, ISO 22301, BDDK and Basel III.',
    features: ['Multi-framework tracking', 'Automated gap analysis'],
  },
  {
    code: 'omniVENDOR', href: '/platform/omnivendor', span: styles.c5, Motif: VendorMotif,
    title: 'Third-party risk assessment',
    text: 'Score, monitor and tier critical suppliers, from natural hazard cascades to cyber dependencies.',
    features: ['Supplier risk scoring', 'Dependency & cascade mapping'],
  },
]

const SECTORS = [
  { name: 'Banking & Finance', ref: 'BDDK · Basel III · ISO 22301', desc: 'Operational risk inventory and business continuity planning aligned to banking regulators.', href: '/solutions/banking' },
  { name: 'Healthcare & Hospital', ref: 'JCI · Kaiser HVA · HEICS', desc: 'Critical patient service continuity and emergency operations center integration.', href: '/solutions/health' },
  { name: 'Industrial & Manufacturing', ref: 'NATECH · SEVESO III · ISO 45001', desc: 'NATECH cascade scenario analysis and supply chain disruption modeling.', href: '/solutions/industrial' },
  { name: 'Energy & Utilities', ref: 'EPDK · Pipeline Safety · SCADA', desc: 'Infrastructure risk modeling for energy distributors, terminals and pipeline operators.', href: '/solutions/energy' },
  { name: 'Public Sector', ref: 'AFAD · Sendai Framework · FEMA', desc: 'Urban-scale vulnerability assessment and investment planning for municipalities.', href: '/solutions/public-sector' },
  { name: 'Education', ref: 'Campus Safety · Emergency Planning', desc: 'School disaster risk management plans, drill management and resilience assessment.', href: '/solutions/education' },
]

export default function HomePage() {
  return (
    <div className={styles.root}>
      <a href="#main" className={styles.skip}>Skip to main content</a>
      <HomeNav />

      <main id="main">
        {/* ── Karşılama ─────────────────────────────────────── */}
        <section className={styles.hero} aria-label="Omniversel">
          <HeroField />
          <div className={styles.grain} aria-hidden="true" />
          <div className={styles.shade} aria-hidden="true" />
          <div className={`${styles.wrap} ${styles.heroInner}`}>
            <span className={`${styles.mono} ${styles.eyebrow}`}>Enterprise Resilience Platform</span>
            <h1 className={styles.h1}>
              <span>Quantify risk.</span> <span><em>Ensure continuity.</em></span> <span>Manage crises.</span>
            </h1>
            <p className={styles.lead}>
              An integrated platform for organizational resilience: disaster risk assessment, business continuity and crisis management in one workspace.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/login" className={`${styles.tag} ${styles.tagPrimary}`}>Request free assessment →</Link>
              <a href="#platform" className={styles.tag}>Explore platform</a>
            </div>
            <div className={styles.heroFoot}>
              <div className={`${styles.mono} ${styles.trust}`}>
                <span>ISO 22301 aligned</span>
                <span>FEMA core capabilities</span>
                <span>ITU AYM validated</span>
              </div>
              <div className={styles.readout} aria-label="Örnek skor göstergesi">
                <div className={`${styles.mono} rTop`} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>
                  <span>Resilience index</span><span>Illustrative</span>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 34, letterSpacing: '-0.02em', lineHeight: 1 }}>0.68</div>
                <div className="rBar" style={{ height: 3, marginTop: 14, background: 'rgba(255,255,255,0.14)', position: 'relative' }}>
                  <i style={{ position: 'absolute', inset: '0 auto 0 0', width: '68%', background: 'linear-gradient(90deg,#009b8d,#f59e0b)' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Misyon ────────────────────────────────────────── */}
        <section className={styles.section} id="mission">
          <div className={styles.wrap}>
            <Reveal className={styles.split}>
              <span className={`${styles.mono} ${styles.label}`}>01 / Mission</span>
              <p className={styles.statement}>
                We turn hazard, fragility and exposure data into one auditable score, so organizations can <b>prove, not assume,</b> that they will keep operating when disaster strikes.
              </p>
            </Reveal>
          </div>
        </section>
        <div className={styles.rule} aria-hidden="true" />

        {/* ── Platform ──────────────────────────────────────── */}
        <section className={styles.section} id="platform">
          <div className={styles.wrap}>
            <Reveal>
              <span className={`${styles.mono} ${styles.label}`}>02 / Platform</span>
              <h2 className={styles.statement}>One platform. <b>Every risk.</b></h2>
              <p style={{ color: 'var(--muted)', fontSize: 18, maxWidth: '52ch', lineHeight: 1.55, marginTop: 18 }}>
                Six integrated modules covering the complete resilience lifecycle, from first assessment to live crisis command.
              </p>
            </Reveal>

            <div className={styles.modGrid}>
              {MODULES.map(({ code, href, span, dark, Motif, title, text, features }) => (
                <Reveal key={code} className={span}>
                  <Link href={href} className={`${styles.card} ${dark ? styles.cardDark : ''}`} style={{ height: '100%' }}>
                    <div>
                      <div className={styles.cardTop}>
                        <span className={styles.code}>{code}</span>
                        <Motif dark={dark} />
                      </div>
                      <h3 className={styles.cardTitle}>{title}</h3>
                      <p className={styles.cardText}>{text}</p>
                      <ul className={styles.feat}>
                        {features.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </div>
                    <span className={styles.more}>Learn more →</span>
                  </Link>
                </Reveal>
              ))}

              <Reveal className={styles.c7}>
                <div className={styles.card} style={{ height: '100%', borderStyle: 'dashed' }}>
                  <div>
                    <div className={styles.cardTop}>
                      <span className={styles.code}>Roadmap</span>
                      <SoonMotif />
                    </div>
                    <h3 className={styles.cardTitle}>Coming next</h3>
                    <p className={styles.cardText}>
                      <b style={{ color: 'var(--text)', fontWeight: 500 }}>omniPIPE</b> brings quantitative consequence modeling to pipeline operators and energy distributors.{' '}
                      <b style={{ color: 'var(--text)', fontWeight: 500 }}>omniHRO</b> adds near-miss reporting and reliability culture scoring for high-reliability organizations.
                    </p>
                  </div>
                  <span className={`${styles.mono}`} style={{ color: 'var(--amber)' }}>In development</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Kanıt ─────────────────────────────────────────── */}
        <section className={styles.evidence} id="evidence">
          <div className={styles.wrap}>
            <div className={styles.evGrid}>
              <Reveal><FacilityCloud /></Reveal>
              <Reveal>
                <span className={`${styles.mono} ${styles.label}`} style={{ color: 'rgba(255,255,255,0.55)' }}>03 / Evidence</span>
                <h2 className={styles.evH}>Measured in real facilities, not slides.</h2>
                <div className={styles.stats}>
                  {[
                    ['782+', 'Facilities assessed', 'In a single metropolitan deployment'],
                    ['103', 'Critical risk points', 'Identified across industrial clusters'],
                    ['94%', 'Compliance rate', 'Across assessed organizations'],
                    ['03:00', 'The hour systems fail', "We're already prepared"],
                  ].map(([n, t, s]) => (
                    <div key={t} className={styles.stat}>
                      <div className={styles.sNum}>{n}</div>
                      <div className={styles.sTitle}>{t}</div>
                      <div className={styles.sSub}>{s}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className={styles.cases}>
              <Reveal>
                <div className={styles.case}>
                  <span className={`${styles.mono}`} style={{ color: 'var(--teal-2)' }}>Metropolitan deployment</span>
                  <p><b>782 facilities</b> assessed across 10 neighborhoods and 6 sectors in metropolitan Istanbul. 103 critical risk points identified.</p>
                </div>
              </Reveal>
              <Reveal>
                <div className={styles.case}>
                  <span className={`${styles.mono}`} style={{ color: 'var(--teal-2)' }}>Banking sector</span>
                  <p><b>94% operational resilience compliance</b> achieved across a multi-branch assessment. BDDK requirements fully mapped and verified.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Sektörler ─────────────────────────────────────── */}
        <section className={styles.section} id="sectors">
          <div className={styles.wrap}>
            <Reveal>
              <span className={`${styles.mono} ${styles.label}`}>04 / Sectors</span>
              <h2 className={styles.statement}>Purpose-built for <b>every sector.</b></h2>
              <p style={{ color: 'var(--muted)', fontSize: 18, maxWidth: '52ch', lineHeight: 1.55, marginTop: 18 }}>
                Sector-specific risk models, regulatory frameworks and compliance requirements, built in.
              </p>
            </Reveal>
            <div className={styles.rows}>
              {SECTORS.map((s) => (
                <Reveal key={s.name}>
                  <Link href={s.href} className={styles.row}>
                    <span className={styles.rowName}>{s.name}</span>
                    <span className={`${styles.mono} ${styles.rowRef}`}>{s.ref}</span>
                    <span className={styles.rowDesc}>{s.desc}</span>
                    <span className={styles.arrow} aria-hidden="true">→</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Çağrı ─────────────────────────────────────────── */}
        <section className={styles.cta} id="start">
          <div className={styles.wrap} style={{ position: 'relative' }}>
            <span className={`${styles.mono} ${styles.label}`} style={{ color: 'rgba(255,255,255,0.55)' }}>05 / Start</span>
            <h2 className={styles.ctaH}>Know your resilience score before the next disaster does.</h2>
            <div className={styles.ctaRow} style={{ marginBottom: 0 }}>
              <Link href="/login" className={`${styles.tag} ${styles.tagPrimary}`}>Request free assessment →</Link>
              <Link href="/methodology" className={styles.tag}>Read the methodology</Link>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  )
}
