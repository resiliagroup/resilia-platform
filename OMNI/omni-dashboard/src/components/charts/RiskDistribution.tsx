import type { PortfolioStats } from '../../types';
import { RISK_COLORS, RISK_ORDER } from '../../types';

interface Props {
  portfolio: PortfolioStats | null;
}

export function RiskDistribution({ portfolio }: Props) {
  const counts = portfolio?.by_risk_class ?? {} as Record<string, number>;
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  // Donut chart via SVG arc
  const cx = 70, cy = 70, outerR = 60, innerR = 40;
  const circumference = 2 * Math.PI * outerR;

  let cumulativeAngle = -Math.PI / 2; // start from top
  const slices = RISK_ORDER.map(cls => {
    const count = counts[cls] ?? 0;
    const angle = (count / total) * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    const endAngle = cumulativeAngle;

    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2}`,
      'Z',
    ].join(' ');

    return { cls, count, angle, d, pct: Math.round((count / total) * 100) };
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Risk Distribution
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          background: 'rgba(239,68,68,0.12)', color: 'var(--critical)',
          border: '1px solid rgba(239,68,68,0.22)',
          padding: '2px 8px', borderRadius: '4px',
        }}>
          LIVE
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Donut */}
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
          {slices.map(s => s.angle > 0.01 && (
            <path key={s.cls} d={s.d}
              fill={`${RISK_COLORS[s.cls]}CC`}
              stroke="var(--bg2)" strokeWidth="1.5"
              style={{ transition: 'all .4s ease' }}
            />
          ))}
          {/* Center label */}
          <text x="70" y="65" textAnchor="middle"
            fontFamily="var(--font-display)" fontWeight="700" fontSize="22" fill="white">
            {total.toLocaleString()}
          </text>
          <text x="70" y="82" textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted)" letterSpacing="1.5">
            FACILITIES
          </text>
        </svg>

        {/* Legend */}
        <div style={{ flex: 1 }}>
          {slices.map(s => (
            <div key={s.cls} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '8px',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: RISK_COLORS[s.cls], flexShrink: 0 }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted2)', flex: 1, letterSpacing: '0.5px' }}>
                {s.cls}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 500, color: RISK_COLORS[s.cls] }}>
                {s.count}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px',
                color: 'var(--muted)', width: '28px', textAlign: 'right',
              }}>
                {s.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stacked progress bar */}
      <div style={{ marginTop: '12px', display: 'flex', height: '5px', borderRadius: '3px', overflow: 'hidden', gap: '1px' }}>
        {slices.map(s => s.count > 0 && (
          <div key={s.cls} style={{
            flex: s.count,
            background: RISK_COLORS[s.cls],
            opacity: 0.85,
            transition: 'flex .5s ease',
          }} />
        ))}
      </div>
    </div>
  );
}
