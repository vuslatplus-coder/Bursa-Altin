import React, { useState } from 'react';
import { SNEAK_PEEK_COLLECTION } from '../data/mockData';
import { CollectionItem } from '../types';
import { Sparkles, Eye, X, Check, Gem, ShieldCheck, Calendar } from 'lucide-react';

interface CollectionPreviewProps {
  onOpenAppointment: () => void;
  onOpenWaitlist: () => void;
}

export const CollectionPreview: React.FC<CollectionPreviewProps> = ({
  onOpenAppointment,
  onOpenWaitlist,
}) => {
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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="collection-preview-section">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#d4af37]/30 bg-[#161616] text-[10px] font-sans-luxury uppercase tracking-[0.25em] text-[#f2ca50] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Önizleme & Lansman Koleksiyonu
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f7e7ce]">
          Zarafetin ve Ustalığın Geleceği
        </h2>
        <p className="font-sans-luxury text-sm text-[#e5e2e1]/70 mt-3">
          Bursa Altın dijital vitrininde yakında sergilenecek, Mehmet Hamdemirci atölyelerinde sınırlı sayıda üretilen seçkin tasarımlara göz atın.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-sans-luxury uppercase tracking-wider transition-all border ${
              selectedCategory === cat.id
                ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f2ca50]'
                : 'border-[#f7e7ce]/15 text-[#e5e2e1]/70 hover:border-[#d4af37]/40 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Jewelry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-[#141414] border border-[#f7e7ce]/15 hover:border-[#d4af37] transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative aspect-4/3 overflow-hidden bg-[#0a0a0a]">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
              
              {/* Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0f0f0f]/90 border border-[#d4af37]/40 text-[10px] font-sans-luxury uppercase tracking-widest text-[#f2ca50]">
                {item.karat}
              </div>

              {item.isExclusive && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#d4af37] text-[#0f0f0f] text-[9px] font-sans-luxury font-bold uppercase tracking-widest">
                  Özel Seri
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans-luxury uppercase tracking-[0.2em] text-[#d4af37]">
                  {item.categoryLabel}
                </span>
                <h3 className="font-serif-luxury text-lg text-[#f7e7ce] mt-1 font-normal line-clamp-1">
                  {item.title}
                </h3>
                <p className="font-sans-luxury text-xs text-[#e5e2e1]/65 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#f7e7ce]/10 flex items-center justify-between">
                <span className="text-[11px] font-sans-luxury text-[#e5e2e1]/50 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#d4af37]" />
                  {item.estimatedLaunch}
                </span>
                <button
                  onClick={() => setActiveItem(item)}
                  className="px-3 py-1.5 text-xs font-sans-luxury tracking-wider text-[#d4af37] border border-[#d4af37]/40 hover:border-[#f2ca50] hover:bg-[#d4af37]/10 transition-colors flex items-center gap-1"
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
      <div className="mt-14 p-8 bg-[#161616] border border-[#d4af37]/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          <span className="text-[11px] font-sans-luxury uppercase tracking-[0.25em] text-[#d4af37]">
            Özel Mücevher Siparişi
          </span>
          <h3 className="font-serif-luxury text-2xl text-[#f7e7ce] mt-1">
            Kendi Eşsiz Tasarımınızı Mehmet Hamdemirci Atölyesinde Hayata Geçirin
          </h3>
          <p className="font-sans-luxury text-xs sm:text-sm text-[#e5e2e1]/70 mt-2">
            Aklınızdaki özel bilezik, alyans veya tektaş modelini ustanın maharetiyle kişiselleştirin.
          </p>
        </div>
        <button
          onClick={onOpenAppointment}
          className="px-6 py-3 bg-[#d4af37] hover:bg-[#f2ca50] text-[#0f0f0f] font-sans-luxury text-xs font-semibold uppercase tracking-[0.2em] whitespace-nowrap transition-all"
        >
          Tasarım Randevusu Al
        </button>
      </div>

      {/* Modal for Item Details */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161616] border border-[#d4af37] max-w-2xl w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 text-[#e5e2e1]/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-square bg-black border border-[#f7e7ce]/15 overflow-hidden">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-sans-luxury uppercase tracking-[0.25em] text-[#d4af37]">
                  {activeItem.categoryLabel}
                </span>
                <h3 className="font-serif-luxury text-2xl text-[#f7e7ce]">
                  {activeItem.title}
                </h3>
                <div className="inline-block px-3 py-1 bg-[#1f1d17] border border-[#d4af37]/40 text-xs font-sans-luxury text-[#f2ca50]">
                  {activeItem.karat}
                </div>
                <p className="text-xs text-[#e5e2e1]/80 font-sans-luxury leading-relaxed">
                  {activeItem.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#f7e7ce]/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#e5e2e1]/50 font-sans-luxury">
                    Öne Çıkan Nitelikler:
                  </span>
                  {activeItem.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#f7e7ce]">
                      <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setActiveItem(null);
                      onOpenWaitlist();
                    }}
                    className="w-full py-2.5 bg-[#d4af37] hover:bg-[#f2ca50] text-[#0f0f0f] text-xs uppercase font-sans-luxury font-semibold tracking-wider"
                  >
                    Bu Ürün İçin VIP Lansman Uyarısı Al
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
