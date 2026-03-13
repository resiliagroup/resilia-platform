'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Shield, MapPin, Building2, AlertTriangle, Activity,
  Users, Loader2, WifiOff, TrendingUp, Zap,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import {
  useOmniFacilities,
  usePortfolioSummary,
  RISK_CLASS_TR,
  RISK_CLASS_COLOR,
  type OmniFacility,
  type RiskClass,
} from '@/lib/api'

const CBSHarita = dynamic(() => import('./CBSHarita'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50" style={{ height: 520 }}>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Harita yükleniyor…
      </div>
    </div>
  ),
})

// ─────────────────────────────────────────────────────────────
const TENANT_ID = '11111111-1111-1111-1111-111111111111'
const NAVY      = '#0A1628'
const GOLD      = '#E8C97A'

const MAHALLELER = [
  { ad: 'Yakuplu',       nufus: 89420,  alan_km2: 8.2,  h: 82, f: 74, e: 38, uri: 28, risk: 'KRİTİK', tehlikeler: ['Deprem (MS-6.5+)', 'Endüstriyel Kaza (OSB)', 'Sel'],       tesisler: { okul: 12, hastane: 1, osb: 1, altyapi: 3 }, sendai: 'SF-3: Altyapı dayanıklılığı', natech: true,  natech_d: 2.4, not: 'Yakuplu OSB varlığı NATECH riskini kritik düzeye taşıyor. Domino etkisi modellemesi gerekli.' },
  { ad: 'Kavaklı',       nufus: 42180,  alan_km2: 6.1,  h: 76, f: 68, e: 44, uri: 34, risk: 'YÜKSEK', tehlikeler: ['Sel / Taşkın', 'Deprem', 'Altyapı Çökmesi'],              tesisler: { okul: 8,  hastane: 0, osb: 0, altyapi: 2 }, sendai: 'SF-4: Erken uyarı sistemi',   natech: false, natech_d: 1.0, not: 'Dere yatağına yakın konut alanları. İBB yağmursuyu ıslahı tamamlandı — artık risk izleme aşamasında.' },
  { ad: 'Gürpınar',      nufus: 38650,  alan_km2: 12.4, h: 88, f: 58, e: 62, uri: 38, risk: 'YÜKSEK', tehlikeler: ['Deprem (KAF Hattı)', 'Heyelan', 'Yangın'],                 tesisler: { okul: 6,  hastane: 0, osb: 0, altyapi: 4 }, sendai: 'SF-1: Risk yönetişimi',       natech: false, natech_d: 1.0, not: 'KAF hattına yakınlık birincil tehlike. KİPTAŞ kentsel dönüşüm projesi devam ediyor.' },
  { ad: 'Adnan Kahveci', nufus: 124300, alan_km2: 4.8,  h: 42, f: 48, e: 88, uri: 71, risk: 'ORTA',   tehlikeler: ['Deprem', 'Kalabalık Yönetimi', 'Altyapı Yükü'],           tesisler: { okul: 22, hastane: 2, osb: 0, altyapi: 6 }, sendai: 'SF-2: Kapasite geliştirme',   natech: false, natech_d: 1.0, not: 'En kalabalık mahalle. Güçlü altyapı kapasitesi. Müdahale istasyonu koordinasyon merkezi olabilir.' },
  { ad: 'Büyükşehir',    nufus: 31200,  alan_km2: 5.9,  h: 55, f: 62, e: 58, uri: 52, risk: 'ORTA',   tehlikeler: ['Deprem', 'Sel', 'Ulaşım Altyapısı'],                       tesisler: { okul: 9,  hastane: 1, osb: 0, altyapi: 3 }, sendai: 'SF-1: Afet risk azaltma',    natech: false, natech_d: 1.0, not: 'Karma kullanım alanı. Orta düzey risk profili.' },
  { ad: 'Cumhuriyet',    nufus: 28400,  alan_km2: 3.2,  h: 48, f: 55, e: 72, uri: 62, risk: 'ORTA',   tehlikeler: ['Deprem', 'Yangın', 'Altyapı'],                             tesisler: { okul: 7,  hastane: 0, osb: 0, altyapi: 2 }, sendai: 'SF-1: Afet risk azaltma',    natech: false, natech_d: 1.0, not: 'Nispeten düşük risk. AFAD deposu burada — stratejik konum avantajı.' },
]

