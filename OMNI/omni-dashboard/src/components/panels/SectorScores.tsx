import type { PortfolioStats, RiskAssessment } from '../../types';
import { RISK_COLORS } from '../../types';

// ─── Sector Scores ─────────────────────────────────────────────────────────

interface SectorProps {
  portfolio: PortfolioStats | null;
}

function scoreToColor(score: number): string {
  if (score < 40) return RISK_COLORS.CRITICAL;
  if (score < 60) return RISK_COLORS.HIGH;
  if (score < 75) return RISK_COLORS.MEDIUM;
  if (score < 90) return RISK_COLORS.RESILIENT;
  return RISK_COLORS.EXEMPLARY;
}

export function SectorScores({ portfolio }: SectorProps) {
  const sectors = portfolio
    ? Object.entries(portfolio.by_sector).sort((a, b) => a[1] - b[1])
    : [];

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>
        Sector URI Averages
      </div>
      {sectors.map(([sector, score]) => {
        const color = scoreToColor(score);
        return (
          <div key={sector} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted2)', width: '100px', flexShrink: 0 }}>
              {sector}
            </div>
            <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${score}%`, height: '100%',
                background: color, borderRadius: '3px',
                transition: 'width .8s cubic-bezier(.4,0,.2,1)',
              }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color, width: '30px', textAlign: 'right' }}>
              {score.toFixed(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Hazard Breakdown ──────────────────────────────────────────────────────

interface HazardProps {
  assessment: RiskAssessment | null;
}

const HAZARD_ICONS: Record<string, string> = {
  seismic:      '⟁',
  flood:        '◌',
  cyber:        '◈',
  supply_chain: '◫',
  pandemic:     '⬡',
  wildfire:     '▲',
  storm:        '◎',
};

export function HazardBreakdownPanel({ assessment }: HazardProps) {
  const hazards = assessment?.hazard_breakdown ?? [];

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>
        Hazard Profile
      </div>
      {hazards.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>
          Select a facility to view hazards
        </div>
      ) : (
        hazards.sort((a, b) => b.score - a.score).map(h => {
          const color = scoreToColor(h.score);
          const icon = HAZARD_ICONS[h.hazard_type] ?? '●';
          return (
            <div key={h.hazard_type} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--muted2)', fontSize: '12px' }}>{icon}</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted2)', flex: 1, textTransform: 'capitalize' }}>
                  {h.hazard_type.replace('_', ' ')}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500, color }}>
                  {h.score.toFixed(0)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${h.score}%`, height: '100%', background: color, borderRadius: '2px', transition: 'width .6s ease' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted)', width: '80px', textAlign: 'right' }}>
                  {h.data_source}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
