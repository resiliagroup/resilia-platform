'use client'
import { useState } from 'react'

type Kritiklik = 'Kritik' | 'Önemli' | 'Destekleyici'
type BIADurum  = 'Tamamlandı' | 'Güncelleme Gerekli' | 'Hiç Test Edilmedi'
type PlanDurum = 'Onaylı' | 'Taslak' | 'Yok'

interface KritikFonksiyon {
  id: number
  fonksiyon: string
  tip: 'Departman' | 'Süreç' | 'Uygulama'
  sorumlu: string
  kritiklik: Kritiklik
  mtd: string
  rto: string
  rpo: string
  biaDurum: BIADurum
  planDurum: PlanDurum
  sonTest: string
}

const FONKSIYONLAR: KritikFonksiyon[] = [
  { id:  1, fonksiyon: 'Acil Yardım Hattı (112)',           tip: 'Departman',  sorumlu: 'İtfaiye Müd.',         kritiklik: 'Kritik',       mtd: '1s',   rto: '15dk',  rpo: '0dk',  biaDurum: 'Tamamlandı',          planDurum: 'Onaylı',  sonTest: '10 Mar 2026' },
  { id:  2, fonksiyon: 'İçme Suyu Dağıtımı',                tip: 'Süreç',      sorumlu: 'Su İşleri',             kritiklik: 'Kritik',       mtd: '4s',   rto: '2s',    rpo: '1s',   biaDurum: 'Tamamlandı',          planDurum: 'Onaylı',  sonTest: '15 Şub 2026' },
  { id:  3, fonksiyon: 'Elektrik Kesintisi Müdahale',        tip: 'Süreç',      sorumlu: 'Fen İşleri',            kritiklik: 'Kritik',       mtd: '2s',   rto: '30dk',  rpo: '0dk',  biaDurum: 'Tamamlandı',          planDurum: 'Onaylı',  sonTest: '20 Oca 2026' },
  { id:  4, fonksiyon: 'Belediye Bilgi Sistemi (BETS)',      tip: 'Uygulama',   sorumlu: 'BT Müdürlüğü',          kritiklik: 'Kritik',       mtd: '8s',   rto: '4s',    rpo: '1s',   biaDurum: 'Güncelleme Gerekli',  planDurum: 'Taslak',  sonTest: '05 Kas 2025' },
  { id:  5, fonksiyon: 'Nüfus Kayıt Hizmetleri',            tip: 'Süreç',      sorumlu: 'Yazı İşleri',           kritiklik: 'Önemli',       mtd: '24s',  rto: '8s',    rpo: '4s',   biaDurum: 'Güncelleme Gerekli',  planDurum: 'Taslak',  sonTest: '12 Eki 2025' },
  { id:  6, fonksiyon: 'İmar & Yapı Ruhsatı',                tip: 'Süreç',      sorumlu: 'İmar Müd.',             kritiklik: 'Önemli',       mtd: '48s',  rto: '24s',   rpo: '8s',   biaDurum: 'Hiç Test Edilmedi',   planDurum: 'Yok',     sonTest: '—' },
  { id:  7, fonksiyon: 'Temizlik & Atık Toplama',            tip: 'Departman',  sorumlu: 'Temizlik İşleri',       kritiklik: 'Önemli',       mtd: '24s',  rto: '12s',   rpo: '4s',   biaDurum: 'Tamamlandı',          planDurum: 'Onaylı',  sonTest: '28 Şub 2026' },
  { id:  8, fonksiyon: 'Ulaşım & Toplu Taşıma Koordinasyon',tip: 'Süreç',      sorumlu: 'Ulaşım Müd.',           kritiklik: 'Önemli',       mtd: '8s',   rto: '4s',    rpo: '2s',   biaDurum: 'Güncelleme Gerekli',  planDurum: 'Taslak',  sonTest: '18 Ara 2025' },
  { id:  9, fonksiyon: 'NEFES Gönüllü Koordinasyon',         tip: 'Departman',  sorumlu: 'Sivil Savunma',         kritiklik: 'Kritik',       mtd: '1s',   rto: '30dk',  rpo: '0dk',  biaDurum: 'Tamamlandı',          planDurum: 'Onaylı',  sonTest: '15 Mar 2026' },
  { id: 10, fonksiyon: 'Mali Muhasebe & Ödeme',              tip: 'Uygulama',   sorumlu: 'Mali Hizmetler',        kritiklik: 'Önemli',       mtd: '48s',  rto: '24s',   rpo: '4s',   biaDurum: 'Güncelleme Gerekli',  planDurum: 'Taslak',  sonTest: '22 Eki 2025' },
  { id: 11, fonksiyon: 'Afet Erken Uyarı Sistemi',           tip: 'Uygulama',   sorumlu: 'Afet İşleri',           kritiklik: 'Kritik',       mtd: '30dk', rto: '10dk',  rpo: '0dk',  biaDurum: 'Tamamlandı',          planDurum: 'Onaylı',  sonTest: '01 Mar 2026' },
  { id: 12, fonksiyon: 'Sosyal Yardım Hizmetleri',           tip: 'Süreç',      sorumlu: 'Sosyal Hizm.',          kritiklik: 'Önemli',       mtd: '72s',  rto: '24s',   rpo: '8s',   biaDurum: 'Hiç Test Edilmedi',   planDurum: 'Yok',     sonTest: '—' },
  { id: 13, fonksiyon: 'Kamu Sağlığı İzleme',                tip: 'Süreç',      sorumlu: 'Sağlık İşleri',         kritiklik: 'Kritik',       mtd: '4s',   rto: '2s',    rpo: '1s',   biaDurum: 'Güncelleme Gerekli',  planDurum: 'Taslak',  sonTest: '30 Oca 2026' },
  { id: 14, fonksiyon: 'Park & Yeşil Alan Bakım',            tip: 'Departman',  sorumlu: 'Park ve Bahçeler',      kritiklik: 'Destekleyici', mtd: '168s', rto: '72s',   rpo: '24s',  biaDurum: 'Hiç Test Edilmedi',   planDurum: 'Yok',     sonTest: '—' },
  { id: 15, fonksiyon: 'Kentsel Dönüşüm Proje Yönetimi',     tip: 'Süreç',      sorumlu: 'İmar Müd.',             kritiklik: 'Önemli',       mtd: '96s',  rto: '48s',   rpo: '24s',  biaDurum: 'Hiç Test Edilmedi',   planDurum: 'Yok',     sonTest: '—' },
  { id: 16, fonksiyon: 'NATECH Saha Müdahale Koordinasyonu', tip: 'Süreç',      sorumlu: 'İtfaiye & AFAD',        kritiklik: 'Kritik',       mtd: '1s',   rto: '20dk',  rpo: '0dk',  biaDurum: 'Tamamlandı',          planDurum: 'Onaylı',  sonTest: '10 Mar 2026' },
  { id: 17, fonksiyon: 'Taşkın & Sel Müdahale Sistemi',      tip: 'Süreç',      sorumlu: 'Fen İşleri',            kritiklik: 'Kritik',       mtd: '2s',   rto: '1s',    rpo: '0dk',  biaDurum: 'Tamamlandı',          planDurum: 'Onaylı',  sonTest: '05 Mar 2026' },
  { id: 18, fonksiyon: 'E-Belediye Portalı',                  tip: 'Uygulama',   sorumlu: 'BT Müdürlüğü',          kritiklik: 'Önemli',       mtd: '24s',  rto: '8s',    rpo: '2s',   biaDurum: 'Güncelleme Gerekli',  planDurum: 'Taslak',  sonTest: '08 Ara 2025' },
  { id: 19, fonksiyon: 'Mezarlık & Cenaze Hizmetleri',        tip: 'Departman',  sorumlu: 'Zabıta',                kritiklik: 'Önemli',       mtd: '12s',  rto: '4s',    rpo: '2s',   biaDurum: 'Hiç Test Edilmedi',   planDurum: 'Yok',     sonTest: '—' },
  { id: 20, fonksiyon: 'Liman & Sahil Güvenlik İzleme',       tip: 'Süreç',      sorumlu: 'Çevre Müd.',            kritiklik: 'Destekleyici', mtd: '48s',  rto: '24s',   rpo: '8s',   biaDurum: 'Hiç Test Edilmedi',   planDurum: 'Yok',     sonTest: '—' },
]

