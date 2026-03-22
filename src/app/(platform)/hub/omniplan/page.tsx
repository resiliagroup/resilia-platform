'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550'
)

const NAVY = '#0A1628'
const TEAL = '#009B8D'
const RED  = '#EF4444'
const AMBER = '#F59E0B'
const GREEN = '#22C55E'
const BORDER = '#E2E8F0'

// ─── Tipler ────────────────────────────────────────────────────────────────

interface Senaryo {
  id: string
  ad: string
  tur: string      // Siber Saldırı | Doğal Afet | Altyapı Arızası | Salgın | Tedarik Zinciri
  etki_alani: string
  tetikleyici: string
  aksiyon_plani: string
  sorumlu: string
  durum: 'taslak' | 'onaylı' | 'test_edildi'
}

interface RtoCalisma {
  id: string
  surec_adi: string
  mevcut_rto: string
  hedef_rto: string
  mevcut_rpo: string
  hedef_rpo: string
  tamamlanma: number // 0-100
  notlar: string
}

interface Tatbikat {
  id: string
  ad: string
  tur: 'Masa Başı' | 'Saha' | 'Paralel' | 'Tam Kesinti'
  planlanan_tarih: string
  durum: 'planlandı' | 'tamamlandı' | 'iptal'
  katilimcilar: string
  bulgular: string
}

// ─── Yardımcı ───────────────────────────────────────────────────────────────

const SENARYO_TURLERI = ['Siber Saldırı', 'Doğal Afet', 'Altyapı Arızası', 'Salgın', 'Tedarik Zinciri']
const TATBIKAT_TURLERI: Tatbikat['tur'][] = ['Masa Başı', 'Saha', 'Paralel', 'Tam Kesinti']
const RTO_SECENEKLER = ['15 dk', '30 dk', '1 saat', '4 saat', '8 saat', '1 gün', '2 gün', '1 hafta']

function durumRenk(d: string) {
  if (d === 'onaylı' || d === 'tamamlandı') return GREEN
  if (d === 'test_edildi' || d === 'planlandı') return TEAL
  if (d === 'iptal') return RED
  return AMBER
}

function durumEtiket(d: string) {
  const map: Record<string, string> = {
    taslak: 'Taslak', onaylı: 'Onaylı', test_edildi: 'Test Edildi',
    planlandı: 'Planlandı', tamamlandı: 'Tamamlandı', iptal: 'İptal',
  }
  return map[d] ?? d
}

function yeniId() { return Math.random().toString(36).slice(2, 10) }

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────

