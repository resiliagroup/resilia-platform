'use client'

interface Props {
  width?: number
  height?: number
  className?: string
  light?: boolean // true for light/white backgrounds (OMNI text becomes navy)
}

export default function OmniverselLogo({ width = 220, height = 56, className, light }: Props) {
  const omniColor = light ? '#0A1628' : '#FFFFFF'
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 100"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="logoTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ABFB8" />
          <stop offset="100%" stopColor="#7B9FD4" />
        </linearGradient>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C97A" />
          <stop offset="100%" stopColor="#B89B4A" />
        </linearGradient>
      </defs>

      {/* Geometrik sembol */}
      <g transform="translate(50, 50)">
        <circle cx="0" cy="0" r="40" fill="none" stroke="#7B9FD4" strokeWidth="1" opacity="0.3" strokeDasharray="4 4"/>
        <circle cx="0" cy="0" r="30" fill="none" stroke="url(#logoTeal)" strokeWidth="2.5"/>
        <polygon
          points="0,-20 12,-11 12,11 0,20 -12,11 -12,-11"
          fill="none"
          stroke="url(#logoGold)"
          strokeWidth="1.8"
        />
        <circle cx="0" cy="0" r="3.5" fill="#E8C97A"/>
        <line x1="-45" y1="0" x2="-35" y2="0" stroke="#7B9FD4" strokeWidth="1" opacity="0.5"/>
        <line x1="45" y1="0" x2="35" y2="0" stroke="#7B9FD4" strokeWidth="1" opacity="0.5"/>
        <line x1="0" y1="-45" x2="0" y2="-35" stroke="#7B9FD4" strokeWidth="1" opacity="0.5"/>
        <line x1="0" y1="45" x2="0" y2="35" stroke="#7B9FD4" strokeWidth="1" opacity="0.5"/>
      </g>

      {/* Metin grubu */}
      <g transform="translate(102, 58)">
        <text
          fontFamily="'Courier New', Courier, monospace"
          fontSize="38"
          fontWeight="900"
          fill={omniColor}
          letterSpacing="5"
        >OMNI</text>
        <text
          x="122"
          fontFamily="Arial, sans-serif"
          fontSize="38"
          fontWeight="100"
          fill="#6ABFB8"
          letterSpacing="3"
        >VERSEL</text>
        <text
          x="2"
          y="26"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="9"
          fontWeight="bold"
          fill="#7B9FD4"
          opacity="0.7"
          letterSpacing="5"
        >URBAN RESILIENCE OS</text>
      </g>

      {/* Alt çizgi */}
      <line x1="100" y1="92" x2="400" y2="92" stroke="#7B9FD4" strokeWidth="0.8" opacity="0.3"/>
    </svg>
  )
}
