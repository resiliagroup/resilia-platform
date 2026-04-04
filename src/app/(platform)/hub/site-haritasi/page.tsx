'use client'

function uriToAdis(uri: number): number { return Math.round(200 + (uri / 100) * 1000) }
function adisRenk(a: number): string { return a<450?'#EF4444':a<650?'#F97316':a<850?'#EAB308':a<1050?'#22C55E':'#16A34A' }
function adisLabel(a: number): string { return a<450?'Kritik Risk':a<650?'Yüksek Risk':a<850?'Orta Risk':a<1050?'İyi':'Güçlü' }
import { useState, useEffect } from 'react'
import { ChevronDown, ExternalLink, Shield, BarChart2, Map, Building2, Zap, Settings, FileText, Globe, LayoutGrid } from 'lucide-react'

const C = {
  navy: '#0A1628', navyL: '#0F2240', teal: '#009B8D',
  border: '#1E3A5F', muted: '#64748B', white: '#FFFFFF',
  bg: '#F8FAFC', card: '#FFFFFF', borderL: '#E2E8F0',
  text: '#0F172A',
}

const KATEGORILER = [
  {
    id: 'platform',
    label: 'Platform — Hub',
    icon: <Shield size={15}/>,
    renk: '#009B8D',
    sayfalar: [
      { url: '/hub/iso-admin', baslik: 'İSO Admin', erisim: 'admin' },
      { url: '/hub/iso-paket', baslik: 'İSO Paket Teklifi', erisim: 'gizli' },
      { url: '/hub/omniaudit', baslik: 'omniAUDIT', erisim: 'login' },
      { url: '/hub/omnicrisis', baslik: 'omniCRISIS', erisim: 'login' },
      { url: '/hub/omniimpact', baslik: 'omniIMPACT', erisim: 'login' },
      { url: '/hub/omnipipe', baslik: 'omniPIPE', erisim: 'login' },
      { url: '/hub/omniplan', baslik: 'omniPLAN', erisim: 'login' },
      { url: '/hub/omniqra', baslik: 'omniQRA', erisim: 'login' },
      { url: '/hub/omnivendor', baslik: 'omniVENDOR', erisim: 'login' },
      { url: '/hub/form/banking', baslik: 'Bankacılık Formu', erisim: 'login' },
      { url: '/hub/form/industrial', baslik: 'Sanayi Formu', erisim: 'login' },
      { url: '/hub/admin/import', baslik: 'Toplu Import', erisim: 'admin' },
      { url: '/hub/admin/matrix', baslik: 'Matris Editörü', erisim: 'admin' },
    ]
  },
  {
    id: 'iso',
    label: 'İSO Ekosistemi',
    icon: <Building2 size={15}/>,
    renk: '#F97316',
    sayfalar: [
      { url: '/uzman/istanbul-sanayi', baslik: 'İstanbul Sanayi Ekosistemi', erisim: 'login' },
      { url: '/hub/iso-brifing', baslik: 'İSO Briefing Dashboard', erisim: 'acik' },
      { url: '/tesis-formu/iso-canli-test-001', baslik: 'Tesis Dayanıklılık Formu', erisim: 'token' },
      { url: '/uzman/bia', baslik: 'BIA Analizi', erisim: 'login' },
      { url: '/uzman/maliyet', baslik: 'Maliyet Analizi', erisim: 'login' },
      { url: '/uzman/sanayi-maliyet', baslik: 'Sanayi Maliyet', erisim: 'login' },
      { url: '/uzman/dashboard', baslik: 'Uzman Paneli', erisim: 'login' },
      { url: '/uzman/sube/tuzla', baslik: 'Şube Detay (Tuzla)', erisim: 'login' },
    ]
  },
  {
    id: 'risk',
    label: 'Risk & Analiz',
    icon: <BarChart2 size={15}/>,
    renk: '#EF4444',
    sayfalar: [
      { url: '/omni-dashboard', baslik: 'omniDASHBOARD', erisim: 'login' },
      { url: '/natech-simulator', baslik: 'NATECH Simülatör', erisim: 'login' },
      { url: '/ai-analiz', baslik: 'AI Analiz', erisim: 'login' },
      { url: '/hfe-motoru', baslik: 'HFE Motoru', erisim: 'login' },
      { url: '/gecmis-analizler', baslik: 'Geçmiş Analizler', erisim: 'login' },
      { url: '/near-miss', baslik: 'Near-Miss Takibi', erisim: 'login' },
      { url: '/board/ozet', baslik: 'Board Özet', erisim: 'login' },
      { url: '/board/rapor', baslik: 'Board Rapor', erisim: 'login' },
      { url: '/board/cok-banka', baslik: 'Çok Banka Analizi', erisim: 'login' },
    ]
  },
  {
    id: 'harita',
    label: 'Harita & Lokasyon',
    icon: <Map size={15}/>,
    renk: '#22C55E',
    sayfalar: [
      { url: '/harita', baslik: 'Ana Harita', erisim: 'login' },
      { url: '/tesis-agi', baslik: 'Tesis Ağı', erisim: 'login' },
      { url: '/beylikduzu-komuta', baslik: 'Beylikdüzü Komuta', erisim: 'login' },
      { url: '/eoc-dashboard', baslik: 'EOC Dashboard', erisim: 'login' },
      { url: '/ygg-pano', baslik: 'YGG Pano', erisim: 'login' },
      { url: '/oda/dashboard', baslik: 'Oda Dashboard', erisim: 'login' },
    ]
  },
  {
    id: 'operasyon',
    label: 'Operasyon & Sprint',
    icon: <Zap size={15}/>,
    renk: '#8B5CF6',
    sayfalar: [
      { url: '/omni-sprint', baslik: 'omniSPRINT', erisim: 'login' },
      { url: '/omnicrisis', baslik: 'omniCRISIS (Platform)', erisim: 'login' },
      { url: '/omniplan', baslik: 'omniPLAN (Platform)', erisim: 'login' },
      { url: '/form', baslik: 'Form Ana', erisim: 'login' },
      { url: '/form/basvuru', baslik: 'Form Başvuru', erisim: 'login' },
    ],
  },
  {
    id: 'ayarlar',
    label: 'Ayarlar & Sistem',
    icon: <Settings size={15}/>,
    renk: '#64748B',
    sayfalar: [
      { url: '/settings', baslik: 'Ayarlar', erisim: 'login' },
      { url: '/sistem-ayarlari', baslik: 'Sistem Ayarları', erisim: 'admin' },
      { url: '/login', baslik: 'Giriş', erisim: 'acik' },
    ]
  },
  {
    id: 'public',
    label: 'Public Sayfalar',
    icon: <Globe size={15}/>,
    renk: '#0EA5E9',
    sayfalar: [
      { url: '/pricing', baslik: 'Fiyatlandırma (EN)', erisim: 'acik' },
      { url: '/about', baslik: 'Hakkımızda (EN)', erisim: 'acik' },
      { url: '/hakkimizda', baslik: 'Hakkımızda (TR)', erisim: 'acik' },
      { url: '/methodology', baslik: 'Metodoloji (EN)', erisim: 'acik' },
      { url: '/metodoloji', baslik: 'Metodoloji (TR)', erisim: 'acik' },
      { url: '/sektorler', baslik: 'Sektörler', erisim: 'acik' },
      { url: '/kaynaklar', baslik: 'Kaynaklar (TR)', erisim: 'acik' },
      { url: '/resources', baslik: 'Resources (EN)', erisim: 'acik' },
      { url: '/solutions', baslik: 'Çözümler', erisim: 'acik' },
      { url: '/solutions/banking', baslik: 'Bankacılık Çözümü', erisim: 'acik' },
      { url: '/solutions/industrial', baslik: 'Sanayi Çözümü', erisim: 'acik' },
      { url: '/solutions/energy', baslik: 'Enerji Çözümü', erisim: 'acik' },
      { url: '/solutions/health', baslik: 'Sağlık Çözümü', erisim: 'acik' },
      { url: '/solutions/government', baslik: 'Kamu Çözümü', erisim: 'acik' },
      { url: '/solutions/manufacturing', baslik: 'İmalat Çözümü', erisim: 'acik' },
      { url: '/solutions/insurance', baslik: 'Sigorta Çözümü', erisim: 'acik' },
      { url: '/solutions/telecom', baslik: 'Telecom Çözümü', erisim: 'acik' },
      { url: '/solutions/education', baslik: 'Eğitim Çözümü', erisim: 'acik' },
    ]
  },
  {
    id: 'urun',
    label: 'Ürün Sayfaları',
    icon: <FileText size={15}/>,
    renk: '#EC4899',
    sayfalar: [
      { url: '/platform/omnirisk', baslik: 'omniRISK', erisim: 'acik' },
      { url: '/platform/omniimpact', baslik: 'omniIMPACT', erisim: 'acik' },
      { url: '/platform/omniplan', baslik: 'omniPLAN', erisim: 'acik' },
      { url: '/platform/omnicrisis', baslik: 'omniCRISIS', erisim: 'acik' },
      { url: '/platform/omniaudit', baslik: 'omniAUDIT', erisim: 'acik' },
      { url: '/platform/omnipipe', baslik: 'omniPIPE', erisim: 'acik' },
      { url: '/platform/omnivendor', baslik: 'omniVENDOR', erisim: 'acik' },
      { url: '/platform/omni-hro', baslik: 'omniHRO', erisim: 'acik' },
      { url: '/products/omnirisk', baslik: 'omniRISK (Product)', erisim: 'acik' },
      { url: '/products/omniimpact', baslik: 'omniIMPACT (Product)', erisim: 'acik' },
      { url: '/products/omniplan', baslik: 'omniPLAN (Product)', erisim: 'acik' },
      { url: '/products/omnicrisis', baslik: 'omniCRISIS (Product)', erisim: 'acik' },
    ]
  },
]

