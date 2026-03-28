'use client'
import { useState, useEffect, useRef } from 'react'

const NAVY = '#0A1628'
const TEAL = '#009B8D'
const RED = '#EF4444'
const AMBER = '#F59E0B'
const GREEN = '#22C55E'
const BLUE = '#2563EB'
const BORDER = '#E2E8F0'

// ─── Tipler ────────────────────────────────────────────────────────────────

type BorHattiDurum = 'çalışıyor' | 'bekliyor' | 'hata' | 'durduruldu' | 'uyarı'
type VeriKaynagi = 'Core Banking' | 'SWIFT' | 'HR Sistemi' | 'Tesis Sensörleri' | 'Piyasa Verisi' | 'BDDK Raporlama' | 'Müşteri Verisi' | 'Coğrafi Veri'

interface BorHatti {
  id: string
  ad: string
  kaynak: VeriKaynagi
  hedef: string
  durum: BorHattiDurum
  son_calisma: string
  sonraki_calisma: string
  kayit_sayisi: number
  hata_sayisi: number
  sure_ms: number
  zamanlamа: string  // cron-benzeri açıklama
  veri_kalitesi: number  // 0-100
  aktif: boolean
}

interface PipeLog {
  id: string
  bor_id: string
  bor_adi: string
  zaman: string
  seviye: 'bilgi' | 'uyarı' | 'hata' | 'basari'
  mesaj: string
}

// ─── Örnek Veri ─────────────────────────────────────────────────────────────

const ORNEK_BORLAR: BorHatti[] = [
  {
    id: 'p1', ad: 'Core Banking → Risk Engine', kaynak: 'Core Banking', hedef: 'Omniversel Risk Engine',
    durum: 'çalışıyor', son_calisma: '2025-03-22 08:00', sonraki_calisma: '2025-03-22 09:00',
    kayit_sayisi: 14523, hata_sayisi: 0, sure_ms: 1240, zamanlamа: 'Saatte bir',
    veri_kalitesi: 99, aktif: true,
  },
  {
    id: 'p2', ad: 'SWIFT Mesajları → BIA', kaynak: 'SWIFT', hedef: 'omniIMPACT BIA',
    durum: 'uyarı', son_calisma: '2025-03-22 07:45', sonraki_calisma: '2025-03-22 08:45',
    kayit_sayisi: 892, hata_sayisi: 3, sure_ms: 3870, zamanlamа: 'Saatte bir',
    veri_kalitesi: 87, aktif: true,
  },
  {
    id: 'p3', ad: 'HR Sistemi → Personel Bağımlılıkları', kaynak: 'HR Sistemi', hedef: 'omniIMPACT Süreç',
    durum: 'çalışıyor', son_calisma: '2025-03-22 06:00', sonraki_calisma: '2025-03-23 06:00',
    kayit_sayisi: 2341, hata_sayisi: 0, sure_ms: 540, zamanlamа: 'Günlük 06:00',
    veri_kalitesi: 100, aktif: true,
  },
  {
    id: 'p4', ad: 'Tesis Sensörleri → Fiziksel Risk', kaynak: 'Tesis Sensörleri', hedef: 'omniRISK Tesis',
    durum: 'hata', son_calisma: '2025-03-22 05:30', sonraki_calisma: '2025-03-22 08:30',
    kayit_sayisi: 0, hata_sayisi: 1, sure_ms: 0, zamanlamа: 'Her 30 dakika',
    veri_kalitesi: 0, aktif: true,
  },
  {
    id: 'p5', ad: 'Piyasa Verisi → Piyasa Riski', kaynak: 'Piyasa Verisi', hedef: 'omniQRA Modeli',
    durum: 'çalışıyor', son_calisma: '2025-03-22 07:55', sonraki_calisma: '2025-03-22 08:10',
    kayit_sayisi: 48000, hata_sayisi: 0, sure_ms: 890, zamanlamа: 'Her 15 dakika',
    veri_kalitesi: 98, aktif: true,
  },
  {
    id: 'p6', ad: 'BDDK Raporlama → Uyum Skoru', kaynak: 'BDDK Raporlama', hedef: 'omniAUDIT',
    durum: 'durduruldu', son_calisma: '2025-03-20 09:00', sonraki_calisma: '—',
    kayit_sayisi: 0, hata_sayisi: 0, sure_ms: 0, zamanlamа: 'Haftalık Pazartesi',
    veri_kalitesi: 0, aktif: false,
  },
  {
    id: 'p7', ad: 'Müşteri Verisi → Segment Analizi', kaynak: 'Müşteri Verisi', hedef: 'Analitik Platformu',
    durum: 'bekliyor', son_calisma: '2025-03-22 00:00', sonraki_calisma: '2025-03-23 00:00',
    kayit_sayisi: 0, hata_sayisi: 0, sure_ms: 0, zamanlamа: 'Gece 00:00',
    veri_kalitesi: 95, aktif: true,
  },
]

