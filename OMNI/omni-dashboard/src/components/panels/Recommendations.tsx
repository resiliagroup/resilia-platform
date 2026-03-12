import type { RiskAssessment } from '../../types';
import { RISK_COLORS } from '../../types';

interface Props {
  assessment: RiskAssessment | null;
}

const EFFORT_COLOR = { low: '#22C55E', medium: '#EAB308', high: '#F97316' };
const CAT_ICONS: Record<string, string> = {
  INFRASTRUCTURE: '◫',
  PLANNING:       '◈',
  DIGITAL:        '◉',
  TRAINING:       '◎',
  GOVERNANCE:     '⬡',
  NETWORK:        '△',
  RESOURCES:      '◁',
  CERTIFICATION:  '◆',
};

export function RecommendationsPanel({ assessment }: Props) {
  const recs = assessment?.recommendations ?? [];
  const facilityName = assessment?.facility_name ?? 'No facility selected';
  const riskColor = assessment ? RISK_COLORS[assessment.risk_class] : 'var(--muted)';

  // Estimated total URI improvement if all addressed
  const totalImpact = recs.reduce((sum, r) => sum + r.score_impact, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Priority Recommendations
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted2)', marginTop: '3px' }}>
            {facilityName}
          </div>
        </div>
        {totalImpact > 0 && (
          <div style={{
            textAlign: 'right',
            background: 'rgba(107,191,184,0.08)',
            border: '1px solid rgba(107,191,184,0.2)',
            padding: '4px 10px', borderRadius: '6px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 500, color: 'var(--teal)' }}>
              +{totalImpact.toFixed(0)}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted)', letterSpacing: '1px' }}>
              URI UPLIFT
            </div>
          </div>
        )}
      </div>

      {/* Recs list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {recs.length === 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)',
          }}>
            Select a facility to view recommendations
          </div>
        ) : (
          recs.map(rec => {
            const priorityColor = rec.priority === 1 ? RISK_COLORS.CRITICAL
                                : rec.priority === 2 ? RISK_COLORS.HIGH
                                : rec.priority <= 4  ? RISK_COLORS.MEDIUM
                                : 'var(--muted2)';
            const effortColor = EFFORT_COLOR[rec.effort];
            const icon = CAT_ICONS[rec.category] ?? '●';

            return (
              <div key={rec.priority} style={{
                display: 'grid',
                gridTemplateColumns: '28px 1fr 40px',
                gap: '10px',
                alignItems: 'start',
                padding: '10px 10px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.018)',
                border: '1px solid var(--border)',
                transition: 'border-color .15s',
              }}>
                {/* Priority badge */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${priorityColor}15`,
                  border: `1px solid ${priorityColor}25`,
                  fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500,
                  color: priorityColor, flexShrink: 0,
                }}>
                  {rec.priority}
                </div>

                {/* Content */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text)', marginBottom: '4px', lineHeight: 1.4 }}>
                    {rec.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted2)', letterSpacing: '1px' }}>
                      {icon} {rec.category}
                    </span>
                    <span style={{ color: 'var(--border)', fontSize: '8px' }}>·</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: effortColor, letterSpacing: '1px' }}>
                      {rec.effort.toUpperCase()} EFFORT
                    </span>
                    <span style={{ color: 'var(--border)', fontSize: '8px' }}>·</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted)', letterSpacing: '0.5px' }}>
                      {rec.standard_ref}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted)', marginTop: '3px' }}>
                    ⟳ Due in {rec.deadline_days} days
                  </div>
                </div>

                {/* Score impact */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 500, color: 'var(--teal)' }}>
                    +{rec.score_impact}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted)', letterSpacing: '0.5px' }}>
                    URI
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confidence footer */}
      {assessment && (
        <div style={{
          marginTop: '10px', paddingTop: '10px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)' }}>
            Model confidence
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '60px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${(assessment.confidence ?? 0) * 100}%`, height: '100%', background: 'var(--teal)' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--teal)' }}>
              {((assessment.confidence ?? 0) * 100).toFixed(0)}%
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted)', maxWidth: '120px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {assessment.model_version}
          </div>
        </div>
      )}
    </div>
  );
}
