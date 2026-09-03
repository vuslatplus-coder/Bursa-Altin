import React, { useState } from 'react';
import { SNEAK_PEEK_COLLECTION } from '../data/mockData';
import { CollectionItem } from '../types';
import { Sparkles, Eye, X, Check, Gem, ShieldCheck, MessageSquare, Calendar } from 'lucide-react';
import { CONTACT_INFO } from '../data/productsData';

interface CollectionPreviewProps {
  onOpenAppointment?: () => void;
  onOpenWaitlist?: () => void;
}

export const CollectionPreview: React.FC<CollectionPreviewProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<CollectionItem | null>(null);

  const categories = [
    { id: 'all', label: 'Tüm Koleksiyon' },
    { id: 'bilezik', label: 'Bursa Hasır & Bilezikler' },
    { id: 'pirlanta', label: 'Pırlanta & Tektaş' },
    { id: 'kulce-ziynet', label: '24K Has Külçe Serisi' },
    { id: 'ozel-tasarim', label: 'Haute Joaillerie (Özel)' }
  ];

  const filteredItems = selectedCategory === 'all'
    ? SNEAK_PEEK_COLLECTION
    : SNEAK_PEEK_COLLECTION.filter((i) => i.category === selectedCategory);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="collection-preview-section">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-[10px] font-sans-luxury uppercase tracking-widest text-[#996515] font-bold rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#c89d3a]" />
          Özel Seri & Lansman Koleksiyonu
        </div>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl text-gray-900 font-bold">
          Zarafetin ve Ustalığın Geleceği
        </h2>
        <p className="font-sans-luxury text-xs sm:text-sm text-gray-500 mt-2">
          Bursa Altın dijital vitrininde sergilenen, Mehmet Hamdemirci atölyelerinde sınırlı sayıda üretilen seçkin tasarımlara göz atın.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-md transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#c89d3a] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Jewelry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-gray-200 rounded-xl hover:border-[#c89d3a] hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xs"
          >
            {/* Image Container */}
            <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-xs border border-gray-200 text-[10px] font-sans-luxury font-bold uppercase tracking-wider text-[#996515] rounded">
                {item.karat}
              </div>

              {item.isExclusive && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#c89d3a] text-white text-[9px] font-sans-luxury font-bold uppercase tracking-wider rounded">
                  Özel Seri
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans-luxury uppercase tracking-wider text-[#996515] font-bold">
                  {item.categoryLabel}
                </span>
                <h3 className="font-serif-luxury text-base text-gray-900 mt-1 font-bold line-clamp-1">
                  {item.title}
                </h3>
                <p className="font-sans-luxury text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-sans-luxury text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#c89d3a]" />
                  {item.estimatedLaunch}
                </span>
                <button
                  onClick={() => setActiveItem(item)}
                  className="px-2.5 py-1 text-xs font-sans-luxury font-bold text-[#996515] bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  İncele
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Commission Banner */}
      <div className="mt-10 p-6 sm:p-8 bg-gradient-to-r from-amber-50 to-[#fdfaf2] border border-amber-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="max-w-2xl">
          <span className="text-[11px] font-sans-luxury uppercase tracking-wider text-[#996515] font-bold">
            Özel Mücevher Siparişi & Atölye
          </span>
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-gray-900 font-bold mt-1">
            Kendi Eşsiz Tasarımınızı Mehmet Hamdemirci Atölyesinde Hayata Geçirin
          </h3>
          <p className="font-sans-luxury text-xs sm:text-sm text-gray-600 mt-2">
            Aklınızdaki özel bilezik, alyans veya tektaş modelini ustanın maharetiyle kişiselleştirin.
          </p>
        </div>
        <a
          href="https://wa.me/905321234567?text=Merhaba%20Mehmet%20Hamdemirci%20Kuyumculuk,%20%C3%B6zel%20tasar%C4%B1m%20ve%20at%C3%B6lye%20sipari%C5%9Fi%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans-luxury text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs whitespace-nowrap transition-all text-center inline-block"
        >
          Atölyeye WhatsApp ile Danış
        </a>
      </div>

      {/* Modal for Item Details */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3.5">
                <span className="text-[10px] font-sans-luxury uppercase tracking-wider text-[#996515] font-bold">
                  {activeItem.categoryLabel}
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl text-gray-900 font-bold">
                  {activeItem.title}
                </h3>
                <div className="inline-block px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-xs font-sans-luxury font-bold text-[#996515] rounded">
                  {activeItem.karat}
                </div>
                <p className="text-xs text-gray-600 font-sans-luxury leading-relaxed">
                  {activeItem.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-sans-luxury font-bold">
                    Öne Çıkan Nitelikler:
                  </span>
                  {activeItem.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                      <Check className="w-3.5 h-3.5 text-[#c89d3a]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(`Merhaba, ${activeItem.title} koleksiyon modeli hakkında bilgi ve fiyat almak istiyorum.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase font-sans-luxury font-bold tracking-wider rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp ile Fiyat & Bilgi Al</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