const RISK_BADGE: Record<string, string> = {
  'KRİTİK': 'text-red-600 bg-red-50 border-red-200',
  'YÜKSEK': 'text-orange-600 bg-orange-50 border-orange-200',
  'ORTA':   'text-amber-600 bg-amber-50 border-amber-200',
  'DÜŞÜK':  'text-emerald-600 bg-emerald-50 border-emerald-200',
}

const RISK_CLASS_BADGE: Record<RiskClass, string> = {
  CRITICAL:  'text-red-600 bg-red-50 border-red-200',
  HIGH:      'text-orange-600 bg-orange-50 border-orange-200',
  MEDIUM:    'text-amber-600 bg-amber-50 border-amber-200',
  RESILIENT: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  EXEMPLARY: 'text-indigo-600 bg-indigo-50 border-indigo-200',
}

const TABS = [
  { key: 'ozet',    label: 'İlçe Özeti'       },
  { key: 'mahalle', label: 'Mahalle Analizi'   },
  { key: 'tesis',   label: 'Tesis Ağı'         },
  { key: 'harita',  label: 'CBS Harita'        },
  { key: 'natech',  label: 'NATECH Senaryo'    },
  { key: 'sendai',  label: 'Sendai Uyum'       },
] as const
type Tab = typeof TABS[number]['key']

// ─── Gauge chart (yarım daire) ────────────────────────────────
function URIGauge({ value, renk }: { value: number; renk: string }) {
  const data = [
    { value, fill: renk },
    { value: 100 - value, fill: '#F3F4F6' },
  ]
  return (
    <div style={{ position: 'relative', width: 200, height: 110 }}>
      <PieChart width={200} height={130}>
        <Pie
          data={data} cx={100} cy={110}
          startAngle={180} endAngle={0}
          innerRadius={60} outerRadius={85}
          paddingAngle={0} dataKey="value" stroke="none"
          isAnimationActive
        >
          {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
        </Pie>
      </PieChart>
      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: renk, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  )
}

// ─── Yardımcı ─────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Yükleniyor…</span>
    </div>
  )
}
function ApiError({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      <span>API hatası: {msg}</span>
    </div>
  )
}
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  )
}
function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2 text-sm">
      <Icon className="w-4 h-4" style={{ color: GOLD }} />
      {title}
    </h3>
  )
}

function facilityRiskBadge(f: OmniFacility) {
  const age = f.building_age ?? 20
  const sz  = f.seismic_zone ?? 2
  if (sz === 1 && age > 35) return { label: 'YÜKSEK', cls: RISK_BADGE['YÜKSEK'] }
  if (sz <= 2 && age > 20)  return { label: 'ORTA',   cls: RISK_BADGE['ORTA']   }
  return { label: 'DÜŞÜK', cls: RISK_BADGE['DÜŞÜK'] }
}

