'use client'
import { useState } from 'react'
import { Shield, MapPin, Building2, AlertTriangle, Activity, Users, TrendingUp } from 'lucide-react'

const MAHALLELER = [
  {
    ad: 'Yakuplu', nufus: 89420, alan_km2: 8.2,
    h: 82, f: 74, e: 38, uri: 28,
    risk: 'KRİTİK',
    tehlikeler: ['Deprem (MS-6.5+)', 'Endüstriyel Kaza (OSB)', 'Sel'],
    tesisler: { okul: 12, hastane: 1, osb: 1, altyapi: 3 },
    sendai: 'SF-3: Altyapı dayanıklılığı',
    natech: true, natech_d: 2.4,
    not: 'Yakuplu OSB varlığı NATECH riskini kritik düzeye taşıyor. Domino etkisi modellemesi gerekli.',
  },
  {
    ad: 'Kavaklı', nufus: 42180, alan_km2: 6.1,
    h: 76, f: 68, e: 44, uri: 34,
    risk: 'YÜKSEK',
    tehlikeler: ['Sel / Taşkın', 'Deprem', 'Altyapı Çökmesi'],
    tesisler: { okul: 8, hastane: 0, osb: 0, altyapi: 2 },
    sendai: 'SF-4: Erken uyarı sistemi',
    natech: false, natech_d: 1.0,
    not: 'Dere yatağına yakın konut alanları. İBB yağmursuyu ıslahı tamamlandı — artık risk izleme aşamasında.',
  },
  {
    ad: 'Gürpınar', nufus: 38650, alan_km2: 12.4,
    h: 88, f: 58, e: 62, uri: 38,
    risk: 'YÜKSEK',
    tehlikeler: ['Deprem (KAF Hattı)', 'Heyelan', 'Yangın'],
    tesisler: { okul: 6, hastane: 0, osb: 0, altyapi: 4 },
    sendai: 'SF-1: Risk yönetişimi',
    natech: false, natech_d: 1.0,
    not: 'KAF hattına yakınlık birincil tehlike. KİPTAŞ kentsel dönüşüm projesi devam ediyor.',
  },
  {
    ad: 'Adnan Kahveci', nufus: 124300, alan_km2: 4.8,
    h: 42, f: 48, e: 88, uri: 71,
    risk: 'ORTA',
    tehlikeler: ['Deprem', 'Kalabalık Yönetimi', 'Altyapı Yükü'],
    tesisler: { okul: 22, hastane: 2, osb: 0, altyapi: 6 },
    sendai: 'SF-2: Kapasite geliştirme',
    natech: false, natech_d: 1.0,
    not: 'En kalabalık mahalle. Güçlü altyapı kapasitesi. Müdahale istasyonu koordinasyon merkezi olabilir.',
  },
  {
    ad: 'Büyükşehir', nufus: 31200, alan_km2: 5.9,
    h: 55, f: 62, e: 58, uri: 52,
    risk: 'ORTA',
    tehlikeler: ['Deprem', 'Sel', 'Ulaşım Altyapısı'],
    tesisler: { okul: 9, hastane: 1, osb: 0, altyapi: 3 },
    sendai: 'SF-1: Afet risk azaltma',
    natech: false, natech_d: 1.0,
    not: 'Karma kullanım alanı. Orta düzey risk profili.',
  },
  {
    ad: 'Cumhuriyet', nufus: 28400, alan_km2: 3.2,
    h: 48, f: 55, e: 72, uri: 62,
    risk: 'ORTA',
    tehlikeler: ['Deprem', 'Yangın', 'Altyapı'],
    tesisler: { okul: 7, hastane: 0, osb: 0, altyapi: 2 },
    sendai: 'SF-1: Afet risk azaltma',
    natech: false, natech_d: 1.0,
    not: 'Nispeten düşük risk. AFAD deposu burada — stratejik konum avantajı.',
  },
]

const RENKLER: Record<string, string> = {
  'KRİTİK': 'text-red-400 bg-red-400/10 border-red-400/30',
  'YÜKSEK': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  'ORTA':   'text-amber-400 bg-amber-400/10 border-amber-400/30',
  'DÜŞÜK':  'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
}

