import React from 'react';
import brandLogoImage from '../assets/images/regenerated_image_1787651210294.png';

interface LuxuryLoaderProps {
  isLoading: boolean;
  onClose?: () => void;
  message?: string;
}

export const LuxuryLoader: React.FC<LuxuryLoaderProps> = ({
  isLoading,
  onClose,
  message = 'Özel Koleksiyon Yükleniyor'
}) => {
  if (!isLoading) return null;

  return (
    <div
      id="luxury-page-loader"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-xl transition-all duration-700 animate-fade-in"
    >
      {/* Ambient Gold Glow behind logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#d4af37]/15 rounded-full blur-[90px] pointer-events-none animate-pulse" />

      {/* Main Logo & Animated Ring Container */}
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Subtle Luxury Orbit Ring */}
        <div className="absolute -inset-8 sm:-inset-12 border border-[#d4af37]/20 rounded-full animate-[spin_12s_linear_infinite] pointer-events-none">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#f2ca50] shadow-[0_0_12px_#f2ca50]" />
        </div>

        {/* Counter Orbit Ring */}
        <div className="absolute -inset-4 sm:-inset-6 border border-[#f7e7ce]/10 rounded-full animate-[spin_8s_linear_infinite_reverse] pointer-events-none" />

        {/* Pulsing Glowing Logo */}
        <div className="relative z-10 max-w-[280px] sm:max-w-[360px] md:max-w-[420px] px-4 py-3">
          <img
            src={brandLogoImage}
            alt="Bursa Altın Logo"
            className="w-full h-auto object-contain drop-shadow-[0_0_35px_rgba(242,202,80,0.45)] animate-[pulse_2.4s_ease-in-out_infinite]"
            draggable={false}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Gold Shimmer Bar */}
        <div className="mt-8 w-48 sm:w-64 h-[2px] bg-[#222] relative overflow-hidden rounded-full border border-[#d4af37]/30">
          <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#f2ca50] to-transparent animate-[shimmer_1.6s_infinite]" />
        </div>

        {/* Status Text */}
        <div className="mt-4 flex flex-col items-center gap-1.5">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-sans-luxury text-[#f7e7ce]/90 font-medium">
            {message}
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-sans-luxury text-[#d4af37]/70">
            LÜTFEN BEKLEYİNİZ
          </span>
        </div>
      </div>
    </div>
  );
};