// ─────────────────────────────────────────────────────────────
export default function BeylikduzuKomuta() {
  const [tab, setTab]         = useState<Tab>('ozet')
  const [secili, setSecili]   = useState(MAHALLELER[0])
  const [senaryo, setSenaryo] = useState('deprem')
  const [siddet, setSiddet]   = useState(6.5)

  const { data: facilities, loading: facLoading, error: facError } = useOmniFacilities(TENANT_ID)
  const { data: portfolio,  loading: portLoading                  } = usePortfolioSummary(TENANT_ID)

  const ilceUriStatic  = Math.round(MAHALLELER.reduce((a, m) => a + m.uri, 0) / MAHALLELER.length)
  const kritikStatic   = MAHALLELER.filter(m => m.risk === 'KRİTİK' || m.risk === 'YÜKSEK').length
  const toplamNufus    = MAHALLELER.reduce((a, m) => a + m.nufus, 0)
  const ortH           = Math.round(MAHALLELER.reduce((a, m) => a + m.h, 0) / MAHALLELER.length)
  const ortF           = Math.round(MAHALLELER.reduce((a, m) => a + m.f, 0) / MAHALLELER.length)
  const ortE           = Math.round(MAHALLELER.reduce((a, m) => a + m.e, 0) / MAHALLELER.length)

  const ilceUri       = portfolio ? Math.round(portfolio.avg_uri ?? ilceUriStatic) : ilceUriStatic
  const toplamTesis   = portfolio?.total ?? facilities?.length ?? 0
  const kritikTesis   = portfolio?.critical_count ?? 0
  const toplamPersonel = facilities?.reduce((a, f) => a + (f.employee_count ?? 0), 0) ?? 0

  const natechEtki    = senaryo === 'deprem' ? Math.min(100, Math.round((siddet - 5) * 28 * 1.4)) : senaryo === 'yangin' ? 45 : 38
  const etkilenenNufus = Math.round(toplamNufus * (natechEtki / 100) * 0.6)

  // Risk sınıfı renk
  const uriRenk = ilceUri < 40 ? '#EF4444' : ilceUri < 60 ? '#F97316' : ilceUri < 75 ? '#F59E0B' : '#22C55E'

  // Recharts: mahalle URI bar data
  const mahalleBarData = MAHALLELER.map(m => ({
    ad: m.ad, URI: m.uri,
    fill: m.uri < 40 ? '#EF4444' : m.uri < 60 ? '#F97316' : m.uri < 75 ? '#F59E0B' : '#22C55E',
  }))

  // Recharts: risk sınıfı donut (portfolio veya statik)
  const riskDonutData = portfolio
    ? (Object.entries(portfolio.by_class) as [RiskClass, number][])
        .filter(([, cnt]) => cnt > 0)
        .map(([cls, cnt]) => ({ name: RISK_CLASS_TR[cls], value: cnt, fill: RISK_CLASS_COLOR[cls] }))
    : [
        { name: 'Kritik',   value: 2, fill: '#EF4444' },
        { name: 'Yüksek',  value: 2, fill: '#F97316' },
        { name: 'Orta',    value: 2, fill: '#F59E0B' },
      ]

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background: NAVY }} className="px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40` }} className="p-2.5 rounded-xl">
              <Shield className="w-6 h-6" style={{ color: GOLD }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Beylikdüzü Belediyesi</h1>
              <p style={{ color: '#94A3B8' }} className="text-xs mt-0.5">
                OMNI Afet Dayanıklılık Platformu · HFER-720 v2.0 · Sendai 2015–2030
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div style={{
              background: facLoading || portLoading ? 'rgba(148,163,184,.1)' : facError ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)',
              border: `1px solid ${facLoading || portLoading ? 'rgba(148,163,184,.2)' : facError ? 'rgba(239,68,68,.2)' : 'rgba(34,197,94,.25)'}`,
              color: facLoading || portLoading ? '#94A3B8' : facError ? '#F87171' : '#4ADE80',
            }} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg">
              <span className={`w-1.5 h-1.5 rounded-full ${facLoading || portLoading ? 'bg-slate-400 animate-pulse' : facError ? 'bg-red-400' : 'bg-emerald-400'}`} />
              {facLoading || portLoading ? 'Bağlanıyor…' : facError ? 'API bağlanamadı' : `Railway · ${toplamTesis} tesis`}
            </div>
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg" style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30`, color: GOLD }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
              Canlı · {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">

        {/* ── KPI KARTLARI ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* URI */}
          <Card className="p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">İlçe URI Skoru</p>
            {portLoading
              ? <div className="h-9 w-24 bg-gray-100 rounded animate-pulse mt-1" />
              : <p className="text-3xl font-bold mt-1" style={{ color: uriRenk }}>{ilceUri}<span className="text-lg text-gray-300">/100</span></p>
            }
            <p className="text-xs text-gray-400 mt-2">{portfolio ? 'Railway · HFER-720' : 'Mahalle analizi'}</p>
          </Card>

          {/* Kritik */}
          <Card className="p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Kritik Tesis</p>
            {portLoading
              ? <div className="h-9 w-16 bg-gray-100 rounded animate-pulse mt-1" />
              : <p className="text-3xl font-bold text-red-500 mt-1">{portfolio ? kritikTesis : kritikStatic}<span className="text-lg text-gray-300">/{portfolio ? toplamTesis : MAHALLELER.length}</span></p>
            }
            <p className="text-xs text-gray-400 mt-2">{portfolio ? 'CRITICAL sınıfı · Railway' : 'Kritik + Yüksek riskli'}</p>
          </Card>

          {/* Personel/Nüfus */}
          <Card className="p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{facilities ? 'Toplam Personel' : 'Toplam Nüfus'}</p>
            {facLoading
              ? <div className="h-9 w-20 bg-gray-100 rounded animate-pulse mt-1" />
              : <p className="text-3xl font-bold text-gray-900 mt-1">{facilities ? toplamPersonel.toLocaleString('tr-TR') : `${(toplamNufus / 1000).toFixed(0)}K`}</p>
            }
            <p className="text-xs text-gray-400 mt-2">{facilities ? `${toplamTesis} tesis · Railway` : 'Risk altındaki nüfus'}</p>
          </Card>

          {/* NATECH */}
          <Card className="p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">NATECH Tesisi</p>
            <p className="text-3xl font-bold text-orange-500 mt-1">1 OSB</p>
            <p className="text-xs text-gray-400 mt-2">Yakuplu · D katsayısı 2.4</p>
          </Card>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-0 mb-6 border-b border-gray-200">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
                tab === t.key
                  ? 'border-[#E8C97A] text-[#0A1628]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}>
              {t.label}
              {t.key === 'tesis' && toplamTesis > 0 && (
                <span className="ml-1.5 text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-full">
                  {toplamTesis}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════
            İLÇE ÖZETİ
        ══════════════════════════════════════════════════════ */}
        {tab === 'ozet' && (
          <div className="space-y-5">

            {/* Üst satır: Gauge + HFE bileşen + Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* URI Gauge */}
              <Card className="p-6 flex flex-col items-center justify-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">İlçe URI Skoru</p>
                <URIGauge value={ilceUri} renk={uriRenk} />
                <div className="mt-3 text-center">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                    ilceUri < 40 ? RISK_BADGE['KRİTİK'] : ilceUri < 60 ? RISK_BADGE['YÜKSEK'] : ilceUri < 75 ? RISK_BADGE['ORTA'] : RISK_BADGE['DÜŞÜK']
                  }`}>
                    {ilceUri < 40 ? 'KRİTİK' : ilceUri < 60 ? 'YÜKSEK' : ilceUri < 75 ? 'ORTA' : 'İYİ'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">HFER-720 · İTÜ AYM validasyonlu</p>
              </Card>

              {/* HFE Bileşenler */}
              <Card className="p-6">
                <SectionTitle icon={Activity} title="HFE Bileşen Analizi" />
                {[
                  { label: 'H — Tehlike Yoğunluğu', val: ortH, renk: '#EF4444', not: 'Düşük = iyi' },
                  { label: 'F — Kırılganlık',        val: ortF, renk: '#F97316', not: 'Düşük = iyi' },
                  { label: 'E — Kapasite',            val: ortE, renk: '#22C55E', not: 'Yüksek = iyi' },
                ].map(item => (
                  <div key={item.label} className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="text-gray-800 font-mono font-semibold">{item.val} <span className="text-gray-300">({item.not})</span></span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${item.val}%`, background: item.renk }} />
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 rounded-lg text-xs text-gray-500" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}>
                  <span style={{ color: GOLD }} className="font-medium">HFER-720:</span> URI = NormCurve(H × F × X × D / (1 + k·C²))
                </div>
              </Card>

              {/* Risk Dağılımı Donut */}
              <Card className="p-6">
                <SectionTitle icon={TrendingUp} title="Risk Sınıf Dağılımı" />
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={riskDonutData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={3} stroke="none">
                        {riskDonutData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} tesis`]} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-1">
                    {riskDonutData.map(d => (
                      <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                        {d.name} ({d.value})
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Alt satır: Aksiyon planı + Kapasite */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card className="p-6">
                <SectionTitle icon={AlertTriangle} title="Öncelikli Aksiyon Planı" />
                {[
                  { baslik: 'Yakuplu OSB — NATECH Planı',     acil: true,  icerik: 'RAPID-N protokolü uygulanmalı. Komşu tesis bağımlılık haritası ve domino zinciri analizi gerekli.', badge: 'Acil' },
                  { baslik: 'Kavaklı — Sel Erken Uyarı',      acil: true,  icerik: 'Meteoroloji API entegrasyonu + SMS/siren sistemi. İBB ıslah sonrası izleme kritik.',              badge: 'Acil' },
                  { baslik: 'Gürpınar — KAF Hattı Planı',     acil: false, icerik: 'Zemin sıvılaşma etüdü. KİPTAŞ dönüşümü hızlandırılmalı. Heyelan risk haritası çıkarılmalı.',     badge: 'Planla' },
                  { baslik: 'İlçe ISO 22301 İş Sürekliliği',  acil: false, icerik: 'Belediye kritik hizmetleri için iş sürekliliği planı. Uluslararası fon başvurusu için zorunlu.',  badge: 'Planla' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className={`w-1 rounded-full flex-shrink-0 my-0.5 ${item.acil ? 'bg-red-400' : 'bg-amber-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-medium text-gray-800">{item.baslik}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.acil ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>{item.badge}</span>
                      </div>
                      <p className="text-xs text-gray-500">{item.icerik}</p>
                    </div>
                  </div>
                ))}
              </Card>

              <Card className="p-6">
                <SectionTitle icon={Users} title="NEFES Birliği Kapasitesi" />
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Gönüllü',            val: '992',    ikon: '👥' },
                    { label: 'Müdahale Aracı',     val: '169',    ikon: '🚒' },
                    { label: 'Müdahale İstasyonu', val: '10',     ikon: '📦' },
                    { label: 'Haneye Ulaşıldı',    val: '75.498', ikon: '🏠' },
                  ].map(k => (
                    <div key={k.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                      <p className="text-xl mb-1">{k.ikon}</p>
                      <p className="text-lg font-bold text-gray-900">{k.val}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{k.label}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg text-xs text-gray-500" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}>
                  <span style={{ color: GOLD }} className="font-medium">OMNI × Beylikdüzü Sinerji:</span>{' '}
                  Mevcut operasyonel kapasite güçlü. OMNI bu kapasiteye kantitatif risk skoru, NATECH analizi ve uluslararası standart uyumu ekliyor.
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            MAHALLE ANALİZİ
        ══════════════════════════════════════════════════════ */}
        {tab === 'mahalle' && (
          <div className="space-y-5">
            {/* URI Bar Chart */}
            <Card className="p-6">
              <SectionTitle icon={Activity} title="Mahalle Bazlı URI Dayanıklılık Skoru" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mahalleBarData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="ad" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v) => [`${v}`, 'URI Skoru']}
                    contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  />
                  <Bar dataKey="URI" radius={[4, 4, 0, 0]}>
                    {mahalleBarData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Liste + Detay */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="space-y-2">
                {MAHALLELER.map(m => (
                  <button key={m.ad} onClick={() => setSecili(m)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      secili.ad === m.ad
                        ? 'bg-white border-gray-300 shadow-md'
                        : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-900 text-sm font-medium">{m.ad}</span>
                        {m.natech && <span className="text-xs bg-orange-50 border border-orange-200 text-orange-600 px-1.5 py-0.5 rounded">NATECH</span>}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RISK_BADGE[m.risk]}`}>{m.risk}</span>
                    </div>
                    <div className="flex gap-4 mt-1.5 ml-5">
                      <span className="text-xs text-gray-400">URI: <span className="text-gray-800 font-mono font-semibold">{m.uri}</span></span>
                      <span className="text-xs text-gray-400">{(m.nufus / 1000).toFixed(0)}K kişi</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-gray-900">{secili.ad} Mahallesi</h3>
                    <div className="flex items-center gap-2">
                      {secili.natech && <span className="text-xs bg-orange-50 border border-orange-200 text-orange-600 px-2 py-1 rounded-full">⚠ NATECH D={secili.natech_d}</span>}
                      <span className={`text-sm px-3 py-1 rounded-full border font-medium ${RISK_BADGE[secili.risk]}`}>{secili.risk}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: 'H Tehlike',     val: secili.h, renk: '#EF4444' },
                      { label: 'F Kırılganlık', val: secili.f, renk: '#F97316' },
                      { label: 'E Kapasite',    val: secili.e, renk: '#22C55E' },
                    ].map(item => (
                      <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                        <p className="text-2xl font-bold" style={{ color: item.renk }}>{item.val}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Tespit Edilen Tehlikeler</p>
                    <div className="flex flex-wrap gap-2">
                      {secili.tehlikeler.map(t => (
                        <span key={t} className="text-xs bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: 'Okul',    val: secili.tesisler.okul,    ikon: '🏫' },
                      { label: 'Hastane', val: secili.tesisler.hastane, ikon: '🏥' },
                      { label: 'OSB',     val: secili.tesisler.osb,     ikon: '🏭' },
                      { label: 'Altyapı', val: secili.tesisler.altyapi, ikon: '⚡' },
                    ].map(t => (
                      <div key={t.label} className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                        <p className="text-lg">{t.ikon}</p>
                        <p className="text-lg font-bold text-gray-900">{t.val}</p>
                        <p className="text-xs text-gray-400">{t.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}>
                      <p className="text-xs font-medium mb-1" style={{ color: GOLD }}>{secili.sendai}</p>
                      <p className="text-xs text-gray-400">Sendai Öncelik Alanı</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                      <p className="text-xs text-gray-800 font-mono font-semibold mb-1">URI = {secili.uri}/100</p>
                      <p className="text-xs text-gray-400">Dayanıklılık Endeksi</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">OMNI Analiz Notu</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{secili.not}</p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TESİS AĞI
        ══════════════════════════════════════════════════════ */}
        {tab === 'tesis' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {facLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="p-5 text-center animate-pulse">
                    <div className="h-8 w-8 bg-gray-100 rounded mx-auto mb-2" />
                    <div className="h-9 w-12 bg-gray-100 rounded mx-auto" />
                  </Card>
                ))
              ) : facilities ? (
                <>
                  <Card className="p-5 text-center">
                    <p className="text-3xl mb-2">🏛️</p>
                    <p className="text-4xl font-bold text-blue-600">{facilities.length}</p>
                    <p className="text-xs text-gray-400 mt-2">Toplam Tesis</p>
                  </Card>
                  <Card className="p-5 text-center">
                    <p className="text-3xl mb-2">👥</p>
                    <p className="text-4xl font-bold text-gray-900">{toplamPersonel.toLocaleString('tr-TR')}</p>
                    <p className="text-xs text-gray-400 mt-2">Toplam Personel</p>
                  </Card>
                  <Card className="p-5 text-center">
                    <p className="text-3xl mb-2">🔴</p>
                    <p className="text-4xl font-bold text-red-500">
                      {facilities.filter(f => (f.seismic_zone ?? 0) >= 2 && (f.building_age ?? 0) > 20).length}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Deprem Riski Yüksek</p>
                  </Card>
                  <Card className="p-5 text-center">
                    <p className="text-3xl mb-2">✅</p>
                    <p className="text-4xl font-bold text-emerald-600">{facilities.filter(f => f.is_active).length}</p>
                    <p className="text-xs text-gray-400 mt-2">Aktif Tesis</p>
                  </Card>
                </>
              ) : (
                <div className="col-span-4 p-4">{facError ? <ApiError msg={facError} /> : <Spinner />}</div>
              )}
            </div>

            <Card>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-gray-900 font-semibold flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" style={{ color: GOLD }} /> Tesis Listesi
                </h3>
                <div className="flex items-center gap-2">
                  {facilities && <span className="text-xs bg-blue-50 border border-blue-200 text-blue-600 px-2 py-1 rounded-full">Railway · Canlı</span>}
                  <span className="text-xs text-gray-400">NFPA · AFAD · ISO 22301</span>
                </div>
              </div>

              {facLoading && <div className="p-8 flex justify-center"><Spinner /></div>}
              {facError && <div className="p-6"><ApiError msg={facError} /></div>}
              {facilities?.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">Bu tenant için tesis bulunamadı.</div>}

              {facilities && facilities.length > 0 && (
                <div className="divide-y divide-gray-50">
                  {facilities.map((f: OmniFacility) => {
                    const badge = facilityRiskBadge(f)
                    return (
                      <div key={f.id} className="flex flex-wrap items-center justify-between p-4 hover:bg-gray-50 transition-colors gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <Building2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-900 font-medium truncate">{f.name}</p>
                              <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">{f.code}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {f.building_age != null && `${f.building_age} yıl · `}
                              {f.employee_count != null && `${f.employee_count} personel`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {f.seismic_zone != null && (
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded hidden lg:inline">Zon: {f.seismic_zone}</span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.cls}`}>{badge.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${f.is_active ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-gray-400 bg-gray-50 border-gray-200'}`}>
                            {f.is_active ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>

            {portfolio && (
              <Card className="p-5">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Railway · Portföy Özeti</p>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Toplam',   val: portfolio.total,              renk: 'text-gray-900' },
                    { label: 'Ort. URI', val: portfolio.avg_uri?.toFixed(1) ?? '—', renk: 'text-amber-600' },
                    { label: 'Min URI',  val: portfolio.min_uri?.toFixed(1) ?? '—', renk: 'text-red-500' },
                    { label: 'Maks URI', val: portfolio.max_uri?.toFixed(1) ?? '—', renk: 'text-emerald-600' },
                    { label: 'Kritik',   val: portfolio.critical_count,     renk: 'text-red-500' },
                  ].map(k => (
                    <div key={k.label} className="text-center">
                      <p className={`text-2xl font-bold ${k.renk}`}>{k.val}</p>
                      <p className="text-xs text-gray-400 mt-1">{k.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            CBS HARİTA
        ══════════════════════════════════════════════════════ */}
        {tab === 'harita' && <CBSHarita />}

        {/* ══════════════════════════════════════════════════════
            NATECH SENARYO
        ══════════════════════════════════════════════════════ */}
        {tab === 'natech' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="p-6">
              <SectionTitle icon={Zap} title="Senaryo Parametreleri" />

              <div className="mb-5">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Afet Türü</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ key: 'deprem', label: '🌍 Deprem' }, { key: 'yangin', label: '🔥 Yangın' }, { key: 'sel', label: '🌊 Sel' }].map(s => (
                    <button key={s.key} onClick={() => setSenaryo(s.key)}
                      className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        senaryo === s.key ? 'text-[#0A1628] bg-white shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-800'
                      }`}
                      style={senaryo === s.key ? { borderColor: GOLD } : {}}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {senaryo === 'deprem' && (
                <div className="mb-5">
                  <div className="flex justify-between mb-2">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Deprem Şiddeti (Mw)</p>
                    <p className="font-mono font-bold text-sm" style={{ color: GOLD }}>{siddet.toFixed(1)}</p>
                  </div>
                  <input type="range" min="5.0" max="8.0" step="0.1" value={siddet}
                    onChange={e => setSiddet(parseFloat(e.target.value))}
                    className="w-full accent-yellow-400" />
                  <div className="flex justify-between text-xs text-gray-300 mt-1"><span>Mw 5.0</span><span>Mw 8.0</span></div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">RAPID-N Protokolü</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Etkilenen tesis',  val: 'Yakuplu OSB' },
                    { label: 'NATECH D katsayısı', val: '2.4', renk: '#F97316' },
                    { label: 'Domino zinciri',   val: '3 komşu tesis' },
                    { label: 'Tahliye süresi',   val: '~45 dk' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-mono font-medium text-gray-800" style={item.renk ? { color: item.renk } : {}}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className={`p-6 ${natechEtki > 60 ? 'border-red-200' : natechEtki > 30 ? 'border-orange-200' : 'border-amber-200'}`}>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">NATECH Kümülatif Etki Skoru</p>
                <p className={`text-6xl font-bold mb-2 ${natechEtki > 60 ? 'text-red-500' : natechEtki > 30 ? 'text-orange-500' : 'text-amber-500'}`}>
                  {natechEtki}<span className="text-2xl text-gray-200">/100</span>
                </p>
                <p className="text-gray-600 text-sm">
                  {natechEtki > 60 ? 'KRİTİK — Acil tahliye ve müdahale protokolü devreye alınmalı' :
                   natechEtki > 30 ? 'YÜKSEK — Önleyici önlemler ve erken uyarı aktif edilmeli' :
                   'ORTA — İzleme ve hazırlık seviyesi yükseltilmeli'}
                </p>
              </Card>

              <Card className="p-5">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Etki Projeksiyonu</p>
                <div className="space-y-3">
                  {[
                    { label: 'Risk altındaki nüfus',    val: `~${(etkilenenNufus / 1000).toFixed(0)}K kişi`, renk: 'text-red-500' },
                    { label: 'Tahliye gerektiren bölge', val: 'Yakuplu + Kavaklı',                           renk: 'text-orange-500' },
                    { label: 'Etkilenen okul sayısı',   val: `${Math.ceil(natechEtki / 20)} okul`,          renk: 'text-amber-600' },
                    { label: 'Acil müdahale süresi',    val: senaryo === 'deprem' ? '72 saat' : '48 saat',  renk: 'text-gray-800' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span className={`text-sm font-medium ${item.renk}`}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="p-4 rounded-xl text-xs text-gray-500" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}25` }}>
                <p className="font-medium mb-1" style={{ color: GOLD }}>OMNI × RAPID-N Entegrasyonu</p>
                <p className="leading-relaxed">RAPID-N protokolü ile Yakuplu OSB için kimyasal yayılım modeli, rüzgar yönü ve nüfus yoğunluğu birleştirilerek gerçek zamanlı tahliye koridoru oluşturulabilir.</p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            SENDAİ UYUM
        ══════════════════════════════════════════════════════ */}
        {tab === 'sendai' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { no: 'SF-1', baslik: 'Afet Riskini Anlama',                 puan: 72, durum: 'Aktif',     omni: 'HFER-720 URI skoru + mahalle bazlı risk haritası',           renk: 'emerald' },
                { no: 'SF-2', baslik: 'Risk Yönetişimini Güçlendirme',       puan: 48, durum: 'Kısmi',     omni: 'Belediye ISO 22301 BCP planlaması + OMNI dashboard',         renk: 'amber'   },
                { no: 'SF-3', baslik: 'Dayanıklılığa Yatırım',               puan: 35, durum: 'Planlandı', omni: 'Tesis ağı dayanıklılık skoru + NATECH D katsayısı',          renk: 'amber'   },
                { no: 'SF-4', baslik: 'Etkin Müdahale ve Yeniden Yapılanma', puan: 21, durum: 'Eksik',     omni: 'EOC dashboard + NEFES Birliği protokolü entegrasyonu',       renk: 'red'     },
              ].map(s => (
                <Card key={s.no} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{s.no}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      s.renk === 'emerald' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                      s.renk === 'amber'   ? 'text-amber-600 bg-amber-50 border-amber-200' :
                      'text-red-600 bg-red-50 border-red-200'
                    }`}>{s.durum}</span>
                  </div>
                  <p className="text-gray-900 font-semibold mb-3 text-sm">{s.baslik}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full mb-3">
                    <div className={`h-1.5 rounded-full ${s.renk === 'emerald' ? 'bg-emerald-500' : s.renk === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${s.puan}%` }} />
                  </div>
                  <p className="text-xs text-gray-500"><span style={{ color: GOLD }} className="font-medium">OMNI katkısı:</span> {s.omni}</p>
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <h3 className="text-gray-900 font-semibold mb-4 text-sm">Uluslararası Fon Fırsatları</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                  { fon: 'EU Horizon Europe',   konu: 'Şehir Dayanıklılığı (2024–2027)',  gereklilik: 'Sendai uyum raporu + kantitatif risk skoru', durum: 'Uygun'         },
                  { fon: 'UNDP DRRM',           konu: 'Afet Risk Azaltma Fonu',           gereklilik: 'RAPID-N analizi + tesis ağı haritası',       durum: 'Değerlendirme' },
                  { fon: 'Dünya Bankası GFDRR', konu: 'Küresel Afet Risk Finansmanı',     gereklilik: 'ISO 22301 BCP + URI endeksi',                 durum: 'Potansiyel'    },
                ].map(f => (
                  <div key={f.fon} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-gray-900 font-medium text-sm mb-1">{f.fon}</p>
                    <p className="text-xs text-gray-400 mb-2">{f.konu}</p>
                    <p className="text-xs text-gray-400 mb-3"><span className="text-gray-600">Gereklilik:</span> {f.gereklilik}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      f.durum === 'Uygun'         ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                      f.durum === 'Değerlendirme' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                      'text-blue-600 bg-blue-50 border-blue-200'
                    }`}>{f.durum}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-10 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-300">OMNI Resilience Platform · HFER-720 v2.0 · İTÜ AYM · © 2026</p>
          <p className="text-xs text-gray-300">Sendai 2015–2030 · ISO 22301 · AFAD · RAPID-N · NFPA</p>
        </div>
      </div>
    </div>
  )
}
