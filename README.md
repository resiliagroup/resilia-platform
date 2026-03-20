# RESILIA Platform

**Kurumsal Dayanıklılık & İş Sürekliliği Yönetimi**
İTÜ AYM (Afet Yönetimi Uygulama ve Araştırma Merkezi) iş birliğiyle geliştirilmiştir.

---

## Hızlı Başlangıç

### 1. Projeyi Oluştur

```bash
# Terminal'de bu klasörün olduğu dizine git
npx create-next-app@latest resilia-platform \
  --typescript --tailwind --eslint \
  --app --src-dir --no-turbopack \
  --import-alias "@/*"

cd resilia-platform
```

### 2. Dosyaları Kopyala

Bu repo'daki tüm dosyaları yeni oluşturulan `resilia-platform` klasörüne kopyalayın.
(Mevcut `src/app/page.tsx` ve `src/app/layout.tsx` üzerine yazın)

### 3. Bağımlılıkları Yükle

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 4. Ortam Değişkenlerini Ayarla

```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını açın ve Supabase anahtarını girin:
- Supabase Dashboard: https://app.supabase.com/project/jvmvhzvozegjaonggahq/settings/api
- `anon` `public` anahtarını kopyalayıp `NEXT_PUBLIC_SUPABASE_ANON_KEY` alanına yapıştırın

### 5. Veritabanını Kur

1. https://app.supabase.com/project/jvmvhzvozegjaonggahq adresine gidin
2. Sol menüden **SQL Editor** → **New Query**
3. `supabase/schema.sql` dosyasının tüm içeriğini yapıştırın
4. **Run** butonuna tıklayın

### 6. Uygulamayı Başlat

```bash
npm run dev
```

Tarayıcıda açın: http://localhost:3000

---

## Demo Hesaplar (Şifre: 1234)

| E-posta | Rol | Sektör |
|---------|-----|--------|
| sube@akbank.com | Birim | Bankacılık |
| uzman@akbank.com | Uzman | Bankacılık |
| board@akbank.com | Yönetim | Bankacılık |
| tesis@medicalpark.com | Birim | Sağlık |
| birim@ibb.istanbul | Birim | Belediye |
| uzman@ibb.istanbul | Uzman | Belediye |
| okul@meb.gov.tr | Birim | MEB |
| fabrika@gebzeosb.com | Birim | Üretim |
| uye@iso.org.tr | Birim | Odalar |

---

## Sektörler

| Sektör | Alt Birim | Mevzuat |
|--------|-----------|---------|
| 🏦 Bankacılık & Finans | Şube | BDDK 26333, ISO 22301 |
| 🏥 Sağlık | Tesis | HAP, JCI |
| 🏨 Konaklama & Turizm | Otel | TÜRSAB |
| 🏭 Üretim Tesisleri | Fabrika/OSB | 6331, Seveso III |
| 🔧 Hizmet Sektörü | İşletme | ISO 22301, KVKK |
| 🏛️ Odalar (Sanayi & Ticaret) | Üye Firma | TOBB, TESK |
| 🏙️ Belediyeler | Birim | 5393, AFAD |
| 📚 MEB / Eğitim | Okul | MEB Genelge, AFAD |

---

## Proje Yapısı

```
src/
├── app/
│   ├── (platform)/
│   │   ├── login/page.tsx          — Giriş ekranı
│   │   ├── form/page.tsx           — Birim değerlendirme formu
│   │   ├── uzman/
│   │   │   ├── dashboard/page.tsx  — Uzman izleme merkezi
│   │   │   └── sube/[kod]/page.tsx — Birim detay analizi
│   │   └── board/ozet/page.tsx     — Yönetim özet ekranı
│   ├── layout.tsx
│   ├── page.tsx                    — /login'e yönlendirir
│   └── globals.css
├── lib/
│   ├── supabase.ts                 — Supabase istemcisi
│   ├── sorular.ts                  — 44 HFE sorusu
│   ├── bcm-hesapla.ts              — Skor hesaplama motoru
│   ├── senaryolar.ts               — Sektöre özgü senaryolar
│   └── auth.ts                     — Demo auth & localStorage
└── types/
    └── index.ts                    — Tüm TypeScript tipleri
```

---

## Metodoloji: HFE-360

**H — Tehlike:** Dış tehditlerin gerçekleşme ihtimali ve şiddeti (8 soru, ters puanlama)  
**F — Kırılganlık:** Birimin iç yapısal zayıflıkları (14 soru, ters puanlama)  
**E — Kapasite:** Hazırlık, önlem ve müdahale kapasitesi (23 soru, düz puanlama)

> Toplam 44 soru · Ağırlıklı puanlama · 0-100 dayanıklılık skoru  
> < 40 = KRİTİK · 40-70 = ORTA RİSK · ≥ 70 = GÜÇLÜ

---

## Yakında

- [ ] Marketing sayfaları (resilia.group)
- [ ] CBS harita entegrasyonu
- [ ] PDF rapor üretimi
- [ ] Trend analizi
- [ ] Multi-tenant tam auth (Supabase Auth)
- [ ] BDDK / MEB compliance modülleri

---

*RESILIA © 2025-2026 · İTÜ AYM iş birliğiyle geliştirilmiştir*
# cache bust 20 Mar 2026 Cum +03 23:26:52