const TABS = [
  { key: 'ozet',    label: 'İlçe Özeti' },
  { key: 'mahalle', label: 'Mahalle Analizi' },
  { key: 'tesis',   label: 'Tesis Ağı' },
  { key: 'natech',  label: 'NATECH Senaryo' },
  { key: 'sendai',  label: 'Sendai Uyum' },
] as const

type Tab = typeof TABS[number]['key']

export default function BeylikduzuKomuta() {
  const [tab, setTab] = useState<Tab>('ozet')
  const [secili, setSecili] = useState(MAHALLELER[0])
  const [senaryo, setSenaryo] = useState('deprem')
  const [siddet, setSiddet] = useState(6.5)

  const ilceUri = Math.round(MAHALLELER.reduce((a, m) => a + m.uri, 0) / MAHALLELER.length)
  const kritik   = MAHALLELER.filter(m => m.risk === 'KRİTİK' || m.risk === 'YÜKSEK').length
  const toplamNufus = MAHALLELER.reduce((a, m) => a + m.nufus, 0)
  const ortH = Math.round(MAHALLELER.reduce((a, m) => a + m.h, 0) / MAHALLELER.length)
  const ortF = Math.round(MAHALLELER.reduce((a, m) => a + m.f, 0) / MAHALLELER.length)
  const ortE = Math.round(MAHALLELER.reduce((a, m) => a + m.e, 0) / MAHALLELER.length)

  // NATECH simülasyon hesabı
  const natechEtki = senaryo === 'deprem'
    ? Math.min(100, Math.round((siddet - 5) * 28 * 1.4))
    : senaryo === 'yangin' ? 45 : 38
  const etkilenenNufus = Math.round(toplamNufus * (natechEtki / 100) * 0.6)

  return (
    <div className="min-h-screen bg-[#0A1628] text-slate-200 p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#E8C97A]/10 border border-[#E8C97A]/20 p-3 rounded-xl">
            <Shield className="w-7 h-7 text-[#E8C97A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Beylikdüzü Belediyesi</h1>
            <p className="text-slate-500 text-sm mt-0.5">OMNI Afet Dayanıklılık Platformu · HFER-720 v2.0 · Sendai 2015–2030</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">Canlı · {new Date().toLocaleDateString('tr-TR')}</span>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'İlçe URI Skoru', val: `${ilceUri}/100`, alt: 'ORTA RİSK — İyileştirme gerekli', renk: 'text-amber-400' },
          { label: 'Riskli Mahalle', val: `${kritik}/${MAHALLELER.length}`, alt: 'Kritik + Yüksek risk', renk: 'text-red-400' },
          { label: 'Toplam Nüfus', val: `${(toplamNufus/1000).toFixed(0)}K`, alt: 'Risk altındaki kişi sayısı', renk: 'text-white' },
          { label: 'NATECH Tesisi', val: '1 OSB', alt: 'Yakuplu · D katsayısı 2.4', renk: 'text-orange-400' },
        ].map(k => (
          <div key={k.label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">{k.label}</p>
            <p className={`text-3xl font-bold ${k.renk}`}>{k.val}</p>
            <p className="text-slate-500 text-xs mt-2">{k.alt}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-1 mb-6 border-b border-slate-800">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.key ? 'border-[#E8C97A] text-[#E8C97A]' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== İLÇE ÖZETİ ===== */}
      {tab === 'ozet' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#E8C97A]" /> HFE Bileşen Analizi
            </h3>
            {[
              { label: 'H — Tehlike Yoğunluğu', val: ortH, renk: 'bg-red-500', not: 'Düşük = iyi' },
              { label: 'F — Kırılganlık', val: ortF, renk: 'bg-orange-500', not: 'Düşük = iyi' },
              { label: 'E — Kapasite', val: ortE, renk: 'bg-emerald-500', not: 'Yüksek = iyi' },
            ].map(item => (
              <div key={item.label} className="mb-5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-white font-mono">{item.val} <span className="text-slate-600 text-xs">({item.not})</span></span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full">
                  <div className={`h-2 ${item.renk} rounded-full`} style={{ width: `${item.val}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 bg-[#E8C97A]/5 border border-[#E8C97A]/15 rounded-lg">
              <p className="text-xs text-slate-400">
                <span className="text-[#E8C97A] font-medium">HFER-720:</span> URI = NormCurve(H × F × X × D / (1 + k·C²))
                <br/>Yakuplu OSB için NATECH D katsayısı = 2.4 · İTÜ AYM validasyonlu
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E8C97A]" /> Öncelikli Aksiyon Planı
            </h3>
            {[
              { baslik: 'Yakuplu OSB — NATECH Planı', acil: true, icerik: 'RAPID-N protokolü uygulanmalı. Komşu tesis bağımlılık haritası ve domino zinciri analizi gerekli.', badge: 'Acil' },
              { baslik: 'Kavaklı — Sel Erken Uyarı', acil: true, icerik: 'Meteoroloji API entegrasyonu + SMS/siren sistemi. İBB ıslah sonrası izleme kritik.', badge: 'Acil' },
              { baslik: 'Gürpınar — KAF Hattı Planı', acil: false, icerik: 'Zemin sıvılaşma etüdü. KİPTAŞ dönüşümü hızlandırılmalı. Heyelan risk haritası çıkarılmalı.', badge: 'Planla' },
              { baslik: 'İlçe ISO 22301 İş Sürekliliği', acil: false, icerik: 'Belediye kritik hizmetleri için iş sürekliliği planı. Uluslararası fon başvurusu için zorunlu.', badge: 'Planla' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 mb-3 p-3 bg-slate-900/40 rounded-lg border border-slate-700/30">
                <div className={`w-1 rounded-full flex-shrink-0 my-0.5 ${item.acil ? 'bg-red-400' : 'bg-amber-400'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-medium text-white">{item.baslik}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.acil ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-400'}`}>{item.badge}</span>
                  </div>
                  <p className="text-xs text-slate-400">{item.icerik}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Beylikdüzü mevcut kapasite kutusu */}
          <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E8C97A]" /> Mevcut Belediye Kapasitesi (NEFES Birliği)
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Gönüllü', val: '992', ikon: '👥' },
                { label: 'Müdahale Aracı', val: '169', ikon: '🚒' },
                { label: 'Müdahale İstasyonu', val: '10', ikon: '📦' },
                { label: 'Haneye Ulaşıldı', val: '75.498', ikon: '🏠' },
              ].map(k => (
                <div key={k.label} className="bg-slate-900/40 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">{k.ikon}</p>
                  <p className="text-xl font-bold text-white">{k.val}</p>
                  <p className="text-xs text-slate-500 mt-1">{k.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/15 rounded-lg">
              <p className="text-xs text-slate-400">
                <span className="text-blue-400 font-medium">OMNI × Beylikdüzü Sinerji:</span> Mevcut operasyonel kapasite güçlü. 
                OMNI bu kapasiteye kantitatif risk skoru, NATECH analizi ve uluslararası standart uyumu ekliyor. 
                EU Horizon / UNDP fon başvuruları için sayısal kanıt altyapısı kuruluyor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAHALLE ANALİZİ ===== */}
      {tab === 'mahalle' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            {MAHALLELER.map(m => (
              <button key={m.ad} onClick={() => setSecili(m)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${secili.ad === m.ad ? 'bg-slate-700/60 border-[#E8C97A]/40' : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-white text-sm font-medium">{m.ad}</span>
                    {m.natech && <span className="text-xs bg-orange-400/10 border border-orange-400/20 text-orange-400 px-1.5 py-0.5 rounded">NATECH</span>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RENKLER[m.risk]}`}>{m.risk}</span>
                </div>
                <div className="flex gap-4 mt-1.5 ml-5">
                  <span className="text-xs text-slate-500">URI: <span className="text-white font-mono font-medium">{m.uri}</span></span>
                  <span className="text-xs text-slate-500">{(m.nufus/1000).toFixed(0)}K kişi</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-white">{secili.ad} Mahallesi</h3>
                <div className="flex items-center gap-2">
                  {secili.natech && <span className="text-xs bg-orange-400/10 border border-orange-400/30 text-orange-400 px-2 py-1 rounded-full">⚠ NATECH D={secili.natech_d}</span>}
                  <span className={`text-sm px-3 py-1 rounded-full border font-medium ${RENKLER[secili.risk]}`}>{secili.risk}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'H Tehlike', val: secili.h, renk: 'text-red-400' },
                  { label: 'F Kırılganlık', val: secili.f, renk: 'text-orange-400' },
                  { label: 'E Kapasite', val: secili.e, renk: 'text-emerald-400' },
                ].map(item => (
                  <div key={item.label} className="bg-slate-900/50 rounded-lg p-3 text-center">
                    <p className={`text-2xl font-bold ${item.renk}`}>{item.val}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Tespit Edilen Tehlikeler</p>
                <div className="flex flex-wrap gap-2">
                  {secili.tehlikeler.map(t => (
                    <span key={t} className="text-xs bg-slate-700/50 border border-slate-600/40 text-slate-300 px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'Okul', val: secili.tesisler.okul, ikon: '🏫' },
                  { label: 'Hastane', val: secili.tesisler.hastane, ikon: '🏥' },
                  { label: 'OSB', val: secili.tesisler.osb, ikon: '🏭' },
                  { label: 'Altyapı', val: secili.tesisler.altyapi, ikon: '⚡' },
                ].map(t => (
                  <div key={t.label} className="bg-slate-900/50 rounded-lg p-2 text-center">
                    <p className="text-lg">{t.ikon}</p>
                    <p className="text-lg font-bold text-white">{t.val}</p>
                    <p className="text-xs text-slate-500">{t.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#E8C97A]/5 border border-[#E8C97A]/15 rounded-lg">
                  <p className="text-xs text-[#E8C97A] font-medium mb-1">{secili.sendai}</p>
                  <p className="text-xs text-slate-400">Sendai Öncelik Alanı</p>
                </div>
                <div className="p-3 bg-slate-900/50 border border-slate-700/30 rounded-lg">
                  <p className="text-xs text-white font-mono font-medium mb-1">URI = {secili.uri}/100</p>
                  <p className="text-xs text-slate-400">Dayanıklılık Endeksi</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">OMNI Analiz Notu</p>
              <p className="text-sm text-slate-300">{secili.not}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== TESİS AĞI ===== */}
      {tab === 'tesis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Toplam Okul', val: MAHALLELER.reduce((a,m)=>a+m.tesisler.okul,0), ikon: '🏫', renk: 'text-blue-400' },
              { label: 'Hastane/Klinik', val: MAHALLELER.reduce((a,m)=>a+m.tesisler.hastane,0), ikon: '🏥', renk: 'text-red-400' },
              { label: 'OSB/Sanayi', val: MAHALLELER.reduce((a,m)=>a+m.tesisler.osb,0), ikon: '🏭', renk: 'text-orange-400' },
              { label: 'Kritik Altyapı', val: MAHALLELER.reduce((a,m)=>a+m.tesisler.altyapi,0), ikon: '⚡', renk: 'text-amber-400' },
            ].map(item => (
              <div key={item.label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 text-center">
                <p className="text-3xl mb-2">{item.ikon}</p>
                <p className={`text-4xl font-bold ${item.renk}`}>{item.val}</p>
                <p className="text-xs text-slate-500 mt-2">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700/40 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E8C97A]" /> Kritik Tesis Listesi
              </h3>
              <span className="text-xs text-slate-500">NFPA · AFAD · ISO 22301 Uyum Durumu</span>
            </div>
            <div className="divide-y divide-slate-700/30">
              {[
                { ad: 'Yakuplu OSB', tip: 'Sanayi Bölgesi', mahalle: 'Yakuplu', risk: 'KRİTİK', natech: true, standart: 'NFPA 704 Sınıf 3', durum: 'NATECH Planı Yok' },
                { ad: 'Adnan Kahveci Devlet H.', tip: 'Hastane', mahalle: 'Adnan Kahveci', risk: 'ORTA', natech: false, standart: 'NFPA 101 Yaşam', durum: 'BCP Gerekli' },
                { ad: 'Büyükşehir Elektrik TM', tip: 'Kritik Altyapı', mahalle: 'Büyükşehir', risk: 'YÜKSEK', natech: false, standart: 'NFPA 70E', durum: 'İzleme Aktif' },
                { ad: 'Gürpınar Su Deposu', tip: 'Altyapı', mahalle: 'Gürpınar', risk: 'YÜKSEK', natech: false, standart: '—', durum: 'Risk Etüdü Yok' },
                { ad: 'Cumhuriyet AFAD Deposu', tip: 'Müdahale', mahalle: 'Cumhuriyet', risk: 'DÜŞÜK', natech: false, standart: 'AFAD Standart', durum: 'Operasyonel ✓' },
                { ad: 'Kavaklı İlköğretim', tip: 'Okul', mahalle: 'Kavaklı', risk: 'YÜKSEK', natech: false, standart: 'MEB Deprem', durum: 'Taşıma Planı Yok' },
              ].map((t, i) => (
                <div key={i} className="flex flex-wrap items-center justify-between p-4 hover:bg-slate-700/20 transition-colors gap-2">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-white font-medium">{t.ad}</p>
                      <p className="text-xs text-slate-500">{t.tip} · {t.mahalle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {t.natech && <span className="text-xs bg-orange-400/10 border border-orange-400/30 text-orange-400 px-2 py-0.5 rounded-full">NATECH</span>}
                    <span className="text-xs text-slate-500 hidden lg:inline">{t.standart}</span>
                    <span className="text-xs text-slate-400 bg-slate-700/40 px-2 py-0.5 rounded">{t.durum}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RENKLER[t.risk]}`}>{t.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== NATECH SENARYO ===== */}
      {tab === 'natech' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-5">Senaryo Parametreleri</h3>

            <div className="mb-5">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Afet Türü</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'deprem', label: '🌍 Deprem' },
                  { key: 'yangin', label: '🔥 Yangın' },
                  { key: 'sel', label: '🌊 Sel' },
                ].map(s => (
                  <button key={s.key} onClick={() => setSenaryo(s.key)}
                    className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${senaryo === s.key ? 'bg-[#E8C97A]/10 border-[#E8C97A]/40 text-[#E8C97A]' : 'bg-slate-700/30 border-slate-600/30 text-slate-400 hover:text-slate-200'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {senaryo === 'deprem' && (
              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Deprem Şiddeti (Mw)</p>
                  <p className="text-[#E8C97A] font-mono font-bold">{siddet.toFixed(1)}</p>
                </div>
                <input type="range" min="5.0" max="8.0" step="0.1" value={siddet}
                  onChange={e => setSiddet(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400" />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>Mw 5.0</span><span>Mw 8.0</span>
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">RAPID-N Protokolü</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Etkilenen tesis</span>
                  <span className="text-white font-mono">Yakuplu OSB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NATECH D katsayısı</span>
                  <span className="text-orange-400 font-mono">2.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Domino zinciri</span>
                  <span className="text-white font-mono">3 komşu tesis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tahliye süresi</span>
                  <span className="text-white font-mono">~45 dk</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`rounded-xl p-6 border ${natechEtki > 60 ? 'bg-red-900/20 border-red-500/30' : natechEtki > 30 ? 'bg-orange-900/20 border-orange-500/30' : 'bg-amber-900/20 border-amber-500/30'}`}>
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">NATECH Kümülatif Etki Skoru</p>
              <p className={`text-6xl font-bold mb-2 ${natechEtki > 60 ? 'text-red-400' : natechEtki > 30 ? 'text-orange-400' : 'text-amber-400'}`}>
                {natechEtki}<span className="text-2xl text-slate-500">/100</span>
              </p>
              <p className="text-slate-300 text-sm">
                {natechEtki > 60 ? 'KRİTİK — Acil tahliye ve müdahale protokolü devreye alınmalı' :
                 natechEtki > 30 ? 'YÜKSEK — Önleyici önlemler ve erken uyarı aktif edilmeli' :
                 'ORTA — İzleme ve hazırlık seviyesi yükseltilmeli'}
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Etki Projeksiyonu</p>
              <div className="space-y-3">
                {[
                  { label: 'Risk altındaki nüfus', val: `~${(etkilenenNufus/1000).toFixed(0)}K kişi`, renk: 'text-red-400' },
                  { label: 'Tahliye gerektiren bölge', val: 'Yakuplu + Kavaklı', renk: 'text-orange-400' },
                  { label: 'Etkilenen okul sayısı', val: `${Math.ceil(natechEtki/20)} okul`, renk: 'text-amber-400' },
                  { label: 'Acil müdahale süresi', val: senaryo === 'deprem' ? '72 saat' : '48 saat', renk: 'text-white' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-700/30">
                    <span className="text-sm text-slate-400">{item.label}</span>
                    <span className={`text-sm font-medium ${item.renk}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#E8C97A]/5 border border-[#E8C97A]/20 rounded-xl p-4">
              <p className="text-xs text-[#E8C97A] font-medium mb-2">OMNI × RAPID-N Entegrasyonu</p>
              <p className="text-xs text-slate-400">
                RAPID-N (Risk Assessment of Industrial Pollution in Natural Disasters) protokolü ile
                Yakuplu OSB için kimyasal yayılım modeli, rüzgar yönü ve nüfus yoğunluğu
                birleştirilerek gerçek zamanlı tahliye koridoru oluşturulabilir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== SENDAİ UYUM ===== */}
      {tab === 'sendai' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { no: 'SF-1', baslik: 'Afet Riskini Anlama', puan: 72, durum: 'Aktif', omni: 'HFER-720 URI skoru + mahalle bazlı risk haritası', renk: 'emerald' },
              { no: 'SF-2', baslik: 'Risk Yönetişimini Güçlendirme', puan: 48, durum: 'Kısmi', omni: 'Belediye ISO 22301 BCP planlaması + OMNI dashboard entegrasyonu', renk: 'amber' },
              { no: 'SF-3', baslik: 'Dayanıklılığa Yatırım', puan: 35, durum: 'Planlandı', omni: 'Tesis ağı dayanıklılık skoru + NATECH D katsayısı hesaplama', renk: 'amber' },
              { no: 'SF-4', baslik: 'Etkin Müdahale ve Yeniden Yapılanma', puan: 21, durum: 'Eksik', omni: 'EOC dashboard + NEFES Birliği protokolü entegrasyonu', renk: 'red' },
            ].map(s => (
              <div key={s.no} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-slate-500 bg-slate-700/40 px-2 py-1 rounded">{s.no}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium
                    ${s.renk === 'emerald' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' :
                      s.renk === 'amber'   ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' :
                      'text-red-400 bg-red-400/10 border-red-400/30'}`}>{s.durum}</span>
                </div>
                <p className="text-white font-semibold mb-3">{s.baslik}</p>
                <div className="h-1.5 bg-slate-700 rounded-full mb-3">
                  <div className={`h-1.5 rounded-full ${s.renk === 'emerald' ? 'bg-emerald-500' : s.renk === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${s.puan}%` }} />
                </div>
                <p className="text-xs text-slate-400"><span className="text-[#E8C97A]">OMNI katkısı:</span> {s.omni}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Uluslararası Fon Fırsatları</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[
                { fon: 'EU Horizon Europe', konu: 'Şehir Dayanıklılığı (2024–2027)', gereklilik: 'Sendai uyum raporu + kantitatif risk skoru', durum: 'Uygun' },
                { fon: 'UNDP DRRM', konu: 'Afet Risk Azaltma Fonu', gereklilik: 'RAPID-N analizi + tesis ağı haritası', durum: 'Değerlendirme' },
                { fon: 'Dünya Bankası GFDRR', konu: 'Küresel Afet Risk Finansmanı', gereklilik: 'ISO 22301 BCP + URI endeksi', durum: 'Potansiyel' },
              ].map(f => (
                <div key={f.fon} className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/30">
                  <p className="text-white font-medium text-sm mb-1">{f.fon}</p>
                  <p className="text-xs text-slate-400 mb-2">{f.konu}</p>
                  <p className="text-xs text-slate-500 mb-3"><span className="text-slate-400">Gereklilik:</span> {f.gereklilik}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium
                    ${f.durum === 'Uygun' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' :
                      f.durum === 'Değerlendirme' ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' :
                      'text-blue-400 bg-blue-400/10 border-blue-400/30'}`}>{f.durum}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-600">OMNI Resilience Platform · HFER-720 v2.0 · İTÜ AYM · © 2026</p>
        <p className="text-xs text-slate-600">Sendai 2015–2030 · ISO 22301 · AFAD · RAPID-N · NFPA Uyumlu</p>
      </div>
    </div>
  )
}
