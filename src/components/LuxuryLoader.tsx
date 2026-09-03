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
  message = 'Bursa Altın Koleksiyonu Yükleniyor'
}) => {
  if (!isLoading) return null;

  return (
    <div
      id="luxury-page-loader"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-white/95 backdrop-blur-md transition-all duration-700 animate-fade-in"
    >
      {/* Ambient Gold Glow behind logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-amber-200/30 rounded-full blur-[90px] pointer-events-none animate-pulse" />

      {/* Main Logo & Container */}
      <div className="relative flex flex-col items-center justify-center text-center">
        
        {/* Pulsing Logo */}
        <div className="relative z-10 max-w-[240px] sm:max-w-[300px] px-4 py-3">
          <img
            src={brandLogoImage}
            alt="Bursa Altın Logo"
            className="w-full h-auto object-contain drop-shadow-md animate-pulse"
            draggable={false}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Gold Shimmer Progress Bar */}
        <div className="mt-6 w-48 sm:w-60 h-1 bg-gray-200 relative overflow-hidden rounded-full border border-amber-200">
          <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#c89d3a] to-transparent animate-[shimmer_1.4s_infinite]" />
        </div>

        {/* Status Text */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-[0.2em] font-sans-luxury text-gray-800 font-bold">
            {message}
          </span>
          <span className="text-[10px] tracking-widest font-sans-luxury text-[#996515] font-semibold">
            LÜTFEN BEKLEYİNİZ...
          </span>
        </div>
      </div>
    </div>
  );
};
