'use client'

import { useEffect, useState } from 'react'
import styles from '@/app/home.module.css'

// 17 Ağustos 1999 Marmara (İzmit) depremi, yerel saat 03:02
const START = new Date('1999-08-17T03:02:00+03:00')

function parts(now: Date) {
  let y = now.getFullYear() - START.getFullYear()
  const anniv = new Date(START)
  anniv.setFullYear(START.getFullYear() + y)
  if (anniv > now) {
    y -= 1
    anniv.setFullYear(START.getFullYear() + y)
  }
  const ms = now.getTime() - anniv.getTime()
  const d = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return { y, d, h, m, s }
}

export default function Counter() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const p = now ? parts(now) : null
  const pad = (n: number | undefined) => (n === undefined ? '--' : String(n).padStart(2, '0'))

  return (
    <div className={styles.digits} role="timer" aria-label="1999 Marmara depreminden bu yana geçen süre">
      <div><b>{pad(p?.y)}</b><span>years</span></div>
      <div><b>{p ? String(p.d).padStart(3, '0') : '---'}</b><span>days</span></div>
      <div><b>{pad(p?.h)}</b><span>hours</span></div>
      <div><b>{pad(p?.m)}</b><span>min</span></div>
      <div><b>{pad(p?.s)}</b><span>sec</span></div>
    </div>
  )
}
