import React from 'react';
import {
  Scale,
  BadgeDollarSign,
  Coins,
  Sparkles,
  RefreshCw,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Clock,
  Building2,
  Award,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { AltininiGetirConfig, AltininiGetirServiceItem } from '../types';
import { DEFAULT_ALTININI_GETIR_CONFIG } from '../data/defaultContentPagesData';
import { CONTACT_INFO } from '../data/productsData';

interface AltininiGetirPageProps {
  config?: AltininiGetirConfig;
  onOpenAppointment?: (prefill?: string) => void;
  onOpenGuideArticle?: (slug: string) => void;
}

// Icon mapping helper
const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Scale':
      return <Scale className="w-6 h-6 text-[#c89d3a]" />;
    case 'BadgeDollarSign':
      return <BadgeDollarSign className="w-6 h-6 text-[#c89d3a]" />;
    case 'Coins':
      return <Coins className="w-6 h-6 text-[#c89d3a]" />;
    case 'Sparkles':
      return <Sparkles className="w-6 h-6 text-[#c89d3a]" />;
    case 'RefreshCw':
      return <RefreshCw className="w-6 h-6 text-[#c89d3a]" />;
    case 'ArrowLeftRight':
    default:
      return <ArrowLeftRight className="w-6 h-6 text-[#c89d3a]" />;
  }
};

export const AltininiGetirPage: React.FC<AltininiGetirPageProps> = ({
  config = DEFAULT_ALTININI_GETIR_CONFIG,
  onOpenGuideArticle,
}) => {
  const activeServices = (config.services || []).filter((s) => s.active !== false);

  const handleWhatsAppChat = (serviceTitle?: string) => {
    const text = serviceTitle
      ? `Merhaba Mehmet Hamdemirci Kuyumculuk, "${serviceTitle}" hizmetiniz hakkında bilgi ve teklif almak istiyorum.`
      : config.whatsappMessage || 'Merhaba, altın bozdurma ve takas hizmetiniz hakkında bilgi almak istiyorum.';
    const phone = config.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-[#fbfbfa] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans-luxury text-gray-900 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* 1. HERO HERO BANNER SECTION */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#171615] via-[#24211e] to-[#121110] text-white border border-[#c89d3a]/30">
          <div className="absolute inset-0 opacity-25 mix-blend-overlay">
            <img
              src={config.coverImage || DEFAULT_ALTININI_GETIR_CONFIG.coverImage}
              alt="Altınını Getir"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c89d3a]/20 border border-[#c89d3a]/50 text-[#fde68a] text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#c89d3a]" />
              Bursa Kapalıçarşı Değerleme Merkezi
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              {config.title || 'Altınını Getir Hizmetleri'}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl font-light">
              {config.description || DEFAULT_ALTININI_GETIR_CONFIG.description}
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleWhatsAppChat()}
                className="px-7 py-3.5 bg-gradient-to-r from-[#25D366] to-[#20bd5a] hover:from-[#20bd5a] hover:to-[#1aa84f] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>{config.ctaSecondaryText || 'WhatsApp ile Anında Değerleme & Fiyat Al'}</span>
              </button>

              <a
                href={`tel:${CONTACT_INFO.phoneRaw}`}
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2.5"
              >
                <Phone className="w-4 h-4 text-[#c89d3a]" />
                <span>Mağazamızı Ara: {CONTACT_INFO.phone}</span>
              </a>
            </div>

            {/* Guarantees Bar */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-gray-400 font-sans-luxury">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c89d3a]" />
                <span>Darphane Onaylı Hassas Tartım</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c89d3a]" />
                <span>Anında Nakit / Banka Havalesi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c89d3a]" />
                <span>Gizli Kesinti Yok</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SIX CORE SERVICES GRID */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              Altın ve Takı Dönüştürme Seçenekleri
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Kullanmadığınız her türlü altın, bilezik ve pırlantayı en karlı yöntemle değerlendirin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeServices.map((service, index) => (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl p-7 border border-gray-200 hover:border-[#c89d3a] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getServiceIcon(service.iconName)}
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#c89d3a] tracking-widest uppercase block mb-1">
                      {service.subtitle}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-[#996515] transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleWhatsAppChat(service.title)}
                    className="text-xs font-bold text-[#996515] hover:text-[#78350f] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Fiyat Teklifi Al</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-gray-400">Hizmet #{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. DETAILED SCRAP GOLD & VALUATION INFO SECTION */}
        <div className="bg-[#f7f5f0] border border-amber-200/70 rounded-2xl p-8 sm:p-12 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#c89d3a] text-white flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-serif font-bold text-gray-900">
                {config.scrapGoldInfoTitle || 'Hurda ve Eski Altın Değerleme Standartlarımız'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {config.scrapGoldInfoContent || DEFAULT_ALTININI_GETIR_CONFIG.scrapGoldInfoContent}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-amber-200/50 text-xs">
            <div className="p-4 bg-white rounded-xl border border-gray-200/80 space-y-1">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#c89d3a]" /> 5 Dakikada Hızlı Sonuç
              </h4>
              <p className="text-gray-600 text-[11px]">
                Mağazamızda beklemeden anında ayar ve hassas tartım analizi yapılır.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200/80 space-y-1">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#c89d3a]" /> Bursa Tarihi Bedesten
              </h4>
              <p className="text-gray-600 text-[11px]">
                1984'ten bu yana Tarihi Kapalıçarşı No: 16 adresinde güvenin adresi.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200/80 space-y-1">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#c89d3a]" /> Resmi Fatura & Dekont
              </h4>
              <p className="text-gray-600 text-[11px]">
                Tüm alım ve satım işlemleriniz yasal güvence ve makbuzla tescillenir.
              </p>
            </div>
          </div>
        </div>

        {/* 4. FREQUENTLY ASKED QUESTIONS ABOUT GOLD EXCHANGE */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
              Altın Bozdurma ve Değerleme Hakkında Sıkça Sorulanlar
            </h3>
            <p className="text-xs text-gray-500">
              Süreçle ilgili merak ettiğiniz detaylar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
              <h4 className="font-bold text-xs text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#c89d3a]" /> Kırık veya hasarlı takıları alıyor musunuz?
              </h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Evet. Kırık zincir, tek kalmış küpe veya ezilmiş bilezikler ayar ve miligramına göre tam has değerinde satın alınır.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
              <h4 className="font-bold text-xs text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#c89d3a]" /> Ödeme ne zaman yapılır?
              </h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Değerleme tamamlandığı anda nakit veya talep ettiğiniz IBAN hesabınıza anında FAST/Havale ile aktarılır.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
              <h4 className="font-bold text-xs text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#c89d3a]" /> Takas yaparsam daha mı karlı olur?
              </h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Evet. Eski altınınızı yeni bir takı ile takas ettiğinizde sarrafiye makas farkı minimuma indirilir ve daha avantajlı fiyat uygulanır.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
              <h4 className="font-bold text-xs text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#c89d3a]" /> Mağazanıza ne zaman gelebilirim?
              </h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Mağazamızı haftanın 6 günü (Pazartesi-Cumartesi 09:00 - 19:00) mesai saatleri içinde dilediğiniz zaman ziyaret ederek ücretsiz değerleme yaptırabilirsiniz.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
