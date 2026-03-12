import { useState } from 'react';
import { usePortfolio, useAssessment } from './hooks';
import { facilitiesToMapPoints } from './lib/api';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { TurkeyMap } from './components/map/TurkeyMap';
import { HFERRadar } from './components/charts/HFERRadar';
import { RiskDistribution } from './components/charts/RiskDistribution';
import { FacilityTable } from './components/panels/FacilityTable';
import { SectorScores, HazardBreakdownPanel } from './components/panels/SectorScores';
import { RecommendationsPanel } from './components/panels/Recommendations';

// ─── Card primitive ─────────────────────────────────────────────────────────

function Card({
  children,
  style = {},
  fadeIndex = 0,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  fadeIndex?: number;
}) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
      animationDelay: `${fadeIndex * 0.06}s`,
      ...style,
    }} className="card-fade">
      {/* top highlight line */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const { data: portfolio, loading: portfolioLoading } = usePortfolio();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('f001');
  const { data: assessment, loading: assessmentLoading } = useAssessment(selectedFacilityId);

  const mapFacilities = portfolio ? facilitiesToMapPoints(portfolio.facilities) : [];

  function handleSelect(id: string) {
    setSelectedFacilityId(id);
  }

  return (
    <>
      <style>{`
        :root {
          --bg:      #070C14;
          --bg2:     #0C1220;
          --bg3:     #111827;
          --border:  rgba(255,255,255,0.065);
          --border2: rgba(255,255,255,0.11);
          --text:    #E2E8F0;
          --muted:   #64748B;
          --muted2:  #94A3B8;
          --critical:  #EF4444;
          --high:      #F97316;
          --medium:    #EAB308;
          --resilient: #22C55E;
          --exemplary: #6ABFB8;
          --gold:      #E8C97A;
          --blue:      #7B9FD4;
          --teal:      #6ABFB8;
          --font-display: 'Syne', sans-serif;
          --font-mono:    'DM Mono', monospace;
          --font-body:    'DM Sans', sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; overflow: hidden; }
        body {
          font-family: var(--font-body);
          background: var(--bg);
          color: var(--text);
          font-size: 13px;
        }
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(1.6); }
        }
        @keyframes card-fadein {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-fade {
          animation: card-fadein 0.4s ease both;
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.09); border-radius: 2px; }
      `}</style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gridTemplateRows: '52px 1fr',
        height: '100vh',
        overflow: 'hidden',
      }}>

        {/* ── TopBar ── */}
        <TopBar portfolio={portfolio} />

        {/* ── Sidebar ── */}
        <Sidebar
          facilities={portfolio?.facilities ?? []}
          selectedId={selectedFacilityId}
          onSelect={handleSelect}
        />

        {/* ── Main ── */}
        <main style={{
          overflow: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: 'var(--bg)',
        }}>

          {/* ── ROW 1: Map + Side Column ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '14px' }}>

            {/* GIS Map */}
            <Card style={{ padding: 0, minHeight: '340px' }} fadeIndex={0}>
              <TurkeyMap
                facilities={mapFacilities}
                selectedId={selectedFacilityId}
                onSelect={handleSelect}
              />
            </Card>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Card fadeIndex={1}>
                <RiskDistribution portfolio={portfolio} />
              </Card>
              <Card fadeIndex={2}>
                <SectorScores portfolio={portfolio} />
              </Card>
            </div>
          </div>

          {/* ── ROW 2: Table + Radar + Recommendations ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 300px', gap: '14px' }}>

            {/* Facility table */}
            <Card fadeIndex={3} style={{ minHeight: '380px' }}>
              <FacilityTable
                facilities={portfolio?.facilities ?? []}
                selectedId={selectedFacilityId}
                onSelect={handleSelect}
              />
            </Card>

            {/* HFER Radar */}
            <Card fadeIndex={4}>
              <HFERRadar
                assessment={assessment}
                loading={assessmentLoading}
              />
            </Card>

            {/* Recommendations */}
            <Card fadeIndex={5}>
              <RecommendationsPanel assessment={assessment} />
            </Card>

          </div>

          {/* ── ROW 3: Hazard profile ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <Card fadeIndex={6}>
              <HazardBreakdownPanel assessment={assessment} />
            </Card>

            {/* Confidence + meta */}
            <Card fadeIndex={7}>
              <ModelMetaPanel assessment={assessment} />
            </Card>

            {/* Quick stats */}
            <Card fadeIndex={8}>
              <PortfolioMeta portfolio={portfolio} />
            </Card>
          </div>

        </main>
      </div>
    </>
  );
}

// ─── Model Meta ─────────────────────────────────────────────────────────────

function ModelMetaPanel({ assessment }: { assessment: any }) {
  if (!assessment) return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>
        Assessment Meta
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>
        Select a facility
      </div>
    </div>
  );

  const rows = [
    { label: 'Assessed',      value: new Date(assessment.assessed_at).toLocaleString('en-GB', { day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit' }) },
    { label: 'Valid Until',   value: new Date(assessment.valid_until).toLocaleDateString('en-GB', { day:'2-digit',month:'short',year:'numeric' }) },
    { label: 'Review In',     value: `${assessment.next_review_days} days` },
    { label: 'Model',         value: assessment.model_version?.split('/').slice(-1)[0] ?? '—' },
    { label: 'Confidence',    value: `${((assessment.confidence ?? 0)*100).toFixed(0)}%` },
    { label: 'Open Actions',  value: `${assessment.recommendations?.length ?? 0}` },
  ];

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>
        Assessment Meta
      </div>
      {rows.map(r => (
        <div key={r.label} style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '7px 0',
          borderBottom: '1px solid rgba(255,255,255,0.03)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)' }}>{r.label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted2)', fontWeight: 500 }}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Portfolio Meta ─────────────────────────────────────────────────────────

function PortfolioMeta({ portfolio }: { portfolio: any }) {
  const assessed = portfolio ? Math.round((portfolio.assessed_count / portfolio.total_facilities) * 100) : 0;

  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '14px' }}>
        Portfolio Overview
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[
          { label: 'Total Facilities', value: portfolio?.total_facilities?.toLocaleString() ?? '—', color: 'var(--text)' },
          { label: 'Assessed', value: `${portfolio?.assessed_count?.toLocaleString() ?? '—'}`, color: 'var(--teal)' },
          { label: 'Coverage', value: `${assessed}%`, color: assessed >= 80 ? 'var(--resilient)' : 'var(--medium)' },
          { label: 'Open Recs', value: '247', color: 'var(--blue)' },
        ].map(stat => (
          <div key={stat.label} style={{
            padding: '10px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--muted)', letterSpacing: '1px', marginTop: '3px' }}>
              {stat.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
