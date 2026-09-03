import { GoldPrice, BlogPost, CollectionItem } from '../types';

export const INITIAL_GOLD_PRICES: GoldPrice[] = [
  {
    id: 'gram-has',
    name: 'Gram Has Altın (24 Ayar)',
    code: 'HAS/TRY',
    buying: 3180.45,
    selling: 3205.80,
    change: 0.65,
    high24h: 3218.00,
    low24h: 3165.20,
    updatedAt: 'Az önce güncellendi',
    category: 'has',
    unit: '₺/gr'
  },
  {
    id: 'bilezik-22',
    name: '22 Ayar Bilezik',
    code: '22K/TRY',
    buying: 2915.20,
    selling: 3040.50,
    change: 0.58,
    high24h: 3055.00,
    low24h: 2900.00,
    updatedAt: 'Az önce güncellendi',
    category: 'bilezik',
    unit: '₺/gr'
  },
  {
    id: 'ceyrek-altin',
    name: 'Çeyrek Altın (Yeni)',
    code: 'CEYREK',
    buying: 5210.00,
    selling: 5320.00,
    change: 0.72,
    high24h: 5350.00,
    low24h: 5180.00,
    updatedAt: 'Az önce güncellendi',
    category: 'ziynet',
    unit: '₺/adet'
  },
  {
    id: 'yarim-altin',
    name: 'Yarım Altın',
    code: 'YARIM',
    buying: 10420.00,
    selling: 10640.00,
    change: 0.70,
    high24h: 10700.00,
    low24h: 10350.00,
    updatedAt: 'Az önce güncellendi',
    category: 'ziynet',
    unit: '₺/adet'
  },
  {
    id: 'tam-ziynet',
    name: 'Tam Ziynet Altın',
    code: 'TAM',
    buying: 20840.00,
    selling: 21280.00,
    change: 0.68,
    high24h: 21350.00,
    low24h: 20700.00,
    updatedAt: 'Az önce güncellendi',
    category: 'ziynet',
    unit: '₺/adet'
  },
  {
    id: 'ata-lira',
    name: 'Cumhuriyet Ata Lira',
    code: 'ATA',
    buying: 21450.00,
    selling: 21850.00,
    change: 0.81,
    high24h: 21920.00,
    low24h: 21300.00,
    updatedAt: 'Az önce güncellendi',
    category: 'ziynet',
    unit: '₺/adet'
  },
  {
    id: 'ons-altin',
    name: 'Ons Altın ($)',
    code: 'XAU/USD',
    buying: 2885.60,
    selling: 2886.90,
    change: 0.44,
    high24h: 2898.10,
    low24h: 2868.40,
    updatedAt: 'Az önce güncellendi',
    category: 'ons',
    unit: '$/ons'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Altın Yatırımında 2026 Trendleri ve Güvenli Liman Stratejileri',
    slug: 'altin-yatiriminda-2026-trendleri',
    excerpt: 'Küresel finans piyasalarında dalgalanmalar sürerken, has altın ve fiziki külçe alımlarında dikkat edilmesi gereken temel prensipler.',
    category: 'Yatırım Rehberi',
    readTime: '4 dk okuma',
    date: '24 Ağustos 2026',
    author: {
      name: 'Mehmet Hamdemirci',
      role: 'Kuyumculuk & Yatırım Uzmanı'
    },
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Has Altın', 'Yatırım', 'Kapalıçarşı', 'Külçe Altın'],
    content: [
      'Altın, yüzyıllardır servetin korunmasında ve gelecek nesillere aktarılmasında en sarsılmaz güven simgesi olmuştur. Bursa Kapalıçarşı geleneğimizde altın yalnızca bir ziynet değil, nesiller arası güven bağıdır.',
      '2026 yılı itibarıyla merkez bankalarının rezerv artışları ve jeopolitik gelişmeler, fiziki altın talebini yeni zirvelere taşımaktadır. Yatırımcıların özellikle işçiliksiz 24 ayar has külçe ve tescilli darphane ziynetlerini portföylerinde bulundurmaları tavsiye edilir.',
      'Bursa Altın olarak sunduğumuz her külçe ve ziynet ürünü, uluslararası sertifikasyon ve Mehmet Hamdemirci Kuyumculuk tam güvencesiyle müşterilerimize ulaştırılmaktadır.'
    ]
  },
  {
    id: '2',
    title: 'Bursa\'nın Tarihi Kuyumculuk Geleneği ve Kapalıçarşı Mirası',
    slug: 'bursanin-tarihi-kuyumculuk-gelenegi',
    excerpt: 'İpek Yolu\'nun kalbi Bursa\'da şekillenen asırlık sarraf kültürü, el yapımı hasır bilezikler ve usta-çırak aktarımı.',
    category: 'Tarih & Zanaat',
    readTime: '6 dk okuma',
    date: '18 Ağustos 2026',
    author: {
      name: 'Bursa Altın Araştırma',
      role: 'Sanat Tarihi & Miras Masası'
    },
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=80',
    tags: ['Bursa Mirası', 'El İşçiliği', 'Kapalıçarşı', 'Zanaat'],
    content: [
      'Bursa Kapalıçarşı ve Tarihi Bedesten, Osmanlı döneminden bu yana Doğu ile Batı arasındaki değerli maden ticaretinin ve yüksek zanaatın merkezi olmuştur.',
      'Usta ellerde ilmek ilmek dokunan altın hasırlar, kakma ve mine motifleri, her bir takıya ruhunu veren özenli dokunuşların ürünüdür. Mehmet Hamdemirci Kuyumculuk olarak, bu kadim mirası çağdaş tasarım vizyonuyla harmanlayarak Bursa Altın kimliğinde geleceğe taşıyoruz.',
      'Modern çağın seri üretim tekdüzeliğine karşı, her bir tasarımımızda usta elinin sıcaklığını ve asırlık zarafet disiplinini muhafaza ediyoruz.'
    ]
  },
  {
    id: '3',
    title: 'Pırlanta ve Değerli Taşlarda Kusursuzluk: 4C Standardı ve Özel Kesimler',
    slug: 'pirlantada-4c-standardi-ve-ozel-kesimler',
    excerpt: 'Karat (Carat), Renk (Color), Berraklık (Clarity) ve Kesim (Cut): Mükemmel tektaş veya baget pırlantayı seçerken bilmeniz gereken tüm sırlar.',
    category: 'Mücevher Rehberi',
    readTime: '5 dk okuma',
    date: '10 Ağustos 2026',
    author: {
      name: 'Gamze Demirci',
      role: 'Gemolog & Baş Tasarımcı'
    },
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Pırlanta', '4C Kuralı', 'Tektaş', 'Mücevher'],
    content: [
      'Her pırlanta doğanın milyonlarca yıllık eşsiz bir mucizesidir. Ancak onu göz alıcı bir ışık şölenine dönüştüren unsur, ustanın uyguladığı kusursuz faset kesimidir.',
      'GIA ve HRD uluslararası sertifikalı taşlarımız, ışığı en yüksek yansıtma oranına (Triple Excellent kesim standardı) sahip olacak biçimde titizlikle seçilir.',
      'Özel evlilik teklifleri, yıldönümleri veya kendinize sunacağınız kalıcı bir hatıra için atölyemizde kişiye özel 3D modelleme ve montür işleme hizmeti sunmaktayız.'
    ]
  },
  {
    id: '4',
    title: '22 Ayar ve 24 Ayar Altın Arasındaki Farklar & Evde Doğru Bakım',
    slug: '22-ve-24-ayar-altin-farklari-bakim-rehberi',
    excerpt: 'Mücevherlerinizin ilk günkü ışıltısını koruması için profesyonel temizleme ve saklama önerileri.',
    category: 'Mücevher Rehberi',
    readTime: '3 dk okuma',
    date: '02 Ağustos 2026',
    author: {
      name: 'Mehmet Hamdemirci',
      role: 'Kuyumculuk & Yatırım Uzmanı'
    },
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    tags: ['Altın Bakımı', '22 Ayar', '24 Ayar', 'Pratik Bilgiler'],
    content: [
      '24 ayar altın %99.9 saflıkta olup yumuşak yapısı gereği genellikle külçe ve gram yatırım altınlarında kullanılır. 22 ayar ise %91.6 saflık oranıyla hem yatırım hem de dayanıklı bilezik/takı formları için ideal dengedir.',
      'Mücevherlerinizi parfüm, klor ve deterjan gibi kimyasallardan korumak, yumuşak mikrofiber bezle periyodik olarak temizlemek parlaklığını muhafaza eder.',
      'Bursa Altın mağazamızda tüm müşterilerimize ömür boyu ücretsiz ultrasonik parlatma ve bakım hizmeti sağlanmaktadır.'
    ]
  }
];

