'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import OmniverselLogo from '@/components/OmniverselLogo'

/* ─── design tokens ────────────────────────────────────────────── */
const N      = '#0A1628'
const T      = '#2D8A87'
const G      = '#E8C97A'
const GR     = '#F4F7F6'
const MG     = '#566B66'
const BG     = '#FFFFFF'
const BORDER = '#E8EDED'

/* ─── sector data ──────────────────────────────────────────────── */
const SECTORS = [
  {
    title: 'Bankacılık & Finans',
    icon: '/icons/Icon_PROTECT_10_Risk.png',
    color: '#1565C0',
    desc: 'Operasyonel risk envanteri, İSP geliştirme ve Basel III uyum gereksinimleri doğrultusunda kurumsal dayanıklılık.',
    standards: ['ISO 22301', 'Basel III', 'BDDK'],
  },
  {
    title: 'Sağlık & Hastane',
    icon: '/icons/Icon_REC_06_Health.png',
    color: '#C62828',
    desc: 'Kritik hasta hizmetleri sürekliliği, tıbbi altyapı kırılganlık değerlendirmesi ve OKS entegrasyonu.',
    standards: ['ISO 22301', 'Sendai SF-3', 'HAP'],
  },
  {
    title: 'Sanayi & Üretim',
    icon: '/icons/Icon_RESP_04_Infrastructure.png',
    color: '#E56A04',
    desc: 'NATECH kaskad senaryo analizi, tedarik zinciri kesintisi modellemesi ve ALARP ilkesiyle risk müdahalesi.',
    standards: ['RAPID-N', 'ISO 31000', 'SEVESO'],
  },
  {
    title: 'Kamu & Belediye',
    icon: '/icons/Icon_MIT_04_Community.png',
    color: '#2D8A87',
    desc: 'Kentsel ölçekte tesis kırılganlık değerlendirmesi ve Sendai Çerçevesi önceliklerine göre yatırım planlaması.',
    standards: ['Sendai', 'omniRISK', '5393 BelK'],
  },
  {
    title: 'Eğitim Kurumları',
    icon: '/icons/Icon_PROTECT_01_Planning.png',
    color: '#3B7EC8',
    desc: 'Okul afet risk yönetimi planları, tatbikat yönetimi ve Sendai SF-2 kapsamında dirençlilik değerlendirmesi.',
    standards: ['AFAD', 'MEB', 'Sendai SF-2'],
  },
  {
    title: 'Kritik Altyapı',
    icon: '/icons/Icon_PROTECT_09_Physical.png',
    color: '#FFC801',
    desc: 'Enerji, su ve ulaşım sistemlerinde N-1 analizi, bağımlılık haritalaması ve CIP standartlarına uyum.',
    standards: ['CIP', 'ISO 22301', 'SCADA'],
  },
  {
    title: 'Turizm & Konaklama',
    icon: '/icons/Icon_REC_08_Natural.png',
    color: '#7B5EA7',
    desc: 'Misafir güvenliği protokolleri, tahliye planlaması ve sezon bazlı iş sürekliliği planı geliştirme.',
    standards: ['ISO 22301', 'NFPA 101', 'TÜRSAB'],
  },
  {
    title: 'Lojistik & Tedarik',
    icon: '/icons/Icon_PROTECT_11_Supply.png',
    color: '#2D8A87',
    desc: 'Kritik tedarikçi kırılganlık skorlaması, alternatif rota planlaması ve tedarik zinciri dayanıklılığı.',
    standards: ['ISO 28000', 'ISO 22301', 'INCOTERMS'],
  },
]

/* ─── sector card ──────────────────────────────────────────────── */
function SectorCard({ sector }: { sector: typeof SECTORS[number] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: BG,
        border: `1px solid ${hovered ? T : BORDER}`,
        borderRadius: 12,
        borderTop: `4px solid ${sector.color}`,
        padding: '28px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 32px rgba(45,138,135,0.14)'
          : '0 2px 8px rgba(10,22,40,0.06)',
      }}
    >
      {/* icon */}
      <div style={{ width: 48, height: 48, flexShrink: 0 }}>
        <img
          src={sector.icon}
          alt={sector.title}
          style={{ width: 48, height: 48, objectFit: 'contain' }}
        />
      </div>

      {/* title */}
      <h3 style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 17,
        fontWeight: 700,
        color: N,
        margin: 0,
        lineHeight: 1.3,
      }}>
        {sector.title}
      </h3>

      {/* desc */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        color: MG,
        margin: 0,
        lineHeight: 1.6,
        flexGrow: 1,
      }}>
        {sector.desc}
      </p>

      {/* standards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {sector.standards.map((s) => (
          <span
            key={s}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: MG,
              background: GR,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              padding: '2px 8px',
              letterSpacing: '0.02em',
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* link */}
      <div style={{ marginTop: 4 }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: T,
          letterSpacing: '0.01em',
          cursor: 'pointer',
        }}>
          Detaylı İncele →
        </span>
      </div>
    </div>
  )
}

/* ─── page ─────────────────────────────────────────────────────── */
export default function SektorlerPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: ${GR}; }

        .sector-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1100px) {
          .sector-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .sector-grid { grid-template-columns: 1fr; }
        }

        .cta-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
        }
      `}</style>

      {/* ── nav ── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: N,
        borderBottom: `1px solid rgba(255,255,255,0.07)`,
        padding: '0 40px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <OmniverselLogo />
        <Link
          href="/"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: '#FFFFFF',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            opacity: 0.85,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
        >
          ← Ana Sayfa
        </Link>
      </nav>

      {/* ── hero ── */}
      <section style={{
        background: N,
        padding: '80px 40px 72px',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: T,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: 18,
        }}>
          SEKTÖREL ÇÖZÜMLER
        </span>
        <h1 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 800,
          color: '#FFFFFF',
          lineHeight: 1.15,
          marginBottom: 20,
          maxWidth: 700,
          margin: '0 auto 20px',
        }}>
          Sektöre Özgü Afet Risk Yönetimi
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 17,
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 580,
          margin: '0 auto',
          lineHeight: 1.7,
        }}>
          Her sektörün kendine özgü tehlike profili, kırılganlık yapısı ve yasal uyum gereksinimleri bulunmaktadır.
        </p>
      </section>

      {/* ── sector grid ── */}
      <main style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '60px 40px',
      }}>
        <div className="sector-grid">
          {SECTORS.map((s) => (
            <SectorCard key={s.title} sector={s} />
          ))}
        </div>
      </main>

      {/* ── CTA band ── */}
      <section style={{
        background: T,
        padding: '64px 40px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(22px, 3vw, 34px)',
          fontWeight: 800,
          color: '#FFFFFF',
          marginBottom: 32,
          lineHeight: 1.2,
        }}>
          Sektörünüz için Demo Alın
        </h2>
        <div className="cta-buttons">
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: N,
              background: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              padding: '14px 32px',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Demo Talep Et
          </button>
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: '#FFFFFF',
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.7)',
              borderRadius: 8,
              padding: '14px 32px',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'border-color 0.15s, opacity 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FFFFFF'
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'
              e.currentTarget.style.opacity = '1'
            }}
          >
            İletişime Geç
          </button>
        </div>
      </section>
    </>
  )
}
