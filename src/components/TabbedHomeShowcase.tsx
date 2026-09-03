import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Scale,
  Eye,
  Check,
  Flame,
  Truck,
  Star
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS_CATALOG } from '../data/productsData';
import { CustomCategory, DEFAULT_CATEGORIES } from '../data/categoriesData';
import { CONTACT_INFO } from '../data/mockData';
import { analytics } from '../services/analyticsService';

interface TabbedHomeShowcaseProps {
  onSelectProduct: (product: Product, initialTab?: 'details' | 'gallery') => void;
  onToggleWishlist?: (product: Product) => void;
  wishlistIds?: string[];
  onNavigateCatalog: (categoryKey?: string) => void;
  productsList?: Product[];
  categoriesList?: CustomCategory[];
  likesMap?: Record<string, number>;
  userLikedIds?: string[];
  onToggleLike?: (productId: string) => void;
}

export const TabbedHomeShowcase: React.FC<TabbedHomeShowcaseProps> = ({
  onSelectProduct,
  onToggleWishlist = (_p: Product) => {},
  wishlistIds = [],
  onNavigateCatalog,
  productsList = PRODUCTS_CATALOG,
  categoriesList = DEFAULT_CATEGORIES,
  likesMap = {},
  userLikedIds = [],
  onToggleLike,
}) => {
  const [activeTab, setActiveTab] = useState<string>('bestseller');

  // Filter products based on active tab
  const getFilteredProducts = (): Product[] => {
    if (activeTab === 'bestseller') {
      return productsList.filter((p) => p.isBestseller);
    }
    if (activeTab === 'new') {
      return productsList.filter((p) => p.isNew);
    }
    return productsList.filter((p) => p.category === activeTab);
  };

  const products = getFilteredProducts();

  // Enabled Categories for Showcase Tabs
  const enabledCategories = categoriesList.filter(c => c.isEnabled !== false);

  const getWhatsAppProductMessage = (product: Product) => {
    return encodeURIComponent(
      `Merhaba Mehmet Hamdemirci Kuyumculuk,\n\n"${product.title}" (${product.code} - ${product.karat} ${product.weightGrams} gr) ürünü hakkında kesin fiyat teklifi, stok ve sipariş bilgisi almak istiyorum.\nFiyat: ${product.price.toLocaleString('tr-TR')} ₺`
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Section Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-3 border-b border-gray-200">
        <div>
          <span className="text-xs font-sans-luxury font-bold uppercase tracking-widest text-[#996515] block mb-1">
            BURSA KAPALIÇARŞI SEÇKİSİ
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl text-gray-900 font-bold">
            Öne Çıkan Mücevher & Altın Koleksiyonu
          </h2>
        </div>

        {/* E-Commerce Showcase Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('bestseller')}
            className={`px-3.5 py-2 text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'bestseller'
                ? 'bg-[#c89d3a] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Çok Satanlar
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`px-3.5 py-2 text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'new'
                ? 'bg-[#c89d3a] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yeni Gelenler
          </button>

          {enabledCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-3.5 py-2 text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
                activeTab === cat.id
                  ? 'bg-[#c89d3a] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product) => {
          const isWishlisted = (wishlistIds || []).includes(product.id);
          const isLiked = userLikedIds.includes(product.id);
          const totalLikes = likesMap[product.id] ?? product.likesCount ?? 0;

          return (
            <div
              key={product.id}
              className="bg-white border border-gray-200 hover:border-[#c89d3a] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              
              {/* Product Image Stage */}
              <div
                className="relative aspect-square bg-[#f8f9fa] overflow-hidden cursor-pointer"
                onClick={() => onSelectProduct(product, 'details')}
              >
                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                  <span className="px-2 py-0.5 bg-[#996515] text-white text-[10px] font-bold rounded-sm shadow-xs uppercase tracking-wider">
                    {product.karat}
                  </span>
                  {product.originalPrice && (
                    <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-sm shadow-xs">
                      İNDİRİM
                    </span>
                  )}
                  {product.category === 'yatirim' && (
                    <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-sm shadow-xs">
                      BORSA KURU
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full transition-colors shadow-xs ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-white/90 text-gray-500 hover:text-rose-600 hover:bg-white'
                  }`}
                  title={isWishlisted ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                </button>

                {/* Main Product Image */}
                <img
                  src={product.thumbnailUrl}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />

                {/* Bottom Overlay: Direct Likes & View Action Badges */}
                <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-xs z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleLike) onToggleLike(product.id);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-xs transition-all ${
                      isLiked
                        ? 'bg-rose-500/90 text-white'
                        : 'bg-black/50 text-white hover:bg-black/70 hover:text-rose-400'
                    }`}
                    title="Görseli Beğen"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                    <span className="font-mono">{totalLikes}</span>
                  </button>

                  <button
                    onClick={() => onSelectProduct(product, 'details')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/50 text-white hover:bg-black/70 backdrop-blur-xs transition-all"
                    title="Detaylı İncele"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>İncele</span>
                  </button>
                </div>
              </div>

              {/* Product Info & Pricing */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-sans-luxury mb-1">
                    <span className="font-mono text-[#996515] font-semibold">{product.code}</span>
                    <span className="flex items-center gap-1">
                      <Scale className="w-3 h-3 text-[#c89d3a]" />
                      <span className="font-mono">{product.weightGrams} gr</span>
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(product, 'details')}
                    className="font-serif-luxury text-sm font-bold text-gray-900 line-clamp-2 hover:text-[#996515] cursor-pointer transition-colors"
                  >
                    {product.title}
                  </h3>
                </div>

                {/* Price & Free Insured Shipping note */}
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through mr-2 font-mono">
                          {product.originalPrice.toLocaleString('tr-TR')} ₺
                        </span>
                      )}
                      <span className="font-mono text-base font-bold text-gray-900 group-hover:text-[#b38728] transition-colors">
                        {product.price.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                    <Truck className="w-3 h-3" />
                    <span>Ücretsiz Sigortalı Kargo</span>
                  </div>
                </div>

                {/* Action Buttons: WhatsApp Fiyat Sor + Ürünü İncele */}
                <div className="pt-2 flex gap-2">
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${getWhatsAppProductMessage(product)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analytics.contactSarrafWhatsApp('Anasayfa Vitrini', product.title)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp ile Fiyat Sor</span>
                  </a>

                  <button
                    onClick={() => onSelectProduct(product, 'details')}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100 text-[#996515] border border-amber-200 rounded-xl transition-colors flex items-center justify-center"
                    title="Ürünü Detaylı İncele"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => onNavigateCatalog('all')}
          className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white text-xs font-sans-luxury font-bold uppercase tracking-widest rounded-xl shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Tüm Vitrin Ürünlerini Görüntüle</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
