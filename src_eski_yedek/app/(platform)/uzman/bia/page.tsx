'use client'
import { useState } from 'react'

// ── Renkler ───────────────────────────────────────────────────────────────────
const NAVY  = '#0A1628'
const TEAL  = '#009B8D'
const AMBER = '#D97706'
const RED   = '#DC2626'
const GREEN = '#16A34A'
const WARM  = '#F8F6F3'

// ── Sektör BIA Verileri ───────────────────────────────────────────────────────
const SEKTORLER = [
  {
    id: 'bankacilik', label: 'Bankacılık & Finans', icon: '🏦', renk: '#1B4FD8', acik: '#EFF6FF',
    birim: 'Şube', birim_sayisi: 400, calisan: 12800,
    gunluk_gelir: 6400,   // ₺K/gün (tüm şubeler)
    rto: 4, rpo: 1,
    eal_yillik: 32.2,     // ₺M
    mevzuat: ['BDDK MD 29', 'ISO 22301', 'TFRS 9', 'PCI DSS'],
    kritik_surec: [
      { ad: 'Core Banking / ATM', rto: '4 saat', rpo: '1 saat', etkili: '3.5M müşteri' },
      { ad: 'SWIFT & EFT', rto: '2 saat', rpo: '15 dak.', etkili: '₺2.4Md/gün' },
      { ad: 'Şube Operasyonları', rto: '8 saat', rpo: '4 saat', etkili: '400 şube' },
      { ad: 'Dijital Kanallar', rto: '1 saat', rpo: '30 dak.', etkili: '8.2M kullanıcı' },
    ],
    senaryolar: [
      { ad: 'Siber Saldırı', eal: 18.4, olasilik: 35, renk: '#8B5CF6' },
      { ad: 'Deprem', eal: 8.6, olasilik: 60, renk: RED },
      { ad: 'Yangın', eal: 2.8, olasilik: 15, renk: AMBER },
      { ad: 'Sel', eal: 1.4, olasilik: 20, renk: '#0EA5E9' },
      { ad: 'Operasyonel', eal: 1.0, olasilik: 40, renk: '#6B7280' },
    ],
    aksiyonlar: [
      { baslik: 'DR Site (Aktif-Aktif)', maliyet: 6400, fayda: 18400, sure: '18 ay', oncelik: 'kritik', kategori: 'Siber' },
      { baslik: 'SOC Kurulumu', maliyet: 1800, fayda: 6200, sure: '12 ay', oncelik: 'kritik', kategori: 'Siber' },
      { baslik: 'Sismik Güçlendirme (Top 20 Şube)', maliyet: 17000, fayda: 8600, sure: '24 ay', oncelik: 'yüksek', kategori: 'Deprem' },
      { baslik: 'BCP Revizyonu', maliyet: 360, fayda: 3200, sure: '6 ay', oncelik: 'yüksek', kategori: 'Genel' },
      { baslik: 'Penetrasyon Testi', maliyet: 240, fayda: 2100, sure: '3 ay', oncelik: 'orta', kategori: 'Siber' },
    ],
  },
  {
    id: 'uretim', label: 'Sanayi & Üretim', icon: '🏭', renk: '#D97706', acik: '#FFFBEB',
    birim: 'Tesis', birim_sayisi: 200, calisan: 49411,
    gunluk_gelir: 28400,
    rto: 8, rpo: 4,
    eal_yillik: 34.4,
    mevzuat: ['İSG 6331', 'SEVESO III', 'ISO 45001', 'ÇED Yönetmeliği'],
    kritik_surec: [
      { ad: 'Üretim Hattı', rto: '8 saat', rpo: '4 saat', etkili: '200 tesis' },
      { ad: 'Enerji/Güç Sistemi', rto: '2 saat', rpo: '1 saat', etkili: '49.411 çalışan' },
      { ad: 'Kimyasal Depolama', rto: '24 saat', rpo: '8 saat', etkili: 'SEVESO kaps. 50 tesis' },
      { ad: 'Atık Yönetimi', rto: '48 saat', rpo: '24 saat', etkili: 'Çevre mevzuatı' },
    ],
    senaryolar: [
      { ad: 'Yangın / Patlama', eal: 12.4, olasilik: 28, renk: RED },
      { ad: 'Kimyasal Sızıntı', eal: 11.2, olasilik: 18, renk: '#7C3AED' },
      { ad: 'Deprem', eal: 6.8, olasilik: 60, renk: AMBER },
      { ad: 'İş Kazası Kitlesel', eal: 3.2, olasilik: 22, renk: '#F97316' },
      { ad: 'Sel', eal: 0.8, olasilik: 15, renk: '#0EA5E9' },
    ],
    aksiyonlar: [
      { baslik: 'SEVESO III Uyum Paketi (50 tesis)', maliyet: 8500, fayda: 11200, sure: '18 ay', oncelik: 'kritik', kategori: 'Kimya' },
      { baslik: 'Yangın Söndürme Modernizasyonu', maliyet: 4200, fayda: 12400, sure: '12 ay', oncelik: 'kritik', kategori: 'Yangın' },
      { baslik: 'İSG Yönetim Sistemi (ISO 45001)', maliyet: 2800, fayda: 5600, sure: '9 ay', oncelik: 'yüksek', kategori: 'İSG' },
      { baslik: 'Sismik Hasar Değerlendirmesi', maliyet: 1400, fayda: 6800, sure: '6 ay', oncelik: 'yüksek', kategori: 'Deprem' },
      { baslik: 'Acil Eylem Planı (AEP)', maliyet: 600, fayda: 3200, sure: '4 ay', oncelik: 'orta', kategori: 'Genel' },
    ],
  },
  {
    id: 'saglik', label: 'Sağlık', icon: '🏥', renk: '#16A34A', acik: '#F0FDF4',
    birim: 'Tesis', birim_sayisi: 28, calisan: 3400,
    gunluk_gelir: 4200,
    rto: 2, rpo: 0.5,
    eal_yillik: 14.8,
    mevzuat: ['Sağlık Bakanlığı Yönetmeliği', 'JCI', 'ISO 9001', 'Biyogüvenlik'],
    kritik_surec: [
      { ad: 'Acil Servis / Yoğun Bakım', rto: '0 (kesintisiz)', rpo: '0', etkili: 'Kritik hastalar' },
      { ad: 'Tıbbi Cihazlar / PACS', rto: '2 saat', rpo: '30 dak.', etkili: 'Tüm klinikler' },
      { ad: 'Laboratuvar / Kan Bankası', rto: '4 saat', rpo: '1 saat', etkili: '24/7 servis' },
      { ad: 'Tıbbi Gaz / Oksijen', rto: '15 dak.', rpo: '0', etkili: 'Tüm yataklar' },
    ],
    senaryolar: [
      { ad: 'Elektrik Kesintisi', eal: 5.8, olasilik: 45, renk: AMBER },
      { ad: 'Siber / Ransomware', eal: 4.2, olasilik: 30, renk: '#8B5CF6' },
      { ad: 'Deprem', eal: 3.6, olasilik: 60, renk: RED },
      { ad: 'Biyolojik Kirlilik', eal: 1.2, olasilik: 8, renk: '#6B7280' },
    ],
    aksiyonlar: [
      { baslik: 'Jeneratör Kapasitesi Artırımı (N+1)', maliyet: 3200, fayda: 5800, sure: '12 ay', oncelik: 'kritik', kategori: 'Elektrik' },
      { baslik: 'Tıbbi Cihaz DR Yedekleme', maliyet: 2400, fayda: 4200, sure: '9 ay', oncelik: 'kritik', kategori: 'Siber' },
      { baslik: 'Sismik Güçlendirme (3 ana tesis)', maliyet: 5600, fayda: 3600, sure: '24 ay', oncelik: 'yüksek', kategori: 'Deprem' },
      { baslik: 'Afet & Kayıplar Planı', maliyet: 280, fayda: 2400, sure: '4 ay', oncelik: 'yüksek', kategori: 'Genel' },
    ],
  },
  {
    id: 'belediye', label: 'Belediyeler', icon: '🏛️', renk: '#7C3AED', acik: '#F5F3FF',
    birim: 'Birim', birim_sayisi: 45, calisan: 6200,
    gunluk_gelir: 8800,   // vergi + hizmet geliri
    rto: 24, rpo: 12,
    eal_yillik: 22.4,
    mevzuat: ['AFAD Yönetmeliği', 'E-Devlet Güvenlik', 'Kişisel Veri Koruma', 'ISO 22301'],
    kritik_surec: [
      { ad: 'Acil Yönetim / İtfaiye', rto: '0 (kesintisiz)', rpo: '0', etkili: '15M İstanbul nüfusu' },
      { ad: 'Su / Atıksu Yönetimi', rto: '4 saat', rpo: '2 saat', etkili: 'Tüm ilçeler' },
      { ad: 'Toplu Ulaşım (İETT/Metro)', rto: '2 saat', rpo: '1 saat', etkili: '4M günlük yolcu' },
      { ad: 'Vatandaş Hizmetleri', rto: '48 saat', rpo: '24 saat', etkili: 'Tüm birimler' },
    ],
    senaryolar: [
      { ad: 'Deprem (Büyük)', eal: 12.8, olasilik: 60, renk: RED },
      { ad: 'Siber Saldırı', eal: 4.6, olasilik: 35, renk: '#8B5CF6' },
      { ad: 'Sel / Fırtına', eal: 3.2, olasilik: 30, renk: '#0EA5E9' },
      { ad: 'Altyapı Çökmesi', eal: 1.8, olasilik: 20, renk: AMBER },
    ],
    aksiyonlar: [
      { baslik: 'AFAD Afet Koordinasyon Merkezi', maliyet: 12400, fayda: 12800, sure: '18 ay', oncelik: 'kritik', kategori: 'Deprem' },
      { baslik: 'Siber Güvenlik SOC (Belediye)', maliyet: 2800, fayda: 4600, sure: '12 ay', oncelik: 'kritik', kategori: 'Siber' },
      { baslik: 'Kritik Altyapı Yedekleme', maliyet: 6400, fayda: 3200, sure: '24 ay', oncelik: 'yüksek', kategori: 'Altyapı' },
      { baslik: 'İBB Kriz İletişim Sistemi', maliyet: 1200, fayda: 2800, sure: '6 ay', oncelik: 'yüksek', kategori: 'Genel' },
    ],
  },
  {
    id: 'meb', label: 'Eğitim (MEB)', icon: '🎓', renk: '#0891B2', acik: '#E0F2FE',
    birim: 'Okul', birim_sayisi: 1200, calisan: 28000,
    gunluk_gelir: 0,   // Kamu — maliyet tabanlı
    rto: 72, rpo: 48,
    eal_yillik: 8.4,
    mevzuat: ['MEB Afet Yönetim Planı', 'AFAD', 'İSG 6331', 'Sivil Savunma'],
    kritik_surec: [
      { ad: 'Eğitim Sürekliliği', rto: '72 saat (uzaktan geçiş)', rpo: '48 saat', etkili: '1.2M öğrenci' },
      { ad: 'Öğrenci Güvenliği', rto: '0 (kesintisiz)', rpo: '0', etkili: 'Tüm okullar' },
      { ad: 'Yönetim Bilgi Sistemi', rto: '48 saat', rpo: '24 saat', etkili: '28.000 öğretmen' },
      { ad: 'Okul Binaları', rto: '7 gün (yapısal hasar)', rpo: '—', etkili: '1.200 bina' },
    ],
    senaryolar: [
      { ad: 'Deprem (Bina Hasarı)', eal: 4.8, olasilik: 60, renk: RED },
      { ad: 'Yangın', eal: 2.2, olasilik: 12, renk: AMBER },
      { ad: 'Salgın / Okul Kapanma', eal: 0.8, olasilik: 20, renk: '#6B7280' },
      { ad: 'Siber (e-okul)', eal: 0.6, olasilik: 25, renk: '#8B5CF6' },
    ],
    aksiyonlar: [
      { baslik: 'Okul Deprem Güçlendirme (100 öncelikli)', maliyet: 14000, fayda: 4800, sure: '36 ay', oncelik: 'kritik', kategori: 'Deprem' },
      { baslik: 'Uzaktan Eğitim Altyapısı (DR)', maliyet: 1200, fayda: 2400, sure: '6 ay', oncelik: 'yüksek', kategori: 'Genel' },
      { baslik: 'Tahliye Planı & Tatbikat', maliyet: 320, fayda: 2200, sure: '3 ay', oncelik: 'yüksek', kategori: 'Yangın' },
      { baslik: 'e-Okul Siber Güvenlik', maliyet: 680, fayda: 600, sure: '6 ay', oncelik: 'orta', kategori: 'Siber' },
    ],
  },
  {
    id: 'konaklama', label: 'Konaklama & Turizm', icon: '🏨', renk: '#EC4899', acik: '#FDF2F8',
    birim: 'Otel', birim_sayisi: 52, calisan: 8400,
    gunluk_gelir: 12600,
    rto: 12, rpo: 4,
    eal_yillik: 11.6,
    mevzuat: ['Turizm Bakanlığı', 'Yangın Yönetmeliği', 'ISO 22301', 'OHSAS'],
    kritik_surec: [
      { ad: 'Rezervasyon / PMS', rto: '4 saat', rpo: '1 saat', etkili: 'Tüm oteller' },
      { ad: 'Güvenlik & Yangın', rto: '0 (kesintisiz)', rpo: '0', etkili: 'Tüm misafirler' },
      { ad: 'Mutfak / Gıda Güvenliği', rto: '8 saat', rpo: '4 saat', etkili: 'F&B operasyonu' },
      { ad: 'Enerji & Teknik', rto: '2 saat', rpo: '30 dak.', etkili: 'Tüm tesisler' },
    ],
    senaryolar: [
      { ad: 'Yangın', eal: 4.8, olasilik: 18, renk: RED },
      { ad: 'Deprem', eal: 3.2, olasilik: 60, renk: AMBER },
      { ad: 'Gıda Zehirlenmesi', eal: 2.4, olasilik: 12, renk: '#6B7280' },
      { ad: 'Siber (Rezervasyon)', eal: 1.2, olasilik: 25, renk: '#8B5CF6' },
    ],
    aksiyonlar: [
      { baslik: 'Yangın Güvenlik Sistemi (5 yıldızlı standart)', maliyet: 2800, fayda: 4800, sure: '12 ay', oncelik: 'kritik', kategori: 'Yangın' },
      { baslik: 'Sismik Değerlendirme & Takviye', maliyet: 4200, fayda: 3200, sure: '18 ay', oncelik: 'yüksek', kategori: 'Deprem' },
      { baslik: 'PMS DR Yedekleme', maliyet: 480, fayda: 1200, sure: '4 ay', oncelik: 'yüksek', kategori: 'Siber' },
      { baslik: 'Gıda Güvenliği Denetimi', maliyet: 240, fayda: 2400, sure: '3 ay', oncelik: 'orta', kategori: 'Genel' },
    ],
  },
]

