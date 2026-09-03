import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CategoryShowcaseItem } from '../types';
import { DEFAULT_CATEGORY_CARDS } from '../services/bannerContentService';

interface CategoryShowcaseProps {
  onSelectCategory: (categoryId: string) => void;
  onUniversalLink?: (targetUrl: string) => void;
  categoryCards?: CategoryShowcaseItem[];
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  onSelectCategory,
  onUniversalLink,
  categoryCards = DEFAULT_CATEGORY_CARDS,
}) => {
  const activeCards = (categoryCards || []).filter((c) => c.isEnabled !== false);
  const cardsToRender = activeCards.length > 0 ? activeCards : DEFAULT_CATEGORY_CARDS;

  const handleCardClick = (cat: CategoryShowcaseItem) => {
    if (cat.targetUrl) {
      if (onUniversalLink) {
        onUniversalLink(cat.targetUrl);
        return;
      }
    }
    onSelectCategory(cat.id);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-sans-luxury font-bold uppercase tracking-widest text-[#996515] block mb-1">
          KATEGORİLER
        </span>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-gray-900">
          Mücevher & Sarrafiye Vitrinimiz
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-sans-luxury mt-2">
          Mehmet Hamdemirci tecrübesiyle hazırlanan en seçkin altın ve pırlanta koleksiyonları
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cardsToRender.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCardClick(cat)}
            className="group bg-white border border-gray-200 hover:border-[#c89d3a] rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col"
          >
            {/* Image Box with <picture> element for responsive loading */}
            <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
              <picture className="w-full h-full">
                {cat.mobileImage && (
                  <source
                    media="(max-width: 640px)"
                    srcSet={cat.mobileImage}
                  />
                )}
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </picture>
              <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-gray-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                {cat.tag}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-gray-900 group-hover:text-[#996515] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#996515]">
                <span>{cat.count}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                  Keşfet <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

