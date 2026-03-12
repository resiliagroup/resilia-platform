// ═══════════════════════════════════════════════════════════════
//  OMNI Platform — HFE-360 Soru Seti
//  İTÜ AYM iş birliğiyle geliştirilmiş akademik metodoloji
//  H (Tehlike) · F (Kırılganlık) · E (Kapasite) — 44 soru
// ═══════════════════════════════════════════════════════════════

export type Soru = {
  kod: string
  bolum: 'TEHLİKE' | 'KIRILGANLIK' | 'KAPASİTE'
  agirlik: number
  kritik: boolean
  ters: boolean   // true = düşük puan iyidir (H ve F), false = yüksek puan iyidir (E)
  soru: string
  rehber: [string, string, string, string]  // 0, 1, 2, 3 için açıklamalar
}

export const SORULAR: Soru[] = [
  // ── TEHLİKE (H) ────────────────────────────────────────────
  {
    kod: 'H1', bolum: 'TEHLİKE', agirlik: 3, kritik: false, ters: true,
    soru: 'Bu tehlikenin gerçekleşme sıklığı ve tarihsel tekerrürü nedir?',
    rehber: [
      'Nadir — 20 yılda bir veya daha az',
      'Seyrek — 10-20 yılda bir',
      'Mümkün — 5-10 yılda bir',
      'Sık — 5 yıldan kısa aralıklarla',
    ],
  },
  {
    kod: 'H2', bolum: 'TEHLİKE', agirlik: 5, kritik: true, ters: true,
    soru: 'Tehlike gerçekleştiğinde bina ve operasyonda yaratacağı fiziksel etki ne olur?',
    rehber: [
      'Hissedilmez düzeyde etki',
      'Hafif hasar, operasyon devam eder',
      'Yapısal hasar, kısmi kesinti',
      'Yıkıcı etki, tam çöküş riski',
    ],
  },
  {
    kod: 'H3', bolum: 'TEHLİKE', agirlik: 2, kritik: false, ters: true,
    soru: 'Tehlike başlamadan önce uyarı için ne kadar süreniz olur?',
    rehber: [
      'Günler öncesinden uyarı alınabilir',
      'Saatler öncesinden uyarı alınabilir',
      'Yalnızca dakikalar önce fark edilir',
      'Ani gerçekleşir, hiç uyarı olmaz',
    ],
  },
  {
    kod: 'H4', bolum: 'TEHLİKE', agirlik: 2, kritik: false, ters: true,
    soru: 'Tehlike sona erdikten sonra etkisi ne kadar süre devam eder?',
    rehber: [
      '1 saatten kısa',
      '1-24 saat',
      '1-7 gün',
      '1 haftadan uzun',
    ],
  },
  {
    kod: 'H5', bolum: 'TEHLİKE', agirlik: 3, kritik: false, ters: true,
    soru: 'Birimin bulunduğu bölgedeki coğrafi ve iklimsel riskler nasıl?',
    rehber: [
      'Stabil, belirgin risk yok',
      'Düşük düzeyde risk',
      'Orta düzeyde risk',
      'Yüksek risk, kötüleşen eğilim',
    ],
  },
  {
    kod: 'H6', bolum: 'TEHLİKE', agirlik: 4, kritik: false, ters: true,
    soru: 'Bu olay gerçekleşirse ulusal/bölgesel ekonomik etkisi ne olur?',
    rehber: [
      'Yalnızca yerel etki',
      'Sınırlı piyasa etkisi',
      'Sektörel düzeyde etki',
      'Makro ekonomik kriz riski',
    ],
  },
  {
    kod: 'H7', bolum: 'TEHLİKE', agirlik: 3, kritik: false, ters: true,
    soru: 'Bu olay tedarik zinciri veya altyapıda zincirleme soruna yol açar mı?',
    rehber: [
      'İzole olay, yayılım yok',
      'Sınırlı yayılım',
      'Bölgesel yayılım riski',
      'Sistemik çöküş riski',
    ],
  },
  {
    kod: 'H8', bolum: 'TEHLİKE', agirlik: 2, kritik: false, ters: true,
    soru: 'Olayın çalışanlar ve toplum üzerinde panik/güvenlik sorunu yaratma riski?',
    rehber: [
      'Panik riski yok',
      'Düşük düzeyde panik olasılığı',
      'Orta düzeyde panik riski',
      'Yüksek panik / sosyal kargaşa riski',
    ],
  },

  // ── KIRILGANLIK (F) ────────────────────────────────────────
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
    soru: 'Kilit personelin görev yapamaması durumunda operasyon ne kadar etkilenir?',
    rehber: [
      'Tam yedekli, sorun yaşanmaz',
      'Kısa süreli aksama olur',
      'Ciddi ve uzun süreli aksama',
      'Operasyon tamamen durur',
    ],
  },
  {
    kod: 'F3', bolum: 'KIRILGANLIK', agirlik: 3, kritik: false, ters: true,
    soru: 'Kriz anında personelin etik dışı davranış veya prosedür ihlali riski?',
    rehber: [
      'Kontrol altında, düşük risk',
      'Olası, ancak yönetilebilir',
      'Yüksek ihlal riski',
      'Çok yüksek, önlem alınmamış',
    ],
  },
  {
    kod: 'F4', bolum: 'KIRILGANLIK', agirlik: 5, kritik: true, ters: true,
    soru: 'Binanın yaşı ve bakım durumu göz önüne alındığında fiziksel hasar riski?',
    rehber: [
      'Yeni veya sağlam bina',
      'İyi durumda ve bakımlı',
      'Orta, güçlendirme gerekebilir',
      'Eski veya yüksek hasar riski',
    ],
  },
  {
    kod: 'F5', bolum: 'KIRILGANLIK', agirlik: 5, kritik: true, ters: true,
    soru: 'Birimin konumu (fay hattı, su basman seviyesi vb.) ek risk yaratıyor mu?',
    rehber: [
      'Güvenli konum',
      'Düşük riskli konum',
      'Orta riskli konum',
      'Çok riskli konum',
    ],
  },
  {
    kod: 'F6', bolum: 'KIRILGANLIK', agirlik: 4, kritik: false, ters: true,
    soru: 'Dijital sistemler çöktüğünde iş süreçleri manuel olarak yürütülebilir mi?',
    rehber: [
      'Kolayca manuel devam edilebilir',
      'Mümkün ama yavaş kalınır',
      'Çok zor, büyük kayıp yaşanır',
      'Manuel çalışmak imkansız',
    ],
  },
  {
    kod: 'F7', bolum: 'KIRILGANLIK', agirlik: 5, kritik: true, ters: true,
    soru: 'Operasyonun tek bir kişi, sistem veya ekipmana bağımlılık düzeyi nedir?',
    rehber: [
      'Dağıtık yapı, tam yedekli',
      'Kısmi bağımlılık var',
      'Yüksek bağımlılık',
      'Tek noktaya tam bağımlı',
    ],
  },
  {
    kod: 'F8', bolum: 'KIRILGANLIK', agirlik: 3, kritik: false, ters: true,
    soru: 'Olay sonrası yasal uyum eksikliğinden kaynaklı ceza veya yaptırım riski?',
    rehber: [
      'Tam uyumlu, risk yok',
      'Düşük düzeyde risk',
      'Orta düzeyde risk',
      'Yüksek ceza/yaptırım riski',
    ],
  },
  {
    kod: 'F9', bolum: 'KIRILGANLIK', agirlik: 3, kritik: false, ters: true,
    soru: 'Sözleşme yükümlülüklerinin yerine getirilememesinden doğan tazminat riski?',
    rehber: [
      'Mücbir sebep koruması mevcut',
      'Düşük tazminat riski',
      'Orta düzey tazminat riski',
      'Yüksek tazminat riski',
    ],
  },
  {
    kod: 'F10', bolum: 'KIRILGANLIK', agirlik: 5, kritik: true, ters: true,
    soru: 'Kullanılan teknolojilerin güncellik ve siber güvenlik açığı durumu nedir?',
    rehber: [
      'Modern ve güvenli sistemler',
      'Minör güncelleme gerekiyor',
      'Eski sistemler, zafiyet var',
      'Çok eski, ciddi açıklar mevcut',
    ],
  },
  {
    kod: 'F11', bolum: 'KIRILGANLIK', agirlik: 4, kritik: true, ters: true,
    soru: 'Kritik verilerin bütünlüğünün bozulma veya silinme riski ne düzeyde?',
    rehber: [
      'Risk yok, tam yedekli',
      'Düşük veri kaybı riski',
      'Kritik veri kaybı riski',
      'Tam veri kaybı riski',
    ],
  },
  {
    kod: 'F12', bolum: 'KIRILGANLIK', agirlik: 4, kritik: false, ters: true,
    soru: 'Kriz anında birimin nakit akışı ve acil ihtiyaç karşılama kapasitesi?',
    rehber: [
      'Güçlü nakit akışı',
      'İdare eder düzeyde',
      'Sıkıntılı, yetersiz kalabilir',
      'Nakit yok, karşılanamaz',
    ],
  },
  {
    kod: 'F13', bolum: 'KIRILGANLIK', agirlik: 3, kritik: false, ters: true,
    soru: 'Bu olayın hizmet alıcılarına (müşteri/vatandaş) güveni ve kurumsal imaja etkisi?',
    rehber: [
      'Güven sağlam, etki yok',
      'Geçici güven kaybı',
      'Ciddi itibar kaybı',
      'Kalıcı güven ve itibar kaybı',
    ],
  },
  {
    kod: 'F14', bolum: 'KIRILGANLIK', agirlik: 4, kritik: false, ters: true,
    soru: 'Bölgeye fiziksel erişim (yol kapanması, polis kordonu vb.) ne kadar zorlaşabilir?',
    rehber: [
      'Erişim sorunu beklenmez',
      'Alternatif yollar mevcut',
      'Erişim zorlaşabilir',
      'Tamamen erişilemez olabilir',
    ],
  },

  // ── KAPASİTE (E) ───────────────────────────────────────────
  {
    kod: 'E1', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Üst yönetim kriz yönetimi süreçlerine ne kadar liderlik ediyor?',
    rehber: [
      'İlgisiz, destek yok',
      'Kağıt üzerinde destek var',
      'Kısmen ilgili ve destekleyici',
      'Tam liderlik ve kaynak sağlıyor',
    ],
  },
  {
    kod: 'E2', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Kriz anında karar alma ve yetki devri süreçleri ne kadar netleştirilmiş?',
    rehber: [
      'Belirsiz, kaotik olur',
      'Yalnızca sözlü anlaşma var',
      'Yazılı ama test edilmemiş',
      'Net, yazılı ve denenmiş',
    ],
  },
  {
    kod: 'E3', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Aktif ve yetkin bir Kriz Yönetim Komitesi mevcut mu?',
    rehber: [
      'Yok',
      'Var ama pasif',
      'Aktif ama eğitimsiz',
      'Aktif, yetkili ve eğitimli',
    ],
  },
  {
    kod: 'E4', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Acil Durum Müdahale Planı güncel, erişilebilir ve uygulanabilir mi?',
    rehber: [
      'Plan yok',
      'Eski ve güncel değil',
      'Güncel ama test edilmemiş',
      'Güncel, test edilmiş ve hazır',
    ],
  },
  {
    kod: 'E5', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'Müdahale ekipleri (ilk yardım, yangın, tahliye) yeterli ve eğitimli mi?',
    rehber: [
      'Ekip yok',
      'Ekip var ama eğitimsiz',
      'Kısmen eğitimli',
      'Tam sertifikalı ve hazır',
    ],
  },
  {
    kod: 'E6', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Fiziksel güvenlik sistemleri (kamera, kartlı geçiş vb.) ne düzeyde?',
    rehber: [
      'Hiç yok',
      'Standart düzeyde',
      'Yeterli düzeyde',
      'Entegre ve yüksek güvenlik',
    ],
  },
  {
    kod: 'E7', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Yangın algılama ve söndürme sistemleri mevcut ve çalışır durumda mı?',
    rehber: [
      'Yok veya arızalı',
      'Yalnızca manuel sistem var',
      'Otomatik sistem kısmen var',
      'Tam otomatik, düzenli test ediliyor',
    ],
  },
  {
    kod: 'E8', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Enerji kesintisine karşı jeneratör/UPS sistemi tüm kritik alanları kapsıyor mu?',
    rehber: [
      'Hiç yok',
      'Yalnızca kritik sistemleri kapsıyor',
      'Tüm sistemi kısa süre besleyebiliyor',
      'Tüm sistemi uzun süre besleyebiliyor',
    ],
  },
  {
    kod: 'E9', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Afet anında personelin aile iletişim ve psikososyal destek planı var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca personel iletişimi var',
      'Aile iletişimi de dahil',
      'Kapsamlı psikososyal destek planı var',
    ],
  },
  {
    kod: 'E10', bolum: 'KAPASİTE', agirlik: 2, kritik: false, ters: false,
    soru: 'Çalışanlara yönelik psikolojik dayanıklılık ve travma sonrası destek programı?',
    rehber: [
      'Hiç yok',
      'İK desteği mevcut',
      'Destek programı planlanmış',
      'Profesyonel destek aktif olarak sunuluyor',
    ],
  },
  {
    kod: 'E11', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'İş Sürekliliği Planları (BCP) farklı senaryolara özel olarak hazırlanmış mı?',
    rehber: [
      'Hiç yok',
      'Tek tip genel plan var',
      'Bazı senaryolar için plan var',
      'Her senaryo için özelleşmiş plan var',
    ],
  },
  {
    kod: 'E12', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Kritik tedarikçi devre dışı kalırsa onaylı alternatif tedarikçi hazır mı?',
    rehber: [
      'Hiç yok',
      'Araştırılıyor',
      'Alternatif belirlendi',
      'Onaylı ve sözleşmeli alternatif hazır',
    ],
  },
  {
    kod: 'E13', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'Acil durumlar için finansal fon veya kapsamlı sigorta güvencesi var mı?',
    rehber: [
      'Hiç yok',
      'Sınırlı sigorta',
      'Kapsamlı sigorta',
      'Sigorta + nakit fon rezervi mevcut',
    ],
  },
  {
    kod: 'E14', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'IT Felaket Kurtarma Planı (DRP) düzenli olarak test ediliyor mu?',
    rehber: [
      'Hiç yok',
      'Plan var ama hiç test edilmedi',
      'Masa başı tatbikatı yapıldı',
      'Gerçek ortamda test edildi',
    ],
  },
  {
    kod: 'E15', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Siber olaylara müdahale edecek yetkin ekip veya dış hizmet alımı var mı?',
    rehber: [
      'Hiç yok',
      'IT departmanı bakıyor',
      'Dış kaynak hizmet alımı var',
      '7/24 özel siber ekip mevcut',
    ],
  },
  {
    kod: 'E16', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Kriz iletişim stratejisi belirlenmiş ve yetkili sözcü atanmış mı?',
    rehber: [
      'Hiç yok',
      'Belirsiz',
      'Strateji var ama sözcü yok',
      'Strateji ve sözcü belirlenmiş',
    ],
  },
  {
    kod: 'E17', bolum: 'KAPASİTE', agirlik: 2, kritik: false, ters: false,
    soru: 'Sosyal medya ve kamuoyu algısını izleyen ve proaktif yöneten sistem var mı?',
    rehber: [
      'Hiç yok',
      'Manuel takip yapılıyor',
      'Ajans üzerinden takip',
      '7/24 anlık izleme sistemi',
    ],
  },
  {
    kod: 'E18', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Geçmiş olaylar ve tatbikatlardan ders çıkarma süreci kurumsal olarak işliyor mu?',
    rehber: [
      'Hayır, yapılmıyor',
      'Nadiren yapılıyor',
      'Raporlanıyor ama takibi yok',
      'Kurumsal hafıza oluşturuluyor',
    ],
  },
  {
    kod: 'E19', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Risk yönetiminde PDCA döngüsü (Planla-Uygula-Kontrol Et-Önlem Al) işliyor mu?',
    rehber: [
      'Hiç yok',
      'Kesintili uygulanıyor',
      'Çoğunlukla uygulanıyor',
      'Tam döngü, sürekli iyileştirme',
    ],
  },
  {
    kod: 'E20', bolum: 'KAPASİTE', agirlik: 2, kritik: false, ters: false,
    soru: 'Kriz anında dezavantajlı grupları (engelli, hamile, yaşlı vb.) koruyucu önlemler?',
    rehber: [
      'Hiç yok',
      'Yalnızca sözlü taahhüt',
      'Yazılı prosedür var',
      'Uygulamalı politika ve tatbikat',
    ],
  },
  {
    kod: 'E21', bolum: 'KAPASİTE', agirlik: 3, kritik: false, ters: false,
    soru: 'Erken uyarı sistemleri (deprem, yangın, sel) merkeze entegre çalışıyor mu?',
    rehber: [
      'Hiç yok',
      'Yalnızca lokal alarm',
      'Merkeze bildirim yapılıyor',
      'Tam entegre, otomatik devreye giriyor',
    ],
  },
  {
    kod: 'E22', bolum: 'KAPASİTE', agirlik: 5, kritik: true, ters: false,
    soru: 'Birim kullanılamaz hale gelirse alternatif çalışma lokasyonu/yöntemi hazır mı?',
    rehber: [
      'Hiç yok',
      'Fikir aşamasında',
      'Planlandı ama hazırlanmadı',
      'Test edilmiş ve hazır lokasyon/yöntem var',
    ],
  },
  {
    kod: 'E23', bolum: 'KAPASİTE', agirlik: 4, kritik: false, ters: false,
    soru: 'Fiziksel ve siber alarmların merkeze anlık düşme ve sevk süreci nasıl?',
    rehber: [
      'Tespit edilemiyor',
      'Manuel ve yavaş',
      'Otomatik bildirim var',
      'Anlık, entegre ve önceliklendirilmiş',
    ],
  },
]

// ── Bölüm renkleri ─────────────────────────────────────────────
export const BOLUM_RENK = {
  TEHLİKE:     { bar: '#F97316', bg: 'bg-orange-950/20', border: 'border-orange-900/40', text: 'text-orange-400', light: 'bg-orange-50 border-orange-200' },
  KIRILGANLIK: { bar: '#EF4444', bg: 'bg-red-950/20',    border: 'border-red-900/40',    text: 'text-red-400',    light: 'bg-red-50 border-red-200' },
  KAPASİTE:    { bar: '#3B82F6', bg: 'bg-blue-950/20',   border: 'border-blue-900/40',   text: 'text-blue-400',   light: 'bg-blue-50 border-blue-200' },
}

export const SORULAR_H = SORULAR.filter(s => s.bolum === 'TEHLİKE')
export const SORULAR_F = SORULAR.filter(s => s.bolum === 'KIRILGANLIK')
export const SORULAR_E = SORULAR.filter(s => s.bolum === 'KAPASİTE')
