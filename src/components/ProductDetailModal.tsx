import React, { useState } from 'react';
import { Product } from '../types';
import { CONTACT_INFO } from '../data/mockData';
import { analytics } from '../services/analyticsService';
import {
  X,
  ShieldCheck,
  Award,
  Sparkles,
  Calendar,
  Check,
  Scale,
  Gem,
  Clock,
  Share2,
  Info,
  Heart,
  Truck,
  MessageSquare,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Phone
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onOpenAppointment?: (productTitle?: string) => void;
  onShowToast: (msg: string) => void;
  likesCount: number;
  isLikedByUser: boolean;
  onToggleLike: (productId: string) => void;
  initialTab?: 'details' | 'gallery';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onToggleWishlist,
  isWishlisted,
  onShowToast,
  likesCount,
  isLikedByUser,
  onToggleLike,
  initialTab = 'details',
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'gallery'>(initialTab);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnailUrl];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Ürün bağlantısı panoya kopyalandı.');
    } else {
      onShowToast('Ürün: ' + product.title);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Merhaba Mehmet Hamdemirci Kuyumculuk,\n\n"${product.title}" (${product.code} - ${product.karat}, ${product.weightGrams} gr) hakkında detaylı bilgi, güncel fiyat ve mağaza stoğu sormak istiyorum.\nFiyat: ${product.price.toLocaleString('tr-TR')} ₺`
  );

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="product-detail-modal-container"
        className="relative bg-white rounded-2xl border border-gray-200 max-w-5xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header Bar with Live Likes & Action Icons */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-200 bg-gray-50/90">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="px-2.5 py-0.5 text-[10px] font-sans-luxury uppercase tracking-wider bg-[#fff9e6] text-[#996515] border border-amber-300 font-bold rounded">
              {product.karat}
            </span>
            <span className="text-xs font-mono text-gray-500 font-semibold">
              KOD: {product.code}
            </span>
            {product.createdAt && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                <Calendar className="w-3 h-3 text-gray-400" />
                {product.createdAt}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Interactive Like Button */}
            <button
              onClick={() => onToggleLike(product.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isLikedByUser
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 ring-2 ring-rose-100'
                  : 'bg-white text-gray-600 border border-gray-200 hover:text-rose-600 hover:border-rose-200'
              }`}
              title={isLikedByUser ? 'Beğenmekten Vazgeç' : 'Bu Mücevheri Beğen'}
            >
              <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isLikedByUser ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span className="font-mono text-[11px] font-bold">{likesCount}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => onToggleWishlist(product)}
              title={isWishlisted ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
              className={`p-2 rounded-full transition-colors ${
                isWishlisted ? 'bg-rose-100 text-rose-600' : 'bg-white text-gray-500 hover:text-rose-600 border border-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              title="Bağlantıyı Paylaş"
              className="p-2 text-gray-500 hover:text-gray-900 rounded-full bg-white hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-900 rounded-full bg-white hover:bg-gray-100 border border-gray-200 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-gray-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-sans-luxury font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-[#c89d3a] text-[#996515]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Mücevher Özellikleri</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3 px-4 text-xs font-sans-luxury font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'gallery'
                ? 'border-[#c89d3a] text-[#996515]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Fotoğraf & Yakın Çekim ({images.length})</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto">
          
          {/* TAB 1: PRODUCT DETAILS */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Left Column: Main Image & Gallery Strip */}
              <div className="md:col-span-5 p-6 bg-[#f8f9fa] flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200">
                <div>
                  {/* Main Active Image with Interactive Zoom */}
                  <div
                    className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white group shadow-xs cursor-pointer"
                    onClick={() => setActiveTab('gallery')}
                  >
                    <img
                      src={images[selectedImageIndex] || product.thumbnailUrl}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur-xs text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-4 h-4" />
                    </div>

                    {product.isHandcrafted && (
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/80 backdrop-blur-xs text-[9px] font-sans-luxury text-white uppercase tracking-wider rounded flex items-center gap-1 font-semibold">
                        <Sparkles className="w-3 h-3 text-[#f59e0b]" />
                        Özel El Zanaatı
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Selector */}
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-14 h-14 rounded-lg border overflow-hidden transition-all shrink-0 ${
                            selectedImageIndex === idx
                              ? 'border-[#c89d3a] ring-2 ring-[#c89d3a]/30 shadow-xs'
                              : 'border-gray-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Consultation Box */}
                <div className="mt-6 p-3.5 bg-white border border-gray-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Kapalıçarşı Baş Sarrafı ile Görüşün</span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-sans-luxury">
                    Özel ölçü, gramaj ve kişiye özel tasarım talepleriniz için WhatsApp'tan anında bilgi alın.
                  </p>
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold text-center block transition-colors"
                  >
                    WhatsApp ile Danış
                  </a>
                </div>
              </div>

              {/* Right Column: Specifications, Price & Actions */}
              <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="uppercase tracking-widest text-[#996515] font-bold font-sans-luxury">
                      {product.categoryLabel}
                    </span>
                    <span className="font-mono text-gray-400">Ürün No: #{product.id}</span>
                  </div>

                  <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                    {product.title}
                  </h2>
                </div>

                {/* Price & Stock Banner */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 block font-sans-luxury">Tavsiye Edilen Satış Fiyatı</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold text-gray-900">
                        {product.price.toLocaleString('tr-TR')} ₺
                      </span>
                      {product.originalPrice && (
                        <span className="font-mono text-sm text-gray-400 line-through">
                          {product.originalPrice.toLocaleString('tr-TR')} ₺
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {product.inStock ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5" /> Stokta Mevcut
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> Sipariş Üzerine Hazırlanır
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 block mt-1">Kapalıçarşı Atölye Çıkışlı</span>
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Tasarım & Zanaat Hikayesi
                  </h4>
                  <p className="text-xs text-gray-600 font-sans-luxury leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Technical Specifications Table */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Teknik Özellikler & Sertifika Bilgisi
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">Maden Ayarı:</span>
                      <span className="font-bold text-gray-800">{product.specs.purity}</span>
                    </div>

                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">Net Ağırlık:</span>
                      <span className="font-bold text-gray-800">{product.specs.weight}</span>
                    </div>

                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">Altın Rengi:</span>
                      <span className="font-bold text-gray-800">{product.specs.goldColor}</span>
                    </div>

                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[10px]">Taş / Pırlanta Cinsi:</span>
                      <span className="font-bold text-gray-800">{product.specs.stoneType || 'Saf Altın'}</span>
                    </div>

                    {product.specs.stoneCarat && (
                      <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 col-span-2">
                        <span className="text-gray-400 block text-[10px]">Karat / Berraklık:</span>
                        <span className="font-bold text-gray-800">
                          {product.specs.stoneCarat} - {product.specs.stoneClarity || ''} {product.specs.stoneColor || ''}
                        </span>
                      </div>
                    )}

                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 col-span-2">
                      <span className="text-gray-400 block text-[10px]">Sertifika & Güvence:</span>
                      <span className="font-bold text-gray-800">{product.specs.certificate}</span>
                    </div>
                  </div>
                </div>

                {/* Highlights List */}
                {product.highlights && product.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Öne Çıkan Ayrıcalıklar
                    </h4>
                    <ul className="space-y-1.5">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <Check className="w-3.5 h-3.5 text-[#c89d3a] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(`Merhaba Mehmet Hamdemirci Kuyumculuk, "${product.title}" [Kod: ${product.code}] ürünü hakkında anlık sarraf fiyatı almak ve rezerve etmek istiyorum.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analytics.contactSarrafWhatsApp('Ürün Detay Modalı', product.title)}
                    className="flex-1 py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp ile Anlık Fiyat Al & Danış</span>
                  </a>

                  <a
                    href={`tel:${CONTACT_INFO.phoneRaw}`}
                    onClick={() => analytics.callStore()}
                    className="py-3.5 px-4 bg-amber-50 hover:bg-amber-100 text-[#996515] border border-amber-200 text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Telefonla Bilgi Al</span>
                  </a>
                </div>

                {/* Trust Features Strip */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
                  <div className="p-2">
                    <Truck className="w-4 h-4 text-[#c89d3a] mx-auto mb-1" />
                    <span className="text-[10px] font-semibold text-gray-600 block">Ücretsiz Sigortalı Kargo</span>
                  </div>
                  <div className="p-2">
                    <ShieldCheck className="w-4 h-4 text-[#c89d3a] mx-auto mb-1" />
                    <span className="text-[10px] font-semibold text-gray-600 block">Darphane & Sarraf Ayar Damgası</span>
                  </div>
                  <div className="p-2">
                    <Award className="w-4 h-4 text-[#c89d3a] mx-auto mb-1" />
                    <span className="text-[10px] font-semibold text-gray-600 block">Ömür Boyu Bakım Garantisi</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: HIGH RESOLUTION GALLERY & ZOOM */}
          {activeTab === 'gallery' && (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Full Featured Zoom Stage */}
              <div
                className={`relative bg-black rounded-2xl overflow-hidden flex items-center justify-center select-none cursor-crosshair min-h-[420px] transition-all ${
                  isZoomed ? 'scale-102 ring-4 ring-[#c89d3a]/40' : ''
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={images[selectedImageIndex] || product.thumbnailUrl}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className={`max-h-[500px] w-auto object-contain transition-transform duration-300 ${
                    isZoomed ? 'scale-160 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                />

                {/* Left/Right Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                      }}
                      className="absolute left-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                      title="Önceki Fotoğraf"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                      }}
                      className="absolute right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                      title="Sonraki Fotoğraf"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Zoom State Indicator */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono rounded">
                  {selectedImageIndex + 1} / {images.length} • {isZoomed ? 'Yakınlaştırma Aktif' : 'Büyütmek için Tıkla'}
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer aspect-square bg-gray-100 transition-all ${
                      selectedImageIndex === idx ? 'border-[#c89d3a] shadow-md ring-2 ring-[#c89d3a]/20' : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Görsel ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-mono rounded">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
