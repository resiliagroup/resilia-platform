'use client'
import { useState, useEffect, useRef } from 'react'

const NAVY = '#0A1628'
const TEAL = '#009B8D'
const RED = '#EF4444'
const AMBER = '#F59E0B'
const GREEN = '#22C55E'
const BORDER = '#E2E8F0'

// ─── Tipler ────────────────────────────────────────────────────────────────

type KrizDurumu = 'normal' | 'izleme' | 'aktif' | 'kapatılıyor'
type GorevDurumu = 'bekliyor' | 'devam_ediyor' | 'tamamlandı' | 'engellendi'
type Oncelik = 'acil' | 'yüksek' | 'orta' | 'düşük'

interface Gorev {
  id: string
  baslik: string
  atanan: string
  oncelik: Oncelik
  durum: GorevDurumu
  son_tarih: string
  notlar: string
  olusturulma: string
}

interface KararLog {
  id: string
  karar: string
  karar_veren: string
  gerekce: string
  zaman: string
}

interface AarBulgu {
  id: string
  kategori: 'iyi_giden' | 'gelistirilecek' | 'aksiyon'
  aciklama: string
  sorumlu: string
}

// ─── Yardımcı ───────────────────────────────────────────────────────────────

function yeniId() { return Math.random().toString(36).slice(2, 10) }

