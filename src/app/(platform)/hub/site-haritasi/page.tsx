'use client'
import { useState } from 'react'
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

export default function SiteHaritasiPage() {
  const [acikKategoriler, setAcikKategoriler] = useState<Set<string>>(new Set(['platform']))
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {aktifUrl ? (
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
