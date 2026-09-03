import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Tag,
  Scale,
  Calendar,
  Gem,
  Flame,
  ShieldCheck,
  Truck
} from 'lucide-react';
import {
  KARAT_FILTERS,
  DATE_FILTERS,
  CATEGORY_SUBCATEGORIES,
  DIAMOND_CARAT_FILTERS
} from '../data/productsData';

export interface FilterSidebarProps {
  categories: { id: string; label: string; count?: number }[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;

  selectedSubCategory: string;
  onSelectSubCategory: (sub: string) => void;

  selectedKarat: string;
  onSelectKarat: (karat: string) => void;

  selectedCaratRange: string;
  onSelectCaratRange: (range: string) => void;

  minPrice: string;
  maxPrice: string;
  onChangePrice: (min: string, max: string) => void;

  selectedGoldColor: string;
  onSelectGoldColor: (color: string) => void;

  selectedStoneType: string;
  onSelectStoneType: (stone: string) => void;

  selectedWeightRange: string;
  onSelectWeightRange: (range: string) => void;

  selectedDateFilter: 'all' | 'last-7-days' | 'last-30-days' | 'this-year';
  onSelectDateFilter: (filter: 'all' | 'last-7-days' | 'last-30-days' | 'this-year') => void;

  handcraftedOnly: boolean;
  onToggleHandcrafted: (val: boolean) => void;

  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;

  onSaleOnly: boolean;
  onToggleOnSale: (val: boolean) => void;

  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalMatchingCount: number;

  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

const GOLD_COLORS = [
  { id: 'all', label: 'Tüm Renkler' },
  { id: 'beyaz', label: 'Beyaz Altın', colorCode: '#e2e8f0' },
  { id: 'sari', label: 'Sarı Altın', colorCode: '#eab308' },
  { id: 'rose', label: 'Rose Gold', colorCode: '#fb7185' },
];

const STONE_TYPES = [
  { id: 'all', label: 'Tümü' },
  { id: 'pirlanta', label: 'Pırlanta & Elmas' },
  { id: 'zirkon', label: 'Taşlı / Zirkon' },
  { id: 'tassiz', label: 'Sade / Taşsız' },
];

const WEIGHT_RANGES = [
  { id: 'all', label: 'Tümü' },
  { id: 'light', label: 'Zarif (< 5 gr)' },
  { id: 'medium', label: 'Orta (5 - 15 gr)' },
  { id: 'heavy', label: 'Dolgun (15+ gr)' },
];

const PRICE_PRESETS = [
  { label: '15.000 ₺ altı', min: '', max: '15000' },
  { label: '15.000 - 35.000 ₺', min: '15000', max: '35000' },
  { label: '35.000 - 75.000 ₺', min: '35000', max: '75000' },
  { label: '75.000 ₺ üzeri', min: '75000', max: '' },
];

export const CatalogFilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSubCategory,
  onSelectSubCategory,
  selectedKarat,
  onSelectKarat,
  selectedCaratRange,
  onSelectCaratRange,
  minPrice,
  maxPrice,
  onChangePrice,
  selectedGoldColor,
  onSelectGoldColor,
  selectedStoneType,
  onSelectStoneType,
  selectedWeightRange,
  onSelectWeightRange,
  selectedDateFilter,
  onSelectDateFilter,
  handcraftedOnly,
  onToggleHandcrafted,
  inStockOnly,
  onToggleInStock,
  onSaleOnly,
  onToggleOnSale,
  onResetFilters,
  hasActiveFilters,
  totalMatchingCount,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
}) => {
  const [openSections, setOpenSections] = useState({
    subCategories: true,
    carat: true,
    karat: true,
    price: true,
    attributes: true,
    goldColor: true,
    stone: false,
    weight: false,
    date: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentSubCategories = selectedCategory !== 'all' && CATEGORY_SUBCATEGORIES[selectedCategory]
    ? CATEGORY_SUBCATEGORIES[selectedCategory]
    : null;

  const isDiamondMode = selectedCategory === 'yuzuk' || selectedSubCategory === 'tektas' || selectedSubCategory === 'baget' || selectedSubCategory === 'bestas';

  const renderContent = () => (
    <div className="space-y-6 text-xs font-sans-luxury">
      
      {/* Sidebar Top Header with Active Filter Count & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#996515]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-sm font-bold text-gray-900">Filtreleme</h3>
            <span className="text-[11px] text-gray-500 font-mono">
              {totalMatchingCount} model listelendi
            </span>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] text-amber-800 hover:text-red-600 font-semibold transition-colors px-2 py-1 rounded bg-amber-50/70 hover:bg-red-50"
            title="Tüm Filtreleri Sıfırla"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sıfırla</span>
          </button>
        )}
      </div>

      {/* 1. SUBCATEGORY QUICK SELECTOR (IF IN SPECIFIC CATEGORY) */}
      {currentSubCategories && (
        <div className="border-b border-gray-100 pb-5">
          <button
            onClick={() => toggleSection('subCategories')}
            className="w-full flex items-center justify-between font-bold text-gray-900 py-1 hover:text-[#996515] transition-colors"
          >
            <span className="uppercase tracking-wider text-[11px] text-amber-900 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c89d3a]" />
              Model & Tür Seçimi
            </span>
            {openSections.subCategories ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {openSections.subCategories && (
            <div className="mt-3 space-y-1.5">
              {currentSubCategories.map((sub) => {
                const isSelected = selectedSubCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => onSelectSubCategory(sub.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left text-xs font-semibold ${
                      isSelected
                        ? 'bg-amber-600 text-white font-bold shadow-xs'
                        : 'bg-amber-50/50 hover:bg-amber-100/70 text-gray-800 border border-amber-200/50'
                    }`}
                  >
                    <span>{sub.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. DIAMOND CARAT RANGE (ONLY IN DIAMOND/TEKTAŞ/RING MODE) */}
      {isDiamondMode && (
        <div className="border-b border-gray-100 pb-5">
          <button
            onClick={() => toggleSection('carat')}
            className="w-full flex items-center justify-between font-bold text-gray-900 py-1 hover:text-[#996515] transition-colors"
          >
            <span className="uppercase tracking-wider text-[11px] text-gray-700 flex items-center gap-1.5">
              <Gem className="w-3.5 h-3.5 text-indigo-600" />
              Pırlanta Karat Aralığı
            </span>
            {openSections.carat ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          {openSections.carat && (
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {DIAMOND_CARAT_FILTERS.map((df) => {
                const isSelected = selectedCaratRange === df.id;
                return (
                  <button
                    key={df.id}
                    onClick={() => onSelectCaratRange(df.id)}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-900 text-white border-indigo-900 font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/40'
                    }`}
                  >
                    {df.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. ALTIN AYARI / KARAT */}
      <div className="border-b border-gray-100 pb-5">
        <button
          onClick={() => toggleSection('karat')}
          className="w-full flex items-center justify-between font-bold text-gray-900 py-1 hover:text-[#996515] transition-colors"
        >
          <span className="uppercase tracking-wider text-[11px] text-gray-700">Altın Ayarı / Saflık</span>
          {openSections.karat ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.karat && (
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {KARAT_FILTERS.map((kf) => {
              const isSelected = selectedKarat === kf.id;
              return (
                <button
                  key={kf.id}
                  onClick={() => onSelectKarat(kf.id)}
                  className={`px-2.5 py-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                    isSelected
                      ? 'bg-[#996515] text-white border-[#996515] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:bg-amber-50/40'
                  }`}
                >
                  {kf.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. FİYAT ARALIĞI (Price Range) */}
      <div className="border-b border-gray-100 pb-5">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between font-bold text-gray-900 py-1 hover:text-[#996515] transition-colors"
        >
          <span className="uppercase tracking-wider text-[11px] text-gray-700">Fiyat Aralığı (₺)</span>
          {openSections.price ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-3">
            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {PRICE_PRESETS.map((preset, idx) => {
                const isActive = minPrice === preset.min && maxPrice === preset.max;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isActive) {
                        onChangePrice('', '');
                      } else {
                        onChangePrice(preset.min, preset.max);
                      }
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[11px] border transition-all text-center ${
                      isActive
                        ? 'bg-amber-100 text-[#996515] border-amber-300 font-bold'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Min - Max Inputs */}
            <div className="grid grid-cols-2 gap-2 items-center">
              <div>
                <label className="text-[10px] text-gray-500 font-medium block mb-1">En Az</label>
                <div className="relative">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => onChangePrice(e.target.value, maxPrice)}
                    placeholder="0"
                    className="w-full pl-2 pr-6 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#c89d3a]"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">₺</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-medium block mb-1">En Çok</label>
                <div className="relative">
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => onChangePrice(minPrice, e.target.value)}
                    placeholder="Limitsiz"
                    className="w-full pl-2 pr-6 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#c89d3a]"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">₺</span>
                </div>
              </div>
            </div>

            {(minPrice || maxPrice) && (
              <button
                onClick={() => onChangePrice('', '')}
                className="w-full py-1 text-[11px] text-gray-500 hover:text-red-600 text-center block transition-colors"
              >
                Fiyat filtresini temizle
              </button>
            )}
          </div>
        )}
      </div>

      {/* 5. ÖZEL NİTELİKLER (Attributes: Handcrafted, In Stock, Sale) */}
      <div className="border-b border-gray-100 pb-5">
        <button
          onClick={() => toggleSection('attributes')}
          className="w-full flex items-center justify-between font-bold text-gray-900 py-1 hover:text-[#996515] transition-colors"
        >
          <span className="uppercase tracking-wider text-[11px] text-gray-700">Ürün Nitelikleri</span>
          {openSections.attributes ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.attributes && (
          <div className="mt-3 space-y-2.5">
            <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-amber-50/50 cursor-pointer transition-colors border border-gray-100">
              <span className="flex items-center gap-2 text-gray-800 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#c89d3a]" />
                <span>El Zanaatı / Usta İşi</span>
              </span>
              <input
                type="checkbox"
                checked={handcraftedOnly}
                onChange={(e) => onToggleHandcrafted(e.target.checked)}
                className="w-4 h-4 text-[#c89d3a] rounded border-gray-300 focus:ring-[#c89d3a] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-amber-50/50 cursor-pointer transition-colors border border-gray-100">
              <span className="flex items-center gap-2 text-gray-800 font-medium">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hemen Teslim / Stokta</span>
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => onToggleInStock(e.target.checked)}
                className="w-4 h-4 text-[#c89d3a] rounded border-gray-300 focus:ring-[#c89d3a] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-amber-50/50 cursor-pointer transition-colors border border-gray-100">
              <span className="flex items-center gap-2 text-gray-800 font-medium">
                <Tag className="w-3.5 h-3.5 text-rose-500" />
                <span>İndirimli / Fırsat</span>
              </span>
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => onToggleOnSale(e.target.checked)}
                className="w-4 h-4 text-[#c89d3a] rounded border-gray-300 focus:ring-[#c89d3a] cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>

      {/* 6. MADEN / ALTIN RENGİ */}
      <div className="border-b border-gray-100 pb-5">
        <button
          onClick={() => toggleSection('goldColor')}
          className="w-full flex items-center justify-between font-bold text-gray-900 py-1 hover:text-[#996515] transition-colors"
        >
          <span className="uppercase tracking-wider text-[11px] text-gray-700">Altın Rengi</span>
          {openSections.goldColor ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.goldColor && (
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {GOLD_COLORS.map((gc) => {
              const isSelected = selectedGoldColor === gc.id;
              return (
                <button
                  key={gc.id}
                  onClick={() => onSelectGoldColor(gc.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-50 text-[#996515] border-[#996515] font-bold'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {gc.colorCode && (
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300 shadow-2xs"
                      style={{ backgroundColor: gc.colorCode }}
                    />
                  )}
                  <span className="truncate">{gc.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. TAŞ TÜRÜ */}
      <div className="border-b border-gray-100 pb-5">
        <button
          onClick={() => toggleSection('stone')}
          className="w-full flex items-center justify-between font-bold text-gray-900 py-1 hover:text-[#996515] transition-colors"
        >
          <span className="uppercase tracking-wider text-[11px] text-gray-700">Taş Türü</span>
          {openSections.stone ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.stone && (
          <div className="mt-3 space-y-1">
            {STONE_TYPES.map((st) => {
              const isSelected = selectedStoneType === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => onSelectStoneType(st.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-amber-100 text-[#996515] font-bold border border-amber-300'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{st.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#996515]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 8. AĞIRLIK / GRAMAJ */}
      <div className="border-b border-gray-100 pb-5">
        <button
          onClick={() => toggleSection('weight')}
          className="w-full flex items-center justify-between font-bold text-gray-900 py-1 hover:text-[#996515] transition-colors"
        >
          <span className="uppercase tracking-wider text-[11px] text-gray-700">Ağırlık (Gramaj)</span>
          {openSections.weight ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.weight && (
          <div className="mt-3 space-y-1">
            {WEIGHT_RANGES.map((wr) => {
              const isSelected = selectedWeightRange === wr.id;
              return (
                <button
                  key={wr.id}
                  onClick={() => onSelectWeightRange(wr.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-amber-100 text-[#996515] font-bold border border-amber-300'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{wr.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#996515]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 9. TARİH / YENİLİK FİLTRESİ */}
      <div className="border-b border-gray-100 pb-5">
        <button
          onClick={() => toggleSection('date')}
          className="w-full flex items-center justify-between font-bold text-gray-900 py-1 hover:text-[#996515] transition-colors"
        >
          <span className="uppercase tracking-wider text-[11px] text-gray-700">Koleksiyon Tarihi</span>
          {openSections.date ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>

        {openSections.date && (
          <div className="mt-3 space-y-1">
            {DATE_FILTERS.map((df) => {
              const isSelected = selectedDateFilter === df.id;
              return (
                <button
                  key={df.id}
                  onClick={() => onSelectDateFilter(df.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-amber-100 text-[#996515] font-bold border border-amber-300'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{df.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#996515]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mehmet Hamdemirci Güvence Rozeti */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-[#c89d3a]" />
          <span>Kapalıçarşı Sarraf Güvencesi</span>
        </div>
        <p className="text-[11px] text-amber-900/80 leading-relaxed">
          Tüm pırlantalarımız uluslararası sertifikalı, altın ürünlerimiz T.C. Darphane ve ayar patentlidir.
        </p>
      </div>

    </div>
  );

  return (
    <>
      {/* DESKTOP STICKY SIDEBAR */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs h-fit sticky top-24">
        {renderContent()}
      </aside>

      {/* MOBILE DRAWER MODAL */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobileDrawer}
          />

          {/* Sliding Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2 text-gray-900 font-serif-luxury font-bold text-base">
                  <SlidersHorizontal className="w-4 h-4 text-[#c89d3a]" />
                  <span>Filtreleri Özelleştir</span>
                </div>
                <button
                  onClick={onCloseMobileDrawer}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto p-4">
                {renderContent()}
              </div>

              {/* Drawer Bottom Apply Button */}
              <div className="p-4 border-t border-gray-200 bg-white space-y-2">
                <button
                  onClick={onCloseMobileDrawer}
                  className="w-full py-3 bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{totalMatchingCount} Sonucu Göster</span>
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      onResetFilters();
                      onCloseMobileDrawer?.();
                    }}
                    className="w-full py-2 text-xs text-gray-500 hover:text-red-600 font-semibold text-center"
                  >
                    Filtreleri Sıfırla
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
