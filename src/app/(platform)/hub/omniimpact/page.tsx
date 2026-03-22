'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import Link from 'next/link'

// ── Supabase ──────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const TENANT_BD = '11111111-0000-0000-0000-000000000001'

// ── Renkler ───────────────────────────────────────────────────
const NAVY = '#0A1628'; const TEAL = '#009B8D'; const BORDER = '#E2E8F0'
const AMBER = '#F59E0B'; const RED = '#EF4444'; const GREEN = '#22C55E'

// ── Sabitler ──────────────────────────────────────────────────
const RTO_SECENEKLER = ['< 1 saat', '4 saat', '8 saat', '24 saat', '72 saat']
const RPO_SECENEKLER = ['< 15 dak.', '1 saat', '4 saat', '8 saat', '24 saat']
const KESINTI_SURELERI = [
  { etiket: '1 Saat', saat: 1 },
  { etiket: '4 Saat', saat: 4 },
  { etiket: '8 Saat', saat: 8 },
  { etiket: '1 Gün',  saat: 24 },
  { etiket: '3 Gün',  saat: 72 },
  { etiket: '1 Hafta', saat: 168 },
]

// ── Tipler ────────────────────────────────────────────────────
interface Surec {
  id: string
  ad: string
  sahip: string
  bagimli_sistemler: string
  bagimli_personel: string
  // Etki değerlendirme (₺)
  etki_1saat: string
  etki_4saat: string
  etki_1gun: string
  etki_1hafta: string
  // RTO/RPO
  rto: string
  rpo: string
  // Hesaplanan
  saatlik_gelir?: number
}

interface Tesis {
  id: string
  name: string
  uri?: number
  riskSinifi?: string
}

function bosSurec(id: string): Surec {
  return {
    id, ad: '', sahip: '', bagimli_sistemler: '', bagimli_personel: '',
    etki_1saat: '', etki_4saat: '', etki_1gun: '', etki_1hafta: '',
    rto: '4 saat', rpo: '1 saat',
  }
}

// ── Yardımcı ──────────────────────────────────────────────────
function tlFormat(sayi: number): string {
  if (sayi >= 1_000_000) return `₺${(sayi / 1_000_000).toFixed(1)}M`
  if (sayi >= 1_000)     return `₺${(sayi / 1_000).toFixed(0)}K`
  return `₺${Math.round(sayi).toLocaleString('tr-TR')}`
}

// MTPD: tüm kritik süreçlerin etki eşiğini aştığı en kısa süre
function mtpdHesapla(surecler: Surec[]): number {
  if (surecler.length === 0) return 0
  // Her süreç için 4 saatte toplam etki eşiğini (1 saatlik × 2) aşma süresi
  const esikler = surecler.map(s => {
    const saatlik = parseFloat(s.etki_1saat.replace(/[^0-9.]/g, '')) || 0
    if (saatlik === 0) return 999
    // 4 saatlik etki / saatlik oran — eşik olarak saatlik × 3 kullan
    const esik = saatlik * 3
    const dort_saatlik = parseFloat(s.etki_4saat.replace(/[^0-9.]/g, '')) || saatlik * 4
    if (dort_saatlik >= esik) return 4
    return 24
  })
  return Math.min(...esikler)
}

// Kümülatif kayıp grafiği için veri
function grafikVerisi(surecler: Surec[]) {
  return KESINTI_SURELERI.map(({ etiket, saat }) => {
    const toplam = surecler.reduce((acc, s) => {
      const saatlik = parseFloat(s.etki_1saat.replace(/[^0-9.]/g, '')) || 0
      let etki: number
      if (saat <= 1)        etki = parseFloat(s.etki_1saat.replace(/[^0-9.]/g, '')) || 0
      else if (saat <= 4)   etki = parseFloat(s.etki_4saat.replace(/[^0-9.]/g, '')) || saatlik * saat
      else if (saat <= 24)  etki = parseFloat(s.etki_1gun.replace(/[^0-9.]/g, '')) || saatlik * saat
      else                  etki = parseFloat(s.etki_1hafta.replace(/[^0-9.]/g, '')) || saatlik * saat
      return acc + etki
    }, 0)
    return { sure: etiket, kayip: Math.round(toplam / 1000) } // ₺K
  })
}

