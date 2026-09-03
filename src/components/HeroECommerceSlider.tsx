import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  Flame,
  Award
} from 'lucide-react';
import { Product, HeroSectionConfig, HeroSlide } from '../types';
import { PRODUCTS_CATALOG } from '../data/productsData';
import { DEFAULT_HERO_CONFIG } from '../data/heroData';
import { GoogleAdSlot } from './GoogleAdSlot';

interface HeroECommerceSliderProps {
  onNavigateCatalog: (categoryKey?: string) => void;
  onNavigateRates: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenAppointment?: (prefill?: string) => void;
  onUniversalLink?: (targetUrl: string) => void;
  heroConfig?: HeroSectionConfig;
  productsList?: Product[];
}

export const HeroECommerceSlider: React.FC<HeroECommerceSliderProps> = ({
  onNavigateCatalog,
  onNavigateRates,
  onSelectProduct,
  onUniversalLink,
  heroConfig = DEFAULT_HERO_CONFIG,
  productsList = PRODUCTS_CATALOG,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper to trigger link navigation
  const handleLinkClick = (target?: string, fallbackCategory?: string) => {
    const finalTarget = target || (fallbackCategory ? `kategori:${fallbackCategory}` : 'kategori:all');
    if (onUniversalLink) {
      onUniversalLink(finalTarget);
    } else {
      onNavigateCatalog(fallbackCategory || 'all');
    }
  };

  // Active slides (filtered by isEnabled !== false)
  const activeSlides = (heroConfig?.slides || []).filter(s => s.isEnabled !== false);
  const slidesToUse: HeroSlide[] = activeSlides.length > 0 ? activeSlides : DEFAULT_HERO_CONFIG.slides;

  // Ensure currentSlide is within bounds
  useEffect(() => {
    if (currentSlide >= slidesToUse.length) {
      setCurrentSlide(0);
    }
  }, [slidesToUse.length, currentSlide]);

  // Auto advance slide every 5.5 seconds
  useEffect(() => {
    if (slidesToUse.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesToUse.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slidesToUse.length]);

  const slide = slidesToUse[currentSlide] || slidesToUse[0];

  // Deal card setup
  const dealCardConfig = heroConfig?.dealCard || DEFAULT_HERO_CONFIG.dealCard;
  const dealProduct = productsList.find(p => p.id === dealCardConfig.productId) ||
    PRODUCTS_CATALOG.find(p => p.id === dealCardConfig.productId) ||
    productsList[0] ||
    PRODUCTS_CATALOG[0];

  // Investment card setup
  const investCardConfig = heroConfig?.investmentCard || DEFAULT_HERO_CONFIG.investmentCard;
  const investProduct = productsList.find(p => p.id === investCardConfig.productId) ||
    PRODUCTS_CATALOG.find(p => p.id === investCardConfig.productId) ||
    productsList.find(p => p.category === 'yatirim') ||
    PRODUCTS_CATALOG[3];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT: MAIN SLIDER BANNER (70% width) */}
        <div 
          onClick={(e) => {
            // Check if clicked element was a button or navigation control
            const target = e.target as HTMLElement;
            if (target.closest('button')) return;
            handleLinkClick(slide.targetUrl, slide.category);
          }}
          className="lg:col-span-8 relative rounded-xl overflow-hidden shadow-md bg-neutral-900 min-h-[380px] sm:min-h-[460px] flex items-center group cursor-pointer"
        >
          
          {/* Background Image using HTML <picture> to only load the appropriate image for screen size */}
          <div className="absolute inset-0 overflow-hidden">
            <picture className="w-full h-full">
              {slide.mobileBgImage && (
                <source
                  media="(max-width: 640px)"
                  srcSet={slide.mobileBgImage}
                />
              )}
              <img
                src={slide.bgImage}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-700 transform scale-105 group-hover:scale-110"
              />
            </picture>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />

          {/* Slide Content */}
          <div className="relative z-10 p-6 sm:p-10 max-w-xl text-white space-y-3.5">
            
            {slide.tag && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c89d3a]/90 text-black text-[11px] font-sans-luxury font-bold tracking-wider uppercase rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{slide.tag}</span>
              </div>
            )}

            <h2 className="font-serif-luxury text-2xl sm:text-4xl text-white font-bold leading-tight drop-shadow-sm">
              {slide.title}
            </h2>

            <p className="text-gray-200 text-xs sm:text-sm font-sans-luxury leading-relaxed max-w-md">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLinkClick(slide.targetUrl, slide.category);
                }}
                className="px-6 py-3 bg-[#c89d3a] hover:bg-[#b38728] text-white text-xs font-sans-luxury font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center gap-2"
              >
                <span>{slide.ctaText || 'Koleksiyonu İncele'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateRates();
                }}
                className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white border border-white/40 text-xs font-sans-luxury font-semibold uppercase tracking-wider rounded backdrop-blur-xs transition-all"
              >
                Canlı Altın Kurları
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="pt-4 flex items-center gap-5 text-[11px] text-gray-300 border-t border-white/20">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>Sigortalı Kargo</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>Darphane Garantili</span>
              </span>
            </div>

          </div>

          {/* Slider Prev / Next Controls (if more than 1 slide) */}
          {slidesToUse.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev - 1 + slidesToUse.length) % slidesToUse.length);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs z-20"
                aria-label="Önceki Slayt"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide((prev) => (prev + 1) % slidesToUse.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xs z-20"
                aria-label="Sonraki Slayt"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                {slidesToUse.map((s, idx) => (
                  <button
                    type="button"
                    key={s.id || idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(idx);
                    }}
                    className={`h-2 transition-all rounded-full ${
                      idx === currentSlide ? 'w-7 bg-[#c89d3a]' : 'w-2 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Slayt ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

        </div>

        {/* RIGHT: 2 SIDE PROMO CARDS (30% width) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Side Card 1: Deal of the Day (Günün Fırsatı) */}
          <div
            onClick={() => {
              if (dealCardConfig.targetUrl) {
                handleLinkClick(dealCardConfig.targetUrl);
              } else if (dealProduct) {
                onSelectProduct(dealProduct);
              } else {
                onNavigateCatalog('all');
              }
            }}
            className="flex-1 bg-white border border-amber-200 hover:border-[#c89d3a] rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-full uppercase">
                  <Percent className="w-3 h-3" />
                  {dealCardConfig.tag || 'Günün Fırsatı'}
                </span>
                <h3 className="font-serif-luxury text-sm font-bold text-gray-900 mt-1.5 line-clamp-1 group-hover:text-[#996515] transition-colors">
                  {dealCardConfig.title || dealProduct?.title}
                </h3>
                <p className="text-[11px] text-gray-500 font-sans-luxury">
                  {dealCardConfig.subtitle || `${dealProduct?.karat || '18A'} • ${dealProduct?.weightGrams || '3.5'} gr`}
                </p>
              </div>

              <img
                src={dealCardConfig.imageUrl || dealProduct?.thumbnailUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80'}
                alt={dealCardConfig.title || dealProduct?.title}
                referrerPolicy="no-referrer"
                className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-2xs group-hover:scale-105 transition-transform bg-gray-50"
              />
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                {(dealCardConfig.originalPrice || dealProduct?.originalPrice) && (
                  <span className="text-[11px] text-gray-400 line-through mr-2 font-mono">
                    {(dealCardConfig.originalPrice || dealProduct?.originalPrice)?.toLocaleString('tr-TR')} ₺
                  </span>
                )}
                <span className="font-mono text-base font-bold text-[#b38728]">
                  {(dealCardConfig.customPrice || dealProduct?.price || 0).toLocaleString('tr-TR')} ₺
                </span>
              </div>

              <span className="text-xs font-semibold text-[#996515] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {dealCardConfig.buttonText || 'İncele'} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Side Card 2: Google Reklam & AdSense Alanı (Kullanıcı tarafından hedeflenen Google Reklam Alanı Zemini) */}
          <GoogleAdSlot
            slotId={investCardConfig.productId}
            variant="hero-side"
            className="flex-1 min-h-[190px] sm:min-h-[200px]"
          />

        </div>

      </div>
    </div>
  );
};
