import type { FacilityRiskSummary } from '../../types';
import { RISK_COLORS } from '../../types';

interface Props {
  facilities: FacilityRiskSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const NAV_ITEMS = [
  { icon: '◈', label: 'Portfolio',    active: true  },
  { icon: '◉', label: 'GIS Map',      active: false },
  { icon: '◫', label: 'Assessments',  active: false },
  { icon: '⬡', label: 'Scenarios',    active: false },
  { icon: '▣', label: 'Reports',      active: false },
];

export function Sidebar({ facilities, selectedId, onSelect }: Props) {
  const critical = facilities.filter(f => f.risk_class === 'CRITICAL');
  const high     = facilities.filter(f => f.risk_class === 'HIGH');
  const queue    = [...critical, ...high].slice(0, 10);

  return (
    <aside style={{
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      width: '220px',
      flexShrink: 0,
    }}>
      {/* Nav */}
      <div style={{ padding: '16px 12px 8px' }}>
        <SectionLabel>Navigation</SectionLabel>
        {NAV_ITEMS.map(item => (
          <NavItem key={item.label} icon={item.icon} label={item.label} active={item.active} />
        ))}
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '4px 12px' }} />

      {/* Alert queue */}
      <div style={{ padding: '12px 12px 0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <SectionLabel style={{ marginBottom: 0 }}>Alert Queue</SectionLabel>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px',
            background: 'rgba(239,68,68,0.15)', color: 'var(--critical)',
            border: '1px solid rgba(239,68,68,0.25)',
            padding: '2px 7px', borderRadius: '4px',
          }}>
            {critical.length}
          </span>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {queue.map(f => (
            <FacilityRow
              key={f.id}
              facility={f}
              selected={f.id === selectedId}
              onClick={() => onSelect(f.id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ padding: '8px 12px 16px', borderTop: '1px solid var(--border)' }}>
        <NavItem icon="◌" label="Settings" />
        <NavItem icon="◑" label="API Docs" />
      </div>
    </aside>
  );
}

function SectionLabel({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '9px',
      letterSpacing: '2px', textTransform: 'uppercase',
      color: 'var(--muted)', marginBottom: '8px',
      ...style,
    }}>
      {children}
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: string; label: string; active?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '7px 10px', borderRadius: '7px', marginBottom: '1px',
      cursor: 'pointer', fontSize: '12px', fontWeight: 500,
      color: active ? 'var(--teal)' : 'var(--muted2)',
      background: active ? 'rgba(107,191,184,0.09)' : 'transparent',
      transition: 'background .15s, color .15s',
    }}>
      <span style={{ fontSize: '13px', opacity: 0.85 }}>{icon}</span>
      {label}
    </div>
  );
}

function FacilityRow({
  facility, selected, onClick,
}: {
  facility: FacilityRiskSummary;
  selected: boolean;
  onClick: () => void;
}) {
  const color = RISK_COLORS[facility.risk_class];
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '7px 8px', borderRadius: '6px', cursor: 'pointer',
        marginBottom: '2px',
        background: selected ? 'rgba(107,191,184,0.08)' : 'transparent',
        border: selected ? '1px solid rgba(107,191,184,0.2)' : '1px solid transparent',
        transition: 'background .15s, border-color .15s',
      }}
    >
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: color, flexShrink: 0,
        boxShadow: selected ? `0 0 6px ${color}` : 'none',
      }} />
      <div style={{
        fontSize: '11px', color: 'var(--text)', flex: 1,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {facility.name}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '11px',
        fontWeight: 500, color, flexShrink: 0,
      }}>
        {facility.uri_score}
      </div>
    </div>
  );
}
