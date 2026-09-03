import React from 'react';
import { Sparkles, TrendingUp, Gem, Flame } from 'lucide-react';
import { CustomCategory, DEFAULT_CATEGORIES } from '../data/categoriesData';
import { StoryFeatureConfig } from '../types';

interface StoryCategoryBarProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenRates: () => void;
  categoriesList?: CustomCategory[];
  storyFeature?: StoryFeatureConfig;
}

export const DEFAULT_STORY_FEATURE: StoryFeatureConfig = {
  title: 'Canlı Altın Borsası',
  badge: 'CANLI',
  imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=300&q=80',
  displayType: 'image',
  isEnabled: true,
};

export const StoryCategoryBar: React.FC<StoryCategoryBarProps> = ({
  onSelectCategory,
  onOpenRates,
  categoriesList = DEFAULT_CATEGORIES,
  storyFeature = DEFAULT_STORY_FEATURE,
}) => {
  const visibleCategories = categoriesList.filter(c => c.isEnabled !== false);
  const isFeatureEnabled = storyFeature.isEnabled !== false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-2xs">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1">
          
          {/* Canlı Kurlar / Özel Vitrin Balonu (Panelden Özelleştirilebilir) */}
          {isFeatureEnabled && (
            <button
              onClick={onOpenRates}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-amber-200 to-[#c89d3a] shadow-xs group-hover:scale-105 transition-transform ring-2 ring-amber-300/40">
                {storyFeature.displayType === 'image' && storyFeature.imageUrl ? (
                  <img
                    src={storyFeature.imageUrl}
                    alt={storyFeature.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white bg-amber-50"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-50 flex flex-col items-center justify-center text-[#996515] p-1 text-center border-2 border-white">
                    <TrendingUp className="w-5 h-5 text-[#c89d3a] animate-bounce" />
                    <span className="text-[9px] font-bold font-mono text-gray-900 mt-0.5">BORSA</span>
                  </div>
                )}

                {/* Rozet */}
                {storyFeature.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-xs flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    <span>{storyFeature.badge}</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-sans-luxury font-bold text-gray-900 group-hover:text-[#996515] transition-colors whitespace-nowrap">
                {storyFeature.title || 'Canlı Altın Borsası'}
              </span>
            </button>
          )}

          {/* Dinamik Kategoriler */}
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-gray-200 via-amber-200 to-[#c89d3a] shadow-xs group-hover:scale-105 transition-transform">
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1611591475155-426ea754ce4e?auto=format&fit=crop&w=300&q=80'}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white bg-gray-100"
                />
                {cat.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#c89d3a] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-xs">
                    {cat.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-sans-luxury font-semibold text-gray-800 group-hover:text-[#996515] transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          ))}

        </div>
      </div>
    </div>
  );
};

