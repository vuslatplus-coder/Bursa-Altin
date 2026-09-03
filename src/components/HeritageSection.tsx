import React from 'react';
import { MANIFESTO_TEXT, CONTACT_INFO } from '../data/mockData';
import { ShieldCheck, Award, RefreshCw, Gem, Sparkles, Clock, MapPin, ArrowRight } from 'lucide-react';

interface HeritageSectionProps {
  onOpenManifesto: () => void;
  onOpenAppointment?: () => void;
}

export const HeritageSection: React.FC<HeritageSectionProps> = ({
  onOpenManifesto,
}) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="heritage-section">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Brand Story & Values (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-[#996515] text-[11px] font-sans-luxury font-bold uppercase tracking-wider rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#c89d3a]" />
              40 Yıllık Bursa Sarraf Güveni & Zanaat
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-gray-900 font-bold leading-snug">
              "Altın sadece maden değildir; bir ailenin emeği, bir aşkın yemini, bir geleceğin güvencesidir."
            </h2>

            <p className="font-sans-luxury text-xs sm:text-sm text-gray-600 leading-relaxed">
              Bursa Tarihi Kapalıçarşı Bedesten'de 1984 yılından bu yana dürüst sarraflık, ayar garantisi ve müşteri memnuniyeti anlayışıyla hizmet veriyoruz. 22 ayar el örgüsü hasırlar, uluslararası sertifikalı tektaş pırlantalar ve yatırım ziynetlerinde güvenin simgesiyiz.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {MANIFESTO_TEXT.pillars.map((pillar, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-serif-luxury text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c89d3a]" />
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-sans-luxury mt-1 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Action links */}
            <div className="pt-3 flex flex-wrap gap-3 items-center">
              <button
                onClick={onOpenManifesto}
                className="px-6 py-2.5 bg-[#c89d3a] hover:bg-[#b38728] text-white text-xs font-sans-luxury font-bold uppercase tracking-wider rounded shadow-xs transition-all flex items-center gap-2"
              >
                <span>Hikayemizi Okuyun</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Showcase & Store Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border border-gray-200 rounded-xl p-2 bg-white shadow-xs overflow-hidden">
              <div className="aspect-4/3 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=80"
                  alt="Mehmet Hamdemirci Zanaat ve Atölye"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-3.5 bg-gray-50 rounded-lg mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-sans-luxury text-[#996515] font-bold tracking-wider block">
                    Usta İmzası
                  </span>
                  <span className="font-serif-luxury text-base font-bold text-gray-900">Mehmet Hamdemirci</span>
                </div>
                <span className="text-xs font-sans-luxury text-gray-500">Kurucu & Sarraf</span>
              </div>
            </div>

            {/* Boutique Visit Card */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c89d3a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif-luxury text-xs font-bold text-gray-900">Bursa Kapalıçarşı Mağazamız</h4>
                  <p className="text-xs text-gray-600 font-sans-luxury mt-0.5">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60 text-xs text-gray-600 font-sans-luxury">
                <Clock className="w-3.5 h-3.5 text-[#c89d3a] shrink-0" />
                <span>{CONTACT_INFO.hours}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
