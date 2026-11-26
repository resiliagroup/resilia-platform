'use client'

import { useState } from 'react'
import Link from 'next/link'
import '@/app/market.css'

export const MENU = [
  { href: '/', label: 'Home' },
  { href: '/solutions', label: 'Work' },
  { href: '/resources', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/methodology', label: 'Approach' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/login', label: 'Contact' },
]

const MODULES = [
  { href: '/platform/omnirisk', label: 'omniRISK' },
  { href: '/platform/omniplan', label: 'omniPLAN' },
  { href: '/platform/omnicrisis', label: 'omniCRISIS' },
  { href: '/platform/omniaudit', label: 'omniAUDIT' },
]

export function Market({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mk">
      <header className="mk-bar">
        <Link href="/" className="mk-mark" aria-label="Omniversel">o</Link>
        <button className="mk-menu" type="button" onClick={() => setOpen(v => !v)}>
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </header>
      {open && (
        <nav className="mk-drawer">
          <button className="mk-x" type="button" onClick={() => setOpen(false)} aria-label="Close">×</button>
          {MENU.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
          <div className="mk-split" />
          {MODULES.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
        </nav>
      )}
      <main className="mk-main">{children}</main>
      <footer className="mk-foot">
        <div>Omniversel<br />Enterprise resilience platform<br />Istanbul, Turkey</div>
        <div>
          <Link href="/about">About</Link>
          <Link href="/methodology">Approach</Link>
          <Link href="/solutions">Work</Link>
        </div>
        <div>
          <Link href="/resources">Journal</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/login">Contact</Link>
        </div>
        <div>ITU AYM<br />Academic partner<br />ISO 22301 aligned</div>
      </footer>
    </div>
  )
}

export function Intro({ kicker, statement, image }: { kicker: string, statement: string, image?: string }) {
  return (
    <>
      {image && <img className="mk-hero" src={image} alt="" />}
      <p className="mk-kicker">{kicker}</p>
      <h1>{statement}</h1>
      <div className="mk-rule" aria-hidden />
    </>
  )
}
