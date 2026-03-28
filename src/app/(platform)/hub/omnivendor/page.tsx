'use client'
import { useState } from 'react'

const NAVY = '#0A1628'
const TEAL = '#009B8D'
const RED = '#EF4444'
const AMBER = '#F59E0B'
const GREEN = '#22C55E'
const BORDER = '#E2E8F0'

// ─── Tipler ────────────────────────────────────────────────────────────────

type KritiklikSeviyesi = 'kritik' | 'yüksek' | 'orta' | 'düşük'
type TedarikciDurum = 'aktif' | 'izleme' | 'askıya_alındı' | 'sonlandırılıyor'

interface Tedarikci {
  id: string
  ad: string
  kategori: string
  ulke: string
  sehir: string
  kritiklik: KritiklikSeviyesi
  durum: TedarikciDurum
  yillik_sozlesme: number   // ₺K
  tek_kaynak: boolean       // başka tedarikçi yok mu
  son_denetim: string
  bddk_bildirimi: boolean   // BDDK'ya bildirildi mi
  notlar: string
  // Hesaplanan risk skoru (0-100)
  risk_skoru?: number
}

// ─── Risk Skoru Hesabı ───────────────────────────────────────────────────────

function riskSkoru(t: Tedarikci): number {
  let skor = 0
  // Kritiklik
  const kritiklikSkor: Record<KritiklikSeviyesi, number> = { kritik: 40, yüksek: 30, orta: 15, düşük: 5 }
  skor += kritiklikSkor[t.kritiklik]
  // Tek kaynak — konsantrasyon riski
  if (t.tek_kaynak) skor += 25
  // Yüksek sözleşme değeri
  if (t.yillik_sozlesme > 10000) skor += 15
  else if (t.yillik_sozlesme > 1000) skor += 8
  // Yurt dışı tedarikçi — coğrafi risk
  const yurtdisiUlkeler = ['ABD', 'Çin', 'Hindistan', 'Rusya', 'Ukrayna']
  if (yurtdisiUlkeler.includes(t.ulke)) skor += 10
  // Eski denetim
  const denetimYili = t.son_denetim ? parseInt(t.son_denetim.slice(0, 4)) : 0
  const yilFarki = new Date().getFullYear() - denetimYili
  if (yilFarki > 2) skor += 10
  // BDDK bildirimi yapılmamış
  if (!t.bddk_bildirimi && t.kritiklik === 'kritik') skor += 10
  return Math.min(100, skor)
}

// ─── Örnek Veri ─────────────────────────────────────────────────────────────

const ORNEK_TEDARIKCILER: Tedarikci[] = [
  { id: '1', ad: 'Oracle Türkiye', kategori: 'Yazılım / Veritabanı', ulke: 'ABD', sehir: 'İstanbul', kritiklik: 'kritik', durum: 'aktif', yillik_sozlesme: 8500, tek_kaynak: true, son_denetim: '2023-06-15', bddk_bildirimi: true, notlar: 'Core Banking DB lisansı' },
  { id: '2', ad: 'IBM Türkiye', kategori: 'Donanım / Sunucu', ulke: 'ABD', sehir: 'İstanbul', kritiklik: 'yüksek', durum: 'aktif', yillik_sozlesme: 4200, tek_kaynak: false, son_denetim: '2024-01-20', bddk_bildirimi: true, notlar: 'Data center sunucuları' },
  { id: '3', ad: 'Turkcell Altyapı', kategori: 'Telekomünikasyon', ulke: 'Türkiye', sehir: 'İstanbul', kritiklik: 'kritik', durum: 'aktif', yillik_sozlesme: 2100, tek_kaynak: false, son_denetim: '2024-03-10', bddk_bildirimi: true, notlar: 'MPLS ve internet bağlantısı' },
  { id: '4', ad: 'Güven Güvenlik A.Ş.', kategori: 'Fiziksel Güvenlik', ulke: 'Türkiye', sehir: 'Ankara', kritiklik: 'orta', durum: 'izleme', yillik_sozlesme: 650, tek_kaynak: true, son_denetim: '2022-08-05', bddk_bildirimi: false, notlar: 'Şube güvenlik hizmeti' },
  { id: '5', ad: 'Microsoft Azure TR', kategori: 'Bulut Altyapısı', ulke: 'ABD', sehir: 'İstanbul', kritiklik: 'yüksek', durum: 'aktif', yillik_sozlesme: 3800, tek_kaynak: false, son_denetim: '2024-05-22', bddk_bildirimi: true, notlar: 'DR ortamı ve analytics' },
  { id: '6', ad: 'Argela Yazılım', kategori: 'Yazılım Geliştirme', ulke: 'Türkiye', sehir: 'İstanbul', kritiklik: 'orta', durum: 'aktif', yillik_sozlesme: 890, tek_kaynak: false, son_denetim: '2023-11-14', bddk_bildirimi: false, notlar: 'Mobil bankacılık uygulaması' },
]

