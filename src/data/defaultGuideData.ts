import { GuideArticle } from '../types';

export const DEFAULT_GUIDE_ARTICLES: GuideArticle[] = [
  // 1. Altın ve Yatırım
  {
    id: 'guide-altin-alirken-nelere-dikkat-edilmeli',
    title: 'Altın Alırken Nelere Dikkat Edilmeli?',
    slug: 'altin-alirken-nelere-dikkat-edilmeli',
    category: 'Altın ve Yatırım',
    excerpt: 'Gramaj, ayar damgası, Darphane orijinalliği ve sertifika kontrolü gibi altın alışverişinde bilinmesi gereken temel kurallar.',
    content: `Altın alışverişi hem maddi birikim hem de duygusal değer taşıyan köklü bir gelenektir. Yatırım veya takı amacıyla altın alırken aşağıdaki hususlara mutlaka dikkat edilmelidir:

1. Darphane ve Ayar Damgası Kontrolü:
Her altın takı veya sarrafiye ürününün üzerinde yasal ayar damgası (585 milyem - 14K, 750 milyem - 18K, 916 milyem - 22K veya 999.9 Has Altın) ve üretici patent damgası bulunmalıdır.

2. Fatura ve Orijinallik Sertifikası:
Güvenilir kuyumculardan aldığınız her ürün için mutlaka resmi fatura ve gramaj-ayar bilgilerini içeren garanti belgesi talep ediniz.

3. Alış-Satış Makas Farkı ve İşçilik:
Yatırım amacıyla alınan altınlarda (Cumhuriyet, Ata Lira, Gram Külçe) işçilik payı minimum düzeydedir. Bu sayede bozdururken değer kaybı yaşanmaz.

4. Tartım ve Hassas Terazi:
Satın alma anında kuyumcunuzun kalibre edilmiş hassas terazisinde gramajı gözlerinizle teyit edin. Mehmet Hamdemirci bünyesindeki tüm tartımlar Darphane onaylı hassas cihazlarla gerçekleştirilir.`,
    coverImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Altın Alırken Nelere Dikkat Edilmeli? | Bursa Altın Uzman Rehberi',
    seoDescription: 'Altın alırken dikkat edilmesi gerekenler: Ayar damgası, sertifika, gramaj ve işçilik farkları hakkında uzman sarraf tavsiyeleri.',
    featured: true,
    order: 1,
    active: true,
    readTime: '4 dk',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },
  {
    id: 'guide-hangi-altin-yatirim-icin-mantikli',
    title: 'Hangi Altın Yatırım İçin Mantıklı?',
    slug: 'hangi-altin-yatirim-icin-mantikli',
    category: 'Altın ve Yatırım',
    excerpt: 'Gram külçe mi, Cumhuriyet mi, çeyrek altın mı? Uzun ve kısa vadeli altın yatırımlarında en kazançlı seçenekler.',
    content: `Birikimlerini altında değerlendirmek isteyen yatırımcıların en çok sorduğu soru: "Hangi altını almalıyım?"

1. 24 Ayar 999.9 Has Külçe Altın:
En saf altın formudur. İşçilik maliyeti sıfıra yakındır ve uluslararası piyasalarda birebir ons değerine endekslidir. LBMA veya Borsa İstanbul akredite rafineri külçeleri (İAR, Nadir vb.) uzun vadeli yatırım için en verimli tercihtir.

2. Darphane Sarrafiyesi (Cumhuriyet & Ata Lira):
22 ayar (916 milyem) olarak T.C. Başbakanlık Hazine Müsteşarlığı Darphane ve Damga Matbaası Genel Müdürlüğü tarafından basılır. Türkiye genelinde en yüksek likiditeye sahip ürünlerdir.

3. Çeyrek ve Yarım Altın:
Küçük bütçeli düzenli tasarruflar için idealdir. Ancak gramaj başına düşen Darphane basım payı külçeye göre bir miktar daha fazladır.

4. 22 Ayar Düz Ajda veya Burma Bilezik:
Hem kolunuzda taşımak hem de yatırım yapmak istiyorsanız, işçiliği en düşük olan klasik düz Ajda ve üçlü burma bilezikler en doğru alternatiftir.`,
    coverImage: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Hangi Altın Yatırım İçin Mantıklı? Külçe vs Ziynet | Bursa Altın',
    seoDescription: 'Yatırımlık altın çeşitleri karşılaştırması: Has külçe altın, Cumhuriyet Ata Lira ve 22 ayar bilezik avantajları.',
    featured: true,
    order: 2,
    active: true,
    readTime: '5 dk',
    createdAt: '2026-08-05T11:30:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },
  {
    id: 'guide-sahte-altin-nasil-anlasilir',
    title: 'Sahte Altın Nasıl Anlaşılır?',
    slug: 'sahte-altin-nasil-anlasilir',
    category: 'Altın ve Yatırım',
    excerpt: 'Mıknatıs testi, ses yankısı, yoğunluk ölçümü ve profesyonel mihenk taşı analizleriyle sahte altını ayırt etme yolları.',
    content: `Piyasada karşılaşılan taklit veya düşük ayarlı altınları ayırt etmek için uygulanan profesyonel ve pratik yöntemler:

1. Mıknatıs Testi:
Saf altın (Au) ve yüksek ayarlı altın alaşımları kesinlikle manyetik değildir. Güçlü bir neodyum mıknatısı altının yanına getirdiğinizde en ufak bir çekilme oluyorsa ürünün içinde demir veya nikel alaşımı vardır.

2. Ses ve Tını Testi:
Gerçek altın sert bir zemine (mermer veya cam) hafifçe bırakıldığında tok ve tiz bir çınlama sesi verir. Sahte veya pirinç kaplama metaller ise boğuk ve kısa bir ses çıkarır.

3. Damga ve Kabartma İncelemesi:
Darphane basımı altınlarda Atatürk portresi, kenar tırtıkları ve tarih kabartmaları kusursuz netliktedir. Sahte altınlarda baskı silik, pürüzlü veya asimetriktir.

4. Mihenk Taşı ve Asit Testi (Kuyumcu Kontrolü):
En kesin test yöntemi uzman sarraf mihenk taşı testidir. Mehmet Hamdemirci mağazamızda getirilen tüm ürünler anında optik ve kimyasal mihenk analiziyle %100 doğrulanır.`,
    coverImage: 'https://images.unsplash.com/photo-1611591475155-426ea754ce4e?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Sahte Altın Nasıl Anlaşılır? Evde ve Sarrafta Test Yöntemleri',
    seoDescription: 'Sahte altın anlama rehberi: Mıknatıs testi, ses analizi ve sarraf mihenk taşı teknikleri.',
    featured: false,
    order: 3,
    active: true,
    readTime: '4 dk',
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },

  // 2. Ayar ve İşçilik
  {
    id: 'guide-14-ayar-mi-22-ayar-mi',
    title: '14 Ayar mı 22 Ayar mı?',
    slug: '14-ayar-mi-22-ayar-mi',
    category: 'Ayar ve İşçilik',
    excerpt: 'Kullanım amacına göre 14 ayar ile 22 ayar altın arasındaki dayanıklılık, renk tonu ve yatırım farkları.',
    content: `Altın takı seçerken en çok ikilemde kalınan konu ayar seçimidir:

• 14 Ayar Altın (585 Milyem):
İçeriğinde %58.5 saf altın ve %41.5 gümüş-bakır alaşımı bulunur. Alaşım oranı sayesinde 22 ayara göre çok daha sert ve mekanik darbelere dayanıklıdır. Günlük kullanım taşlı yüzükler, modern kolyeler ve zarif kelepçeler için biçilmiş kaftandır.

• 22 Ayar Altın (916 Milyem):
İçeriğinde %91.6 saf altın barındırır. Yoğun altın sarısı rengi ve yüksek saflığıyla geleneksel Türk düğün takılarının ve yatırım bileziklerinin vazgeçilmezidir.

Özet Karar Rehberi:
- Günlük ve taşlı modern takılar için: 14 Ayar
- Geleneksel takı, düğün hediyesi ve yatırım için: 22 Ayar`,
    coverImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    seoTitle: '14 Ayar mı 22 Ayar mı? Hangisi Tercih Edilmeli? | Bursa Altın',
    seoDescription: '14 ayar ve 22 ayar altın farkları: Sertlik, renk, yatırım değeri ve kullanım kolaylığı analizi.',
    featured: true,
    order: 4,
    active: true,
    readTime: '3 dk',
    createdAt: '2026-08-12T14:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },
  {
    id: 'guide-iscilik-nedir',
    title: 'İşçilik Nedir?',
    slug: 'iscilik-nedir',
    category: 'Ayar ve İşçilik',
    excerpt: 'Altın takılarda işçilik maliyeti nasıl hesaplanır? Bozdururken işçilik neden düşer?',
    content: `İşçilik, külçe veya ham altının usta zanaatkarlar ve ileri teknoloji kalıplar tarafından işlenerek estetik bir takıya dönüştürülmesi aşamasındaki emek, tasarım ve üretim maliyetidir.

1. İşçilik Türleri:
- Döküm & Pres İşçilik: Seri üretim kalıplarla üretilir, maliyeti düşüktür.
- Telkari & El Örmesi: Saatler süren el emeği gerektirir.
- Taş Mıhlama & Mineleme: Pırlanta ve değerli taşların el ile mikroskop altında yerleştirilmesidir.

2. Bozdururken Neden Düşer?
Bir takıyı satmak istediğinizde, kuyumcu o takıyı eritilmek üzere hurda/has altın olarak kabul eder. Takının üzerindeki işçilik eritme ocağında yok olacağı için yalnızca içerdiği saf altın gramajı üzerinden ödeme yapılır.`,
    coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Altında İşçilik Nedir? Nasıl Hesaplanır? | Mehmet Hamdemirci',
    seoDescription: 'Altın takılarda işçilik maliyeti nedir, bozdururken ne kadar kesilir? Detaylı rehber.',
    featured: false,
    order: 5,
    active: true,
    readTime: '3 dk',
    createdAt: '2026-08-15T16:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },
  {
    id: 'guide-altin-neden-alis-ve-satista-farkli',
    title: 'Altın Neden Alış ve Satışta Farklı?',
    slug: 'altin-neden-alis-ve-satista-farkli',
    category: 'Ayar ve İşçilik',
    excerpt: 'Serbest piyasa makas aralığı (spread), rafineri maliyetleri ve döviz kuru etkileri hakkında bilmeniz gerekenler.',
    content: `Finansal piyasalarda ve Kapalıçarşı sarrafiyesinde altının "Alış" ve "Satış" fiyatları arasında her zaman belirli bir fark (makas / spread) bulunur.

Bunun temel nedenleri:
1. Likidite ve Risk Yönetimi:
Sarraf veya kuyumcu altını aldığında piyasadaki ani fiyat dalgalanmalarına karşı pozisyon riskini yönetmek zorundadır.

2. Rafineri ve Geri Dönüşüm Maliyeti:
Satılan takıların rafineriye gönderilerek tekrar 999.9 has külçeye dönüştürülmesi belirli bir enerji ve asit saflaştırma maliyeti içerir.

3. Darphane ve Lojistik:
Özellikle çeyrek ve Cumhuriyet altınlarında Darphane'den çıkış masrafları ve sigortalı zırhlı kargo transfer bedelleri fiyata yansır.`,
    coverImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Altın Alış Satış Makası Neden Oluşur? | Bursa Altın',
    seoDescription: 'Kuyumcularda ve serbest piyasada altın alış satış fiyat farkı nedenleri.',
    featured: false,
    order: 6,
    active: true,
    readTime: '3 dk',
    createdAt: '2026-08-16T12:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },

  // 3. Pırlanta ve Takı Seçimi
  {
    id: 'guide-pirlantada-4c-nedir',
    title: 'Pırlanta Alırken 4C Nedir?',
    slug: 'pirlanta-4c-nedir',
    category: 'Pırlanta ve Takı Seçimi',
    excerpt: 'Carat (Karat), Cut (Kesim), Color (Renk) ve Clarity (Berraklık) standartları ve uluslararası sertifika kuralları.',
    content: `Doğanın milyonlarca yılda oluşturduğu en değerli taş olan pırlantanın kalitesi ve fiyatı dünya çapında kabul gören 4C kuralıyla belirlenir:

1. Carat (Karat - Ağırlık):
Pırlantanın ağırlık birimidir. 1 karat tam olarak 0.20 grama eşittir. Karat arttıkça taşın nadirliği ve dolayısıyla değeri geometrik olarak yükselir.

2. Cut (Kesim):
4C içinde insan elinin ve ustalığının dokunduğu tek kriterdir. Kusursuz (Excellent) bir kesim, taşa giren ışığın tamamını yansıtarak göz alıcı bir parlaklık ve ateş (fire) saçmasını sağlar.

3. Color (Renk):
D harfinden (en renksiz ve en nadir) Z harfine (belirgin sarı ton) kadar sıralanır. D, E, F ekstra beyaz; G, H nadir beyaz kategorisindedir.

4. Clarity (Berraklık):
Taşın içindeki doğal kristalleşme izlerini (inklüzyon) ifade eder. FL (Lekesiz), VVS (Çok Çok Küçük Lekeli), VS (Çok Küçük Lekeli) ve SI (Küçük Lekeli) olarak sınıflandırılır.

Mehmet Hamdemirci güvencesiyle tüm pırlantalarımız uluslararası HRD Antwerp veya GIA sertifikalarıyla teslim edilir.`,
    coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Pırlantada 4C Kuralı Nedir? | GIA & HRD Standartları',
    seoDescription: 'Pırlanta seçiminde 4C nedir? Karat, renk, berraklık ve kesim hakkında eksiksiz rehber.',
    featured: true,
    order: 7,
    active: true,
    readTime: '6 dk',
    createdAt: '2026-08-18T10:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },
  {
    id: 'guide-alyans-nasil-secilir',
    title: 'Alyans Nasıl Seçilir?',
    slug: 'alyans-nasil-secilir',
    category: 'Pırlanta ve Takı Seçimi',
    excerpt: 'Ömür boyu parmağınızda taşıyacağınız evlilik alyansında konfor bombesi, parmak ölçüsü ve altın ayarı rehberi.',
    content: `Evliliğin ve bağlılığın en kutsal simgesi olan alyans seçiminde dikkat edilmesi gereken püf noktaları:

1. Konfor Bombesi (Comfort Fit):
Alyansın iç kısmının hafif kavisli olması parmağı sıkmasını ve terletmesini engeller. Gün boyu kullanım için mutlaka içi bombeli modelleri tercih edin.

2. Genişlik ve Kalınlık:
İnce parmaklar için 3-4 mm genişlik zarif dururken, dolgun parmaklar için 5-7 mm genişlik ideal bir denge sağlar.

3. Çift Uyumu:
Erkek ve kadın alyanslarında birebir aynı model şart değildir; aynı renk tonunda (örneğin rose gold veya klasik sarı altın) uyumlu temalar seçilebilir.`,
    coverImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Alyans Seçimi Nasıl Yapılır? Evlilik Alyansı Rehberi',
    seoDescription: 'Doğru alyans seçimi: Konfor bombesi, altın rengi, ölçü alma ve dayanıklılık ipuçları.',
    featured: false,
    order: 8,
    active: true,
    readTime: '4 dk',
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },
  {
    id: 'guide-tektas-alirken-nelere-bakilir',
    title: 'Tektaş Alırken Nelere Bakılır?',
    slug: 'tektas-alirken-nelere-bakilir',
    category: 'Pırlanta ve Takı Seçimi',
    excerpt: 'Evlilik teklifinin başrolü tektaş pırlantada bütçeye göre en ideal karat, renk ve montür dengesi.',
    content: `Evlilik teklifinin en heyecan verici adımı olan tektaş pırlanta seçiminde doğru karar vermek için şu adımları izleyin:

1. Sertifika Güvencesi:
Her pırlanta tektaşın uluslararası (HRD/GIA) veya üretici güvence sertifikası bulunmalıdır.

2. Karat vs. Renk Dengesi:
Eğer bütçeniz kısıtlıysa F-G renginde ve SI1 berraklığında bir taş tercih ederek daha büyük bir karat görünümü elde edebilirsiniz. Pırlantanın parlaklığını belirleyen en önemli faktör kesim (Cut) kalitesidir.

3. Montür Tırnak Yapısı:
Klasik 6 tırnaklı montürler taşı yüksekte tutarak maksimum ışık almasını sağlarken, 4 tırnaklı montürler daha modern bir geometri sunar.`,
    coverImage: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Tektaş Yüzük Alırken Nelere Dikkat Edilmeli? | Bursa Altın',
    seoDescription: 'Tektaş pırlanta seçiminde püf noktalar: Karat, montür tasarımı ve sertifika önemi.',
    featured: true,
    order: 9,
    active: true,
    readTime: '5 dk',
    createdAt: '2026-08-22T13:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },

  // 4. Bozdurma ve Değerleme
  {
    id: 'guide-altin-bozdururken-ne-kadar-kaybedilir',
    title: 'Altın Bozdururken Ne Kadar Kaybedilir?',
    slug: 'altin-bozdururken-ne-kadar-kaybedilir',
    category: 'Bozdurma ve Değerleme',
    excerpt: 'Takı ve sarrafiye ürünlerini nakde çevirirken veya yenilerken meydana gelen değer değişimleri ve tasarruf tüyoları.',
    content: `Altınlarınızı nakde çevirirken veya takas ederken minimum değer kaybı yaşamanız için bilmeniz gerekenler:

1. Sarrafiye Ürünlerinde Değer Kaybı:
Gram külçe, Çeyrek ve Cumhuriyet altınlarında değer kaybı neredeyse sıfırdır; yalnızca o anki serbest piyasa alış-satış makası (ortalama %0.5 - %1.5) fark eder.

2. 22 Ayar Düz Takılarda Değer Kaybı:
Düz Ajda ve burma bileziklerde işçilik çok az olduğu için bozdururken kayıp %2 ile %5 arasında kalır.

3. Taşlı ve İşçilikli Takılarda Değer Kaybı:
Taşlı kolyeler veya fantezi setlerde taş ağırlığı düşülür ve saf altın gramajı hesaplanır. Bu sebeple işçilikli takıları nakit satmak yerine "Altın Takas / Takını Değiştir" seçeneğiyle değerlendirmek çok daha karlı bir yaklaşımdır.`,
    coverImage: 'https://images.unsplash.com/photo-1611591475155-426ea754ce4e?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Altın Bozdururken Değer Kaybı Nasıl Hesaplanır? | Bursa Altın',
    seoDescription: 'Altın bozdurma ve takas rehberi: Değer kaybını en aza indirme yolları.',
    featured: false,
    order: 10,
    active: true,
    readTime: '4 dk',
    createdAt: '2026-08-24T15:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },

  // 5. Bursa Rehberi
  {
    id: 'guide-bursada-altin-alisveris-rehberi',
    title: 'Bursa’da Altın Alışveriş Rehberi',
    slug: 'bursada-altin-alisveris-rehberi',
    category: 'Bursa Rehberi',
    excerpt: 'Tarihi Bursa Kapalıçarşı Bedesten kültürü, sarraflar çarşısı ve güvenilir kuyumcu seçimi hakkında yerel rehber.',
    content: `Osmanlı'nın ilk başkenti Bursa, asırlardır ipek ve sarraflık zanaatının kalbidir.

1. Tarihi Kapalıçarşı ve Bedesten Geleneği:
Bursa Kapalıçarşı, yüzyıllardır kuşaktan kuşağa aktarılan dürüst esnaflık ve kuyumculuk ahlakıyla tanınır. Mehmet Hamdemirci olarak 1984 yılından bu yana Tarihi Bedesten No: 16 adresinde bu köklü mirası yaşatıyoruz.

2. Canlı Fiyatlar ve Şeffaflık:
Bursa piyasasında altın alırken canlı ekran fiyatlarını takip etmek ve net gramaj üzerinden şeffaf faturalandırma almak en temel tüketici hakkınızdır.

3. Mağaza Deneyimi & VIP Ağırlama:
Düğün seti, nişan alışverişi veya yatırım danışmanlığı için mağazamızı ziyaret ettiğinizde geleneksel Bursa misafirperverliği eşliğinde güvenle alışveriş yapabilirsiniz.`,
    coverImage: 'https://images.unsplash.com/photo-1548625361-19597793d56b?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Bursa Altın Alışveriş Rehberi | Tarihi Kapalıçarşı Bedesten',
    seoDescription: 'Bursa Kapalıçarşı sarraflık geleneği, altın alışverişi ve Mehmet Hamdemirci mağaza rehberi.',
    featured: true,
    order: 11,
    active: true,
    readTime: '5 dk',
    createdAt: '2026-08-26T10:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z',
  },
];