export const SNEAK_PEEK_COLLECTION: CollectionItem[] = [
  {
    id: 'c1',
    title: 'Bursa Kapalıçarşı Hasır Kelepçe',
    category: 'bilezik',
    categoryLabel: 'Geleneksel Ustalık',
    karat: '22 Ayar Altın',
    description: 'Elde örülen 12 sıra hasır örgüsü ve geometrik kilit tokasıyla Bursa kuyumculuk geleneğinin zirvesi.',
    highlights: ['Tamamen el örgüsü', 'Özel kilit mekanizması', 'Sertifikalı orijinallik'],
    estimatedLaunch: 'Sonbahar 2026',
    imageUrl: 'https://images.unsplash.com/photo-1611591475155-426ea754ce4e?auto=format&fit=crop&w=800&q=80',
    isExclusive: true
  },
  {
    id: 'c2',
    title: 'Aura Solitaire Pırlanta Kolye & Yüzük',
    category: 'pirlanta',
    categoryLabel: 'Pırlanta Koleksiyonu',
    karat: '18 Ayar Beyaz & Sarı Altın',
    description: '0.85 Karat F-VVS1 pırlantanın etrafında mikro-fasetli ışık halesi. Zamansız zarafet.',
    highlights: ['HRD / GIA Sertifikalı', 'F Renk, VVS1 Berraklık', 'Özel kadife kutusunda'],
    estimatedLaunch: 'Lansman Özel',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    isExclusive: true
  },
  {
    id: 'c3',
    title: 'Sultanahmet & Uludağ Rölyef Külçe Serisi',
    category: 'kulce-ziynet',
    categoryLabel: 'Yatırımlık Külçe',
    karat: '24 Ayar (999.9 Has)',
    description: 'Koleksiyon değeri taşıyan numaralı hologramlı 10gr, 20gr, 50gr ve 100gr tescilli has altın külçeleri.',
    highlights: ['Güvenlik hologramı', 'Seri numaralı ambalaj', 'Sıfır işçilik kaybı'],
    estimatedLaunch: 'Hemen Ön Sipariş',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'c4',
    title: 'Geometrik Baget & Zümrüt Gerdanlık',
    category: 'ozel-tasarim',
    categoryLabel: 'Haute Joaillerie',
    karat: '18 Ayar Sarı Altın & Kolombiya Zümrüdü',
    description: 'Modern çizgilerin doğal zümrüt ve baget pırlantalarla kusursuz uyumu. Tek adet üretilmiştir.',
    highlights: ['Doğal Kolombiya Zümrütü', 'Özel atölye üretimi', 'Unik numaralandırma'],
    estimatedLaunch: 'Özel Seri',
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
    isExclusive: true
  }
];

