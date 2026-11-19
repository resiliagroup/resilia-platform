'use client'

import { useEffect, useRef } from 'react'

type Dot = { x: number; y: number; r: number; a: number; hot: 0 | 1 | 2; ph: number }

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const BLOBS = [
  { c: '0,155,141', x: 0.72, y: 0.32, r: 0.46, sp: 0.00005, ph: 0, a: 0.55 },
  { c: '27,79,216', x: 0.88, y: 0.74, r: 0.4, sp: 0.00007, ph: 2, a: 0.5 },
  { c: '245,158,11', x: 0.56, y: 0.86, r: 0.34, sp: 0.00006, ph: 4, a: 0.38 },
  { c: '229,72,77', x: 0.64, y: 0.55, r: 0.2, sp: 0.00009, ph: 1, a: 0.2 },
]

export default function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rand = rng(11)
    const gauss = () => (rand() + rand() + rand() + rand() - 2) / 2

    // Tesis noktaları: kümeler halinde, deterministik
    const clusters: [number, number, number, number, number][] = [
      [0.7, 0.42, 0.13, 0.11, 340],
      [0.84, 0.66, 0.08, 0.08, 190],
      [0.62, 0.74, 0.07, 0.06, 110],
      [0.58, 0.22, 0.06, 0.06, 70],
      [0.92, 0.3, 0.05, 0.06, 70],
    ]
    const dots: Dot[] = []
    for (const [cx, cy, sx, sy, n] of clusters) {
      for (let i = 0; i < n; i++) {
        const p = rand()
        dots.push({
          x: cx + gauss() * sx,
          y: cy + gauss() * sy,
          r: 0.7 + rand() * 1.3,
          a: 0.18 + rand() * 0.4,
          hot: p < 0.018 ? 2 : p < 0.07 ? 1 : 0,
          ph: rand() * Math.PI * 2,
        })
      }
    }

    let w = 0
    let h = 0
    let raf = 0
    let visible = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (t: number) => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#05080d'
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'
      const base = Math.max(w, h)
      for (const b of BLOBS) {
        const cx = (b.x + Math.sin(t * b.sp + b.ph) * 0.07) * w
        const cy = (b.y + Math.cos(t * b.sp * 1.3 + b.ph) * 0.07) * h
        const r = b.r * base
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `rgba(${b.c},${b.a})`)
        g.addColorStop(0.55, `rgba(${b.c},${b.a * 0.28})`)
        g.addColorStop(1, `rgba(${b.c},0)`)
        ctx.fillStyle = g
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
      }

      ctx.globalCompositeOperation = 'source-over'
      for (const d of dots) {
        const x = d.x * w
        const y = d.y * h
        if (d.hot) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 0.0022 + d.ph)
          const col = d.hot === 2 ? '229,72,77' : '245,158,11'
          ctx.fillStyle = `rgba(${col},${0.55 + pulse * 0.45})`
          ctx.beginPath()
          ctx.arc(x, y, d.r + 1.1, 0, 6.2832)
          ctx.fill()
          ctx.strokeStyle = `rgba(${col},${0.35 * (1 - pulse)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(x, y, d.r + 3 + pulse * 9, 0, 6.2832)
          ctx.stroke()
        } else {
          ctx.fillStyle = `rgba(255,255,255,${d.a})`
          ctx.beginPath()
          ctx.arc(x, y, d.r, 0, 6.2832)
          ctx.fill()
        }
      }
    }

    const loop = (now: number) => {
      if (visible) draw(now)
      raf = requestAnimationFrame(loop)
    }

    resize()
    if (reduce) {
      draw(4000)
    } else {
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) draw(4000)
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
}