const ERISIM_DOT: Record<string, string> = {
  acik:  '#16A34A',
  login: '#2563EB',
  admin: '#7C3AED',
  gizli: '#DC2626',
  token: '#D97706',
}

const toplamSayfa = KATEGORILER.reduce((s, k) => s + k.sayfalar.length, 0)

const COZUMLER_MAP: Record<number, { baslik: string; sure: string; maliyet: string; uri: number; tags: string[] }[]> = {
  1: [
    { baslik: 'BEKRA Güvenlik Raporu Hazırlama', sure: '3 ay', maliyet: 'Ücretli', uri: 8.5, tags: ['BEKRA', 'Seveso III'] },
    { baslik: 'NATECH Risk Analizi ve Acil Eylem Planı', sure: '6 hafta', maliyet: 'Ücretli', uri: 7.2, tags: ['NATECH', 'ISO 31000'] },
    { baslik: 'Kimyasal Madde Envanter Sistemi', sure: '2 hafta', maliyet: 'Düşük', uri: 5.5, tags: ['BEKRA', 'İSG'] },
    { baslik: 'Dahili Acil Durum Planı', sure: '1 ay', maliyet: 'Ücretsiz', uri: 6.0, tags: ['AFAD', 'ISO 22301'] },
  ],
  2: [
    { baslik: 'İş Sürekliliği Planı (BCP)', sure: '2 ay', maliyet: 'Düşük', uri: 6.5, tags: ['ISO 22301', 'BCP'] },
    { baslik: 'Deprem Tatbikatı ve Tahliye Planı', sure: '1 hafta', maliyet: 'Ücretsiz', uri: 4.5, tags: ['AFAD', 'ISO 22398'] },
    { baslik: 'Kritik Ekipman Yedekleme', sure: '3 hafta', maliyet: 'Orta', uri: 4.0, tags: ['ISO 22301'] },
    { baslik: 'Tedarikçi Risk Değerlendirmesi', sure: '1 ay', maliyet: 'Ücretsiz', uri: 3.5, tags: ['ISO 28000'] },
  ],
  3: [
    { baslik: 'Acil Durum Yönetim Planı (ADYP)', sure: '1 ay', maliyet: 'Ücretsiz', uri: 4.0, tags: ['AFAD', 'İSG'] },
    { baslik: 'Personel Afet Farkındalık Eğitimi', sure: '1 gün', maliyet: 'Ücretsiz', uri: 2.5, tags: ['AFAD'] },
    { baslik: 'Yangın Söndürücü Bakım Sistemi', sure: '1 hafta', maliyet: 'Düşük', uri: 2.0, tags: ['BYKHY', 'TS 11827'] },
    { baslik: 'BCP Temel Çerçeve Dokümanı', sure: '3 hafta', maliyet: 'Ücretsiz', uri: 3.5, tags: ['ISO 22301'] },
  ],
}

