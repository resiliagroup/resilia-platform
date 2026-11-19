'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from '@/app/home.module.css'

const PLATFORM = [
  { label: 'omniRISK', href: '/platform/omnirisk' },
  { label: 'omniIMPACT', href: '/platform/omniimpact' },
  { label: 'omniPLAN', href: '/platform/omniplan' },
  { label: 'omniCRISIS', href: '/platform/omnicrisis' },
  { label: 'omniAUDIT', href: '/platform/omniaudit' },
  { label: 'omniVENDOR', href: '/platform/omnivendor' },
  { label: 'omniHRO', href: '/platform/omni-hro', soon: true },
  { label: 'omniPIPE', href: '/platform/omnipipe', soon: true },
]

const SOLUTIONS = [
  { label: 'Banking & Finance', href: '/solutions/banking' },
  { label: 'Healthcare', href: '/solutions/health' },
  { label: 'Energy & Utilities', href: '/solutions/energy' },
  { label: 'Industrial', href: '/solutions/industrial' },
  { label: 'Manufacturing', href: '/solutions/manufacturing' },
  { label: 'Insurance', href: '/solutions/insurance' },
  { label: 'Telecommunications', href: '/solutions/telecom' },
  { label: 'Government', href: '/solutions/government' },
  { label: 'Public Sector', href: '/solutions/public-sector' },
  { label: 'Education', href: '/solutions/education' },
]

export default function HomeNav() {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      window.addEventListener('keydown', onKey)
      closeRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className={styles.nav}>
        <Link href="/" className={styles.logo} aria-label="Omniversel — ana sayfa">
          OMNIVERSEL
        </Link>
        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
        >
          MENU
        </button>
      </header>

      <div
        id="site-menu"
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menüsü"
        aria-hidden={!open}
      >
        <button ref={closeRef} type="button" className={`${styles.menuBtn} ${styles.overlayClose}`} onClick={close}>
          CLOSE
        </button>
        <div className={styles.menuGrid}>
          <nav aria-label="Ana bağlantılar">
            <div className={styles.menuHead}>Navigate</div>
            <Link href="/methodology" className={styles.menuBig} onClick={close}>Methodology</Link>
            <Link href="/pricing" className={styles.menuBig} onClick={close}>Pricing</Link>
            <Link href="/about" className={styles.menuBig} onClick={close}>About</Link>
            <Link href="/resources" className={styles.menuBig} onClick={close}>Resources</Link>
            <Link href="/login" className={styles.menuBig} onClick={close}>Sign in</Link>
          </nav>
          <nav aria-label="Platform">
            <div className={styles.menuHead}>Platform</div>
            {PLATFORM.map((l) => (
              <Link key={l.href} href={l.href} className={styles.menuLink} onClick={close}>
                {l.label}
                {l.soon && <span className={styles.soon}>SOON</span>}
              </Link>
            ))}
          </nav>
          <nav aria-label="Çözümler">
            <div className={styles.menuHead}>Solutions</div>
            {SOLUTIONS.map((l) => (
              <Link key={l.href} href={l.href} className={styles.menuLink} onClick={close}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
