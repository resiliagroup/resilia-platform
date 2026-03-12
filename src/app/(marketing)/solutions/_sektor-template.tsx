'use client'
import { useState } from 'react'

// ── Tip tanımları ─────────────────────────────────────────────
export type SektorVeri = {
  slug:        string
  baslik:      string
  altyazi:     string
  aciklama:    string
  mevzuat:     string[]
  ozellikler:  { baslik: string; aciklama: string; ikon: string }[]
  metrikler:   { deger: string; etiket: string; aciklama: string }[]
  senaryolar:  string[]
  hfe: {
    h: { skor: number; ozet: string }
    f: { skor: number; ozet: string }
    e: { skor: number; ozet: string }
  }
  vaka: {
    kurum:   string
    unvan:   string
    metin:   string
    sonuc:   string
  }
}

// ── 8 Sektör Verisi ───────────────────────────────────────────
export const SEKTOR_VERILERI: Record<string, SektorVeri> = {
  banking: {
    slug:     'banking',
    baslik:   'Bankacılık & Finans',
    altyazi:  'BDDK 26333 · ISO 22301 · SWIFT CSP · EU DORA · NIS2',
    aciklama: 'Yüzlerce şubeden oluşan bankacılık ağlarında merkezi dayanıklılık skorlaması, BDDK düzenleyici uyum takibi ve gerçek zamanlı kriz koordinasyonu. HFE-360 metodolojisiyle her şube ayrı ayrı değerlendirilir, ağ genelinde öncelikli iyileştirme planı otomatik oluşturulur.',
    mevzuat:  ['BDDK 26333', 'ISO 22301', 'SWIFT CSP', 'EU DORA', 'NIS2', 'KVKK'],
    ozellikler: [
      { baslik: 'Şube Bazlı HFE-360 Skorlaması', aciklama: 'Her şubenin Tehlike, Kırılganlık ve Kapasite skorları ayrı ayrı hesaplanır. Ağ genelinde karşılaştırmalı analiz yapılır.', ikon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { baslik: 'BDDK 26333 Otomatik Uyum Raporu', aciklama: 'BDDK iş sürekliliği yönetmeliği gerekliliklerine göre otomatik boşluk analizi ve denetçiye hazır raporlama.', ikon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { baslik: 'SWIFT & Ödeme Sistemi Sürekliliği', aciklama: 'Kritik ödeme altyapısı ve SWIFT bağlantısı kesintilerinde iş sürekliliği prosedürleri ve RTO/RPO yönetimi.', ikon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
      { baslik: 'Merkezi Kriz Komuta Merkezi', aciklama: 'Kriz anında tüm şubelerle koordinasyon, görev ataması ve gerçek zamanlı durum takibi tek ekrandan yönetilir.', ikon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
      { baslik: 'EU DORA & NIS2 Uyum Desteği', aciklama: 'Avrupa dijital operasyonel dayanıklılık mevzuatı kapsamında ICT risk yönetimi ve raporlama gereklilikleri.', ikon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
      { baslik: 'Deprem & Coğrafi Risk Katmanı', aciklama: 'Şube lokasyonları fay hatları ve deprem bölgeleriyle otomatik eşleştirilir. CBS tabanlı risk haritası oluşturulur.', ikon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    ],
    metrikler: [
      { deger: '673',  etiket: 'Şube',        aciklama: 'Akbank pilot projesi' },
      { deger: 'BDDK', etiket: 'Uyum',        aciklama: '26333 Yönetmelik' },
      { deger: '44',   etiket: 'Soru',        aciklama: 'HFE-360 değerlendirme' },
      { deger: '%30',  etiket: 'Daha Hızlı',  aciklama: 'BDDK raporlama süresi' },
    ],
    senaryolar: ['Deprem', 'Siber Saldırı', 'SWIFT Kesintisi', 'Sel / Taşkın', 'BDDK Yaptırımı', 'Elektrik Kesintisi', 'Pandemi', 'Kritik Personel Kaybı'],
    hfe: {
      h: { skor: 68, ozet: 'Türkiye deprem riski ve siber tehdit yoğunluğu yüksek' },
      f: { skor: 54, ozet: 'IT bağımlılığı ve şube yoğunluğu kırılganlık yaratıyor' },
      e: { skor: 72, ozet: 'BCP planları mevcut ancak tatbikat sıklığı yetersiz' },
    },
    vaka: {
      kurum:  'Büyük Ölçekli Türk Bankası',
      unvan:  'Risk Yönetimi Direktörü',
      metin:  'OMNI sayesinde 673 şubemizin tamamının dayanıklılık durumunu tek bir ekrandan izliyoruz. Önceliklendirme kararlarımız artık veriye dayalı.',
      sonuc:  'BDDK raporlama süresi %30 kısaldı',
    },
  },

  health: {
    slug:     'health',
    baslik:   'Sağlık',
    altyazi:  'HAP · JCI · ISO 27799 · Sağlık Bakanlığı Genelge',
    aciklama: 'Hastane ve sağlık tesislerinde hasta güvenliğini merkeze alan iş sürekliliği planlaması. Kritik tıbbi altyapı koruması, akreditasyon hazırlığı ve afet anında koordinasyon kapasitesi tek platformda.',
    mevzuat:  ['HAP Hastane Akreditasyonu', 'JCI Uluslararası', 'ISO 27799', 'ISO 22301', 'Sağlık Bakanlığı'],
    ozellikler: [
      { baslik: 'Kritik Tıbbi Ekipman Sürekliliği', aciklama: 'Ventilator, görüntüleme ve ameliyathane sistemlerinin kesintisiz çalışma protokolleri ve yedekleme planları.', ikon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
      { baslik: 'Hasta Tahliye Protokolleri', aciklama: 'Yoğun bakım ve ameliyat hastalarının güvenli tahliyesi için senaryo bazlı protokol yönetimi ve tatbikat takibi.', ikon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0' },
      { baslik: 'HAP/JCI Akreditasyon Desteği', aciklama: 'Akreditasyon gerekliliklerini karşılamaya yönelik otomatik boşluk analizi ve denetim hazırlık raporları.', ikon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
      { baslik: 'Sağlık Bilgi Sistemi Kurtarma', aciklama: 'HIS/PACS/LIS sistemlerinin felaket kurtarma planları, RTO/RPO hedefleri ve test sonuçları merkezi yönetim.', ikon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2' },
      { baslik: 'Pandemi & Salgın Yönetimi', aciklama: 'Enfeksiyon kontrolü prosedürleri, kapasite yönetimi ve sağlık çalışanı koruması senaryolarına özel BCM planları.', ikon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
      { baslik: 'Çok Tesisli Ağ Yönetimi', aciklama: 'Hastane zincirlerinde merkezi izleme, tesis bazlı karşılaştırma ve ağ genelinde kaynak optimizasyonu.', ikon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    ],
    metrikler: [
      { deger: '24',  etiket: 'Tesis',      aciklama: 'Pilot kapsam' },
      { deger: 'JCI', etiket: 'Standart',   aciklama: 'Uluslararası akreditasyon' },
      { deger: 'HAP', etiket: 'Uyum',       aciklama: 'Türkiye hastane akreditasyonu' },
      { deger: '7/24', etiket: 'İzleme',    aciklama: 'Kritik sistem takibi' },
    ],
    senaryolar: ['Pandemi / Salgın', 'Deprem', 'Yangın', 'Elektrik Kesintisi', 'IT Sistemi Çöküşü', 'Toplu Kaza', 'Kritik Personel Kaybı', 'Su / Doğalgaz Kesintisi'],
    hfe: {
      h: { skor: 62, ozet: 'Doğal afet ve salgın riski değişken coğrafi dağılım' },
      f: { skor: 58, ozet: 'Kritik ekipman bağımlılığı ve personel yoğunluğu' },
      e: { skor: 69, ozet: 'Akreditasyon süreçleri kapasite altyapısını güçlendiriyor' },
    },
    vaka: {
      kurum:  'Özel Hastane Zinciri',
      unvan:  'Kalite ve Akreditasyon Direktörü',
      metin:  'JCI akreditasyon hazırlığında BCM boşluk analizini OMNI ile yaptık. Denetçi raporlarımızı artık saatler değil dakikalar içinde hazırlıyoruz.',
      sonuc:  'JCI akreditasyonu ilk başvuruda alındı',
    },
  },

  municipalities: {
    slug:     'municipalities',
    baslik:   'Belediyeler',
    altyazi:  '5393 Sayılı Belediye Kanunu · AFAD · ISO 22301 · İçişleri Bakanlığı',
    aciklama: 'Büyükşehir ve ilçe belediyelerinde afet koordinasyonu, kritik altyapı dayanıklılığı ve vatandaş hizmetlerinin kesintisiz sürdürülmesi. AFAD ile entegre çalışan merkezi kriz yönetim platformu.',
    mevzuat:  ['5393 Belediye Kanunu', 'AFAD Yönetmelik', 'İçişleri Bakanlığı', 'ISO 22301', 'CBS Standartları'],
    ozellikler: [
      { baslik: 'Kent Geneli Risk Haritalaması', aciklama: 'İlçe bazlı tehlike ve kırılganlık skorları CBS katmanlarıyla görselleştirilir. Deprem, sel ve yangın risk bölgeleri otomatik belirlenir.', ikon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
      { baslik: 'AFAD Koordinasyon Entegrasyonu', aciklama: 'AFAD il müdürlükleriyle uyumlu senaryo planlaması, kaynak paylaşımı ve afet anında merkezi koordinasyon.', ikon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
      { baslik: 'Altyapı Servis Sürekliliği', aciklama: 'Su, elektrik, ulaşım ve atık yönetimi gibi kritik belediye hizmetlerinin kesinti senaryoları ve kurtarma planları.', ikon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
      { baslik: 'Kriz İletişim Yönetimi', aciklama: 'Vatandaş bilgilendirme protokolleri, basın yönetimi ve sosyal medya kriz iletişim planları.', ikon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
      { baslik: 'Birim Bazlı Değerlendirme', aciklama: 'Her belediye birimi (itfaiye, zabıta, su idaresi vb.) kendi dayanıklılık formunu doldurur, merkez izler.', ikon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { baslik: 'Deprem Sonrası Hızlı Müdahale', aciklama: 'Deprem sonrası hasar tespiti, acil barınma ve lojistik koordinasyon protokolleri ile saha ekibi yönetimi.', ikon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    ],
    metrikler: [
      { deger: '81',   etiket: 'İl',          aciklama: 'Türkiye geneli kapsam' },
      { deger: 'AFAD', etiket: 'Entegre',      aciklama: 'Resmi koordinasyon' },
      { deger: '5393', etiket: 'Kanun',        aciklama: 'Yasal uyum çerçevesi' },
      { deger: 'CBS',  etiket: 'Harita',       aciklama: 'Coğrafi risk katmanı' },
    ],
    senaryolar: ['Deprem', 'Sel / Taşkın', 'Yangın', 'Fırtına / Aşırı Yağış', 'Altyapı Hasarı', 'Toplumsal Olaylar', 'Pandemi', 'Elektrik Kesintisi'],
    hfe: {
      h: { skor: 74, ozet: 'Kentsel yoğunluk ve doğal afet riski yüksek' },
      f: { skor: 61, ozet: 'Eski altyapı ve dağınık birim yapısı kırılganlık' },
      e: { skor: 58, ozet: 'AFAD entegrasyonu güçlü, BCP planlaması geliştirilmeli' },
    },
    vaka: {
      kurum:  'Büyükşehir Belediyesi',
      unvan:  'Afet ve Acil Durum Koordinatörü',
      metin:  'Tüm birimlerimizin hazırlık durumunu merkezi ekrandan görebilmek, afet anında kaynak dağılımı kararlarımızı çok daha hızlı almamızı sağlıyor.',
      sonuc:  'Müdahale koordinasyon süresi %40 azaldı',
    },
  },

  education: {
    slug:     'education',
    baslik:   'MEB / Eğitim',
    altyazi:  'MEB Genelge · AFAD · Yangın Yönetmeliği · ISO 22301',
    aciklama: 'İl milli eğitim müdürlüklerinin bağlı tüm okulları merkezi bir ekrandan izleyebileceği okul bazlı dayanıklılık değerlendirme sistemi. Öğrenci güvenliği odaklı senaryo planlaması.',
    mevzuat:  ['MEB Afet Genelgesi', 'AFAD', 'Yangın Yönetmeliği', 'Deprem Yönetmeliği', 'ISO 22301'],
    ozellikler: [
      { baslik: 'Okul Bazlı HFE Değerlendirmesi', aciklama: 'Her okulun müdürü kendi değerlendirme formunu doldurur. İl/ilçe MEM tüm okulları merkezi dashboard\'dan izler.', ikon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
      { baslik: 'Tahliye Planı Yönetimi', aciklama: 'Yangın, deprem ve aktif tehdit senaryolarına özel tahliye protokolleri. Tatbikat takibi ve sıklık yönetimi.', ikon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0' },
      { baslik: 'İl/İlçe MEM Dashboard', aciklama: 'Müdürlüğe bağlı tüm okulların risk haritası, skor dağılımı ve öncelikli iyileştirme listesi tek ekranda.', ikon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { baslik: 'Deprem & Yangın Hazırlık Skoru', aciklama: 'Bina yaşı, deprem bölgesi, yangın sistemi durumu ve tahliye altyapısına göre otomatik risk skoru hesaplanır.', ikon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { baslik: 'Öğrenci Güvenliği Protokolleri', aciklama: 'Engelli öğrenci tahliyesi, veli bilgilendirme sistemleri ve psikososyal destek planlarının yönetimi.', ikon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
      { baslik: 'MEB Genelge Uyum Takibi', aciklama: 'Milli Eğitim Bakanlığı afet hazırlık genelgelerine göre otomatik uyum kontrolü ve eksiklik bildirimi.', ikon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    ],
    metrikler: [
      { deger: '60K+', etiket: 'Okul',        aciklama: 'Türkiye geneli potansiyel' },
      { deger: 'MEB',  etiket: 'Uyum',        aciklama: 'Genelge gereklilikleri' },
      { deger: 'AFAD', etiket: 'Entegre',      aciklama: 'Resmi koordinasyon' },
      { deger: 'İl',   etiket: 'Merkezi İzlem',aciklama: 'MEM dashboard' },
    ],
    senaryolar: ['Deprem', 'Yangın', 'Okul Tahliyesi', 'Pandemi / Salgın', 'Elektrik Kesintisi', 'Fırtına / Aşırı Yağış', 'Aktif Tehdit', 'Su Kesintisi'],
    hfe: {
      h: { skor: 70, ozet: 'Deprem riski ve yangın tehlikesi okul yapılarında yüksek' },
      f: { skor: 65, ozet: 'Eski bina stoku ve yetersiz tahliye altyapısı' },
      e: { skor: 52, ozet: 'Tatbikat sıklığı yetersiz, BCP planları geliştirilmeli' },
    },
    vaka: {
      kurum:  'İl Milli Eğitim Müdürlüğü',
      unvan:  'Afet ve Acil Durum Koordinatörü',
      metin:  'İlimize bağlı tüm okulların hazırlık durumunu merkezi olarak görebilmek, bütçe önceliklendirme kararlarımızı veriye dayalı almamızı sağlıyor.',
      sonuc:  'Riskli okul tespiti süesi %60 kısaldı',
    },
  },

  manufacturing: {
    slug:     'manufacturing',
    baslik:   'Üretim Tesisleri',
    altyazi:  '6331 İSG · Seveso III · ISO 45001 · OHSAS 18001',
    aciklama: 'OSB ve üretim tesislerinde iş sağlığı ve güvenliği uyumu, tehlikeli madde yönetimi ve operasyonel sürekliliğin entegre platformu. Seveso direktifi kapsamındaki büyük kaza önleme gereklilikleri dahil.',
    mevzuat:  ['6331 İSG Kanunu', 'Seveso III Direktifi', 'ISO 45001', 'OHSAS 18001', 'ISO 22301', 'Çevre Kanunu'],
    ozellikler: [
      { baslik: 'Seveso III Büyük Kaza Önleme', aciklama: 'Tehlikeli madde eşik değerleri, güvenlik raporu gereklilikleri ve büyük kaza önleme politikası yönetimi.', ikon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
      { baslik: '6331 İSG Uyum Yönetimi', aciklama: 'Risk değerlendirmesi, acil eylem planı, iSG kurulu toplantı takibi ve denetim hazırlık raporları.', ikon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
      { baslik: 'Üretim Hattı Sürekliliği', aciklama: 'Kritik üretim ekipmanı arızaları, hammadde kesintileri ve enerji kesintisi senaryolarında operasyonel süreklilik planları.', ikon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
      { baslik: 'Tedarik Zinciri Risk Analizi', aciklama: 'Kritik hammadde tedarikçisi çeşitliliği, stok tampon analizi ve alternatif tedarik zinciri senaryoları.', ikon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
      { baslik: 'Kimyasal & Tehlikeli Madde Sızıntısı', aciklama: 'Kimyasal kaza senaryoları, tahliye bölgesi planlaması ve acil müdahale ekibi koordinasyonu.', ikon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
      { baslik: 'OSB Çapraz Koordinasyon', aciklama: 'Organize sanayi bölgesinde komşu tesis koordinasyonu, ortak kaynak paylaşımı ve toplu tahliye planlaması.', ikon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0' },
    ],
    metrikler: [
      { deger: 'OSB',  etiket: 'Entegre',      aciklama: 'Organize sanayi bölgeleri' },
      { deger: 'ISO',  etiket: '45001',        aciklama: 'İSG yönetim sistemi' },
      { deger: '6331', etiket: 'Kanun',        aciklama: 'Yasal uyum' },
      { deger: 'S-III',etiket: 'Seveso',       aciklama: 'Büyük kaza önleme' },
    ],
    senaryolar: ['Yangın', 'Kimyasal Sızıntı', 'Patlama', 'Elektrik Kesintisi', 'Deprem', 'Tedarik Zinciri Kesintisi', 'İSG Kazası', 'Çevre Kirliliği'],
    hfe: {
      h: { skor: 78, ozet: 'Tehlikeli madde varlığı ve endüstriyel kaza riski yüksek' },
      f: { skor: 62, ozet: 'Eski ekipman ve yoğun üretim baskısı kırılganlık yaratıyor' },
      e: { skor: 65, ozet: 'İSG altyapısı güçlü, BCP planlaması tamamlanmalı' },
    },
    vaka: {
      kurum:  'Büyük Ölçekli Üretim Tesisi',
      unvan:  'İSG ve Sürdürülebilirlik Direktörü',
      metin:  'Seveso III kapsamındaki tüm gerekliliklerimizi OMNI üzerinden yönetiyoruz. Denetim hazırlık süremiz %50 kısaldı.',
      sonuc:  'Sıfır iş kazası hedefine ulaşıldı',
    },
  },

  chambers: {
    slug:     'chambers',
    baslik:   'Sanayi & Ticaret Odaları',
    altyazi:  'TOBB · TESK · AFAD · ISO 22313',
    aciklama: 'Odaya bağlı sanayi ve ticaret kuruluşlarının tamamını kapsayan merkezi dayanıklılık izleme platformu. Üye firmalar kendi değerlendirmelerini yapar, oda merkezi ekrandan tüm üyeleri izler.',
    mevzuat:  ['TOBB Standartları', 'TESK', 'AFAD', 'ISO 22313', 'ISO 22301', 'Ticaret Kanunu'],
    ozellikler: [
      { baslik: 'Üye Firma Bazlı Değerlendirme', aciklama: 'Her üye firma kendi HFE-360 değerlendirmesini tamamlar. Oda, tüm üyelerin skor dağılımını merkezi dashboard\'dan izler.', ikon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { baslik: 'Sektörel Kıyaslama Raporları', aciklama: 'Üye firmalar sektör ortalamasıyla karşılaştırmalı analiz alır. Oda, sektörel zayıflık haritası oluşturabilir.', ikon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
      { baslik: 'TOBB/TESK Uyum Takibi', aciklama: 'Bağlı oda ve birlik gerekliliklerine göre üye bazlı uyum durumu ve eksiklik bildirimleri.', ikon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
      { baslik: 'Toplu Raporlama Araçları', aciklama: 'Tüm üye verileri tek tıklamayla konsolide rapor haline getirilir. Genel kurul ve denetim raporlaması kolaylaşır.', ikon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { baslik: 'Danışmanlık Kapasite Desteği', aciklama: 'Oda uzmanları üye firmalara BCM danışmanlığı sağlarken OMNI platformunu referans araç olarak kullanabilir.', ikon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
      { baslik: 'Kriz Anında Üye Koordinasyonu', aciklama: 'Bölgesel afet veya ekonomik kriz durumunda etkilenen üye firmalar hızla tespit edilerek destek koordinasyonu sağlanır.', ikon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
    ],
    metrikler: [
      { deger: '689+', etiket: 'Üye',         aciklama: 'Pilot oda kapsamı' },
      { deger: 'TOBB', etiket: 'Standart',    aciklama: 'Bağlı oda ağı' },
      { deger: 'ISO',  etiket: '22313',       aciklama: 'BCM rehber standardı' },
      { deger: 'Oda',  etiket: 'Merkezi İzlem',aciklama: 'Tüm üyeler tek ekranda' },
    ],
    senaryolar: ['Deprem', 'Siber Saldırı', 'Elektrik Kesintisi', 'Tedarik Zinciri Krizi', 'Yangın', 'Pandemi', 'Ekonomik Kriz', 'Kritik Personel Kaybı'],
    hfe: {
      h: { skor: 65, ozet: 'KOBİ yoğunluğu ve sektör çeşitliliği tehlike profilini karmaşıklaştırıyor' },
      f: { skor: 68, ozet: 'Küçük ölçekli üyelerin kapasite ve kaynak kırılganlığı' },
      e: { skor: 48, ozet: 'BCM farkındalığı ve planlama kapasitesi yetersiz' },
    },
    vaka: {
      kurum:  'Bölge Sanayi Odası',
      unvan:  'Genel Sekreter',
      metin:  'Üyelerimizin BCM hazırlık seviyelerini karşılaştırmalı raporlayabilmek, odamızın danışmanlık kapasitesini ve üye memnuniyetini artırdı.',
      sonuc:  'Üye BCM farkındalığı %45 arttı',
    },
  },

  hospitality: {
    slug:     'hospitality',
    baslik:   'Konaklama & Turizm',
    altyazi:  'TÜRSAB · Yangın Yönetmeliği · Kültür ve Turizm Bakanlığı',
    aciklama: 'Otel zincirlerinde misafir güvenliği, operasyonel süreklilik ve destinasyon kriz yönetimi. Sezon yoğunluğu, uluslararası misafir profili ve turizm krizlerine özel BCM metodolojisi.',
    mevzuat:  ['TÜRSAB', 'Yangın Yönetmeliği', 'Kültür Turizm Bakanlığı', 'Sağlık Bakanlığı', 'ISO 22301'],
    ozellikler: [
      { baslik: 'Misafir Güvenliği & Tahliye', aciklama: 'Uluslararası misafir tahliyesi, çok dilli acil iletişim protokolleri ve engelli misafir güvenliği prosedürleri.', ikon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
      { baslik: 'Destinasyon Kriz Yönetimi', aciklama: 'Terör, doğal afet veya pandemi sonrası destinasyon itibarı yönetimi ve doluluk kurtarma planları.', ikon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
      { baslik: 'Çok Tesisli Otel Zinciri Yönetimi', aciklama: 'Zincire bağlı tüm otellerin dayanıklılık skorları merkezi ekrandan izlenir, karşılaştırmalı analiz yapılır.', ikon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
      { baslik: 'Yangın & Acil Durum Sistemleri', aciklama: 'Yangın yönetmeliği uyum takibi, sprinkler ve alarm sistemlerinin periyodik test kayıtları.', ikon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
      { baslik: 'Tedarik Zinciri & F&B Sürekliliği', aciklama: 'Yiyecek-içecek tedarik kesintileri, enerji ve su kesintisi senaryolarında operasyonel süreklilik.', ikon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
      { baslik: 'İtibar & Sosyal Medya Kriz Planı', aciklama: 'Online itibar krizleri, olumsuz yorumlar ve medya baskısına karşı proaktif kriz iletişim yönetimi.', ikon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    ],
    metrikler: [
      { deger: '48',    etiket: 'Otel',        aciklama: 'Pilot zincir kapsamı' },
      { deger: 'TÜRSAB',etiket: 'Uyum',        aciklama: 'Türkiye turizm mevzuatı' },
      { deger: '12/ay', etiket: 'Tatbikat',    aciklama: 'Aylık tahliye egzersizi' },
      { deger: '4.9',   etiket: 'Güvenlik',    aciklama: 'Misafir güvenlik puanı' },
    ],
    senaryolar: ['Yangın', 'Deprem', 'Pandemi / Salgın', 'Turizm Krizi', 'Elektrik Kesintisi', 'Su Kesintisi', 'Terör / Güvenlik', 'Fırtına'],
    hfe: {
      h: { skor: 60, ozet: 'Destinasyon bazlı doğal afet ve güvenlik riski değişken' },
      f: { skor: 55, ozet: 'Sezonsal yoğunluk ve uluslararası misafir kırılganlığı' },
      e: { skor: 70, ozet: 'Uluslararası zincir standartları kapasite altyapısını güçlendiriyor' },
    },
    vaka: {
      kurum:  'Uluslararası Otel Zinciri',
      unvan:  'Güvenlik ve Operasyonlar Direktörü',
      metin:  'OMNI ile tüm otellerimizin hazırlık durumunu tek ekrandan görüyoruz. Destinasyon krizlerinde karar almak artık çok daha hızlı.',
      sonuc:  'Kriz müdahale süresi %35 kısaldı',
    },
  },

  services: {
    slug:     'services',
    baslik:   'Hizmet Sektörü',
    altyazi:  '6331 İSG · ISO 22301 · KVKK · TSE',
    aciklama: 'Lojistik, perakende, AVM ve hizmet şirketlerinde operasyonel süreklilik yönetimi. Dağıtık hizmet ağlarında merkezi dayanıklılık izleme ve müşteri hizmetleri sürekliliği.',
    mevzuat:  ['6331 İSG Kanunu', 'ISO 22301', 'KVKK', 'TSE Standartları', 'Tüketici Kanunu'],
    ozellikler: [
      { baslik: 'Dağıtık Hizmet Ağı Yönetimi', aciklama: 'Lojistik merkezler, mağazalar ve ofislerden oluşan dağıtık ağın merkezi dayanıklılık izlemesi.', ikon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
      { baslik: 'Müşteri Hizmetleri Sürekliliği', aciklama: 'Müşteri taleplerinin kesintisiz karşılanması için çağrı merkezi, dijital kanal ve saha ekibi sürekliliği.', ikon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
      { baslik: 'Lojistik & Tedarik Zinciri', aciklama: 'Depo, taşıma ve son mil teslimat süreçlerinde kesinti senaryoları ve alternatif rota planlaması.', ikon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
      { baslik: 'KVKK Veri Koruma Sürekliliği', aciklama: 'Kişisel veri işleme süreçlerinin kesinti anında korunması, veri ihlali müdahale prosedürleri.', ikon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
      { baslik: 'AVM & Perakende Güvenliği', aciklama: 'Alışveriş merkezi ve mağaza tahliye planları, yangın güvenliği ve kalabalık yönetimi protokolleri.', ikon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
      { baslik: 'İtibar & Marka Kriz Yönetimi', aciklama: 'Ürün geri çağırma, hizmet kesintisi veya medya krizi durumunda iletişim planı ve kriz yönetim protokolleri.', ikon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    ],
    metrikler: [
      { deger: 'B2B',  etiket: '& B2C',       aciklama: 'Her ölçekte hizmet' },
      { deger: 'ISO',  etiket: '22301',       aciklama: 'BCM standartı' },
      { deger: 'KVKK', etiket: 'Uyum',       aciklama: 'Veri koruma mevzuatı' },
      { deger: '7/24', etiket: 'Süreklilik',  aciklama: 'Hizmet hedefi' },
    ],
    senaryolar: ['Siber Saldırı', 'IT Sistemi Çöküşü', 'Elektrik Kesintisi', 'Deprem', 'Tedarik Zinciri Krizi', 'Kritik Personel Kaybı', 'Yangın', 'Pandemi'],
    hfe: {
      h: { skor: 58, ozet: 'Dijital bağımlılık ve rekabet baskısı riski artırıyor' },
      f: { skor: 60, ozet: 'Tek tedarikçi bağımlılığı ve IT yoğunluğu kırılganlık' },
      e: { skor: 62, ozet: 'Operasyonel esneklik var, BCP formalizasyonu eksik' },
    },
    vaka: {
      kurum:  'Büyük Ölçekli Lojistik Şirketi',
      unvan:  'Operasyon ve Risk Direktörü',
      metin:  'Depo ağımızdaki her noktanın hazırlık durumunu OMNI ile izliyoruz. Tedarik zinciri kesintilerinde alternatif rota kararları artık dakikalar içinde alınıyor.',
      sonuc:  'Operasyonel kesinti süresi %45 azaldı',
    },
  },
}

// ── Paylaşılan Sayfa Şablonu ──────────────────────────────────
export default function SektorSayfasi({ slug }: { slug: string }) {
  const [aktifSenaryo, setAktifSenaryo] = useState(0)
  const veri = SEKTOR_VERILERI[slug]
  if (!veri) return null

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
      `}</style>

      {/* NAV */}
      <nav className="bg-white border-b border-stone-200 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <a href="/ana-sayfa" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
                <span className="text-white font-bold text-xs font-display">R</span>
              </div>
              <span className="font-display font-bold text-stone-900">OMNI</span>
            </a>
            <div className="hidden sm:flex items-center gap-1 text-xs text-stone-400">
              <a href="/ana-sayfa" className="hover:text-stone-700 transition">Ana Sayfa</a>
              <span>/</span>
              <a href="/ana-sayfa#sektorler" className="hover:text-stone-700 transition">Çözümler</a>
              <span>/</span>
              <span className="text-stone-700 font-medium">{veri.baslik}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-stone-500 hover:text-stone-900 transition font-medium">Giriş</a>
            <a href="#demo" className="bg-stone-900 text-white text-sm px-5 py-2 rounded-xl hover:bg-stone-700 transition font-medium">
              Demo Talep Et
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-white border-b border-stone-100 pt-16 pb-14 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="font-mono-dm text-xs text-teal-700 uppercase tracking-widest mb-4">
              OMNI Çözümleri
            </p>
            <h1 className="font-display text-5xl font-bold text-stone-900 leading-tight mb-5">
              {veri.baslik}
            </h1>
            <p className="font-mono-dm text-xs text-stone-400 mb-4">{veri.altyazi}</p>
            <p className="text-stone-500 text-lg leading-relaxed mb-8">{veri.aciklama}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {veri.mevzuat.map(m => (
                <span key={m} className="font-mono-dm text-xs text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg">
                  {m}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <a href="#demo" className="bg-stone-900 text-white px-7 py-3 rounded-xl font-semibold hover:bg-stone-700 transition text-sm">
                Demo Talep Et
              </a>
              <a href="/login" className="border border-stone-200 text-stone-700 px-7 py-3 rounded-xl font-semibold hover:bg-stone-50 transition text-sm">
                Platforma Giriş
              </a>
            </div>
          </div>

          {/* Metrik Kartlar */}
          <div className="grid grid-cols-2 gap-4">
            {veri.metrikler.map((m, i) => (
              <div key={i} className={`rounded-2xl p-6 text-center border ${
                i === 1 ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className={`font-display text-4xl font-bold mb-1 ${i===1?'text-white':'text-stone-900'}`}>
                  {m.deger}
                </div>
                <div className={`text-sm font-semibold ${i===1?'text-stone-300':'text-stone-700'}`}>{m.etiket}</div>
                <div className={`text-xs mt-0.5 ${i===1?'text-stone-500':'text-stone-400'}`}>{m.aciklama}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="py-18 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto py-16">
          <div className="mb-12">
            <p className="text-teal-700 text-sm font-semibold uppercase tracking-widest mb-3">Platform Özellikleri</p>
            <h2 className="font-display text-4xl font-bold text-stone-900">
              {veri.baslik} için<br />Tasarlanmış Araçlar
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {veri.ozellikler.map((o, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={o.ikon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{o.baslik}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{o.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HFE-360 */}
      <section className="py-16 px-6 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-teal-700 text-sm font-semibold uppercase tracking-widest mb-3">HFE-360 Metodolojisi</p>
            <h2 className="font-display text-4xl font-bold text-stone-900 mb-5">
              {veri.baslik} Sektörü<br />Risk Profili
            </h2>
            <p className="text-stone-500 leading-relaxed mb-6">
              İTÜ AYM iş birliğiyle geliştirilen HFE-360 metodolojisi, sektörünüze özgü tehlike,
              kırılganlık ve kapasite faktörlerini akademik titizlikle ölçer.
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
              <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">İTÜ</span>
              </div>
              <span className="text-blue-800 text-xs font-semibold">İTÜ AYM iş birliği</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { harf: 'H', label: 'Tehlike',     skor: veri.hfe.h.skor, ozet: veri.hfe.h.ozet, renk: '#F97316', bg: 'bg-orange-50 border-orange-100' },
              { harf: 'F', label: 'Kırılganlık', skor: veri.hfe.f.skor, ozet: veri.hfe.f.ozet, renk: '#EF4444', bg: 'bg-red-50 border-red-100' },
              { harf: 'E', label: 'Kapasite',    skor: veri.hfe.e.skor, ozet: veri.hfe.e.ozet, renk: '#3B82F6', bg: 'bg-blue-50 border-blue-100' },
            ].map(b => (
              <div key={b.harf} className={`flex items-center gap-5 p-5 rounded-2xl border ${b.bg}`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-xl font-bold text-white flex-shrink-0"
                  style={{ background: b.renk }}>
                  {b.harf}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-stone-800 text-sm">{b.label}</span>
                    <span className="font-mono-dm font-bold text-sm" style={{ color: b.renk }}>{b.skor}</span>
                  </div>
                  <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full rounded-full" style={{ width: `${b.skor}%`, background: b.renk }} />
                  </div>
                  <p className="text-xs text-stone-500">{b.ozet}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SENARYOLAR */}
      <section className="py-16 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-teal-700 text-sm font-semibold uppercase tracking-widest mb-3">Senaryo Kataloğu</p>
            <h2 className="font-display text-4xl font-bold text-stone-900">
              {veri.baslik} Senaryoları
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {veri.senaryolar.map((s, i) => (
              <div
                key={i}
                onClick={() => setAktifSenaryo(i)}
                className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
                  aktifSenaryo === i
                    ? 'bg-stone-900 border-stone-900 text-white'
                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                <div className="font-medium text-sm">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERANS */}
      <section className="py-16 px-6 bg-white border-y border-stone-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-teal-700 text-sm font-semibold uppercase tracking-widest mb-8">Müşteri Deneyimi</p>
          <blockquote className="font-display text-2xl font-bold text-stone-900 leading-relaxed mb-8 italic">
            "{veri.vaka.metin}"
          </blockquote>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center font-display font-bold text-stone-600">
              {veri.vaka.kurum[0]}
            </div>
            <div className="text-left">
              <div className="font-semibold text-stone-800 text-sm">{veri.vaka.unvan}</div>
              <div className="text-stone-400 text-xs">{veri.vaka.kurum}</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 px-5 py-2.5 rounded-full">
            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-teal-700 text-sm font-semibold">{veri.vaka.sonuc}</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="py-20 px-6 bg-stone-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            {veri.baslik} Çözümünü<br />Canlı Görün
          </h2>
          <p className="text-stone-400 mb-8">
            30 dakikalık demo görüşmesinde sektörünüze özel senaryoları inceleyin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input type="email" placeholder="kurumsal@email.com"
              className="bg-stone-800 border border-stone-700 text-white placeholder-stone-600 px-5 py-3 rounded-xl text-sm focus:outline-none focus:border-teal-500 sm:w-72" />
            <button className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded-xl font-semibold text-sm transition">
              Demo Talep Et
            </button>
          </div>
          <p className="text-stone-600 text-xs mt-4">İTÜ AYM iş birliğiyle geliştirilmiştir</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-950 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-stone-700 text-xs">© 2025-2026 OMNI · Tüm hakları saklıdır.</span>
          <a href="/ana-sayfa#sektorler" className="text-stone-600 hover:text-stone-300 text-xs transition">
            ← Tüm Çözümler
          </a>
        </div>
      </footer>
    </div>
  )
}
