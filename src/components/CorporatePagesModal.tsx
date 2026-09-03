import React from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  Award,
  Users,
  HelpCircle,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { ContentPage } from '../types';
import { CONTACT_INFO } from '../data/productsData';

interface CorporatePagesModalProps {
  page: ContentPage | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAppointment?: (prefill?: string) => void;
}

const getPageIcon = (pageType: string) => {
  switch (pageType) {
    case 'hakkimizda':
      return <Award className="w-5 h-5 text-[#c89d3a]" />;
    case 'magazamiz':
      return <Building2 className="w-5 h-5 text-[#c89d3a]" />;
    case 'neden-bursa-altin':
      return <ShieldCheck className="w-5 h-5 text-[#c89d3a]" />;
    case 'musteri-yorumlari':
      return <Users className="w-5 h-5 text-[#c89d3a]" />;
    case 'sss':
      return <HelpCircle className="w-5 h-5 text-[#c89d3a]" />;
    case 'iletisim':
      return <Phone className="w-5 h-5 text-[#c89d3a]" />;
    default:
      return <Sparkles className="w-5 h-5 text-[#c89d3a]" />;
  }
};

export const CorporatePagesModal: React.FC<CorporatePagesModalProps> = ({
  page,
  isOpen,
  onClose,
  onOpenAppointment,
}) => {
  if (!isOpen || !page) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in font-sans-luxury">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col my-auto animate-scale-up">
        
        {/* Header */}
        <div className="p-5 bg-gray-900 text-white border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c89d3a]/20 border border-[#c89d3a]/40 flex items-center justify-center">
              {getPageIcon(page.pageType)}
            </div>
            <div>
              <span className="text-[10px] text-[#c89d3a] font-bold tracking-widest uppercase block">
                Bursa Altın Kurumsal
              </span>
              <h2 className="text-lg font-serif font-bold text-white leading-tight">
                {page.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-gray-900">
          
          {/* Hero Image if available */}
          {page.heroImage && (
            <div className="h-56 sm:h-64 rounded-xl overflow-hidden shadow-inner bg-gray-100 relative">
              <img
                src={page.heroImage}
                alt={page.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-sm font-medium leading-relaxed">
                  {page.description}
                </p>
              </div>
            </div>
          )}

          {/* Description if no hero image */}
          {!page.heroImage && page.description && (
            <div className="p-4 bg-amber-50/70 border-l-3 border-[#c89d3a] rounded-r-lg text-sm text-gray-700 leading-relaxed font-medium">
              {page.description}
            </div>
          )}

          {/* Sections List */}
          {page.sections && page.sections.length > 0 && (
            <div className="space-y-4 pt-2">
              {page.sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-gray-50 border border-gray-200/80 rounded-xl p-5 space-y-2 hover:border-amber-200 transition-colors"
                >
                  <h3 className="text-sm font-serif font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c89d3a]" />
                    {section.title}
                  </h3>
                  <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line font-normal">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-4 h-4 text-[#c89d3a]" />
              <span>{CONTACT_INFO.address}</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(`Merhaba Mehmet Hamdemirci Kuyumculuk, "${page.title}" hakkında bilgi almak istiyorum.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp ile İletişime Geç</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
