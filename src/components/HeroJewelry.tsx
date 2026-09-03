import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Sparkles, ArrowRight, ShieldCheck, Gem, TrendingUp, Building2, MessageSquare } from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';

interface HeroJewelryProps {
  onNavigateCatalog: () => void;
  onNavigateRates: () => void;
  onOpenAppointment?: () => void;
  onOpenManifesto: () => void;
}

export const HeroJewelry: React.FC<HeroJewelryProps> = ({
  onNavigateCatalog,
  onNavigateRates,
  onOpenManifesto,
}) => {
  return (
    <section id="hero-jewelry-section" className="relative gold-spotlight overflow-hidden pt-8 pb-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#f7e7ce]/10">
      {/* Golden ambient radial background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Top Heritage Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#d4af37]/40 bg-[#161616]/90 backdrop-blur-sm text-[11px] font-sans-luxury uppercase tracking-[0.25em] text-[#f2ca50] mb-6 animate-fade-in shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-ping" />
          Mehmet Hamdemirci Kuyumculuk Güvencesiyle
        </div>

        {/* Central Exact Hero Brand Logo */}
        <div className="my-2 transition-transform duration-700 hover:scale-[1.01]">
          <BrandLogo size="hero" showSubtitle={true} />
        </div>

        {/* Headline & Description */}
        <div className="max-w-3xl mt-6 space-y-4">
          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#f7e7ce] leading-tight font-normal">
            Bursa Kapalıçarşı Mirası, <br className="hidden sm:inline" />
            <span className="italic text-[#f2ca50]">Kusursuz Ustalıkla</span> Buluşuyor
          </h1>
          <p className="font-sans-luxury text-sm sm:text-base text-[#e5e2e1]/75 max-w-2xl mx-auto leading-relaxed">
            30 yılı aşkın süredir dürüstlük ve yüksek sarraf zanaatıyla hazırlanan 22 ayar el örgüsü hasırlar, sertifikalı pırlantalar ve şeffaf canlı piyasa kurları.
          </p>
        </div>

        {/* Primary Call to Action Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          <button
            id="btn-hero-catalog"
            onClick={onNavigateCatalog}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#d4af37] hover:bg-[#f2ca50] text-[#0f0f0f] font-sans-luxury text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(242,202,80,0.5)]"
          >
            <span>Ürün Kataloğunu Keşfet</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-hero-rates"
            onClick={onNavigateRates}
            className="w-full sm:w-auto px-7 py-3.5 border border-[#d4af37]/60 hover:border-[#f2ca50] bg-[#161616]/80 hover:bg-[#d4af37]/15 text-[#f7e7ce] font-sans-luxury text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-[#d4af37]" />
            <span>Canlı Kurlar</span>
          </button>
        </div>

        {/* Three Prestige Highlights Bar */}
        <div className="mt-14 w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-[#f7e7ce]/10">
          <div className="p-4 bg-[#141414]/80 border border-[#f7e7ce]/10 flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm text-[#f7e7ce]">Tescilli Darphane Ayarı</h4>
              <p className="text-[11px] font-sans-luxury text-[#e5e2e1]/60 mt-0.5">%100 onaylı 24K, 22K ve 18K saflık damgası</p>
            </div>
          </div>

          <div className="p-4 bg-[#141414]/80 border border-[#f7e7ce]/10 flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
              <Gem className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm text-[#f7e7ce]">Usta El İşçiliği Zanaatı</h4>
              <p className="text-[11px] font-sans-luxury text-[#e5e2e1]/60 mt-0.5">Kapalıçarşı atölyelerinde kişiye özel üretim</p>
            </div>
          </div>

          <div className="p-4 bg-[#141414]/80 border border-[#f7e7ce]/10 flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm text-[#f7e7ce]">Tarihi Kapalıçarşı Mağazası</h4>
              <p className="text-[11px] font-sans-luxury text-[#e5e2e1]/60 mt-0.5">Ulucami girişinde 40 yıllık uzman sarraf hizmeti</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
