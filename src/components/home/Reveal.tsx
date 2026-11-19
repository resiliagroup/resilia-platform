'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import styles from '@/app/home.module.css'

/** Görünür alana girince yumuşakça belirir. JS yoksa içerik zaten görünürdür. */
export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
    el.classList.add(styles.pre)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.remove(styles.pre)
          el.classList.add(styles.in)
          io.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
