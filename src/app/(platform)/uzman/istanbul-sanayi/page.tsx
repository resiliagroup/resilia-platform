'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@supabase/supabase-js'
import {
  AlertTriangle, Building2, Users, MapPin, Activity, Shield,
  FileText, ChevronRight, TrendingUp, Zap, BarChart3,
  CheckCircle2, XCircle, Clock, RefreshCw,
  Flame, Droplets, Cpu, Target, BookOpen, Layers,
  ArrowUpRight, Loader2, Info, Factory, Globe, Award,
  HeartHandshake, Lightbulb, Radio,
  CheckSquare, ArrowRight,
} from 'lucide-react'

const IstanbulHarita = dynamic(() => import('./IstanbulHarita'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', background: '#F8FAFC', borderRadius: 16 }}>
      <div style={{ textAlign: 'center' }}>
        <MapPin size={32} color="#CBD5E1" style={{ marginBottom: 12 }} />
        <p style={{ fontSize: 14, color: '#94A3B8' }}>Harita yükleniyor…</p>
      </div>
    </div>
  )
})

const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)

/* ── THEME ─────────────────────────────────────────────── */
const T = {
  bg:       '#F0F4F8',
  surface:  '#FFFFFF',
  border:   '#E2E8F0',
  borderL:  '#F1F5F9',
  teal:     '#0D9488',
  tealL:    '#CCFBF1',
  tealD:    '#0F766E',
  navy:     '#0F172A',
  slate:    '#334155',
  muted:    '#64748B',
  subtle:   '#94A3B8',
  red:      '#EF4444',
  redL:     '#FEF2F2',
  orange:   '#F97316',
  orangeL:  '#FFF7ED',
  amber:    '#D97706',
  amberL:   '#FFFBEB',
  green:    '#10B981',
  greenL:   '#ECFDF5',
  blue:     '#3B82F6',
  blueL:    '#EFF6FF',
  purple:   '#8B5CF6',
  purpleL:  '#F5F3FF',
}

/* ── TABS ───────────────────────────────────────────────── */
type TabKey = 'ozet' | 'tesis' | 'sektor' | 'harita' | 'natech' | 'bia' | 'satakol' | 'is-modeli' | 'hro-agile' | 'roi' | 'aksiyon'

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'ozet',       label: 'Genel Bakış',        icon: <BarChart3 size={14}/> },
  { key: 'tesis',      label: 'Tesis Ağı',           icon: <Building2 size={14}/> },
  { key: 'sektor',     label: 'Sektör Analizi',      icon: <Layers size={14}/> },
  { key: 'harita',     label: 'GIS Harita',          icon: <MapPin size={14}/> },
  { key: 'natech',     label: 'NATECH',              icon: <Flame size={14}/> },
  { key: 'bia',        label: 'İş Sürekliliği',      icon: <Shield size={14}/> },
  { key: 'satakol',    label: 'SATAKOL Formu',       icon: <FileText size={14}/> },
  { key: 'is-modeli',  label: 'İş Modeli',           icon: <TrendingUp size={14}/> },
  { key: 'hro-agile',  label: 'HRO & AGİLE',         icon: <Zap size={14}/> },
  { key: 'roi',        label: 'ROI Analizi',          icon: <TrendingUp size={14}/> },
  { key: 'aksiyon',    label: 'Aksiyon Merkezi',      icon: <CheckSquare size={14}/> },
]

/* ── SHARED COMPONENTS ──────────────────────────────────── */
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: '24px 28px',
      ...style
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ icon, title, sub, color = T.teal }: {
  icon: React.ReactNode; title: string; sub?: string; color?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: T.tealL,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: T.navy, margin: 0 }}>{title}</p>
        {sub && <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>{sub}</p>}
      </div>
    </div>
  )
}

function KPICard({ value, label, sub, color = T.teal, icon, trend }: {
  value: string; label: string; sub?: string; color?: string; icon?: React.ReactNode; trend?: string
}) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: '20px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, ${color}88)`
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>{label}</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: T.navy, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>{sub}</p>}
          {trend && <p style={{ fontSize: 11, color: color, margin: '6px 0 0', fontWeight: 600 }}>{trend}</p>}
        </div>
        {icon && (
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 700,
      color, background: bg,
      display: 'inline-block'
    }}>
      {label}
    </span>
  )
}

