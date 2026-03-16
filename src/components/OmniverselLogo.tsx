'use client'

interface Props {
  width?: number
  height?: number
  className?: string
  light?: boolean
}

export default function OmniverselLogo({ width = 220, height = 56, className, light }: Props) {
  const omniColor = light ? '#0A1628' : '#FFFFFF'
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 440 100"
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
        <circle cx="0" cy="0" r="42" fill="none" stroke="#7B9FD4" strokeWidth="1" opacity="0.3" strokeDasharray="4 4"/>
        <circle cx="0" cy="0" r="32" fill="none" stroke="url(#logoTeal)" strokeWidth="3"/>
        <polygon
          points="0,-22 13,-12 13,12 0,22 -13,12 -13,-12"
          fill="none"
          stroke="url(#logoGold)"
          strokeWidth="2.2"
        />
        <circle cx="0" cy="0" r="4.5" fill="#E8C97A"/>
        <line x1="-47" y1="0" x2="-36" y2="0" stroke="#7B9FD4" strokeWidth="1.5" opacity="0.6"/>
        <line x1="47" y1="0" x2="36" y2="0" stroke="#7B9FD4" strokeWidth="1.5" opacity="0.6"/>
        <line x1="0" y1="-47" x2="0" y2="-36" stroke="#7B9FD4" strokeWidth="1.5" opacity="0.6"/>
        <line x1="0" y1="47" x2="0" y2="36" stroke="#7B9FD4" strokeWidth="1.5" opacity="0.6"/>
      </g>

      {/* Metin grubu */}
      <g transform="translate(106, 60)">
        <text
          fontFamily="'Courier New', Courier, monospace"
          fontSize="40"
          fontWeight="900"
          fill={omniColor}
          letterSpacing="6"
        >OMNI</text>
        <text
          x="128"
          fontFamily="Arial, sans-serif"
          fontSize="40"
          fontWeight="300"
          fill="#6ABFB8"
          letterSpacing="4"
        >VERSEL</text>
        <text
          x="2"
          y="28"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="10"
          fontWeight="700"
          fill="#7B9FD4"
          opacity="0.8"
          letterSpacing="5"
        >URBAN RESILIENCE OS</text>
      </g>

      {/* Alt çizgi */}
      <line x1="104" y1="94" x2="420" y2="94" stroke="#7B9FD4" strokeWidth="1" opacity="0.35"/>
    </svg>
  )
}
