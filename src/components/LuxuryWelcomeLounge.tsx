import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { Product } from '../types';
import { PRODUCTS_CATALOG } from '../data/productsData';
import { CONTACT_INFO, INITIAL_GOLD_PRICES } from '../data/mockData';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gem,
  TrendingUp,
  Calendar,
  MessageSquare,
  Scale,
  Compass,
  ChevronLeft,
  ChevronRight,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  Award
} from 'lucide-react';

interface WelcomeSlide {
  id: string;
  categoryKey: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlightSpecs: string[];
  imageUrl: string;
  featuredProductId: string;
  ctaText: string;
  secondaryCtaText: string;
}

const WELCOME_SLIDES: WelcomeSlide[] = [
  {
    id: 'slide-hasir',
    categoryKey: 'bilezik',
    badge: 'Kapalıçarşı Başyapıtı • 22 Ayar',
    title: 'Bursa 22 Ayar Hasır & Kelepçe Sanatı',
    subtitle: 'Nesilden Nesile Aktarılan Usta El Örgüsü',
    description: 'Tarihi Bursa Kapalıçarşı atölyelerimizde 30 yıllık sarraf titizliğiyle, her ilmeği elle dokunan 22 ayar prestij kelepçeler ve düğün setleri.',
    highlightSpecs: ['916 Milyem Darphane Damgalı', 'Özel Kilit Mekanizması', 'Ömür Boyu Bakım Garantisi'],
    imageUrl: 'https://images.unsplash.com/photo-1611591475155-426ea754ce4e?auto=format&fit=crop&w=1200&q=80',
    featuredProductId: 'prod-1',
    ctaText: 'Hasır Vitrinini İncele',
    secondaryCtaText: 'WhatsApp ile Fiyat Sor'
  },
  {
    id: 'slide-pirlanta',
    categoryKey: 'yuzuk',
    badge: 'Uluslararası Sertifikalı • Haute Joaillerie',
    title: 'Pırlanta & Tektaş Koleksiyonu',
    subtitle: 'HRD & GIA Sertifikalı Kusursuz Işıltı',
    description: 'F ve D renk nadir taşlar, mükemmel simetri ve ışığı hapseden 18 ayar montürlerle tasarlanmış evlilik teklifi ve anı yüzükleri.',
    highlightSpecs: ['GIA / HRD Antwerp Sertifikalı', 'Triple Excellent Kesim', 'Özel Kadife Işıklı Sunum'],
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    featuredProductId: 'prod-2',
    ctaText: 'Tektaş Kataloğunu Aç',
    secondaryCtaText: 'Ölçü & Fiyat Danış'
  },
  {
    id: 'slide-yatirim',
    categoryKey: 'yatirim',
    badge: '24 Ayar (999.9 Has) • Sıfır İşçilik',
    title: 'Sertifikalı Külçe & Sarraf Altını',
    subtitle: 'En Güvenilir Birikim ve Yatırım Limanı',
    description: 'Darphane ve uluslararası LBMA rafineri güvenlik hologramlı 24 ayar has altın külçeleri, anlık Kapalıçarşı borsa fiyatıyla anında teslim.',
    highlightSpecs: ['%99.99 Saf Has Altın', 'Açılmamış Güvenlik Blisteri', 'Birebir Değerinde Geri Alım'],
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    featuredProductId: 'prod-4',
    ctaText: 'Külçe Fiyatlarını İncele',
    secondaryCtaText: 'Anlık Kurdan Satın Al'
  },
  {
    id: 'slide-ozel',
    categoryKey: 'ozel',
    badge: 'Kişiye Özel • Mehmet Hamdemirci Atölyesi',
    title: 'Özel Mücevher Tasarım & Döküm',
    subtitle: 'Hayalinizdeki Takıyı Birlikte Üretelim',
    description: 'Elinizdeki eski altınları değerinde dönüştürün veya aklınızdaki özel modeli 3D tasarım ve usta el işçiliğiyle gerçeğe dönüştürelim.',
    highlightSpecs: ['3D Bilgisayarlı Tasarım', 'Kişiye Özel Ayar & Gramaj', 'Birebir Sarraf Danışmanlığı'],
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80',
    featuredProductId: 'prod-7',
    ctaText: 'Koleksiyonu İncele',
    secondaryCtaText: 'Model Fotoğrafı Gönder'
  }
];

