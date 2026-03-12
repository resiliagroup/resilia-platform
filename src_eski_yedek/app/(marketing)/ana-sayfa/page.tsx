'use client'
import { useState, useEffect, useRef } from 'react'

// ── Sabit veriler ────────────────────────────────────────────
const NAV_LINKS = [
  {
    label: 'Çözümler',
    mega: [
      { title: 'Bankacılık & Finans',      desc: 'BDDK uyumlu şube ağı yönetimi',       href: '/solutions/banking' },
      { title: 'Sağlık',                    desc: 'Hastane ve klinik sürekliliği',         href: '/solutions/health' },
      { title: 'Konaklama & Turizm',        desc: 'Otel zinciri kriz yönetimi',            href: '/solutions/hospitality' },
      { title: 'Üretim Tesisleri',          desc: 'OSB ve fabrika dayanıklılığı',          href: '/solutions/manufacturing' },
      { title: 'Hizmet Sektörü',            desc: 'Lojistik ve perakende sürekliliği',     href: '/solutions/services' },
      { title: 'Odalar',                    desc: 'Sanayi ve ticaret odası üye izleme',    href: '/solutions/chambers' },
      { title: 'Belediyeler',               desc: 'Kent genelinde afet koordinasyonu',     href: '/solutions/municipalities' },
      { title: 'MEB / Eğitim',              desc: 'Okul ve il milli eğitim müdürlükleri', href: '/solutions/education' },
    ],
  },
  {
    label: 'Platform',
    mega: [
      { title: 'BCM Skorlama',     desc: 'HFE-360 metodolojisi ile puanlama',    href: '/platform/bcm' },
      { title: 'Uyum Yönetimi',    desc: 'ISO 22301, BDDK, AFAD mevzuatı',      href: '/platform/compliance' },
      { title: 'CBS Harita',       desc: 'Coğrafi risk katmanlı görselleştirme', href: '/platform/maps' },
      { title: 'Raporlama',        desc: 'Yönetim kurulu ve denetçi raporları',  href: '/platform/reporting' },
    ],
  },
  { label: 'Referanslar', mega: null, href: '/referanslar' },
  { label: 'Kaynaklar',   mega: null, href: '/egitim' },
  { label: 'Hakkımızda',  mega: null, href: '/sirket' },
]

