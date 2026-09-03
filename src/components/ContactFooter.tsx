import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CreditCard,
  MessageSquare,
  Instagram,
  Facebook,
  Award,
  ChevronRight
} from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';
import brandLogoImage from '../assets/images/regenerated_image_1787651210294.png';
import { FooterLink } from '../types';
import { DEFAULT_FOOTER_LINKS } from '../data/defaultContentPagesData';

interface ContactFooterProps {
  onOpenAppointment?: (prefill?: string) => void;
  onOpenManifesto: () => void;
  onNavigateCategory: (categoryKey: string) => void;
  onOpenCorporatePage?: (pageSlug: string) => void;
  onOpenGuideArticle?: (slug: string) => void;
  onNavigateTab?: (tab: 'anasayfa' | 'katalog' | 'koleksiyon' | 'kurlar' | 'rehber' | 'altinini-getir') => void;
  onOpenAdmin?: () => void;
  footerLinks?: FooterLink[];
}

export const ContactFooter: React.FC<ContactFooterProps> = ({
  onOpenAppointment,
  onOpenManifesto,
  onNavigateCategory,
  onOpenCorporatePage,
  onOpenGuideArticle,
  onNavigateTab,
  onOpenAdmin,
  footerLinks = DEFAULT_FOOTER_LINKS,
}) => {
  const activeLinks = (footerLinks || []).filter((l) => l.active !== false);

  const kurumsalLinks = activeLinks.filter((l) => l.group === 'kurumsal');
  const musteriLinks = activeLinks.filter((l) => l.group === 'musteri-rehberi');
  const koleksiyonLinks = activeLinks.filter((l) => l.group === 'koleksiyonlar');

  const handleLinkClick = (link: FooterLink) => {
    const target = link.link;
    if (target.startsWith('page:')) {
      const slug = target.replace('page:', '');
      if (onOpenCorporatePage) {
        onOpenCorporatePage(slug);
      }
    } else if (target.startsWith('guide:')) {
      const slug = target.replace('guide:', '');
      if (onOpenGuideArticle) {
        onOpenGuideArticle(slug);
      }
      if (onNavigateTab) {
        onNavigateTab('rehber');
      }
    } else if (target.startsWith('tab:')) {
      const tab = target.replace('tab:', '') as any;
      if (onNavigateTab) {
        onNavigateTab(tab);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target.startsWith('kategori:')) {
      const cat = target.replace('kategori:', '');
      onNavigateCategory(cat);
    } else if (target === 'action:appointment') {
      onOpenAppointment();
    } else if (target === 'action:manifesto') {
      onOpenManifesto();
    } else {
      onNavigateCategory(target);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 font-sans-luxury">
      {/* 2. MAIN FOOTER LINKS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <img
              src={brandLogoImage}
              alt="Mehmet Hamdemirci Kuyumculuk"
              referrerPolicy="no-referrer"
              className="h-12 w-auto object-contain"
            />
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
              1984 yılından bu yana Bursa Tarihi Kapalıçarşı Bedesten'de usta sarraflık geleneği, dürüst ticaret ve güven anlayışıyla 22 ayar altın, pırlanta ve yatırım sarrafiyesi sunuyoruz.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-[#c89d3a] shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-[#c89d3a] shrink-0" />
                <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="hover:text-[#c89d3a] font-mono font-medium">
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent('Merhaba Mehmet Hamdemirci yetkilisi, bilgi almak istiyorum.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  WhatsApp: {CONTACT_INFO.whatsapp}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Koleksiyonlar (Dynamic Firestore footer links) */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-gray-900 uppercase tracking-wider">
              Koleksiyonlar
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              {koleksiyonLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="hover:text-[#996515] transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Kurumsal Sayfalar (Hakkımızda, Mağazamız, Neden Bursa Altın?, vb.) */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-gray-900 uppercase tracking-wider">
              Kurumsal
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              {kurumsalLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="hover:text-[#996515] transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Müşteri Rehberi & Hizmetler (Altınını Getir, Altın Rehberi, vb.) */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-gray-900 uppercase tracking-wider">
              Hizmetler & Rehber
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              {musteriLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="hover:text-[#996515] transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* 3. PAYMENT LOGOS & SECURITY BADGES */}
      <div className="bg-[#f8f9fa] border-t border-gray-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-semibold text-gray-700">Taksit & Güvenli Ödeme:</span>
            <span className="px-2 py-1 bg-white border border-gray-300 rounded font-bold text-gray-800 text-[10px]">
              Bonus
            </span>
            <span className="px-2 py-1 bg-white border border-gray-300 rounded font-bold text-gray-800 text-[10px]">
              World
            </span>
            <span className="px-2 py-1 bg-white border border-gray-300 rounded font-bold text-gray-800 text-[10px]">
              Maximum
            </span>
            <span className="px-2 py-1 bg-white border border-gray-300 rounded font-bold text-gray-800 text-[10px]">
              Axess
            </span>
            <span className="px-2 py-1 bg-white border border-gray-300 rounded font-bold text-gray-800 text-[10px]">
              CardFinans
            </span>
            <span className="px-2 py-1 bg-white border border-gray-300 rounded font-bold text-gray-800 text-[10px]">
              Troy
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              256-Bit SSL & 3D Secure Güvenlik
            </span>
          </div>

        </div>
      </div>

      {/* 4. COPYRIGHT */}
      <div className="bg-white border-t border-gray-200 py-4 px-4 text-center text-[11px] text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Mehmet Hamdemirci Kuyumculuk San. ve Tic. Ltd. Şti. Tüm hakları saklıdır.
          </span>
          <div className="flex items-center gap-3">
            <span>
              Bursa Kapalıçarşı Tarihi Bedesten No: 16 • Osmangazi / BURSA
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};