function TesisDetay({ tesis, onKapat }: { tesis: any; onKapat: () => void }) {
  const uriTahmini = (t: any) => {
    let skor = 50
    if (t.building_age > 20) skor += 15
    if (t.seismic_zone === 1) skor += 10
    if (t.sector === 'INDUSTRIAL') skor += 12
    if (t.employee_count > 200) skor += 5
    return Math.min(skor, 95)
  }
  const uri = uriTahmini(tesis)
  const sinif = tesis.sector === 'INDUSTRIAL' ? 1 : 3
  const uriRenk = uri >= 60 ? '#EF4444' : uri >= 40 ? '#F97316' : '#22C55E'
  const sinifLabel = sinif === 1 ? 'Sınıf 1 — Çok Tehlikeli' : 'Sınıf 3 — Az Tehlikeli'
  const sinifRenk = sinif === 1 ? '#EF4444' : '#22C55E'
  const cozumler = COZUMLER_MAP[sinif] || []

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, overflowY: 'auto', padding: 32 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{tesis.sector === 'INDUSTRIAL' ? 'Sanayi Tesisi' : 'Belediye Birimi'}</p>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{tesis.name}</h1>
          </div>
          <button onClick={onKapat} style={{ background: 'none', border: `1px solid ${C.borderL}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, color: C.muted }}>✕ Kapat</button>
        </div>

        {/* KPI Kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { lbl: 'ADİS Skoru', val: String(uri), renk: uriRenk },
            { lbl: 'Çalışan', val: String(tesis.employee_count), renk: C.text },
            { lbl: 'Bina Yaşı', val: `${tesis.building_age}y`, renk: C.text },
            { lbl: 'Deprem Zonu', val: `${tesis.seismic_zone}. Bölge`, renk: '#EF4444' },
          ].map((k, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.borderL}`, borderRadius: 10, padding: '14px 16px' }}>
              <p style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{k.lbl}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: k.renk }}>{k.val}</p>
            </div>
          ))}
        </div>

        {/* URI Bar */}
        <div style={{ background: C.card, border: `1px solid ${C.borderL}`, borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Kentsel Dayanıklılık İndeksi (URI)</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: uriRenk }}>{uri} / 100</span>
          </div>
          <div style={{ height: 10, background: '#E2E8F0', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: `${uri}%`, height: '100%', background: uriRenk, borderRadius: 5 }} />
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: sinifRenk, background: sinif === 1 ? '#FCEBEB' : '#EAF3DE', padding: '3px 8px', borderRadius: 4 }}>{sinifLabel}</span>
            <span style={{ fontSize: 11, color: C.muted }}>{uri >= 60 ? 'Yüksek risk — acil aksiyon gerekli' : uri >= 40 ? 'Orta risk — planlı iyileştirme önerilir' : 'Düşük risk — rutin takip yeterli'}</span>
          </div>
        </div>

        {/* Çözüm Önerileri */}
        <div style={{ background: C.card, border: `1px solid ${C.borderL}`, borderRadius: 12, padding: '16px 20px' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>Öncelikli Çözüm Önerileri</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cozumler.map((c, i) => (
              <div key={i} style={{ borderLeft: `3px solid ${uriRenk}`, paddingLeft: 14, paddingTop: 4, paddingBottom: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.baslik}</p>
                  <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>+{c.uri} URI</span>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' as const }}>
                  <span style={{ fontSize: 11, color: C.muted }}>⏱ {c.sure}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>💰 {c.maliyet}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {c.tags.map((tag, j) => (
                      <span key={j} style={{ fontSize: 10, background: '#EEF2FF', color: '#3730A3', padding: '2px 6px', borderRadius: 4 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <a href="/tesis-formu/iso-canli-test-001" style={{ flex: 1, display: 'block', padding: '10px', textAlign: 'center' as const, background: C.teal, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Detaylı Değerlendirme Başlat
            </a>
            <a href="mailto:info@omniversel.com?subject=Uzman Desteği — ${tesis.name}" style={{ flex: 1, display: 'block', padding: '10px', textAlign: 'center' as const, background: '#F8FAFC', border: `1px solid ${C.borderL}`, color: C.text, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Uzman Desteği Al
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}




function TesisOzeti({ onTesisAc }: { onTesisAc: (t: any) => void }) {
  const [tesisler, setTesisler] = useState<any[]>([])
  const [acik, setAcik] = useState(false)

  useEffect(() => {
    fetch('https://gqguwgbopgnpwzjwcexl.supabase.co/rest/v1/facilities?select=id,name,sector,employee_count,seismic_zone,building_age&tenant_id=eq.11111111-0000-0000-0000-000000000001&limit=6&order=employee_count.desc', {
      headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI' }
    }).then(r => r.json()).then(setTesisler).catch(() => null)
  }, [])

  const uriTahmini = (t: any) => {
    let skor = 50
    if (t.building_age > 20) skor += 15
    if (t.seismic_zone === 1) skor += 10
    if (t.sector === 'INDUSTRIAL') skor += 12
    if (t.employee_count > 200) skor += 5
    return Math.min(skor, 95)
  }

  if (tesisler.length === 0) return null

  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setAcik(v => !v)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Building2 size={13} color={C.teal} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em' }}>TESİSLER ({tesisler.length})</span>
        </div>
        <span style={{ fontSize: 10, color: C.muted, transform: acik ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {acik && (
        <div style={{ padding: '4px 10px 10px' }}>
          {tesisler.map((t, i) => {
            const uri = uriTahmini(t)
            const uriRenk = uri >= 60 ? '#EF4444' : uri >= 40 ? '#F97316' : '#22C55E'
            return (
              <div key={i} onClick={() => onTesisAc(t)} style={{ padding: '6px 4px', borderBottom: i < tesisler.length-1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: C.white, lineHeight: 1.3 }}>{t.name.length > 22 ? t.name.slice(0,22)+'…' : t.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: uriRenk, flexShrink: 0, marginLeft: 6 }}>{uri}</span>
                </div>
                <div style={{ height: 3, background: '#1E3A5F', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${uri}%`, height: '100%', background: uriRenk, borderRadius: 2 }} />
                </div>
              </div>
            )
          })}
          <a href="/tesis-formu/iso-canli-test-001" style={{ display: 'block', marginTop: 8, fontSize: 11, color: C.teal, textDecoration: 'none', textAlign: 'center' as const }}>+ Yeni değerlendirme</a>
        </div>
      )}
    </div>
  )
}

export default function SiteHaritasiPage() {
  const [acikKategoriler, setAcikKategoriler] = useState<Set<string>>(new Set(['platform']))
  const [secilenTesis, setSecilenTesis] = useState<any>(null)
  const [aktifUrl, setAktifUrl] = useState('')
  const [iframeError, setIframeError] = useState(false)

  function toggleKat(id: string) {
    setAcikKategoriler(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const aktifSayfa = KATEGORILER.flatMap(k => k.sayfalar.map(s => ({ ...s, katLabel: k.label, katRenk: k.renk }))).find(s => s.url === aktifUrl)

  const PUBLIC_KATEGORILER = ['public', 'urun']
  const aktifKategoriId = KATEGORILER.find(k => k.sayfalar.some(s => s.url === aktifUrl))?.id
  const iframeSrc = aktifUrl
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}${aktifUrl}${
        PUBLIC_KATEGORILER.includes(aktifKategoriId || '') ? '' : '?embed=1'
      }`
    : null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif", background: C.bg, overflow: 'hidden' }}>

      {/* Header Bar */}
      <div style={{ height: 44, background: C.navy, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <span style={{ color: C.teal, fontWeight: 700, letterSpacing: '0.06em' }}>OMNIVERSEL</span>
          <span style={{ color: '#334155' }}>/</span>
          <span style={{ color: '#94A3B8' }}>Site Haritası</span>
          {aktifSayfa && (
            <>
              <span style={{ color: '#334155' }}>/</span>
              <span style={{ color: C.white, fontWeight: 600 }}>{aktifSayfa.baslik}</span>
            </>
          )}
        </div>
        {aktifUrl && (
          <a
            href={aktifUrl}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: C.teal, padding: '4px 10px', borderRadius: 6, border: `1px solid ${C.teal}28`, textDecoration: 'none' }}
          >
            Yeni sekmede aç <ExternalLink size={11}/>
          </a>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sol Panel */}
        <div style={{ width: 260, background: C.navy, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: `1px solid ${C.border}`, overflow: 'hidden' }}>

          {/* Tesis Risk Mini Panel */}
          <TesisOzeti onTesisAc={(t) => { setSecilenTesis(t); setAktifUrl(null as unknown as string) }} />

          {/* Panel Header */}
          <div style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <LayoutGrid size={14} color={C.teal}/>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8' }}>{toplamSayfa} sayfa · {KATEGORILER.length} kategori</span>
            </div>
          </div>

          {/* Accordion */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {KATEGORILER.map(kat => {
              const acik = acikKategoriler.has(kat.id)
              return (
                <div key={kat.id} style={{ borderBottom: `1px solid ${C.border}20` }}>
                  {/* Kategori Başlık */}
                  <button
                    onClick={() => toggleKat(kat.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                      padding: '9px 14px', border: 'none', cursor: 'pointer', background: 'transparent',
                    }}
                  >
                    <span style={{ color: acik ? kat.renk : '#475569' }}>{kat.icon}</span>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: acik ? C.white : '#94A3B8', textAlign: 'left' }}>
                      {kat.label}
                    </span>
                    <span style={{ fontSize: 10, color: '#475569', background: '#1E3A5F', padding: '1px 6px', borderRadius: 8, marginRight: 4 }}>
                      {kat.sayfalar.length}
                    </span>
                    <ChevronDown size={13} color="#475569" style={{ transform: acik ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}/>
                  </button>

                  {/* Alt Sayfalar */}
                  {acik && (
                    <div style={{ paddingBottom: 4 }}>
                      {kat.sayfalar.map(s => {
                        const aktif = aktifUrl === s.url
                        return (
                          <button
                            key={s.url}
                            onClick={() => { setAktifUrl(s.url); setIframeError(false) }}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                              padding: '6px 14px 6px 30px', border: 'none', cursor: 'pointer', textAlign: 'left',
                              background: aktif ? `${kat.renk}18` : 'transparent',
                              borderLeft: aktif ? `2px solid ${kat.renk}` : '2px solid transparent',
                            }}
                          >
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: ERISIM_DOT[s.erisim] || C.muted, flexShrink: 0 }}/>
                            <span style={{ fontSize: 12, color: aktif ? C.white : '#94A3B8', fontWeight: aktif ? 600 : 400, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {s.baslik}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 14px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.7 }}>
              <div>Supabase: gqguwgbopgnpwzjwcexl</div>
              <div>Vercel · Railway · v3.1 · Sprint 9</div>
            </div>
          </div>
        </div>

        {/* Sağ Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          {secilenTesis ? (
            <TesisDetay tesis={secilenTesis} onKapat={() => setSecilenTesis(null)} />
          ) : aktifUrl ? (
            <>
              <iframe
                key={aktifUrl}
                src={iframeSrc || aktifUrl}
                onLoad={() => setIframeError(false)}
                onError={() => setIframeError(true)}
                style={{ flex: 1, border: 'none', width: '100%', height: '100%', display: iframeError ? 'none' : 'block' }}
                title={aktifSayfa?.baslik || aktifUrl}
              />
              {iframeError && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
                  <ExternalLink size={48} color={C.teal}/>
                  <p style={{ fontSize: 16, color: '#374151', margin: 0 }}>Bu sayfa iframe içinde açılamıyor</p>
                  <a href={aktifUrl} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', background: C.teal, color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                    Yeni Sekmede Aç
                  </a>
                </div>
              )}
            </>
          ) : (
            /* Karşılama Ekranı */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 40 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 8 }}>Site Haritası</div>
                <div style={{ fontSize: 15, color: C.muted }}>Sol panelden bir sayfa seçin — içerik burada açılır.</div>
              </div>

              {/* İstatistik Kartları */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, maxWidth: 680, width: '100%' }}>
                {[
                  { label: 'Toplam Sayfa', value: toplamSayfa, color: '#009B8D' },
                  { label: 'Kategori',     value: KATEGORILER.length, color: '#F97316' },
                  { label: 'Çözüm Modülü', value: 10, color: '#8B5CF6' },
                  { label: 'NACE Sınıfı',  value: 87, color: '#EF4444' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: C.card, border: `1px solid ${C.borderL}`, borderRadius: 12, padding: '20px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
