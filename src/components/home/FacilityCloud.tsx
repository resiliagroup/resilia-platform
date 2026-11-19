import styles from '@/app/home.module.css'

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Metropolitan dağıtımı simgeleyen, deterministik nokta bulutu (örnekleyici illüstrasyon). */
export default function FacilityCloud() {
  const rand = rng(23)
  const g = () => (rand() + rand() + rand() + rand() - 2) / 2
  const W = 640
  const H = 480
  const clusters: [number, number, number, number, number][] = [
    [330, 220, 120, 70, 330],
    [470, 300, 70, 50, 150],
    [200, 320, 70, 45, 110],
    [140, 160, 50, 40, 60],
    [540, 140, 40, 35, 40],
  ]
  const pts: { x: number; y: number; r: number; k: 0 | 1 | 2; a: number }[] = []
  for (const [cx, cy, sx, sy, n] of clusters) {
    for (let i = 0; i < n; i++) {
      const p = rand()
      pts.push({
        x: Math.round((cx + g() * sx) * 10) / 10,
        y: Math.round((cy + g() * sy) * 10) / 10,
        r: Math.round((1 + rand() * 1.6) * 10) / 10,
        k: p < 0.04 ? 2 : p < 0.15 ? 1 : 0,
        a: Math.round((0.25 + rand() * 0.45) * 100) / 100,
      })
    }
  }
  const crosses: [number, number][] = []
  for (let x = 80; x < W; x += 160) for (let y = 80; y < H; y += 160) crosses.push([x, y])

  return (
    <svg
      className={styles.cloud}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Metropolitan alandaki tesislerin nokta bulutu: çoğu nötr, bir kısmı sarı ve kırmızı ile kritik risk noktası olarak işaretli (örnekleyici illüstrasyon)"
    >
      {crosses.map(([x, y]) => (
        <g key={`${x}-${y}`} stroke="rgba(255,255,255,0.16)" strokeWidth="1">
          <line x1={x - 5} y1={y} x2={x + 5} y2={y} />
          <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
        </g>
      ))}
      {pts.map((p, i) =>
        p.k === 0 ? (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={`rgba(255,255,255,${p.a})`} />
        ) : (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.r + 5} fill="none" stroke={p.k === 2 ? '#e5484d' : '#f59e0b'} strokeOpacity="0.4" />
            <circle cx={p.x} cy={p.y} r={p.r + 0.8} fill={p.k === 2 ? '#e5484d' : '#f59e0b'} />
          </g>
        )
      )}
      <text x="14" y={H - 14} fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="var(--mono)" letterSpacing="1.2">
        ILLUSTRATIVE · FACILITY RISK DISTRIBUTION
      </text>
    </svg>
  )
}