const SEKTORLER = [
  {
    id: 'bankacilik',
    baslik: 'Bankacılık & Finans',
    altyazi: 'BDDK 26333 · ISO 22301 · SWIFT CSP',
    aciklama: 'Yüzlerce şubeden oluşan bankacılık ağlarında merkezi dayanıklılık skorlaması, düzenleyici uyum takibi ve gerçek zamanlı kriz koordinasyonu.',
    metrik1: { deger: '673', etiket: 'Şube' },
    metrik2: { deger: 'BDDK', etiket: 'Uyum' },
    ozellikler: ['Şube bazlı HFE-360 değerlendirmesi', 'BDDK 26333 otomatik uyum raporları', 'SWIFT & ödeme sistemi sürekliliği', 'Merkezi kriz komuta merkezi'],
  },
  {
    id: 'saglik',
    baslik: 'Sağlık',
    altyazi: 'HAP · JCI · ISO 27799',
    aciklama: 'Hastane ve sağlık tesislerinde hasta güvenliğini merkeze alan iş sürekliliği planlaması, akreditasyon hazırlığı ve kritik tıbbi altyapı koruması.',
    metrik1: { deger: '24', etiket: 'Tesis' },
    metrik2: { deger: 'JCI', etiket: 'Standart' },
    ozellikler: ['Kritik tıbbi ekipman sürekliliği', 'Hasta tahliye protokolleri', 'HAP/JCI akreditasyon desteği', 'Sağlık bilgi sistemi kurtarma'],
  },
  {
    id: 'belediye',
    baslik: 'Belediyeler',
    altyazi: '5393 Sayılı Kanun · AFAD · ISO 22301',
    aciklama: 'Büyükşehir ve ilçe belediyelerinde afet koordinasyonu, altyapı dayanıklılığı ve vatandaş hizmetlerinin kesintisiz sürdürülmesi.',
    metrik1: { deger: '81', etiket: 'İl' },
    metrik2: { deger: 'AFAD', etiket: 'Entegre' },
    ozellikler: ['Kent geneli risk haritalaması', 'AFAD koordinasyon entegrasyonu', 'Altyapı servis sürekliliği', 'Kriz iletişim yönetimi'],
  },
  {
    id: 'meb',
    baslik: 'MEB / Eğitim',
    altyazi: 'MEB Genelge · AFAD · Yangın Yönetmeliği',
    aciklama: 'İl milli eğitim müdürlüklerinin bağlı okullarının tamamını merkezi bir ekrandan izleyebileceği, okul bazlı dayanıklılık değerlendirme sistemi.',
    metrik1: { deger: '60K+', etiket: 'Okul' },
    metrik2: { deger: 'MEB', etiket: 'Uyum' },
    ozellikler: ['Okul bazlı HFE değerlendirmesi', 'Tahliye planı yönetimi', 'İl/ilçe MEM dashboard', 'Deprem ve yangın hazırlık skorlaması'],
  },
  {
    id: 'uretim',
    baslik: 'Üretim Tesisleri',
    altyazi: '6331 İSG · Seveso III · ISO 45001',
    aciklama: 'OSB ve üretim tesislerinde iş sağlığı ve güvenliği uyumu, tehlikeli madde yönetimi ve operasyonel sürekliliğin entegre platformu.',
    metrik1: { deger: 'OSB', etiket: 'Entegre' },
    metrik2: { deger: 'ISO', etiket: '45001' },
    ozellikler: ['Seveso III tehlikeli madde takibi', '6331 İSG uyum yönetimi', 'Üretim hattı sürekliliği', 'Tedarik zinciri risk analizi'],
  },
  {
    id: 'odalar',
    baslik: 'Sanayi & Ticaret Odaları',
    altyazi: 'TOBB · TESK · ISO 22313',
    aciklama: 'Odaya bağlı sanayi ve ticaret kuruluşlarının tamamını kapsayan merkezi dayanıklılık izleme ve üye firma raporlama platformu.',
    metrik1: { deger: '689+', etiket: 'Üye' },
    metrik2: { deger: 'TOBB', etiket: 'Standart' },
    ozellikler: ['Üye firma bazlı değerlendirme', 'Sektörel kıyaslama raporları', 'TOBB/TESK uyum takibi', 'Toplu raporlama araçları'],
  },
]

const REFERANSLAR = [
  {
    ad: 'Dr. Mehmet Yılmaz',
    unvan: 'Risk Yönetimi Direktörü',
    kurum: 'Büyük Ölçekli Bir Türk Bankası',
    metin: 'RESILIA sayesinde 673 şubemizin tamamının dayanıklılık durumunu tek bir ekrandan izleyebiliyoruz. BDDK raporlamalarımız artık saatler değil dakikalar alıyor.',
  },
  {
    ad: 'Uzman Dr. Fatma Arslan',
    unvan: 'Afet ve Acil Durum Koordinatörü',
    kurum: 'İl Milli Eğitim Müdürlüğü',
    metin: 'İlimize bağlı tüm okulların hazırlık durumunu merkezi olarak görebilmek, önceliklendirme kararlarımızı çok daha hızlı almamızı sağlıyor.',
  },
  {
    ad: 'Genel Sekreter Kemal Çelik',
    unvan: 'Genel Sekreter',
    kurum: 'Bölge Sanayi Odası',
    metin: 'Üyelerimizin BCM hazırlık seviyelerini karşılaştırmalı olarak raporlayabilmek, odamızın danışmanlık kapasitesini ciddi ölçüde artırdı.',
  },
]

const ISTATISTIKLER = [
  { deger: '8',    etiket: 'Sektör',           aciklama: 'Tek platformda' },
  { deger: '44',   etiket: 'Değerlendirme',    aciklama: 'HFE-360 sorusu' },
  { deger: 'ISO',  etiket: '22301 Uyumlu',     aciklama: 'Uluslararası standart' },
  { deger: 'İTÜ', etiket: 'AYM İş Birliği',   aciklama: 'Akademik metodoloji' },
]