const ORNEK_LOGLAR: PipeLog[] = [
  { id: 'l1', bor_id: 'p1', bor_adi: 'Core Banking → Risk Engine', zaman: '08:01:04', seviye: 'basari', mesaj: '14,523 kayıt başarıyla aktarıldı. Süre: 1.24s' },
  { id: 'l2', bor_id: 'p2', bor_adi: 'SWIFT Mesajları → BIA', zaman: '07:46:12', seviye: 'uyarı', mesaj: '3 kayıtta eksik alan tespit edildi: TRN kodu boş. Atlanan kayıtlar: MT103-2024-0089, MT103-2024-0090, MT103-2024-0091' },
  { id: 'l3', bor_id: 'p4', bor_adi: 'Tesis Sensörleri → Fiziksel Risk', zaman: '05:31:22', seviye: 'hata', mesaj: 'Bağlantı zaman aşımı: 192.168.10.45:8883 (MQTT Broker). Yeniden deneme sayısı: 3. Pipeline durduruldu.' },
  { id: 'l4', bor_id: 'p5', bor_adi: 'Piyasa Verisi → omniQRA', zaman: '07:55:08', seviye: 'basari', mesaj: '48,000 fiyat verisi aktarıldı. VIX: 18.4 · BIST100: 9,841.2' },
  { id: 'l5', bor_id: 'p3', bor_adi: 'HR Sistemi → Personel', zaman: '06:01:33', seviye: 'bilgi', mesaj: 'Personel güncelleme: 2,341 çalışan kaydı senkronize edildi. Değişen: 12' },
  { id: 'l6', bor_id: 'p2', bor_adi: 'SWIFT Mesajları → BIA', zaman: '06:46:08', seviye: 'basari', mesaj: '889 kayıt aktarıldı (3 atlandı). Gecikme: 3.87s — normal eşiğin üzerinde.' },
]

// ─── Yardımcı ───────────────────────────────────────────────────────────────

function durumRenk(d: BorHattiDurum) {
  if (d === 'çalışıyor') return GREEN
  if (d === 'bekliyor') return AMBER
  if (d === 'hata') return RED
  if (d === 'durduruldu') return '#94A3B8'
  return '#F59E0B'  // uyarı
}

function logRenk(s: PipeLog['seviye']) {
  if (s === 'basari') return GREEN
  if (s === 'bilgi') return BLUE
  if (s === 'uyarı') return AMBER
  return RED
}

function logIkon(s: PipeLog['seviye']) {
  if (s === 'basari') return '✓'
  if (s === 'bilgi') return 'ℹ'
  if (s === 'uyarı') return '⚠'
  return '✕'
}

function kaliteRenk(k: number) {
  if (k >= 95) return GREEN
  if (k >= 80) return TEAL
  if (k >= 60) return AMBER
  return RED
}

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────

