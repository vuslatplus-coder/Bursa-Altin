import React from 'react';
import { Product } from '../types';
import { PRODUCTS_CATALOG } from '../data/productsData';
import { CONTACT_INFO } from '../data/mockData';
import { Sparkles, Eye, MessageSquare, ArrowRight, Scale, Award } from 'lucide-react';

interface FeaturedProductsSectionProps {
  onSelectProduct: (product: Product) => void;
  onNavigateCatalog: (category?: string) => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onSelectProduct,
  onNavigateCatalog,
}) => {
  const featuredItems = PRODUCTS_CATALOG.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="featured-products-section">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#d4af37]/30 bg-[#161616] text-[10px] font-sans-luxury uppercase tracking-[0.25em] text-[#f2ca50] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Öne Çıkan Başyapıtlar
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-[#f7e7ce]">
            Vitrinimizin Seçkin Mücevherleri
          </h2>
        </div>

        <button
          onClick={() => onNavigateCatalog('all')}
          className="text-xs font-sans-luxury uppercase tracking-widest text-[#d4af37] hover:text-[#f2ca50] flex items-center gap-1.5 self-start md:self-auto group"
        >
          <span>Tüm Kataloğu İncele ({PRODUCTS_CATALOG.length} Model)</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Grid of 4 Featured Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredItems.map((product) => {
          const whatsappLink = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
            `Merhaba, vitrindeki "${product.title}" (${product.code} - ${product.karat}) hakkında bilgi almak istiyorum.`
          )}`;

          return (
            <div
              key={product.id}
              className="group bg-[#141414] border border-[#f7e7ce]/15 hover:border-[#d4af37] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#090909]">
                <img
                  src={product.thumbnailUrl}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />

                {/* Karat Tag */}
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#0f0f0f]/90 border border-[#d4af37]/40 text-[10px] font-sans-luxury uppercase tracking-widest text-[#f2ca50] font-semibold">
                  {product.karat}
                </div>

                {/* Handcrafted Badge */}
                {product.isHandcrafted && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#d4af37] text-[#0f0f0f] text-[9px] font-sans-luxury font-bold uppercase tracking-wider">
                    El Zanaatı
                  </div>
                )}

                {/* Gramaj Info */}
                <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-sans-luxury text-[#e5e2e1]/90 bg-black/60 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                  <Scale className="w-3 h-3 text-[#d4af37]" />
                  <span>{product.weightGrams} gr</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-sans-luxury uppercase tracking-[0.2em] text-[#d4af37] font-semibold">
                    {product.categoryLabel}
                  </span>
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-serif-luxury text-lg text-[#f7e7ce] mt-1 font-normal line-clamp-1 hover:text-[#f2ca50] cursor-pointer transition-colors"
                  >
                    {product.title}
                  </h3>
                  <p className="font-sans-luxury text-xs text-[#e5e2e1]/65 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price and CTA */}
                <div className="mt-5 pt-4 border-t border-[#f7e7ce]/10">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#e5e2e1]/50 font-sans-luxury block">
                        Fiyat
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif-luxury text-xl font-semibold text-[#f2ca50]">
                          {product.price.toLocaleString('tr-TR')} ₺
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs line-through text-[#e5e2e1]/40 font-sans-luxury">
                            {product.originalPrice.toLocaleString('tr-TR')} ₺
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3 py-1.5 text-xs font-sans-luxury tracking-wider text-[#d4af37] border border-[#d4af37]/40 hover:border-[#f2ca50] hover:bg-[#d4af37]/10 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      İncele
                    </button>
                  </div>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-[#1b1915] hover:bg-[#d4af37] text-[#f7e7ce] hover:text-[#0f0f0f] border border-[#d4af37]/30 hover:border-[#d4af37] font-sans-luxury text-[11px] font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#d4af37]" />
                    WhatsApp ile Fiyat Sor
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