export default function OmniPlanPage() {
  const [aktifSekme, setAktifSekme] = useState<'senaryolar' | 'rto_rpo' | 'tatbikat' | 'rapor'>('senaryolar')

  // Senaryolar
  const [senaryolar, setSenaryolar] = useState<Senaryo[]>([
    { id: '1', ad: 'Fidye Yazılımı Saldırısı', tur: 'Siber Saldırı', etki_alani: 'Core Banking, SWIFT', tetikleyici: 'Şifreli dosya tespiti', aksiyon_plani: '1. İzolasyon 2. SOME bildir 3. Yedekten geri yükle 4. Regülatör bildirimi', sorumlu: 'CISO', durum: 'onaylı' },
    { id: '2', ad: 'Deprem Senaryosu (M7+)', tur: 'Doğal Afet', etki_alani: 'Tüm fiziksel lokasyonlar', tetikleyici: 'AFAD uyarısı veya hasarlı bina tespiti', aksiyon_plani: '1. Tahliye 2. Alternatif lokasyon aktif 3. Kriz ekibi topla 4. Müşteri bilgilendirme', sorumlu: 'COO', durum: 'test_edildi' },
  ])
  const [seciliSenaryo, setSeciliSenaryo] = useState<Senaryo | null>(null)
  const [senaryoFormu, setSenaryoFormu] = useState(false)
  const [yeniSenaryo, setYeniSenaryo] = useState<Partial<Senaryo>>({ tur: 'Siber Saldırı', durum: 'taslak' })

  // RTO/RPO
  const [rtoCalismalari, setRtoCalismalari] = useState<RtoCalisma[]>([
    { id: '1', surec_adi: 'Core Banking Sistemi', mevcut_rto: '4 saat', hedef_rto: '1 saat', mevcut_rpo: '1 saat', hedef_rpo: '15 dk', tamamlanma: 65, notlar: 'DR site kapasitesi artışı gerekiyor' },
    { id: '2', surec_adi: 'SWIFT Ödemeleri', mevcut_rto: '8 saat', hedef_rto: '4 saat', mevcut_rpo: '30 dk', hedef_rpo: '15 dk', tamamlanma: 30, notlar: 'SWIFT BIC DR kaydı bekliyor' },
    { id: '3', surec_adi: 'İnternet Bankacılığı', mevcut_rto: '2 saat', hedef_rto: '30 dk', mevcut_rpo: '30 dk', hedef_rpo: '15 dk', tamamlanma: 80, notlar: 'CDN failover yapılandırıldı' },
  ])
  const [rtoEklemeModu, setRtoEklemeModu] = useState(false)
  const [yeniRto, setYeniRto] = useState<Partial<RtoCalisma>>({ mevcut_rto: '4 saat', hedef_rto: '1 saat', mevcut_rpo: '1 saat', hedef_rpo: '15 dk', tamamlanma: 0 })

  // Tatbikatlar
  const [tatbikatlar, setTatbikatlar] = useState<Tatbikat[]>([
    { id: '1', ad: 'Siber Tatbikat 2025-Q1', tur: 'Masa Başı', planlanan_tarih: '2025-03-15', durum: 'tamamlandı', katilimcilar: 'CISO, BT, Risk', bulgular: 'Fidye yazılımı müdahale süresi 6 saat. Hedef: 4 saat.' },
    { id: '2', ad: 'Deprem Tahliye Tatbikatı', tur: 'Saha', planlanan_tarih: '2025-06-20', durum: 'planlandı', katilimcilar: 'Tüm şube personeli', bulgular: '' },
  ])
  const [tatbikatFormu, setTatbikatFormu] = useState(false)
  const [yeniTatbikat, setYeniTatbikat] = useState<Partial<Tatbikat>>({ tur: 'Masa Başı', durum: 'planlandı', planlanan_tarih: '' })

  // Rapor
  const [raporUretiyor, setRaporUretiyor] = useState(false)
  const [raporHazir, setRaporHazir] = useState(false)

  // ─── Senaryo CRUD ────────────────────────────────────────────────────────

  function senaryoEkle() {
    if (!yeniSenaryo.ad) return
    const s: Senaryo = {
      id: yeniId(),
      ad: yeniSenaryo.ad || '',
      tur: yeniSenaryo.tur || 'Siber Saldırı',
      etki_alani: yeniSenaryo.etki_alani || '',
      tetikleyici: yeniSenaryo.tetikleyici || '',
      aksiyon_plani: yeniSenaryo.aksiyon_plani || '',
      sorumlu: yeniSenaryo.sorumlu || '',
      durum: yeniSenaryo.durum as Senaryo['durum'] || 'taslak',
    }
    setSenaryolar(p => [s, ...p])
    setSenaryoFormu(false)
    setYeniSenaryo({ tur: 'Siber Saldırı', durum: 'taslak' })
  }

  function senaryoSil(id: string) {
    setSenaryolar(p => p.filter(s => s.id !== id))
    if (seciliSenaryo?.id === id) setSeciliSenaryo(null)
  }

  // ─── RTO/RPO CRUD ────────────────────────────────────────────────────────

  function rtoEkle() {
    if (!yeniRto.surec_adi) return
    const r: RtoCalisma = {
      id: yeniId(),
      surec_adi: yeniRto.surec_adi || '',
      mevcut_rto: yeniRto.mevcut_rto || '4 saat',
      hedef_rto: yeniRto.hedef_rto || '1 saat',
      mevcut_rpo: yeniRto.mevcut_rpo || '1 saat',
      hedef_rpo: yeniRto.hedef_rpo || '15 dk',
      tamamlanma: yeniRto.tamamlanma ?? 0,
      notlar: yeniRto.notlar || '',
    }
    setRtoCalismalari(p => [...p, r])
    setRtoEklemeModu(false)
    setYeniRto({ mevcut_rto: '4 saat', hedef_rto: '1 saat', mevcut_rpo: '1 saat', hedef_rpo: '15 dk', tamamlanma: 0 })
  }

  function tamamlanmaGuncelle(id: string, val: number) {
    setRtoCalismalari(p => p.map(r => r.id === id ? { ...r, tamamlanma: val } : r))
  }

  // ─── Tatbikat CRUD ───────────────────────────────────────────────────────

  function tatbikatEkle() {
    if (!yeniTatbikat.ad || !yeniTatbikat.planlanan_tarih) return
    const t: Tatbikat = {
      id: yeniId(),
      ad: yeniTatbikat.ad || '',
      tur: yeniTatbikat.tur || 'Masa Başı',
      planlanan_tarih: yeniTatbikat.planlanan_tarih || '',
      durum: yeniTatbikat.durum as Tatbikat['durum'] || 'planlandı',
      katilimcilar: yeniTatbikat.katilimcilar || '',
      bulgular: yeniTatbikat.bulgular || '',
    }
    setTatbikatlar(p => [...p, t])
    setTatbikatFormu(false)
    setYeniTatbikat({ tur: 'Masa Başı', durum: 'planlandı', planlanan_tarih: '' })
  }

  function tatbikatDurumGuncelle(id: string, durum: Tatbikat['durum']) {
    setTatbikatlar(p => p.map(t => t.id === id ? { ...t, durum } : t))
  }

  // ─── BDDK PDF ───────────────────────────────────────────────────────────

  async function bddkPdfIndir() {
    setRaporUretiyor(true)
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF()
    const now = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })

    // Başlık
    doc.setFontSize(16)
    doc.setTextColor(10, 22, 40)
    doc.text('İş Sürekliliği Planı (BCP)', 14, 20)
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text('BDDK İSEDES Yönetmeliği Madde 34-37 kapsamında hazırlanmıştır', 14, 28)
    doc.text(`Hazırlanma Tarihi: ${now}`, 14, 35)

    // KPI satırı
    doc.setFontSize(10)
    doc.setTextColor(10, 22, 40)
    doc.text(`Aktif Senaryo Sayısı: ${senaryolar.length}`, 14, 48)
    doc.text(`RTO/RPO Çalışma Sayısı: ${rtoCalismalari.length}`, 75, 48)
    doc.text(`Tatbikat Sayısı: ${tatbikatlar.length}`, 150, 48)

    doc.setDrawColor(200, 200, 200)
    doc.line(14, 52, 196, 52)

    // 1. Senaryo Tablosu
    doc.setFontSize(12)
    doc.setTextColor(10, 22, 40)
    doc.text('1. İş Sürekliliği Senaryoları', 14, 60)

    autoTable(doc, {
      startY: 64,
      head: [['Senaryo Adı', 'Tür', 'Etki Alanı', 'Sorumlu', 'Durum']],
      body: senaryolar.map(s => [s.ad, s.tur, s.etki_alani, s.sorumlu, durumEtiket(s.durum)]),
      headStyles: { fillColor: [10, 22, 40], textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      columnStyles: { 2: { cellWidth: 45 }, 4: { cellWidth: 22 } },
    })

    const y1 = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12

    // 2. RTO/RPO Tablosu
    doc.setFontSize(12)
    doc.setTextColor(10, 22, 40)
    doc.text('2. RTO / RPO Hedefleri', 14, y1)

    autoTable(doc, {
      startY: y1 + 4,
      head: [['Süreç Adı', 'Mevcut RTO', 'Hedef RTO', 'Mevcut RPO', 'Hedef RPO', 'İlerleme']],
      body: rtoCalismalari.map(r => [r.surec_adi, r.mevcut_rto, r.hedef_rto, r.mevcut_rpo, r.hedef_rpo, `%${r.tamamlanma}`]),
      headStyles: { fillColor: [0, 100, 87], textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [240, 253, 249] },
    })

    const y2 = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12

    // 3. Tatbikat Tablosu
    doc.setFontSize(12)
    doc.setTextColor(10, 22, 40)
    doc.text('3. Tatbikat Takvimi', 14, y2)

    autoTable(doc, {
      startY: y2 + 4,
      head: [['Tatbikat Adı', 'Tür', 'Planlanan Tarih', 'Durum', 'Katılımcılar']],
      body: tatbikatlar.map(t => [t.ad, t.tur, t.planlanan_tarih, durumEtiket(t.durum), t.katilimcilar]),
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [239, 246, 255] },
    })

    // Yasal not
    const y3 = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text('Bu belge BDDK İSEDES Yönetmeliği Madde 34 gereği yıllık olarak güncellenmeli ve üst yönetime sunulmalıdır.', 14, y3)
    doc.setFontSize(8)
    doc.text('ISO 22301:2019 · BDDK 2022/2 · Omniversel Platform omniPLAN v1.0', 14, y3 + 7)

    // Alt bilgi
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('Omniversel Platform · omniPLAN v1.0 · Bu rapor gizlidir.', 14, 285)

    doc.save(`BCP-BDDK-${new Date().toISOString().slice(0, 10)}.pdf`)
    setRaporUretiyor(false)
    setRaporHazir(true)
    setTimeout(() => setRaporHazir(false), 4000)
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
    transition: 'all .2s',
  })

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: `1px solid ${BORDER}`,
    borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA',
    boxSizing: 'border-box' as const,
  }

  const textareaStyle = {
    ...inputStyle, resize: 'vertical' as const, minHeight: 72,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Üst Bar */}
      <div style={{ background: NAVY, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>omniPLAN</div>
          <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>İş Sürekliliği Planı · Senaryo Editörü · Tatbikat Takvimi</div>
        </div>
        <button
          onClick={bddkPdfIndir}
          disabled={raporUretiyor}
          style={{ padding: '9px 20px', background: raporHazir ? GREEN : TEAL, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background .3s' }}
        >
          {raporUretiyor ? '⏳ Oluşturuluyor…' : raporHazir ? '✓ İndirildi' : '↓ BDDK BCP Raporu'}
        </button>
      </div>

      {/* Sekmeler */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '8px 32px', display: 'flex', gap: 4 }}>
        {([
          ['senaryolar', 'Senaryo Editörü'],
          ['rto_rpo', 'RTO / RPO Takibi'],
          ['tatbikat', 'Tatbikat Takvimi'],
          ['rapor', 'BCP Özeti'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setAktifSekme(key)} style={sekmeStyle(aktifSekme === key)}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: '28px auto', padding: '0 24px' }}>

        {/* ── SENARYO EDİTÖRÜ ─────────────────────────────────────────── */}
        {aktifSekme === 'senaryolar' && (
          <div style={{ display: 'grid', gridTemplateColumns: seciliSenaryo ? '1fr 380px' : '1fr', gap: 20 }}>
            <div>
              {/* Üst bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>İş Sürekliliği Senaryoları</h2>
                <button onClick={() => setSenaryoFormu(v => !v)}
                  style={{ padding: '8px 16px', background: TEAL, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  + Senaryo Ekle
                </button>
              </div>

              {/* Form */}
              {senaryoFormu && (
                <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Senaryo Adı *</label>
                      <input style={inputStyle} placeholder="Fidye Yazılımı Saldırısı" value={yeniSenaryo.ad || ''}
                        onChange={e => setYeniSenaryo(p => ({ ...p, ad: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Senaryo Türü</label>
                      <select style={inputStyle} value={yeniSenaryo.tur || 'Siber Saldırı'}
                        onChange={e => setYeniSenaryo(p => ({ ...p, tur: e.target.value }))}>
                        {SENARYO_TURLERI.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Etki Alanı</label>
                      <input style={inputStyle} placeholder="Core Banking, SWIFT, ATM" value={yeniSenaryo.etki_alani || ''}
                        onChange={e => setYeniSenaryo(p => ({ ...p, etki_alani: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Sorumlu Kişi/Ekip</label>
                      <input style={inputStyle} placeholder="CISO" value={yeniSenaryo.sorumlu || ''}
                        onChange={e => setYeniSenaryo(p => ({ ...p, sorumlu: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Tetikleyici Koşullar</label>
                    <input style={inputStyle} placeholder="Şifreli dosya tespiti, SIEM alarmı" value={yeniSenaryo.tetikleyici || ''}
                      onChange={e => setYeniSenaryo(p => ({ ...p, tetikleyici: e.target.value }))} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Aksiyon Planı</label>
                    <textarea style={textareaStyle} placeholder="1. İzolasyon 2. Bildirim 3. Kurtarma..." value={yeniSenaryo.aksiyon_plani || ''}
                      onChange={e => setYeniSenaryo(p => ({ ...p, aksiyon_plani: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button onClick={() => setSenaryoFormu(false)} style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#64748B' }}>İptal</button>
                    <button onClick={senaryoEkle} style={{ padding: '7px 20px', background: NAVY, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Kaydet</button>
                  </div>
                </div>
              )}

              {/* Liste */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {senaryolar.map(s => (
                  <div key={s.id} onClick={() => setSeciliSenaryo(seciliSenaryo?.id === s.id ? null : s)}
                    style={{ background: 'white', border: `1px solid ${seciliSenaryo?.id === s.id ? TEAL : BORDER}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'border-color .2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{s.ad}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: durumRenk(s.durum), padding: '2px 8px', borderRadius: 20 }}>{durumEtiket(s.durum)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748B' }}>
                          <span>📋 {s.tur}</span>
                          <span>🎯 {s.etki_alani || '—'}</span>
                          <span>👤 {s.sorumlu || '—'}</span>
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); senaryoSil(s.id) }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#CBD5E1', fontSize: 16, padding: '0 4px' }}>✕</button>
                    </div>
                  </div>
                ))}
                {senaryolar.length === 0 && (
                  <div style={{ background: 'white', border: `1px dashed ${BORDER}`, borderRadius: 12, padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                    Henüz senaryo eklenmedi. "+ Senaryo Ekle" ile başlayın.
                  </div>
                )}
              </div>
            </div>

            {/* Detay paneli */}
            {seciliSenaryo && (
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, alignSelf: 'flex-start', position: 'sticky', top: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Senaryo Detayı</h3>
                  <button onClick={() => setSeciliSenaryo(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 18 }}>×</button>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 3 }}>SENARYO ADI</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{seciliSenaryo.ad}</div>
                </div>
                {[
                  ['TÜR', seciliSenaryo.tur],
                  ['ETKİ ALANI', seciliSenaryo.etki_alani || '—'],
                  ['TETİKLEYİCİ', seciliSenaryo.tetikleyici || '—'],
                  ['SORUMLU', seciliSenaryo.sorumlu || '—'],
                ].map(([label, val]) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, color: '#374151' }}>{val}</div>
                  </div>
                ))}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>AKSİYON PLANI</div>
                  <div style={{ fontSize: 12, color: '#374151', background: '#F8F9FA', borderRadius: 8, padding: 10, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{seciliSenaryo.aksiyon_plani || '—'}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  {(['taslak', 'onaylı', 'test_edildi'] as const).map(d => (
                    <button key={d} onClick={() => { const updated = { ...seciliSenaryo, durum: d }; setSenaryolar(p => p.map(s => s.id === seciliSenaryo.id ? updated : s)); setSeciliSenaryo(updated) }}
                      style={{ flex: 1, padding: '6px 0', background: seciliSenaryo.durum === d ? durumRenk(d) : '#F1F5F9', color: seciliSenaryo.durum === d ? 'white' : '#64748B', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      {durumEtiket(d)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── RTO / RPO TAKİBİ ────────────────────────────────────────── */}
        {aktifSekme === 'rto_rpo' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>RTO / RPO Hedef Takibi</h2>
                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>ISO 22301 Madde 8.4.1 · BDDK İSEDES Madde 36</p>
              </div>
              <button onClick={() => setRtoEklemeModu(v => !v)}
                style={{ padding: '8px 16px', background: TEAL, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                + Süreç Ekle
              </button>
            </div>

            {rtoEklemeModu && (
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Süreç Adı *</label>
                    <input style={inputStyle} placeholder="Core Banking Sistemi" value={yeniRto.surec_adi || ''}
                      onChange={e => setYeniRto(p => ({ ...p, surec_adi: e.target.value }))} />
                  </div>
                  {[
                    ['Mevcut RTO', 'mevcut_rto'],
                    ['Hedef RTO', 'hedef_rto'],
                    ['Mevcut RPO', 'mevcut_rpo'],
                    ['Hedef RPO', 'hedef_rpo'],
                  ].map(([label, key]) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>{label}</label>
                      <select style={inputStyle} value={(yeniRto as Record<string, string>)[key] || '1 saat'}
                        onChange={e => setYeniRto(p => ({ ...p, [key]: e.target.value }))}>
                        {RTO_SECENEKLER.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>İlerleme % ({yeniRto.tamamlanma ?? 0})</label>
                  <input type="range" min={0} max={100} value={yeniRto.tamamlanma ?? 0}
                    onChange={e => setYeniRto(p => ({ ...p, tamamlanma: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Notlar</label>
                  <input style={inputStyle} placeholder="DR site kapasitesi artışı gerekiyor" value={yeniRto.notlar || ''}
                    onChange={e => setYeniRto(p => ({ ...p, notlar: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => setRtoEklemeModu(false)} style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#64748B' }}>İptal</button>
                  <button onClick={rtoEkle} style={{ padding: '7px 20px', background: NAVY, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Kaydet</button>
                </div>
              </div>
            )}

            <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F8F9FA', borderBottom: `1px solid ${BORDER}` }}>
                    {['Süreç Adı', 'Mevcut RTO', 'Hedef RTO', 'Mevcut RPO', 'Hedef RPO', 'İlerleme', 'Notlar'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rtoCalismalari.map(r => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: NAVY }}>{r.surec_adi}</td>
                      <td style={{ padding: '12px 14px', color: '#EF4444' }}>{r.mevcut_rto}</td>
                      <td style={{ padding: '12px 14px', color: GREEN, fontWeight: 600 }}>{r.hedef_rto}</td>
                      <td style={{ padding: '12px 14px', color: '#EF4444' }}>{r.mevcut_rpo}</td>
                      <td style={{ padding: '12px 14px', color: GREEN, fontWeight: 600 }}>{r.hedef_rpo}</td>
                      <td style={{ padding: '12px 14px', minWidth: 160 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input type="range" min={0} max={100} value={r.tamamlanma}
                            onChange={e => tamamlanmaGuncelle(r.id, Number(e.target.value))}
                            style={{ flex: 1, accentColor: r.tamamlanma >= 80 ? GREEN : r.tamamlanma >= 50 ? TEAL : AMBER, cursor: 'pointer' }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: r.tamamlanma >= 80 ? GREEN : r.tamamlanma >= 50 ? TEAL : AMBER, minWidth: 32 }}>%{r.tamamlanma}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748B', fontSize: 12 }}>{r.notlar || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ortalama ilerleme */}
            {rtoCalismalari.length > 0 && (() => {
              const ort = Math.round(rtoCalismalari.reduce((acc, r) => acc + r.tamamlanma, 0) / rtoCalismalari.length)
              return (
                <div style={{ marginTop: 16, background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>Genel RTO/RPO Dönüşüm İlerlemesi</div>
                    <div style={{ background: '#F1F5F9', borderRadius: 99, height: 10, overflow: 'hidden' }}>
                      <div style={{ background: ort >= 80 ? GREEN : ort >= 50 ? TEAL : AMBER, height: '100%', width: `${ort}%`, borderRadius: 99, transition: 'width .5s' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: ort >= 80 ? GREEN : ort >= 50 ? TEAL : AMBER, fontFamily: 'DM Mono,monospace' }}>%{ort}</div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ── TATBİKAT TAKVİMİ ────────────────────────────────────────── */}
        {aktifSekme === 'tatbikat' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>Tatbikat Takvimi</h2>
                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>BDDK İSEDES Madde 37 · Yılda en az 1 tatbikat zorunludur</p>
              </div>
              <button onClick={() => setTatbikatFormu(v => !v)}
                style={{ padding: '8px 16px', background: TEAL, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                + Tatbikat Ekle
              </button>
            </div>

            {tatbikatFormu && (
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Tatbikat Adı *</label>
                    <input style={inputStyle} placeholder="Siber Tatbikat 2025-Q2" value={yeniTatbikat.ad || ''}
                      onChange={e => setYeniTatbikat(p => ({ ...p, ad: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Tür</label>
                    <select style={inputStyle} value={yeniTatbikat.tur || 'Masa Başı'}
                      onChange={e => setYeniTatbikat(p => ({ ...p, tur: e.target.value as Tatbikat['tur'] }))}>
                      {TATBIKAT_TURLERI.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Planlanan Tarih *</label>
                    <input type="date" style={inputStyle} value={yeniTatbikat.planlanan_tarih || ''}
                      onChange={e => setYeniTatbikat(p => ({ ...p, planlanan_tarih: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Durum</label>
                    <select style={inputStyle} value={yeniTatbikat.durum || 'planlandı'}
                      onChange={e => setYeniTatbikat(p => ({ ...p, durum: e.target.value as Tatbikat['durum'] }))}>
                      <option value="planlandı">Planlandı</option>
                      <option value="tamamlandı">Tamamlandı</option>
                      <option value="iptal">İptal</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Katılımcılar</label>
                    <input style={inputStyle} placeholder="CISO, BT Müdürü, Risk Ekibi" value={yeniTatbikat.katilimcilar || ''}
                      onChange={e => setYeniTatbikat(p => ({ ...p, katilimcilar: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 4 }}>Bulgular / Notlar</label>
                    <input style={inputStyle} placeholder="Tatbikat sonrası doldurulabilir" value={yeniTatbikat.bulgular || ''}
                      onChange={e => setYeniTatbikat(p => ({ ...p, bulgular: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => setTatbikatFormu(false)} style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#64748B' }}>İptal</button>
                  <button onClick={tatbikatEkle} style={{ padding: '7px 20px', background: NAVY, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Kaydet</button>
                </div>
              </div>
            )}

            {/* Tatbikat kartları */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tatbikatlar.map(t => (
                <div key={t.id} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{t.ad}</span>
                        <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 20, fontWeight: 700, background: durumRenk(t.durum), color: 'white' }}>{durumEtiket(t.durum)}</span>
                        <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 20, background: '#EFF6FF', color: '#2563EB', fontWeight: 600 }}>{t.tur}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#64748B' }}>
                        <span>📅 {t.planlanan_tarih || '—'}</span>
                        <span>👥 {t.katilimcilar || '—'}</span>
                        {t.bulgular && <span>📝 {t.bulgular}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(['planlandı', 'tamamlandı', 'iptal'] as const).map(d => (
                        <button key={d} onClick={() => tatbikatDurumGuncelle(t.id, d)}
                          style={{ padding: '5px 10px', background: t.durum === d ? durumRenk(d) : '#F1F5F9', color: t.durum === d ? 'white' : '#64748B', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                          {durumEtiket(d)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {tatbikatlar.length === 0 && (
                <div style={{ background: 'white', border: `1px dashed ${BORDER}`, borderRadius: 12, padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                  Henüz tatbikat planlanmadı.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── BCP ÖZETİ ───────────────────────────────────────────────── */}
        {aktifSekme === 'rapor' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* KPI kartları */}
            {[
              { label: 'Toplam Senaryo', val: senaryolar.length, renk: NAVY },
              { label: 'Onaylı Senaryo', val: senaryolar.filter(s => s.durum === 'onaylı' || s.durum === 'test_edildi').length, renk: GREEN },
              { label: 'RTO/RPO Hedefi', val: rtoCalismalari.length, renk: TEAL },
              { label: 'Planlı Tatbikat', val: tatbikatlar.filter(t => t.durum === 'planlandı').length, renk: AMBER },
            ].map(k => (
              <div key={k.label} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: k.renk, fontFamily: 'DM Mono,monospace' }}>{k.val}</div>
              </div>
            ))}

            {/* BDDK Uyum Durumu */}
            <div style={{ gridColumn: '1 / -1', background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 16 }}>BDDK İSEDES Uyum Durumu</h3>
              {[
                { madde: 'Madde 34', aciklama: 'İş Sürekliliği Politikası', durum: senaryolar.length > 0 },
                { madde: 'Madde 35', aciklama: 'BIA (İş Etki Analizi)', durum: true },
                { madde: 'Madde 36', aciklama: 'RTO/RPO Hedefleri Belirlenmesi', durum: rtoCalismalari.length > 0 },
                { madde: 'Madde 37', aciklama: 'Yıllık Tatbikat Yapılması', durum: tatbikatlar.some(t => t.durum === 'tamamlandı') },
                { madde: 'Madde 38', aciklama: 'BCP Doküman Yönetimi', durum: senaryolar.filter(s => s.durum === 'onaylı').length > 0 },
              ].map(item => (
                <div key={item.madde} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.durum ? GREEN : '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                    {item.durum ? '✓' : '✕'}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', minWidth: 70 }}>{item.madde}</span>
                  <span style={{ fontSize: 13, color: NAVY }}>{item.aciklama}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: item.durum ? GREEN : RED }}>{item.durum ? 'Karşılandı' : 'Eksik'}</span>
                </div>
              ))}
            </div>

            {/* Rapor indirme */}
            <div style={{ gridColumn: '1 / -1', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1D4ED8', marginBottom: 4 }}>BDDK BCP Raporu</div>
                <div style={{ fontSize: 12, color: '#3B82F6' }}>İSEDES Yönetmeliği Madde 34-37 · Senaryo + RTO/RPO + Tatbikat özeti</div>
              </div>
              <button onClick={bddkPdfIndir} disabled={raporUretiyor}
                style={{ padding: '10px 24px', background: raporHazir ? GREEN : '#2563EB', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background .3s' }}>
                {raporUretiyor ? '⏳ Oluşturuluyor…' : raporHazir ? '✓ İndirildi' : '↓ PDF İndir'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
