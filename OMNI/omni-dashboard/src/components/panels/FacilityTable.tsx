import type { FacilityRiskSummary } from '../../types';
import { RISK_COLORS } from '../../types';

interface Props {
  facilities: FacilityRiskSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function FacilityTable({ facilities, selectedId, onSelect }: Props) {
  const sorted = [...facilities].sort((a, b) => a.uri_score - b.uri_score).slice(0, 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Facility Risk Scores
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          background: 'rgba(239,68,68,0.12)', color: 'var(--critical)',
          border: '1px solid rgba(239,68,68,0.22)',
          padding: '2px 8px', borderRadius: '4px',
        }}>
          {facilities.filter(f => f.risk_class === 'CRITICAL').length} CRITICAL
        </div>
      </div>

      {/* Table header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 80px 110px 76px',
        padding: '0 8px 8px',
        borderBottom: '1px solid var(--border)',
      }}>
        {['Facility', 'Sector', 'URI Score', 'Class'].map(h => (
          <div key={h} style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            letterSpacing: '1.5px', textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {sorted.map(f => {
          const color = RISK_COLORS[f.risk_class];
          const isSelected = f.id === selectedId;
          return (
            <div
              key={f.id}
              onClick={() => onSelect(f.id)}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 80px 110px 76px',
                padding: '9px 8px', cursor: 'pointer',
                borderBottom: '1px solid rgba(255,255,255,0.025)',
                background: isSelected ? 'rgba(107,191,184,0.06)' : 'transparent',
                transition: 'background .12s',
                alignItems: 'center',
              }}
            >
              {/* Name */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', marginTop: '1px' }}>
                  {f.code}
                </div>
              </div>

              {/* Sector */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted2)', letterSpacing: '0.5px' }}>
                {f.sector}
              </div>

              {/* Score bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)',
                  borderRadius: '2px', overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${f.uri_score}%`, height: '100%',
                    background: color, borderRadius: '2px',
                    transition: 'width .5s ease',
                  }} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  fontWeight: 500, color, width: '24px', textAlign: 'right',
                }}>
                  {f.uri_score}
                </div>
              </div>

              {/* Risk class pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '3px 7px', borderRadius: '4px',
                background: `${color}14`, color,
                border: `1px solid ${color}30`,
                fontFamily: 'var(--font-mono)', fontSize: '8px',
                fontWeight: 500, letterSpacing: '0.5px',
              }}>
                {f.risk_class}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