/* ── TAB: GENEL BAKIŞ ───────────────────────────────────── */
function TabOzet() {
  const KPI_DATA = [
    { value: '22.846', label: 'Toplam Tesis', sub: 'İSO kayıtlı üye', color: T.teal, icon: <Building2 size={20}/>, trend: 'İstanbul Geneli' },
    { value: '18.712', label: 'Koordinatlı', sub: '%81.9 kapsama oranı', color: T.blue, icon: <MapPin size={20}/>, trend: '+1.2% bu yıl' },
    { value: '1.053.058', label: 'Toplam İstihdam', sub: 'Kayıtlı çalışan', color: T.purple, icon: <Users size={20}/>, trend: 'Aktif işyeri' },
    { value: '193', label: 'Kritik Tesis', sub: 'URI skoru ≥ 60', color: T.red, icon: <AlertTriangle size={20}/>, trend: 'Öncelikli müdahale' },
  ]

  const RISK_DATA = [
    { label: 'Kritik Risk (URI ≥ 60)', count: 193, pct: 0.8, color: T.red, bg: T.redL },
    { label: 'Yüksek Risk (40–60)', count: 3652, pct: 16.0, color: T.orange, bg: T.orangeL },
    { label: 'Orta Risk (20–40)', count: 8642, pct: 37.8, color: T.amber, bg: T.amberL },
    { label: 'Düşük Risk (< 20)', count: 10359, pct: 45.4, color: T.green, bg: T.greenL },
  ]

  const VERI_KALITE = [
    { lbl: 'İSO Kayıt No', pct: 100, ok: true },
    { lbl: 'NACE Sektör Kodu', pct: 100, ok: true },
    { lbl: 'GPS Koordinatı', pct: 81.9, ok: true },
    { lbl: 'Çalışan Sayısı', pct: 76.2, ok: true },
    { lbl: 'Yapı Yaşı/Türü', pct: 0, ok: false },
    { lbl: 'BCP Planı Varlığı', pct: 0, ok: false },
    { lbl: 'Tehlikeli Madde', pct: 8.1, ok: false },
    { lbl: 'Kritik Altyapı', pct: 0, ok: false },
  ]

  const ILCELER = [
    { ilce: 'Bağcılar', tesis: 2841, uri: 31.4, risk: 'ORTA' },
    { ilce: 'Güngören', tesis: 1923, uri: 29.8, risk: 'ORTA' },
    { ilce: 'Esenler', tesis: 1654, uri: 28.2, risk: 'ORTA' },
    { ilce: 'Küçükçekmece', tesis: 1432, uri: 33.1, risk: 'ORTA' },
    { ilce: 'Tuzla', tesis: 892, uri: 42.7, risk: 'YÜKSEK' },
    { ilce: 'Pendik', tesis: 743, uri: 38.9, risk: 'ORTA' },
    { ilce: 'Kartal', tesis: 651, uri: 35.2, risk: 'ORTA' },
    { ilce: 'Gebze (Kocaeli)', tesis: 612, uri: 44.1, risk: 'YÜKSEK' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${T.teal} 0%, ${T.tealD} 100%)`,
        borderRadius: 20,
        padding: '32px 36px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)'
        }} />
        <div style={{
          position: 'absolute', right: 40, bottom: -60,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)'
        }} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {['HIFYEA METODOLOJİSİ', 'ISO 22301 UYUMLU', 'AFAD AADY 2025', 'İTÜ AYM İŞ BİRLİĞİ'].map(tag => (
            <span key={tag} style={{
              padding: '4px 12px', borderRadius: 20,
              background: 'rgba(255,255,255,0.15)',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em'
            }}>{tag}</span>
          ))}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          İstanbul Sanayi Ekosistemi — Afete Dayanıklılık Platformu
        </h2>
        <p style={{ fontSize: 14, opacity: 0.85, margin: 0, maxWidth: 600, lineHeight: 1.7 }}>
          22.846 tesisin sektörel risk profili, öncelikli müdahale hedefleri ve iş sürekliliği kapasitesi.
          İSO-AYM'nin kurumsal ağırlığı ile Omniversel'in analitik motoru bir arada.
        </p>
        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 16px', fontSize: 12, fontWeight: 600 }}>
             Afete Dayanıklı Sanayi
          </div>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 16px', fontSize: 12, fontWeight: 600 }}>
             İstanbul Geneli
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {KPI_DATA.map(k => <KPICard key={k.label} {...k} />)}
      </div>

      {/* Risk Dağılımı + Veri Kalitesi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <SectionTitle icon={<Activity size={16}/>} title="Risk Dağılımı" sub="URI skoru bazlı sınıflandırma"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RISK_DATA.map(r => (
              <div key={r.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: T.slate }}>{r.label}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{r.count.toLocaleString('tr')}</span>
                    <Badge label={`%${r.pct}`} color={r.color} bg={r.bg} />
                  </div>
                </div>
                <div style={{ height: 8, background: T.borderL, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', background: r.color, borderRadius: 4, transition: 'width 1s' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle icon={<BarChart3 size={16}/>} title="Veri Kalite Göstergesi" sub="Mevcut veri doluluk oranları"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {VERI_KALITE.map(v => (
              <div key={v.lbl} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {v.pct === 100 ? <CheckCircle2 size={14} color={T.green}/> :
                 v.pct === 0   ? <XCircle size={14} color={T.red}/> :
                                 <Clock size={14} color={T.amber}/>}
                <span style={{ fontSize: 13, color: T.slate, flex: 1 }}>{v.lbl}</span>
                <div style={{ width: 100, height: 6, background: T.borderL, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${v.pct}%`, height: '100%', borderRadius: 3,
                    background: v.pct === 100 ? T.green : v.pct === 0 ? T.red : T.amber
                  }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.muted, minWidth: 36, textAlign: 'right' }}>%{v.pct}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* İlçe Tablosu */}
      <Card>
        <SectionTitle icon={<MapPin size={16}/>} title="İlçe Bazlı Risk Özeti" sub="En yüksek tesis yoğunluklu ilçeler"/>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                {['İlçe', 'Tesis Sayısı', 'Ort. URI', 'Risk Seviyesi'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ILCELER.map((r, i) => (
                <tr key={r.ilce} style={{ borderBottom: `1px solid ${T.borderL}`, background: i % 2 === 0 ? 'transparent' : '#FAFBFC' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: T.navy }}>{r.ilce}</td>
                  <td style={{ padding: '12px 16px', color: T.slate }}>{r.tesis.toLocaleString('tr')}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: r.uri >= 40 ? T.orange : T.green }}>{r.uri}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge
                      label={r.risk}
                      color={r.risk === 'YÜKSEK' ? T.orange : T.amber}
                      bg={r.risk === 'YÜKSEK' ? T.orangeL : T.amberL}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3 Faz Planı */}
      <Card>
        <SectionTitle icon={<Target size={16}/>} title="Uygulama Yol Haritası" sub="3 aşamalı dayanıklılık programı"/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { faz: 'FAZ 1', sure: '0–3 Ay', baslik: 'Hızlı Tarama', color: T.teal, bg: T.tealL,
              items: ['22.846 tesise URI hesaplaması', 'Risk haritası yayımı', 'İSO üyelerine dashboard erişimi', '193 kritik tesise öncelikli bildirim'] },
            { faz: 'FAZ 2', sure: '3–9 Ay', baslik: 'Derinlemesine Analiz', color: T.blue, bg: T.blueL,
              items: ['Kimya + metal sektörü detay formu', 'Saha doğrulama (193 kritik tesis)', 'BCP mevcut durum tespiti', 'NATECH senaryo modelleme'] },
            { faz: 'FAZ 3', sure: '9–24 Ay', baslik: 'Sürekli İzleme', color: T.purple, bg: T.purpleL,
              items: ['Canlı URI güncelleme', 'AFAD / Valilik entegrasyonu', 'Sigorta sektörü veri paylaşımı', 'ISO 22301 uyum takibi'] },
          ].map(f => (
            <div key={f.faz} style={{
              background: f.bg,
              borderRadius: 14, padding: '20px 22px',
              border: `1px solid ${f.color}30`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: f.color, letterSpacing: '0.08em' }}>{f.faz}</span>
                <span style={{ fontSize: 11, color: T.muted, background: T.surface, padding: '2px 8px', borderRadius: 8 }}>{f.sure}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: '0 0 14px' }}>{f.baslik}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {f.items.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <ChevronRight size={12} color={f.color} style={{ marginTop: 3, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: T.slate, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ── TAB: TESİS AĞI ─────────────────────────────────────── */
function TabTesis() {
  const SEKTORLER = [
    { ad: 'İlaç ve Eczacılık', tesis: 142, uri: 41.9, risk: 'YÜKSEK', color: T.red, pct: 95 },
    { ad: 'Kimya', tesis: 835, uri: 40.1, risk: 'YÜKSEK', color: T.red, pct: 91 },
    { ad: 'Temel Metal', tesis: 544, uri: 39.1, risk: 'YÜKSEK', color: T.orange, pct: 85 },
    { ad: 'Motorlu Araç', tesis: 579, uri: 33.3, risk: 'ORTA', color: T.orange, pct: 70 },
    { ad: 'Makine ve Ekipman', tesis: 1749, uri: 30.9, risk: 'ORTA', color: T.amber, pct: 62 },
    { ad: 'Elektrikli Ekipman', tesis: 1098, uri: 27.8, risk: 'ORTA', color: T.amber, pct: 54 },
    { ad: 'Metal Ürünleri', tesis: 2211, uri: 27.0, risk: 'DÜŞÜK', color: T.green, pct: 50 },
    { ad: 'Tekstil', tesis: 1880, uri: 24.0, risk: 'DÜŞÜK', color: T.green, pct: 42 },
    { ad: 'Plastik ve Kauçuk', tesis: 1294, uri: 23.2, risk: 'DÜŞÜK', color: T.green, pct: 38 },
    { ad: 'Gıda ve İçecek', tesis: 1565, uri: 21.0, risk: 'DÜŞÜK', color: T.green, pct: 30 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <KPICard value="22.846" label="Toplam Tesis" sub="İSO kayıtlı" color={T.teal} icon={<Building2 size={20}/>} />
        <KPICard value="%81.9" label="Koordinat Kapsama" sub="18.712 tesis" color={T.blue} icon={<MapPin size={20}/>} />
        <KPICard value="193" label="Kritik Öncelikli" sub="URI ≥ 60" color={T.red} icon={<AlertTriangle size={20}/>} />
      </div>

      <Card>
        <SectionTitle icon={<Layers size={16}/>} title="Sektör Bazlı URI Risk Profili" sub="Ortalama URI skoru ve tesis sayısı"/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SEKTORLER.map((s, i) => (
            <div key={s.ad} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '12px 16px', borderRadius: 12,
              background: i % 2 === 0 ? T.bg : T.surface,
              border: `1px solid ${T.borderL}`
            }}>
              <span style={{ fontSize: 13, color: T.slate, width: 180, flexShrink: 0 }}>{s.ad}</span>
              <div style={{ flex: 1, height: 8, background: T.border, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: s.color, minWidth: 36 }}>{s.uri}</span>
              <span style={{ fontSize: 12, color: T.muted, minWidth: 60, textAlign: 'right' }}>{s.tesis.toLocaleString('tr')} tesis</span>
              <Badge
                label={s.risk}
                color={s.risk === 'YÜKSEK' ? T.red : s.risk === 'ORTA' ? T.orange : T.green}
                bg={s.risk === 'YÜKSEK' ? T.redL : s.risk === 'ORTA' ? T.orangeL : T.greenL}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Özet İstatistik Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'OSB Sayısı', value: '22', sub: 'Organize Sanayi Bölgesi', color: T.teal, icon: <Factory size={18}/> },
          { label: 'İhracat Tesisi', value: '3.421', sub: 'Aktif ihracatçı', color: T.blue, icon: <Globe size={18}/> },
          { label: 'ISO Sertifikalı', value: '1.847', sub: 'ISO 9001+', color: T.purple, icon: <Award size={18}/> },
          { label: 'BCP Planı Olan', value: '312', sub: '%1.4 oran', color: T.orange, icon: <Shield size={18}/> },
        ].map(k => <KPICard key={k.label} {...k} />)}
      </div>
    </div>
  )
}

/* ── TAB: SEKTÖR ANALİZİ ────────────────────────────────── */
function TabSektor() {
  const [aktif, setAktif] = useState(0)

  const SEKTORLER_DETAY = [
    {
      ad: 'İlaç & Eczacılık', uri: 41.9, tesis: 142, natech: true, color: T.red,
      alt: ['Farmasötik üretim', 'Hammadde depolama', 'Aktif ilaç bileşeni'],
      riskler: ['Kimyasal sızıntı', 'Kontaminasyon', 'Soğuk zincir kesintisi'],
      hifyea: { H: 72, F: 68, E: 45, C: 38 },
    },
    {
      ad: 'Kimya', uri: 40.1, tesis: 835, natech: true, color: T.red,
      alt: ['Temel kimya', 'Polimer üretimi', 'Boya ve vernik'],
      riskler: ['NATECH patlaması', 'Zehirli gaz yayılımı', 'Yangın riski'],
      hifyea: { H: 70, F: 65, E: 42, C: 35 },
    },
    {
      ad: 'Temel Metal', uri: 39.1, tesis: 544, natech: false, color: T.orange,
      alt: ['Çelik üretimi', 'Alüminyum dökme', 'Metal işleme'],
      riskler: ['Ekipman çöküşü', 'Enerji kesintisi', 'Yangın riski'],
      hifyea: { H: 60, F: 58, E: 40, C: 42 },
    },
    {
      ad: 'Motorlu Araç', uri: 33.3, tesis: 579, natech: false, color: T.orange,
      alt: ['Otomotiv parça', 'Montaj fabrikaları', 'Aksesuar üretimi'],
      riskler: ['Tedarik zinciri', 'Enerji kesintisi', 'Deprem hasarı'],
      hifyea: { H: 55, F: 52, E: 38, C: 45 },
    },
  ]

  const s = SEKTORLER_DETAY[aktif]

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {/* Sol: Liste */}
      <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SEKTORLER_DETAY.map((sek, i) => (
          <button key={sek.ad} onClick={() => setAktif(i)}
            style={{
              padding: '12px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              border: `1px solid ${aktif === i ? sek.color + '40' : T.border}`,
              background: aktif === i ? `${sek.color}08` : T.surface,
              transition: 'all 0.2s',
            }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: aktif === i ? sek.color : T.navy, margin: '0 0 3px' }}>{sek.ad}</p>
            <p style={{ fontSize: 11, color: T.muted, margin: 0 }}>URI {sek.uri} · {sek.tesis} tesis</p>
          </button>
        ))}
      </div>

      {/* Sağ: Detay */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ borderTop: `4px solid ${s.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: T.navy, margin: '0 0 4px' }}>{s.ad}</h3>
              <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>{s.tesis} tesis · Ort. URI: <strong style={{ color: s.color }}>{s.uri}</strong></p>
            </div>
            {s.natech && <Badge label=" NATECH RİSKİ" color={T.red} bg={T.redL} />}
          </div>

          {/* HIFYEA Bar */}
          <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>HIFYEA Boyutları</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(s.hifyea).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 20, fontSize: 12, fontWeight: 800, color: T.slate }}>{k}</span>
                <div style={{ flex: 1, height: 10, background: T.borderL, borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{
                    width: `${v}%`, height: '100%', borderRadius: 5,
                    background: v >= 60 ? T.red : v >= 40 ? T.orange : T.green
                  }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: v >= 60 ? T.red : v >= 40 ? T.orange : T.green, minWidth: 28 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card>
            <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Alt Sektörler</p>
            {s.alt.map(a => (
              <div key={a} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: T.slate }}>{a}</span>
              </div>
            ))}
          </Card>
          <Card>
            <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Başlıca Riskler</p>
            {s.riskler.map(r => (
              <div key={r} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <AlertTriangle size={12} color={T.red} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: T.slate }}>{r}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ── TAB: GIS HARİTA ────────────────────────────────────── */
function TabHarita() {
  return (
    <Card>
      <SectionTitle icon={<MapPin size={16}/>} title="İstanbul Sanayi Tesis Haritası" sub="URI risk renklendirmesi · NATECH bayrakları · Cluster görünümü"/>
      <IstanbulHarita />
    </Card>
  )
}

/* ── TAB: NATECH ────────────────────────────────────────── */
function TabNatech() {
  const NATECH_TESISLER = [
    { ad: 'Tuzla Kimya OSB', sektor: 'Kimya', natech: 9.2, uri: 67, seveso: 'Üst Eşik', color: T.red },
    { ad: 'Gebze Petrokimya', sektor: 'Petrokimya', natech: 8.7, uri: 71, seveso: 'Üst Eşik', color: T.red },
    { ad: 'Kartal Metal İşleme', sektor: 'Metal', natech: 7.1, uri: 52, seveso: 'Alt Eşik', color: T.orange },
    { ad: 'Pendik İlaç Fab.', sektor: 'İlaç', natech: 6.8, uri: 48, seveso: 'Alt Eşik', color: T.orange },
    { ad: 'Bağcılar Boya', sektor: 'Kimya', natech: 6.2, uri: 44, seveso: 'Alt Eşik', color: T.orange },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <KPICard value="127" label="NATECH Tesisi" sub="Tehlikeli madde riskli" color={T.red} icon={<Flame size={20}/>} />
        <KPICard value="34" label="Seveso Kapsamı" sub="AB Direktifi üst/alt eşik" color={T.orange} icon={<AlertTriangle size={20}/>} />
        <KPICard value="8" label="OSB NATECH Bölgesi" sub="Kritik cluster alanı" color={T.purple} icon={<Zap size={20}/>} />
      </div>

      <Card>
        <SectionTitle icon={<Flame size={16}/>} title="Kritik NATECH Tesisleri" sub="En yüksek NATECH skoru"/>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${T.border}` }}>
              {['Tesis', 'Sektör', 'NATECH Skoru', 'URI', 'Seveso'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: T.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NATECH_TESISLER.map((t, i) => (
              <tr key={t.ad} style={{ borderBottom: `1px solid ${T.borderL}`, background: i % 2 === 0 ? 'transparent' : T.bg }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: T.navy }}>{t.ad}</td>
                <td style={{ padding: '12px 16px', color: T.slate }}>{t.sektor}</td>
                <td style={{ padding: '12px 16px', fontWeight: 800, color: t.color, fontSize: 15 }}>{t.natech}</td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: t.color }}>{t.uri}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge label={t.seveso} color={t.color} bg={t.color === T.red ? T.redL : T.orangeL} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Domino Senaryosu */}
      <Card style={{ borderLeft: `4px solid ${T.red}` }}>
        <SectionTitle icon={<AlertTriangle size={16}/>} title="Tuzla OSB — Domino Etkisi Senaryosu" sub="M7.2 deprem + NATECH tetikleyici"/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { step: '01', title: 'Tetikleyici', desc: 'M7.2 deprem — Kuzey Anadolu Fayı', color: T.red },
            { step: '02', title: 'Yapısal Hasar', desc: 'Kimyasal depo çöküşü, boru kırığı', color: T.orange },
            { step: '03', title: 'NATECH Olayı', desc: 'Sızıntı, yangın, patlama riski', color: T.amber },
            { step: '04', title: 'Domino', desc: 'Komşu tesisler etkileniyor', color: T.purple },
          ].map(s => (
            <div key={s.step} style={{ background: `${s.color}08`, border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 18px' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: '0.1em' }}>ADIM {s.step}</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: '6px 0 4px' }}>{s.title}</p>
              <p style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ── TAB: BIA / İŞ SÜREKLİLİĞİ ─────────────────────────── */
function TabBIA() {
  const [aktifSen, setAktifSen] = useState(0)

  const SENARYOLAR = [
    {
      baslik: 'M7.2 Deprem — İstanbul', olasilik: 'Yüksek', etki: 'Çok Yüksek',
      rto: '72 saat', rpo: '24 saat', color: T.red,
      fazlar: [
        { baslik: 'Acil Müdahale (0–4 saat)', adimlar: ['Tüm personel sayımı', 'Yapısal hasar tespiti', 'Afet ekibi aktivasyonu', 'Acil komuta merkezi'] },
        { baslik: 'Stabilizasyon (4–24 saat)', adimlar: ['IT sistemleri değerlendirme', 'Yedek tesis aktivasyonu', 'Sigorta bildirimi', 'Müşteri iletişimi'] },
        { baslik: 'Kurtarma (1–7 gün)', adimlar: ['İş sürekliliği uygulama', 'Altyapı onarımı', 'Üretim kademeli başlatma'] },
      ]
    },
    {
      baslik: 'NATECH — Kimyasal Kaza', olasilik: 'Orta', etki: 'Yüksek',
      rto: '48 saat', rpo: '12 saat', color: T.orange,
      fazlar: [
        { baslik: 'Acil İzolasyon (0–2 saat)', adimlar: ['Tesis tahliyesi', 'Acil kesme vanası', 'AFAD & İtfaiye bildirim', 'Güvenlik perimetresi'] },
        { baslik: 'Müdahale (2–24 saat)', adimlar: ['Sızıntı kontrol', 'Personel tıbbi tarama', 'Çevre koruma önlemleri'] },
      ]
    },
    {
      baslik: 'Siber Saldırı / OT', olasilik: 'Orta', etki: 'Orta',
      rto: '36 saat', rpo: '8 saat', color: T.purple,
      fazlar: [
        { baslik: 'İzolasyon (0–1 saat)', adimlar: ['OT ağı segmentasyonu', 'SCADA izolasyon', 'Siber ekip aktivasyonu'] },
        { baslik: 'Kurtarma (1–36 saat)', adimlar: ['Temiz yedekten restore', 'Sistem doğrulama', 'Üretim yeniden başlatma'] },
      ]
    },
  ]

  const s = SENARYOLAR[aktifSen]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card style={{ padding: '20px 28px' }}>
        <SectionTitle icon={<Shield size={16}/>} title="İş Sürekliliği & BCP" sub="Sanayi tesisleri — senaryo bazlı müdahale planları"/>
      </Card>
      {/* Senaryo Seçici */}
      <div style={{ display: 'flex', gap: 12 }}>
        {SENARYOLAR.map((sen, i) => (
          <button key={i} onClick={() => setAktifSen(i)}
            style={{
              flex: 1, padding: '14px 18px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
              border: `1px solid ${aktifSen === i ? sen.color + '60' : T.border}`,
              background: aktifSen === i ? `${sen.color}08` : T.surface,
            }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: aktifSen === i ? sen.color : T.muted, margin: '0 0 4px' }}>{sen.olasilik} Olasılık</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: 0 }}>{sen.baslik}</p>
          </button>
        ))}
      </div>

      {/* Senaryo Detay */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <Card>
          <div style={{ height: 4, background: s.color, borderRadius: 2, marginBottom: 20, margin: '-24px -28px 20px' }} />
          <p style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Senaryo Parametreleri</p>
          {[
            { label: 'Olasılık', value: s.olasilik },
            { label: 'Etki', value: s.etki },
            { label: 'RTO Hedefi', value: s.rto },
            { label: 'RPO Hedefi', value: s.rpo },
          ].map(p => (
            <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${T.borderL}` }}>
              <span style={{ fontSize: 13, color: T.muted }}>{p.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{p.value}</span>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle icon={<Clock size={16}/>} title="Müdahale Fazları" sub={s.baslik}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {s.fazlar.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: `${s.color}15`, color: s.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, flexShrink: 0
                }}>{i + 1}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: '0 0 6px' }}>{f.baslik}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {f.adimlar.map(a => (
                      <div key={a} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.color, marginTop: 5, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: T.slate }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ── TAB: SATAKOL FORMU ─────────────────────────────────── */
function TabSatakol() {
  const [acik, setAcik] = useState<string | null>('tehlike')

  const BOLUMLER = [
    { id: 'tehlike', label: 'Tehlike (T1-T8)', icon: <AlertTriangle size={14}/>, color: T.red, count: 8, tamamlanan: 0 },
    { id: 'kirilganlik', label: 'Kırılganlık (S1-S15)', icon: <Activity size={14}/>, color: T.orange, count: 15, tamamlanan: 0 },
    { id: 'kapasite', label: 'Kapasite (Y1-Y35)', icon: <Shield size={14}/>, color: T.teal, count: 35, tamamlanan: 0 },
    { id: 'hro', label: 'HRO (H1-H5)', icon: <Lightbulb size={14}/>, color: T.purple, count: 5, tamamlanan: 0 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <Card style={{ background: `linear-gradient(135deg, ${T.teal}10, ${T.blue}08)`, border: `1px solid ${T.teal}30` }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <FileText size={22}/>
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: T.navy, margin: '0 0 4px' }}>SATAKOL Sanayi Değerlendirme Formu</h3>
            <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>63 soru · HIFYEA Metodolojisi · ISO 22301 uyumlu · AFAD AADY 2025</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: T.teal, margin: '0 0 2px' }}>0/63</p>
            <p style={{ fontSize: 11, color: T.muted, margin: 0 }}>tamamlanan soru</p>
          </div>
        </div>
      </Card>

      {/* Bölümler */}
      {BOLUMLER.map(b => (
        <div key={b.id}>
          <button onClick={() => setAcik(acik === b.id ? null : b.id)}
            style={{
              width: '100%', padding: '16px 20px', borderRadius: 14, cursor: 'pointer',
              background: acik === b.id ? `${b.color}08` : T.surface,
              border: `1px solid ${acik === b.id ? b.color + '40' : T.border}`,
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
            }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${b.color}15`, color: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {b.icon}
            </div>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: T.navy }}>{b.label}</span>
            <Badge label={`${b.tamamlanan}/${b.count}`} color={b.color} bg={`${b.color}15`} />
            {acik === b.id ? <ChevronRight size={16} color={T.muted} style={{ transform: 'rotate(90deg)' }}/> : <ChevronRight size={16} color={T.muted}/>}
          </button>
          {acik === b.id && (
            <div style={{ margin: '8px 0 0', padding: '16px 20px', background: T.bg, borderRadius: 12, border: `1px solid ${T.borderL}` }}>
              <p style={{ fontSize: 13, color: T.muted, margin: '0 0 12px' }}>
                Bu bölümde {b.count} soru bulunmaktadır. Tesis bazlı değerlendirme için lütfen önce bir tesis seçiniz.
              </p>
              <div style={{
                padding: '12px 16px', borderRadius: 10, background: `${b.color}08`,
                border: `1px solid ${b.color}20`, display: 'flex', alignItems: 'center', gap: 10
              }}>
                <Info size={14} color={b.color}/>
                <span style={{ fontSize: 12, color: T.slate }}>
                  Form çıktıları PDF olarak indirilebilir ve Supabase'e otomatik kaydedilir.
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── TAB: İŞ MODELİ ─────────────────────────────────────── */
function TabIsModeli() {
  const GELIR_AKISLARI = [
    { icon: '', baslik: 'Platform SaaS', hedef: '₺130M', yil: 'Y5', color: T.teal,
      desc: 'Yıllık abonelik — tesis başına veya kurumsal lisans. İSO üyelerine ölçekli fiyat.',
      detay: ['İSO üyelerine ölçekli fiyat', 'Kullanıcı başına veya tesis paketi', 'API erişimi ek modül'] },
    { icon: '', baslik: 'Danışmanlık', hedef: '₺60M', yil: 'Y5', color: T.blue,
      desc: 'Proje bazlı risk analizi, BCP geliştirme ve ISO 22301 uyum danışmanlığı.',
      detay: ['Tesis bazlı URI doğrulama', 'BCP hazırlama paketi', 'Sektör bazlı raporlama'] },
    { icon: '', baslik: 'Saha Doğrulama', hedef: '₺55M', yil: 'Y5', color: T.purple,
      desc: 'Fiziksel saha ziyaretleri, tatbikat koordinasyonu ve gerçek zamanlı ölçüm.',
      detay: ['193 kritik tesis öncelikli', 'Tatbikat senaryo tasarımı', 'Saha doğrulama raporu'] },
    { icon: '', baslik: 'Kurumsal + Uluslararası', hedef: '₺35M', yil: 'Y5', color: T.orange,
      desc: 'Büyük ölçekli kurumsal lisanslar ve Türkiye modeli ihracatı.',
      detay: ['AFAD / Bakanlık entegrasyonu', 'MENA bölgesi genişleme', 'Sigorta sektörü verisi'] },
  ]

  const PROJ = [
    { yil: 'Y1', toplam: 3 },
    { yil: 'Y2', toplam: 25 },
    { yil: 'Y3', toplam: 68 },
    { yil: 'Y4', toplam: 148 },
    { yil: 'Y5', toplam: 280 },
  ]
  const maxVal = 280

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero */}
      <Card style={{ background: `linear-gradient(135deg, ${T.navy} 0%, #1E3A5F 100%)`, border: 'none', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', margin: '0 0 8px', textTransform: 'uppercase' }}>5 Yıllık Projeksiyon</p>
            <h3 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>₺280M</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Toplam hedef gelir — Y5</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Çarpan</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: T.teal, margin: 0 }}>93×</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Y1→Y5 büyüme</p>
          </div>
        </div>
      </Card>

      {/* Gelir Akışları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {GELIR_AKISLARI.map(g => (
          <Card key={g.baslik} style={{ borderTop: `3px solid ${g.color}` }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{g.icon}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: '0 0 2px' }}>{g.baslik}</p>
                <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>{g.desc}</p>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 16, fontWeight: 800, color: g.color, whiteSpace: 'nowrap' }}>{g.hedef}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {g.detay.map(d => (
                <div key={d} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: g.color }} />
                  <span style={{ fontSize: 12, color: T.slate }}>{d}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Yıllık Projeksiyon Bar */}
      <Card>
        <SectionTitle icon={<TrendingUp size={16}/>} title="Yıllık Gelir Projeksiyonu" sub="₺M cinsinden kümülatif hedef"/>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 160, marginTop: 16 }}>
          {PROJ.map(p => (
            <div key={p.yil} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: T.teal }}>₺{p.toplam}M</span>
              <div style={{
                width: '100%', borderRadius: '6px 6px 0 0',
                background: `linear-gradient(180deg, ${T.teal}, ${T.tealD})`,
                height: `${(p.toplam / maxVal) * 130}px`,
                minHeight: 6,
              }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: T.muted }}>{p.yil}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* İSO Stratejik Avantajlar */}
      <Card>
        <SectionTitle icon={<HeartHandshake size={16}/>} title="İSO Stratejik Avantajları" sub="Neden İSO-Omniversel ortaklığı?"/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: <Radio size={18}/>, title: 'Üye Erişimi', desc: '22.846 tesis — doğrudan erişim, pazarlama maliyeti yok', color: T.teal },
            { icon: <Shield size={18}/>, title: 'Kurumsal Güven', desc: '100+ yıllık İSO kurumsal itibarı', color: T.blue },
            { icon: <Globe size={18}/>, title: 'Regülatör Bağlantısı', desc: 'AFAD, Valilik, Bakanlık entegrasyonu', color: T.purple },
          ].map(a => (
            <div key={a.title} style={{ padding: '16px', borderRadius: 12, background: `${a.color}08`, border: `1px solid ${a.color}20` }}>
              <div style={{ color: a.color, marginBottom: 8 }}>{a.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: '0 0 4px' }}>{a.title}</p>
              <p style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.5 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ── TAB: HRO & AGILE ───────────────────────────────────── */
function TabHROAgile() {
  const [altTab, setAltTab] = useState<'hro'|'agile'>('hro')

  const HRO_ILKELER = [
    {
      no: 1, baslik: 'Başarısızlığa Takıntı', renk: T.red,
      aciklama: 'Personel "sistemimiz güvenli" varsayımından kaçınıyor, zayıf sinyalleri aktif arıyor.',
      gostergeler: ['Near-miss raporlama sayısı (aylık)', 'Anormallik tespiti süresi (saat)', 'Uyarı sinyali yanıt oranı (%)'],
      olgunluk: 2,
      bulgular: ['Kimya sektöründe near-miss raporlama %34 ortalamanın altında', 'Metal sektöründe anormallik tespiti ortalama 4.2 saat'],
      aksiyon: 'Near-miss kültürü eğitimi + aylık raporlama zorunluluğu',
    },
    {
      no: 2, baslik: 'Basitleştirmeye Direnç', renk: T.orange,
      aciklama: 'Karmaşık sorunları tek nedene indirgemekten kaçınır, sistematik RCA uygular.',
      gostergeler: ['RCA tamamlanma oranı (%)', 'Kök neden başına ortalama neden sayısı', '5-Why uygulaması (%)'],
      olgunluk: 3,
      bulgular: ['İSO tesislerinin %61\'i tek neden analizi yapıyor', 'Çok nedenli RCA sadece büyük tesislerde'],
      aksiyon: '5-Why eğitimi + olay başına minimum 3 kök neden zorunluluğu',
    },
    {
      no: 3, baslik: 'Operasyona Duyarlılık', renk: T.amber,
      aciklama: 'Saha çalışanları anormallik gördüklerinde üretimi durdurma yetkisine sahip.',
      gostergeler: ['Saha kaynaklı üretim durdurma sayısı', 'Durdurma sonrası ortalama süre (dk)', 'Yönetici destek skoru (1-5)'],
      olgunluk: 2,
      bulgular: ['Sanayi tesislerinin %78\'inde saha durdurma yetkisi yok', 'Üretim baskısı güvenlik kararlarını etkiliyor'],
      aksiyon: 'Stop-Work Authority politikası + yönetici taahhütü + ödül sistemi',
    },
    {
      no: 4, baslik: 'Dayanıklılığa Bağlılık', renk: T.teal,
      aciklama: 'Beklenmedik olaylardan hızlı toparlanma kapasitesi — tatbikat ve senaryo planlaması.',
      gostergeler: ['Toparlanma tatbikatı sayısı (yıllık)', 'Ortalama toparlanma süresi (saat)', 'BCP test skoru (%)'],
      olgunluk: 3,
      bulgular: ['Sadece %23 tesis yılda 2+ tatbikat yapıyor', 'BCP test ortalaması %41'],
      aksiyon: 'Yılda minimum 2 senaryo tatbikatı + AAR zorunluluğu',
    },
    {
      no: 5, baslik: 'Uzmanlığa Saygı', renk: T.purple,
      aciklama: 'Kriz anında karar en üst kademeden değil en bilgili kişiden alınır.',
      gostergeler: ['Uzman kaynaklı kriz kararı oranı (%)', 'Hiyerarşi atlama vakası sayısı', 'Uzman memnuniyet skoru'],
      olgunluk: 2,
      bulgular: ['%67 tesiste kriz kararı yöneticiden geliyor', 'Uzman görüşü %45 vakada görmezden geliniyor'],
      aksiyon: 'Kriz komuta yapısı revizyonu + uzman yetki protokolü',
    },
  ]

  const AGILE_SPRINTLER = [
    {
      sprint: 'Sprint 1', sure: '2 Hafta', durum: 'Tamamlandı', renk: T.green,
      hedef: 'Acil Durum Ekibi Kurulumu',
      gorevler: [
        { baslik: 'ADE görev tanımları yazıldı', tamamlandi: true },
        { baslik: 'İletişim hiyerarşisi oluşturuldu', tamamlandi: true },
        { baslik: 'Telsiz ekipmanı temin edildi', tamamlandi: true },
        { baslik: 'İlk tatbikat yapıldı', tamamlandi: false },
      ],
      velocity: 75,
    },
    {
      sprint: 'Sprint 2', sure: '2 Hafta', durum: 'Devam Ediyor', renk: T.orange,
      hedef: 'BCP Temel Senaryolar',
      gorevler: [
        { baslik: 'Deprem senaryosu yazıldı', tamamlandi: true },
        { baslik: 'NATECH senaryo taslağı', tamamlandi: true },
        { baslik: 'RTO/RPO hedefleri belirlendi', tamamlandi: false },
        { baslik: 'Yedek tesis anlaşması', tamamlandi: false },
      ],
      velocity: 50,
    },
    {
      sprint: 'Sprint 3', sure: '2 Hafta', durum: 'Planlandı', renk: T.muted,
      hedef: 'Siber Güvenlik Temelleri',
      gorevler: [
        { baslik: 'OT ağ segmentasyonu', tamamlandi: false },
        { baslik: 'SCADA güvenlik denetimi', tamamlandi: false },
        { baslik: 'Yedekleme sistemi kurulumu', tamamlandi: false },
        { baslik: 'Penetrasyon testi', tamamlandi: false },
      ],
      velocity: 0,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${T.border}` }}>
        {(['hro', 'agile'] as const).map(t => (
          <button key={t} onClick={() => setAltTab(t)}
            style={{
              padding: '10px 24px', fontSize: 13, fontWeight: altTab === t ? 700 : 400,
              color: altTab === t ? T.teal : T.muted,
              background: 'none', border: 'none',
              borderBottom: altTab === t ? `2px solid ${T.teal}` : '2px solid transparent',
              cursor: 'pointer',
            }}>
            {t === 'hro' ? ' HRO Olgunluk Matrisi' : ' AGILE Dayanıklılık Planı'}
          </button>
        ))}
      </div>

      {altTab === 'hro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {HRO_ILKELER.map(h => (
              <Card key={h.no} style={{ textAlign: 'center', padding: '16px 12px' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: h.renk }}>{h.olgunluk}<span style={{ fontSize: 13, color: T.muted }}>/5</span></div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4, lineHeight: 1.3 }}>{h.baslik}</div>
                <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: T.borderL }}>
                  <div style={{ height: '100%', width: `${h.olgunluk/5*100}%`, borderRadius: 2, background: h.renk }} />
                </div>
              </Card>
            ))}
          </div>
          {HRO_ILKELER.map(h => (
            <Card key={h.no}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${h.renk}15`, color: h.renk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>
                  {h.no}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: 0 }}>{h.baslik}</p>
                    <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: `${h.renk}15`, color: h.renk, fontWeight: 700 }}>Olgunluk {h.olgunluk}/5</span>
                  </div>
                  <p style={{ fontSize: 12, color: T.muted, margin: '0 0 12px', lineHeight: 1.6 }}>{h.aciklama}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: T.slate, margin: '0 0 6px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Göstergeler</p>
                      {h.gostergeler.map(g => (
                        <div key={g} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: h.renk, marginTop: 5, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: T.slate }}>{g}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: T.slate, margin: '0 0 6px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>İSO Bulguları</p>
                      {h.bulgular.map(b => (
                        <div key={b} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                          <AlertTriangle size={10} color={h.renk} style={{ marginTop: 3, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: T.slate }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 12, padding: '10px 14px', background: `${h.renk}08`, borderRadius: 8, borderLeft: `3px solid ${h.renk}` }}>
                    <span style={{ fontSize: 12, color: T.navy, fontWeight: 600 }}> Aksiyon: </span>
                    <span style={{ fontSize: 12, color: T.slate }}>{h.aksiyon}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {altTab === 'agile' && (
        <Card>
          <SectionTitle icon={<Zap size={16}/>} title="AGILE Dayanıklılık Planı" sub="2 haftalık sprint döngüsü — sürekli iyileştirme"/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {AGILE_SPRINTLER.map(s => (
              <div key={s.sprint} style={{ border: `1px solid ${s.renk}30`, borderRadius: 12, padding: 16, background: `${s.renk}05` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.renk }}>{s.sprint}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${s.renk}15`, color: s.renk }}>{s.durum}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: '0 0 12px' }}>{s.hedef}</p>
                {s.gorevler.map(g => (
                  <div key={g.baslik} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${g.tamamlandi ? T.green : T.border}`, background: g.tamamlandi ? T.green : 'white', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {g.tamamlandi && <span style={{ color: 'white', fontSize: 9, fontWeight: 900 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 12, color: g.tamamlandi ? T.muted : T.navy, textDecoration: g.tamamlandi ? 'line-through' : 'none' }}>{g.baslik}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: T.muted }}>Velocity</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.renk }}>{s.velocity}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: T.borderL }}>
                    <div style={{ height: '100%', width: `${s.velocity}%`, borderRadius: 2, background: s.renk }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

/* ── TAB: ROI ANALİZİ ───────────────────────────────────── */
function TabROI() {
  const [secilenSektor, setSecilenSektor] = useState('Kimya')
  const [yatirim, setYatirim] = useState(500000)

  const SEKTOR_PROFIL: Record<string, { ortUri: number; gunlukKayip: number; toparlanmaSure: number; sigorta: number }> = {
    'Kimya':        { ortUri: 40.1, gunlukKayip: 850000, toparlanmaSure: 18, sigorta: 120000 },
    'Metal':        { ortUri: 39.1, gunlukKayip: 620000, toparlanmaSure: 14, sigorta: 85000 },
    'Motorlu Araç': { ortUri: 33.3, gunlukKayip: 980000, toparlanmaSure: 21, sigorta: 140000 },
    'İlaç':         { ortUri: 41.9, gunlukKayip: 750000, toparlanmaSure: 16, sigorta: 110000 },
    'Tekstil':      { ortUri: 28.4, gunlukKayip: 320000, toparlanmaSure: 9,  sigorta: 45000 },
    'Gıda':         { ortUri: 25.1, gunlukKayip: 410000, toparlanmaSure: 7,  sigorta: 55000 },
  }

  const profil = SEKTOR_PROFIL[secilenSektor] ?? SEKTOR_PROFIL['Kimya']
  const URI_IYILESME = 8
  const riskAzaltmaOrani = URI_IYILESME / 100 * 0.7
  const yillikKayipRiski = profil.gunlukKayip * profil.toparlanmaSure * 0.15
  const onlenenKayip = yillikKayipRiski * riskAzaltmaOrani * 10
  const sigortaIndirim = profil.sigorta * 0.15 * 10
  const toplamFayda = onlenenKayip + sigortaIndirim
  const netROI = ((toplamFayda - yatirim * 10) / (yatirim * 10) * 100).toFixed(0)
  const geriOdeme = (yatirim / (toplamFayda / 10)).toFixed(1)
  const fmt = (n: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <SectionTitle icon={<TrendingUp size={16}/>} title="ROI Hesaplayıcı" sub="Afet dayanıklılık yatırımının 10 yıllık geri dönüşü"/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.slate, marginBottom: 8 }}>Sektör</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.keys(SEKTOR_PROFIL).map(s => (
                <button key={s} onClick={() => setSecilenSektor(s)}
                  style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                    border: `1px solid ${secilenSektor === s ? T.teal : T.border}`,
                    background: secilenSektor === s ? T.tealL : 'white',
                    color: secilenSektor === s ? T.teal : T.muted,
                    fontWeight: secilenSektor === s ? 700 : 400 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.slate, marginBottom: 8 }}>
              Yıllık Dayanıklılık Yatırımı: <span style={{ color: T.navy, fontWeight: 900 }}>{fmt(yatirim)}</span>
            </p>
            <input type="range" min={100000} max={5000000} step={100000} value={yatirim}
              onChange={e => setYatirim(Number(e.target.value))}
              style={{ width: '100%', accentColor: T.teal }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.muted, marginTop: 4 }}>
              <span>100K TRY</span><span>5M TRY</span>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Önlenen Kayıp (10 yıl)', value: fmt(onlenenKayip), color: T.green, icon: '' },
          { label: 'Sigorta Tasarrufu (10 yıl)', value: fmt(sigortaIndirim), color: T.teal, icon: '' },
          { label: 'Net ROI (10 yıl)', value: `%${netROI}`, color: Number(netROI) > 0 ? T.green : T.red, icon: '' },
          { label: 'Geri Ödeme Süresi', value: `${geriOdeme} yıl`, color: T.orange, icon: '' },
        ].map(k => (
          <Card key={k.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.4 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      <Card>
        <SectionTitle icon={<Target size={16}/>} title="Sektör Kırılganlık Profili" sub={secilenSektor + ' sektörü — İSO verisi'}/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Ortalama URI Skoru', value: profil.ortUri.toString(), sub: 'Yüksek = riskli', color: profil.ortUri > 35 ? T.red : T.orange },
            { label: 'Günlük Üretim Kaybı', value: fmt(profil.gunlukKayip), sub: 'Tam duruş senaryosu', color: T.navy },
            { label: 'Ortalama Toparlanma', value: profil.toparlanmaSure + ' gün', sub: 'M7.2 deprem senaryosu', color: T.orange },
          ].map(p => (
            <div key={p.label} style={{ padding: 16, border: `1px solid ${T.border}`, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>{p.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: p.color }}>{p.value}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{p.sub}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ── TAB: AKSİYON MERKEZİ ───────────────────────────────── */
function TabAksiyon() {
  const [filtre, setFiltre] = useState<'tumu'|'acil'|'planlandi'|'tamamlandi'>('tumu')

  const AKSIYONLAR = [
    { id: 'A01', baslik: 'Tuzla OSB NATECH Acil Müdahale Planı', kategori: 'NATECH', oncelik: 'Acil', sorumlu: 'İSO-AYM + AFAD', sure: '30 gün', etki: 'Yüksek', durum: 'acil', uri_etkisi: -4.2, maliyet: '85,000 TRY' },
    { id: 'A02', baslik: '193 Kritik Tesis Yapısal Değerlendirme', kategori: 'Yapısal', oncelik: 'Acil', sorumlu: 'İnşaat Müh.', sure: '60 gün', etki: 'Çok Yüksek', durum: 'acil', uri_etkisi: -6.1, maliyet: '420,000 TRY' },
    { id: 'A03', baslik: 'Kimya Sektörü Near-Miss Raporlama Sistemi', kategori: 'HRO', oncelik: 'Yüksek', sorumlu: 'Tesis Yönetimleri', sure: '45 gün', etki: 'Orta', durum: 'planlandi', uri_etkisi: -2.8, maliyet: '12,000 TRY' },
    { id: 'A04', baslik: 'Metal Sektörü Ekipman Ankraj Programı', kategori: 'Yapısal', oncelik: 'Yüksek', sorumlu: 'OSB Yönetimi', sure: '90 gün', etki: 'Yüksek', durum: 'planlandi', uri_etkisi: -3.4, maliyet: '280,000 TRY' },
    { id: 'A05', baslik: 'OT/SCADA Siber Güvenlik Denetimi', kategori: 'Siber', oncelik: 'Yüksek', sorumlu: 'BT Ekipleri', sure: '45 gün', etki: 'Orta', durum: 'planlandi', uri_etkisi: -2.1, maliyet: '95,000 TRY' },
    { id: 'A06', baslik: 'BCP Tatbikat Programı — Tüm Sektörler', kategori: 'BCP', oncelik: 'Orta', sorumlu: 'İSO-AYM', sure: '120 gün', etki: 'Yüksek', durum: 'planlandi', uri_etkisi: -3.9, maliyet: '45,000 TRY' },
    { id: 'A07', baslik: 'Temel Afet Bilinci Eğitimi — 500 Tesis', kategori: 'Eğitim', oncelik: 'Orta', sorumlu: 'İSO-AYM', sure: '180 gün', etki: 'Orta', durum: 'planlandi', uri_etkisi: -1.8, maliyet: '180,000 TRY' },
    { id: 'A08', baslik: 'ISO 22301 Sertifikasyon Danışmanlığı', kategori: 'Sertifikasyon', oncelik: 'Düşük', sorumlu: 'Danışman Firma', sure: '365 gün', etki: 'Orta', durum: 'planlandi', uri_etkisi: -2.5, maliyet: '320,000 TRY' },
    { id: 'A09', baslik: 'Sel Erken Uyarı Sistemi — Kavaklı/Gürpınar', kategori: 'Altyapı', oncelik: 'Acil', sorumlu: 'İBB + İSO', sure: '45 gün', etki: 'Yüksek', durum: 'tamamlandi', uri_etkisi: -3.2, maliyet: '650,000 TRY' },
    { id: 'A10', baslik: 'Üyeler Arası Kaynak Transferi Envanteri', kategori: 'Koordinasyon', oncelik: 'Orta', sorumlu: 'İSO-AYM', sure: '60 gün', etki: 'Orta', durum: 'tamamlandi', uri_etkisi: -1.2, maliyet: '8,000 TRY' },
  ]

  const filtrelenmis = filtre === 'tumu' ? AKSIYONLAR : AKSIYONLAR.filter(a => a.durum === filtre)
  const ONCELIK_RENK: Record<string, string> = { 'Acil': T.red, 'Yüksek': T.orange, 'Orta': T.amber, 'Düşük': T.muted }
  const DURUM_RENK:   Record<string, string> = { 'acil': T.red, 'planlandi': T.orange, 'tamamlandi': T.green }
  const DURUM_LABEL:  Record<string, string> = { 'acil': 'Acil', 'planlandi': 'Planlandı', 'tamamlandi': 'Tamamlandı' }
  const toplamURI     = AKSIYONLAR.reduce((s, a) => s + a.uri_etkisi, 0)
  const tamamlananURI = AKSIYONLAR.filter(a => a.durum === 'tamamlandi').reduce((s, a) => s + a.uri_etkisi, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Toplam Aksiyon', value: AKSIYONLAR.length, color: T.navy, icon: '' },
          { label: 'Acil Aksiyon', value: AKSIYONLAR.filter(a => a.durum === 'acil').length, color: T.red, icon: '' },
          { label: 'Tamamlanan URI İyileşmesi', value: tamamlananURI.toFixed(1), color: T.green, icon: '' },
          { label: 'Potansiyel URI İyileşmesi', value: toplamURI.toFixed(1), color: T.teal, icon: '' },
        ].map(k => (
          <Card key={k.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{k.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {(['tumu', 'acil', 'planlandi', 'tamamlandi'] as const).map(f => (
          <button key={f} onClick={() => setFiltre(f)}
            style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
              border: `1px solid ${filtre === f ? T.teal : T.border}`,
              background: filtre === f ? T.tealL : 'white',
              color: filtre === f ? T.teal : T.muted,
              fontWeight: filtre === f ? 700 : 400 }}>
            {f === 'tumu' ? 'Tümü' : f === 'acil' ? ' Acil' : f === 'planlandi' ? ' Planlandı' : ' Tamamlandı'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtrelenmis.map(a => (
          <Card key={a.id}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${DURUM_RENK[a.durum]}15`, color: DURUM_RENK[a.durum], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, flexShrink: 0 }}>
                {a.id}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: 0, flex: 1 }}>{a.baslik}</p>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${ONCELIK_RENK[a.oncelik]}15`, color: ONCELIK_RENK[a.oncelik], fontWeight: 700 }}>{a.oncelik}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${DURUM_RENK[a.durum]}15`, color: DURUM_RENK[a.durum], fontWeight: 700 }}>{DURUM_LABEL[a.durum]}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const }}>
                  {[
                    { label: 'Kategori', value: a.kategori },
                    { label: 'Sorumlu', value: a.sorumlu },
                    { label: 'Süre', value: a.sure },
                    { label: 'URI Etkisi', value: a.uri_etkisi.toFixed(1) + ' puan' },
                    { label: 'Tahmini Maliyet', value: a.maliyet },
                  ].map(p => (
                    <div key={p.label}>
                      <span style={{ fontSize: 10, color: T.muted }}>{p.label}: </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.navy }}>{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ── ANA SAYFA ───────────────────────────────────────────── */
export default function IstanbulSanayiPage() {
  const [tab, setTab] = useState<TabKey>('ozet')
  const [dbCount, setDbCount] = useState<number | null>(null)

  useEffect(() => {
    sb.from('facilities').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count !== null) setDbCount(count)
    })
  }, [])

  const TAB_CONTENT: Record<TabKey, React.ReactNode> = {
    ozet:       <TabOzet />,
    tesis:      <TabTesis />,
    sektor:     <TabSektor />,
    harita:     <TabHarita />,
    natech:     <TabNatech />,
    bia:        <TabBIA />,
    satakol:    <TabSatakol />,
    'is-modeli': <TabIsModeli />,
    'hro-agile': <TabHROAgile />,
    'roi':       <TabROI />,
    'aksiyon':   <TabAksiyon />,
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh' }}>
      {/* Top Header */}
      <div style={{
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        padding: '16px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/hub" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: T.muted, textDecoration: 'none', fontWeight: 600
          }}>
            <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
            Hub
          </a>
          <span style={{ color: T.border }}>·</span>
          <a href="/uzman/dashboard" style={{ fontSize: 12, color: T.muted, textDecoration: 'none', fontWeight: 600 }}>Uzman Paneli</a>
          <span style={{ color: T.border }}>·</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>İstanbul Sanayi</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {dbCount !== null && (
            <span style={{
              fontSize: 12, color: T.teal, background: T.tealL,
              padding: '4px 12px', borderRadius: 20, fontWeight: 600
            }}>
              Supabase · {dbCount.toLocaleString('tr')} kayıt
            </span>
          )}
          <span style={{
            fontSize: 11, fontWeight: 700, color: T.muted,
            background: T.bg, padding: '4px 12px', borderRadius: 20,
            border: `1px solid ${T.border}`
          }}>İSO-AYM · Omniversel</span>
        </div>
      </div>

      <div style={{ padding: '24px 28px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Page Title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: `linear-gradient(135deg, ${T.teal}, ${T.tealD})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff'
            }}>
              <Factory size={22}/>
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: T.navy, margin: 0, letterSpacing: '-0.02em' }}>
                İstanbul Sanayi Ekosistemi
              </h1>
              <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
                Urban Resilience OS · OMNIVERSEL
              </p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: T.slate, margin: 0, lineHeight: 1.7, maxWidth: 700 }}>
            <strong style={{ color: T.teal }}>Afete Dayanıklı Sanayi</strong> — İstanbul Sanayi Odası'nın yetki alanındaki tüm üyelerin
            afet kırılganlık profilini analiz eden, önceliklendiren ve iş sürekliliği kapasitesini geliştiren entegre platform.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: 24,
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 6, flexWrap: 'wrap'
        }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
                fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? T.teal : T.muted,
                background: tab === t.key ? T.tealL : 'transparent',
                border: tab === t.key ? `1px solid ${T.teal}30` : '1px solid transparent',
                transition: 'all 0.15s',
              }}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {TAB_CONTENT[tab]}
      </div>
    </div>
  )
}
