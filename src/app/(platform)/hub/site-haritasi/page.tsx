'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Shield, BarChart2, Map, Building2, Zap, Settings, FileText, Globe } from 'lucide-react'

const C = {
  navy: '#0A1628', navyL: '#0F2240', teal: '#009B8D', tealL: '#00B5A6',
  border: '#1E3A5F', borderL: '#E2E8F0', muted: '#64748B', white: '#FFFFFF',
  bg: '#F8FAFC', card: '#FFFFFF',
}

const KATEGORILER = [
  {
    id: 'platform',
    label: 'Platform — Hub',
    icon: <Shield size={16}/>,
    renk: '#009B8D',
    sayfalar: [
      { url: '/(platform)/hub', baslik: 'Ana Hub', aciklama: 'Platform ana giriş noktası', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hub/iso-admin', baslik: 'İSO Admin', aciklama: 'Token yönetimi, form izleme, çözüm bankası, soru yönetimi, k katsayısı', durum: 'aktif', erisim: 'admin' },
      { url: '/(platform)/hub/iso-paket', baslik: 'İSO Paket Teklifi', aciklama: 'Fatih Hoca & Hikmet Hoca için gizli paket fiyatlandırma sayfası', durum: 'aktif', erisim: 'gizli' },
      { url: '/(platform)/hub/omniaudit', baslik: 'omniAUDIT', aciklama: 'Denetim ve uyumluluk modülü', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hub/omnicrisis', baslik: 'omniCRISIS', aciklama: 'Kriz komuta merkezi', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hub/omniimpact', baslik: 'omniIMPACT', aciklama: 'İş etkisi analizi modülü', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hub/omnipipe', baslik: 'omniPIPE', aciklama: 'Pipeline yönetimi', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hub/omniplan', baslik: 'omniPLAN', aciklama: 'Planlama modülü', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hub/omniqra', baslik: 'omniQRA', aciklama: 'Kantitatif risk analizi', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hub/omnivendor', baslik: 'omniVENDOR', aciklama: 'Tedarikçi yönetimi', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hub/form/banking', baslik: 'Bankacılık Formu', aciklama: 'Banka risk değerlendirme formu', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hub/form/industrial', baslik: 'Sanayi Formu', aciklama: 'Sanayi tesis değerlendirme formu', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hub/admin/import', baslik: 'Toplu Import', aciklama: 'Tesis verisi toplu yükleme', durum: 'aktif', erisim: 'admin' },
      { url: '/(platform)/hub/admin/matrix', baslik: 'Matris Editörü', aciklama: 'Risk matris editörü', durum: 'aktif', erisim: 'admin' },
    ]
  },
  {
    id: 'iso',
    label: 'İSO Ekosistemi',
    icon: <Building2 size={16}/>,
    renk: '#F97316',
    sayfalar: [
      { url: '/(platform)/uzman/istanbul-sanayi', baslik: 'İstanbul Sanayi Ekosistemi', aciklama: '11 sekme: Genel Bakış, Tesis Ağı, Sektör, GIS Harita, NATECH, BCP, SATAKOL, İş Modeli, HRO & Agile, ROI, Aksiyon Merkezi', durum: 'aktif', erisim: 'login' },
      { url: '/hub/iso-brifing', baslik: 'İSO Briefing Dashboard', aciklama: 'Fatih Hoca için herkese açık briefing sayfası — MARAP tesis verileri', durum: 'aktif', erisim: 'acik' },
      { url: '/tesis-formu/[token]', baslik: 'Tesis Dayanıklılık Formu', aciklama: 'Token bazlı herkese açık form. NACE otomatik tehlike sınıfı, adaptif sorular, URI skoru, çözüm önerileri', durum: 'aktif', erisim: 'token' },
      { url: '/(platform)/uzman/bia', baslik: 'BIA Analizi', aciklama: 'İş etkisi analizi uzman sayfası', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/uzman/maliyet', baslik: 'Maliyet Analizi', aciklama: 'Risk maliyet hesaplamaları', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/uzman/sanayi-maliyet', baslik: 'Sanayi Maliyet', aciklama: 'Sanayi sektörü maliyet analizi', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/uzman/dashboard', baslik: 'Uzman Paneli', aciklama: 'Uzman görünümü ana panel', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/uzman/sube/[kod]', baslik: 'Şube Detay', aciklama: 'İSO şube bazlı detay sayfası — dinamik route', durum: 'aktif', erisim: 'login' },
    ]
  },
  {
    id: 'risk',
    label: 'Risk & Analiz',
    icon: <BarChart2 size={16}/>,
    renk: '#EF4444',
    sayfalar: [
      { url: '/(platform)/omni-dashboard', baslik: 'omniDASHBOARD', aciklama: 'Ana risk dashboard', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/natech-simulator', baslik: 'NATECH Simülatör', aciklama: 'NATECH domino etkisi simülasyon aracı', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/ai-analiz', baslik: 'AI Analiz', aciklama: 'Yapay zeka destekli risk analizi', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/hfe-motoru', baslik: 'HFE Motoru', aciklama: 'İnsan faktörü değerlendirme motoru', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/gecmis-analizler', baslik: 'Geçmiş Analizler', aciklama: 'Arşivlenmiş risk analizleri', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/near-miss', baslik: 'Near-Miss Takibi', aciklama: 'Ramak kala olay raporlama ve takip', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/board/ozet', baslik: 'Board Özet', aciklama: 'Yönetim kurulu özet görünümü', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/board/rapor', baslik: 'Board Rapor', aciklama: 'Yönetim kurulu detaylı rapor', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/board/cok-banka', baslik: 'Çok Banka Analizi', aciklama: 'Birden fazla banka karşılaştırmalı analiz', durum: 'aktif', erisim: 'login' },
    ]
  },
  {
    id: 'harita',
    label: 'Harita & Lokasyon',
    icon: <Map size={16}/>,
    renk: '#22C55E',
    sayfalar: [
      { url: '/(platform)/harita', baslik: 'Ana Harita', aciklama: 'Tüm tesislerin coğrafi dağılım haritası', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/tesis-agi', baslik: 'Tesis Ağı', aciklama: 'Tesis bağlantı ve ilişki ağı görünümü', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/beylikduzu-komuta', baslik: 'Beylikdüzü Komuta', aciklama: 'Beylikdüzü pilot tenant komuta merkezi', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/eoc-dashboard', baslik: 'EOC Dashboard', aciklama: 'Emergency Operations Center yönetim paneli', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/ygg-pano', baslik: 'YGG Pano', aciklama: 'Yerel yönetim grubu pano', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/oda/dashboard', baslik: 'Oda Dashboard', aciklama: 'Sanayi odası yönetim paneli', durum: 'aktif', erisim: 'login' },
    ]
  },
  {
    id: 'operasyon',
    label: 'Operasyon & Sprint',
    icon: <Zap size={16}/>,
    renk: '#8B5CF6',
    sayfalar: [
      { url: '/(platform)/omni-sprint', baslik: 'omniSPRINT', aciklama: 'Çevik sprint yönetim panosu', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/omnicrisis', baslik: 'omniCRISIS (Platform)', aciklama: 'Kriz yönetim operasyon merkezi', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/omniplan', baslik: 'omniPLAN (Platform)', aciklama: 'İş sürekliliği planlama sayfası', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/form', baslik: 'Form Ana', aciklama: 'Genel değerlendirme form sayfası', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/form/basvuru', baslik: 'Form Başvuru', aciklama: 'Tesis başvuru formu', durum: 'aktif', erisim: 'login' },
    ],
  },
  {
    id: 'ayarlar',
    label: 'Ayarlar & Sistem',
    icon: <Settings size={16}/>,
    renk: '#64748B',
    sayfalar: [
      { url: '/(platform)/settings', baslik: 'Ayarlar', aciklama: 'Kullanıcı ve platform ayarları', durum: 'aktif', erisim: 'login' },
      { url: '/(platform)/sistem-ayarlari', baslik: 'Sistem Ayarları', aciklama: 'Sistem yapılandırma ve yönetim', durum: 'aktif', erisim: 'admin' },
      { url: '/login', baslik: 'Giriş', aciklama: 'Platform giriş sayfası — incognito modda çalışır', durum: 'aktif', erisim: 'acik' },
    ]
  },
  {
    id: 'public',
    label: 'Public Sayfalar',
    icon: <Globe size={16}/>,
    renk: '#0EA5E9',
    sayfalar: [
      { url: '/pricing', baslik: 'Fiyatlandırma (EN)', aciklama: 'Genel İngilizce fiyatlandırma sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/about', baslik: 'Hakkımızda (EN)', aciklama: 'İngilizce kurumsal sayfa', durum: 'aktif', erisim: 'acik' },
      { url: '/hakkimizda', baslik: 'Hakkımızda (TR)', aciklama: 'Türkçe kurumsal sayfa', durum: 'aktif', erisim: 'acik' },
      { url: '/methodology', baslik: 'Metodoloji (EN)', aciklama: 'HIFYEA metodoloji açıklama sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/metodoloji', baslik: 'Metodoloji (TR)', aciklama: 'HIFYEA metodoloji Türkçe sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/sektorler', baslik: 'Sektörler', aciklama: 'Hedef sektörler listesi', durum: 'aktif', erisim: 'acik' },
      { url: '/kaynaklar', baslik: 'Kaynaklar (TR)', aciklama: 'Türkçe kaynak ve dokümanlar', durum: 'aktif', erisim: 'acik' },
      { url: '/resources', baslik: 'Resources (EN)', aciklama: 'İngilizce kaynak sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions', baslik: 'Çözümler', aciklama: 'Ana çözümler sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions/banking', baslik: 'Bankacılık Çözümü', aciklama: 'Bankacılık sektörü çözüm sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions/industrial', baslik: 'Sanayi Çözümü', aciklama: 'Sanayi sektörü çözüm sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions/energy', baslik: 'Enerji Çözümü', aciklama: 'Enerji sektörü çözüm sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions/health', baslik: 'Sağlık Çözümü', aciklama: 'Sağlık sektörü çözüm sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions/government', baslik: 'Kamu Çözümü', aciklama: 'Kamu sektörü çözüm sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions/manufacturing', baslik: 'İmalat Çözümü', aciklama: 'İmalat sektörü çözüm sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions/insurance', baslik: 'Sigorta Çözümü', aciklama: 'Sigorta sektörü çözüm sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions/telecom', baslik: 'Telecom Çözümü', aciklama: 'Telecom sektörü çözüm sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions/education', baslik: 'Eğitim Çözümü', aciklama: 'Eğitim sektörü çözüm sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/solutions/public-sector', baslik: 'Kamu Sektörü', aciklama: 'Kamu sektörü çözüm sayfası', durum: 'aktif', erisim: 'acik' },
    ]
  },
  {
    id: 'urun',
    label: 'Ürün Sayfaları',
    icon: <FileText size={16}/>,
    renk: '#EC4899',
    sayfalar: [
      { url: '/platform/omnirisk', baslik: 'omniRISK', aciklama: 'omniRISK ürün tanıtım sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/platform/omniimpact', baslik: 'omniIMPACT', aciklama: 'omniIMPACT ürün tanıtım sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/platform/omniplan', baslik: 'omniPLAN', aciklama: 'omniPLAN ürün tanıtım sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/platform/omnicrisis', baslik: 'omniCRISIS', aciklama: 'omniCRISIS ürün tanıtım sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/platform/omniaudit', baslik: 'omniAUDIT', aciklama: 'omniAUDIT ürün tanıtım sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/platform/omnipipe', baslik: 'omniPIPE', aciklama: 'omniPIPE ürün tanıtım sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/platform/omnivendor', baslik: 'omniVENDOR', aciklama: 'omniVENDOR ürün tanıtım sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/platform/omni-hro', baslik: 'omniHRO', aciklama: 'omniHRO ürün tanıtım sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/products/omnirisk', baslik: 'omniRISK (Product)', aciklama: 'omniRISK ürün detay sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/products/omniimpact', baslik: 'omniIMPACT (Product)', aciklama: 'omniIMPACT ürün detay sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/products/omniplan', baslik: 'omniPLAN (Product)', aciklama: 'omniPLAN ürün detay sayfası', durum: 'aktif', erisim: 'acik' },
      { url: '/products/omnicrisis', baslik: 'omniCRISIS (Product)', aciklama: 'omniCRISIS ürün detay sayfası', durum: 'aktif', erisim: 'acik' },
    ]
  },
]

const ERISIM_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  acik:  { label: 'Herkese Açık', color: '#16A34A', bg: '#F0FDF4' },
  login: { label: 'Login Gerekli', color: '#2563EB', bg: '#EFF6FF' },
  admin: { label: 'Admin Only',   color: '#7C3AED', bg: '#F5F3FF' },
  gizli: { label: 'Gizli URL',    color: '#DC2626', bg: '#FEF2F2' },
  token: { label: 'Token Bazlı',  color: '#D97706', bg: '#FFFBEB' },
}

export default function SiteHaritasiPage() {
  const [aktifKategori, setAktifKategori] = useState('platform')
  const [aramaMetni, setAramaMetni] = useState('')

  const secilenKat = KATEGORILER.find(k => k.id === aktifKategori)!
  const filtrelenmis = secilenKat.sayfalar.filter(s =>
    aramaMetni === '' ||
    s.baslik.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    s.aciklama.toLowerCase().includes(aramaMetni.toLowerCase())
  )

  const toplamSayfa = KATEGORILER.reduce((s, k) => s + k.sayfalar.length, 0)

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'DM Sans', sans-serif", background: C.bg, overflow: 'hidden' }}>

      {/* Sol Panel */}
      <div style={{ width: 260, background: C.navy, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: `1px solid ${C.border}` }}>

        {/* Header */}
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.teal, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>OMNIVERSEL</div>
          <div style={{ fontSize: 16, color: C.white, fontWeight: 800 }}>Site Haritası</div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{toplamSayfa} sayfa · {KATEGORILER.length} kategori</div>
        </div>

        {/* Arama */}
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
          <input
            value={aramaMetni}
            onChange={e => setAramaMetni(e.target.value)}
            placeholder="Sayfa ara..."
            style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.navyL, color: C.white, fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Kategoriler */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
          {KATEGORILER.map(kat => (
            <button
              key={kat.id}
              onClick={() => { setAktifKategori(kat.id); setAramaMetni('') }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: aktifKategori === kat.id ? `${kat.renk || C.teal}20` : 'transparent',
                borderLeft: `3px solid ${aktifKategori === kat.id ? (kat.renk || C.teal) : 'transparent'}`,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ color: aktifKategori === kat.id ? (kat.renk || C.teal) : '#64748B' }}>
                {kat.icon}
              </span>
              <span style={{ fontSize: 13, fontWeight: aktifKategori === kat.id ? 700 : 500, color: aktifKategori === kat.id ? C.white : '#94A3B8', flex: 1 }}>
                {kat.label}
              </span>
              <span style={{ fontSize: 11, color: '#475569', background: '#1E3A5F', padding: '2px 7px', borderRadius: 10 }}>
                {kat.sayfalar.length}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.6 }}>
            <div>Supabase: gqguwgbopgnpwzjwcexl</div>
            <div>Frontend: Vercel · Backend: Railway</div>
            <div style={{ color: C.teal, marginTop: 4 }}>v3.1 · Sprint 9</div>
          </div>
        </div>
      </div>

      {/* Sağ Panel */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>

        {/* Kategori başlık */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${secilenKat.renk || C.teal}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: secilenKat.renk || C.teal }}>
            {secilenKat.icon}
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: 0 }}>{secilenKat.label}</h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{filtrelenmis.length} sayfa{aramaMetni ? ` — "${aramaMetni}" araması` : ''}</p>
          </div>
        </div>

        {/* Sayfa listesi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtrelenmis.map((sayfa, i) => {
            const badge = ERISIM_BADGE[sayfa.erisim] || ERISIM_BADGE.login
            const url = sayfa.url.replace('/(platform)', '').replace('/[token]', '/iso-canli-test-001').replace('/[kod]', '/tuzla')
            return (
              <div key={i} style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.borderL}`, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{sayfa.baslik}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px', lineHeight: 1.5 }}>{sayfa.aciklama}</p>
                  <code style={{ fontSize: 11, color: '#475569', background: '#F1F5F9', padding: '2px 8px', borderRadius: 4 }}>
                    {sayfa.url}
                  </code>
                </div>
                <Link href={url} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 7, background: C.navy, color: C.white, textDecoration: 'none', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Aç <ExternalLink size={11}/>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
