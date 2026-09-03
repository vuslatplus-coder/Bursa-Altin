import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PromoBannerItem } from '../types';
import { DEFAULT_PROMO_BANNERS } from '../services/bannerContentService';

interface PromoMiniBannersProps {
  onNavigateCatalog: (categoryKey?: string) => void;
  onOpenAppointment?: (prefill?: string) => void;
  onUniversalLink?: (targetUrl: string) => void;
  promosList?: PromoBannerItem[];
}

export const PromoMiniBanners: React.FC<PromoMiniBannersProps> = ({
  onNavigateCatalog,
  onUniversalLink,
  promosList = DEFAULT_PROMO_BANNERS,
}) => {
  // Filter active promos
  const activePromos = (promosList || []).filter((p) => p.isEnabled !== false);
  const itemsToRender = activePromos.length > 0 ? activePromos : DEFAULT_PROMO_BANNERS;

  const handleClick = (promo: PromoBannerItem) => {
    if (promo.targetUrl) {
      if (onUniversalLink) {
        onUniversalLink(promo.targetUrl);
        return;
      }
    }

    onNavigateCatalog(promo.categoryKey || 'all');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {itemsToRender.map((promo, idx) => (
          <div
            key={promo.id || idx}
            onClick={() => handleClick(promo)}
            className={`relative rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group bg-gradient-to-r ${
              promo.bgColorGradient || 'from-[#1c1917] to-[#292524]'
            } text-white p-6 flex flex-col justify-between min-h-[170px]`}
          >
            <div className="relative z-10 space-y-1.5 max-w-[70%]">
              <span
                className="text-[10px] font-sans-luxury font-bold uppercase tracking-wider block"
                style={{ color: promo.accentColor || '#d4af37' }}
              >
                {promo.tag}
              </span>
              <h3 className="font-serif-luxury text-lg font-bold text-white leading-snug">
                {promo.title}
              </h3>
              <p className="text-xs text-gray-300">
                {promo.subtitle}
              </p>
            </div>

            <div className="relative z-10 pt-3">
              <span
                className="inline-flex items-center gap-1 text-xs font-bold group-hover:translate-x-1 transition-transform"
                style={{ color: promo.accentColor || '#f59e0b' }}
              >
                {promo.ctaText || 'İncele'} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Decorative Corner Image with <picture> element for responsive loading */}
            <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full overflow-hidden border-4 border-white/10 opacity-70 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <picture className="w-full h-full">
                {promo.mobileImageUrl && (
                  <source
                    media="(max-width: 640px)"
                    srcSet={promo.mobileImageUrl}
                  />
                )}
                <img
                  src={promo.imageUrl}
                  alt={promo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

