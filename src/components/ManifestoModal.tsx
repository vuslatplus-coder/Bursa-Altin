import React from 'react';
import { MANIFESTO_TEXT } from '../data/mockData';
import { BrandLogo } from './BrandLogo';
import { X, Quote, ShieldCheck, Sparkles, Award } from 'lucide-react';

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppointment: () => void;
}

export const ManifestoModal: React.FC<ManifestoModalProps> = ({
  isOpen,
  onClose,
  onOpenAppointment,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#121212] border border-[#d4af37] max-w-3xl w-full my-8 p-6 sm:p-10 relative gold-glow-border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#e5e2e1]/60 hover:text-white p-2"
          aria-label="Kapat"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Top Logo and Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-[#f7e7ce]/15">
          <BrandLogo size="md" showSubtitle={true} />
          
          <div className="mt-6 inline-block px-3 py-1 border border-[#d4af37]/40 bg-[#1a1914] text-[10px] font-sans-luxury uppercase tracking-[0.3em] text-[#f2ca50]">
            KURUMSAL MANİFESTO
          </div>
        </div>

        {/* Quote Section */}
        <div className="my-8 p-6 bg-[#181612] border-l-2 border-[#d4af37] relative">
          <Quote className="w-8 h-8 text-[#d4af37]/20 absolute top-4 right-4" />
          <p className="font-serif-luxury text-lg sm:text-xl text-[#f7e7ce] italic leading-relaxed">
            "{MANIFESTO_TEXT.quote}"
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-signature text-2xl text-[#d4af37]">
              {MANIFESTO_TEXT.author}
            </span>
            <span className="text-xs text-[#e5e2e1]/60 font-sans-luxury">
              • Kurucu Usta & Baş Sarraf
            </span>
          </div>
        </div>

        {/* Manifesto Paragraphs */}
        <div className="space-y-4 font-sans-luxury text-sm sm:text-base text-[#e5e2e1]/85 leading-relaxed">
          {MANIFESTO_TEXT.paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="mt-8 pt-6 border-t border-[#f7e7ce]/10">
          <h4 className="font-serif-luxury text-lg text-[#f7e7ce] mb-4 text-center">
            Zanaat ve Güven İlkelerimiz
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MANIFESTO_TEXT.pillars.map((pillar, idx) => (
              <div key={idx} className="p-4 bg-[#161616] border border-[#f7e7ce]/10">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37] font-sans-luxury mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {pillar.title}
                </div>
                <p className="text-xs text-[#e5e2e1]/70 font-sans-luxury leading-normal">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-[#f7e7ce]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#e5e2e1]/60 font-sans-luxury text-center sm:text-left">
            Bursa Kapalıçarşı • Bedesten No: 16
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenAppointment();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#d4af37] hover:bg-[#f2ca50] text-[#0f0f0f] text-xs font-sans-luxury uppercase font-semibold tracking-wider transition-colors"
            >
              Özel Randevu Planla
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 border border-[#f7e7ce]/20 text-xs font-sans-luxury uppercase text-[#e5e2e1] hover:border-[#d4af37] transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