// ── Yardımcılar ───────────────────────────────────────────────────────────────
function tl(n: number) {
  if (n >= 1000) return `₺${(n / 1000).toFixed(1)}Mrd`
  return `₺${n}M`
}
function oncelikRenk(o: string) {
  return o === 'kritik' ? RED : o === 'yüksek' ? AMBER : '#6B7280'
}

// ── Ana Bileşen ───────────────────────────────────────────────────────────────
export default function BIAHub() {
  const [seciliSektor, setSeciliSektor] = useState('bankacilik')
  const [sekme, setSekme] = useState<'ozet'|'surec'|'senaryo'|'aksiyon'>('ozet')

  const s = SEKTORLER.find(x => x.id === seciliSektor)!
  const topEAL = SEKTORLER.reduce((a, x) => a + x.eal_yillik, 0)
  const topMaliyet = s.aksiyonlar.reduce((a, x) => a + x.maliyet, 0)
  const topFayda = s.aksiyonlar.reduce((a, x) => a + x.fayda, 0)
  const roi = Math.round(topFayda / topMaliyet * 100)

  return (
    <div style={{ minHeight: '100vh', background: WARM, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#D1CEC9;border-radius:99px}
        @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fu .25s ease forwards}
        @keyframes p2{0%,100%{opacity:1}50%{opacity:.4}} .pulse{animation:p2 2s infinite}
      `}</style>

      {/* Topbar */}
      <div style={{ background: NAVY, height: 52, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="/ana-sayfa" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 14, fontFamily: "'Playfair Display',serif" }}>R</span>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display',serif" }}>RESILIA</span>
          </a>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.12)' }} />
          {[
            { href: '/board/ozet',           l: 'Özet' },
            { href: '/uzman/dashboard',      l: 'Uzman' },
            { href: '/harita',               l: '🗺️ Harita' },
            { href: '/uzman/bia',            l: '📊 BIA', aktif: true },
            { href: '/board/cok-banka',      l: '🏦 Çok Banka' },
            { href: '/uzman/istanbul-sanayi',l: '🏭 Sanayi' },
          ].map(l => (
            <a key={l.href} href={l.href} style={{ fontSize: 11, fontWeight: 600, padding: '5px 9px', borderRadius: 7, textDecoration: 'none',
              background: l.aktif ? 'rgba(255,255,255,.15)' : 'transparent',
              color: l.aktif ? 'white' : 'rgba(255,255,255,.45)' }}>{l.l}</a>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>İş Etki Analizi · 6 Sektör · ₺{topEAL.toFixed(1)}M Toplam EAL</div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* Sayfa başlığı */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: NAVY, marginBottom: 3 }}>
            İş Etki Analizi (BIA)
          </div>
          <div style={{ fontSize: 13, color: '#9CA3AF' }}>
            6 sektör · RTO/RPO metrikleri · Senaryo EAL · Aksiyon önceliklendirme
          </div>
        </div>

        {/* Platform özet KPI şeridi */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 22 }}>
          {SEKTORLER.map(sx => (
            <div key={sx.id} style={{ background: 'white', borderRadius: 13, border: `1.5px solid ${seciliSektor === sx.id ? sx.renk : '#ECEAE8'}`, padding: '12px 14px', cursor: 'pointer', transition: 'all .18s', boxShadow: seciliSektor === sx.id ? `0 4px 16px ${sx.renk}30` : 'none' }}
              onClick={() => { setSeciliSektor(sx.id); setSekme('ozet') }}>
              <div style={{ fontSize: 20, marginBottom: 5 }}>{sx.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: seciliSektor === sx.id ? sx.renk : '#9CA3AF', marginBottom: 2 }}>{sx.label}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 16, fontWeight: 700, color: NAVY }}>₺{sx.eal_yillik}M</div>
              <div style={{ fontSize: 9, color: '#9CA3AF' }}>Yıllık EAL</div>
              <div style={{ marginTop: 7, height: 3, borderRadius: 99, background: '#F1F0EF', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round(sx.eal_yillik / topEAL * 100)}%`, background: sx.renk, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Seçili sektör detay */}
        <div style={{ background: 'white', borderRadius: 20, border: `2px solid ${s.renk}40`, overflow: 'hidden' }} className="fu">

          {/* Sektör header */}
          <div style={{ background: s.renk, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 36 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, color: 'white' }}>{s.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 2 }}>
                  {s.birim_sayisi} {s.birim} · {s.calisan.toLocaleString('tr-TR')} çalışan · RTO: {s.rto}s · RPO: {s.rpo}s
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { l: 'Yıllık EAL', v: `₺${s.eal_yillik}M` },
                { l: 'Günlük Gelir', v: s.gunluk_gelir ? `₺${s.gunluk_gelir}K` : 'Kamu' },
                { l: 'ROI', v: `%${Math.round(s.aksiyonlar.reduce((a,x)=>a+x.fayda,0)/s.aksiyonlar.reduce((a,x)=>a+x.maliyet,0)*100)}` },
              ].map(k => (
                <div key={k.l} style={{ background: 'rgba(255,255,255,.15)', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,.6)', marginBottom: 3 }}>{k.l}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 700, color: 'white' }}>{k.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sekmeler */}
          <div style={{ display: 'flex', borderBottom: '1px solid #ECEAE8', padding: '0 24px' }}>
            {[
              { v: 'ozet', l: '📋 Genel Özet' },
              { v: 'surec', l: '⚙️ Kritik Süreçler' },
              { v: 'senaryo', l: '⚡ Senaryo EAL' },
              { v: 'aksiyon', l: '🎯 Aksiyon Planı' },
            ].map(t => (
              <button key={t.v} onClick={() => setSekme(t.v as any)}
                style={{ padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: sekme === t.v ? s.renk : '#9CA3AF', borderBottom: `2px solid ${sekme === t.v ? s.renk : 'transparent'}`, marginBottom: -1, transition: 'all .15s' }}>
                {t.l}
              </button>
            ))}
          </div>

          <div style={{ padding: '22px 24px' }}>

            {/* GENEL ÖZET */}
            {sekme === 'ozet' && (
              <div className="fu" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Temel Metrikler</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                      { l: `${s.birim} Sayısı`, v: s.birim_sayisi.toString(), c: s.renk },
                      { l: 'Çalışan', v: s.calisan.toLocaleString('tr-TR'), c: s.renk },
                      { l: 'RTO Hedefi', v: `${s.rto} saat`, c: AMBER },
                      { l: 'RPO Hedefi', v: `${s.rpo} saat`, c: AMBER },
                      { l: 'Yıllık EAL', v: `₺${s.eal_yillik}M`, c: RED },
                      { l: 'Günlük Risk', v: s.gunluk_gelir ? `₺${(s.eal_yillik * 1000 / 365).toFixed(0)}K` : 'Kamu', c: RED },
                    ].map(k => (
                      <div key={k.l} style={{ background: '#F8F6F3', borderRadius: 12, padding: '12px 14px' }}>
                        <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 3 }}>{k.l}</div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 17, fontWeight: 700, color: k.c }}>{k.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>Mevzuat</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {s.mevzuat.map(m => (
                      <span key={m} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: s.renk + '12', color: s.renk, fontWeight: 600 }}>{m}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Senaryo EAL Dağılımı</div>
                  {s.senaryolar.map(sn => (
                    <div key={sn.ad} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{sn.ad}</span>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 700, color: sn.renk }}>₺{sn.eal}M</span>
                      </div>
                      <div style={{ height: 6, background: '#F1F0EF', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${sn.eal / s.eal_yillik * 100}%`, background: sn.renk, borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 14, padding: '12px 14px', background: RED + '0D', border: `1px solid ${RED}20`, borderRadius: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: RED, marginBottom: 4 }}>⚠ Toplam Yıllık Beklenen Kayıp</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 900, color: RED }}>₺{s.eal_yillik}M</div>
                  </div>
                </div>
              </div>
            )}

            {/* KRİTİK SÜREÇLER */}
            {sekme === 'surec' && (
              <div className="fu">
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Kritik Süreç Envanteri & RTO/RPO Hedefleri</div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {s.kritik_surec.map((surec, i) => (
                    <div key={surec.ad} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 12, alignItems: 'center', padding: '14px 16px', background: i === 0 ? RED + '06' : '#F8F6F3', borderRadius: 14, border: `1px solid ${i === 0 ? RED + '20' : '#ECEAE8'}` }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          {i === 0 && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, background: RED, color: 'white', fontWeight: 700 }}>ÖNCELİK 1</span>}
                          <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{surec.ad}</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Etkilenen: {surec.etkili}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 3 }}>RTO Hedefi</div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 700, color: AMBER }}>{surec.rto}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 3 }}>RPO Hedefi</div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 700, color: s.renk }}>{surec.rpo}</div>
                      </div>
                      <div>
                        <div style={{ height: 5, background: '#E5E3E1', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, 100 - i * 18)}%`, background: i === 0 ? RED : s.renk, borderRadius: 99 }} />
                        </div>
                        <div style={{ fontSize: 9, color: '#9CA3AF', marginTop: 3 }}>Kritiklik skoru</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: '14px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 5 }}>✓ BIA Metodolojisi</div>
                  <p style={{ fontSize: 12, color: '#166534', lineHeight: 1.7, margin: 0 }}>
                    RTO (Recovery Time Objective): Kabul edilebilir maksimum kesinti süresi. RPO (Recovery Point Objective): Kabul edilebilir maksimum veri kaybı süresi. ISO 22301 standardına göre belirlenmiştir.
                  </p>
                </div>
              </div>
            )}

            {/* SENARYO EAL */}
            {sekme === 'senaryo' && (
              <div className="fu" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Senaryo Bazlı Yıllık Beklenen Kayıp</div>
                  {s.senaryolar.map(sn => (
                    <div key={sn.ad} style={{ background: '#F8F6F3', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{sn.ad}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>Olasılık: %{sn.olasilik} (10 yılda)</div>
                        </div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 900, color: sn.renk }}>₺{sn.eal}M</div>
                      </div>
                      <div style={{ height: 6, background: '#E5E3E1', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${sn.eal / s.eal_yillik * 100}%`, background: sn.renk, borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Kesinti → Finansal Etki Matrisi</div>
                  <div style={{ background: '#F8F6F3', borderRadius: 14, overflow: 'hidden', border: '1px solid #ECEAE8' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: NAVY, padding: '9px 14px' }}>
                      {['Kesinti Süresi', 'Tahmini Kayıp', 'İş Etkisi'].map(h => (
                        <div key={h} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</div>
                      ))}
                    </div>
                    {[
                      ['1 saat',   `₺${(s.gunluk_gelir/24||50).toFixed(0)}K`,   'Sınırlı'],
                      ['4 saat',   `₺${(s.gunluk_gelir/6||200).toFixed(0)}K`,   'Orta'],
                      ['1 gün',    `₺${s.gunluk_gelir||500}K`,                  'Ciddi'],
                      ['1 hafta',  `₺${((s.gunluk_gelir||500)*7/1000).toFixed(1)}M`, 'Kritik'],
                      ['1 ay',     `₺${((s.gunluk_gelir||500)*30/1000).toFixed(1)}M`, 'Felaket'],
                    ].map(([s_, v, e], i) => (
                      <div key={s_} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '9px 14px', background: i % 2 === 0 ? 'white' : '#FAFAF9', borderBottom: '1px solid #F1F0EF' }}>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: NAVY }}>{s_}</span>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 700, color: i < 2 ? GREEN : i < 3 ? AMBER : RED }}>{v}</span>
                        <span style={{ fontSize: 10, color: i < 2 ? GREEN : i < 3 ? AMBER : RED, fontWeight: 600 }}>{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AKSİYON PLANI */}
            {sekme === 'aksiyon' && (
              <div className="fu">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em' }}>Öncelikli Aksiyonlar</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      ['Toplam Maliyet', `₺${topMaliyet.toLocaleString('tr-TR')}K`, AMBER],
                      ['Toplam Fayda', `₺${topFayda.toLocaleString('tr-TR')}K`, GREEN],
                      ['ROI', `%${roi}`, s.renk],
                    ].map(([l, v, c]) => (
                      <div key={l as string} style={{ padding: '6px 12px', borderRadius: 10, background: (c as string) + '12', border: `1px solid ${c as string}30`, textAlign: 'center' }}>
                        <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 2 }}>{l}</div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, fontWeight: 700, color: c as string }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {s.aksiyonlar.map((ak, i) => {
                    const roi_ak = Math.round(ak.fayda / ak.maliyet * 100)
                    return (
                      <div key={ak.baslik} style={{ display: 'grid', gridTemplateColumns: '28px 2fr 90px 90px 70px 70px 90px', gap: 12, alignItems: 'center', padding: '13px 16px', background: '#F8F6F3', borderRadius: 14, border: `1px solid ${i === 0 ? oncelikRenk(ak.oncelik) + '40' : '#ECEAE8'}` }}>
                        <div style={{ width: 24, height: 24, borderRadius: 7, background: s.renk, color: 'white', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{ak.baslik}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>Süre: {ak.sure} · {ak.kategori}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 2 }}>Maliyet</div>
                          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700, color: AMBER }}>₺{ak.maliyet}K</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 2 }}>Yıllık Fayda</div>
                          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700, color: GREEN }}>₺{ak.fayda}K</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 2 }}>ROI</div>
                          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700, color: s.renk }}>%{roi_ak}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 2 }}>Geri Ödeme</div>
                          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 700, color: NAVY }}>{(ak.maliyet / ak.fayda).toFixed(1)} yıl</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 99, fontWeight: 700, background: oncelikRenk(ak.oncelik) + '18', color: oncelikRenk(ak.oncelik) }}>
                            {ak.oncelik.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ marginTop: 16, padding: '13px 16px', background: s.renk + '08', border: `1px solid ${s.renk}20`, borderRadius: 12 }}>
                  <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.7, margin: 0 }}>
                    <strong>Toplam Yatırım:</strong> ₺{topMaliyet.toLocaleString('tr-TR')}K &nbsp;→&nbsp;
                    <strong>Yıllık Koruma:</strong> ₺{topFayda.toLocaleString('tr-TR')}K &nbsp;→&nbsp;
                    <strong>Net ROI:</strong> %{roi} &nbsp;·&nbsp;
                    <strong>Geri Ödeme:</strong> {(topMaliyet / topFayda).toFixed(1)} yıl
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alt: tüm sektörler EAL karşılaştırma */}
        <div style={{ marginTop: 16, background: 'white', borderRadius: 16, border: '1px solid #ECEAE8', padding: '20px 22px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Platform Geneli EAL Karşılaştırması · Toplam ₺{topEAL.toFixed(1)}M/yıl</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
            {SEKTORLER.sort((a, b) => b.eal_yillik - a.eal_yillik).map(sx => (
              <div key={sx.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }} onClick={() => setSeciliSektor(sx.id)}>
                <div style={{ fontSize: 18 }}>{sx.icon}</div>
                <div style={{ width: '100%', background: '#F1F0EF', borderRadius: 99, overflow: 'hidden', height: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', height: `${sx.eal_yillik / topEAL * 100}%`, background: sx.renk, borderRadius: 99, transition: 'height .5s ease', minHeight: 8 }} />
                </div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700, color: sx.renk }}>₺{sx.eal_yillik}M</div>
                <div style={{ fontSize: 9, color: '#9CA3AF', textAlign: 'center' }}>{sx.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 36, fontSize: 11, color: '#D1CEC9' }}>
          RESILIA · İTÜ AYM iş birliğiyle · BIA Metodolojisi ISO 22301 · 2025-2026
        </div>
      </div>
    </div>
  )
}