const KRITIKLIK_STYLE: Record<Kritiklik, { color: string; bg: string; border: string }> = {
  'Kritik':       { color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5' },
  'Önemli':       { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
  'Destekleyici': { color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' },
}

const BIA_STYLE: Record<BIADurum, { color: string; bg: string; border: string; dot: string }> = {
  'Tamamlandı':         { color: '#059669', bg: '#D1FAE5', border: '#6EE7B7', dot: '#10B981' },
  'Güncelleme Gerekli': { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D', dot: '#F59E0B' },
  'Hiç Test Edilmedi':  { color: '#374151', bg: '#F3F4F6', border: '#D1D5DB', dot: '#6B7280' },
}

const PLAN_STYLE: Record<PlanDurum, { color: string; bg: string; border: string }> = {
  'Onaylı': { color: '#1D4ED8', bg: '#DBEAFE', border: '#93C5FD' },
  'Taslak': { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
  'Yok':    { color: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB' },
}

export default function OmniPlanPage() {
  const [filtre, setFiltre] = useState<Kritiklik | 'hepsi'>('hepsi')
  const [aramaQ, setAramaQ] = useState('')

  const filtered = FONKSIYONLAR.filter(f =>
    (filtre === 'hepsi' || f.kritiklik === filtre) &&
    (aramaQ === '' || f.fonksiyon.toLowerCase().includes(aramaQ.toLowerCase()) || f.sorumlu.toLowerCase().includes(aramaQ.toLowerCase()))
  )

  const ozet = {
    toplam:   FONKSIYONLAR.length,
    kritik:   FONKSIYONLAR.filter(f => f.kritiklik === 'Kritik').length,
    onaylı:   FONKSIYONLAR.filter(f => f.planDurum === 'Onaylı').length,
    hiçTest:  FONKSIYONLAR.filter(f => f.biaDurum === 'Hiç Test Edilmedi').length,
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: '#0A1628' }} className="px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div style={{ background: 'rgba(59,130,246,.15)', border: '1px solid rgba(59,130,246,.3)' }} className="p-2.5 rounded-xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">omniPLAN</h1>
              <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                İş Sürekliliği & Felaket Kurtarma · RTO / RPO Takibi · Beylikdüzü Belediyesi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
               style={{ background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', color: '#93C5FD' }}>
            ISO 22301 · BCM Çerçevesi
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { lbl: 'Toplam Fonksiyon', val: ozet.toplam, renk: '#3B82F6', sub: 'Kritik fonksiyon sayısı' },
            { lbl: 'Kritik',            val: ozet.kritik, renk: '#EF4444', sub: 'Kritik öncelik'          },
            { lbl: 'Onaylı Plan',        val: ozet.onaylı,  renk: '#10B981', sub: 'BCP planı onaylı'     },
            { lbl: 'Hiç Test Edilmedi',  val: ozet.hiçTest, renk: '#6B7280', sub: 'Test bekleniyor'      },
          ].map(k => (
            <div key={k.lbl} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{k.lbl}</p>
              <p className="text-3xl font-bold font-mono mt-1" style={{ color: k.renk }}>{k.val}</p>
              <p className="text-xs text-gray-400 mt-2">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <input type="text" placeholder="Fonksiyon veya sorumlu ara…" value={aramaQ}
              onChange={e => setAramaQ(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-300 flex-1 min-w-[180px]"/>
            <div className="flex gap-2 flex-wrap">
              {(['hepsi', 'Kritik', 'Önemli', 'Destekleyici'] as const).map(k => {
                const a = filtre === k
                const s = k !== 'hepsi' ? KRITIKLIK_STYLE[k] : null
                return (
                  <button key={k} onClick={() => setFiltre(k)}
                    className="text-xs px-3 py-1 rounded-full border transition-all font-medium"
                    style={a && s ? { background: s.bg, color: s.color, borderColor: s.border } :
                           a ? { background: '#F1F5F9', color: '#0A1628', borderColor: '#CBD5E1' } :
                           { background: 'transparent', color: '#9CA3AF', borderColor: '#E5E7EB' }}>
                    {k === 'hepsi' ? 'Tümü' : k}
                  </button>
                )
              })}
            </div>
            <span className="text-xs text-gray-400 ml-auto">{filtered.length} fonksiyon</span>
          </div>

          {/* TABLE HEADER */}
          <div className="hidden xl:grid px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-50"
               style={{ gridTemplateColumns: '2.5fr 0.7fr 1fr 0.8fr 0.5fr 0.5fr 0.5fr 1fr 0.8fr 0.9fr' }}>
            <span>Kritik Fonksiyon</span>
            <span>Tip</span>
            <span>Sorumlu</span>
            <span>Kritiklik</span>
            <span>MTD</span>
            <span>RTO</span>
            <span>RPO</span>
            <span>BIA Durumu</span>
            <span>Plan</span>
            <span>Son Test</span>
          </div>

          {/* ROWS */}
          <div className="divide-y divide-gray-50">
            {filtered.map(f => {
              const ks = KRITIKLIK_STYLE[f.kritiklik]
              const bs = BIA_STYLE[f.biaDurum]
              const ps = PLAN_STYLE[f.planDurum]
              return (
                <div key={f.id}
                  className="grid xl:grid-cols-[2.5fr_0.7fr_1fr_0.8fr_0.5fr_0.5fr_0.5fr_1fr_0.8fr_0.9fr] items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-300 w-5 flex-shrink-0">{f.id}</span>
                    <span className="font-medium text-gray-900 text-xs">{f.fonksiyon}</span>
                  </div>
                  <span className="text-xs text-gray-500">{f.tip}</span>
                  <span className="text-xs text-gray-600">{f.sorumlu}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border w-fit"
                        style={{ color: ks.color, background: ks.bg, borderColor: ks.border }}>
                    {f.kritiklik}
                  </span>
                  <span className="text-xs font-mono text-gray-700 font-semibold">{f.mtd}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: '#3B82F6' }}>{f.rto}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: '#8B5CF6' }}>{f.rpo}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: bs.dot }}/>
                    <span className="text-xs px-2 py-0.5 rounded-full border"
                          style={{ color: bs.color, background: bs.bg, borderColor: bs.border }}>
                      {f.biaDurum}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full border w-fit"
                        style={{ color: ps.color, background: ps.bg, borderColor: ps.border }}>
                    {f.planDurum}
                  </span>
                  <span className="text-xs font-mono text-gray-500">{f.sonTest}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* LEGEND */}
        <div className="mt-4 flex flex-wrap gap-6 text-xs text-gray-400">
          <div><span className="font-semibold text-gray-600">MTD</span> — Maksimum Tolere Edilebilir Kesilme Süresi</div>
          <div><span className="font-semibold text-gray-600">RTO</span> — Recovery Time Objective · Kurtarma Süresi Hedefi</div>
          <div><span className="font-semibold text-gray-600">RPO</span> — Recovery Point Objective · Kurtarma Noktası Hedefi</div>
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-300">omniPLAN · ISO 22301 BCM Çerçevesi · OMNI Resilience Platform</p>
          <p className="text-xs text-gray-300">Beylikdüzü Belediyesi · 2026</p>
        </div>
      </div>
    </div>
  )
}
