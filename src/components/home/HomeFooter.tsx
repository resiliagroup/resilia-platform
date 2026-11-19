import Link from 'next/link'
import styles from '@/app/home.module.css'
import Counter from './Counter'

const PLATFORM = [
  ['omniRISK', '/platform/omnirisk'],
  ['omniIMPACT', '/platform/omniimpact'],
  ['omniPLAN', '/platform/omniplan'],
  ['omniCRISIS', '/platform/omnicrisis'],
  ['omniAUDIT', '/platform/omniaudit'],
  ['omniVENDOR', '/platform/omnivendor'],
  ['omniHRO', '/platform/omni-hro'],
  ['omniPIPE', '/platform/omnipipe'],
]
const SOLUTIONS = [
  ['Banking', '/solutions/banking'],
  ['Healthcare', '/solutions/health'],
  ['Energy', '/solutions/energy'],
  ['Industrial', '/solutions/industrial'],
  ['Manufacturing', '/solutions/manufacturing'],
  ['Insurance', '/solutions/insurance'],
  ['Telecom', '/solutions/telecom'],
  ['Government', '/solutions/government'],
  ['Public Sector', '/solutions/public-sector'],
  ['Education', '/solutions/education'],
]
const COMPANY = [
  ['About', '/about'],
  ['Methodology', '/methodology'],
  ['Pricing', '/pricing'],
  ['Resources', '/resources'],
  ['Contact', '/login'],
]

export default function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.fGrid}>
          <div>
            <div style={{ fontWeight: 700, letterSpacing: '0.14em', fontSize: 17 }}>OMNIVERSEL</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6, maxWidth: 280, marginTop: 14 }}>
              An academically grounded, operationally tested platform for multi-hazard organizational risk management.
            </p>
          </div>
          <div>
            <span className={`${styles.mono} ${styles.fHead}`}>Platform</span>
            {PLATFORM.map(([l, h]) => <Link key={h} href={h} className={styles.fLink}>{l}</Link>)}
          </div>
          <div>
            <span className={`${styles.mono} ${styles.fHead}`}>Solutions</span>
            {SOLUTIONS.map(([l, h]) => <Link key={h} href={h} className={styles.fLink}>{l}</Link>)}
          </div>
          <div>
            <span className={`${styles.mono} ${styles.fHead}`}>Company</span>
            {COMPANY.map(([l, h]) => <Link key={l} href={h} className={styles.fLink}>{l}</Link>)}
          </div>
        </div>

        <div className={styles.counter}>
          <div>
            <span className={`${styles.mono} ${styles.fHead}`} style={{ marginBottom: 10 }}>
              Since the 1999 Marmara earthquake · 17 Aug 1999, 03:02
            </span>
            <Counter />
          </div>
          <div className={styles.mono} style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 320, lineHeight: 1.6 }}>
            Preparedness is measured before the next one.
          </div>
        </div>

        <div className={`${styles.legal} ${styles.mono}`}>
          <span>© 2026 Omniversel · Istanbul, Turkey</span>
          <span>ITU AYM Academic Partner</span>
        </div>
      </div>
    </footer>
  )
}
