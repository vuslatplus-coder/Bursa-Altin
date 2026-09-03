import React from 'react';
import { Product } from '../types';
import { CONTACT_INFO } from '../data/mockData';
import { analytics } from '../services/analyticsService';
import {
  X,
  Heart,
  Trash2,
  Eye,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveWishlist,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  // Build grouped WhatsApp message with all favorited products
  const handleAskAllViaWhatsApp = () => {
    if (wishlistProducts.length === 0) return;
    const itemsList = wishlistProducts
      .map((p, idx) => `${idx + 1}. ${p.title} (${p.code}) - ${p.karat}, ${p.weightGrams}gr`)
      .join('\n');
    const message = `Merhaba Mehmet Hamdemirci Kuyumculuk, favorilerime eklediğim aşağıdaki ürünler hakkında toplu bilgi ve güncel fiyat teklifi almak istiyorum:\n\n${itemsList}`;
    analytics.contactSarrafWhatsApp('Favoriler Toplu Teklif', `${wishlistProducts.length} Ürün`);
    window.open(`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 text-gray-900 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-base font-bold text-gray-900">
                  Favori Ürünlerim
                </h3>
                <span className="text-[11px] font-sans-luxury text-gray-500">
                  {wishlistProducts.length} Ürün Kaydedildi
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#fafafa]">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white rounded-xl border border-gray-200">
                <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
                  <Heart className="w-7 h-7 opacity-60" />
                </div>
                <h4 className="font-serif-luxury text-base font-bold text-gray-900">
                  Henüz Favoriniz Yok
                </h4>
                <p className="text-xs text-gray-500 font-sans-luxury max-w-xs leading-relaxed">
                  Beğendiğiniz 22 ayar altın, tektaş veya gerdanlıkları kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-[#c89d3a] hover:bg-[#b38728] text-white text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors"
                >
                  Vitrine Göz At
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 bg-white border border-gray-200 rounded-lg flex gap-3 items-center shadow-xs"
                >
                  <img
                    src={product.thumbnailUrl}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-cover rounded border border-gray-200 shrink-0 bg-white cursor-pointer"
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-semibold text-[#996515]">
                        {product.code}
                      </span>
                      <button
                        onClick={() => onRemoveWishlist(product.id)}
                        className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                        title="Favorilerden Çıkar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="font-serif-luxury text-xs font-bold text-gray-900 truncate hover:text-[#996515] cursor-pointer"
                    >
                      {product.title}
                    </h4>

                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-sans-luxury mt-0.5">
                      <span className="font-semibold text-gray-700">{product.karat}</span>
                      <span>•</span>
                      <span className="font-mono text-gray-700">
                        {product.weightGrams} gr
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100 gap-2">
                      <span className="font-mono text-xs font-bold text-[#b38728]">
                        {product.price.toLocaleString('tr-TR')} ₺
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectProduct(product);
                          }}
                          className="p-1 text-gray-600 hover:text-gray-900 border border-gray-200 rounded hover:bg-gray-50"
                          title="İncele"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(`Merhaba Mehmet Hamdemirci Kuyumculuk, favorilerimdeki "${product.title}" [Kod: ${product.code}] hakkında güncel fiyat ve detay öğrenmek istiyorum.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => analytics.contactSarrafWhatsApp('Favori Ürün', product.title)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-sans-luxury font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Fiyat Sor</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-white space-y-2">
              <button
                onClick={handleAskAllViaWhatsApp}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Tüm Favoriler İçin WhatsApp'tan Teklif Al</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-sans-luxury font-semibold uppercase tracking-wider rounded-lg transition-all"
              >
                Kataloğa Geri Dön
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
