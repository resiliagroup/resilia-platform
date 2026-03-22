'use client'
import { useState } from 'react'

const NAVY = '#0A1628'
const TEAL = '#009B8D'
const RED = '#EF4444'
const AMBER = '#F59E0B'
const GREEN = '#22C55E'
const BLUE = '#2563EB'
const BORDER = '#E2E8F0'

// ─── Uyum Kontrol Listeleri ──────────────────────────────────────────────────

interface KontrolMaddesi {
  id: string
  madde: string
  baslik: string
  aciklama: string
  kontrol: boolean | null  // null = değerlendirilmedi
  bulgu: string
  kategori: string
}

const ISEDES_MADDELER: KontrolMaddesi[] = [
  { id: 'i01', madde: 'Madde 6', baslik: 'İSEDES Politikası', aciklama: 'Üst yönetim tarafından onaylanmış ve duyurulmuş bir İSEDES politikası mevcut mu?', kontrol: null, bulgu: '', kategori: 'İSEDES' },
  { id: 'i02', madde: 'Madde 12', baslik: 'Risk İştahı Çerçevesi', aciklama: 'Kurumun risk iştahı belirlenmiş ve Yönetim Kurulu onayı alınmış mı?', kontrol: null, bulgu: '', kategori: 'İSEDES' },
  { id: 'i03', madde: 'Madde 17', baslik: 'ICAAP Süreci', aciklama: 'İç sermaye yeterliliği değerlendirme süreci (ICAAP) tesis edilmiş ve yıllık olarak güncelleniyor mu?', kontrol: null, bulgu: '', kategori: 'İSEDES' },
  { id: 'i04', madde: 'Madde 22', baslik: 'Stres Testi', aciklama: 'Operasyonel risk stres testleri düzenli olarak yapılıyor mu?', kontrol: null, bulgu: '', kategori: 'İSEDES' },
  { id: 'i05', madde: 'Madde 28', baslik: 'Operasyonel Risk Kaydı', aciklama: 'Operasyonel kayıp olayları kayıt altına alınıyor ve raporlanıyor mu?', kontrol: null, bulgu: '', kategori: 'İSEDES' },
  { id: 'i06', madde: 'Madde 34', baslik: 'BCP Politikası', aciklama: 'İş sürekliliği politikası mevcuttur ve son 1 yıl içinde güncellenmiştir.', kontrol: null, bulgu: '', kategori: 'İSEDES' },
  { id: 'i07', madde: 'Madde 35', baslik: 'BIA Raporu', aciklama: 'İş Etki Analizi (BIA) tamamlanmış ve MTPD hesabı yapılmıştır.', kontrol: null, bulgu: '', kategori: 'İSEDES' },
  { id: 'i08', madde: 'Madde 36', baslik: 'RTO/RPO Hedefleri', aciklama: 'Kritik süreçler için RTO ve RPO hedefleri belirlenmiş ve test edilmiştir.', kontrol: null, bulgu: '', kategori: 'İSEDES' },
  { id: 'i09', madde: 'Madde 37', baslik: 'Tatbikat', aciklama: 'Yılda en az 1 tatbikat gerçekleştirilmiş ve bulguları kayıt altına alınmıştır.', kontrol: null, bulgu: '', kategori: 'İSEDES' },
  { id: 'i10', madde: 'Madde 39', baslik: 'AAR & Öğrenilen Dersler', aciklama: 'Olaylar sonrasında AAR yapılmış ve öğrenilen dersler süreçlere yansıtılmıştır.', kontrol: null, bulgu: '', kategori: 'İSEDES' },
]

const IKLIM_MADDELER: KontrolMaddesi[] = [
  { id: 'k01', madde: 'Bölüm 2.1', baslik: 'İklim Risk Yönetişimi', aciklama: 'İklim risklerinden sorumlu Yönetim Kurulu komitesi veya birimi atanmış mı?', kontrol: null, bulgu: '', kategori: 'İklim' },
  { id: 'k02', madde: 'Bölüm 2.2', baslik: 'Fiziksel Risk Değerlendirmesi', aciklama: 'Sel, aşırı sıcaklık, kuraklık gibi fiziksel iklim riskleri değerlendirilmiş mi?', kontrol: null, bulgu: '', kategori: 'İklim' },
  { id: 'k03', madde: 'Bölüm 2.3', baslik: 'Geçiş Riski Değerlendirmesi', aciklama: 'Düzenleyici değişiklik ve düşük karbonlu ekonomiye geçiş riskleri analiz edilmiş mi?', kontrol: null, bulgu: '', kategori: 'İklim' },
  { id: 'k04', madde: 'Bölüm 3.1', baslik: 'İklim Senaryo Analizi', aciklama: 'NGFS senaryoları veya eşdeğeri iklim senaryoları stres testine dahil edilmiş mi?', kontrol: null, bulgu: '', kategori: 'İklim' },
  { id: 'k05', madde: 'Bölüm 4.1', baslik: 'TCFD Açıklaması', aciklama: 'TCFD çerçevesine uygun iklim açıklaması hazırlanıyor mu?', kontrol: null, bulgu: '', kategori: 'İklim' },
  { id: 'k06', madde: 'Bölüm 5.2', baslik: 'Karbon Ayak İzi', aciklama: 'Kredi portföyünün karbonluluk ölçümü yapılıyor mu?', kontrol: null, bulgu: '', kategori: 'İklim' },
]

