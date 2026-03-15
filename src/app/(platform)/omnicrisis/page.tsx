'use client'
import { useState } from 'react'

type OlayDurum = 'Kapalı' | 'Aktif' | 'İzleniyor'

interface Aksiyon {
  id: number
  metin: string
  tamamlandi: boolean
}

interface Olay {
  id: string
  baslik: string
  tarih: string
  tur: string
  durum: OlayDurum
  ozet: string
  ekleGorev: string[]
  silGorev: string[]
  uzunSuren: string[]
  tamamlanamayan: string[]
  basarilar: string[]
  basarisizliklar: string[]
  aksiyonlar: Aksiyon[]
}

const OLAYLAR: Olay[] = [
  {
    id: 'olay-001',
    baslik: 'Haramidere Sanayi Yangın Tatbikatı',
    tarih: '08 Mart 2026',
    tur: 'Yangın / NATECH',
    durum: 'Kapalı',
    ozet: 'Haramidere OSB\'de kimyasal madde depolama alanı yangın senaryosu tatbikatı. 3 fabrika, 1 depo, NEFES gönüllüler ve İtfaiye Müdürlüğü katıldı. Tahliye protokolü ve RAPID-N domino zinciri testi yapıldı.',
    ekleGorev: [
      'RAPID-N kimyasal yayılım haritası çıkarma',
      'OSB giriş/çıkış noktası güvenlik protokolü',
      'Rüzgar yönü izleme sensörü kurulumu',
    ],
    silGorev: [
      'Manuel tetikleme protokolü (otomasyona geçildi)',
    ],
    uzunSuren: [
      'Tahliye bildirim SMS\'i — hedef 5 dk, gerçekleşen 14 dk',
      'AFAD koordinasyon onayı — hedef 10 dk, gerçekleşen 28 dk',
    ],
    tamamlanamayan: [
      'F-N eğrisi hesabı tatbikat sırasında tamamlanamadı',
      'Yakın tesis yöneticisi bilgilendirmesi atlandı',
    ],
    basarilar: [
      'NEFES gönüllüler sahaya 18 dakikada ulaştı (hedef 20 dk)',
      'Tüm OSB personeli 22 dakikada tahliye edildi',
      'İtfaiye–OMNI veri entegrasyonu ilk kez başarıyla test edildi',
      'Domino riski haritası gerçek zamanlı güncellendi',
    ],
    basarisizliklar: [
      'SMS bildirim sistemi kapasitesi yetersiz kaldı — toplu mesaj gecikti',
      'AFAD ile koordinasyon hattı ilk 10 dakika meşgul bulundu',
      'Gece vardiyası senaryosu test edilmedi',
    ],
    aksiyonlar: [
      { id: 1, metin: 'SMS bildirim kapasitesini 5.000/dk\'ya yükselt', tamamlandi: false },
      { id: 2, metin: 'AFAD direkt koordinasyon hattı SLA güncellemesi', tamamlandi: false },
      { id: 3, metin: 'Gece tatbikatı planla (Nisan 2026)', tamamlandi: false },
      { id: 4, metin: 'Yakın tesis yöneticisi listesini OMNI\'ye kaydet', tamamlandi: true  },
      { id: 5, metin: 'Rüzgar sensörü temin ve kurulum — Q2 2026', tamamlandi: false },
    ],
  },
  {
    id: 'olay-002',
    baslik: 'Kavaklı Sel Erken Uyarı Testi',
    tarih: '12 Şubat 2026',
    tur: 'Sel / Taşkın',
    durum: 'Kapalı',
    ozet: 'Kavaklı mahallesi dere yatağı su seviyesi artışı senaryosu. Meteoroloji API entegrasyonu, siren sistemi ve tahliye güzergahları test edildi. İBB altyapı ekibiyle ortak çalıştırıldı.',
    ekleGorev: [
      'Kavaklı Deresi anlık seviye sensörü entegrasyonu',
      'Meteoroloji API otomatik eşik uyarısı kurulumu',
      'Tahliye yönlendirme tabelaları — 12 kavşak',
    ],
    silGorev: [
      'Manuel gözlemci nöbeti (sensör sistemi devreye alındı)',
      'Kağıt tabanlı tahliye listesi (dijitale geçildi)',
    ],
    uzunSuren: [
      'Siren aktivasyonu — hedef 3 dk, gerçekleşen 7 dk',
    ],
    tamamlanamayan: [
      'Engelli bireylere yönelik tahliye senaryosu test edilmedi',
    ],
    basarilar: [
      'Meteoroloji API entegrasyonu başarıyla çalıştı',
      'Tahliye güzergahı kılavuzu tüm gönüllülere ulaştı',
      'İBB–Beylikdüzü koordinasyon protokolü imzalandı',
    ],
    basarisizliklar: [
      'Siren sistemi batarya yedekleme arızası tespit edildi',
      'Engelsiz erişim güzergahları tatbikata dahil edilmedi',
    ],
    aksiyonlar: [
      { id: 1, metin: 'Siren batarya yedeklemesini değiştir (Mart 2026)', tamamlandi: true  },
      { id: 2, metin: 'Engelli tahliye senaryosu protokolü hazırla',       tamamlandi: false },
      { id: 3, metin: 'Kavaklı Deresi sensör verisi OMNI haritasına ekle', tamamlandi: true  },
      { id: 4, metin: 'Tahliye tabelaları kurulumunu tamamla',             tamamlandi: false },
    ],
  },
  {
    id: 'olay-003',
    baslik: 'Belediye BT Sistemi Kesinti Simülasyonu',
    tarih: '20 Ocak 2026',
    tur: 'BT / Siber',
    durum: 'İzleniyor',
    ozet: 'Belediye BETS (Belediye Elektronik Takip Sistemi) planlı kesinti simülasyonu. RTO/RPO hedeflerine uyum test edildi. Yedek sistem devreye alındı, manuel süreçler aktive edildi.',
    ekleGorev: [
      'Yedek sistem otomatik devreye alma prosedürü',
      'BT kesinti bildirim zinciri (IT → Müdür → Başkanlık)',
      'Kritik hizmetler offline çalışma kılavuzu',
    ],
    silGorev: [
      'Eski VPN kesinti protokolü (yeni mimari ile uyumsuz)',
    ],
    uzunSuren: [
      'Yedek sistem devreye alma — hedef 4s RTO, gerçekleşen 6.5s',
      'Veri senkronizasyonu — hedef 1s RPO, gerçekleşen 3s',
    ],
    tamamlanamayan: [
      'Mobil uygulama offline mod testi tamamlanamadı',
      'Tedarikçi SLA doğrulaması raporlanmadı',
    ],
    basarilar: [
      'Kritik mali hizmetler kesintisiz devam etti (offline mod)',
      'BT ekibi koordinasyonu beklentinin üzerinde performans gösterdi',
      'Yedekleme prosedür kılavuzu güncellendi',
    ],
    basarisizliklar: [
      'RTO hedefi %62 aşıldı — yedek sistem aktivasyonu yavaş kaldı',
      'RPO hedefi 3x aşıldı — veri senkronizasyon gecikmesi',
      'Tedarikçi destek hattı ilk 2 saatte ulaşılamadı',
    ],
    aksiyonlar: [
      { id: 1, metin: 'Yedek sistem aktivasyon prosedürünü otomatikleştir',         tamamlandi: false },
      { id: 2, metin: 'Veri senkronizasyon altyapısını güçlendir',                  tamamlandi: false },
      { id: 3, metin: 'Tedarikçi SLA yeniden müzakeresi — 2 saatlik destek garantisi', tamamlandi: false },
      { id: 4, metin: 'Mobil offline mod testini Şubat 2026\'ya planla',             tamamlandi: true  },
      { id: 5, metin: 'BT kesinti bildirim zincirini OMNI\'ye kaydet',               tamamlandi: true  },
      { id: 6, metin: 'RTO/RPO hedeflerini gözden geçir — revize et',               tamamlandi: false },
    ],
  },
]