// ─── Yardımcı ───────────────────────────────────────────────────────────────

function kritiklikRenk(k: KritiklikSeviyesi) {
  return k === 'kritik' ? RED : k === 'yüksek' ? AMBER : k === 'orta' ? TEAL : GREEN
}

function durumRenk(d: TedarikciDurum) {
  if (d === 'aktif') return GREEN
  if (d === 'izleme') return AMBER
  if (d === 'askıya_alındı') return RED
  return '#94A3B8'
}

function riskRenk(s: number) {
  if (s >= 70) return RED
  if (s >= 50) return AMBER
  if (s >= 30) return TEAL
  return GREEN
}

function yeniId() { return Math.random().toString(36).slice(2, 10) }

const KATEGORILER = ['Yazılım / Veritabanı', 'Donanım / Sunucu', 'Telekomünikasyon', 'Bulut Altyapısı', 'Yazılım Geliştirme', 'Fiziksel Güvenlik', 'Lojistik', 'Danışmanlık', 'Enerji', 'Temizlik / Yardımcı']
const ULKELER = ['Türkiye', 'ABD', 'Almanya', 'İngiltere', 'Fransa', 'Çin', 'Hindistan', 'Japonya', 'Hollanda', 'İsviçre', 'Rusya', 'Ukrayna']

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────

