export interface GoldPrice {
  id: string;
  name: string;
  code: string;
  buying: number;
  selling: number;
  change: number; // percentage change e.g. +0.42
  high24h: number;
  low24h: number;
  updatedAt: string;
  category: 'has' | 'ziynet' | 'bilezik' | 'ons';
  unit: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
  };
  imageUrl: string;
  tags: string[];
}

export interface ProductSpec {
  goldColor: string; // e.g. 'Sarı Altın', 'Beyaz Altın', 'Rose Gold', 'Çift Renk'
  purity: string; // e.g. '916 Milyem (22 Ayar)', '585 Milyem (14 Ayar)', '999.9 Has Altın'
  weight: string; // e.g. '18.45 gr'
  stoneType?: string; // e.g. 'Doğal Pırlanta', 'Kolombiya Zümrüt', 'Baget Pırlanta', 'Yok'
  stoneCarat?: string; // e.g. '0.65 Karat'
  stoneClarity?: string; // e.g. 'VS1 / F Renk'
  stoneColor?: string; // e.g. 'F', 'G', 'D'
  certificate: string; // e.g. 'Bursa Altın & Mehmet Hamdemirci Orijinallik Sertifikası (GIA/HRD)'
  warranty: string; // e.g. 'Ömür Boyu Ücretsiz Bakım & Ayar Garantisi'
  dimensions?: string; // e.g. 'Çap: 6.2 cm / Genişlik: 18 mm'
}

export interface CollectionItem {
  id: string;
  title: string;
  category: 'bilezik' | 'pirlanta' | 'ozel-tasarim' | 'kulce-ziynet' | 'kolye';
  categoryLabel: string;
  karat: string;
  description: string;
  highlights: string[];
  estimatedLaunch: string;
  imageUrl: string;
  isExclusive?: boolean;
}

export interface Category {
  id: string;
  label: string;
  count?: number;
}

export interface CustomCategory {
  id: string;
  name: string;
  icon?: string;
  order?: number;
}

export interface Product {
  id: string;
  title: string;
  code: string;
  category: string;
  categoryLabel: string;
  subCategory?: string; // e.g. 'tektas', 'baget', 'bestas', 'ajda', 'burma', 'hasir', 'kelepce', 'kulce', 'sarrafiye', 'tugrali', 'dorika', 'kaburga'
  subCategoryLabel?: string;
  karat: string;
  karatCode?: '8K' | '14K' | '18K' | '22K' | '24K' | string;
  weightGrams: number;
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isHandcrafted?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  inStock: boolean;
  goldColor?: 'sari' | 'beyaz' | 'rose' | string;
  stoneType?: 'pirlanta' | 'zirkon' | 'tassiz' | string;
  images: string[];
  thumbnailUrl: string;
  description: string;
  highlights: string[];
  specs: ProductSpec;
  tags: string[];
  createdAt?: string; // e.g. "2026-08-22"
  likesCount?: number;
}

export interface CatalogFilterState {
  category: string;
  subCategory?: string;
  karat: string;
  dateFilter: 'all' | 'last-7-days' | 'last-30-days' | 'this-year';
  priceRange: [number, number];
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'weight-desc' | 'newest' | 'oldest' | 'most-liked';
  inStockOnly: boolean;
  handcraftedOnly: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface AppointmentRequest {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  serviceType: 'ozel-tasarim' | 'alyans-tektaş' | 'yatirim-danismanligi' | 'vip-agirlama';
  notes?: string;
}

export interface WaitlistSubscriber {
  email: string;
  phone?: string;
  fullName?: string;
  interests?: string[];
  subscribedAt: string;
}

export interface StoryFeatureConfig {
  title: string;
  badge: string;
  imageUrl: string;
  displayType: 'image' | 'icon';
  isEnabled: boolean;
}

export interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  discountBadge?: string;
  ctaText: string;
  category: string;
  targetUrl?: string; // Herhangi bir kategori, tab, sayfa, rehber veya özel URL yönlendirmesi
  bgImage: string;
  mobileBgImage?: string; // Mobil cihazlar için özel optimize görsel
  primaryColor?: string;
  isEnabled?: boolean;
  order?: number;
}

export interface HeroSideCard {
  tag: string;
  title: string;
  subtitle: string;
  productId?: string;
  targetUrl?: string; // Özel link veya hedef yönlendirme
  imageUrl?: string;
  mobileImageUrl?: string;
  customPrice?: number;
  originalPrice?: number;
  buttonText?: string;
  badgeType?: 'deal' | 'investment' | 'custom';
  isEnabled?: boolean;
}

export interface HeroSectionConfig {
  slides: HeroSlide[];
  dealCard: HeroSideCard;
  investmentCard: HeroSideCard;
}