// ── Ana Bileşen ───────────────────────────────────────────────
export default function OmniImpactPage() {
  const [adim, setAdim] = useState<0 | 1 | 2 | 3>(0)
  const [seciliTesis, setSeciliTesis] = useState<Tesis | null>(null)
  const [tesisler, setTesisler] = useState<Tesis[]>([])
  const [tesisYukleniyor, setTesisYukleniyor] = useState(true)
  const [surecler, setSurecler] = useState<Surec[]>([bosSurec('1')])
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [kaydedildi, setKaydedildi] = useState(false)
  const [hata, setHata] = useState('')

  // omniRISK'ten tesisleri çek (Supabase facilities tablosu)
  const tesisleriYukle = useCallback(async () => {
    setTesisYukleniyor(true)
    try {
      const { data } = await supabase
        .from('facilities')
        .select('id, name, extra_data')
        .eq('tenant_id', TENANT_BD)
        .eq('is_active', true)
        .limit(100)

      const liste: Tesis[] = (data ?? []).map((f: { id: string; name: string; extra_data: Record<string, number> | null }) => {
        const ed = f.extra_data as Record<string, number> | null
        const uri = ed
          ? Math.round(Math.max(0, Math.min(100,
              100 - ((ed.H_score ?? 0) / 5 * 100 * 0.3 + (ed.F_score ?? 0) / 5 * 100 * 0.3 + (ed.X_score ?? 0) / 5 * 100 * 0.2) / 100 + (ed.C_score ?? 0) / 5 * 100 * 0.2
            )))
          : undefined
        return {
          id: f.id,
          name: f.name,
          uri,
          riskSinifi: uri === undefined ? undefined : uri < 40 ? 'Kritik' : uri < 60 ? 'Yüksek' : uri < 75 ? 'Orta' : 'Dirençli',
        }
      })
      setTesisler(liste)
    } catch { setHata('Tesisler yüklenemedi.') }
    setTesisYukleniyor(false)
  }, [])

  useEffect(() => { tesisleriYukle() }, [tesisleriYukle])

  // Süreç güncelleme
  const surecGuncelle = (id: string, alan: keyof Surec, deger: string) => {
    setSurecler(prev => prev.map(s => s.id === id ? { ...s, [alan]: deger } : s))
  }
  const surecEkle = () => setSurecler(prev => [...prev, bosSurec(String(Date.now()))])
  const surecSil  = (id: string) => setSurecler(prev => prev.filter(s => s.id !== id))

  // Supabase'e kaydet
  const biaKaydet = async () => {
    if (!seciliTesis) return
    setKaydediliyor(true)
    try {
      await supabase.from('bia_assessments').insert({
        tenant_id: TENANT_BD,
        facility_id: seciliTesis.id,
        processes: surecler,
        created_at: new Date().toISOString(),
        mtpd_hours: mtpdHesapla(surecler),
      })
      setKaydedildi(true)
    } catch { setHata('BIA kaydedilemedi.') }
    setKaydediliyor(false)
  }

  // PDF Export — BDDK İSEDES
  const bddkPdfIndir = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF()
    const tarih = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
    const mtpd = mtpdHesapla(surecler)

    // Kapak
    doc.setFontSize(11)
    doc.setTextColor(100, 116, 139)
    doc.text('GİZLİ — KURUMSAL KULLANIM', 14, 15)

    doc.setFontSize(18)
    doc.setTextColor(10, 22, 40)
    doc.text('İş Etki Analizi Raporu', 14, 28)

    doc.setFontSize(12)
    doc.setTextColor(0, 155, 141)
    doc.text('BDDK İSEDES Yönetmeliği Madde 35 kapsamında hazırlanmıştır.', 14, 36)

    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`Kurum: ${seciliTesis?.name ?? '—'}`, 14, 48)
    doc.text(`Rapor Tarihi: ${tarih}`, 14, 55)
    doc.text(`Toplam Kritik Süreç: ${surecler.length}`, 14, 62)
    doc.text(`MTPD (Maks. Tolere Edilebilir Kesinti): ${mtpd} saat`, 14, 69)

    // Kritik Süreç Listesi
    doc.setFontSize(13)
    doc.setTextColor(10, 22, 40)
    doc.text('Kritik Süreç Envanteri', 14, 82)

    autoTable(doc, {
      startY: 87,
      head: [['Süreç Adı', 'Süreç Sahibi', 'Bağımlı Sistemler', 'Personel']],
      body: surecler.map(s => [s.ad || '—', s.sahip || '—', s.bagimli_sistemler || '—', s.bagimli_personel || '—']),
      headStyles: { fillColor: [10, 22, 40], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
    })

    // RTO/RPO Tablosu
    const sonY = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12
    doc.setFontSize(13)
    doc.setTextColor(10, 22, 40)
    doc.text('RTO / RPO Hedefleri', 14, sonY)

    autoTable(doc, {
      startY: sonY + 5,
      head: [['Süreç Adı', 'RTO Hedefi', 'RPO Hedefi', '1 Saat Etki (₺)', '1 Gün Etki (₺)']],
      body: surecler.map(s => [
        s.ad || '—',
        s.rto,
        s.rpo,
        s.etki_1saat || '—',
        s.etki_1gun || '—',
      ]),
      headStyles: { fillColor: [0, 100, 87], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 253, 249] },
    })

    // MTPD Hesabı
    const sonY2 = (doc as InstanceType<typeof jsPDF> & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12
    doc.setFontSize(11)
    doc.setTextColor(10, 22, 40)
    doc.text(`MTPD Hesabı: ${mtpd} saat`, 14, sonY2)
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text('MTPD = Tüm kritik süreçlerin etki eşiğini aştığı en kısa kesinti süresi.', 14, sonY2 + 7)
    doc.text('ISO 22301:2019 Madde 6.2.2 · BDDK İSEDES Yönetmeliği Madde 35', 14, sonY2 + 14)

    // Alt bilgi
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('Omniversel Platform · omniIMPACT v1.0 · Bu rapor gizlidir.', 14, 285)

    doc.save(`BIA-BDDK-${seciliTesis?.name ?? 'rapor'}-${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  const grafikData = grafikVerisi(surecler)
  const mtpd = mtpdHesapla(surecler)
  const toplamKayip1Gun = surecler.reduce((acc, s) => acc + (parseFloat(s.etki_1gun.replace(/[^0-9.]/g, '')) || 0), 0)
  const uriYuksekTesisler = tesisler.filter(t => t.uri !== undefined && t.uri < 75)

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Üst Bar */}
      <div style={{ background: NAVY, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/hub" style={{ color: '#94A3B8', fontSize: 13, textDecoration: 'none' }}>← Hub</Link>
          <span style={{ color: '#1E3A5F' }}>|</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>omniIMPACT — İş Etki Analizi (BIA)</span>
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#94A3B8' }}>
          <span>BDDK İSEDES</span><span>·</span><span>ISO 22301:2019</span>
        </div>
      </div>

      {/* İlerleme */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '0 32px' }}>
        <div style={{ display: 'flex' }}>
          {['Tesis Seç', 'Süreç Envanteri', 'Etki & RTO/RPO', 'Sonuç & Rapor'].map((a, i) => (
            <div key={a} style={{ padding: '12px 20px', fontSize: 12, fontWeight: i === adim ? 700 : 500, color: i === adim ? TEAL : i < adim ? '#64748B' : '#CBD5E1', borderBottom: i === adim ? `2px solid ${TEAL}` : '2px solid transparent', cursor: i < adim ? 'pointer' : 'default' }}
              onClick={() => { if (i < adim) setAdim(i as 0|1|2|3) }}>
              {i < adim ? '✓ ' : `${i + 1}. `}{a}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '28px auto', padding: '0 24px' }}>

        {/* ── ADIM 0: TESİS SEÇ ─────────────────────────────── */}
        {adim === 0 && (
          <div>
            {/* URI uyarı bandı */}
            {uriYuksekTesisler.length > 0 && (
              <div style={{ background: '#FEF9C3', border: `1px solid ${AMBER}`, borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>
                    {uriYuksekTesisler.length} tesiste URI skoru 75&apos;in altında — BIA değerlendirmesi önerilir
                  </p>
                  <p style={{ fontSize: 12, color: '#B45309', marginTop: 4 }}>
                    Yüksek riskli tesisler: {uriYuksekTesisler.slice(0, 3).map(t => t.name).join(', ')}{uriYuksekTesisler.length > 3 ? ` ve ${uriYuksekTesisler.length - 3} diğer` : ''}
                  </p>
                </div>
              </div>
            )}

            <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Değerlendirme Yapılacak Tesisi Seçin</h2>
              <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24 }}>
                Listede yalnızca omniRISK değerlendirmesi yapılmış tesisler gösterilir.
              </p>

              {tesisYukleniyor ? (
                <p style={{ fontSize: 13, color: '#94A3B8' }}>Tesisler yükleniyor…</p>
              ) : tesisler.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 12 }}>Henüz omniRISK kaydı olan tesis bulunmuyor.</p>
                  <Link href="/hub/form/banking" style={{ color: TEAL, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                    → Bankacılık Değerlendirmesi Başlat
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                  {tesisler.map(t => {
                    const uriRenk = !t.uri ? '#94A3B8' : t.uri < 40 ? RED : t.uri < 60 ? '#F97316' : t.uri < 75 ? AMBER : GREEN
                    const seçili = seciliTesis?.id === t.id
                    return (
                      <div key={t.id} onClick={() => setSeciliTesis(t)}
                        style={{ border: `2px solid ${seçili ? TEAL : BORDER}`, borderRadius: 10, padding: '14px 16px', cursor: 'pointer', background: seçili ? '#F0FDF9' : 'white', transition: 'all .15s' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                        {t.uri !== undefined ? (
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span style={{ fontSize: 20, fontWeight: 900, color: uriRenk, fontFamily: 'DM Mono,monospace' }}>{t.uri}</span>
                            <span style={{ fontSize: 11, color: uriRenk, fontWeight: 600 }}>URI · {t.riskSinifi}</span>
                            {t.uri < 75 && <span style={{ fontSize: 10, background: '#FEF9C3', color: '#92400E', border: `1px solid ${AMBER}`, padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>BIA Önerilir</span>}
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>URI skoru yok</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {hata && <p style={{ color: RED, fontSize: 13, marginTop: 12 }}>{hata}</p>}

              <button onClick={() => { if (!seciliTesis) { setHata('Lütfen bir tesis seçin.'); return }; setHata(''); setAdim(1) }}
                disabled={!seciliTesis}
                style={{ marginTop: 24, padding: '11px 28px', background: seciliTesis ? TEAL : '#CBD5E1', color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: seciliTesis ? 'pointer' : 'not-allowed' }}>
                Süreç Envanterine Geç →
              </button>
            </div>
          </div>
        )}

        {/* ── ADIM 1: SÜREÇ ENVANTERİ ──────────────────────── */}
        {adim === 1 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>Kritik Süreç Envanteri</h2>
                <p style={{ fontSize: 13, color: '#94A3B8' }}>{seciliTesis?.name} · {surecler.length} süreç</p>
              </div>
              <button onClick={surecEkle}
                style={{ padding: '8px 18px', background: TEAL, color: 'white', fontWeight: 600, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                + Süreç Ekle
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {surecler.map((s, idx) => (
                <div key={s.id} style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: TEAL, background: '#F0FDF9', padding: '3px 10px', borderRadius: 6 }}>Süreç {idx + 1}</span>
                    {surecler.length > 1 && (
                      <button onClick={() => surecSil(s.id)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: 18 }}>×</button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={lbl}>Süreç Adı *</label>
                      <input value={s.ad} onChange={e => surecGuncelle(s.id, 'ad', e.target.value)}
                        placeholder="örn. Core Banking Sistemi"
                        style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Süreç Sahibi</label>
                      <input value={s.sahip} onChange={e => surecGuncelle(s.id, 'sahip', e.target.value)}
                        placeholder="örn. BT Müdürü"
                        style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Bağımlı Sistemler</label>
                      <input value={s.bagimli_sistemler} onChange={e => surecGuncelle(s.id, 'bagimli_sistemler', e.target.value)}
                        placeholder="örn. Oracle DB, SAP, SWIFT"
                        style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Bağımlı Personel</label>
                      <input value={s.bagimli_personel} onChange={e => surecGuncelle(s.id, 'bagimli_personel', e.target.value)}
                        placeholder="örn. 12 kişi, 3. vardiya"
                        style={inp} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => setAdim(0)} style={geriBt}>← Geri</button>
              <button onClick={() => { if (surecler.some(s => !s.ad.trim())) { setHata('Tüm süreçlerin adı girilmelidir.'); return }; setHata(''); setAdim(2) }}
                style={ileriIBt}>
                Etki Değerlendirmesine Geç →
              </button>
            </div>
            {hata && <p style={{ color: RED, fontSize: 13, marginTop: 8 }}>{hata}</p>}
          </div>
        )}

        {/* ── ADIM 2: ETKİ & RTO/RPO ───────────────────────── */}
        {adim === 2 && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Etki Değerlendirmesi & RTO/RPO</h2>
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 20 }}>Her süreç için mali etki (₺) ve kurtarma hedeflerini girin.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {surecler.map((s, idx) => (
                <div key={s.id} style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', background: '#F8F9FA', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>Süreç {idx + 1}:</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{s.ad || '—'}</span>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    {/* Mali Etki */}
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Mali Etki (₺)</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
                      {[
                        { alan: 'etki_1saat' as keyof Surec, etiket: '1 Saat' },
                        { alan: 'etki_4saat' as keyof Surec, etiket: '4 Saat' },
                        { alan: 'etki_1gun'  as keyof Surec, etiket: '1 Gün' },
                        { alan: 'etki_1hafta'as keyof Surec, etiket: '1 Hafta' },
                      ].map(({ alan, etiket }) => (
                        <div key={alan}>
                          <label style={{ ...lbl, fontSize: 11, color: '#64748B' }}>{etiket} Kesinti</label>
                          <input value={String(s[alan])} onChange={e => surecGuncelle(s.id, alan, e.target.value)}
                            placeholder="₺0"
                            style={{ ...inp, fontFamily: 'DM Mono,monospace', textAlign: 'right' as const }} />
                        </div>
                      ))}
                    </div>
                    {/* RTO / RPO */}
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Kurtarma Hedefleri</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={lbl}>RTO — Kurtarma Süresi Hedefi</label>
                        <select value={s.rto} onChange={e => surecGuncelle(s.id, 'rto', e.target.value)} style={sel}>
                          {RTO_SECENEKLER.map(r => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={lbl}>RPO — Kurtarma Noktası Hedefi</label>
                        <select value={s.rpo} onChange={e => surecGuncelle(s.id, 'rpo', e.target.value)} style={sel}>
                          {RPO_SECENEKLER.map(r => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => setAdim(1)} style={geriBt}>← Geri</button>
              <button onClick={() => setAdim(3)} style={ileriIBt}>Sonuç & Rapora Geç →</button>
            </div>
          </div>
        )}

        {/* ── ADIM 3: SONUÇ & RAPOR ────────────────────────── */}
        {adim === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>

            {/* Sol: Graf + KPI'lar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* KPI Şerit */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[
                  { etiket: 'Kritik Süreç', deger: String(surecler.length), renk: '#3B82F6' },
                  { etiket: 'MTPD', deger: `${mtpd} saat`, renk: mtpd <= 4 ? RED : mtpd <= 24 ? AMBER : GREEN },
                  { etiket: '1 Günlük Toplam Kayıp', deger: tlFormat(toplamKayip1Gun), renk: RED },
                ].map(k => (
                  <div key={k.etiket} style={{ background: 'white', borderRadius: 10, border: `1px solid ${BORDER}`, padding: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>{k.etiket}</p>
                    <p style={{ fontSize: 24, fontWeight: 800, color: k.renk, fontFamily: 'DM Mono,monospace', lineHeight: 1 }}>{k.deger}</p>
                  </div>
                ))}
              </div>

              {/* Kümülatif Etki Grafiği */}
              <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Kümülatif Mali Etki</h3>
                <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>Kesinti süresine göre toplam kayıp (₺K)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={grafikData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="sure" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={v => `₺${v}K`} />
                    <Tooltip formatter={(v) => [`₺${Number(v).toLocaleString('tr-TR')}K`, 'Toplam Kayıp']} />
                    <Legend />
                    <ReferenceLine x={`${mtpd} Saat`} stroke={RED} strokeDasharray="4 4" label={{ value: 'MTPD', fill: RED, fontSize: 11 }} />
                    <Line type="monotone" dataKey="kayip" name="Kümülatif Kayıp" stroke={RED} strokeWidth={2.5} dot={{ r: 4, fill: RED }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Süreç Özeti */}
              <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 700, color: NAVY }}>Süreç Özeti</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      {['Süreç', 'RTO', 'RPO', '1 Saat Etki', '1 Gün Etki'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', background: '#F8F9FA', borderBottom: `1px solid ${BORDER}`, color: '#94A3B8', fontWeight: 700, fontSize: 11 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {surecler.map((s, i) => (
                      <tr key={s.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 600, color: NAVY }}>{s.ad || '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#374151' }}>{s.rto}</td>
                        <td style={{ padding: '8px 12px', color: '#374151' }}>{s.rpo}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'DM Mono,monospace', color: RED }}>{s.etki_1saat || '—'}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'DM Mono,monospace', color: RED }}>{s.etki_1gun || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sağ: Kaydet + PDF */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Tesis Bilgisi */}
              <div style={{ background: NAVY, borderRadius: 12, padding: 20, color: 'white' }}>
                <p style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>DEĞERLENDİRİLEN TESİS</p>
                <p style={{ fontSize: 15, fontWeight: 700 }}>{seciliTesis?.name}</p>
                {seciliTesis?.uri !== undefined && (
                  <p style={{ fontSize: 12, color: seciliTesis.uri < 75 ? AMBER : GREEN, marginTop: 4 }}>
                    URI Skoru: {seciliTesis.uri} · {seciliTesis.riskSinifi}
                  </p>
                )}
              </div>

              {/* MTPD Bilgisi */}
              <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 8 }}>MTPD Hesabı</p>
                <div style={{ fontSize: 32, fontWeight: 900, color: mtpd <= 4 ? RED : mtpd <= 24 ? AMBER : GREEN, fontFamily: 'DM Mono,monospace' }}>
                  {mtpd} saat
                </div>
                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 6, lineHeight: 1.6 }}>
                  Maksimum Tolere Edilebilir Kesinti Süresi. Bu sürenin ötesinde kurum kritik işlevlerini sürdüremez.
                </p>
              </div>

              {/* Supabase Kaydet */}
              <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 20 }}>
                <button onClick={biaKaydet} disabled={kaydediliyor || kaydedildi}
                  style={{ width: '100%', padding: '12px 0', background: kaydedildi ? GREEN : TEAL, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 10 }}>
                  {kaydedildi ? '✓ Supabase\'e Kaydedildi' : kaydediliyor ? 'Kaydediliyor...' : 'BIA\'yı Kaydet (Supabase)'}
                </button>
                {hata && <p style={{ color: RED, fontSize: 12 }}>{hata}</p>}
              </div>

              {/* PDF İndir */}
              <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 }}>BDDK İSEDES Raporu</p>
                <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12, lineHeight: 1.6 }}>
                  İSEDES Yönetmeliği Madde 35 kapsamında: kritik süreç listesi, RTO/RPO tablosu, MTPD hesabı.
                </p>
                <button onClick={bddkPdfIndir}
                  style={{ width: '100%', padding: '12px 0', background: NAVY, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                  ↓ BDDK Raporu İndir (PDF)
                </button>
              </div>

              {/* Geri */}
              <button onClick={() => setAdim(2)} style={{ padding: '10px 0', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 13, color: '#374151' }}>
                ← Etki Değerlendirmesine Dön
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Style sabitleri ───────────────────────────────────────────
const lbl: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }
const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: 13, outline: 'none', boxSizing: 'border-box' }
const sel: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: 13, outline: 'none', background: 'white', boxSizing: 'border-box' as const }
const geriBt: React.CSSProperties = { padding: '11px 22px', border: '1px solid #E2E8F0', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 13 }
const ileriIBt: React.CSSProperties = { padding: '11px 28px', background: '#0A1628', color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }
