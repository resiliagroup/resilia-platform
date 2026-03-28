'use client'

import { Check, X, TrendingUp, Shield, Zap, Building2, Users, FileCheck } from 'lucide-react'
import Link from 'next/link'

const C = {
  bg:      '#F8FAFC',
  card:    '#FFFFFF',
  border:  '#E2E8F0',
  text:    '#1E293B',
  muted:   '#64748B',
  accent:  '#2563EB',
  green:   '#16A34A',
  red:     '#DC2626',
  amber:   '#D97706',
}

const PAKETLER = [
  {
    id: 'temel',
    isim: 'Temel',
    alt: 'Az Tehlikeli Sektörler',
    isg: 'ISG Sınıf 3',
    fiyat: '4.900',
    birim: 'tesis / yıl',
    renk: '#64748B',
    ozellikler: [
      { label: 'Dijital risk formu (TEMEL — 9 alan)',    var: true },
      { label: 'Otomatik URI skoru',                     var: true },
      { label: 'HIFYEA temel raporu (PDF)',               var: true },
      { label: 'E-posta özet bildirimi',                  var: true },
      { label: 'Çözüm bankası (3 öneri)',                 var: true },
      { label: 'NACE tehlike sınıfı rozeti',              var: true },
      { label: 'Adaptif soru derinliği',                  var: false },
      { label: 'ISO 22301 gap analizi',                   var: false },
      { label: 'Sektör karşılaştırma benchmarkı',         var: false },
      { label: 'Harita & kluster görünümü',               var: false },
      { label: 'API erişimi',                             var: false },
      { label: 'Özel danışman ataması',                   var: false },
    ],
  },
  {
    id: 'standart',
    isim: 'Standart',
    alt: 'Tehlikeli Sektörler',
    isg: 'ISG Sınıf 2',
    fiyat: '14.900',
    birim: 'tesis / yıl',
    renk: C.accent,
    ozellikler: [
      { label: 'Dijital risk formu (ORTA — 12 alan)',     var: true },
      { label: 'Otomatik URI skoru',                      var: true },
      { label: 'HIFYEA tam raporu (PDF)',                  var: true },
      { label: 'E-posta + SMS bildirimi',                  var: true },
      { label: 'Çözüm bankası (10 öneri)',                 var: true },
      { label: 'NACE tehlike sınıfı rozeti',               var: true },
      { label: 'Adaptif soru derinliği',                   var: true },
      { label: 'ISO 22301 gap analizi',                    var: true },
      { label: 'Sektör karşılaştırma benchmarkı',          var: true },
      { label: 'Harita & kluster görünümü',                var: false },
      { label: 'API erişimi',                              var: false },
      { label: 'Özel danışman ataması',                    var: false },
    ],
    one_cikan: true,
  },
  {
    id: 'pro',
    isim: 'Pro',
    alt: 'Çok Tehlikeli Sektörler',
    isg: 'ISG Sınıf 1',
    fiyat: '39.900',
    birim: 'tesis / yıl',
    renk: '#7C3AED',
    ozellikler: [
      { label: 'Dijital risk formu (TAM — 36 alan)',       var: true },
      { label: 'Otomatik URI skoru',                       var: true },
      { label: 'HIFYEA premium raporu (PDF + Excel)',       var: true },
      { label: 'E-posta + SMS + telefon bildirimi',         var: true },
      { label: 'Çözüm bankası (sınırsız öneri)',            var: true },
      { label: 'NACE tehlike sınıfı rozeti',                var: true },
      { label: 'Adaptif soru derinliği',                    var: true },
      { label: 'ISO 22301 gap analizi',                     var: true },
      { label: 'Sektör karşılaştırma benchmarkı',           var: true },
      { label: 'Harita & kluster görünümü',                 var: true },
      { label: 'API erişimi',                               var: true },
      { label: 'Özel danışman ataması',                     var: true },
    ],
  },
]

const GELIR_SENARYOSU = [
  { yil: 2025, temel: 120,  standart: 45,  pro: 12,  toplam: 177,  gelir: '2.1M' },
  { yil: 2026, temel: 310,  standart: 130, pro: 38,  toplam: 478,  gelir: '6.4M' },
  { yil: 2027, temel: 580,  standart: 290, pro: 85,  toplam: 955,  gelir: '14.2M' },
  { yil: 2028, temel: 920,  standart: 510, pro: 160, toplam: 1590, gelir: '25.1M' },
  { yil: 2029, temel: 1400, standart: 820, pro: 280, toplam: 2500, gelir: '41.8M' },
]

const KARSILASTIRMA = [
  { kategori: 'Form & Veri',        ozellik: 'Soru sayısı',              temel: '9 soru', standart: '12 soru', pro: '36 soru' },
  { kategori: 'Form & Veri',        ozellik: 'NACE otomatik eşleşme',    temel: true,     standart: true,      pro: true },
  { kategori: 'Form & Veri',        ozellik: 'Coğrafi konum (GPS)',       temel: false,    standart: true,      pro: true },
  { kategori: 'Analiz & Rapor',     ozellik: 'URI hesaplama',             temel: 'Temel',  standart: 'Gelişmiş', pro: 'Premium' },
  { kategori: 'Analiz & Rapor',     ozellik: 'ISO 22301 gap analizi',     temel: false,    standart: true,      pro: true },
  { kategori: 'Analiz & Rapor',     ozellik: 'Benchmark karşılaştırma',   temel: false,    standart: true,      pro: true },
  { kategori: 'Aksiyon & Çözüm',   ozellik: 'Çözüm bankası önerileri',   temel: '3',      standart: '10',      pro: 'Sınırsız' },
  { kategori: 'Aksiyon & Çözüm',   ozellik: 'Maliyet bazlı filtreleme',  temel: false,    standart: true,      pro: true },
  { kategori: 'Platform & Entegre', ozellik: 'Admin paneli erişimi',      temel: false,    standart: true,      pro: true },
  { kategori: 'Platform & Entegre', ozellik: 'Harita görünümü',           temel: false,    standart: false,     pro: true },
  { kategori: 'Platform & Entegre', ozellik: 'API erişimi',               temel: false,    standart: false,     pro: true },
  { kategori: 'Destek',             ozellik: 'Teknik destek',             temel: 'E-posta', standart: 'Öncelikli', pro: 'Dedicated' },
]

function OzellikSatiri({ label, var: varMi }: { label: string; var: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: `1px solid ${C.border}` }}>
      {varMi
        ? <Check size={16} color={C.green} style={{ flexShrink: 0 }} />
        : <X size={16} color={C.red} style={{ flexShrink: 0 }} />}
      <span style={{ fontSize: 13, color: varMi ? C.text : C.muted }}>{label}</span>
    </div>
  )
}

function KarsilastirmaHucre({ deger }: { deger: boolean | string }) {
  if (typeof deger === 'boolean') {
    return deger
      ? <Check size={16} color={C.green} />
      : <X size={16} color={C.red} />
  }
  return <span style={{ fontSize: 13, color: C.text }}>{deger}</span>
}

