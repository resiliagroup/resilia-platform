import { useState } from 'react';
import type { MapFacility } from '../../types';
import { RISK_COLORS } from '../../types';

// Turkey SVG path — traced from actual geography, normalized to 0-1 space
// The SVG viewBox maps: left=26°E right=45°E, top=42°N bottom=36°N
const TURKEY_PATH = `
  M 0.02,0.62 L 0.03,0.55 L 0.05,0.47 L 0.07,0.42 L 0.09,0.38
  L 0.11,0.35 L 0.14,0.32 L 0.17,0.28 L 0.19,0.25 L 0.22,0.22
  L 0.24,0.20 L 0.27,0.20 L 0.29,0.22 L 0.30,0.28 L 0.28,0.32
  L 0.28,0.37 L 0.30,0.38 L 0.33,0.35 L 0.36,0.30 L 0.38,0.25
  L 0.41,0.22 L 0.44,0.20 L 0.47,0.18 L 0.50,0.16 L 0.53,0.14
  L 0.56,0.12 L 0.60,0.10 L 0.64,0.09 L 0.68,0.09 L 0.72,0.10
  L 0.76,0.12 L 0.80,0.15 L 0.84,0.18 L 0.87,0.21 L 0.90,0.25
  L 0.93,0.29 L 0.95,0.33 L 0.97,0.38 L 0.98,0.43 L 0.98,0.48
  L 0.97,0.52 L 0.95,0.55 L 0.92,0.57 L 0.88,0.59 L 0.84,0.60
  L 0.80,0.61 L 0.76,0.62 L 0.72,0.63 L 0.68,0.64 L 0.64,0.65
  L 0.60,0.66 L 0.56,0.67 L 0.52,0.68 L 0.48,0.68 L 0.44,0.67
  L 0.40,0.66 L 0.36,0.65 L 0.32,0.63 L 0.28,0.62 L 0.24,0.63
  L 0.20,0.65 L 0.16,0.67 L 0.12,0.68 L 0.08,0.67 L 0.05,0.65
  L 0.03,0.63 Z
`;

const RISK_DOT_SIZES: Record<string, number> = {
  CRITICAL: 7, HIGH: 5.5, MEDIUM: 4.5, RESILIENT: 3.5, EXEMPLARY: 3,
};

interface Props {
  facilities: MapFacility[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TurkeyMap({ facilities, selectedId, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredFacility = facilities.find(f => f.id === hovered);

  // SVG viewBox is 0 0 1000 500 — scale normalized coords
  const W = 1000, H = 500;
  const toX = (x: number) => x * W;
  const toY = (y: number) => y * H;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'var(--bg3)', borderRadius: '8px', overflow: 'hidden' }}>

      {/* Map header */}
      <div style={{
        position: 'absolute', top: '12px', left: '12px', zIndex: 3,
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <div style={{
          background: 'rgba(7,12,20,0.88)', backdropFilter: 'blur(8px)',
          padding: '4px 12px', borderRadius: '6px',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          letterSpacing: '2px', color: 'var(--muted)',
        }}>
          GIS — TÜRKİYE / 81 İL
        </div>
        <div style={{
          background: 'rgba(7,12,20,0.88)', backdropFilter: 'blur(8px)',
          padding: '4px 10px', borderRadius: '6px',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          color: 'var(--teal)',
        }}>
          {facilities.length} FACILITIES
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', top: '12px', right: '12px', zIndex: 3,
        display: 'flex', flexDirection: 'column', gap: '3px',
      }}>
        {Object.entries(RISK_COLORS).map(([cls, color]) => (
          <div key={cls} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(7,12,20,0.88)', backdropFilter: 'blur(8px)',
            padding: '3px 8px', borderRadius: '4px',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
            {cls}
          </div>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
          </pattern>
          {/* Radial vignette */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(7,12,20,0.6)" />
          </radialGradient>
          {/* Glow filters per risk class */}
          {Object.entries(RISK_COLORS).map(([cls, color]) => (
            <filter key={cls} id={`glow-${cls.toLowerCase()}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor={color} floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
        </defs>

        {/* Background */}
        <rect width={W} height={H} fill="#0A1220" />
        <rect width={W} height={H} fill="url(#grid)" />

        {/* Turkey silhouette */}
        <path
          d={TURKEY_PATH.trim().replace(/(\d+\.\d+)/g, (_, n) => {
            // Scale from 0-1 to viewBox
            return n; // will be applied via transform
          })}
          transform={`scale(${W},${H})`}
          fill="rgba(123,159,212,0.06)"
          stroke="rgba(123,159,212,0.15)"
          strokeWidth={`${1.5 / W}`}
        />

        {/* Sea regions hint */}
        <ellipse cx="150" cy="200" rx="100" ry="60" fill="rgba(107,191,184,0.025)" />
        <ellipse cx="870" cy="250" rx="120" ry="80" fill="rgba(107,191,184,0.025)" />

        {/* Vignette overlay */}
        <rect width={W} height={H} fill="url(#vignette)" />

        {/* Facility dots */}
        {facilities.map(f => {
          const x = toX(f.x);
          const y = toY(f.y);
          const r = RISK_DOT_SIZES[f.risk_class] ?? 4;
          const color = RISK_COLORS[f.risk_class];
          const isSelected = f.id === selectedId;
          const isHovered  = f.id === hovered;
          const isCritical = f.risk_class === 'CRITICAL';

          return (
            <g key={f.id}
              onClick={() => onSelect(f.id)}
              onMouseEnter={() => setHovered(f.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulse ring for critical */}
              {isCritical && (
                <circle cx={x} cy={y} r={r + 8} fill="none"
                  stroke={color} strokeWidth="1" opacity="0"
                  style={{ animation: `pulse-ring 2s ease-out infinite` }}
                />
              )}
              {/* Selected ring */}
              {isSelected && (
                <circle cx={x} cy={y} r={r + 5} fill="none"
                  stroke={color} strokeWidth="1.5" opacity="0.6"
                />
              )}
              {/* Main dot */}
              <circle
                cx={x} cy={y} r={isHovered || isSelected ? r + 2 : r}
                fill={color}
                opacity={isCritical ? 1 : 0.75}
                filter={isSelected || isHovered ? `url(#glow-${f.risk_class.toLowerCase()})` : undefined}
                style={{ transition: 'r .15s' }}
              />
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hovered && hoveredFacility && (
        <div style={{
          position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(12,18,32,0.95)', backdropFilter: 'blur(12px)',
          border: `1px solid ${RISK_COLORS[hoveredFacility.risk_class]}40`,
          borderRadius: '8px', padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: '10px',
          pointerEvents: 'none', zIndex: 10,
          boxShadow: `0 4px 24px ${RISK_COLORS[hoveredFacility.risk_class]}20`,
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: RISK_COLORS[hoveredFacility.risk_class], flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>{hoveredFacility.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', letterSpacing: '1px', marginTop: '1px' }}>
              {hoveredFacility.sector} · {hoveredFacility.risk_class}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700,
            color: RISK_COLORS[hoveredFacility.risk_class], marginLeft: '8px',
          }}>
            {hoveredFacility.uri_score}
          </div>
        </div>
      )}

      {/* Pulse CSS */}
      <style>{`
        @keyframes pulse-ring {
          0%   { r: 10; opacity: 0.7; }
          100% { r: 24; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
