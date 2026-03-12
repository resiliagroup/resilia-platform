import { useClock } from '../../hooks';
import type { PortfolioStats } from '../../types';
import { RISK_COLORS } from '../../types';

interface Props {
  portfolio: PortfolioStats | null;
}

export function TopBar({ portfolio }: Props) {
  const time = useClock();
  const timeStr = time.toLocaleTimeString('en-GB', { hour12: false });
  const dateStr = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header style={{
      gridColumn: '1 / -1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      height: '52px',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <OmniLogo />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, letterSpacing: '5px', color: '#fff' }}>
            OMNI
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted)', letterSpacing: '2px', marginTop: '-1px' }}>
            RISK INTELLIGENCE ENGINE
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <KpiChip
          label="Critical"
          value={portfolio?.by_risk_class?.CRITICAL ?? '—'}
          color={RISK_COLORS.CRITICAL}
        />
        <Divider />
        <KpiChip
          label="Avg URI"
          value={portfolio?.avg_uri_score?.toFixed(1) ?? '—'}
          color='var(--gold)'
        />
        <Divider />
        <KpiChip
          label="Facilities"
          value={portfolio?.total_facilities?.toLocaleString() ?? '—'}
          color='var(--teal)'
        />
        <Divider />
        <KpiChip
          label="Assessed"
          value={portfolio ? `${Math.round((portfolio.assessed_count / portfolio.total_facilities) * 100)}%` : '—'}
          color='var(--blue)'
        />
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <LiveBadge />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text)', letterSpacing: '1px' }}>
            {timeStr}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', letterSpacing: '1px', marginTop: '1px' }}>
            {dateStr}
          </div>
        </div>
      </div>
    </header>
  );
}

function OmniLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="17" stroke="#E8C97A" strokeWidth="1.5"
        strokeDasharray="84 22" strokeDashoffset="-6" strokeLinecap="round" />
      <circle cx="20" cy="20" r="11.5" stroke="#7B9FD4" strokeWidth="1.5"
        strokeDasharray="54 18" strokeDashoffset="18" strokeLinecap="round" />
      <circle cx="20" cy="20" r="6" stroke="#6ABFB8" strokeWidth="1.5"
        strokeDasharray="27 11" strokeDashoffset="36" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2.5" fill="#E2E8F0" />
    </svg>
  );
}

function KpiChip({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 500, color, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '2px' }}>
        {label}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />;
}

function LiveBadge() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--teal)', letterSpacing: '2px' }}>
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%', background: 'var(--teal)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
      LIVE
    </div>
  );
}