const BASEL_MADDELER: KontrolMaddesi[] = [
  { id: 'b01', madde: 'Basel IV — SA-CCR', baslik: 'Türev Ürün Kredi Riski', aciklama: 'Standart yaklaşım — karşı taraf kredi riski (SA-CCR) uygulaması tamamlandı mı?', kontrol: null, bulgu: '', kategori: 'Basel IV' },
  { id: 'b02', madde: 'Basel IV — CVA', baslik: 'Kredi Değerleme Ayarlaması', aciklama: 'CVA sermaye gereklilikleri yeni standart yaklaşımla hesaplanıyor mu?', kontrol: null, bulgu: '', kategori: 'Basel IV' },
  { id: 'b03', madde: 'Basel IV — Output Floor', baslik: 'Çıktı Tabanı', aciklama: 'İçsel model tahminleri standart yaklaşımın %72.5 tabanına uyum sağlıyor mu?', kontrol: null, bulgu: '', kategori: 'Basel IV' },
  { id: 'b04', madde: 'Basel IV — Operasyonel Risk', baslik: 'SMA Yöntemi', aciklama: 'Standart Ölçüm Yaklaşımı (SMA) operasyonel risk sermayesi hesabına geçildi mi?', kontrol: null, bulgu: '', kategori: 'Basel IV' },
  { id: 'b05', madde: 'Basel IV — Piyasa Riski', baslik: 'FRTB', aciklama: 'Alım Satım Portföyünün Temel Revizyonu (FRTB) uygulaması planlanmış mı?', kontrol: null, bulgu: '', kategori: 'Basel IV' },
  { id: 'b06', madde: 'Basel IV — Açıklama', baslik: 'Pillar 3 Açıklamaları', aciklama: 'Revize edilmiş Pillar 3 kamuoyu açıklama gereklilikleri yerine getirilmiş mi?', kontrol: null, bulgu: '', kategori: 'Basel IV' },
]

// ─── Yardımcı ───────────────────────────────────────────────────────────────

function uyumSkoru(maddeler: KontrolMaddesi[]) {
  const degerlendirilmis = maddeler.filter(m => m.kontrol !== null)
  if (degerlendirilmis.length === 0) return { skor: 0, oran: 0, tamamlanan: 0, toplam: maddeler.length }
  const tamamlanan = degerlendirilmis.filter(m => m.kontrol === true).length
  const skor = Math.round((tamamlanan / maddeler.length) * 100)
  const oran = Math.round((degerlendirilmis.length / maddeler.length) * 100)
  return { skor, oran, tamamlanan, toplam: maddeler.length, degerlendirilmis: degerlendirilmis.length }
}

function skorRenk(s: number) {
  if (s >= 80) return GREEN
  if (s >= 60) return TEAL
  if (s >= 40) return AMBER
  return RED
}

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────

