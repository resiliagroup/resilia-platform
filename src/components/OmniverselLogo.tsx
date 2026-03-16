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
      loop:    '#2D3748',
      dash:    '#4A5568',
      lines:   ['#1A202C', '#2D3748', '#4A5568', '#718096', '#A0AEC0'],
      div:     '#718096',
      nodeRim: '#2D3748',
      nodeFill:'#4A5568',
      nodeCore:'#1A202C',
      arrow:   '#4A5568',
      omni:    light ? '#1A202C' : '#F7FAFC',
      versel:  light ? '#2D3748' : '#CBD5E0',
      sub:     light ? '#4A5568' : '#A0AEC0',
      rule:    '#718096',
    },
    navy: {
      loop:    '#1A3A5C',
      dash:    '#2C4A6E',
      lines:   ['#0F2340', '#1A3A5C', '#2C4A6E', '#4A6FA5', '#7B9FC0'],
      div:     '#2C4A6E',
      nodeRim: '#1A3A5C',
      nodeFill:'#2C4A6E',
      nodeCore:'#0F2340',
      arrow:   '#2C4A6E',
      omni:    '#F0F4FF',
      versel:  '#BDD0E8',
      sub:     '#7B9FC0',
      rule:    '#2C4A6E',
    },
    contrast: {
      loop:    '#1A202C',
      dash:    '#2D3748',
      lines:   ['#F7FAFC', '#E2E8F0', '#CBD5E0', '#A0AEC0', '#718096'],
      div:     '#4A5568',
      nodeRim: '#F7FAFC',
      nodeFill:'#E2E8F0',
      nodeCore:'#1A202C',
      arrow:   '#CBD5E0',
      omni:    '#F7FAFC',
      versel:  '#CBD5E0',
      sub:     '#A0AEC0',
      rule:    '#4A5568',
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
      <g transform="translate(50, 50)">
        <path d="M0,-42 A42,42 0 0,0 -42,0 A42,42 0 0,0 -30,30"
              fill="none" stroke={s.loop} strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M-30,30 Q-8,48 0,42"
              fill="none" stroke={s.dash} strokeWidth="3.2" strokeLinecap="round"
              strokeDasharray="4 3"/>
        {ly.map((y, i) => (
          <line key={i} x1="8" y1={y} x2={lx2[i]} y2={y}
                stroke={s.lines[i]} strokeWidth={lw[i]} strokeLinecap="round"/>
        ))}
        <line x1="3" y1="-42" x2="3" y2="42"
              stroke={s.div} strokeWidth="1" opacity="0.3"/>
        <path d="M0,42 L-8,33 M0,42 L8,33"
              fill="none" stroke={s.arrow} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
        <circle cx="0" cy="0" r="8" fill={s.nodeCore} stroke={s.nodeRim} strokeWidth="2.5"/>
        <circle cx="0" cy="0" r="4" fill={s.nodeFill}/>
        <circle cx="0" cy="0" r="1.5" fill={s.nodeCore}/>
      </g>

      <g transform="translate(106, 60)">
        <text
          fontFamily="'Courier New', Courier, monospace"
          fontSize="38"
          fontWeight="900"
          fill={s.omni}
          letterSpacing="5"
        >OMNI</text>
        <text
          x="122"
          fontFamily="Arial, sans-serif"
          fontSize="38"
          fontWeight="400"
          fill={s.versel}
          letterSpacing="3"
        >VERSEL</text>
        <text
          x="2"
          y="27"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="10"
          fontWeight="900"
          fill={s.sub}
          letterSpacing="5"
          opacity="1"
        >URBAN RESILIENCE OS</text>
      </g>

      <line x1="104" y1="92" x2="430" y2="92" stroke={s.rule} strokeWidth="0.8" opacity="0.4"/>
    </svg>
  )
}
