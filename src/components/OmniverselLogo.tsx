'use client'

interface Props {
  width?: number
  height?: number
  className?: string
  light?: boolean
  variant?: 'default' | 'navy' | 'contrast'
}

export default function OmniverselLogo({ width = 220, height = 56, className, light, variant = 'default' }: Props) {

  const schemes = {
    default: {
      loop:    '#4A5568',
      dash:    '#718096',
      lines:   ['#1A202C', '#2D3748', '#4A5568', '#718096', '#A0AEC0'],
      div:     '#718096',
      nodeRim: '#4A5568',
      nodeFill:'#718096',
      nodeCore:'#1A202C',
      arrow:   '#718096',
      omni:    light ? '#1A202C' : '#E2E8F0',
      versel:  '#4A5568',
      sub:     '#718096',
      rule:    '#CBD5E0',
    },
    navy: {
      loop:    '#2C4A6E',
      dash:    '#4A6FA5',
      lines:   ['#0F2340', '#1A3A5C', '#2C4A6E', '#4A6FA5', '#7B9FC0'],
      div:     '#4A6FA5',
      nodeRim: '#2C4A6E',
      nodeFill:'#4A6FA5',
      nodeCore:'#0F2340',
      arrow:   '#4A6FA5',
      omni:    light ? '#0F2340' : '#E8F0FA',
      versel:  '#2C4A6E',
      sub:     '#4A6FA5',
      rule:    '#4A6FA5',
    },
    contrast: {
      loop:    '#1A202C',
      dash:    '#4A5568',
      lines:   ['#E2E8F0', '#CBD5E0', '#A0AEC0', '#718096', '#4A5568'],
      div:     '#718096',
      nodeRim: '#E2E8F0',
      nodeFill:'#E2E8F0',
      nodeCore:'#1A202C',
      arrow:   '#A0AEC0',
      omni:    light ? '#1A202C' : '#E2E8F0',
      versel:  '#4A5568',
      sub:     '#718096',
      rule:    '#718096',
    },
  }

  const s = schemes[variant]
  const lw = [5.5, 4.5, 3.5, 2.5, 2]
  const ly = [-40, -20, 0, 20, 40]
  const lx2 = [52, 52, 48, 42, 36]

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 460 100"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block' }}
    >
      {/* Sembol — E+F karışımı */}
      <g transform="translate(50, 50)">
        {/* Döngü — sol yarı, kırık */}
        <path d="M0,-42 A42,42 0 0,0 -42,0 A42,42 0 0,0 -30,30"
              fill="none" stroke={s.loop} strokeWidth="4.5" strokeLinecap="round"/>
        {/* Kırık geçiş — kesik */}
        <path d="M-30,30 Q-8,48 0,42"
              fill="none" stroke={s.dash} strokeWidth="3.2" strokeLinecap="round"
              strokeDasharray="4 3"/>
        {/* Düzen çizgileri — sağ */}
        {ly.map((y, i) => (
          <line key={i} x1="8" y1={y} x2={lx2[i]} y2={y}
                stroke={s.lines[i]} strokeWidth={lw[i]} strokeLinecap="round"/>
        ))}
        {/* Dikey ayırıcı */}
        <line x1="3" y1="-42" x2="3" y2="42"
              stroke={s.div} strokeWidth="1" opacity="0.3"/>
        {/* Ok */}
        <path d="M0,42 L-8,33 M0,42 L8,33"
              fill="none" stroke={s.arrow} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
        {/* Merkez */}
        <circle cx="0" cy="0" r="8" fill={s.nodeCore} stroke={s.nodeRim} strokeWidth="2.5"/>
        <circle cx="0" cy="0" r="4" fill={s.nodeFill}/>
        <circle cx="0" cy="0" r="1.5" fill={s.nodeCore}/>
      </g>

      {/* Metin */}
      <g transform="translate(106, 58)">
        <text
          fontFamily="'Courier New', Courier, monospace"
          fontSize="36"
          fontWeight="900"
          fill={s.omni}
          letterSpacing="5"
        >OMNI</text>
        <text
          x="118"
          fontFamily="Arial, sans-serif"
          fontSize="36"
          fontWeight="300"
          fill={s.versel}
          letterSpacing="3"
        >VERSEL</text>
        <text
          x="2"
          y="25"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="9"
          fontWeight="700"
          fill={s.sub}
          letterSpacing="5"
        >URBAN RESILIENCE OS</text>
      </g>

      {/* Alt çizgi */}
      <line x1="104" y1="90" x2="430" y2="90" stroke={s.rule} strokeWidth="0.8" opacity="0.35"/>
    </svg>
  )
}