// ── Ana Bileşen ───────────────────────────────────────────────
export default function AnaSayfa() {
  const [acikMega,    setAcikMega]    = useState<string | null>(null)
  const [aktifSektor, setAktifSektor] = useState('bankacilik')
  const [navSabit,    setNavSabit]    = useState(false)
  const [gorunen,     setGorunen]     = useState<Set<string>>(new Set())
  const gozlemci = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const scrollFn = () => setNavSabit(window.scrollY > 60)
    window.addEventListener('scroll', scrollFn)
    return () => window.removeEventListener('scroll', scrollFn)
  }, [])

  useEffect(() => {
    gozlemci.current = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setGorunen(p => { const s = new Set(p); s.add(e.target.id); return s; })
      }),
      { threshold: 0.15 }
    )
    document.querySelectorAll('[data-animate]').forEach(el => gozlemci.current?.observe(el))
    return () => gozlemci.current?.disconnect()
  }, [])

  const sektor = SEKTORLER.find(s => s.id === aktifSektor) || SEKTORLER[0]

  return (
    <div
      className="min-h-screen bg-stone-50 text-stone-900"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      onClick={() => setAcikMega(null)}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
        [data-animate] { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        [data-animate].visible { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .sektor-tab { transition: all 0.2s ease; }
        .sektor-tab.aktif { background: #0A1628; color: white; }
        .mega-panel { animation: fadeDown 0.18s ease; }
        @keyframes fadeDown { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }
        .hero-line { overflow: hidden; }
        .hero-line span { display: block; animation: slideUp 0.8s cubic-bezier(.16,1,.3,1) both; }
        .hero-line:nth-child(2) span { animation-delay: 0.1s; }
        .hero-line:nth-child(3) span { animation-delay: 0.2s; }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .itu-badge { background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%); }
      `}</style>

      {/* ── ÜSTBANT ────────────────────────────────────────── */}
      <div className="bg-stone-900 text-stone-400 text-xs py-2 px-6 flex justify-between items-center">
        <span>
          <span className="text-white font-medium">İTÜ AYM</span> iş birliğiyle geliştirilmiş akademik BCM metodolojisi
        </span>
        <a href="/login" className="text-teal-400 hover:text-teal-300 transition font-medium">
          Platforma Giriş
        </a>
      </div>

      {/* ── NAVİGASYON ─────────────────────────────────────── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          navSabit
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200'
            : 'bg-white border-b border-stone-100'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm font-display">R</span>
            </div>
            <div>
              <span className="font-bold text-stone-900 tracking-tight text-lg font-display">RESILIA</span>
              <span className="text-stone-400 text-xs ml-1.5 hidden sm:inline">Group</span>
            </div>
          </a>

          {/* Linkler */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <div key={link.label} className="relative">
                {link.mega ? (
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      acikMega === link.label
                        ? 'bg-stone-100 text-stone-900'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                    onClick={e => {
                      e.stopPropagation()
                      setAcikMega(acikMega === link.label ? null : link.label)
                    }}
                  >
                    {link.label}
                    <svg className="inline ml-1 w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <a
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-stone-600 hover:text-stone-900 hover:bg-stone-50 block"
                  >
                    {link.label}
                  </a>
                )}

                {/* Mega Menü */}
                {link.mega && acikMega === link.label && (
                  <div className="mega-panel absolute top-full left-0 mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl p-5 min-w-max z-50"
                    onClick={e => e.stopPropagation()}>
                    <div className="grid grid-cols-2 gap-1 min-w-96">
                      {link.mega.map(item => (
                        <a
                          key={item.title}
                          href={item.href}
                          className="flex flex-col px-4 py-3 rounded-xl hover:bg-stone-50 transition group"
                        >
                          <span className="text-sm font-semibold text-stone-800 group-hover:text-teal-700 transition">
                            {item.title}
                          </span>
                          <span className="text-xs text-stone-400 mt-0.5">{item.desc}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a href="/login" className="hidden sm:block text-sm text-stone-500 hover:text-stone-900 transition font-medium">
              Giriş
            </a>
            <a
              href="#demo"
              className="bg-stone-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-stone-700 transition font-medium"
            >
              Demo Talep Et
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-stone-100 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Sol: Metin */}
            <div>
              {/* İTÜ AYM Rozeti */}
              <div className="itu-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-200 mb-8">
                <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[9px] font-bold">İTÜ</span>
                </div>
                <span className="text-blue-800 text-xs font-medium">
                  İTÜ AYM iş birliğiyle geliştirilmiştir
                </span>
              </div>

              <h1 className="font-display text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6">
                <div className="hero-line"><span>Kurumsal</span></div>
                <div className="hero-line"><span className="text-teal-700">Dayanıklılık,</span></div>
                <div className="hero-line"><span>Tek Platformda.</span></div>
              </h1>

              <p className="text-stone-500 text-lg leading-relaxed mb-8 max-w-lg">
                Bankadan okula, fabrikadan belediyeye — 8 sektörde iş sürekliliği yönetimi,
                risk skorlaması ve düzenleyici uyum. HFE-360 metodolojisi ile.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#demo"
                  className="bg-stone-900 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-stone-700 transition text-sm"
                >
                  Demo Talep Et
                </a>
                <a
                  href="#sektorler"
                  className="border border-stone-200 text-stone-700 px-7 py-3.5 rounded-xl font-semibold hover:bg-stone-50 transition text-sm"
                >
                  Sektörleri İncele
                </a>
              </div>

              {/* Mevzuat rozeti */}
              <div className="flex flex-wrap gap-2 mt-8">
                {['ISO 22301', 'BDDK 26333', 'AFAD', 'MEB', 'Seveso III'].map(m => (
                  <span key={m} className="text-xs font-mono-dm text-stone-400 bg-stone-100 px-2.5 py-1 rounded-lg">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Sağ: Dashboard Mockup */}
            <div className="relative">
              <div className="bg-stone-900 rounded-2xl p-1 shadow-2xl shadow-stone-900/20">
                {/* Tarayıcı üst çubuğu */}
                <div className="flex items-center gap-1.5 px-4 py-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <div className="flex-1 bg-stone-800 rounded-md mx-4 px-3 py-1 text-[10px] font-mono-dm text-stone-500">
                    app.resilia.group/board/ozet
                  </div>
                </div>

                {/* Dashboard içeriği */}
                <div className="bg-slate-950 rounded-xl p-5 mx-1 mb-1">
                  {/* KPI Satırı */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: 'Toplam Birim', val: '673', alt: 'şube' },
                      { label: 'Ortalama Skor', val: '61', alt: '/100', renk: '#F59E0B' },
                      { label: 'Kritik', val: '47', alt: 'birim', renk: '#EF4444' },
                      { label: 'Güçlü', val: '312', alt: 'birim', renk: '#22C55E' },
                    ].map(k => (
                      <div key={k.label} className="bg-slate-900 rounded-xl p-3 text-center">
                        <div className="font-mono-dm font-bold text-xl" style={{ color: k.renk || '#fff' }}>
                          {k.val}
                        </div>
                        <div className="text-[9px] text-slate-600 mt-0.5">{k.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Risk Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[9px] text-slate-600 mb-1.5">
                      <span>Risk Dağılımı</span>
                      <span>673 birim</span>
                    </div>
                    <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
                      <div className="bg-red-500/80 w-[7%]" />
                      <div className="bg-amber-500/80 w-[40%]" />
                      <div className="bg-emerald-500/80 w-[53%]" />
                    </div>
                    <div className="flex gap-3 mt-1.5 text-[9px]">
                      <span className="text-red-400">Kritik 47</span>
                      <span className="text-amber-400">Orta 314</span>
                      <span className="text-emerald-400">Güçlü 312</span>
                    </div>
                  </div>

                  {/* Kritik Birimler */}
                  <div className="text-[9px] text-slate-600 mb-2 uppercase tracking-wider">Öncelikli Birimler</div>
                  <div className="space-y-1.5">
                    {[
                      { kod: '0214', senaryo: 'Deprem', skor: 28, renk: '#EF4444' },
                      { kod: '0137', senaryo: 'Siber Saldırı', skor: 34, renk: '#EF4444' },
                      { kod: '0091', senaryo: 'Sel / Taşkın', skor: 39, renk: '#F59E0B' },
                    ].map(b => (
                      <div key={b.kod} className="flex items-center gap-3 bg-slate-900 rounded-lg px-3 py-2">
                        <span className="font-mono-dm text-[10px] text-white w-10">{b.kod}</span>
                        <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${b.skor}%`, background: b.renk }} />
                        </div>
                        <span className="font-mono-dm text-[10px] font-bold w-6 text-right" style={{ color: b.renk }}>
                          {b.skor}
                        </span>
                        <span className="text-[9px] text-slate-600 w-20 text-right">{b.senaryo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Yüzen badge */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-lg">
                <div className="text-xs text-stone-500 mb-0.5">HFE-360 Skoru</div>
                <div className="font-display text-3xl font-bold text-amber-500">61</div>
                <div className="text-[10px] text-stone-400">673 birim ortalaması</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GÜVEN BANDI ────────────────────────────────────── */}
      <section className="bg-stone-900 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-stone-500 text-xs text-center mb-6 uppercase tracking-widest">
            Güvenilen kurumlar ve ortaklar
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 items-center">
            {['İTÜ AYM', 'AFAD', 'BDDK', 'ISO 22301', 'TOBB', 'MEB'].map(k => (
              <span key={k} className="text-stone-400 font-semibold text-sm tracking-wide font-display">
                {k}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── İSTATİSTİKLER ──────────────────────────────────── */}
      <section className="bg-white py-16 px-6 border-b border-stone-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {ISTATISTIKLER.map((s, i) => (
            <div
              key={s.etiket}
              id={`stat-${i}`}
              data-animate
              className={`text-center ${gorunen.has(`stat-${i}`) ? 'visible' : ''} delay-${i + 1}`}
            >
              <div className="font-display text-5xl font-bold text-stone-900 mb-1">{s.deger}</div>
              <div className="font-semibold text-stone-700 text-sm">{s.etiket}</div>
              <div className="text-stone-400 text-xs mt-0.5">{s.aciklama}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEKTÖRLER ──────────────────────────────────────── */}
      <section id="sektorler" className="py-20 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div
            id="sektor-baslik"
            data-animate
            className={`mb-10 ${gorunen.has('sektor-baslik') ? 'visible' : ''}`}
          >
            <p className="text-teal-700 text-sm font-semibold uppercase tracking-widest mb-3">Çözümler</p>
            <h2 className="font-display text-4xl font-bold text-stone-900 mb-4">
              Her Sektöre Özel,<br />Tek Bir Platform
            </h2>
            <p className="text-stone-500 text-lg max-w-xl">
              Bankacılıktan eğitime, üretimden belediyelere — sektöre özgü mevzuat,
              sorular ve raporlama yapısıyla.
            </p>
          </div>

          {/* Sektör Sekmeleri */}
          <div className="flex flex-wrap gap-2 mb-8">
            {SEKTORLER.map(s => (
              <button
                key={s.id}
                onClick={() => setAktifSektor(s.id)}
                className={`sektor-tab px-4 py-2 rounded-xl text-sm font-medium border transition ${
                  aktifSektor === s.id
                    ? 'aktif border-stone-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                }`}
              >
                {s.baslik}
              </button>
            ))}
          </div>

          {/* Seçili Sektör Paneli */}
          <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            <div>
              <p className="font-mono-dm text-xs text-stone-400 mb-2">{sektor.altyazi}</p>
              <h3 className="font-display text-3xl font-bold text-stone-900 mb-4">{sektor.baslik}</h3>
              <p className="text-stone-500 leading-relaxed mb-6">{sektor.aciklama}</p>
              <div className="space-y-2.5">
                {sektor.ozellikler.map(o => (
                  <div key={o} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-stone-700">{o}</span>
                  </div>
                ))}
              </div>
              <a
                href={`/solutions/${sektor.id}`}
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-stone-900 hover:text-teal-700 transition"
              >
                {sektor.baslik} çözümünü incele
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Metrik Kartlar */}
            <div className="flex flex-col justify-center gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-2xl p-6 text-center border border-stone-100">
                  <div className="font-display text-4xl font-bold text-stone-900 mb-1">
                    {sektor.metrik1.deger}
                  </div>
                  <div className="text-sm text-stone-500">{sektor.metrik1.etiket}</div>
                </div>
                <div className="bg-teal-700 rounded-2xl p-6 text-center">
                  <div className="font-display text-4xl font-bold text-white mb-1">
                    {sektor.metrik2.deger}
                  </div>
                  <div className="text-sm text-teal-200">{sektor.metrik2.etiket}</div>
                </div>
              </div>
              <div className="bg-stone-900 rounded-2xl p-5">
                <div className="text-xs text-stone-500 mb-3 uppercase tracking-wider">HFE-360 Metodolojisi</div>
                <div className="space-y-2">
                  {[
                    { label: 'H — Tehlike',        val: 72, renk: '#F97316' },
                    { label: 'F — Kırılganlık',    val: 58, renk: '#EF4444' },
                    { label: 'E — Kapasite',       val: 64, renk: '#3B82F6' },
                  ].map(b => (
                    <div key={b.label} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono-dm text-stone-500 w-24">{b.label}</span>
                      <div className="flex-1 bg-stone-800 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${b.val}%`, background: b.renk }} />
                      </div>
                      <span className="text-[10px] font-mono-dm font-bold w-6" style={{ color: b.renk }}>
                        {b.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── İTÜ AYM İŞ BİRLİĞİ ────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div
            id="itu-sol"
            data-animate
            className={gorunen.has('itu-sol') ? 'visible' : ''}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-6">
              <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">İTÜ</span>
              </div>
              <span className="text-blue-800 text-xs font-semibold">Akademik İş Birliği</span>
            </div>
            <h2 className="font-display text-4xl font-bold text-stone-900 mb-5">
              İTÜ AYM İş Birliğiyle<br />Geliştirilen Metodoloji
            </h2>
            <p className="text-stone-500 leading-relaxed mb-6">
              İstanbul Teknik Üniversitesi Afet Yönetimi Uygulama ve Araştırma Merkezi
              ile ortaklaşa geliştirilen <strong className="text-stone-700">HFE-360 metodolojisi</strong>,
              Tehlike, Kırılganlık ve Kapasite bileşenlerini akademik titizlikle ölçer.
            </p>
            <p className="text-stone-500 leading-relaxed mb-8">
              44 soruluk değerlendirme çerçevesi, ISO 22301 uluslararası standardı ile
              Türkiye'ye özgü mevzuat gerekliliklerini tek bir puanlama sisteminde birleştirir.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Peer-reviewed metodoloji', 'ISO 22301 uyumlu', 'Türkiye mevzuatı entegre'].map(o => (
                <span key={o} className="text-xs bg-stone-100 text-stone-600 px-3 py-1.5 rounded-lg font-medium">
                  {o}
                </span>
              ))}
            </div>
          </div>

          <div
            id="itu-sag"
            data-animate
            className={`delay-2 ${gorunen.has('itu-sag') ? 'visible' : ''}`}
          >
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8">
              <div className="text-xs text-stone-400 uppercase tracking-widest mb-6 font-mono-dm">
                HFE-360 Bileşenleri
              </div>
              {[
                { harf: 'H', baslik: 'Tehlike', aciklama: 'Dış kaynaklı tehlikelerin gerçekleşme olasılığı ve şiddetinin ölçümü. 8 soru, ağırlıklı puanlama.', renk: '#F97316', bg: 'bg-orange-50 border-orange-100' },
                { harf: 'F', baslik: 'Kırılganlık', aciklama: 'Kurumun iç yapısal zayıflıkları ve tehditlere karşı duyarlılığı. 14 soru.', renk: '#EF4444', bg: 'bg-red-50 border-red-100' },
                { harf: 'E', baslik: 'Kapasite', aciklama: 'Hazırlık, önlem ve müdahale kapasitesinin değerlendirmesi. 22 soru.', renk: '#3B82F6', bg: 'bg-blue-50 border-blue-100' },
              ].map(b => (
                <div key={b.harf} className={`flex gap-4 p-4 rounded-xl border mb-3 ${b.bg}`}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg text-white flex-shrink-0"
                    style={{ background: b.renk }}
                  >
                    {b.harf}
                  </div>
                  <div>
                    <div className="font-semibold text-stone-800 text-sm mb-0.5">{b.baslik}</div>
                    <div className="text-xs text-stone-500 leading-relaxed">{b.aciklama}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REFERANSLAR ────────────────────────────────────── */}
      <section id="referanslar" className="py-20 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div
            id="ref-baslik"
            data-animate
            className={`text-center mb-12 ${gorunen.has('ref-baslik') ? 'visible' : ''}`}
          >
            <p className="text-teal-700 text-sm font-semibold uppercase tracking-widest mb-3">Referanslar</p>
            <h2 className="font-display text-4xl font-bold text-stone-900">
              Kullananlar Anlatıyor
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {REFERANSLAR.map((r, i) => (
              <div
                key={r.ad}
                id={`ref-${i}`}
                data-animate
                className={`bg-white border border-stone-200 rounded-2xl p-7 shadow-sm ${gorunen.has(`ref-${i}`) ? 'visible' : ''} delay-${i + 1}`}
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-6 italic">
                  "{r.metin}"
                </p>
                <div>
                  <div className="font-semibold text-stone-800 text-sm">{r.ad}</div>
                  <div className="text-stone-400 text-xs mt-0.5">{r.unvan}</div>
                  <div className="text-stone-400 text-xs">{r.kurum}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section id="demo" className="py-24 px-6 bg-stone-900">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-stone-500 text-sm uppercase tracking-widest mb-4 font-mono-dm">Demo Talep Et</p>
          <h2 className="font-display text-5xl font-bold text-white mb-6">
            Kurumunuzun Dayanıklılık<br />Skorunu Öğrenin
          </h2>
          <p className="text-stone-400 text-lg mb-10">
            30 dakikalık demo görüşmesinde platformu canlı olarak görün,
            sektörünüze özgü sorularınızı yanıtlayalım.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="kurumsal@email.com"
              className="bg-stone-800 border border-stone-700 text-white placeholder-stone-600 px-5 py-3.5 rounded-xl text-sm focus:outline-none focus:border-teal-500 sm:w-72"
            />
            <button className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition">
              Demo Talep Et
            </button>
          </div>
          <p className="text-stone-600 text-xs mt-4">
            İTÜ AYM iş birliğiyle geliştirilmiştir · Verileriniz güvende
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-stone-950 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-white font-bold text-xs font-display">R</span>
                </div>
                <span className="font-display font-bold text-white">RESILIA</span>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed mb-3">
                Kurumsal dayanıklılık ve iş sürekliliği yönetimi platformu.
              </p>
              <p className="text-stone-700 text-xs">
                İTÜ AYM iş birliğiyle geliştirilmiştir.
              </p>
            </div>
            {[
              { baslik: 'Çözümler', linkler: ['Bankacılık', 'Sağlık', 'Belediyeler', 'MEB', 'Üretim', 'Odalar'] },
              { baslik: 'Platform', linkler: ['BCM Skorlama', 'Uyum Yönetimi', 'CBS Harita', 'Raporlama'] },
              { baslik: 'Şirket',   linkler: ['Hakkımızda', 'İş Birliği', 'Kaynaklar', 'İletişim'] },
            ].map(k => (
              <div key={k.baslik}>
                <div className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3">{k.baslik}</div>
                <div className="space-y-2">
                  {k.linkler.map(l => (
                    <a key={l} href="#" className="block text-stone-600 hover:text-stone-300 text-sm transition">{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-900 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-stone-700 text-xs">© 2025-2026 RESILIA · Tüm hakları saklıdır.</span>
            <span className="text-stone-700 text-xs">
              İTÜ AYM iş birliğiyle geliştirilmiştir · ISO 22301
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