export const MANIFESTO_TEXT = {
  quote: "Altın sadece maden değildir; bir ailenin emeği, bir aşkın yemini, bir geleceğin güvencesidir.",
  author: "Mehmet Hamdemirci",
  title: "Bursa Altın Bir Mehmet Hamdemirci Kuyumculuk Markasıdır",
  paragraphs: [
    "Bursa'nın tarihi taş sokaklarında, çekiç seslerinin ve eritme potalarının sıcaklığında başlayan yolculuğumuz; 30 yılı aşkın süredir dürüstlük, yüksek zanaatkarlık ve şaşmaz bir güven temeli üzerinde yükselmektedir.",
    "Bizim için her mücevher, müşterimizin hayatındaki en kıymetli dönüm noktalarının sessiz tanığıdır. Bir evlilik teklifinin heyecanında, bir evladın doğumundaki bereket duasında ya da geleceğe aktarılan birikimlerde yer almanın sorumluluğunu taşırız.",
    "Bursa Altın, bu köklü mirası dijital çağın şeffaflığı ve modern estetik anlayışıyla buluşturmak amacıyla kuruldu. Kapalıçarşı'nın samimi güvenini, dünya standartlarında tasarımlar ve şeffaf fiyatlandırma politikasıyla taçlandırıyoruz.",
    "Yeni deneyimimizle çok yakında sizlerle olmanın gururunu yaşıyoruz. Zarafetin, kalitenin ve güvenin adresinde buluşmak dileğiyle."
  ],
  pillars: [
    {
      title: "Kusursuz Ayar Güvencesi",
      desc: "Ürünlerimizin her biri darphane ve laboratuvar onaylı ayar damgalarıyla mühürlenir."
    },
    {
      title: "Usta Eli & Zanaat",
      desc: "Seri üretimin soğukluğuna inat, takılarımıza ruhunu veren usta el işçiliğini yaşatıyoruz."
    },
    {
      title: "Ömür Boyu Destek",
      desc: "Satın aldığınız her Bursa Altın ürünü için bakım, parlatma ve değerinde geri alım garantisi sunuyoruz."
    },
    {
      title: "Şeffaf Piyasa Fiyatı",
      desc: "Canlı piyasa kurlarını doğrudan yansıtan şeffaf ve adil kuyumculuk anlayışı."
    }
  ]
};

export const CONTACT_INFO = {
  whatsapp: '0534 747 87 73',
  whatsappRaw: '905347478773',
  phone: '(0224) 223 65 66',
  phoneRaw: '+902242236566',
  address: 'Ulucami doğusu kapalı çarşı girişi no:17 Bursa / Türkiye',
  hours: 'Pazartesi - Cumartesi: 09:00 - 19:30',
  instagram: 'https://instagram.com/bursaaltin',
  facebook: 'https://facebook.com/bursaaltin'
};
