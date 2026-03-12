import type { RiskAssessment } from '../../types';
import { RISK_COLORS } from '../../types';

interface Props {
  assessment: RiskAssessment | null;
  loading?: boolean;
}

const DIMS = [
  { key: 'hazard',    label: 'H',  fullLabel: 'Hazard',    color: '#E8C97A' },
  { key: 'fragility', label: 'F',  fullLabel: 'Fragility', color: '#7B9FD4' },
  { key: 'exposure',  label: 'E',  fullLabel: 'Exposure',  color: '#6ABFB8' },
  { key: 'response',  label: 'R',  fullLabel: 'Response',  color: '#22C55E' },
] as const;

// Pure SVG radar — 4 axes, N axes
function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.sin(angleRad),
    y: cy - r * Math.cos(angleRad),
  };
}

function radarPolygon(values: number[], cx: number, cy: number, maxR: number): string {
  const n = values.length;
  return values
    .map((v, i) => {
      const angle = (2 * Math.PI * i) / n;
      const r = (v / 100) * maxR;
      const { x, y } = polarToCartesian(cx, cy, r, angle);
      return `${x},${y}`;
    })
    .join(' ');
}

export function HFERRadar({ assessment, loading }: Props) {
  const cx = 120, cy = 115, maxR = 85;
  const n = 4;
  const levels = [25, 50, 75, 100];

  const values = assessment
    ? [assessment.h_score, assessment.f_score, assessment.e_score, assessment.r_score]
    : [0, 0, 0, 0];

  const color = assessment ? RISK_COLORS[assessment.risk_class] : 'var(--muted)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>
          HFER-720 Radar
        </div>
        {assessment && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            color: color, letterSpacing: '1px',
            background: `${color}15`, border: `1px solid ${color}30`,
            padding: '2px 8px', borderRadius: '4px',
          }}>
            {assessment.risk_class}
          </div>
        )}
      </div>

      {/* URI Score */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', letterSpacing: '2px', marginBottom: '3px' }}>
          UNIFIED RISK INDEX
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 800,
          color: loading ? 'var(--muted)' : color,
          lineHeight: 1, transition: 'color .3s',
        }}>
          {loading ? '—' : (assessment?.uri_score ?? '—')}
        </div>
        {assessment && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '3px' }}>
            {assessment.facility_name}
          </div>
        )}
      </div>

      {/* Radar SVG */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width="240" height="230" viewBox={`0 0 240 230`}>
          {/* Grid rings */}
          {levels.map(lvl => {
            const r = (lvl / 100) * maxR;
            const pts = Array.from({ length: n }, (_, i) => {
              const angle = (2 * Math.PI * i) / n;
              const { x, y } = polarToCartesian(cx, cy, r, angle);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon key={lvl} points={pts}
                fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"
              />
            );
          })}

          {/* Axis lines */}
          {DIMS.map((d, i) => {
            const angle = (2 * Math.PI * i) / n;
            const { x, y } = polarToCartesian(cx, cy, maxR, angle);
            return (
              <line key={d.key}
                x1={cx} y1={cy} x2={x} y2={y}
                stroke="rgba(255,255,255,0.06)" strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          {assessment && (
            <>
              <polygon
                points={radarPolygon(values, cx, cy, maxR)}
                fill={`${color}18`}
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
                style={{ transition: 'all .4s ease' }}
              />
              {values.map((v, i) => {
                const angle = (2 * Math.PI * i) / n;
                const r = (v / 100) * maxR;
                const { x, y } = polarToCartesian(cx, cy, r, angle);
                return (
                  <circle key={i} cx={x} cy={y} r="4"
                    fill={color} stroke="var(--bg2)" strokeWidth="1.5"
                  />
                );
              })}
            </>
          )}

          {/* Axis labels */}
          {DIMS.map((d, i) => {
            const angle = (2 * Math.PI * i) / n;
            const labelR = maxR + 18;
            const { x, y } = polarToCartesian(cx, cy, labelR, angle);
            const val = assessment ? values[i] : null;
            return (
              <g key={d.key}>
                <text x={x} y={y - 6}
                  textAnchor="middle" dominantBaseline="middle"
                  fontFamily="var(--font-display)" fontWeight="700" fontSize="15"
                  fill={d.color}
                >
                  {d.label}
                </text>
                {val !== null && (
                  <text x={x} y={y + 10}
                    textAnchor="middle" dominantBaseline="middle"
                    fontFamily="var(--font-mono)" fontSize="9"
                    fill="var(--muted2)"
                  >
                    {val}
                  </text>
                )}
              </g>
            );
          })}

          {/* Center dot */}
          <circle cx={cx} cy={cy} r="3" fill="var(--muted)" opacity="0.4" />
        </svg>
      </div>

      {/* Dimension strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '6px', marginTop: '8px',
      }}>
        {DIMS.map((d, i) => {
          const val = assessment ? values[i] : null;
          return (
            <div key={d.key} style={{
              padding: '8px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: d.color }}>
                {d.label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 500, color: val !== null ? d.color : 'var(--muted)' }}>
                {val ?? '—'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted)', letterSpacing: '1px' }}>
                {d.fullLabel.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
