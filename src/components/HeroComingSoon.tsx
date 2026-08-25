import React from 'react';
import { BrandLogo } from './BrandLogo';

export const HeroComingSoon: React.FC = () => {
  return (
    <section className="relative min-h-[calc(100vh-280px)] flex flex-col justify-center items-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 gold-spotlight overflow-hidden">
      {/* Subtle decorative golden ambient spotlight */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] sm:h-[450px] bg-[#d4af37]/10 blur-[140px] rounded-full" />
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center z-10">
        {/* Central Exact Hero Brand Mark */}
        <div className="my-2 sm:my-4 transition-transform duration-700 hover:scale-[1.01]">
          <BrandLogo size="hero" showSubtitle={true} />
        </div>

        {/* The Exact Headline from Screenshot */}
        <div className="mt-10 sm:mt-16 max-w-2xl px-4">
          <h1 className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl font-normal text-[#f2ca50] tracking-wide leading-tight drop-shadow-[0_2px_15px_rgba(242,202,80,0.25)]">
            Yeni deneyimimizle yakında sizlerle olacağız
          </h1>
        </div>
      </div>
    </section>
  );
};

