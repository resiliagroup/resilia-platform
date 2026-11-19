import styles from '@/app/home.module.css'

type Props = { dark?: boolean }

const s = (dark?: boolean) => (dark ? 'rgba(255,255,255,0.55)' : 'rgba(38,52,60,0.5)')
const a = (dark?: boolean) => (dark ? '#00c9b1' : '#009b8d')

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg className={styles.motif} viewBox="0 0 128 68" fill="none" aria-hidden="true">
      {children}
    </svg>
  )
}

export function RiskMotif({ dark }: Props) {
  return (
    <Svg>
      <path d="M14 58 A50 50 0 0 1 114 58" stroke={s(dark)} strokeWidth="1.5" />
      <path d="M14 58 A50 50 0 0 1 84 12" stroke={a(dark)} strokeWidth="4" />
      <line x1="64" y1="58" x2="84" y2="22" stroke={a(dark)} strokeWidth="1.5" />
      <circle cx="64" cy="58" r="3" fill={a(dark)} />
    </Svg>
  )
}
export function ImpactMotif({ dark }: Props) {
  return (
    <Svg>
      {[10, 26, 42, 58, 74, 90, 106].map((x, i) => (
        <rect key={x} x={x} y={60 - [14, 22, 34, 46, 38, 26, 18][i]} width="10" height={[14, 22, 34, 46, 38, 26, 18][i]} fill={i === 3 ? a(dark) : s(dark)} fillOpacity={i === 3 ? 1 : 0.5} />
      ))}
    </Svg>
  )
}
export function PlanMotif({ dark }: Props) {
  return (
    <Svg>
      <line x1="6" y1="34" x2="122" y2="34" stroke={s(dark)} />
      {[16, 44, 72, 100].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="34" r={i < 3 ? 5 : 4} fill={i < 3 ? a(dark) : 'none'} stroke={i < 3 ? a(dark) : s(dark)} />
          <line x1={x} y1="34" x2={x} y2={i % 2 ? 54 : 14} stroke={s(dark)} />
        </g>
      ))}
    </Svg>
  )
}
export function CrisisMotif({ dark }: Props) {
  return (
    <Svg>
      <circle cx="64" cy="12" r="6" fill={a(dark)} />
      <path d="M64 18 V30 M24 30 H104 M24 30 V42 M64 30 V42 M104 30 V42" stroke={s(dark)} />
      {[24, 64, 104].map((x) => (
        <circle key={x} cx={x} cy="48" r="5" stroke={s(dark)} />
      ))}
    </Svg>
  )
}
export function AuditMotif({ dark }: Props) {
  return (
    <Svg>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="8" y={8 + i * 14} width="8" height="8" stroke={i < 3 ? a(dark) : s(dark)} />
          {i < 3 && <path d={`M10 ${12 + i * 14} l2 2 l3 -4`} stroke={a(dark)} />}
          <line x1="24" y1={12 + i * 14} x2={[100, 84, 110, 60][i]} y2={12 + i * 14} stroke={s(dark)} strokeOpacity="0.6" />
        </g>
      ))}
    </Svg>
  )
}
export function VendorMotif({ dark }: Props) {
  const n: [number, number][] = [[64, 34], [20, 14], [108, 12], [24, 56], [106, 56]]
  return (
    <Svg>
      {n.slice(1).map(([x, y]) => (
        <line key={`${x}${y}`} x1="64" y1="34" x2={x} y2={y} stroke={s(dark)} />
      ))}
      {n.map(([x, y], i) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={i === 0 ? 6 : 4} fill={i === 0 ? a(dark) : 'none'} stroke={i === 0 ? a(dark) : s(dark)} />
      ))}
    </Svg>
  )
}
export function SoonMotif({ dark }: Props) {
  return (
    <Svg>
      <path d="M6 34 H122" stroke={s(dark)} strokeDasharray="3 5" />
      <circle cx="64" cy="34" r="9" stroke={a(dark)} strokeDasharray="2 3" />
    </Svg>
  )
}
