import React, { useState } from 'react';
import { MessageSquare, Phone, MapPin, Clock, Copy, Check, ExternalLink } from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';

interface ContactFooterProps {
  onOpenAppointment: () => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({ onOpenAppointment }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <footer className="w-full bg-[#0c0c0c] border-t border-[#f7e7ce]/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Main Contact Section Matching Screenshot Exactly */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20 md:gap-28 w-full">
          
          {/* WHATSAPP Block */}
          <div className="flex flex-col items-center group cursor-pointer" id="footer-whatsapp-block">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent('Merhaba Bursa Altın, mücevherat ve güncel altın fiyatları hakkında bilgi almak istiyorum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              {/* WhatsApp Icon Box with Golden Outline */}
              <div className="w-14 h-14 rounded-none border border-[#d4af37] flex items-center justify-center mb-4 bg-[#141414] group-hover:bg-[#d4af37]/15 group-hover:border-[#f2ca50] transition-all transform group-hover:-translate-y-1">
                <MessageSquare className="w-6 h-6 text-[#d4af37] group-hover:text-[#f2ca50]" />
              </div>
              <span className="text-[11px] font-sans-luxury uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                WHATSAPP
              </span>
              <span className="font-sans-luxury text-sm sm:text-base text-[#e5e2e1] font-medium tracking-wider mt-1 group-hover:text-[#f2ca50] transition-colors">
                {CONTACT_INFO.whatsapp}
              </span>
            </a>
            
            <button
              onClick={() => handleCopy(CONTACT_INFO.whatsapp, 'whatsapp')}
              className="mt-2 text-[10px] text-[#e5e2e1]/40 hover:text-[#d4af37] flex items-center gap-1 transition-colors"
            >
              {copiedType === 'whatsapp' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Numarayı Kopyala</span>
                </>
              )}
            </button>
          </div>

          {/* DÜKKAN / PHONE Block */}
          <div className="flex flex-col items-center group cursor-pointer" id="footer-dukkan-block">
            <a
              href={`tel:${CONTACT_INFO.phoneRaw}`}
              className="flex flex-col items-center"
            >
              {/* Phone Icon Box with Golden Outline */}
              <div className="w-14 h-14 rounded-none border border-[#d4af37] flex items-center justify-center mb-4 bg-[#141414] group-hover:bg-[#d4af37]/15 group-hover:border-[#f2ca50] transition-all transform group-hover:-translate-y-1">
                <Phone className="w-6 h-6 text-[#d4af37] group-hover:text-[#f2ca50]" />
              </div>
              <span className="text-[11px] font-sans-luxury uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                DÜKKAN
              </span>
              <span className="font-sans-luxury text-sm sm:text-base text-[#e5e2e1] font-medium tracking-wider mt-1 group-hover:text-[#f2ca50] transition-colors">
                {CONTACT_INFO.phone}
              </span>
            </a>

            <button
              onClick={() => handleCopy(CONTACT_INFO.phone, 'phone')}
              className="mt-2 text-[10px] text-[#e5e2e1]/40 hover:text-[#d4af37] flex items-center gap-1 transition-colors"
            >
              {copiedType === 'phone' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Numarayı Kopyala</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Social Icons (Instagram, TikTok, Facebook) Matching Screenshot */}
        <div className="mt-12 flex items-center justify-center gap-6">
          {/* Instagram */}
          <a
            href={CONTACT_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-10 h-10 border border-[#f7e7ce]/20 hover:border-[#d4af37] flex items-center justify-center text-[#e5e2e1] hover:text-[#f2ca50] hover:bg-[#d4af37]/10 transition-all"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* X (formerly Twitter) */}
          <a
            href={CONTACT_INFO.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="w-10 h-10 border border-[#f7e7ce]/20 hover:border-[#d4af37] flex items-center justify-center text-[#e5e2e1] hover:text-[#f2ca50] hover:bg-[#d4af37]/10 transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href={CONTACT_INFO.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-10 h-10 border border-[#f7e7ce]/20 hover:border-[#d4af37] flex items-center justify-center text-[#e5e2e1] hover:text-[#f2ca50] hover:bg-[#d4af37]/10 transition-all"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>
        </div>

        {/* Address and Working Hours Box */}
        <div className="mt-8 pt-8 border-t border-[#f7e7ce]/10 max-w-xl text-center">
          <p className="text-xs text-[#e5e2e1]/70 font-sans-luxury flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            {CONTACT_INFO.address}
          </p>
          <p className="text-xs text-[#e5e2e1]/50 font-sans-luxury flex items-center justify-center gap-1.5 mt-1.5">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            {CONTACT_INFO.hours}
          </p>
        </div>

        {/* The Exact Footer Copyright from Screenshot */}
        <div className="mt-8 text-xs font-sans-luxury text-[#e5e2e1]/60 tracking-wider">
          © 2026 Bursa Altın. Zarafetin ve güvenin adresi.
        </div>

      </div>
    </footer>
  );
};
