// ═══════════════════════════════════════════════════════════════
//  OMNI Platform — Sanayi Tesisleri HFE-360 Soru Seti
//  İSO Afet Yönetimi Şubesi AADY Kontrol Listesi (2025) +
//  İTÜ AYM HFE-360 Metodolojisi Sentezi
//  H (Tehlike/Hazard) · F (Kırılganlık/Fragility) · E (Kapasite/Enabler)
//  Toplam: 54 soru — H:10, F:18, E:26
// ═══════════════════════════════════════════════════════════════

import type { Soru } from './sorular'
export type { Soru }

export const SORULAR_SANAYI: Soru[] = [

  // ══════════════════════════════════════════════════════════════
  // H — TEHLİKE (10 soru)
  // Kaynak: HFE-360 H1-H8 + AADY ISG Tehlike Sınıfı / NACE / Süreç Riskleri
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'H1', bolum: 'TEHLİKE', agirlik: 3, kritik: false, ters: true,
    soru: 'Tesisin bulunduğu bölgede afet/acil durum tarihsel tekerrür sıklığı nedir?',
    rehber: [
      'Nadir — 20 yılda bir veya daha az',
      'Seyrek — 10-20 yılda bir',
      'Mümkün — 5-10 yılda bir',
      'Sık — 5 yıldan kısa aralıklarla',
    ],
  },
  {
    kod: 'H2', bolum: 'TEHLİKE', agirlik: 5, kritik: true, ters: true,
    soru: 'Olası bir afetin tesise vereceği fiziksel hasar ve üretim duruşu etkisi ne olur?',
    rehber: [
      'Hissedilmez, üretim devam eder',
      'Hafif hasar, kısa süreli duruş',
      'Yapısal hasar, haftalarca duruş',
      'Yıkıcı, uzun süreli/kalıcı duruş',
    ],
  },
  {
    kod: 'H3', bolum: 'TEHLİKE', agirlik: 2, kritik: false, ters: true,
    soru: 'Tehlike başlamadan önce uyarı için ne kadar süreniz olur?',
    rehber: [
      'Günler öncesinden uyarı alınabilir',
      'Saatler öncesinden uyarı alınabilir',
      'Yalnızca dakikalar önce fark edilir',
      'Ani gelişir, hiç uyarı olmaz',
    ],
  },
  {
    kod: 'H4', bolum: 'TEHLİKE', agirlik: 2, kritik: false, ters: true,
    soru: 'Olayın tesisin faaliyetleri üzerindeki etkisi ne kadar süre devam eder?',
    rehber: [
      '1 saatten kısa',
      '1-24 saat',
      '1-7 gün',
      '1 haftadan uzun',
    ],
  },
  {
    kod: 'H5', bolum: 'TEHLİKE', agirlik: 4, kritik: true, ters: true,
    soru: 'Tesiste kullanılan/üretilen/depolanan parlayıcı, patlayıcı, yanıcı veya zehirli madde riski nedir? (AADY Süreç Riskleri)',
    rehber: [
      'Riskli madde yok',
      'Küçük miktarda, güvenli depolama var',
      'Önemli miktarda, önlemler kısmen yeterli',
      'Yüksek risk, Seveso/COMAH kapsamında',
    ],
  },
  {
    kod: 'H6', bolum: 'TEHLİKE', agirlik: 3, kritik: false, ters: true,
    soru: 'Tesisin ISG tehlike sınıfı ve NACE koduna göre sektörel risk profili nedir?',
    rehber: [
      'Az tehlikeli sınıf',
      'Tehlikeli sınıf',
      'Çok tehlikeli sınıf',
      'Çok tehlikeli + stratejik ürün/ihracat',
    ],
  },
  {
    kod: 'H7', bolum: 'TEHLİKE', agirlik: 3, kritik: false, ters: true,
    soru: 'Komşu tesislerden veya çevreden kaynaklanabilecek dışsal risk bilinip yönetiliyor mu? (AADY Md.69-70)',
    rehber: [
      'Çevresel risk yok',
      'Risk biliniyor, önlem var',
      'Risk kısmen biliniyor',
      'Risk bilinmiyor veya önlem yok',
    ],
  },
  {
    kod: 'H8', bolum: 'TEHLİKE', agirlik: 3, kritik: false, ters: true,
    soru: 'Üretim kesintisinin tedarik zinciri ve müşterilere zincirleme etkisi ne düzeyde?',
    rehber: [
      'İzole, yayılım yok',
      'Sınırlı yayılım',
      'Bölgesel tedarik zinciri etkisi',
      'Ulusal/global stratejik üretim etkisi',
    ],
  },
  {
    kod: 'H9', bolum: 'TEHLİKE', agirlik: 4, kritik: true, ters: true,
    soru: 'Tesisteki basınçlı tank, kazan dairesi, kimyasal depolama gibi ek tehlike üniteleri mevcut mu? (AADY Md.58-63)',
    rehber: [
      'Hiç yok',
      'Var, periyodik kontrolü yapılıyor',
      'Var, kontroller eksik',
      'Var, hiç kontrol yapılmıyor',
    ],
  },
  {
    kod: 'H10', bolum: 'TEHLİKE', agirlik: 2, kritik: false, ters: true,
    soru: 'Olayın çalışanlar ve çevre üzerinde panik/toplu tahliye riski ne düzeyde?',
    rehber: [
      'Panik riski yok',
      'Düşük düzeyde olasılık',
      'Orta düzeyde risk',
      'Yüksek panik / kitlesel tahliye riski',
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // F — KIRILGANLIK (18 soru)
  // Kaynak: HFE-360 F1-F14 + AADY Yapısal Durum / Zemin / Altyapı
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'F1', bolum: 'KIRILGANLIK', agirlik: 10, kritik: true, ters: true,
    soru: 'Olası bir olayda çalışanların fiziksel olarak zarar görme riski nedir?',
    rehber: [
      'Fiziksel risk yok',
      'Hafif yaralanma olasılığı',
      'Ağır yaralanma riski',
      'Can kaybı riski mevcut',
    ],
  },
  {
    kod: 'F2', bolum: 'KIRILGANLIK', agirlik: 5, kritik: true, ters: true,
    soru: 'Binanın inşa yılı, yapı tipi (betonarme/çelik/prefabrik) ve yapısal durum değerlendirmesi nasıl? (AADY Md.11-25)',
    rehber: [
      'Yeni bina, deprem yönetmeliğine uygun',
      'İyi durumda, periyodik kontrolü yapılmış',
      'Eski bina, güçlendirme gerekebilir',
      'Çok eski veya hasarlı, yüksek yıkılma riski',
    ],
  },
  {
    kod: 'F3', bolum: 'KIRILGANLIK', agirlik: 4, kritik: true, ters: true,
    soru: 'Zemin sınıflaması, zemin etüt raporu ve yeraltı suyu seviyesi nasıl? (AADY Md.23-24)',
    rehber: [
      'Sağlam zemin, etüt raporu var ve iyi',
      'Orta zemin, etüt raporu mevcut',
      'Zayıf zemin veya etüt eksik',
      'Zemin etüdü yok, sıvılaşma/göçük riski',
    ],
  },
  {
    kod: 'F4', bolum: 'KIRILGANLIK', agirlik: 5, kritik: true, ters: true,
    soru: 'Tesisin konumu (fay hattı, taşkın ovası, sanayi bölgesi) açısından coğrafi risk var mı?',
    rehber: [
      'Güvenli konum, risk yok',
      'Düşük riskli konum',
      'Orta riskli konum',
      'Çok riskli konum (fay hattı yakını, taşkın alanı)',
    ],
  },
  {
    kod: 'F5', bolum: 'KIRILGANLIK', agirlik: 4, kritik: false, ters: true,
    soru: 'Makine-teçhizat ve kritik üretim ekipmanının afet anında hasar görme riski? (AADY Md.65)',
    rehber: [
      'Sabitlenmiş, hasar riski düşük',
      'Kısmen sabitlenmiş',
      'Çoğu sabitlenmemiş',
      'Hiç sabitlenmemiş, devrilme/hasar riski yüksek',
    ],
  },
  {
    kod: 'F6', bolum: 'KIRILGANLIK', agirlik: 5, kritik: true, ters: true,
    soru: 'Bina altyapı sistemleri (elektrik, gaz, su, telekom) durumu ve iyileştirme ihtiyacı? (AADY Md.26-29)',
    rehber: [
      'Tüm sistemler iyi durumda',
      'Küçük iyileştirme gerekiyor',
      'Önemli iyileştirme ihtiyacı var',
      'Ciddi altyapı sorunları mevcut',
    ],
  },
  {
    kod: 'F7', bolum: 'KIRILGANLIK', agirlik: 4, kritik: false, ters: true,
    soru: 'Operasyonun tek bir makine, sistem veya kilit kişiye bağımlılık düzeyi nedir?',
    rehber: [
      'Dağıtık yapı, tam yedekli',
      'Kısmi bağımlılık var',
      'Yüksek bağımlılık',
      'Tek noktaya tam bağımlı, yedek yok',
    ],
  },
  {
    kod: 'F8', bolum: 'KIRILGANLIK', agirlik: 3, kritik: false, ters: true,
    soru: 'Riskli hammadde/girdi/ürün/atığın depolanma güvenliği ve acil durumda kontrolü? (AADY Md.81-87)',
    rehber: [
      'Güvenli depolama, acil prosedür var',
      'Kısmen güvenli',
      'Yetersiz depolama koşulları',
      'Güvensiz, acil prosedür yok',
    ],
  },
  {
    kod: 'F9', bolum: 'KIRILGANLIK', agirlik: 3, kritik: false, ters: true,
    soru: 'Olay sonrası yasal uyum (6331 İSG, Seveso III, ISO 22301) eksikliğinden kaynaklı risk?',
    rehber: [
      'Tam uyumlu, risk yok',
      'Küçük eksikler var',
      'Orta düzeyde uyumsuzluk',
      'Büyük uyumsuzluk, yaptırım riski',
    ],
  },
  {
    kod: 'F10', bolum: 'KIRILGANLIK', agirlik: 5, kritik: true, ters: true,
    soru: 'IT sistemleri ve endüstriyel kontrol sistemleri (SCADA/PLC) siber güvenlik durumu? (AADY Md.49-52)',
    rehber: [
      'Modern, güncel ve güvenli',
      'Minör açıklar mevcut',
      'Eski sistemler, önemli zafiyet',
      'Çok eski, kritik açıklar mevcut',
    ],
  },
  {
    kod: 'F11', bolum: 'KIRILGANLIK', agirlik: 4, kritik: true, ters: true,
    soru: 'Üretim ve operasyon verilerinin yedekleme ve kurtarma durumu? (AADY Md.49)',
    rehber: [
      'Tam yedekli, recovery planı test edilmiş',
      'Yedekleme var, test edilmemiş',
      'Kısmi yedekleme',
      'Yedekleme yok',
    ],
  },
  {
    kod: 'F12', bolum: 'KIRILGANLIK', agirlik: 3, kritik: false, ters: true,
    soru: 'Üretim kesintisinde nakit akışı ve acil operasyonel ihtiyaçları karşılama kapasitesi?',
    rehber: [
      'Güçlü rezerv, 3+ ay idare eder',
      '1-3 ay idare eder',
      'Birkaç hafta idare eder',
      'Nakit rezervi yok',
    ],
  },
  {
    kod: 'F13', bolum: 'KIRILGANLIK', agirlik: 3, kritik: false, ters: true,
    soru: 'Tesisin itibar ve marka değerine, müşteri/iş ortağı güvenine olası etkisi?',
    rehber: [
      'Güven sağlam, etki yok',
      'Geçici güven kaybı',
      'Ciddi itibar hasarı',
      'Kalıcı müşteri/ortak kaybı',
    ],
  },
  {
    kod: 'F14', bolum: 'KIRILGANLIK', agirlik: 4, kritik: false, ters: true,
    soru: 'Bölgeye fiziksel erişim (yol kapanması, OSB altyapısı) ne kadar zorlaşabilir?',
    rehber: [
      'Erişim sorunu beklenmez',
      'Alternatif güzergah mevcut',
      'Erişim ciddi şekilde zorlaşabilir',
      'Tamamen erişilemez hale gelebilir',
    ],
  },
  {
    kod: 'F15', bolum: 'KIRILGANLIK', agirlik: 3, kritik: false, ters: true,
    soru: 'Dijital/endüstriyel sistemler çöktüğünde üretim manuel olarak sürdürülebilir mi?',
    rehber: [
      'Kolayca manuel devam edilebilir',
      'Mümkün ama verimlilik düşer',
      'Çok zor, büyük kayıp',
      'Manuel üretim imkansız',
    ],
  },
  {
    kod: 'F16', bolum: 'KIRILGANLIK', agirlik: 3, kritik: false, ters: true,
    soru: 'Kilit teknik personelin (vardiya ustabaşı, makine operatörü) görev yapamaması durumunda?',
    rehber: [
      'Tam yedekli, sorun yaşanmaz',
      'Kısa süreli aksama olur',
      'Ciddi ve uzun süreli aksama',
      'Üretim tamamen durur',
    ],
  },
  {
    kod: 'F17', bolum: 'KIRILGANLIK', agirlik: 4, kritik: false, ters: true,
    soru: 'Tesis sigortası kapsamı (yangın, deprem, iş durması, 3. şahıs) yeterli mi? (AADY Md.91)',
    rehber: [
      'Kapsamlı sigorta, iş durması dahil',
      'Temel sigorta var',
      'Yetersiz kapsamlı sigorta',
      'Sigorta yok',
    ],
  },
  {
    kod: 'F18', bolum: 'KIRILGANLIK', agirlik: 2, kritik: false, ters: true,
    soru: 'Sözleşme yükümlülüklerinin yerine getirilememesinden doğan tazminat ve ihracat riski?',
    rehber: [
      'Mücbir sebep koruması mevcut',
      'Düşük tazminat riski',
      'Orta düzey risk',
      'Yüksek tazminat ve ihracat cezası riski',
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // E — KAPASİTE (26 soru)
  // Kaynak: HFE-360 E1-E23 + AADY Sistemler / Plan / Personel
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'E1', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Üst yönetim afet/acil durum yönetimine liderlik ediyor ve kaynak sağlıyor mu?',
    rehber: [
      'İlgisiz, destek yok',
      'Kağıt üzerinde destek var',
      'Kısmen ilgili ve destekleyici',
      'Tam liderlik, bütçe ve kaynak sağlıyor',
    ],
  },
  {
    kod: 'E2', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Afet ve Acil Durum Yönetim Planı (AADYP) güncel, düzenli güncelleniyor ve uygulanabilir mi? (AADY Md.67-68)',
    rehber: [
      'Plan yok',
      'Var ama hiç güncellenmemiş',
      'Var, kısmen güncel',
      'Güncel, test edilmiş, tüm personel biliyor',
    ],
  },
  {
    kod: 'E3', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'Deprem yapısal önlemleri: geoteknik rapor, deprem dayanıklılık raporu, sismik izolatör durumu? (AADY Md.30-32)',
    rehber: [
      'Hiçbiri yok',
      'Yalnızca geoteknik rapor var',
      'Raporlar var, iyi durumda',
      'Tümü var, sismik izolatör dahil, güncel',
    ],
  },
  {
    kod: 'E4', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Yangın algılama, ihbar, sprinkler ve söndürme sistemleri mevcut ve periyodik kontrollü mu? (AADY Md.33-39)',
    rehber: [
      'Hiç yok',
      'Yalnızca söndürücü var',
      'Algılama + kısmi söndürme sistemi var',
      'Tam otomatik sistem, periyodik bakım yapılıyor',
    ],
  },
  {
    kod: 'E5', bolum: 'KAPASİTE', agirlik: 4, kritik: true, ters: false,
    soru: 'Sel/su baskını algılama, su geçirmez kapı ve tahliye pompası sistemleri var mı? (AADY Md.40-42)',
    rehber: [
      'Hiç yok',
      'Yalnızca pompa var',
      'Pompa + su geçirmez kapı var',
      'Tam sistem, algılama dahil, periyodik kontrollü',
    ],
  },
  {
    kod: 'E6', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Enerji güvenliği: trafo, topraklama, kaçak akım koruması, jeneratör ve alternatif güç kaynağı? (AADY Md.43-48)',
    rehber: [
      'Hiçbiri yok',
      'Yalnızca jeneratör var',
      'Jeneratör + topraklama ve kaçak akım koruma var',
      'Tüm sistem mevcut, çift beslemeli hat dahil, bakımlı',
    ],
  },
  {
    kod: 'E7', bolum: 'KAPASİTE', agirlik: 4, kritik: true, ters: false,
    soru: 'Makine koruma sistemleri: emniyetli durdurma ve aşırı ısınmaya karşı soğutma sistemi? (AADY Md.53-54)',
    rehber: [
      'Hiç yok',
      'Yalnızca manual durdurma',
      'Otomatik durdurma var',
      'Tam koruma, soğutma sistemi dahil, periyodik bakım',
    ],
  },
  {
    kod: 'E8', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'IT güvenlik: veri yedekleme, ağ güvenliği, şifreleme ve loglama sistemleri? (AADY Md.49-52)',
    rehber: [
      'Hiçbiri yok',
      'Yalnızca temel firewall',
      'Yedekleme + ağ güvenliği var',
      'Tüm önlemler, periyodik kontrol ve sızma testi',
    ],
  },
  {
    kod: 'E9', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'Acil durum yönlendirme, aydınlatma ve push-bar acil çıkış kapıları mevcut ve çalışır durumda mu? (AADY Md.55-57)',
    rehber: [
      'Hiç yok',
      'Yalnızca yönlendirme tabelası var',
      'Yönlendirme + acil aydınlatma var',
      'Tümü mevcut, periyodik test ediliyor',
    ],
  },
  {
    kod: 'E10', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Afet operasyon personeli: ilkyardım, hafif arama-kurtarma, yangın müdahale ekipleri mevcut mu? (AADY Md.138-145)',
    rehber: [
      'Hiç yok',
      'Yalnızca temel ilkyardım var',
      'İlkyardım + yangın müdahale ekibi var',
      'Tam ekip: ilkyardım, USAR, yangın, telsiz sertifikalı',
    ],
  },
  {
    kod: 'E11', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Planlama personeli: ISO 22301 uzmanı, afet yöneticisi veya risk analizi uzmanı var mı? (AADY Md.146-149)',
    rehber: [
      'Hiç yok',
      'Görevlendirilen bir yönetici var',
      'Eğitimli uzman var',
      'ISO 22301 sertifikalı uzman ve denetçi mevcut',
    ],
  },
  {
    kod: 'E12', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Yönetici ve personele yönelik düzenli afet yönetimi eğitimi yapılıyor mu? (AADY Md.71)',
    rehber: [
      'Hiç yapılmıyor',
      'İşe girişte bir kez yapılıyor',
      'Yılda bir yapılıyor',
      'Yılda birden fazla, kapsamlı ve sertifikalı',
    ],
  },
  {
    kod: 'E13', bolum: 'KAPASİTE', agirlik: 4, kritik: true, ters: false,
    soru: 'Düzenli tatbikat yapılıyor mu? Masa başı ve saha tatbikatları gerçekleştiriliyor mu? (AADY Md.72)',
    rehber: [
      'Hiç yapılmıyor',
      'Yılda bir masa başı',
      'Yılda bir saha tatbikatı',
      'Yılda birden fazla, farklı senaryo, kayıt altında',
    ],
  },
  {
    kod: 'E14', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Aktif Acil Durum Ekipleri oluşturulmuş, görev tanımları ve iletişim hiyerarşisi netleştirilmiş mi? (AADY Md.73)',
    rehber: [
      'Ekip yok',
      'Ekip var ama görev tanımı belirsiz',
      'Ekip ve görev tanımı var, tatbikat yapılmamış',
      'Aktif ekip, tatbikat yapılmış, 7/24 ulaşılabilir',
    ],
  },
  {
    kod: 'E15', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'ISO 9001, 14001, 22301, 45001 gibi ilgili kalite/güvenlik sertifikasyonları var mı? (AADY Md.74)',
    rehber: [
      'Hiç sertifikasyon yok',
      'Yalnızca ISO 9001 var',
      'Birden fazla sertifikasyon var',
      'ISO 22301 dahil kapsamlı sertifikasyon',
    ],
  },
  {
    kod: 'E16', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'İş Sürekliliği Planları (BCP): üretim duruşu, tedarik zinciri ve kilit personel senaryoları için hazırlanmış mı? (AADY Md.75-77)',
    rehber: [
      'Hiç yok',
      'Genel BCP var, senaryo özelleşmemiş',
      'Bazı senaryolar için var',
      'Tüm kritik senaryolar için özelleşmiş ve test edilmiş',
    ],
  },
  {
    kod: 'E17', bolum: 'KAPASİTE', agirlik: 4, kritik: true, ters: false,
    soru: 'Alternatif üretim yeri belirlenmiş, planlanmış ve test edilmiş mi? (AADY Md.77)',
    rehber: [
      'Hiç yok, plan da yok',
      'Fikir aşamasında',
      'Yer belirlendi, hazırlanmadı',
      'Alternatif tesis hazır ve test edilmiş',
    ],
  },
  {
    kod: 'E18', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'Kritik tedarikçi devre dışı kalırsa onaylı ve sözleşmeli alternatif tedarikçi hazır mı?',
    rehber: [
      'Hiç yok',
      'Araştırılıyor',
      'Alternatif belirlendi',
      'Onaylı, sözleşmeli ve stok desteği var',
    ],
  },
  {
    kod: 'E19', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'IT Felaket Kurtarma Planı (DRP) ve endüstriyel kontrol sistemi kurtarma prosedürü mevcut ve test edilmiş mi?',
    rehber: [
      'Hiç yok',
      'Plan var, hiç test edilmedi',
      'Masa başı tatbikatı yapıldı',
      'Gerçek ortamda test edildi, RTO/RPO tanımlı',
    ],
  },
  {
    kod: 'E20', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Kriz iletişim stratejisi, medya sözcüsü ve paydaş bilgilendirme planı hazır mı?',
    rehber: [
      'Hiç yok',
      'Sözcü belirsiz',
      'Strateji var, sözcü yok',
      'Strateji, sözcü ve şablon mesajlar hazır',
    ],
  },
  {
    kod: 'E21', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Erken uyarı sistemleri (deprem, yangın, sel, kimyasal sızıntı) merkeze entegre çalışıyor mu?',
    rehber: [
      'Hiç yok',
      'Yalnızca lokal alarm',
      'Merkeze bildirim yapılıyor',
      'Tam entegre, otomatik devreye giriyor',
    ],
  },
  {
    kod: 'E22', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'Afet için finansal koruma: kapsamlı tesis sigortası, iş durması sigortası ve acil fon rezervi var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca temel sigorta',
      'Kapsamlı sigorta var',
      'Sigorta + nakit fon rezervi, iş durması dahil',
    ],
  },
  {
    kod: 'E23', bolum: 'KAPASİTE', agirlik: 2, kritik: false, ters: false,
    soru: 'Tesisin topluma sağlayabileceği afet sonrası destek kapasitesi (lokasyon, ekipman, personel) belirlenmiş mi? (AADY Md.92-169)',
    rehber: [
      'Hiç belirlenmemiş',
      'Fikir aşamasında',
      'Kayıt altına alınmış',
      'Resmi koordinasyon anlaşması yapılmış (AFAD/Kızılay)',
    ],
  },
  {
    kod: 'E24', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Geçmiş olaylar, yakın-miss vakalar ve tatbikatlardan kurumsal ders çıkarma süreci işliyor mu?',
    rehber: [
      'Hayır, yapılmıyor',
      'Nadiren yapılıyor',
      'Raporlanıyor ama takibi yok',
      'Kurumsal hafıza ve düzeltici aksiyon sistemi aktif',
    ],
  },
  {
    kod: 'E25', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Afet anında dezavantajlı çalışanları (engelli, hamile, yabancı uyruklu) kapsayan özel tahliye prosedürü var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca sözlü taahhüt',
      'Yazılı prosedür var',
      'Uygulamalı tatbikat yapılmış, aktif politika var',
    ],
  },
  {
    kod: 'E26', bolum: 'KAPASİTE', agirlik: 2, kritik: false, ters: false,
    soru: 'Risk yönetiminde PDCA döngüsü ve sürekli iyileştirme kültürü tesiste yerleşmiş mi?',
    rehber: [
      'Hiç yok',
      'Kesintili uygulanıyor',
      'Çoğunlukla uygulanıyor',
      'Tam döngü, KPI izleme ile sürekli iyileştirme',
    ],
  },
]

export const SORULAR_SANAYI_H = SORULAR_SANAYI.filter(s => s.bolum === 'TEHLİKE')
export const SORULAR_SANAYI_F = SORULAR_SANAYI.filter(s => s.bolum === 'KIRILGANLIK')
export const SORULAR_SANAYI_E = SORULAR_SANAYI.filter(s => s.bolum === 'KAPASİTE')

// Özet bilgi
export const SANAYI_SORU_META = {
  toplam: 54,
  h: 10,
  f: 18,
  e: 26,
  kaynaklar: ['İSO Afet Yönetimi Şubesi AADY Kontrol Listesi 2025', 'İTÜ AYM HFE-360 Metodolojisi'],
  sektor: 'uretim',
  versiyon: '1.0',
  tarih: '2025-03-08',
}