export default function OmniAuditPage() {
  const [aktifSekme, setAktifSekme] = useState<'isedes' | 'iklim' | 'basel' | 'ozet'>('isedes')

  const [isedes, setIsedes] = useState(ISEDES_MADDELER)
  const [iklim, setIklim] = useState(IKLIM_MADDELER)
  const [basel, setBasel] = useState(BASEL_MADDELER)

  const [acikBulgu, setAcikBulgu] = useState<string | null>(null)
  const [bulguMetin, setBulguMetin] = useState('')

  const [raporUretiyor, setRaporUretiyor] = useState(false)
  const [raporHazir, setRaporHazir] = useState(false)

  function maddeGuncelle(setFn: typeof setIsedes, id: string, kontrol: boolean) {
    setFn(prev => prev.map(m => m.id === id ? { ...m, kontrol } : m))
  }

  function bulguKaydet(setFn: typeof setIsedes, id: string) {
    setFn(prev => prev.map(m => m.id === id ? { ...m, bulgu: bulguMetin } : m))
    setAcikBulgu(null)
    setBulguMetin('')
  }

  function aktifSetFn() {
    if (aktifSekme === 'isedes') return setIsedes
    if (aktifSekme === 'iklim') return setIklim
    return setBasel
  }

  function aktifMaddeler() {
    if (aktifSekme === 'isedes') return isedes
    if (aktifSekme === 'iklim') return iklim
    if (aktifSekme === 'basel') return basel
    return []
  }

  // ─── BDDK Denetim PDF ───────────────────────────────────────────────────

  async function denetimPdfIndir() {
    setRaporUretiyor(true)
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF()
    const now = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })

    const isedesS = uyumSkoru(isedes)
    const iklimS = uyumSkoru(iklim)
    const baselS = uyumSkoru(basel)

    doc.setFontSize(16)
    doc.setTextColor(10, 22, 40)
    doc.text('Düzenleyici Uyum Denetim Raporu', 14, 20)
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Omniversel omniAUDIT · Rapor Tarihi: ${now}`, 14, 28)

    doc.setDrawColor(200, 200, 200)
    doc.line(14, 32, 196, 32)

    // Özet skorlar
    doc.setFontSize(11)
    doc.setTextColor(10, 22, 40)
    doc.text('Özet Uyum Skorları', 14, 42)
    autoTable(doc, {
      startY: 46,
      head: [['Çerçeve', 'Uyum Skoru', 'Tamamlanan', 'Toplam Madde', 'Değerlendirme Oranı']],
      body: [
        ['BDDK İSEDES', `%${isedesS.skor}`, isedesS.tamamlanan, isedesS.toplam, `%${isedesS.oran}`],
        ['BDDK İklim Rehberi', `%${iklimS.skor}`, iklimS.tamamlanan, iklimS.toplam, `%${iklimS.oran}`],
        ['Basel IV', `%${baselS.skor}`, baselS.tamamlanan, baselS.toplam, `%${baselS.oran}`],
      ],
      headStyles: { fillColor: [10, 22, 40], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9 },
    })

    const y1 = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

    // İSEDES detay
    doc.setFontSize(11)
    doc.setTextColor(10, 22, 40)
    doc.text('BDDK İSEDES Kontrol Listesi', 14, y1)
    autoTable(doc, {
      startY: y1 + 4,
      head: [['Madde', 'Başlık', 'Durum', 'Bulgu']],
      body: isedes.map(m => [m.madde, m.baslik, m.kontrol === null ? '—' : m.kontrol ? '✓ Uyumlu' : '✗ Eksik', m.bulgu || '—']),
      headStyles: { fillColor: [0, 100, 87], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [240, 253, 249] },
      columnStyles: { 0: { cellWidth: 22 }, 2: { cellWidth: 22 } },
    })

    const y2 = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

    // İklim detay
    doc.setFontSize(11)
    doc.setTextColor(10, 22, 40)
    doc.text('BDDK İklim Riski Rehberi', 14, y2)
    autoTable(doc, {
      startY: y2 + 4,
      head: [['Bölüm', 'Başlık', 'Durum', 'Bulgu']],
      body: iklim.map(m => [m.madde, m.baslik, m.kontrol === null ? '—' : m.kontrol ? '✓ Uyumlu' : '✗ Eksik', m.bulgu || '—']),
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [239, 246, 255] },
    })

    const y3 = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10

    // Basel detay
    doc.setFontSize(11)
    doc.setTextColor(10, 22, 40)
    doc.text('Basel IV Uyum Durumu', 14, y3)
    autoTable(doc, {
      startY: y3 + 4,
      head: [['Standart', 'Başlık', 'Durum', 'Bulgu']],
      body: basel.map(m => [m.madde, m.baslik, m.kontrol === null ? '—' : m.kontrol ? '✓ Uyumlu' : '✗ Eksik', m.bulgu || '—']),
      headStyles: { fillColor: [124, 58, 237], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 243, 255] },
    })

    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('Omniversel Platform · omniAUDIT v1.0 · Bu rapor gizlidir.', 14, 285)

    doc.save(`DenetimRaporu-${new Date().toISOString().slice(0, 10)}.pdf`)
    setRaporUretiyor(false)
    setRaporHazir(true)
    setTimeout(() => setRaporHazir(false), 3000)
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  const sekmeStyle = (aktif: boolean) => ({
    padding: '10px 20px',
    background: aktif ? NAVY : 'transparent',
    color: aktif ? 'white' : '#64748B',
    border: 'none', borderRadius: 8,
    fontSize: 13, fontWeight: aktif ? 700 : 500, cursor: 'pointer',
  })

  function KontrolListesi({ maddeler, setFn }: { maddeler: KontrolMaddesi[]; setFn: typeof setIsedes }) {
    const s = uyumSkoru(maddeler)
    return (
      <div>
        {/* Skor */}
        <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: skorRenk(s.skor), fontFamily: 'DM Mono,monospace' }}>%{s.skor}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>Uyum Skoru</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#64748B' }}>Değerlendirme İlerlemesi</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{s.degerlendirilmis ?? 0} / {s.toplam}</span>
            </div>
            <div style={{ background: '#F1F5F9', borderRadius: 99, height: 10, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ background: TEAL, width: `${s.oran}%`, height: '100%', borderRadius: 99, transition: 'width .5s' }} />
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
              <span style={{ color: GREEN }}>✓ Uyumlu: {s.tamamlanan}</span>
              <span style={{ color: RED }}>✗ Eksik: {(s.degerlendirilmis ?? 0) - s.tamamlanan}</span>
              <span style={{ color: '#94A3B8' }}>— Değerlendirilmedi: {s.toplam - (s.degerlendirilmis ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Madde listesi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {maddeler.map(m => (
            <div key={m.id} style={{ background: 'white', border: `1px solid ${m.kontrol === true ? '#86EFAC' : m.kontrol === false ? '#FCA5A5' : BORDER}`, borderRadius: 10, padding: '14px 16px', transition: 'border-color .2s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                {/* Onay butonları */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginTop: 2 }}>
                  <button onClick={() => maddeGuncelle(setFn, m.id, true)}
                    style={{ width: 28, height: 28, borderRadius: 6, border: `2px solid ${m.kontrol === true ? GREEN : BORDER}`, background: m.kontrol === true ? '#DCFCE7' : 'white', cursor: 'pointer', fontSize: 14, color: GREEN, fontWeight: 700 }}>
                    ✓
                  </button>
                  <button onClick={() => maddeGuncelle(setFn, m.id, false)}
                    style={{ width: 28, height: 28, borderRadius: 6, border: `2px solid ${m.kontrol === false ? RED : BORDER}`, background: m.kontrol === false ? '#FEE2E2' : 'white', cursor: 'pointer', fontSize: 14, color: RED, fontWeight: 700 }}>
                    ✕
                  </button>
                </div>

                {/* İçerik */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', fontFamily: 'DM Mono,monospace' }}>{m.madde}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{m.baslik}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{m.aciklama}</div>

                  {/* Bulgu */}
                  {acikBulgu === m.id ? (
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                      <input value={bulguMetin} onChange={e => setBulguMetin(e.target.value)}
                        placeholder="Denetim bulgusu / not..."
                        style={{ flex: 1, padding: '6px 10px', border: `1px solid ${BORDER}`, borderRadius: 7, fontSize: 12, outline: 'none', background: '#FAFAFA' }} />
                      <button onClick={() => bulguKaydet(setFn, m.id)}
                        style={{ padding: '6px 12px', background: TEAL, color: 'white', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Kaydet</button>
                      <button onClick={() => setAcikBulgu(null)}
                        style={{ padding: '6px 10px', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 7, fontSize: 12, cursor: 'pointer', color: '#64748B' }}>İptal</button>
                    </div>
                  ) : (
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {m.bulgu && <span style={{ fontSize: 11, color: '#64748B', background: '#F8F9FA', padding: '2px 8px', borderRadius: 6 }}>📝 {m.bulgu}</span>}
                      <button onClick={() => { setAcikBulgu(m.id); setBulguMetin(m.bulgu) }}
                        style={{ background: 'transparent', border: 'none', color: TEAL, fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                        {m.bulgu ? 'Düzenle' : '+ Bulgu Ekle'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const isedesS = uyumSkoru(isedes)
  const iklimS = uyumSkoru(iklim)
  const baselS = uyumSkoru(basel)
  const genelSkor = Math.round((isedesS.skor + iklimS.skor + baselS.skor) / 3)

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Üst Bar */}
      <div style={{ background: NAVY, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>omniAUDIT</div>
          <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>BDDK İSEDES · İklim Riski Rehberi · Basel IV Uyum Kontrolü</div>
        </div>
        <button onClick={denetimPdfIndir} disabled={raporUretiyor}
          style={{ padding: '9px 20px', background: raporHazir ? GREEN : TEAL, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background .3s' }}>
          {raporUretiyor ? '⏳ Oluşturuluyor…' : raporHazir ? '✓ İndirildi' : '↓ Denetim Raporu'}
        </button>
      </div>

      {/* Özet skor bandı */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '10px 32px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: skorRenk(genelSkor), fontFamily: 'DM Mono,monospace' }}>%{genelSkor}</div>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>Genel Uyum</div>
        </div>
        {[
          { label: 'İSEDES', skor: isedesS.skor },
          { label: 'İklim', skor: iklimS.skor },
          { label: 'Basel IV', skor: baselS.skor },
        ].map(x => (
          <div key={x.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 44, height: 4, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${x.skor}%`, height: '100%', background: skorRenk(x.skor), borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 12, color: '#64748B' }}>{x.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: skorRenk(x.skor) }}>%{x.skor}</span>
          </div>
        ))}
      </div>

      {/* Sekmeler */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '8px 32px', display: 'flex', gap: 4 }}>
        {([
          ['isedes', 'BDDK İSEDES'],
          ['iklim', 'İklim Riski Rehberi'],
          ['basel', 'Basel IV'],
          ['ozet', 'Uyum Özeti'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setAktifSekme(key)} style={sekmeStyle(aktifSekme === key)}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 960, margin: '28px auto', padding: '0 24px' }}>

        {aktifSekme === 'isedes' && <KontrolListesi maddeler={isedes} setFn={setIsedes} />}
        {aktifSekme === 'iklim' && <KontrolListesi maddeler={iklim} setFn={setIklim} />}
        {aktifSekme === 'basel' && <KontrolListesi maddeler={basel} setFn={setBasel} />}

        {/* ── UYUM ÖZETİ ──────────────────────────────────────────────── */}
        {aktifSekme === 'ozet' && (
          <div>
            {/* Skor kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'BDDK İSEDES', aciklama: '10 kontrol maddesi', skor: isedesS.skor, renk: TEAL, tamamlanan: isedesS.tamamlanan, toplam: isedesS.toplam },
                { label: 'İklim Riski Rehberi', aciklama: '6 kontrol maddesi', skor: iklimS.skor, renk: BLUE, tamamlanan: iklimS.tamamlanan, toplam: iklimS.toplam },
                { label: 'Basel IV', aciklama: '6 kontrol maddesi', skor: baselS.skor, renk: '#7C3AED', tamamlanan: baselS.tamamlanan, toplam: baselS.toplam },
              ].map(k => (
                <div key={k.label} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 11, color: '#CBD5E1', marginBottom: 12 }}>{k.aciklama}</div>
                  <div style={{ fontSize: 40, fontWeight: 800, color: skorRenk(k.skor), fontFamily: 'DM Mono,monospace', marginBottom: 8 }}>%{k.skor}</div>
                  <div style={{ background: '#F1F5F9', borderRadius: 99, height: 8, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ background: skorRenk(k.skor), width: `${k.skor}%`, height: '100%', borderRadius: 99, transition: 'width .5s' }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{k.tamamlanan}/{k.toplam} madde uyumlu</div>
                </div>
              ))}
            </div>

            {/* Eksik maddeler */}
            {[
              { label: 'BDDK İSEDES — Eksik Maddeler', maddeler: isedes.filter(m => m.kontrol === false), renk: TEAL },
              { label: 'İklim Riski — Eksik Maddeler', maddeler: iklim.filter(m => m.kontrol === false), renk: BLUE },
              { label: 'Basel IV — Eksik Maddeler', maddeler: basel.filter(m => m.kontrol === false), renk: '#7C3AED' },
            ].filter(x => x.maddeler.length > 0).map(x => (
              <div key={x.label} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, background: '#FFF7F7' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: RED }}>⚠️ {x.label}</h3>
                </div>
                {x.maddeler.map(m => (
                  <div key={m.id} style={{ padding: '10px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', minWidth: 80, fontFamily: 'DM Mono,monospace' }}>{m.madde}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{m.baslik}</div>
                      {m.bulgu && <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>📝 {m.bulgu}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* İndir */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1D4ED8', marginBottom: 4 }}>Düzenleyici Uyum Denetim Raporu</div>
                <div style={{ fontSize: 12, color: '#3B82F6' }}>İSEDES + İklim Riski + Basel IV kontrol listesi çıktısı</div>
              </div>
              <button onClick={denetimPdfIndir} disabled={raporUretiyor}
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