export interface PromoBannerItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  mobileImageUrl?: string;
  categoryKey?: string;
  appointmentPrefill?: string;
  actionType: 'category' | 'appointment' | 'link';
  targetUrl?: string; // Özel link yönlendirmesi
  bgColorGradient?: string;
  accentColor?: string;
  isEnabled: boolean;
  order: number;
}

export interface CategoryShowcaseItem {
  id: string;
  title: string;
  description: string;
  count: string;
  image: string;
  mobileImage?: string;
  tag: string;
  targetUrl?: string; // Özel kategori veya hedef bağlantı
  isEnabled: boolean;
  order: number;
}

export interface SiteVisualContent {
  hero: HeroSectionConfig;
  promos: PromoBannerItem[];
  categoryCards: CategoryShowcaseItem[];
}

// ------------------- NAVIGATION & MEGA MENU TYPES -------------------
export interface NavigationItem {
  id: string;
  label: string;
  slug: string;
  link: string; // e.g. "/kategori/altin-yuzuk" or action keyword
  order: number;
  active: boolean;
  badge?: string;
  icon?: string;
}

export interface NavigationColumn {
  id: string;
  title: string;
  order: number;
  active: boolean;
  items: NavigationItem[];
}

export interface NavigationGroup {
  id: string;
  label: string;
  slug: string;
  order: number;
  active: boolean;
  displayType: 'megamenu' | 'link' | 'dropdown';
  columns: NavigationColumn[];
  featuredImage?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
  featuredLink?: string; // Tıklanınca gidilecek kategori, sayfa veya özel link
}

// ------------------- ALTIN REHBERİ (KNOWLEDGE HUB) TYPES -------------------
export interface GuideArticle {
  id: string;
  title: string;
  slug: string;
  category: 'Altın ve Yatırım' | 'Ayar ve İşçilik' | 'Pırlanta ve Takı Seçimi' | 'Bozdurma ve Değerleme' | 'Bursa Rehberi' | string;
  excerpt: string;
  content: string; // Markdown or rich text
  coverImage: string;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  order: number;
  active: boolean;
  readTime?: string;
  createdAt: string;
  updatedAt: string;
}

// ------------------- ALTININI GETİR & CONTENT PAGES TYPES -------------------
export interface AltininiGetirServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  order: number;
  active: boolean;
}

export interface AltininiGetirConfig {
  title: string;
  description: string;
  coverImage: string;
  services: AltininiGetirServiceItem[];
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  whatsappNumber: string;
  whatsappMessage: string;
  seoTitle?: string;
  seoDescription?: string;
  scrapGoldInfoTitle?: string;
  scrapGoldInfoContent?: string;
  active: boolean;
  updatedAt: string;
}

export interface ContentPageSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ContentPage {
  id: string;
  pageType: 'altinini-getir' | 'hakkimizda' | 'magazamiz' | 'neden-bursa-altin' | 'musteri-yorumlari' | 'sss' | 'iletisim' | 'custom';
  title: string;
  slug: string;
  description: string;
  heroImage?: string;
  sections?: ContentPageSection[];
  active: boolean;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

// ------------------- FOOTER & TOP BAR TYPES -------------------
export interface FooterLink {
  id: string;
  label: string;
  link: string;
  group: 'koleksiyonlar' | 'kurumsal' | 'musteri-rehberi' | 'guvenlik' | string;
  order: number;
  active: boolean;
}

export interface TopBarConfig {
  tickerText: string;
  tickerLink?: string;
  goldRatesLinkText: string;
  goldRatesLinkUrl: string;
  goldRatesVisible: boolean;
  storeLocationText: string;
  whatsappButtonText: string;
  active: boolean;
}

export interface MarketingAdsConfig {
  // Google Ads (Sitenin Reklamını Yapma & Dönüşüm Takibi)
  googleAdsId: string; // e.g. "AW-123456789"
  googleAdsConversionLabel: string; // e.g. "AbCdEfGhIjKlMnOpQr"
  googleAdsEnabled: boolean;

  // Google AdSense (Siteye Reklam Alma & Gelir Elde Etme)
  adSensePublisherId: string; // e.g. "ca-pub-1234567890123456"
  adSenseEnabled: boolean;
  adSenseAutoAds: boolean;
  adSenseBannerInRates: boolean;
  adSenseBannerInBlog: boolean;
  adSenseBannerInHeroSide?: boolean; // Anasayfa vitrin yanı Google Reklam alanı
  adSenseHeroSideSlotId?: string; // İsteğe bağlı özel AdSense Reklam Birimi ID

  // Meta Pixel (İsteğe bağlı Facebook/Instagram reklamları)
  metaPixelId?: string;
  metaPixelEnabled?: boolean;
}