export default function IsoPagePage() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <Shield size={28} color={C.accent} />
          <span style={{ fontSize: 28, fontWeight: 700, color: C.text }}>Resilia Paket Seçenekleri</span>
        </div>
        <p style={{ fontSize: 15, color: C.muted, maxWidth: 560, margin: '0 auto 8px' }}>
          İstanbul Sanayi Odası üyelerine özel ISG tehlike sınıfı bazlı dijital dirençlilik paketleri
        </p>
        <div style={{ display: 'inline-block', background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 6, padding: '4px 12px' }}>
          <span style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>Gizli — Yalnızca İSO Yönetimi</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

        {/* Paket Kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
          {PAKETLER.map(p => (
            <div
              key={p.id}
              style={{
                background: C.card,
                border: `2px solid ${p.one_cikan ? p.renk : C.border}`,
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: p.one_cikan ? '0 4px 20px rgba(37,99,235,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {p.one_cikan && (
                <div style={{ background: p.renk, color: '#fff', textAlign: 'center', padding: '6px 0', fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                  EN POPULER
                </div>
              )}

              {/* Paket Başlık */}
              <div style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.renk }} />
                  <span style={{ fontSize: 18, fontWeight: 700 }}>{p.isim}</span>
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>{p.alt}</div>
                <div style={{
                  display: 'inline-block',
                  background: `${p.renk}18`,
                  border: `1px solid ${p.renk}40`,
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 11,
                  color: p.renk,
                  fontWeight: 600,
                  marginBottom: 16,
                }}>
                  {p.isg}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: p.renk }}>₺{p.fiyat}</span>
                  <span style={{ fontSize: 13, color: C.muted }}>/ {p.birim}</span>
                </div>
              </div>

              {/* Özellikler */}
              <div style={{ padding: '16px 24px 24px' }}>
                {p.ozellikler.map((o, i) => (
                  <OzellikSatiri key={i} label={o.label} var={o.var} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 5 Yıllık Gelir Projeksiyonu */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 40, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={20} color={C.accent} />
            <span style={{ fontSize: 17, fontWeight: 700 }}>5 Yıllık Gelir Projeksiyonu</span>
            <span style={{ fontSize: 12, color: C.muted, marginLeft: 8 }}>İSO üye tabanı: ~30.000 tesis</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Yıl', 'Temel', 'Standart', 'Pro', 'Toplam Tesis', 'Tahmini Gelir (TRY)'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Yıl' ? 'left' : 'right', fontSize: 12, fontWeight: 600, color: C.muted, borderBottom: `1px solid ${C.border}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GELIR_SENARYOSU.map((r, i) => (
                  <tr key={r.yil} style={{ background: i % 2 === 0 ? C.card : '#FAFAFA' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: C.text, borderBottom: `1px solid ${C.border}` }}>{r.yil}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#64748B', borderBottom: `1px solid ${C.border}` }}>{r.temel}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: C.accent, borderBottom: `1px solid ${C.border}` }}>{r.standart}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#7C3AED', borderBottom: `1px solid ${C.border}` }}>{r.pro}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{r.toplam}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: C.green, borderBottom: `1px solid ${C.border}` }}>₺{r.gelir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detaylı Karşılaştırma Tablosu */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 40, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileCheck size={20} color={C.accent} />
            <span style={{ fontSize: 17, fontWeight: 700 }}>Detaylı Özellik Karşılaştırması</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: C.muted, width: 120, borderBottom: `1px solid ${C.border}` }}>Kategori</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: C.muted, borderBottom: `1px solid ${C.border}` }}>Özellik</th>
                  {['Temel', 'Standart', 'Pro'].map((h, i) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: [C.muted, C.accent, '#7C3AED'][i], borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KARSILASTIRMA.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.card : '#FAFAFA' }}>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{r.kategori}</td>
                    <td style={{ padding: '10px 16px', fontSize: 13, color: C.text, borderBottom: `1px solid ${C.border}` }}>{r.ozellik}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}><KarsilastirmaHucre deger={r.temel} /></td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}><KarsilastirmaHucre deger={r.standart} /></td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}><KarsilastirmaHucre deger={r.pro} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: C.accent, borderRadius: 12, padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Zap size={20} color='#fff' />
              <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Pilot Başlatmaya Hazır mısınız?</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              İSO bünyesindeki ilk 50 tesis için ücretsiz pilot program. Hemen randevu alın.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href='mailto:info@resilia.com.tr?subject=Resilia%20Pilot%20Program%20Talebi'
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#fff', color: C.accent, padding: '12px 24px',
                borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none',
              }}
            >
              <Users size={16} />
              İletişime Geç
            </a>
            <Link
              href='/hub/iso-brifing'
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '12px 24px',
                borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <Building2 size={16} />
              Brifing Sayfasına Don
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