interface LuxuryWelcomeLoungeProps {
  onNavigateCatalog: (categoryKey?: string) => void;
  onNavigateRates: () => void;
  onOpenAppointment?: (prefill?: string) => void;
  onOpenManifesto: () => void;
  onSelectProduct: (product: Product) => void;
}

export const LuxuryWelcomeLounge: React.FC<LuxuryWelcomeLoungeProps> = ({
  onNavigateCatalog,
  onNavigateRates,
  onOpenManifesto,
  onSelectProduct,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [conciergeTab, setConciergeTab] = useState<'hizli' | 'hesapla' | 'iletisim'>('hizli');

  // Quick Calculator State
  const [calcGrams, setCalcGrams] = useState<number>(10);
  const [calcType, setCalcType] = useState<'has' | '22k' | '14k'>('22k');

  const currentSlide = WELCOME_SLIDES[activeSlideIndex];

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % WELCOME_SLIDES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setActiveSlideIndex((prev) => (prev + 1) % WELCOME_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setActiveSlideIndex((prev) => (prev - 1 + WELCOME_SLIDES.length) % WELCOME_SLIDES.length);
  };

  // Quick Calc calculation
  const getCalculatedEstimate = () => {
    const rateGram24k = 3205;
    const rateGram22k = 2980;
    const rateGram14k = 1890;

    let base = rateGram22k;
    if (calcType === 'has') base = rateGram24k;
    if (calcType === '14k') base = rateGram14k;

    return calcGrams * base;
  };

  return (
    <div id="luxury-welcome-lounge" className="relative bg-[#0b0b0b] text-[#e5e2e1] overflow-hidden">
      
      {/* 1. TOP LIVE TICKER MARQUEE (CANLI ALTIN PİYASASI ŞERİDİ) */}
      <div className="bg-[#121212] border-b border-[#d4af37]/30 py-2.5 px-4 overflow-hidden relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-ping" />
            <span className="text-[10px] font-sans-luxury uppercase tracking-[0.2em] text-[#d4af37] font-bold">
              KAPALIÇARŞI CANLI PİYASA:
            </span>
          </div>

          {/* Marquee ticker rates */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none text-xs font-sans-luxury py-0.5">
            {INITIAL_GOLD_PRICES.slice(0, 4).map((rate) => (
              <div key={rate.id} className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[#e5e2e1]/70">{rate.name}:</span>
                <span className="text-[#f2ca50] font-semibold font-mono">
                  {rate.selling.toLocaleString('tr-TR')} ₺
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  +{rate.change}%
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onNavigateRates}
            className="hidden md:flex items-center gap-1 text-[11px] font-sans-luxury text-[#d4af37] hover:text-[#f2ca50] uppercase tracking-wider shrink-0 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tüm Kurlar & Robot</span>
          </button>
        </div>
      </div>

      {/* 2. GRAND WELCOME HERO STAGE (BÜYÜK KARŞILAMA VE VİTRİN SAHNESİ) */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center border-b border-[#f7e7ce]/15">
        
        {/* Dynamic Background Image with Depth Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-1000 scale-105 opacity-30 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/90 to-[#0b0b0b]/60" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0b0b0b]/50 to-[#0b0b0b]" />
        </div>

        {/* Ambient Gold Spotlight Glow */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Prestigious Welcome & Active Slide (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Top Founder Welcome Crest */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#161616]/90 border border-[#d4af37]/50 text-[10px] font-sans-luxury uppercase tracking-[0.25em] text-[#f2ca50] shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Bursa Altın • Karşılama Salonu</span>
                </div>
                <span className="text-xs font-sans-luxury text-[#e5e2e1]/60 tracking-wider hidden sm:inline">
                  Mehmet Hamdemirci Sarraflık Mirası
                </span>
              </div>

              {/* Dynamic Slide Heading */}
              <div className="space-y-2 animate-fade-in key={currentSlide.id}">
                <span className="text-xs sm:text-sm font-sans-luxury uppercase tracking-[0.2em] text-[#d4af37] font-semibold block">
                  {currentSlide.badge}
                </span>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#f7e7ce] leading-[1.15] font-normal">
                  {currentSlide.title}
                </h1>
                <p className="font-serif-luxury italic text-base sm:text-lg text-[#f2ca50]/90 mt-1">
                  "{currentSlide.subtitle}"
                </p>
              </div>

              {/* Slide Description */}
              <p className="font-sans-luxury text-xs sm:text-sm text-[#e5e2e1]/80 max-w-xl leading-relaxed">
                {currentSlide.description}
              </p>

              {/* Highlight Specs Pill List */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {currentSlide.highlightSpecs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#141414]/90 border border-[#f7e7ce]/15 text-xs text-[#f7e7ce] font-sans-luxury"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  id="btn-lounge-primary-catalog"
                  onClick={() => onNavigateCatalog(currentSlide.categoryKey)}
                  className="px-7 py-3.5 bg-[#d4af37] hover:bg-[#f2ca50] text-[#0f0f0f] font-sans-luxury text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_30px_rgba(242,202,80,0.55)]"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                    `Merhaba Mehmet Hamdemirci Kuyumculuk, "${currentSlide.title}" hakkında güncel fiyat ve detaylı bilgi almak istiyorum.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 border border-[#d4af37]/60 hover:border-[#f2ca50] bg-[#141414]/80 hover:bg-[#d4af37]/15 text-[#f7e7ce] font-sans-luxury text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                  <span>{currentSlide.secondaryCtaText}</span>
                </a>
              </div>

              {/* Slider Dots & Navigation Controls */}
              <div className="pt-6 flex items-center gap-4 border-t border-[#f7e7ce]/10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="p-2 border border-[#f7e7ce]/20 hover:border-[#d4af37] text-[#e5e2e1]/70 hover:text-[#f2ca50] transition-colors"
                    aria-label="Önceki vitrin"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-2 border border-[#f7e7ce]/20 hover:border-[#d4af37] text-[#e5e2e1]/70 hover:text-[#f2ca50] transition-colors"
                    aria-label="Sonraki vitrin"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  {WELCOME_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setActiveSlideIndex(idx);
                      }}
                      className={`h-1.5 transition-all duration-500 rounded-full ${
                        activeSlideIndex === idx
                          ? 'w-10 bg-[#d4af37]'
                          : 'w-3 bg-[#f7e7ce]/20 hover:bg-[#f7e7ce]/50'
                      }`}
                      aria-label={`Vitrin ${idx + 1}`}
                    />
                  ))}
                </div>

                <span className="text-[11px] font-mono text-[#e5e2e1]/50">
                  0{activeSlideIndex + 1} / 0{WELCOME_SLIDES.length}
                </span>
              </div>

            </div>

            {/* Right Column: Visual Showcase Card with Direct Detail Hook (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative bg-[#141414] border border-[#d4af37]/60 p-4 sm:p-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-md">
                
                {/* Visual Image with Frame */}
                <div className="relative aspect-square overflow-hidden border border-[#f7e7ce]/15 bg-[#090909] group">
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Corner Brand Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-[#d4af37]/50 text-[10px] font-sans-luxury text-[#f2ca50] uppercase tracking-wider font-semibold">
                    Vitrin Modeli
                  </div>

                  {/* Bottom Info on Card */}
                  <div className="absolute bottom-4 inset-x-4">
                    <span className="text-[10px] font-sans-luxury uppercase tracking-widest text-[#d4af37] block">
                      Mehmet Hamdemirci Seçkisi
                    </span>
                    <h3 className="font-serif-luxury text-xl text-[#f7e7ce] mt-0.5">
                      {currentSlide.title}
                    </h3>
                  </div>
                </div>

                {/* Direct Action Bar under Card */}
                <div className="mt-4 pt-3 border-t border-[#f7e7ce]/10 flex items-center justify-between text-xs font-sans-luxury">
                  <div className="flex items-center gap-2 text-[#e5e2e1]/70">
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                    <span>Kapalıçarşı Sertifikalı</span>
                  </div>

                  <button
                    onClick={() => {
                      const prod = PRODUCTS_CATALOG.find((p) => p.id === currentSlide.featuredProductId);
                      if (prod) {
                        onSelectProduct(prod);
                      } else {
                        onNavigateCatalog(currentSlide.categoryKey);
                      }
                    }}
                    className="text-[#f2ca50] hover:text-white font-semibold flex items-center gap-1 tracking-wider uppercase"
                  >
                    <span>Detaylı İncele</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE CONCIERGE & QUICK WELCOME DESK (KARŞILAMA DANIŞMANI VE ASİSTAN) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#141414] border border-[#f7e7ce]/15 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#f7e7ce]/10">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-sans-luxury uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-1">
                <Compass className="w-3.5 h-3.5" />
                Hızlı Karşılama Masası
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#f7e7ce]">
                Bugün Sizin İçin Ne Hazırlayabiliriz?
              </h2>
            </div>

            {/* Switchable Concierge Tabs */}
            <div className="flex items-center gap-2 bg-[#1b1915] p-1 border border-[#f7e7ce]/15">
              <button
                onClick={() => setConciergeTab('hizli')}
                className={`px-3.5 py-2 text-xs font-sans-luxury uppercase tracking-wider transition-all ${
                  conciergeTab === 'hizli'
                    ? 'bg-[#d4af37] text-[#0f0f0f] font-bold'
                    : 'text-[#e5e2e1]/70 hover:text-white'
                }`}
              >
                Hızlı Yönlendirme
              </button>
              <button
                onClick={() => setConciergeTab('hesapla')}
                className={`px-3.5 py-2 text-xs font-sans-luxury uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  conciergeTab === 'hesapla'
                    ? 'bg-[#d4af37] text-[#0f0f0f] font-bold'
                    : 'text-[#e5e2e1]/70 hover:text-white'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Hızlı Hesaplayıcı</span>
              </button>
              <button
                onClick={() => setConciergeTab('iletisim')}
                className={`px-3.5 py-2 text-xs font-sans-luxury uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  conciergeTab === 'iletisim'
                    ? 'bg-[#d4af37] text-[#0f0f0f] font-bold'
                    : 'text-[#e5e2e1]/70 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Mağazamız & İletişim</span>
              </button>
            </div>
          </div>

          {/* TAB 1: QUICK ROUTING CARDS */}
          {conciergeTab === 'hizli' && (
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
              <button
                onClick={() => onNavigateCatalog('bilezik')}
                className="p-5 bg-[#181818] border border-[#f7e7ce]/10 hover:border-[#d4af37] text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#f2ca50] mb-3 group-hover:bg-[#d4af37] group-hover:text-[#0f0f0f] transition-all">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-serif-luxury text-base text-[#f7e7ce] group-hover:text-[#f2ca50]">
                  Düğün & Nişan Takıları
                </h4>
                <p className="text-xs text-[#e5e2e1]/60 font-sans-luxury mt-1 leading-relaxed">
                  22 ayar Trabzon hasırları, Ajda kelepçeler ve gerdanlık takımları.
                </p>
              </button>

              <button
                onClick={() => onNavigateCatalog('yuzuk')}
                className="p-5 bg-[#181818] border border-[#f7e7ce]/10 hover:border-[#d4af37] text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#f2ca50] mb-3 group-hover:bg-[#d4af37] group-hover:text-[#0f0f0f] transition-all">
                  <Gem className="w-4 h-4" />
                </div>
                <h4 className="font-serif-luxury text-base text-[#f7e7ce] group-hover:text-[#f2ca50]">
                  Pırlanta & Tektaş
                </h4>
                <p className="text-xs text-[#e5e2e1]/60 font-sans-luxury mt-1 leading-relaxed">
                  Uluslararası sertifikalı solitaire tektaşlar ve baget yüzükler.
                </p>
              </button>

              <button
                onClick={() => onNavigateCatalog('yatirim')}
                className="p-5 bg-[#181818] border border-[#f7e7ce]/10 hover:border-[#d4af37] text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#f2ca50] mb-3 group-hover:bg-[#d4af37] group-hover:text-[#0f0f0f] transition-all">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="font-serif-luxury text-base text-[#f7e7ce] group-hover:text-[#f2ca50]">
                  Külçe & Güvenli Yatırım
                </h4>
                <p className="text-xs text-[#e5e2e1]/60 font-sans-luxury mt-1 leading-relaxed">
                  24 ayar has külçeler ve Darphane sarraf altınları.
                </p>
              </button>

              <button
                onClick={() => onNavigateCatalog('ozel')}
                className="p-5 bg-[#181818] border border-[#f7e7ce]/10 hover:border-[#d4af37] text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#f2ca50] mb-3 group-hover:bg-[#d4af37] group-hover:text-[#0f0f0f] transition-all">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-serif-luxury text-base text-[#f7e7ce] group-hover:text-[#f2ca50]">
                  Özel Sipariş & Atölye
                </h4>
                <p className="text-xs text-[#e5e2e1]/60 font-sans-luxury mt-1 leading-relaxed">
                  Eski altınınızı değerlendirme veya 3D modelleme ile özel döküm.
                </p>
              </button>
            </div>
          )}

          {/* TAB 2: INSTANT VALUE CALCULATOR */}
          {conciergeTab === 'hesapla' && (
            <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fade-in">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-serif-luxury text-lg text-[#f7e7ce]">
                  Anlık Altın Gram & Ayar Değer Hesaplayıcı
                </h3>
                <p className="text-xs font-sans-luxury text-[#e5e2e1]/70">
                  Düşündüğünüz takı veya külçenin anlık piyasa değerini saniyeler içinde hesaplayın:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-sans-luxury uppercase text-[#d4af37] block mb-1">
                      Altın Ayarı
                    </label>
                    <select
                      value={calcType}
                      onChange={(e) => setCalcType(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-[#1c1c1c] border border-[#f7e7ce]/20 text-xs font-sans-luxury text-[#f7e7ce] focus:border-[#d4af37]"
                    >
                      <option value="22k">22 Ayar Bilezik & Takı (~2.980 ₺/gr)</option>
                      <option value="has">24 Ayar (999.9) Has Altın (~3.205 ₺/gr)</option>
                      <option value="14k">14 Ayar Modern Altın (~1.890 ₺/gr)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-sans-luxury uppercase text-[#d4af37] block mb-1">
                      Miktar (Gram): {calcGrams} gr
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={calcGrams}
                      onChange={(e) => setCalcGrams(Number(e.target.value))}
                      className="w-full accent-[#d4af37] cursor-pointer mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 bg-[#1b1915] border border-[#d4af37]/50 text-center">
                <span className="text-[10px] font-sans-luxury uppercase tracking-widest text-[#e5e2e1]/60 block">
                  Tahmini Piyasa Karşılığı ({calcGrams} gr - {calcType.toUpperCase()})
                </span>
                <span className="font-serif-luxury text-3xl sm:text-4xl text-[#f2ca50] font-bold block my-2">
                  {getCalculatedEstimate().toLocaleString('tr-TR')} ₺
                </span>
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                    `Merhaba, ${calcGrams} gram ${calcType.toUpperCase()} altın için anlık kesin bozdurma/satın alma teklifi almak istiyorum.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-[#d4af37] text-[#0f0f0f] text-xs font-sans-luxury font-bold uppercase tracking-wider hover:bg-[#f2ca50] transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Bu Tutarla WhatsApp'tan Teklif Al
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: BOUTIQUE INVITATION & CONTACT */}
          {conciergeTab === 'iletisim' && (
            <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fade-in">
              <div className="lg:col-span-8 space-y-3">
                <h3 className="font-serif-luxury text-xl text-[#f7e7ce]">
                  Bursa Kapalıçarşı Mağazamızda Kahvemizi İçin
                </h3>
                <p className="text-xs sm:text-sm font-sans-luxury text-[#e5e2e1]/75 leading-relaxed">
                  Ulucami doğusundaki tarihi Kapalıçarşı girişinde yer alan mağazamızda Mehmet Hamdemirci ve sarraf ekibimiz eşliğinde tüm koleksiyonlarımızı yakından inceleyebilirsiniz.
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-sans-luxury text-[#d4af37] pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{CONTACT_INFO.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{CONTACT_INFO.hours}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent('Merhaba Mehmet Hamdemirci Kuyumculuk, mağaza ziyareti ve ürünleriniz hakkında danışmak istiyorum.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#d4af37] hover:bg-[#f2ca50] text-[#0f0f0f] text-xs font-sans-luxury font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp ile Danış</span>
                </a>
                <a
                  href={`tel:${CONTACT_INFO.phoneRaw}`}
                  className="w-full py-3 border border-[#d4af37]/40 hover:border-[#d4af37] text-[#f7e7ce] text-xs font-sans-luxury uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Doğrudan Ara: {CONTACT_INFO.phone}</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 4. FOUNDER PRESTIGE QUOTE BAR */}
      <section className="py-8 px-4 border-t border-[#f7e7ce]/10 bg-[#0f0f0f]">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <p className="font-serif-luxury italic text-sm sm:text-base text-[#f7e7ce]/90">
            "Sarraflık bizim için sadece maden tartmak değil; müşterimizin güvenini, düğün mutluluğunu ve geleceğini tartmaktır."
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="h-[1px] w-8 bg-[#d4af37]/40" />
            <span className="text-[11px] font-sans-luxury uppercase tracking-[0.2em] text-[#d4af37] font-semibold">
              Mehmet Hamdemirci • Bursa Altın Kurucusu
            </span>
            <span className="h-[1px] w-8 bg-[#d4af37]/40" />
          </div>
        </div>
      </section>

    </div>
  );
};
