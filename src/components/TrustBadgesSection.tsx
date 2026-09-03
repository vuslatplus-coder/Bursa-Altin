import React from 'react';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Award,
  CreditCard,
  Building,
  PhoneCall
} from 'lucide-react';

export const TrustBadgesSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          
          {/* Badge 1: Insured Shipping */}
          <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4 first:pl-0">
            <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#c89d3a] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 font-sans-luxury">
                %100 Sigortalı Kargo
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Tüm siparişleriniz teslim edilene kadar değerinde tam sigortalı ve zırhlı kargo ile gönderilir.
              </p>
            </div>
          </div>

          {/* Badge 2: Certified Hallmark */}
          <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
            <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#c89d3a] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 font-sans-luxury">
                Darphane & Orijinallik
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Bütün altın takılarımız ayar patentli, pırlantalarımız uluslararası HRD/GIA sertifikalıdır.
              </p>
            </div>
          </div>

          {/* Badge 3: Lifetime Maintenance */}
          <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4">
            <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#c89d3a] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 font-sans-luxury">
                Ömür Boyu Ücretsiz Bakım
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Mehmet Hamdemirci mağazalarımızda ömür boyu ücretsiz ultrasonik temizlik ve cila hizmeti.
              </p>
            </div>
          </div>

          {/* Badge 4: Bursa Kapalıçarşı Trust */}
          <div className="flex items-start gap-3.5 pt-4 sm:pt-0 sm:px-4 last:pr-0">
            <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#c89d3a] shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 font-sans-luxury">
                Kapalıçarşı Sarraf Güveni
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Bursa Tarihi Bedesten ve Sur Yapı Marka AVM mağazalarımızla 40 yıllık köklü sarrafiye tecrübesi.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
