import React from 'react';
import brandLogoImage from '../assets/images/regenerated_image_1787651210294.png';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  onClick?: () => void;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'hero',
  onClick,
  className = ''
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return 'w-48 sm:w-56 max-w-full';
      case 'md':
        return 'w-64 sm:w-80 max-w-full';
      case 'lg':
        return 'w-80 sm:w-[460px] max-w-full';
      case 'hero':
      default:
        return 'w-full max-w-[360px] sm:max-w-[540px] md:max-w-[680px] lg:max-w-[760px]';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      id="brand-logo-container"
    >
      <img
        src={brandLogoImage}
        alt="Bursa Altın - Mehmet Hamdemirci"
        className={`${getDimensions()} h-auto object-contain transition-all duration-300 drop-shadow-[0_8px_30px_rgba(223,159,0,0.2)]`}
        draggable={false}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