export default function OmniVendorPage() {
  const [aktifSekme, setAktifSekme] = useState<'envanter' | 'riskler' | 'konsantrasyon' | 'rapor'>('envanter')
  const [tedarikciler, setTedarikciler] = useState<Tedarikci[]>(
    ORNEK_TEDARIKCILER.map(t => ({ ...t, risk_skoru: riskSkoru(t) }))
  )
  const [aramaMetni, setAramaMetni] = useState('')
  const [kritiklikFiltre, setKritiklikFiltre] = useState<string>('tümü')
  const [formAcik, setFormAcik] = useState(false)
  const [yeniT, setYeniT] = useState<Partial<Tedarikci>>({
    kritiklik: 'orta', durum: 'aktif', ulke: 'Türkiye', tek_kaynak: false, bddk_bildirimi: false,
    kategori: KATEGORILER[0],
  })
  const [seciliId, setSeciliId] = useState<string | null>(null)
  const [raporUretiyor, setRaporUretiyor] = useState(false)
  const [raporHazir, setRaporHazir] = useState(false)

  // ─── Filtre ────────────────────────────────────────────────────────────

  const filtrelenmis = tedarikciler.filter(t => {
    const aramaUyum = !aramaMetni || t.ad.toLowerCase().includes(aramaMetni.toLowerCase()) || t.kategori.toLowerCase().includes(aramaMetni.toLowerCase())
    const kritikUyum = kritiklikFiltre === 'tümü' || t.kritiklik === kritiklikFiltre
    return aramaUyum && kritikUyum
  })

  // Riskle sıralı
  const riskeSirali = [...tedarikciler].sort((a, b) => (b.risk_skoru ?? 0) - (a.risk_skoru ?? 0))

  // ─── Tedarikçi CRUD ────────────────────────────────────────────────────

  function tedarikciEkle() {
    if (!yeniT.ad || !yeniT.sehir) return
    const t: Tedarikci = {
      id: yeniId(),
      ad: yeniT.ad || '',
      kategori: yeniT.kategori || KATEGORILER[0],
      ulke: yeniT.ulke || 'Türkiye',
      sehir: yeniT.sehir || '',
      kritiklik: (yeniT.kritiklik as KritiklikSeviyesi) || 'orta',
      durum: (yeniT.durum as TedarikciDurum) || 'aktif',
      yillik_sozlesme: yeniT.yillik_sozlesme || 0,
      tek_kaynak: yeniT.tek_kaynak || false,
      son_denetim: yeniT.son_denetim || '',
      bddk_bildirimi: yeniT.bddk_bildirimi || false,
      notlar: yeniT.notlar || '',
    }
    const withSkor = { ...t, risk_skoru: riskSkoru(t) }
    setTedarikciler(p => [withSkor, ...p])
    setFormAcik(false)
    setYeniT({ kritiklik: 'orta', durum: 'aktif', ulke: 'Türkiye', tek_kaynak: false, bddk_bildirimi: false, kategori: KATEGORILER[0] })
  }

  function durumGuncelle(id: string, durum: TedarikciDurum) {
    setTedarikciler(p => p.map(t => t.id === id ? { ...t, durum } : t))
  }

  // ─── Coğrafi Konsantrasyon ──────────────────────────────────────────────

  const ulkeSayilari = tedarikciler.reduce<Record<string, { adet: number; toplam: number; kritik: number }>>((acc, t) => {
    if (!acc[t.ulke]) acc[t.ulke] = { adet: 0, toplam: 0, kritik: 0 }
    acc[t.ulke].adet++
    acc[t.ulke].toplam += t.yillik_sozlesme
    if (t.kritiklik === 'kritik') acc[t.ulke].kritik++
    return acc
  }, {})

  const kategoriSayilari = tedarikciler.reduce<Record<string, number>>((acc, t) => {
    acc[t.kategori] = (acc[t.kategori] || 0) + 1
    return acc
  }, {})

  const toplamSozlesme = tedarikciler.reduce((acc, t) => acc + t.yillik_sozlesme, 0)

  // ─── PDF ────────────────────────────────────────────────────────────────

  async function vendorPdfIndir() {
    setRaporUretiyor(true)
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF()
    const now = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })

    doc.setFontSize(16)
    doc.setTextColor(10, 22, 40)
    doc.text('Tedarikçi Risk Raporu', 14, 20)
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Omniversel omniVENDOR · ${now} · Toplam ${tedarikciler.length} tedarikçi`, 14, 28)
    doc.text('BDDK Operasyonel Risk Tebliği · ISO 31000:2018', 14, 35)

    doc.setDrawColor(200, 200, 200)
    doc.line(14, 39, 196, 39)

    // Özet
    autoTable(doc, {
      startY: 44,
      head: [['Tedarikçi Adı', 'Kategori', 'Ülke', 'Kritiklik', 'Risk Skoru', 'Tek Kaynak', 'BDDK', 'Durum']],
      body: riskeSirali.map(t => [
        t.ad, t.kategori, t.ulke,
        t.kritiklik, `${t.risk_skoru ?? 0}`,
        t.tek_kaynak ? 'Evet' : 'Hayır',
        t.bddk_bildirimi ? '✓' : '—',
        t.durum,
      ]),
      headStyles: { fillColor: [10, 22, 40], textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      columnStyles: { 4: { cellWidth: 18 }, 5: { cellWidth: 22 } },
    })

    const y1 = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

    // Ülke konsantrasyon
    doc.setFontSize(11)
    doc.setTextColor(10, 22, 40)
    doc.text('Coğrafi Konsantrasyon', 14, y1)
    autoTable(doc, {
      startY: y1 + 4,
      head: [['Ülke', 'Tedarikçi Sayısı', 'Kritik Tedarikçi', 'Toplam Sözleşme (₺K)']],
      body: Object.entries(ulkeSayilari).sort((a, b) => b[1].toplam - a[1].toplam).map(([ulke, v]) => [ulke, v.adet, v.kritik, v.toplam.toLocaleString('tr-TR')]),
      headStyles: { fillColor: [0, 100, 87], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
    })

    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('Omniversel Platform · omniVENDOR v1.0 · Bu rapor gizlidir.', 14, 285)

    doc.save(`TedarikciRisk-${new Date().toISOString().slice(0, 10)}.pdf`)
    setRaporUretiyor(false)
    setRaporHazir(true)
    setTimeout(() => setRaporHazir(false), 3000)
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  const sekmeStyle = (aktif: boolean) => ({
    padding: '10px 20px', background: aktif ? NAVY : 'transparent',
    color: aktif ? 'white' : '#64748B', border: 'none', borderRadius: 8,
    fontSize: 13, fontWeight: aktif ? 700 : 500, cursor: 'pointer',
  })

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: `1px solid ${BORDER}`,
    borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA',
    boxSizing: 'border-box' as const,
  }

  const secili = seciliId ? tedarikciler.find(t => t.id === seciliId) : null

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Üst Bar */}
      <div style={{ background: NAVY, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>omniVENDOR</div>
          <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>Tedarikçi Envanteri · Risk Skorlaması · Coğrafi Konsantrasyon</div>
        </div>
        <button onClick={vendorPdfIndir} disabled={raporUretiyor}
          style={{ padding: '9px 20px', background: raporHazir ? GREEN : TEAL, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background .3s' }}>
          {raporUretiyor ? '⏳ Oluşturuluyor…' : raporHazir ? '✓ İndirildi' : '↓ Tedarikçi Raporu'}
        </button>
      </div>

      {/* Özet KPI bandı */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '10px 32px', display: 'flex', gap: 32 }}>
        {[
          { label: 'Toplam Tedarikçi', val: tedarikciler.length, renk: NAVY },
          { label: 'Kritik Tedarikçi', val: tedarikciler.filter(t => t.kritiklik === 'kritik').length, renk: RED },
          { label: 'Tek Kaynak', val: tedarikciler.filter(t => t.tek_kaynak).length, renk: AMBER },
          { label: 'Yüksek Risk (≥70)', val: tedarikciler.filter(t => (t.risk_skoru ?? 0) >= 70).length, renk: RED },
          { label: 'Toplam Sözleşme', val: `₺${(toplamSozlesme / 1000).toFixed(1)}M`, renk: TEAL },
        ].map(k => (
          <div key={k.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.renk, fontFamily: 'DM Mono,monospace' }}>{k.val}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Sekmeler */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '8px 32px', display: 'flex', gap: 4 }}>
        {([
          ['envanter', 'Tedarikçi Envanteri'],
          ['riskler', 'Risk Skorlaması'],
          ['konsantrasyon', 'Coğrafi Analiz'],
          ['rapor', 'Özet'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setAktifSekme(key)} style={sekmeStyle(aktifSekme === key)}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: '28px auto', padding: '0 24px' }}>

        {/* ── ENVANTER ────────────────────────────────────────────────── */}
        {aktifSekme === 'envanter' && (
          <div style={{ display: 'grid', gridTemplateColumns: secili ? '1fr 340px' : '1fr', gap: 20 }}>
            <div>
              {/* Araçlar */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
                <input placeholder="Tedarikçi veya kategori ara..." value={aramaMetni} onChange={e => setAramaMetni(e.target.value)}
                  style={{ flex: 1, padding: '8px 14px', border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 13, outline: 'none', background: 'white' }} />
                <select value={kritiklikFiltre} onChange={e => setKritiklikFiltre(e.target.value)}
                  style={{ padding: '8px 12px', border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 13, background: 'white', outline: 'none', cursor: 'pointer' }}>
                  <option value="tümü">Tüm Kritiklik</option>
                  <option value="kritik">Kritik</option>
                  <option value="yüksek">Yüksek</option>
                  <option value="orta">Orta</option>
                  <option value="düşük">Düşük</option>
                </select>
                <button onClick={() => setFormAcik(v => !v)}
                  style={{ padding: '8px 16px', background: TEAL, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  + Tedarikçi Ekle
                </button>
              </div>

              {/* Form */}
              {formAcik && (
                <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 3 }}>Tedarikçi Adı *</label>
                      <input style={inputStyle} placeholder="Şirket adı" value={yeniT.ad || ''} onChange={e => setYeniT(p => ({ ...p, ad: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 3 }}>Kategori</label>
                      <select style={inputStyle} value={yeniT.kategori || ''} onChange={e => setYeniT(p => ({ ...p, kategori: e.target.value }))}>
                        {KATEGORILER.map(k => <option key={k}>{k}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 3 }}>Kritiklik</label>
                      <select style={inputStyle} value={yeniT.kritiklik || 'orta'} onChange={e => setYeniT(p => ({ ...p, kritiklik: e.target.value as KritiklikSeviyesi }))}>
                        <option value="kritik">Kritik</option>
                        <option value="yüksek">Yüksek</option>
                        <option value="orta">Orta</option>
                        <option value="düşük">Düşük</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 3 }}>Ülke</label>
                      <select style={inputStyle} value={yeniT.ulke || 'Türkiye'} onChange={e => setYeniT(p => ({ ...p, ulke: e.target.value }))}>
                        {ULKELER.map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 3 }}>Şehir</label>
                      <input style={inputStyle} placeholder="İstanbul" value={yeniT.sehir || ''} onChange={e => setYeniT(p => ({ ...p, sehir: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 3 }}>Yıllık Sözleşme (₺K)</label>
                      <input type="number" style={inputStyle} placeholder="1000" value={yeniT.yillik_sozlesme || ''} onChange={e => setYeniT(p => ({ ...p, yillik_sozlesme: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 3 }}>Son Denetim</label>
                      <input type="date" style={inputStyle} value={yeniT.son_denetim || ''} onChange={e => setYeniT(p => ({ ...p, son_denetim: e.target.value }))} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'flex-end' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                        <input type="checkbox" checked={yeniT.tek_kaynak || false} onChange={e => setYeniT(p => ({ ...p, tek_kaynak: e.target.checked }))} />
                        Tek Kaynak
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                        <input type="checkbox" checked={yeniT.bddk_bildirimi || false} onChange={e => setYeniT(p => ({ ...p, bddk_bildirimi: e.target.checked }))} />
                        BDDK Bildirimi Yapıldı
                      </label>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 3 }}>Notlar</label>
                      <input style={inputStyle} placeholder="Ek bilgi" value={yeniT.notlar || ''} onChange={e => setYeniT(p => ({ ...p, notlar: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button onClick={() => setFormAcik(false)} style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#64748B' }}>İptal</button>
                    <button onClick={tedarikciEkle} style={{ padding: '7px 20px', background: NAVY, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Kaydet</button>
                  </div>
                </div>
              )}

              {/* Tedarikçi tablosu */}
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F8F9FA', borderBottom: `1px solid ${BORDER}` }}>
                      {['Tedarikçi', 'Kategori', 'Ülke', 'Kritiklik', 'Risk', 'Sözleşme', 'BDDK', 'Durum'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtrelenmis.map(t => (
                      <tr key={t.id} onClick={() => setSeciliId(seciliId === t.id ? null : t.id)}
                        style={{ borderBottom: `1px solid ${BORDER}`, cursor: 'pointer', background: seciliId === t.id ? '#F0FDF9' : 'white', transition: 'background .15s' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 600, color: NAVY }}>{t.ad}</div>
                          {t.tek_kaynak && <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '1px 5px', borderRadius: 4, marginTop: 2, display: 'inline-block' }}>Tek Kaynak</span>}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#64748B', fontSize: 12 }}>{t.kategori}</td>
                        <td style={{ padding: '12px 14px', color: '#374151' }}>{t.ulke}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: kritiklikRenk(t.kritiklik), padding: '2px 8px', borderRadius: 20 }}>{t.kritiklik}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontFamily: 'DM Mono,monospace', fontWeight: 700, color: riskRenk(t.risk_skoru ?? 0) }}>{t.risk_skoru}</td>
                        <td style={{ padding: '12px 14px', color: '#374151' }}>₺{t.yillik_sozlesme.toLocaleString('tr-TR')}K</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: 12, color: t.bddk_bildirimi ? GREEN : '#CBD5E1' }}>{t.bddk_bildirimi ? '✓' : '—'}</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <select value={t.durum} onClick={e => e.stopPropagation()} onChange={e => durumGuncelle(t.id, e.target.value as TedarikciDurum)}
                            style={{ padding: '3px 6px', border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 11, background: durumRenk(t.durum), color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                            <option value="aktif">Aktif</option>
                            <option value="izleme">İzleme</option>
                            <option value="askıya_alındı">Askıya Alındı</option>
                            <option value="sonlandırılıyor">Sonlandırılıyor</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detay panel */}
            {secili && (
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, alignSelf: 'flex-start', position: 'sticky', top: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Tedarikçi Detayı</h3>
                  <button onClick={() => setSeciliId(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 18 }}>×</button>
                </div>

                {/* Risk göstergesi */}
                <div style={{ background: '#F8F9FA', borderRadius: 10, padding: '12px 14px', marginBottom: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>RİSK SKORU</div>
                  <div style={{ fontSize: 48, fontWeight: 800, color: riskRenk(secili.risk_skoru ?? 0), fontFamily: 'DM Mono,monospace' }}>{secili.risk_skoru}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>/ 100</div>
                </div>

                {[
                  ['Kategori', secili.kategori],
                  ['Ülke / Şehir', `${secili.ulke} — ${secili.sehir}`],
                  ['Kritiklik', secili.kritiklik],
                  ['Yıllık Sözleşme', `₺${secili.yillik_sozlesme.toLocaleString('tr-TR')}K`],
                  ['Son Denetim', secili.son_denetim || '—'],
                  ['Tek Kaynak', secili.tek_kaynak ? 'Evet ' : 'Hayır'],
                  ['BDDK Bildirimi', secili.bddk_bildirimi ? 'Yapıldı ✓' : 'Yapılmadı'],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${BORDER}`, fontSize: 12 }}>
                    <span style={{ color: '#94A3B8' }}>{label}</span>
                    <span style={{ color: NAVY, fontWeight: 600, textAlign: 'right', maxWidth: 160 }}>{val}</span>
                  </div>
                ))}

                {secili.notlar && (
                  <div style={{ marginTop: 10, fontSize: 12, color: '#64748B', background: '#F8F9FA', borderRadius: 8, padding: 10 }}>
                     {secili.notlar}
                  </div>
                )}

                <button onClick={() => { setTedarikciler(p => p.filter(t => t.id !== secili.id)); setSeciliId(null) }}
                  style={{ marginTop: 14, width: '100%', padding: '8px', background: '#FEF2F2', color: RED, border: `1px solid #FCA5A5`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  Tedarikçiyi Sil
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── RİSK SKORLAMASI ─────────────────────────────────────────── */}
        {aktifSekme === 'riskler' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Risk Skorlaması</h2>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>Kritiklik × Tek Kaynak × Sözleşme Değeri × Coğrafi Risk × Denetim Gecikme faktörleri</p>
            </div>

            {/* Yüksek riskler */}
            {[
              { baslik: ' Yüksek Risk (≥ 70)', filtre: (t: Tedarikci) => (t.risk_skoru ?? 0) >= 70, renk: '#FFF7F7', kenarlık: '#FCA5A5' },
              { baslik: ' Orta Risk (40–69)', filtre: (t: Tedarikci) => (t.risk_skoru ?? 0) >= 40 && (t.risk_skoru ?? 0) < 70, renk: '#FFFBEB', kenarlık: '#FDE68A' },
              { baslik: ' Düşük Risk (< 40)', filtre: (t: Tedarikci) => (t.risk_skoru ?? 0) < 40, renk: '#F0FDF4', kenarlık: '#86EFAC' },
            ].map(grup => {
              const liste = riskeSirali.filter(grup.filtre)
              if (liste.length === 0) return null
              return (
                <div key={grup.baslik} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{ padding: '10px 16px', background: grup.renk, borderBottom: `1px solid ${grup.kenarlık}` }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{grup.baslik} — {liste.length} tedarikçi</h3>
                  </div>
                  {liste.map(t => (
                    <div key={t.id} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: riskRenk(t.risk_skoru ?? 0), fontFamily: 'DM Mono,monospace', minWidth: 42 }}>{t.risk_skoru}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: NAVY, fontSize: 13 }}>{t.ad}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>{t.kategori} · {t.ulke}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {t.tek_kaynak && <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 4 }}>Tek Kaynak</span>}
                        {!t.bddk_bildirimi && t.kritiklik === 'kritik' && <span style={{ fontSize: 10, background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: 4 }}>BDDK Eksik</span>}
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: kritiklikRenk(t.kritiklik), padding: '2px 8px', borderRadius: 20 }}>{t.kritiklik}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}

            {/* Risk faktörleri açıklaması */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1D4ED8', marginBottom: 8 }}>Risk Skoru Faktörleri</div>
              {[
                ['Kritiklik: Kritik', '+ 40 puan'],
                ['Kritiklik: Yüksek', '+ 30 puan'],
                ['Tek Kaynak / Konsantrasyon', '+ 25 puan'],
                ['Sözleşme > ₺10M', '+ 15 puan'],
                ['Yurt Dışı Tedarikçi (yüksek riskli ülke)', '+ 10 puan'],
                ['Son Denetim > 2 yıl önce', '+ 10 puan'],
                ['Kritik Tedarikçi — BDDK Bildirimi Yok', '+ 10 puan'],
              ].map(([f, p]) => (
                <div key={f} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #BFDBFE', fontSize: 12 }}>
                  <span style={{ color: '#1E40AF' }}>{f}</span>
                  <span style={{ fontWeight: 700, color: '#1D4ED8', fontFamily: 'DM Mono,monospace' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COĞRAFİ ANALİZ ──────────────────────────────────────────── */}
        {aktifSekme === 'konsantrasyon' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Coğrafi Konsantrasyon Analizi</h2>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>BDDK Operasyonel Risk Tebliği — Coğrafi yoğunlaşma riski</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Ülke dağılımı */}
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}` }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Ülke Bazlı Konsantrasyon</h3>
                </div>
                {Object.entries(ulkeSayilari).sort((a, b) => b[1].toplam - a[1].toplam).map(([ulke, v]) => {
                  const oran = Math.round((v.toplam / toplamSozlesme) * 100)
                  return (
                    <div key={ulke} style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{ulke}</span>
                          {v.kritik > 0 && <span style={{ fontSize: 10, background: '#FEE2E2', color: '#991B1B', padding: '1px 5px', borderRadius: 4, marginLeft: 6 }}>{v.kritik} kritik</span>}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: oran >= 40 ? RED : oran >= 25 ? AMBER : '#374151' }}>%{oran}</span>
                          <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 4 }}>({v.adet} tedarikçi)</span>
                        </div>
                      </div>
                      <div style={{ background: '#F1F5F9', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                        <div style={{ background: oran >= 40 ? RED : oran >= 25 ? AMBER : TEAL, width: `${oran}%`, height: '100%', borderRadius: 99, transition: 'width .5s' }} />
                      </div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>₺{v.toplam.toLocaleString('tr-TR')}K</div>
                    </div>
                  )
                })}
              </div>

              {/* Kategori dağılımı */}
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}` }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Kategori Dağılımı</h3>
                </div>
                {Object.entries(kategoriSayilari).sort((a, b) => b[1] - a[1]).map(([kat, adet]) => {
                  const oran = Math.round((adet / tedarikciler.length) * 100)
                  return (
                    <div key={kat} style={{ padding: '10px 16px', borderBottom: `1px solid ${BORDER}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: '#374151' }}>{kat}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{adet}</span>
                      </div>
                      <div style={{ background: '#F1F5F9', borderRadius: 99, height: 5, overflow: 'hidden' }}>
                        <div style={{ background: TEAL, width: `${oran}%`, height: '100%', borderRadius: 99 }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Uyarı banner */}
              {Object.entries(ulkeSayilari).some(([, v]) => v.toplam / toplamSozlesme >= 0.4) && (
                <div style={{ gridColumn: '1 / -1', background: '#FFF7F7', border: '1px solid #FCA5A5', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: RED, marginBottom: 4 }}> Coğrafi Konsantrasyon Uyarısı</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>
                    Bir veya birden fazla ülke toplam sözleşme değerinin %40'ını aşıyor. BDDK Operasyonel Risk Tebliği kapsamında konsantrasyon riski azaltma planı hazırlanması önerilir.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ÖZET ───────────────────────────────────────────────────── */}
        {aktifSekme === 'rapor' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Toplam Tedarikçi', val: tedarikciler.length, renk: NAVY },
              { label: 'Kritik Tedarikçi', val: tedarikciler.filter(t => t.kritiklik === 'kritik').length, renk: RED },
              { label: 'Tek Kaynak Tedarikçi', val: tedarikciler.filter(t => t.tek_kaynak).length, renk: AMBER },
              { label: 'Yüksek Risk (≥70)', val: tedarikciler.filter(t => (t.risk_skoru ?? 0) >= 70).length, renk: RED },
              { label: 'BDDK Bildirimi Yapılmamış', val: tedarikciler.filter(t => !t.bddk_bildirimi && t.kritiklik === 'kritik').length, renk: AMBER },
              { label: 'Ortalama Risk Skoru', val: tedarikciler.length > 0 ? Math.round(tedarikciler.reduce((a, t) => a + (t.risk_skoru ?? 0), 0) / tedarikciler.length) : 0, renk: TEAL },
            ].map(k => (
              <div key={k.label} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: k.renk, fontFamily: 'DM Mono,monospace' }}>{k.val}</div>
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1D4ED8', marginBottom: 4 }}>Tedarikçi Risk Raporu</div>
                <div style={{ fontSize: 12, color: '#3B82F6' }}>Envanter + Risk Skorlama + Coğrafi Konsantrasyon analizi</div>
              </div>
              <button onClick={vendorPdfIndir} disabled={raporUretiyor}
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