export default function OmniPipePage() {
  const [aktifSekme, setAktifSekme] = useState<'panel' | 'loglar' | 'kalite' | 'yapilandirma'>('panel')
  const [borlar, setBorlar] = useState<BorHatti[]>(ORNEK_BORLAR)
  const [loglar, setLoglar] = useState<PipeLog[]>(ORNEK_LOGLAR)
  const [otoCanlilama, setOtoCanlilama] = useState(true)
  const [saniyelik, setSaniyelik] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [filtreDurum, setFiltreDurum] = useState<string>('tümü')
  const [seciliBor, setSeciliBor] = useState<string | null>(null)

  // Simüle canlı güncelleme
  useEffect(() => {
    if (!otoCanlilama) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setSaniyelik(s => {
        const yeni = s + 1
        // Her 10 saniyede bir küçük bir log ekle (simülasyon)
        if (yeni % 10 === 0) {
          setLoglar(prev => [{
            id: `sim-${yeni}`,
            bor_id: 'p1',
            bor_adi: 'Core Banking → Risk Engine',
            zaman: new Date().toLocaleTimeString('tr-TR'),
            seviye: 'bilgi' as const,
            mesaj: `Canlı veri akışı aktif. Sıradaki tam çalışma: ${Math.floor(Math.random() * 55 + 5)} dakika sonra.`,
          }, ...prev].slice(0, 50))
        }
        return yeni
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [otoCanlilama])

  function borDurumGuncelle(id: string, durum: BorHattiDurum) {
    setBorlar(p => p.map(b => b.id === id ? { ...b, durum, aktif: durum !== 'durduruldu' } : b))
    setLoglar(prev => [{
      id: `log-${Date.now()}`,
      bor_id: id,
      bor_adi: borlar.find(b => b.id === id)?.ad ?? '',
      zaman: new Date().toLocaleTimeString('tr-TR'),
      seviye: (durum === 'hata' ? 'hata' : durum === 'çalışıyor' ? 'basari' : 'bilgi') as PipeLog['seviye'],
      mesaj: `Pipeline durumu değiştirildi: ${durum}`,
    }, ...prev].slice(0, 50))
  }

  const filtrelenmis = borlar.filter(b => filtreDurum === 'tümü' || b.durum === filtreDurum)
  const hataliBorlar = borlar.filter(b => b.durum === 'hata').length
  const uyariliBorlar = borlar.filter(b => b.durum === 'uyarı').length
  const aktifBorlar = borlar.filter(b => b.durum === 'çalışıyor').length
  const toplamKayit = borlar.reduce((a, b) => a + b.kayit_sayisi, 0)
  const secili = seciliBor ? borlar.find(b => b.id === seciliBor) : null

  // ─── Render ──────────────────────────────────────────────────────────────

  const sekmeStyle = (aktif: boolean) => ({
    padding: '10px 20px', background: aktif ? NAVY : 'transparent',
    color: aktif ? 'white' : '#64748B', border: 'none', borderRadius: 8,
    fontSize: 13, fontWeight: aktif ? 700 : 500, cursor: 'pointer',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Üst Bar */}
      <div style={{ background: NAVY, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>omniPIPE <span style={{ fontSize: 11, background: TEAL, color: 'white', padding: '2px 8px', borderRadius: 20, fontWeight: 600, marginLeft: 6 }}>PILOT</span></div>
          <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>Veri Boru Hattı İzleme · Veri Kalitesi · Gerçek Zamanlı Log</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: otoCanlilama ? GREEN : '#94A3B8' }} />
            <span style={{ color: '#94A3B8', fontSize: 12 }}>{otoCanlilama ? 'Canlı' : 'Durduruldu'}</span>
          </div>
          <button onClick={() => setOtoCanlilama(v => !v)}
            style={{ padding: '7px 14px', background: otoCanlilama ? '#1E3A5F' : TEAL, color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            {otoCanlilama ? '⏸ Durdur' : '▶ Başlat'}
          </button>
        </div>
      </div>

      {/* KPI bandı */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '10px 32px', display: 'flex', gap: 32 }}>
        {[
          { label: 'Aktif Pipeline', val: aktifBorlar, renk: GREEN },
          { label: 'Hata', val: hataliBorlar, renk: hataliBorlar > 0 ? RED : '#94A3B8' },
          { label: 'Uyarı', val: uyariliBorlar, renk: uyariliBorlar > 0 ? AMBER : '#94A3B8' },
          { label: "Bugün'ün Kaydı", val: toplamKayit.toLocaleString('tr-TR'), renk: NAVY },
          { label: 'Ortalama Veri Kalitesi', val: `%${Math.round(borlar.filter(b => b.aktif).reduce((a, b) => a + b.veri_kalitesi, 0) / (borlar.filter(b => b.aktif).length || 1))}`, renk: TEAL },
        ].map(k => (
          <div key={k.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.renk, fontFamily: 'DM Mono,monospace' }}>{k.val}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{k.label}</div>
          </div>
        ))}
        {(hataliBorlar > 0 || uyariliBorlar > 0) && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: '#FFF7F7', border: '1px solid #FCA5A5', borderRadius: 8, padding: '4px 12px' }}>
            <span style={{ color: RED, fontSize: 12, fontWeight: 700 }}>⚠ {hataliBorlar + uyariliBorlar} pipeline dikkat gerektiriyor</span>
          </div>
        )}
      </div>

      {/* Sekmeler */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '8px 32px', display: 'flex', gap: 4 }}>
        {([
          ['panel', 'Pipeline Paneli'],
          ['loglar', `Canlı Log (${loglar.length})`],
          ['kalite', 'Veri Kalitesi'],
          ['yapilandirma', 'Yapılandırma'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setAktifSekme(key)} style={sekmeStyle(aktifSekme === key)}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '28px auto', padding: '0 24px' }}>

        {/* ── PANEL ───────────────────────────────────────────────────── */}
        {aktifSekme === 'panel' && (
          <div style={{ display: 'grid', gridTemplateColumns: secili ? '1fr 360px' : '1fr', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['tümü', 'çalışıyor', 'uyarı', 'hata', 'bekliyor', 'durduruldu'].map(d => (
                  <button key={d} onClick={() => setFiltreDurum(d)}
                    style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${filtreDurum === d ? NAVY : BORDER}`, background: filtreDurum === d ? NAVY : 'white', color: filtreDurum === d ? 'white' : '#64748B', fontSize: 12, cursor: 'pointer', fontWeight: filtreDurum === d ? 700 : 400 }}>
                    {d === 'tümü' ? 'Tümü' : d}
                  </button>
                ))}
              </div>

              {/* Pipeline kartları */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtrelenmis.map(b => (
                  <div key={b.id}
                    onClick={() => setSeciliBor(seciliBor === b.id ? null : b.id)}
                    style={{ background: 'white', border: `2px solid ${seciliBor === b.id ? TEAL : b.durum === 'hata' ? '#FCA5A5' : b.durum === 'uyarı' ? '#FDE68A' : BORDER}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'border-color .2s' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* Durum göstergesi */}
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: durumRenk(b.durum), flexShrink: 0, boxShadow: b.durum === 'çalışıyor' ? `0 0 0 3px ${GREEN}22` : 'none' }} />

                      {/* Bilgi */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{b.ad}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: durumRenk(b.durum), padding: '2px 8px', borderRadius: 20 }}>{b.durum}</span>
                          {b.hata_sayisi > 0 && <span style={{ fontSize: 11, background: '#FEE2E2', color: RED, padding: '2px 6px', borderRadius: 6, fontWeight: 600 }}>{b.hata_sayisi} hata</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#64748B' }}>
                          <span>📥 {b.kaynak}</span>
                          <span>📤 {b.hedef}</span>
                          <span>🕐 {b.zamanlamа}</span>
                          {b.kayit_sayisi > 0 && <span> {b.kayit_sayisi.toLocaleString('tr-TR')} kayıt</span>}
                        </div>
                      </div>

                      {/* Kalite çubuğu */}
                      <div style={{ textAlign: 'right', minWidth: 90 }}>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 3 }}>Veri Kalitesi</div>
                        <div style={{ background: '#F1F5F9', borderRadius: 99, height: 6, overflow: 'hidden', marginBottom: 3 }}>
                          <div style={{ background: kaliteRenk(b.veri_kalitesi), width: `${b.veri_kalitesi}%`, height: '100%', borderRadius: 99 }} />
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: kaliteRenk(b.veri_kalitesi), fontFamily: 'DM Mono,monospace' }}>%{b.veri_kalitesi}</div>
                      </div>

                      {/* Süre */}
                      {b.sure_ms > 0 && (
                        <div style={{ textAlign: 'right', minWidth: 70 }}>
                          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>Süre</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: b.sure_ms > 3000 ? AMBER : NAVY, fontFamily: 'DM Mono,monospace' }}>{(b.sure_ms / 1000).toFixed(2)}s</div>
                        </div>
                      )}
                    </div>

                    {/* Son/Sonraki çalışma */}
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 20, fontSize: 11, color: '#94A3B8' }}>
                      <span>Son: {b.son_calisma}</span>
                      <span>Sonraki: {b.sonraki_calisma}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detay panel */}
            {secili && (
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, alignSelf: 'flex-start', position: 'sticky', top: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Pipeline Detayı</h3>
                  <button onClick={() => setSeciliBor(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 18 }}>×</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: durumRenk(secili.durum) }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{secili.ad}</span>
                </div>

                {[
                  ['Kaynak', secili.kaynak],
                  ['Hedef', secili.hedef],
                  ['Zamanlama', secili.zamanlamа],
                  ['Son Çalışma', secili.son_calisma],
                  ['Sonraki Çalışma', secili.sonraki_calisma],
                  ['İşlenen Kayıt', secili.kayit_sayisi.toLocaleString('tr-TR')],
                  ['Hata Sayısı', secili.hata_sayisi.toString()],
                  ['İşlem Süresi', secili.sure_ms > 0 ? `${(secili.sure_ms / 1000).toFixed(2)}s` : '—'],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${BORDER}`, fontSize: 12 }}>
                    <span style={{ color: '#94A3B8' }}>{label}</span>
                    <span style={{ color: NAVY, fontWeight: 600 }}>{val}</span>
                  </div>
                ))}

                {/* Veri kalite göstergesi */}
                <div style={{ marginTop: 16, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>Veri Kalitesi</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: kaliteRenk(secili.veri_kalitesi), fontFamily: 'DM Mono,monospace' }}>%{secili.veri_kalitesi}</span>
                  </div>
                  <div style={{ background: '#F1F5F9', borderRadius: 99, height: 10, overflow: 'hidden' }}>
                    <div style={{ background: kaliteRenk(secili.veri_kalitesi), width: `${secili.veri_kalitesi}%`, height: '100%', borderRadius: 99, transition: 'width .5s' }} />
                  </div>
                </div>

                {/* Kontrol butonları */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button onClick={() => borDurumGuncelle(secili.id, 'çalışıyor')}
                    style={{ padding: '8px', background: secili.durum === 'çalışıyor' ? GREEN : '#F0FDF4', color: secili.durum === 'çalışıyor' ? 'white' : GREEN, border: `1px solid ${GREEN}`, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    ▶ Başlat
                  </button>
                  <button onClick={() => borDurumGuncelle(secili.id, 'durduruldu')}
                    style={{ padding: '8px', background: secili.durum === 'durduruldu' ? '#94A3B8' : '#F8F9FA', color: '#64748B', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    ⏹ Durdur
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CANLI LOG ───────────────────────────────────────────────── */}
        {aktifSekme === 'loglar' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 2 }}>Canlı Log Akışı</h2>
                <p style={{ fontSize: 12, color: '#94A3B8' }}>Tüm pipeline'ların gerçek zamanlı olay kaydı</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: otoCanlilama ? GREEN : '#94A3B8', boxShadow: otoCanlilama ? `0 0 0 3px ${GREEN}33` : 'none' }} />
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{otoCanlilama ? 'Canlı akış aktif' : 'Durduruldu'}</span>
                <button onClick={() => setLoglar(ORNEK_LOGLAR)}
                  style={{ padding: '5px 12px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 7, fontSize: 12, cursor: 'pointer', color: '#64748B' }}>
                  Sıfırla
                </button>
              </div>
            </div>

            <div style={{ background: '#0F172A', borderRadius: 12, overflow: 'hidden', fontFamily: 'DM Mono,monospace' }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #1E293B', display: 'flex', gap: 20 }}>
                {[
                  { renk: GREEN, label: 'BAŞARI' },
                  { renk: BLUE, label: 'BİLGİ' },
                  { renk: AMBER, label: 'UYARI' },
                  { renk: RED, label: 'HATA' },
                ].map(x => (
                  <div key={x.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: x.renk }} />
                    <span style={{ fontSize: 10, color: '#64748B' }}>{x.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ maxHeight: 500, overflowY: 'auto', padding: '8px 0' }}>
                {loglar.map(log => (
                  <div key={log.id} style={{ padding: '6px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', borderBottom: '1px solid #1E293B08' }}>
                    <span style={{ color: logRenk(log.seviye), fontSize: 12, minWidth: 12 }}>{logIkon(log.seviye)}</span>
                    <span style={{ color: '#64748B', fontSize: 11, minWidth: 56 }}>{log.zaman}</span>
                    <span style={{ color: '#94A3B8', fontSize: 11, minWidth: 200 }}>[{log.bor_adi}]</span>
                    <span style={{ color: log.seviye === 'hata' ? '#FCA5A5' : log.seviye === 'uyarı' ? '#FDE68A' : log.seviye === 'basari' ? '#86EFAC' : '#93C5FD', fontSize: 12, lineHeight: 1.5 }}>{log.mesaj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── VERİ KALİTESİ ───────────────────────────────────────────── */}
        {aktifSekme === 'kalite' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Veri Kalitesi Paneli</h2>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>Her pipeline için veri tamlığı, doğruluğu ve güncelleme metrikler</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {borlar.map(b => (
                <div key={b.id} style={{ background: 'white', border: `1px solid ${b.veri_kalitesi < 80 ? '#FCA5A5' : BORDER}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 3 }}>{b.ad}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>{b.kaynak}</div>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: kaliteRenk(b.veri_kalitesi), fontFamily: 'DM Mono,monospace' }}>%{b.veri_kalitesi}</div>
                  </div>

                  <div style={{ background: '#F1F5F9', borderRadius: 99, height: 8, overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ background: kaliteRenk(b.veri_kalitesi), width: `${b.veri_kalitesi}%`, height: '100%', borderRadius: 99 }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B' }}>
                    <span>{b.kayit_sayisi > 0 ? `${b.kayit_sayisi.toLocaleString('tr-TR')} kayıt` : 'Veri yok'}</span>
                    <span style={{ color: b.hata_sayisi > 0 ? RED : '#94A3B8' }}>{b.hata_sayisi > 0 ? `${b.hata_sayisi} hata` : 'Temiz'}</span>
                  </div>

                  {b.veri_kalitesi < 80 && (
                    <div style={{ marginTop: 8, background: '#FFF7F7', border: '1px solid #FCA5A5', borderRadius: 7, padding: '6px 10px', fontSize: 11, color: RED }}>
                      ⚠ Veri kalitesi eşiğin altında. İnceleme önerilir.
                    </div>
                  )}
                  {!b.aktif && (
                    <div style={{ marginTop: 8, background: '#F8F9FA', border: `1px solid ${BORDER}`, borderRadius: 7, padding: '6px 10px', fontSize: 11, color: '#94A3B8' }}>
                      Pipeline durdurulmuş — kalite verisi güncel değil.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── YAPILANDIRMA ────────────────────────────────────────────── */}
        {aktifSekme === 'yapilandirma' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Pipeline Yapılandırma</h2>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>omniPIPE Pilot — Bağlantı ayarları ve zamanlama yapılandırması</p>
            </div>

            {/* Pilot bilgi bannerı */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: BLUE, marginBottom: 6 }}> Pilot Modülü Hakkında</div>
              <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
                omniPIPE, Omniversel platformunun tüm modüllerine veri besleyen merkezi entegrasyon katmanıdır. Pilot aşamasında bağlantı yapılandırmaları demo modunda çalışmaktadır. Prodüksiyon entegrasyonu için Omniversel teknik ekibiyle iletişime geçin.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {borlar.map(b => (
                <div key={b.id} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{b.ad}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{b.zamanlamа}</div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <div onClick={() => borDurumGuncelle(b.id, b.aktif ? 'durduruldu' : 'çalışıyor')}
                        style={{ width: 40, height: 22, borderRadius: 99, background: b.aktif ? GREEN : '#CBD5E1', transition: 'background .2s', position: 'relative', cursor: 'pointer' }}>
                        <div style={{ position: 'absolute', top: 3, left: b.aktif ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left .2s' }} />
                      </div>
                      <span style={{ fontSize: 12, color: b.aktif ? GREEN : '#94A3B8', fontWeight: 600 }}>{b.aktif ? 'Aktif' : 'Pasif'}</span>
                    </label>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', display: 'flex', gap: 16 }}>
                    <span>📥 {b.kaynak}</span>
                    <span>📤 {b.hedef}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