const DURUM_STYLE: Record<OlayDurum, { color: string; bg: string; border: string; dot: string }> = {
  'Kapalı':    { color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB', dot: '#9CA3AF' },
  'Aktif':     { color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5', dot: '#EF4444' },
  'İzleniyor': { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D', dot: '#F59E0B' },
}

const TUR_STYLE: Record<string, { color: string; bg: string }> = {
  'Yangın / NATECH': { color: '#EA580C', bg: '#FFF7ED' },
  'Sel / Taşkın':    { color: '#2563EB', bg: '#EFF6FF' },
  'BT / Siber':      { color: '#7C3AED', bg: '#F5F3FF' },
}

function Akordeon({ baslik, renk, items }: { baslik: string; renk: string; items: string[] }) {
  const [ac, setAc] = useState(false)
  return (
    <div style={{ border: `1px solid ${renk}30`, borderRadius: 8, overflow: 'hidden' }}>
      <button onClick={() => setAc(!ac)}
        className="w-full text-left flex items-center justify-between px-4 py-3 hover:opacity-90 transition-opacity"
        style={{ background: renk + '10' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: renk }}>{baslik}</span>
        <span style={{ fontSize: 10, color: renk, transform: ac ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform .2s' }}>▼</span>
      </button>
      {ac && (
        <div style={{ background: '#FAFAFA', borderTop: `1px solid ${renk}20` }}>
          {items.length === 0
            ? <p style={{ fontSize: 12, color: '#9CA3AF', padding: '10px 16px' }}>Kayıt yok.</p>
            : items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 16px', borderBottom: i < items.length-1 ? '1px solid #F3F4F6' : 'none' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: renk, flexShrink: 0, marginTop: 5 }}/>
                  <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))
          }
        </div>
      )}
    </div>
  )
}

export default function OmniCrisisPage() {
  const [secilenId, setSecilenId] = useState<string | null>(OLAYLAR[0].id)
  const [aksiyonlar, setAksiyonlar] = useState<Record<string, Aksiyon[]>>(
    Object.fromEntries(OLAYLAR.map(o => [o.id, o.aksiyonlar.map(a => ({ ...a }))]))
  )

  const olay = OLAYLAR.find(o => o.id === secilenId) ?? null

  const toggleAksiyon = (olayId: string, aksiyonId: number) => {
    setAksiyonlar(prev => ({
      ...prev,
      [olayId]: prev[olayId].map(a => a.id === aksiyonId ? { ...a, tamamlandi: !a.tamamlandi } : a),
    }))
  }

  const mevcutAksiyonlar = olay ? aksiyonlar[olay.id] ?? [] : []
  const tamamlanan = mevcutAksiyonlar.filter(a => a.tamamlandi).length

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: '#0A1628' }} className="px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div style={{ background: 'rgba(139,92,246,.15)', border: '1px solid rgba(139,92,246,.3)' }} className="p-2.5 rounded-xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">omniCRISIS</h1>
              <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                Kriz Yönetimi · Post-Mortem Raporlama · Beylikdüzü Belediyesi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
               style={{ background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.2)', color: '#C4B5FD' }}>
            {OLAYLAR.filter(o => o.durum === 'Aktif').length} Aktif Olay · {OLAYLAR.filter(o => o.durum === 'İzleniyor').length} İzleniyor
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

          {/* OLAY LİSTESİ */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Olaylar</h2>
            {OLAYLAR.map(o => {
              const ds = DURUM_STYLE[o.durum]
              const ts = TUR_STYLE[o.tur] ?? { color: '#6B7280', bg: '#F3F4F6' }
              const aktif = secilenId === o.id
              return (
                <button key={o.id} onClick={() => setSecilenId(o.id)}
                  className="w-full text-left bg-white rounded-xl border shadow-sm p-4 transition-all hover:shadow-md"
                  style={{ borderColor: aktif ? '#8B5CF6' : '#E5E7EB', outline: aktif ? '2px solid #8B5CF620' : 'none' }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900 leading-snug">{o.baslik}</span>
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border flex-shrink-0"
                          style={{ color: ds.color, background: ds.bg, borderColor: ds.border }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: ds.dot }}/>
                      {o.durum}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: ts.color, background: ts.bg }}>
                      {o.tur}
                    </span>
                    <span className="text-xs text-gray-400">{o.tarih}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* POST-MORTEM FORMU */}
          {olay ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                {/* Olay başlık */}
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h2 className="text-lg font-bold text-gray-900">{olay.baslik}</h2>
                  <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border flex-shrink-0"
                        style={{ color: DURUM_STYLE[olay.durum].color, background: DURUM_STYLE[olay.durum].bg, borderColor: DURUM_STYLE[olay.durum].border }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: DURUM_STYLE[olay.durum].dot }}/>
                    {olay.durum}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ color: (TUR_STYLE[olay.tur] ?? {color:'#6B7280'}).color, background: (TUR_STYLE[olay.tur] ?? {bg:'#F3F4F6'}).bg }}>
                    {olay.tur}
                  </span>
                  <span className="text-xs text-gray-400">{olay.tarih}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{olay.ozet}</p>
              </div>

              {/* ISSUES & ANOMALIES */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span style={{ color: '#F59E0B' }}>⚠</span> Issues &amp; Anomaliler
                </h3>
                <div className="space-y-3">
                  <Akordeon baslik="Olayda Eklenen Görevler"     renk="#10B981" items={olay.ekleGorev}      />
                  <Akordeon baslik="Silinen Görevler"             renk="#6B7280" items={olay.silGorev}       />
                  <Akordeon baslik="Beklenenden Uzun Süren"       renk="#F97316" items={olay.uzunSuren}      />
                  <Akordeon baslik="Tamamlanamayan Görevler"      renk="#EF4444" items={olay.tamamlanamayan} />
                </div>
              </div>

              {/* BAŞARILAR & BAŞARISIZLIKLAR */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-green-200 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <span>✓</span> Başarılar — Ne İyi Gitti
                  </h3>
                  <div className="space-y-2">
                    {olay.basarilar.map((b, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5"/>
                        <span className="text-sm text-gray-700 leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-red-200 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <span>✗</span> Başarısızlıklar — Ne Yanlış Gitti
                  </h3>
                  <div className="space-y-2">
                    {olay.basarisizliklar.map((b, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5"/>
                        <span className="text-sm text-gray-700 leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AKSİYON KALEMLERİ */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span style={{ color: '#3B82F6' }}>→</span> Aksiyon Kalemleri
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">
                    {tamamlanan} / {mevcutAksiyonlar.length} tamamlandı
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full bg-blue-500 transition-all"
                         style={{ width: `${mevcutAksiyonlar.length ? (tamamlanan / mevcutAksiyonlar.length) * 100 : 0}%` }}/>
                  </div>
                </div>
                <div className="space-y-2">
                  {mevcutAksiyonlar.map(a => (
                    <button key={a.id} onClick={() => toggleAksiyon(olay.id, a.id)}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-gray-50"
                      style={{ borderColor: a.tamamlandi ? '#6EE7B7' : '#E5E7EB', background: a.tamamlandi ? '#F0FDF4' : 'white' }}>
                      <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                           style={{ borderColor: a.tamamlandi ? '#10B981' : '#D1D5DB', background: a.tamamlandi ? '#10B981' : 'white' }}>
                        {a.tamamlandi && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700" style={{ textDecoration: a.tamamlandi ? 'line-through' : 'none', opacity: a.tamamlandi ? 0.6 : 1 }}>
                        {a.metin}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center" style={{ minHeight: 300 }}>
              <p className="text-sm text-gray-400">Soldan bir olay seçin.</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-300">omniCRISIS · Kriz Yönetim Modülü · OMNI Resilience Platform</p>
          <p className="text-xs text-gray-300">Beylikdüzü Belediyesi · 2026</p>
        </div>
      </div>
    </div>
  )
}