function simdi() {
  return new Date().toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function krizRenk(d: KrizDurumu) {
  if (d === 'aktif') return RED
  if (d === 'izleme') return AMBER
  if (d === 'kapatılıyor') return TEAL
  return GREEN
}

function krizEtiket(d: KrizDurumu) {
  const m: Record<KrizDurumu, string> = { normal: 'Normal', izleme: 'İzleme', aktif: 'KRİZ AKTİF', kapatılıyor: 'Kapatılıyor' }
  return m[d]
}

function gorevRenk(d: GorevDurumu) {
  if (d === 'tamamlandı') return GREEN
  if (d === 'devam_ediyor') return TEAL
  if (d === 'engellendi') return RED
  return AMBER
}

function oncelikRenk(o: Oncelik) {
  if (o === 'acil') return RED
  if (o === 'yüksek') return AMBER
  if (o === 'orta') return TEAL
  return '#94A3B8'
}

const PERSONEL = ['Genel Müdür', 'CISO', 'CTO', 'COO', 'Risk Müdürü', 'İletişim Müdürü', 'BT Direktörü', 'Hukuk Danışmanı']

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────

export default function OmniCrisisPage() {
  const [aktifSekme, setAktifSekme] = useState<'panel' | 'gorevler' | 'kararlar' | 'aar'>('panel')

  // Kriz durumu
  const [krizDurumu, setKrizDurumu] = useState<KrizDurumu>('normal')
  const [krizAdi, setKrizAdi] = useState('')
  const [krizBaslangic, setKrizBaslangic] = useState<string | null>(null)
  const [gecenSure, setGecenSure] = useState('00:00:00')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Görevler
  const [gorevler, setGorevler] = useState<Gorev[]>([
    { id: '1', baslik: 'Etkilenen sistemleri tespit et ve izole et', atanan: 'CTO', oncelik: 'acil', durum: 'devam_ediyor', son_tarih: '', notlar: '', olusturulma: simdi() },
    { id: '2', baslik: 'BDDK acil bildirim hazırlığı', atanan: 'Risk Müdürü', oncelik: 'yüksek', durum: 'bekliyor', son_tarih: '', notlar: '', olusturulma: simdi() },
    { id: '3', baslik: 'Müşteri iletişim planını aktive et', atanan: 'İletişim Müdürü', oncelik: 'yüksek', durum: 'bekliyor', son_tarih: '', notlar: '', olusturulma: simdi() },
  ])
  const [gorevFormu, setGorevFormu] = useState(false)
  const [yeniGorev, setYeniGorev] = useState<Partial<Gorev>>({ oncelik: 'yüksek', durum: 'bekliyor', atanan: PERSONEL[0] })

  // Karar günlüğü
  const [kararlar, setKararlar] = useState<KararLog[]>([
    { id: '1', karar: 'Core Banking sistemi saatte bir yedekleme moduna alındı', karar_veren: 'CTO', gerekce: 'Siber saldırı şüphesi ile veri koruma amacıyla', zaman: simdi() },
  ])
  const [kararFormu, setKararFormu] = useState(false)
  const [yeniKarar, setYeniKarar] = useState<Partial<KararLog>>({ karar_veren: PERSONEL[0] })

  // AAR
  const [aarBulgular, setAarBulgular] = useState<AarBulgu[]>([])
  const [aarFormu, setAarFormu] = useState(false)
  const [yeniBulgu, setYeniBulgu] = useState<Partial<AarBulgu>>({ kategori: 'iyi_giden', sorumlu: PERSONEL[0] })
  const [aarKaydedildi, setAarKaydedildi] = useState(false)

  // Kronometre
  useEffect(() => {
    if (krizDurumu === 'aktif' && krizBaslangic) {
      timerRef.current = setInterval(() => {
        const diff = Date.now() - new Date(krizBaslangic).getTime()
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0')
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')
        setGecenSure(`${h}:${m}:${s}`)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [krizDurumu, krizBaslangic])

  function krizAktive(d: KrizDurumu) {
    if (d === 'aktif' && krizDurumu !== 'aktif') {
      setKrizBaslangic(new Date().toISOString())
    }
    if (d === 'normal') {
      setKrizBaslangic(null)
      setGecenSure('00:00:00')
    }
    setKrizDurumu(d)
  }

  // ─── Görev CRUD ──────────────────────────────────────────────────────────

  function gorevEkle() {
    if (!yeniGorev.baslik) return
    const g: Gorev = {
      id: yeniId(),
      baslik: yeniGorev.baslik || '',
      atanan: yeniGorev.atanan || PERSONEL[0],
      oncelik: (yeniGorev.oncelik as Oncelik) || 'yüksek',
      durum: (yeniGorev.durum as GorevDurumu) || 'bekliyor',
      son_tarih: yeniGorev.son_tarih || '',
      notlar: yeniGorev.notlar || '',
      olusturulma: simdi(),
    }
    setGorevler(p => [g, ...p])
    setGorevFormu(false)
    setYeniGorev({ oncelik: 'yüksek', durum: 'bekliyor', atanan: PERSONEL[0] })
  }

  function gorevDurumGuncelle(id: string, durum: GorevDurumu) {
    setGorevler(p => p.map(g => g.id === id ? { ...g, durum } : g))
  }

  // ─── Karar CRUD ──────────────────────────────────────────────────────────

  function kararEkle() {
    if (!yeniKarar.karar) return
    const k: KararLog = {
      id: yeniId(),
      karar: yeniKarar.karar || '',
      karar_veren: yeniKarar.karar_veren || PERSONEL[0],
      gerekce: yeniKarar.gerekce || '',
      zaman: simdi(),
    }
    setKararlar(p => [k, ...p])
    setKararFormu(false)
    setYeniKarar({ karar_veren: PERSONEL[0] })
  }

  // ─── AAR ─────────────────────────────────────────────────────────────────

  function aarBulguEkle() {
    if (!yeniBulgu.aciklama) return
    const b: AarBulgu = {
      id: yeniId(),
      kategori: yeniBulgu.kategori || 'iyi_giden',
      aciklama: yeniBulgu.aciklama || '',
      sorumlu: yeniBulgu.sorumlu || '',
    }
    setAarBulgular(p => [...p, b])
    setAarFormu(false)
    setYeniBulgu({ kategori: 'iyi_giden', sorumlu: PERSONEL[0] })
  }

  async function aarPdfIndir() {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF()
    const now = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })

    doc.setFontSize(16)
    doc.setTextColor(10, 22, 40)
    doc.text('Olay Sonrası Değerlendirme (AAR)', 14, 20)
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Kriz: ${krizAdi || 'İsimsiz Kriz'} · Tarih: ${now}`, 14, 28)
    doc.text('BDDK İSEDES Yönetmeliği Madde 39 · ISO 22301:2019 Madde 8.8', 14, 35)

    doc.setDrawColor(200, 200, 200)
    doc.line(14, 39, 196, 39)

    // Görev özeti
    doc.setFontSize(12)
    doc.setTextColor(10, 22, 40)
    doc.text('1. Görev Özeti', 14, 48)
    autoTable(doc, {
      startY: 52,
      head: [['Görev', 'Atanan', 'Öncelik', 'Durum']],
      body: gorevler.map(g => [g.baslik, g.atanan, g.oncelik, g.durum.replace('_', ' ')]),
      headStyles: { fillColor: [10, 22, 40], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
    })

    const y1 = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

    // Karar günlüğü
    doc.setFontSize(12)
    doc.setTextColor(10, 22, 40)
    doc.text('2. Karar Günlüğü', 14, y1)
    autoTable(doc, {
      startY: y1 + 4,
      head: [['Karar', 'Karar Veren', 'Gerekçe', 'Zaman']],
      body: kararlar.map(k => [k.karar, k.karar_veren, k.gerekce, k.zaman]),
      headStyles: { fillColor: [0, 100, 87], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [240, 253, 249] },
      columnStyles: { 0: { cellWidth: 60 }, 2: { cellWidth: 50 } },
    })

    const y2 = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

    // AAR bulgular
    doc.setFontSize(12)
    doc.setTextColor(10, 22, 40)
    doc.text('3. AAR Bulgular', 14, y2)
    autoTable(doc, {
      startY: y2 + 4,
      head: [['Kategori', 'Açıklama', 'Sorumlu']],
      body: aarBulgular.map(b => [
        b.kategori === 'iyi_giden' ? 'İyi Giden' : b.kategori === 'gelistirilecek' ? 'Geliştirilecek' : 'Aksiyon Kalemi',
        b.aciklama,
        b.sorumlu,
      ]),
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [239, 246, 255] },
    })

    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('Omniversel Platform · omniCRISIS v1.0 · Bu rapor gizlidir.', 14, 285)

    doc.save(`AAR-${krizAdi || 'kriz'}-${new Date().toISOString().slice(0, 10)}.pdf`)
    setAarKaydedildi(true)
    setTimeout(() => setAarKaydedildi(false), 3000)
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  const sekmeStyle = (aktif: boolean) => ({
    padding: '10px 20px',
    background: aktif ? NAVY : 'transparent',
    color: aktif ? 'white' : '#64748B',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: aktif ? 700 : 500,
    cursor: 'pointer',
  })

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: `1px solid ${BORDER}`,
    borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA',
    boxSizing: 'border-box' as const,
  }

  const tamamlananGorev = gorevler.filter(g => g.durum === 'tamamlandı').length
  const aktifGorev = gorevler.filter(g => g.durum === 'devam_ediyor').length

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Kriz Durum Bandı */}
      <div style={{ background: krizRenk(krizDurumu), padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background .5s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {krizDurumu === 'aktif' && (
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'white', animation: 'pulse 1.5s infinite' }} />
          )}
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>
              omniCRISIS — {krizEtiket(krizDurumu)}
            </div>
            {krizDurumu === 'aktif' && (
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                {krizAdi || 'İsimsiz Kriz'} · Geçen Süre: <span style={{ fontFamily: 'DM Mono,monospace', fontWeight: 700 }}>{gecenSure}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {krizDurumu !== 'aktif' && (
            <input placeholder="Kriz adı..." value={krizAdi} onChange={e => setKrizAdi(e.target.value)}
              style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 13, outline: 'none' }} />
          )}
          {(['normal', 'izleme', 'aktif', 'kapatılıyor'] as KrizDurumu[]).map(d => (
            <button key={d} onClick={() => krizAktive(d)}
              style={{ padding: '7px 14px', background: krizDurumu === d ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, fontSize: 12, fontWeight: krizDurumu === d ? 700 : 500, cursor: 'pointer' }}>
              {krizEtiket(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Sekmeler */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '8px 32px', display: 'flex', gap: 4 }}>
        {([
          ['panel', 'Komuta Paneli'],
          ['gorevler', `Görev Takibi (${aktifGorev} aktif)`],
          ['kararlar', 'Karar Günlüğü'],
          ['aar', 'AAR Formu'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setAktifSekme(key)} style={sekmeStyle(aktifSekme === key)}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: '28px auto', padding: '0 24px' }}>

        {/* ── KOMUTA PANELİ ───────────────────────────────────────────── */}
        {aktifSekme === 'panel' && (
          <div>
            {/* KPI kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Aktif Görev', val: aktifGorev, renk: TEAL },
                { label: 'Tamamlanan', val: tamamlananGorev, renk: GREEN },
                { label: 'Engellenen', val: gorevler.filter(g => g.durum === 'engellendi').length, renk: RED },
                { label: 'Karar Sayısı', val: kararlar.length, renk: NAVY },
              ].map(k => (
                <div key={k.label} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: k.renk, fontFamily: 'DM Mono,monospace' }}>{k.val}</div>
                </div>
              ))}
            </div>

            {/* Acil görevler */}
            <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Acil & Yüksek Öncelikli Görevler</h3>
                <button onClick={() => setAktifSekme('gorevler')} style={{ background: 'transparent', border: 'none', color: TEAL, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Tümünü Gör →</button>
              </div>
              {gorevler.filter(g => g.oncelik === 'acil' || g.oncelik === 'yüksek').slice(0, 5).map(g => (
                <div key={g.id} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: oncelikRenk(g.oncelik), flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13, color: NAVY, fontWeight: 500 }}>{g.baslik}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{g.atanan}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: gorevRenk(g.durum), padding: '2px 8px', borderRadius: 20 }}>
                    {g.durum.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>

            {/* Son kararlar */}
            <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Son Kararlar</h3>
                <button onClick={() => setAktifSekme('kararlar')} style={{ background: 'transparent', border: 'none', color: TEAL, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Tümünü Gör →</button>
              </div>
              {kararlar.slice(0, 3).map(k => (
                <div key={k.id} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 3 }}>{k.karar}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#94A3B8' }}>
                    <span>👤 {k.karar_veren}</span>
                    <span>📅 {k.zaman}</span>
                    {k.gerekce && <span>💬 {k.gerekce}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GÖREV TAKİBİ ────────────────────────────────────────────── */}
        {aktifSekme === 'gorevler' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>Görev Takibi</h2>
              <button onClick={() => setGorevFormu(v => !v)}
                style={{ padding: '8px 16px', background: TEAL, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                + Görev Ekle
              </button>
            </div>

            {gorevFormu && (
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Görev Başlığı *</label>
                    <input style={inputStyle} placeholder="Etkilenen sistemleri izole et" value={yeniGorev.baslik || ''}
                      onChange={e => setYeniGorev(p => ({ ...p, baslik: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Atanan Kişi</label>
                    <select style={inputStyle} value={yeniGorev.atanan || PERSONEL[0]}
                      onChange={e => setYeniGorev(p => ({ ...p, atanan: e.target.value }))}>
                      {PERSONEL.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Öncelik</label>
                    <select style={inputStyle} value={yeniGorev.oncelik || 'yüksek'}
                      onChange={e => setYeniGorev(p => ({ ...p, oncelik: e.target.value as Oncelik }))}>
                      <option value="acil">Acil</option>
                      <option value="yüksek">Yüksek</option>
                      <option value="orta">Orta</option>
                      <option value="düşük">Düşük</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Son Tarih</label>
                    <input type="datetime-local" style={inputStyle} value={yeniGorev.son_tarih || ''}
                      onChange={e => setYeniGorev(p => ({ ...p, son_tarih: e.target.value }))} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Notlar</label>
                  <input style={inputStyle} placeholder="Ek bilgi..." value={yeniGorev.notlar || ''}
                    onChange={e => setYeniGorev(p => ({ ...p, notlar: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => setGorevFormu(false)} style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#64748B' }}>İptal</button>
                  <button onClick={gorevEkle} style={{ padding: '7px 20px', background: NAVY, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Kaydet</button>
                </div>
              </div>
            )}

            <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F8F9FA', borderBottom: `1px solid ${BORDER}` }}>
                    {['Öncelik', 'Görev', 'Atanan', 'Oluşturulma', 'Durum', ''].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gorevler.map(g => (
                    <tr key={g.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: oncelikRenk(g.oncelik) }} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: NAVY }}>{g.baslik}</div>
                        {g.notlar && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{g.notlar}</div>}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#374151' }}>{g.atanan}</td>
                      <td style={{ padding: '12px 14px', color: '#94A3B8', fontSize: 11 }}>{g.olusturulma}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <select value={g.durum} onChange={e => gorevDurumGuncelle(g.id, e.target.value as GorevDurumu)}
                          style={{ padding: '4px 8px', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, background: gorevRenk(g.durum), color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                          <option value="bekliyor">Bekliyor</option>
                          <option value="devam_ediyor">Devam Ediyor</option>
                          <option value="tamamlandı">Tamamlandı</option>
                          <option value="engellendi">Engellendi</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => setGorevler(p => p.filter(x => x.id !== g.id))}
                          style={{ background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: 16, cursor: 'pointer' }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── KARAR GÜNLÜĞÜ ───────────────────────────────────────────── */}
        {aktifSekme === 'kararlar' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>Karar Günlüğü</h2>
                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Kriz sürecinde alınan tüm kararların kayıt altına alınması — ISO 22301 Madde 8.7</p>
              </div>
              <button onClick={() => setKararFormu(v => !v)}
                style={{ padding: '8px 16px', background: TEAL, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                + Karar Ekle
              </button>
            </div>

            {kararFormu && (
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Alınan Karar *</label>
                    <input style={inputStyle} placeholder="Core Banking 2 saatliğine kapatıldı" value={yeniKarar.karar || ''}
                      onChange={e => setYeniKarar(p => ({ ...p, karar: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Karar Veren</label>
                    <select style={inputStyle} value={yeniKarar.karar_veren || PERSONEL[0]}
                      onChange={e => setYeniKarar(p => ({ ...p, karar_veren: e.target.value }))}>
                      {PERSONEL.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Gerekçe</label>
                  <input style={inputStyle} placeholder="Saldırı yayılımını önlemek amacıyla" value={yeniKarar.gerekce || ''}
                    onChange={e => setYeniKarar(p => ({ ...p, gerekce: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => setKararFormu(false)} style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#64748B' }}>İptal</button>
                  <button onClick={kararEkle} style={{ padding: '7px 20px', background: NAVY, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Kaydet</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {kararlar.map(k => (
                <div key={k.id} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{k.karar}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap', marginLeft: 16 }}>{k.zaman}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#64748B' }}>
                    <span>👤 {k.karar_veren}</span>
                    {k.gerekce && <span>💬 {k.gerekce}</span>}
                  </div>
                </div>
              ))}
              {kararlar.length === 0 && (
                <div style={{ background: 'white', border: `1px dashed ${BORDER}`, borderRadius: 12, padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                  Henüz karar kaydı yok.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── AAR FORMU ───────────────────────────────────────────────── */}
        {aktifSekme === 'aar' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>Olay Sonrası Değerlendirme (AAR)</h2>
                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>After-Action Review · BDDK İSEDES Madde 39 · ISO 22301:2019 Madde 8.8</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setAarFormu(v => !v)}
                  style={{ padding: '8px 16px', background: TEAL, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  + Bulgu Ekle
                </button>
                <button onClick={aarPdfIndir}
                  style={{ padding: '8px 16px', background: aarKaydedildi ? GREEN : NAVY, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background .3s' }}>
                  {aarKaydedildi ? '✓ İndirildi' : '↓ AAR Raporu'}
                </button>
              </div>
            </div>

            {aarFormu && (
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Kategori</label>
                    <select style={inputStyle} value={yeniBulgu.kategori || 'iyi_giden'}
                      onChange={e => setYeniBulgu(p => ({ ...p, kategori: e.target.value as AarBulgu['kategori'] }))}>
                      <option value="iyi_giden">✅ İyi Giden</option>
                      <option value="gelistirilecek">⚠️ Geliştirilecek</option>
                      <option value="aksiyon">📋 Aksiyon Kalemi</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Açıklama *</label>
                    <input style={inputStyle} placeholder="Bulgular, öğrenilen dersler..." value={yeniBulgu.aciklama || ''}
                      onChange={e => setYeniBulgu(p => ({ ...p, aciklama: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Sorumlu</label>
                    <select style={inputStyle} value={yeniBulgu.sorumlu || PERSONEL[0]}
                      onChange={e => setYeniBulgu(p => ({ ...p, sorumlu: e.target.value }))}>
                      {PERSONEL.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => setAarFormu(false)} style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#64748B' }}>İptal</button>
                  <button onClick={aarBulguEkle} style={{ padding: '7px 20px', background: NAVY, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Kaydet</button>
                </div>
              </div>
            )}

            {/* 3 kategori kolonları */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {([
                { kat: 'iyi_giden', label: '✅ İyi Giden', renk: '#DCFCE7', border: '#86EFAC', textRenk: '#166534' },
                { kat: 'gelistirilecek', label: '⚠️ Geliştirilecek', renk: '#FEF9C3', border: '#FDE047', textRenk: '#854D0E' },
                { kat: 'aksiyon', label: '📋 Aksiyon Kalemleri', renk: '#EFF6FF', border: '#93C5FD', textRenk: '#1E40AF' },
              ] as const).map(col => (
                <div key={col.kat}>
                  <div style={{ background: col.renk, border: `1px solid ${col.border}`, borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: col.textRenk }}>{col.label}</div>
                    <div style={{ fontSize: 11, color: col.textRenk, opacity: 0.7 }}>{aarBulgular.filter(b => b.kategori === col.kat).length} bulgu</div>
                  </div>
                  {aarBulgular.filter(b => b.kategori === col.kat).map(b => (
                    <div key={b.id} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
                      <div style={{ fontSize: 13, color: NAVY, marginBottom: 4 }}>{b.aciklama}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>👤 {b.sorumlu}</span>
                        <button onClick={() => setAarBulgular(p => p.filter(x => x.id !== b.id))}
                          style={{ background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: 14, cursor: 'pointer' }}>✕</button>
                      </div>
                    </div>
                  ))}
                  {aarBulgular.filter(b => b.kategori === col.kat).length === 0 && (
                    <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: '16px', textAlign: 'center', fontSize: 12, color: '#CBD5E1' }}>Bulgu eklenmedi</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
