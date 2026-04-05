export type RiskProfili = 'yuksek' | 'orta' | 'dusuk'
export type TehlikeSinifi = 1 | 2 | 3

export interface NaceKodu {
  kod: string
  aciklama: string
}

export interface MeslekGrubu {
  id: number
  ad: string
  tehlikeSinifi: TehlikeSinifi
  riskProfili: RiskProfili
  ikon: string
  naceKodlari: NaceKodu[]
}

export const MESLEK_GRUPLARI: MeslekGrubu[] = [
  {
    id: 1, ad: 'Perakende Ticaret', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'ShoppingCart',
    naceKodlari: [
      { kod: '47.11', aciklama: 'Gıda, içecek ve tütün ağırlıklı mağazalar' },
      { kod: '47.19', aciklama: 'Diğer genel perakende satış' },
      { kod: '47.51', aciklama: 'Tekstil perakende ticareti' },
      { kod: '47.59', aciklama: 'Mobilya ve ev aletleri perakende' },
      { kod: '47.91', aciklama: 'Posta ve internet üzerinden perakende' },
    ],
  },
  {
    id: 2, ad: 'Toptan Dış Ticaret', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Globe',
    naceKodlari: [
      { kod: '46.11', aciklama: 'Tarımsal hammadde komisyoncuları' },
      { kod: '46.19', aciklama: 'Çeşitli ürünler komisyoncuları' },
      { kod: '46.71', aciklama: 'Yakıt toptan ticareti' },
      { kod: '46.73', aciklama: 'İnşaat malzemeleri toptan' },
      { kod: '46.90', aciklama: 'Diğer ürünlerin toptan ticareti' },
    ],
  },
  {
    id: 3, ad: 'Bijuteri ve Oyuncak', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Gem',
    naceKodlari: [
      { kod: '32.13', aciklama: 'Taklit mücevher ve bijuteri imalatı' },
      { kod: '32.40', aciklama: 'Oyun ve oyuncak imalatı' },
      { kod: '46.49', aciklama: 'Oyuncak toptan ticareti' },
      { kod: '47.65', aciklama: 'Oyun ve oyuncak perakende' },
      { kod: '32.99', aciklama: 'Diğer imalat ürünleri' },
    ],
  },
  {
    id: 4, ad: 'Kuyumculuk', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Crown',
    naceKodlari: [
      { kod: '32.11', aciklama: 'Madeni para basımı' },
      { kod: '32.12', aciklama: 'Mücevher ve ilgili eşya imalatı' },
      { kod: '46.48', aciklama: 'Saat ve mücevherat toptan ticareti' },
      { kod: '47.77', aciklama: 'Saat ve mücevherat perakende' },
      { kod: '32.91', aciklama: 'Süpürge ve fırça imalatı' },
    ],
  },
  {
    id: 5, ad: 'Bilgi Teknolojileri', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Monitor',
    naceKodlari: [
      { kod: '62.01', aciklama: 'Bilgisayar programlama faaliyetleri' },
      { kod: '62.02', aciklama: 'Bilgisayar danışmanlık faaliyetleri' },
      { kod: '62.09', aciklama: 'Diğer bilgi teknolojisi hizmetleri' },
      { kod: '63.11', aciklama: 'Veri işleme ve barındırma' },
      { kod: '63.12', aciklama: 'Web portalleri' },
    ],
  },
  {
    id: 6, ad: 'Kağıt ve Kırtasiye', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'FileText',
    naceKodlari: [
      { kod: '17.11', aciklama: 'Kağıt hamuru imalatı' },
      { kod: '17.12', aciklama: 'Kağıt ve karton imalatı' },
      { kod: '17.22', aciklama: 'Kağıt ve karton kap imalatı' },
      { kod: '46.18', aciklama: 'Kağıt ve kırtasiye toptan' },
      { kod: '47.62', aciklama: 'Kağıt ve kırtasiye perakende' },
    ],
  },
  {
    id: 7, ad: 'Kozmetik', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Sparkles',
    naceKodlari: [
      { kod: '20.41', aciklama: 'Sabun ve deterjan imalatı' },
      { kod: '20.42', aciklama: 'Parfüm ve kozmetik imalatı' },
      { kod: '46.44', aciklama: 'Cam, porselen ve temizlik ürünleri toptan' },
      { kod: '46.45', aciklama: 'Parfüm ve kozmetik toptan' },
      { kod: '47.75', aciklama: 'Kozmetik ve kişisel bakım perakende' },
    ],
  },
  {
    id: 8, ad: 'İlaç ve Tıbbi Cihaz', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Pill',
    naceKodlari: [
      { kod: '21.10', aciklama: 'Eczacılık ürünleri imalatı' },
      { kod: '21.20', aciklama: 'İlaç müstahzarları imalatı' },
      { kod: '32.50', aciklama: 'Tıbbi ve dişçilik aletleri imalatı' },
      { kod: '46.46', aciklama: 'Eczacılık ürünleri toptan' },
      { kod: '47.73', aciklama: 'Eczane' },
    ],
  },
  {
    id: 9, ad: 'Toptan Gıda', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Package',
    naceKodlari: [
      { kod: '46.31', aciklama: 'Meyve ve sebze toptan ticareti' },
      { kod: '46.32', aciklama: 'Et, balık ve süt ürünleri toptan' },
      { kod: '46.33', aciklama: 'Süt ürünleri, yağ ve yumurta toptan' },
      { kod: '46.36', aciklama: 'Şeker, çikolata ve şekerleme toptan' },
      { kod: '46.39', aciklama: 'Diğer gıda toptan ticareti' },
    ],
  },
  {
    id: 10, ad: 'Cam', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Box',
    naceKodlari: [
      { kod: '23.11', aciklama: 'Düz cam imalatı' },
      { kod: '23.12', aciklama: 'Düz camın şekillendirilmesi' },
      { kod: '23.13', aciklama: 'İçi boş cam imalatı' },
      { kod: '23.14', aciklama: 'Cam elyafı imalatı' },
      { kod: '23.19', aciklama: 'Diğer cam imalatı' },
    ],
  },
  {
    id: 11, ad: 'Peyzaj', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Leaf',
    naceKodlari: [
      { kod: '01.19', aciklama: 'Diğer tek yıllık bitki yetiştiriciliği' },
      { kod: '01.30', aciklama: 'Fide ve fidan yetiştiriciliği' },
      { kod: '71.12', aciklama: 'Mühendislik faaliyetleri ve danışmanlık' },
      { kod: '81.10', aciklama: 'Bütünleşik bina yönetimi' },
      { kod: '81.30', aciklama: 'Manzara ve peyzaj bakımı' },
    ],
  },
  {
    id: 12, ad: 'Ekmek ve Un', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Wheat',
    naceKodlari: [
      { kod: '10.61', aciklama: 'Un ve irmik imalatı' },
      { kod: '10.71', aciklama: 'Ekmek, taze pasta ve kek imalatı' },
      { kod: '10.72', aciklama: 'Peksimet, bisküvi ve dayanıklı ürünler' },
      { kod: '10.73', aciklama: 'Makarna, erişte ve benzeri ürünler' },
      { kod: '47.24', aciklama: 'Ekmek, pasta ve şekerleme perakende' },
    ],
  },
  {
    id: 13, ad: 'Meyve ve Sebze', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Apple',
    naceKodlari: [
      { kod: '01.11', aciklama: 'Tahıl ve baklagil yetiştiriciliği' },
      { kod: '01.13', aciklama: 'Sebze ve kavun yetiştiriciliği' },
      { kod: '10.31', aciklama: 'Patates işleme ve konservesi' },
      { kod: '46.31', aciklama: 'Meyve ve sebze toptan ticareti' },
      { kod: '47.21', aciklama: 'Meyve ve sebze perakende' },
    ],
  },
  {
    id: 14, ad: 'Hayvansal Gıda', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Beef',
    naceKodlari: [
      { kod: '01.47', aciklama: 'Kümes hayvanı yetiştiriciliği' },
      { kod: '10.11', aciklama: 'Et ürünleri işleme ve konservesi' },
      { kod: '10.51', aciklama: 'Süt ürünleri imalatı' },
      { kod: '10.92', aciklama: 'Evcil hayvan maması imalatı' },
      { kod: '46.32', aciklama: 'Et ürünleri toptan ticareti' },
    ],
  },
  {
    id: 15, ad: 'Eğitim', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'GraduationCap',
    naceKodlari: [
      { kod: '85.10', aciklama: 'Okul öncesi eğitim' },
      { kod: '85.20', aciklama: 'İlköğretim' },
      { kod: '85.31', aciklama: 'Genel ortaöğretim' },
      { kod: '85.41', aciklama: 'Yükseköğretim' },
      { kod: '85.59', aciklama: 'Diğer eğitim faaliyetleri' },
    ],
  },
  {
    id: 16, ad: 'Oteller', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Building',
    naceKodlari: [
      { kod: '55.10', aciklama: 'Oteller ve benzer konaklama yerleri' },
      { kod: '55.20', aciklama: 'Tatil ve kısa süreli konaklama' },
      { kod: '55.30', aciklama: 'Kamp alanları ve karavan parkları' },
      { kod: '79.11', aciklama: 'Seyahat acentası faaliyetleri' },
      { kod: '79.12', aciklama: 'Tur operatörü faaliyetleri' },
    ],
  },
  {
    id: 17, ad: 'Restoran', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Utensils',
    naceKodlari: [
      { kod: '56.10', aciklama: 'Restoranlar ve seyyar yemek hizmetleri' },
      { kod: '56.21', aciklama: 'Tabldot yemek hizmetleri' },
      { kod: '56.29', aciklama: 'Diğer yemek hizmetleri' },
      { kod: '56.30', aciklama: 'İçecek hizmetleri' },
      { kod: '47.26', aciklama: 'Tütün ürünleri perakende' },
    ],
  },
  {
    id: 18, ad: 'Finans Kuruluşları', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Banknote',
    naceKodlari: [
      { kod: '64.19', aciklama: 'Diğer parasal aracılık' },
      { kod: '64.91', aciklama: 'Finansal kiralama' },
      { kod: '64.92', aciklama: 'Diğer kredi kuruluşları' },
      { kod: '64.99', aciklama: 'Diğer finansal hizmetler' },
      { kod: '66.19', aciklama: 'Finansal hizmetlere yardımcı faaliyetler' },
    ],
  },
  {
    id: 19, ad: 'Mali Müşavirlik', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Calculator',
    naceKodlari: [
      { kod: '69.20', aciklama: 'Muhasebe, defter tutma ve denetim' },
      { kod: '66.11', aciklama: 'Finansal piyasaların yönetimi' },
      { kod: '66.12', aciklama: 'Menkul kıymet aracılığı' },
      { kod: '70.22', aciklama: 'İşletme ve yönetim danışmanlığı' },
      { kod: '64.30', aciklama: 'Yatırım fonları' },
    ],
  },
  {
    id: 20, ad: 'Sigortacılık', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Shield',
    naceKodlari: [
      { kod: '65.11', aciklama: 'Hayat sigortası' },
      { kod: '65.12', aciklama: 'Hayat sigortası dışı sigortacılık' },
      { kod: '65.20', aciklama: 'Reasürans' },
      { kod: '65.30', aciklama: 'Emeklilik fonları' },
      { kod: '66.21', aciklama: 'Risk ve hasar değerlendirmesi' },
    ],
  },
  {
    id: 21, ad: 'Gayrimenkul', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Building2',
    naceKodlari: [
      { kod: '41.10', aciklama: 'İnşaat projeleri geliştirme' },
      { kod: '68.10', aciklama: 'Kendi mülkünün alım satımı' },
      { kod: '68.20', aciklama: 'Kendi mülkünün kiralanması' },
      { kod: '68.31', aciklama: 'Gayrimenkul acenteleri' },
      { kod: '68.32', aciklama: 'Gayrimenkul yönetimi' },
    ],
  },
  {
    id: 22, ad: 'Şehiriçi Taşımacılık', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Bus',
    naceKodlari: [
      { kod: '49.31', aciklama: 'Kent içi ve banliyö kara yolu taşımacılığı' },
      { kod: '49.32', aciklama: 'Taksi işletmeciliği' },
      { kod: '49.39', aciklama: 'Diğer kara yolu yolcu taşımacılığı' },
      { kod: '52.21', aciklama: 'Kara yolu taşımacılığına yardımcı faaliyetler' },
      { kod: '77.11', aciklama: 'Otomobil kiralama' },
    ],
  },
  {
    id: 23, ad: 'Yolcu Taşımacılığı', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Train',
    naceKodlari: [
      { kod: '49.10', aciklama: 'Demiryolu ile şehirlerarası yolcu taşımacılığı' },
      { kod: '49.20', aciklama: 'Demiryolu ile yük taşımacılığı' },
      { kod: '49.39', aciklama: 'Diğer kara yolu yolcu taşımacılığı' },
      { kod: '51.10', aciklama: 'Hava yolu ile yolcu taşımacılığı' },
      { kod: '50.10', aciklama: 'Deniz yolu ile yolcu taşımacılığı' },
    ],
  },
  {
    id: 24, ad: 'Lojistik', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Truck',
    naceKodlari: [
      { kod: '49.41', aciklama: 'Kara yolu ile yük taşımacılığı' },
      { kod: '52.10', aciklama: 'Depolama ve antrepo faaliyetleri' },
      { kod: '52.29', aciklama: 'Diğer taşımacılığa yardımcı faaliyetler' },
      { kod: '53.10', aciklama: 'Posta faaliyetleri' },
      { kod: '53.20', aciklama: 'Kurye faaliyetleri' },
    ],
  },
  {
    id: 25, ad: 'Gümrük Müşavirliği', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'ClipboardList',
    naceKodlari: [
      { kod: '52.29', aciklama: 'Taşımacılığa yardımcı diğer faaliyetler' },
      { kod: '69.10', aciklama: 'Hukuki faaliyetler' },
      { kod: '70.22', aciklama: 'İşletme ve yönetim danışmanlığı' },
      { kod: '74.90', aciklama: 'Diğer mesleki, bilimsel ve teknik faaliyetler' },
      { kod: '82.11', aciklama: 'Genel büro hizmetleri' },
    ],
  },
  {
    id: 26, ad: 'Taşıt Kiralama', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Car',
    naceKodlari: [
      { kod: '77.11', aciklama: 'Otomobil ve hafif motorlu taşıt kiralama' },
      { kod: '77.12', aciklama: 'Kamyon ve ağır taşıt kiralama' },
      { kod: '77.21', aciklama: 'Spor ve rekreasyon ekipmanı kiralama' },
      { kod: '77.39', aciklama: 'Diğer makine ve ekipman kiralama' },
      { kod: '49.32', aciklama: 'Taksi işletmeciliği' },
    ],
  },
  {
    id: 27, ad: 'Akaryakıt', tehlikeSinifi: 1, riskProfili: 'yuksek', ikon: 'Fuel',
    naceKodlari: [
      { kod: '19.20', aciklama: 'Petrol ürünleri imalatı' },
      { kod: '46.71', aciklama: 'Katı, sıvı ve gaz yakıt toptan' },
      { kod: '47.30', aciklama: 'Akaryakıt istasyonu işletmeciliği' },
      { kod: '49.50', aciklama: 'Boru hattı taşımacılığı' },
      { kod: '52.10', aciklama: 'Depolama ve antrepo faaliyetleri' },
    ],
  },
  {
    id: 28, ad: 'İşletme Destek', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Briefcase',
    naceKodlari: [
      { kod: '78.10', aciklama: 'İstihdam acentesi faaliyetleri' },
      { kod: '81.10', aciklama: 'Bütünleşik bina yönetimi' },
      { kod: '82.11', aciklama: 'Genel büro hizmetleri' },
      { kod: '82.19', aciklama: 'Fotokopi, belge hazırlama ve benzeri hizmetler' },
      { kod: '82.99', aciklama: 'Diğer işletmelere yönelik hizmetler' },
    ],
  },
  {
    id: 29, ad: 'Mimarlık ve Mühendislik', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Compass',
    naceKodlari: [
      { kod: '71.11', aciklama: 'Mimarlık faaliyetleri' },
      { kod: '71.12', aciklama: 'Mühendislik faaliyetleri ve teknik danışmanlık' },
      { kod: '71.20', aciklama: 'Teknik test ve analiz' },
      { kod: '73.20', aciklama: 'Pazar araştırması ve kamuoyu yoklaması' },
      { kod: '74.10', aciklama: 'Uzmanlaşmış tasarım faaliyetleri' },
    ],
  },
  {
    id: 30, ad: 'Bilgi, İletişim ve Medya', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Tv',
    naceKodlari: [
      { kod: '59.11', aciklama: 'Film ve video yapım faaliyetleri' },
      { kod: '60.10', aciklama: 'Radyo yayıncılığı' },
      { kod: '60.20', aciklama: 'Televizyon programlama ve yayıncılığı' },
      { kod: '63.91', aciklama: 'Haber ajansı faaliyetleri' },
      { kod: '73.12', aciklama: 'Medya temsil faaliyetleri' },
    ],
  },
  {
    id: 31, ad: 'Kültür ve Spor', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Trophy',
    naceKodlari: [
      { kod: '90.01', aciklama: 'Gösteri sanatları' },
      { kod: '90.02', aciklama: 'Gösteri sanatlarını destekleyici faaliyetler' },
      { kod: '93.11', aciklama: 'Spor tesisleri işletmeciliği' },
      { kod: '93.13', aciklama: 'Spor kulübü faaliyetleri' },
      { kod: '93.19', aciklama: 'Diğer spor faaliyetleri' },
    ],
  },
  {
    id: 32, ad: 'Basım ve Yayın', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'BookOpen',
    naceKodlari: [
      { kod: '18.11', aciklama: 'Gazete basımı' },
      { kod: '18.12', aciklama: 'Diğer baskı faaliyetleri' },
      { kod: '18.13', aciklama: 'Baskı öncesi ve baskı medyası hizmetleri' },
      { kod: '58.11', aciklama: 'Kitap yayımcılığı' },
      { kod: '58.14', aciklama: 'Dergi yayımcılığı' },
    ],
  },
  {
    id: 33, ad: 'Sağlık', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Heart',
    naceKodlari: [
      { kod: '86.10', aciklama: 'Hastane faaliyetleri' },
      { kod: '86.21', aciklama: 'Genel tıbbi uygulama faaliyetleri' },
      { kod: '86.22', aciklama: 'Uzman tıbbi uygulama faaliyetleri' },
      { kod: '86.90', aciklama: 'Diğer insan sağlığı hizmetleri' },
      { kod: '87.10', aciklama: 'Yataklı bakım hizmetleri' },
    ],
  },
  {
    id: 34, ad: 'Deri ve Kürk', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Layers',
    naceKodlari: [
      { kod: '15.11', aciklama: 'Deri ve kösele imalatı' },
      { kod: '15.12', aciklama: 'Bavul, el çantası ve saraciye imalatı' },
      { kod: '15.20', aciklama: 'Ayakkabı imalatı' },
      { kod: '14.19', aciklama: 'Diğer giyim eşyası imalatı' },
      { kod: '46.41', aciklama: 'Tekstil ipliği ve kumaşı toptan' },
    ],
  },
  {
    id: 35, ad: 'İplik ve Elyaf', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Wind',
    naceKodlari: [
      { kod: '13.10', aciklama: 'Tekstil elyafı hazırlama ve iplik eğirme' },
      { kod: '13.20', aciklama: 'Dokuma kumaş imalatı' },
      { kod: '14.12', aciklama: 'İş giysileri imalatı' },
      { kod: '46.76', aciklama: 'Diğer ara ürünler toptan ticareti' },
      { kod: '13.91', aciklama: 'Örme ve tığ ile dokunmuş kumaş imalatı' },
    ],
  },
  {
    id: 36, ad: 'Örme Kumaş', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Layers',
    naceKodlari: [
      { kod: '13.91', aciklama: 'Örme ve tığ ile dokunmuş kumaş imalatı' },
      { kod: '13.92', aciklama: 'Hazır tekstil ürünleri imalatı' },
      { kod: '14.31', aciklama: 'Çorap imalatı' },
      { kod: '46.41', aciklama: 'Tekstil ipliği ve kumaşı toptan' },
      { kod: '13.99', aciklama: 'Diğer tekstil ürünleri imalatı' },
    ],
  },
  {
    id: 37, ad: 'Kumaş', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Scissors',
    naceKodlari: [
      { kod: '13.20', aciklama: 'Dokuma kumaş imalatı' },
      { kod: '13.30', aciklama: 'Tekstilin bitirilmesi' },
      { kod: '13.92', aciklama: 'Hazır tekstil ürünleri imalatı' },
      { kod: '14.11', aciklama: 'Deri giysi imalatı' },
      { kod: '46.41', aciklama: 'Tekstil ipliği ve kumaşı toptan' },
    ],
  },
  {
    id: 38, ad: 'Hazır Giyim', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Shirt',
    naceKodlari: [
      { kod: '14.11', aciklama: 'Deri giysi imalatı' },
      { kod: '14.12', aciklama: 'İş giysileri imalatı' },
      { kod: '14.13', aciklama: 'Diğer dış giyim imalatı' },
      { kod: '14.14', aciklama: 'İç giyim imalatı' },
      { kod: '46.42', aciklama: 'Giyim eşyaları toptan ticareti' },
    ],
  },
  {
    id: 39, ad: 'İç Giyim', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Shirt',
    naceKodlari: [
      { kod: '14.14', aciklama: 'İç giyim imalatı' },
      { kod: '14.19', aciklama: 'Diğer giyim eşyası imalatı' },
      { kod: '14.31', aciklama: 'Çorap imalatı' },
      { kod: '46.42', aciklama: 'Giyim eşyaları toptan ticareti' },
      { kod: '47.71', aciklama: 'Giyim eşyaları perakende' },
    ],
  },
  {
    id: 40, ad: 'Ev Tekstili', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Home',
    naceKodlari: [
      { kod: '13.92', aciklama: 'Hazır tekstil ürünleri imalatı (yatak örtüsü vb.)' },
      { kod: '13.93', aciklama: 'Halı ve kilim imalatı' },
      { kod: '14.19', aciklama: 'Diğer giyim eşyası imalatı' },
      { kod: '46.41', aciklama: 'Tekstil ipliği ve kumaşı toptan' },
      { kod: '47.51', aciklama: 'Tekstil ürünleri perakende' },
    ],
  },
  {
    id: 41, ad: 'Halı ve Kilim', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'LayoutGrid',
    naceKodlari: [
      { kod: '13.93', aciklama: 'Halı ve kilim imalatı' },
      { kod: '13.91', aciklama: 'Örme ve tığ işi kumaş imalatı' },
      { kod: '13.99', aciklama: 'Diğer tekstil ürünleri imalatı' },
      { kod: '46.47', aciklama: 'Mobilya, halı ve aydınlatma ekipmanları toptan' },
      { kod: '47.53', aciklama: 'Halı ve duvar kağıdı perakende' },
    ],
  },
  {
    id: 42, ad: 'Tekstil Yan Sanayi', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Settings2',
    naceKodlari: [
      { kod: '13.94', aciklama: 'Halat, ip, sicim ve ağ imalatı' },
      { kod: '13.96', aciklama: 'Teknik ve endüstriyel tekstil imalatı' },
      { kod: '13.99', aciklama: 'Diğer tekstil ürünleri imalatı' },
      { kod: '28.94', aciklama: 'Tekstil, giyim ve deri makineleri imalatı' },
      { kod: '46.41', aciklama: 'Tekstil ipliği ve kumaşı toptan' },
    ],
  },
  {
    id: 43, ad: 'Tekstil Terbiye', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Droplets',
    naceKodlari: [
      { kod: '13.30', aciklama: 'Tekstilin bitirilmesi (boya, apre vb.)' },
      { kod: '13.10', aciklama: 'Tekstil elyafı hazırlama ve iplik eğirme' },
      { kod: '13.20', aciklama: 'Dokuma kumaş imalatı' },
      { kod: '20.14', aciklama: 'Diğer organik temel kimyasal maddeler' },
      { kod: '46.41', aciklama: 'Tekstil ipliği ve kumaşı toptan' },
    ],
  },
  {
    id: 44, ad: 'Altyapı İnşaat', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'HardHat',
    naceKodlari: [
      { kod: '42.11', aciklama: 'Kara ve demiryolu inşaatı' },
      { kod: '42.21', aciklama: 'Su projeleri inşaatı' },
      { kod: '42.22', aciklama: 'Elektrik ve telekomünikasyon altyapısı inşaatı' },
      { kod: '42.91', aciklama: 'Su yolu projeleri inşaatı' },
      { kod: '42.99', aciklama: 'Diğer mühendislik yapıları inşaatı' },
    ],
  },
  {
    id: 45, ad: 'Konut İnşaat', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Building2',
    naceKodlari: [
      { kod: '41.10', aciklama: 'İnşaat projesi geliştirme' },
      { kod: '41.20', aciklama: 'Konut ve konut dışı bina inşaatı' },
      { kod: '43.11', aciklama: 'Yıkım' },
      { kod: '43.12', aciklama: 'Arazi hazırlama' },
      { kod: '43.21', aciklama: 'Elektrik tesisatı' },
    ],
  },
  {
    id: 46, ad: 'İnşaat Taahhüt', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'HardHat',
    naceKodlari: [
      { kod: '41.20', aciklama: 'Konut ve konut dışı bina inşaatı' },
      { kod: '42.11', aciklama: 'Kara ve demiryolu inşaatı' },
      { kod: '43.22', aciklama: 'Su tesisatı, ısıtma ve havalandırma' },
      { kod: '43.29', aciklama: 'Diğer inşaat tamamlama' },
      { kod: '43.99', aciklama: 'Diğer özel inşaat faaliyetleri' },
    ],
  },
  {
    id: 47, ad: 'Restorasyon', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Wrench',
    naceKodlari: [
      { kod: '41.20', aciklama: 'Bina inşaatı ve renovasyonu' },
      { kod: '43.21', aciklama: 'Elektrik tesisatı' },
      { kod: '43.91', aciklama: 'Çatı işleri' },
      { kod: '43.99', aciklama: 'Diğer özel inşaat faaliyetleri' },
      { kod: '71.11', aciklama: 'Mimarlık faaliyetleri' },
    ],
  },
  {
    id: 48, ad: 'İnşaat Malzemeleri', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Box',
    naceKodlari: [
      { kod: '23.61', aciklama: 'Beton ürünleri imalatı' },
      { kod: '23.63', aciklama: 'Hazır beton imalatı' },
      { kod: '23.64', aciklama: 'Harç imalatı' },
      { kod: '23.65', aciklama: 'Elyaf çimento ürünleri imalatı' },
      { kod: '46.73', aciklama: 'İnşaat malzemeleri toptan' },
    ],
  },
  {
    id: 49, ad: 'Toprak Ürünleri', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Mountain',
    naceKodlari: [
      { kod: '08.12', aciklama: 'Çakıl ve kum çıkarımı' },
      { kod: '23.31', aciklama: 'Seramik karo ve döşeme taşı imalatı' },
      { kod: '23.32', aciklama: 'Pişmiş toprak tuğla imalatı' },
      { kod: '23.41', aciklama: 'Seramik ev ve süs eşyası imalatı' },
      { kod: '23.42', aciklama: 'Seramik sağlık ürünleri imalatı' },
    ],
  },
  {
    id: 50, ad: 'Mekanik Tesisat / Doğalgaz', tehlikeSinifi: 1, riskProfili: 'yuksek', ikon: 'Flame',
    naceKodlari: [
      { kod: '35.22', aciklama: 'Gaz dağıtımı (boru hattı ile)' },
      { kod: '43.22', aciklama: 'Su ve gaz tesisatı, ısıtma ve havalandırma' },
      { kod: '43.29', aciklama: 'Diğer inşaat tesisatı faaliyetleri' },
      { kod: '33.12', aciklama: 'Makine ve ekipman onarımı' },
      { kod: '46.74', aciklama: 'Hırdavat ve sıhhi tesisat ekipmanları toptan' },
    ],
  },
  {
    id: 51, ad: 'Ayakkabı Sanayi', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Footprints',
    naceKodlari: [
      { kod: '15.20', aciklama: 'Ayakkabı imalatı' },
      { kod: '15.11', aciklama: 'Deri ve kösele imalatı' },
      { kod: '14.20', aciklama: 'Kürk eşya imalatı' },
      { kod: '46.42', aciklama: 'Giyim eşyaları toptan ticareti' },
      { kod: '47.72', aciklama: 'Ayakkabı ve deri eşya perakende' },
    ],
  },
  {
    id: 52, ad: 'Kara Taşıtları', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Car',
    naceKodlari: [
      { kod: '29.10', aciklama: 'Motorlu kara taşıtı imalatı' },
      { kod: '29.20', aciklama: 'Motorlu kara taşıtları için karoser imalatı' },
      { kod: '29.31', aciklama: 'Elektrik ve elektronik ekipman imalatı (taşıt)' },
      { kod: '29.32', aciklama: 'Diğer motorlu kara taşıtları parça imalatı' },
      { kod: '30.92', aciklama: 'Bisiklet ve engelli arabası imalatı' },
    ],
  },
  {
    id: 53, ad: 'Motorlu Taşıt Satış', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'ShoppingCart',
    naceKodlari: [
      { kod: '45.11', aciklama: 'Otomobil ve hafif motorlu taşıt ticareti' },
      { kod: '45.19', aciklama: 'Diğer motorlu taşıt ticareti' },
      { kod: '45.31', aciklama: 'Motorlu kara taşıtları parça toptan' },
      { kod: '45.32', aciklama: 'Motorlu kara taşıtları parça perakende' },
      { kod: '45.40', aciklama: 'Motosiklet satış ve onarımı' },
    ],
  },
  {
    id: 54, ad: 'Motorlu Araç Tamir', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Wrench',
    naceKodlari: [
      { kod: '45.20', aciklama: 'Motorlu kara taşıtlarının bakım ve onarımı' },
      { kod: '45.32', aciklama: 'Motorlu taşıt parçaları perakende' },
      { kod: '45.40', aciklama: 'Motosiklet bakım ve onarımı' },
      { kod: '52.21', aciklama: 'Kara yolu taşımacılığına yardımcı faaliyetler' },
      { kod: '77.11', aciklama: 'Otomobil kiralama' },
    ],
  },
  {
    id: 55, ad: 'Demir Çelik', tehlikeSinifi: 1, riskProfili: 'yuksek', ikon: 'Hammer',
    naceKodlari: [
      { kod: '24.10', aciklama: 'Pik demir ve çelik imalatı' },
      { kod: '24.20', aciklama: 'Çelik borular ve bağlantı parçaları imalatı' },
      { kod: '24.31', aciklama: 'Soğuk çekme çubuk imalatı' },
      { kod: '24.32', aciklama: 'Soğuk hadde şerit imalatı' },
      { kod: '46.72', aciklama: 'Metal cevherleri ve metaller toptan' },
    ],
  },
  {
    id: 56, ad: 'Demir Dışı Metaller', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Layers',
    naceKodlari: [
      { kod: '24.41', aciklama: 'Kıymetli metal imalatı' },
      { kod: '24.42', aciklama: 'Alüminyum imalatı' },
      { kod: '24.43', aciklama: 'Kurşun, çinko ve kalay imalatı' },
      { kod: '24.44', aciklama: 'Bakır imalatı' },
      { kod: '24.45', aciklama: 'Diğer demir dışı metal imalatı' },
    ],
  },
  {
    id: 57, ad: 'Döküm ve Metal', tehlikeSinifi: 1, riskProfili: 'yuksek', ikon: 'Hammer',
    naceKodlari: [
      { kod: '24.51', aciklama: 'Demir dökümcülüğü' },
      { kod: '24.52', aciklama: 'Çelik dökümcülüğü' },
      { kod: '24.53', aciklama: 'Hafif metal dökümcülüğü' },
      { kod: '24.54', aciklama: 'Diğer demir dışı metal dökümcülüğü' },
      { kod: '25.91', aciklama: 'Çelik varil ve benzer kaplar imalatı' },
    ],
  },
  {
    id: 58, ad: 'Metal Ürünler', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Settings',
    naceKodlari: [
      { kod: '25.11', aciklama: 'Metal yapı ve yapı elemanları imalatı' },
      { kod: '25.21', aciklama: 'Merkezi ısıtma radyatörleri imalatı' },
      { kod: '25.61', aciklama: 'Metal yüzey işleme ve kaplama' },
      { kod: '25.72', aciklama: 'Kilit ve menteşe imalatı' },
      { kod: '25.73', aciklama: 'El aletleri imalatı' },
    ],
  },
  {
    id: 59, ad: 'Makina Ekipmanları', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Cog',
    naceKodlari: [
      { kod: '28.11', aciklama: 'Motor ve türbin imalatı' },
      { kod: '28.22', aciklama: 'Kaldırma ve taşıma ekipmanları imalatı' },
      { kod: '28.30', aciklama: 'Tarımsal ve ormancılık makineleri imalatı' },
      { kod: '28.49', aciklama: 'Diğer metal işleme makineleri imalatı' },
      { kod: '28.99', aciklama: 'Diğer özel amaçlı makineler imalatı' },
    ],
  },
  {
    id: 60, ad: 'Takım Tezgahları', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Wrench',
    naceKodlari: [
      { kod: '28.41', aciklama: 'Metal şekillendirme makineleri imalatı' },
      { kod: '28.49', aciklama: 'Diğer takım tezgahları imalatı' },
      { kod: '28.99', aciklama: 'Diğer özel amaçlı makineler imalatı' },
      { kod: '33.12', aciklama: 'Makine ve ekipman onarımı' },
      { kod: '46.63', aciklama: 'Madencilik, inşaat ve mühendislik makineleri toptan' },
    ],
  },
  {
    id: 61, ad: 'Teknik Hırdavat', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Wrench',
    naceKodlari: [
      { kod: '25.94', aciklama: 'Civata, somun ve benzeri ürünler imalatı' },
      { kod: '28.99', aciklama: 'Diğer özel amaçlı makineler imalatı' },
      { kod: '33.20', aciklama: 'Endüstriyel makine ve ekipman kurulumu' },
      { kod: '46.74', aciklama: 'Hırdavat ve sıhhi tesisat ekipmanları toptan' },
      { kod: '47.52', aciklama: 'Hırdavat, boya ve cam perakende' },
    ],
  },
  {
    id: 62, ad: 'Mermercilik', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Mountain',
    naceKodlari: [
      { kod: '08.11', aciklama: 'Mermer ve granit çıkarımı' },
      { kod: '23.70', aciklama: 'Mermer ve granit işleme' },
      { kod: '23.99', aciklama: 'Diğer metalik olmayan mineral ürünler' },
      { kod: '43.91', aciklama: 'Çatı işleri' },
      { kod: '46.73', aciklama: 'İnşaat malzemeleri toptan' },
    ],
  },
  {
    id: 63, ad: 'Enerji', tehlikeSinifi: 1, riskProfili: 'yuksek', ikon: 'Zap',
    naceKodlari: [
      { kod: '35.11', aciklama: 'Elektrik üretimi' },
      { kod: '35.12', aciklama: 'Elektrik iletimi' },
      { kod: '35.13', aciklama: 'Elektrik dağıtımı' },
      { kod: '35.14', aciklama: 'Elektrik ticareti' },
      { kod: '35.22', aciklama: 'Gaz dağıtımı' },
    ],
  },
  {
    id: 64, ad: 'Elektrik Ekipmanları', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Zap',
    naceKodlari: [
      { kod: '27.11', aciklama: 'Elektrik motoru, jeneratör ve trafo imalatı' },
      { kod: '27.12', aciklama: 'Elektrik dağıtım ve kontrol cihazları imalatı' },
      { kod: '27.20', aciklama: 'Pil ve akü imalatı' },
      { kod: '27.32', aciklama: 'Diğer elektronik ve elektrik iletkenleri imalatı' },
      { kod: '27.33', aciklama: 'Kablo montaj parçaları imalatı' },
    ],
  },
  {
    id: 65, ad: 'Aydınlatma', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Lightbulb',
    naceKodlari: [
      { kod: '27.40', aciklama: 'Elektrikli aydınlatma ekipmanları imalatı' },
      { kod: '27.90', aciklama: 'Diğer elektrikli ekipman imalatı' },
      { kod: '46.47', aciklama: 'Mobilya, halı ve aydınlatma ekipmanları toptan' },
      { kod: '47.59', aciklama: 'Mobilya ve ev aletleri perakende' },
      { kod: '26.40', aciklama: 'Tüketici elektroniği imalatı' },
    ],
  },
  {
    id: 66, ad: 'Elektrikli Ev Aletleri', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Plug',
    naceKodlari: [
      { kod: '27.51', aciklama: 'Elektrikli ev aletleri imalatı' },
      { kod: '27.52', aciklama: 'Elektrikli olmayan ev aletleri imalatı' },
      { kod: '27.90', aciklama: 'Diğer elektrikli ekipman imalatı' },
      { kod: '46.43', aciklama: 'Elektrikli ev aletleri toptan' },
      { kod: '47.54', aciklama: 'Elektrikli ev aletleri perakende' },
    ],
  },
  {
    id: 67, ad: 'Telekomünikasyon', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Wifi',
    naceKodlari: [
      { kod: '26.30', aciklama: 'İletişim cihazları imalatı' },
      { kod: '61.10', aciklama: 'Kablolu telekomünikasyon faaliyetleri' },
      { kod: '61.20', aciklama: 'Kablosuz telekomünikasyon faaliyetleri' },
      { kod: '61.30', aciklama: 'Uydu üzerinden telekomünikasyon faaliyetleri' },
      { kod: '61.90', aciklama: 'Diğer telekomünikasyon faaliyetleri' },
    ],
  },
  {
    id: 68, ad: 'Plastik ve Kauçuk', tehlikeSinifi: 1, riskProfili: 'yuksek', ikon: 'FlaskConical',
    naceKodlari: [
      { kod: '22.11', aciklama: 'Kauçuk dış lastik imalatı' },
      { kod: '22.19', aciklama: 'Diğer kauçuk ürünleri imalatı' },
      { kod: '22.21', aciklama: 'Plastik levha, boru ve profil imalatı' },
      { kod: '22.22', aciklama: 'Plastik ambalaj imalatı' },
      { kod: '22.23', aciklama: 'İnşaat için plastik ürünler imalatı' },
    ],
  },
  {
    id: 69, ad: 'Kimyevi Madde', tehlikeSinifi: 1, riskProfili: 'yuksek', ikon: 'TestTube',
    naceKodlari: [
      { kod: '20.11', aciklama: 'Sanayi gazları imalatı' },
      { kod: '20.12', aciklama: 'Boya maddeleri imalatı' },
      { kod: '20.13', aciklama: 'Diğer anorganik temel kimyasallar' },
      { kod: '20.14', aciklama: 'Diğer organik temel kimyasallar' },
      { kod: '20.15', aciklama: 'Gübre ve azot bileşikleri imalatı' },
    ],
  },
  {
    id: 70, ad: 'Orman Ürünleri', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Trees',
    naceKodlari: [
      { kod: '02.10', aciklama: 'Silvikültür ve diğer ormancılık faaliyetleri' },
      { kod: '16.10', aciklama: 'Kereste kesimi ve işlenmesi' },
      { kod: '16.21', aciklama: 'Kaplama levhası ve kontrplak imalatı' },
      { kod: '16.29', aciklama: 'Diğer ahşap ürünleri imalatı' },
      { kod: '46.73', aciklama: 'İnşaat malzemeleri ve ahşap toptan' },
    ],
  },
  {
    id: 71, ad: 'Mobilya', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Armchair',
    naceKodlari: [
      { kod: '31.01', aciklama: 'Büro ve mağaza mobilyası imalatı' },
      { kod: '31.02', aciklama: 'Mutfak mobilyası imalatı' },
      { kod: '31.03', aciklama: 'Yatak imalatı' },
      { kod: '31.09', aciklama: 'Diğer mobilya imalatı' },
      { kod: '47.59', aciklama: 'Mobilya ve ev aletleri perakende' },
    ],
  },
  {
    id: 72, ad: 'Baklava ve Pasta', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Utensils',
    naceKodlari: [
      { kod: '10.71', aciklama: 'Ekmek, taze pasta ve kek imalatı' },
      { kod: '10.72', aciklama: 'Peksimet, bisküvi ve dayanıklı hamur işleri' },
      { kod: '10.82', aciklama: 'Kakao, çikolata ve şekerleme imalatı' },
      { kod: '47.24', aciklama: 'Ekmek, pasta ve şekerleme perakende' },
      { kod: '56.10', aciklama: 'Restoran ve seyyar yemek hizmetleri' },
    ],
  },
  {
    id: 73, ad: 'Gözlükçülük ve Saatçilik', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Eye',
    naceKodlari: [
      { kod: '26.52', aciklama: 'Saat imalatı' },
      { kod: '32.50', aciklama: 'Tıbbi ve optik alet imalatı' },
      { kod: '46.48', aciklama: 'Saat ve mücevherat toptan ticareti' },
      { kod: '47.77', aciklama: 'Saat ve mücevherat perakende' },
      { kod: '32.99', aciklama: 'Diğer imalat ürünleri' },
    ],
  },
  {
    id: 74, ad: 'Et Ürünleri', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Beef',
    naceKodlari: [
      { kod: '10.11', aciklama: 'Et ve et ürünleri işleme ve konservesi' },
      { kod: '10.12', aciklama: 'Kümes hayvanı eti işleme' },
      { kod: '10.13', aciklama: 'Et ve kümes hayvanı ürünleri imalatı' },
      { kod: '46.32', aciklama: 'Et ürünleri toptan ticareti' },
      { kod: '47.22', aciklama: 'Et ve et ürünleri perakende' },
    ],
  },
  {
    id: 75, ad: 'Kargo ve Depolama', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Warehouse',
    naceKodlari: [
      { kod: '49.41', aciklama: 'Kara yolu ile yük taşımacılığı' },
      { kod: '52.10', aciklama: 'Depolama ve antrepo faaliyetleri' },
      { kod: '52.24', aciklama: 'Yük taşıma acenteliği' },
      { kod: '53.10', aciklama: 'Posta faaliyetleri' },
      { kod: '53.20', aciklama: 'Kurye faaliyetleri' },
    ],
  },
  {
    id: 76, ad: 'LPG ve Gazlar', tehlikeSinifi: 1, riskProfili: 'yuksek', ikon: 'Flame',
    naceKodlari: [
      { kod: '19.20', aciklama: 'Petrol ürünleri imalatı' },
      { kod: '20.11', aciklama: 'Sanayi gazları imalatı' },
      { kod: '35.21', aciklama: 'Gaz üretimi' },
      { kod: '35.22', aciklama: 'Gaz dağıtımı' },
      { kod: '46.71', aciklama: 'Katı, sıvı ve gaz yakıt toptan' },
    ],
  },
  {
    id: 77, ad: 'Dokuma', tehlikeSinifi: 2, riskProfili: 'orta', ikon: 'Scissors',
    naceKodlari: [
      { kod: '13.11', aciklama: 'İplik eğirme' },
      { kod: '13.20', aciklama: 'Dokuma kumaş imalatı' },
      { kod: '13.91', aciklama: 'Örme ve tığ işi kumaş imalatı' },
      { kod: '13.92', aciklama: 'Hazır tekstil ürünleri imalatı' },
      { kod: '46.41', aciklama: 'Tekstil ipliği ve kumaşı toptan' },
    ],
  },
  {
    id: 78, ad: 'Hububat ve Bakliyat', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Wheat',
    naceKodlari: [
      { kod: '10.61', aciklama: 'Un ve irmik imalatı' },
      { kod: '10.62', aciklama: 'Nişasta ve nişastalı ürünler imalatı' },
      { kod: '46.21', aciklama: 'Tahıl, bakliyat, yağlı tohum toptan' },
      { kod: '46.38', aciklama: 'Diğer gıda maddeleri toptan' },
      { kod: '47.24', aciklama: 'Ekmek, pasta ve şekerleme perakende' },
    ],
  },
  {
    id: 79, ad: 'Fotoğrafçılık', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Camera',
    naceKodlari: [
      { kod: '59.11', aciklama: 'Film ve video yapım faaliyetleri' },
      { kod: '74.20', aciklama: 'Fotoğrafçılık faaliyetleri' },
      { kod: '47.78', aciklama: 'Diğer yeni eşyaların perakende ticareti' },
      { kod: '77.22', aciklama: 'Video kaset kiralama' },
      { kod: '90.03', aciklama: 'Bağımsız sanatçıların sanatsal faaliyetleri' },
    ],
  },
  {
    id: 80, ad: 'Züccaciye', tehlikeSinifi: 3, riskProfili: 'dusuk', ikon: 'Coffee',
    naceKodlari: [
      { kod: '23.41', aciklama: 'Seramik ev ve süs eşyası imalatı' },
      { kod: '32.99', aciklama: 'Diğer imalat ürünleri' },
      { kod: '46.44', aciklama: 'Cam, porselen ve temizlik ürünleri toptan' },
      { kod: '46.47', aciklama: 'Mobilya, halı ve aydınlatma ekipmanları toptan' },
      { kod: '47.59', aciklama: 'Mobilya ve ev aletleri perakende' },
    ],
  },
  {
    id: 81, ad: 'Katı Yakıt', tehlikeSinifi: 1, riskProfili: 'yuksek', ikon: 'Flame',
    naceKodlari: [
      { kod: '05.10', aciklama: 'Taş kömürü çıkarımı' },
      { kod: '05.20', aciklama: 'Linyit çıkarımı' },
      { kod: '19.10', aciklama: 'Kok fırını ürünleri imalatı' },
      { kod: '35.10', aciklama: 'Elektrik üretimi, iletimi ve dağıtımı' },
      { kod: '46.71', aciklama: 'Katı, sıvı ve gaz yakıt toptan' },
    ],
  },
]

export function getMeslekGrubuById(id: number): MeslekGrubu | undefined {
  return MESLEK_GRUPLARI.find(g => g.id === id)
}

export function getMeslekGrubuByNace(naceKodu: string): MeslekGrubu | undefined {
  return MESLEK_GRUPLARI.find(g =>
    g.naceKodlari.some(n => n.kod === naceKodu)
  )
}

export function getTehlikeRenk(sinif: TehlikeSinifi): { renk: string; bg: string; border: string; label: string } {
  if (sinif === 1) return { renk: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Sınıf 1 — Çok Tehlikeli' }
  if (sinif === 2) return { renk: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', label: 'Sınıf 2 — Tehlikeli' }
  return { renk: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', label: 'Sınıf 3 — Az Tehlikeli' }
}
