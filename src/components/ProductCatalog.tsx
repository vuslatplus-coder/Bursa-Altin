import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Heart,
  Scale,
  Calendar,
  Gem,
  Check,
  ChevronDown,
  X,
  MessageSquare,
  Truck,
  LayoutGrid,
  Grid3X3,
  Eye,
  ShieldCheck,
  Award,
  Phone
} from 'lucide-react';
import {
  Product,
  Category,
  CustomCategory
} from '../types';
import {
  PRODUCTS_CATALOG,
  PRODUCT_CATEGORIES,
  CATEGORY_SUBCATEGORIES,
  DIAMOND_CARAT_FILTERS,
  CONTACT_INFO
} from '../data/productsData';
import { CatalogFilterSidebar } from './CatalogFilterSidebar';
import { resolveNavigationLink } from '../utils/categoryHelper';

interface ProductCatalogProps {
  initialCategory?: string;
  onSelectProduct: (product: Product, view?: 'details' | 'customize') => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  onOpenAppointment?: (reason?: string) => void;
  productsList?: Product[];
  categoriesList?: CustomCategory[];
  likesMap?: Record<string, number>;
  userLikedIds?: string[];
  onToggleLike?: (productId: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  initialCategory = 'all',
  onSelectProduct,
  onToggleWishlist,
  wishlistIds,
  productsList = PRODUCTS_CATALOG,
  categoriesList,
  likesMap = {},
  userLikedIds = [],
  onToggleLike,
}) => {
  // Navigation Resolution
  const resolvedInitial = resolveNavigationLink(initialCategory);

  // Primary Category & Subcategory State
  const [selectedCategory, setSelectedCategory] = useState<string>(
    resolvedInitial.category || 'all'
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(
    resolvedInitial.subCategory || 'all'
  );

  // Deep Filters
  const [selectedKarat, setSelectedKarat] = useState<string>('all');
  const [selectedCaratRange, setSelectedCaratRange] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'last-7-days' | 'last-30-days' | 'this-year'>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedGoldColor, setSelectedGoldColor] = useState<string>('all');
  const [selectedStoneType, setSelectedStoneType] = useState<string>('all');
  const [selectedWeightRange, setSelectedWeightRange] = useState<string>('all');
  const [handcraftedOnly, setHandcraftedOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);

  // Search & Sort & View
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'featured' | 'newest' | 'oldest' | 'most-liked' | 'price-asc' | 'price-desc' | 'weight-desc'
  >('featured');
  const [gridColumns, setGridColumns] = useState<3 | 4>(3);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Sync initialCategory change from navbar / hero banners / links
  useEffect(() => {
    if (initialCategory) {
      const resolved = resolveNavigationLink(initialCategory);
      setSelectedCategory(resolved.category || 'all');
      setSelectedSubCategory(resolved.subCategory || 'all');
      // Reset generic search and price filters for crisp navigation
      setSearchQuery('');
      setSelectedKarat('all');
      setSelectedCaratRange('all');
      setSelectedDateFilter('all');
      setMinPrice('');
      setMaxPrice('');
      setSelectedGoldColor('all');
      setSelectedStoneType('all');
      setSelectedWeightRange('all');
      setHandcraftedOnly(false);
      setOnSaleOnly(false);
    }
  }, [initialCategory]);

  // When changing primary category via button, auto reset subcategory
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory('all');
    setSelectedCaratRange('all');
  };

  // Combine default and custom categories with real live counts
  const categories = useMemo(() => {
    if (categoriesList && categoriesList.length > 0) {
      return [
        { id: 'all', label: 'Tüm Koleksiyon', count: productsList.length },
        ...categoriesList.map((c) => ({
          id: c.id,
          label: c.name,
          count: productsList.filter((p) => p.category === c.id).length
        }))
      ];
    }
    return PRODUCT_CATEGORIES.map((cat) => ({
      ...cat,
      count: cat.id === 'all' ? productsList.length : productsList.filter((p) => p.category === cat.id).length
    }));
  }, [categoriesList, productsList]);

  // Current subcategories for the active primary category
  const availableSubCategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    return CATEGORY_SUBCATEGORIES[selectedCategory] || [];
  }, [selectedCategory]);

  // Popular search suggestions
  const searchSuggestions = [
    '22 Ayar Hasır',
    'Tektaş Pırlanta',
    'Külçe Altın',
    'Dorika Yüzük',
    'Kaburga',
    'Ajda Bilezik',
    'Su Yolu Gerdanlık'
  ];

  // Helper date matching
  const isDateMatching = (createdAtStr?: string, filter?: string) => {
    if (!filter || filter === 'all') return true;
    if (!createdAtStr) return true;

    const itemDate = new Date(createdAtStr).getTime();
    const now = new Date('2026-08-28T00:00:00').getTime();
    const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);

    if (filter === 'last-7-days') return diffDays <= 7;
    if (filter === 'last-30-days') return diffDays <= 30;
    if (filter === 'this-year') return createdAtStr.startsWith('2026');
    return true;
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return productsList
      .filter((p) => {
        // 1. Primary Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // 2. Subcategory filter (CRITICAL FOR USER REQUIREMENT)
        if (selectedSubCategory !== 'all') {
          const sub = selectedSubCategory.toLowerCase();
          const matchSub = p.subCategory === selectedSubCategory;
          const matchTag = p.tags?.some((t) => t.toLowerCase().includes(sub));
          const matchTitle =
            p.title.toLowerCase().includes(sub) ||
            (sub === 'tektas' && p.title.toLowerCase().includes('tektaş')) ||
            (sub === 'baget' && p.title.toLowerCase().includes('baget')) ||
            (sub === 'bestas' && p.title.toLowerCase().includes('beştaş')) ||
            (sub === 'kulce' && (p.title.toLowerCase().includes('külçe') || p.title.toLowerCase().includes('has')));

          if (!matchSub && !matchTag && !matchTitle) {
            return false;
          }
        }

        // 3. Diamond Carat Filter
        if (selectedCaratRange !== 'all') {
          const caratStr = p.specs?.stoneCarat || '';
          const caratNum = parseFloat(caratStr.replace(/[^\d.]/g, '')) || 0;
          if (selectedCaratRange === '020-035' && (caratNum < 0.20 || caratNum > 0.35)) return false;
          if (selectedCaratRange === '035-055' && (caratNum < 0.35 || caratNum > 0.55)) return false;
          if (selectedCaratRange === '055-075' && (caratNum < 0.55 || caratNum > 0.75)) return false;
          if (selectedCaratRange === '075plus' && caratNum < 0.75) return false;
        }

        // 4. Karat filter
        if (selectedKarat !== 'all') {
          if (p.karatCode) {
            if (p.karatCode !== selectedKarat) return false;
          } else {
            if (!p.karat.includes(selectedKarat.replace('K', ' Ayar'))) return false;
          }
        }

        // 5. Date Filter
        if (!isDateMatching(p.createdAt, selectedDateFilter)) {
          return false;
        }

        // 6. Price range filter
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        if (p.price < min || p.price > max) {
          return false;
        }

        // 7. Gold Color filter
        if (selectedGoldColor !== 'all') {
          const gc = p.goldColor || (p.specs?.goldColor ? (
            p.specs.goldColor.toLowerCase().includes('beyaz') ? 'beyaz' :
            p.specs.goldColor.toLowerCase().includes('rose') ? 'rose' : 'sari'
          ) : 'sari');
          if (gc !== selectedGoldColor) {
            return false;
          }
        }

        // 8. Stone Type filter
        if (selectedStoneType !== 'all') {
          const st = p.stoneType || (p.specs?.stoneType ? (
            p.specs.stoneType.toLowerCase().includes('pırlanta') || p.specs.stoneType.toLowerCase().includes('elmas') ? 'pirlanta' :
            p.specs.stoneType.toLowerCase().includes('zirkon') || p.specs.stoneType.toLowerCase().includes('taşlı') ? 'zirkon' : 'tassiz'
          ) : 'tassiz');
          if (st !== selectedStoneType) {
            return false;
          }
        }

        // 9. Weight Range filter
        if (selectedWeightRange !== 'all') {
          if (selectedWeightRange === 'light' && p.weightGrams >= 5) return false;
          if (selectedWeightRange === 'medium' && (p.weightGrams < 5 || p.weightGrams > 15)) return false;
          if (selectedWeightRange === 'heavy' && p.weightGrams <= 15) return false;
        }

        // 10. Handcrafted / In Stock / On Sale filters
        if (handcraftedOnly && !p.isHandcrafted) return false;
        if (inStockOnly && !p.inStock) return false;
        if (onSaleOnly && !p.isOnSale && (!p.originalPrice || p.originalPrice <= p.price)) return false;

        // 11. Keyword Search query filter
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(query);
          const matchCode = p.code.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchKarat = p.karat.toLowerCase().includes(query);
          const matchTags = p.tags?.some((t) => t.toLowerCase().includes(query));
          const matchCategory = p.categoryLabel.toLowerCase().includes(query);
          const matchSub = p.subCategoryLabel?.toLowerCase().includes(query);

          if (!matchTitle && !matchCode && !matchDesc && !matchKarat && !matchTags && !matchCategory && !matchSub) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const likesA = likesMap[a.id] ?? a.likesCount ?? 0;
        const likesB = likesMap[b.id] ?? b.likesCount ?? 0;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        switch (sortBy) {
          case 'newest':
            return dateB - dateA;
          case 'oldest':
            return dateA - dateB;
          case 'most-liked':
            return likesB - likesA;
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'weight-desc':
            return b.weightGrams - a.weightGrams;
          case 'featured':
          default:
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });
  }, [
    productsList,
    selectedCategory,
    selectedSubCategory,
    selectedCaratRange,
    selectedKarat,
    selectedDateFilter,
    minPrice,
    maxPrice,
    selectedGoldColor,
    selectedStoneType,
    selectedWeightRange,
    handcraftedOnly,
    inStockOnly,
    onSaleOnly,
    searchQuery,
    sortBy,
    likesMap
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSelectedCaratRange('all');
    setSelectedKarat('all');
    setSelectedDateFilter('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedGoldColor('all');
    setSelectedStoneType('all');
    setSelectedWeightRange('all');
    setHandcraftedOnly(false);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSubCategory !== 'all' ||
    selectedCaratRange !== 'all' ||
    selectedKarat !== 'all' ||
    selectedDateFilter !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    selectedGoldColor !== 'all' ||
    selectedStoneType !== 'all' ||
    selectedWeightRange !== 'all' ||
    handcraftedOnly ||
    inStockOnly ||
    onSaleOnly ||
    searchQuery !== '' ||
    sortBy !== 'featured';

  // Active category object
  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const activeSubCategoryObj = availableSubCategories.find((s) => s.id === selectedSubCategory);

  // Active filter count for badge
  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedSubCategory !== 'all',
    selectedCaratRange !== 'all',
    selectedKarat !== 'all',
    selectedDateFilter !== 'all',
    minPrice !== '' || maxPrice !== '',
    selectedGoldColor !== 'all',
    selectedStoneType !== 'all',
    selectedWeightRange !== 'all',
    handcraftedOnly,
    inStockOnly,
    onSaleOnly,
    searchQuery !== '',
  ].filter(Boolean).length;

  return (
    <div id="product-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs font-sans-luxury text-gray-500 mb-1.5">
            <span className="hover:text-[#996515] cursor-pointer" onClick={() => handleCategorySelect('all')}>
              Koleksiyon
            </span>
            {activeCategoryObj && activeCategoryObj.id !== 'all' && (
              <>
                <span>/</span>
                <span
                  className="hover:text-[#996515] cursor-pointer"
                  onClick={() => setSelectedSubCategory('all')}
                >
                  {activeCategoryObj.label}
                </span>
              </>
            )}
            {activeSubCategoryObj && (
              <>
                <span>/</span>
                <span className="text-[#996515] font-bold">{activeSubCategoryObj.label}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-sans-luxury uppercase tracking-widest text-[#996515] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#c89d3a]" />
            <span>Bursa Kapalıçarşı Sarraf Koleksiyonu</span>
          </div>

          <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-gray-900 font-bold">
            {activeSubCategoryObj
              ? activeSubCategoryObj.label
              : activeCategoryObj
              ? activeCategoryObj.label
              : 'Mücevher & Altın Kataloğu'}
          </h1>
          <p className="font-sans-luxury text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            {selectedSubCategory === 'tektas'
              ? 'HRD ve GIA sertifikalı pırlantalar ile üretilmiş, ömür boyu bakım garantili solitaire tektaş yüzük modelleri.'
              : selectedSubCategory === 'ajda-bilezik'
              ? 'Elmas kalem işlemeli, ışıltılı ve en yüksek işçilik kalitesine sahip 22 ayar patentli ajda bilezikler.'
              : selectedSubCategory === 'kulce'
              ? 'Darphane ve uluslararası rafineri onaylı, 24 ayar saf has blisterli yatırım külçeleri.'
              : 'Mehmet Hamdemirci güvencesiyle darphane patentli, 14, 22 ve 24 ayar özel tasarım mücevher ve sarrafiye ürünleri.'}
          </p>
        </div>

        {/* Quick Result Counter */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-4 py-2 bg-amber-50/80 border border-amber-200 rounded-xl text-xs font-sans-luxury text-[#996515] font-bold flex items-center gap-2 shadow-2xs">
            <Gem className="w-3.5 h-3.5 text-[#c89d3a]" />
            <span>{filteredProducts.length} Model Listelendi</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: SIDEBAR + PRODUCT GRID */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <CatalogFilterSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          selectedSubCategory={selectedSubCategory}
          onSelectSubCategory={setSelectedSubCategory}
          selectedCaratRange={selectedCaratRange}
          onSelectCaratRange={setSelectedCaratRange}
          selectedKarat={selectedKarat}
          onSelectKarat={setSelectedKarat}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onChangePrice={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
          selectedGoldColor={selectedGoldColor}
          onSelectGoldColor={setSelectedGoldColor}
          selectedStoneType={selectedStoneType}
          onSelectStoneType={setSelectedStoneType}
          selectedWeightRange={selectedWeightRange}
          onSelectWeightRange={setSelectedWeightRange}
          selectedDateFilter={selectedDateFilter}
          onSelectDateFilter={setSelectedDateFilter}
          handcraftedOnly={handcraftedOnly}
          onToggleHandcrafted={setHandcraftedOnly}
          inStockOnly={inStockOnly}
          onToggleInStock={setInStockOnly}
          onSaleOnly={onSaleOnly}
          onToggleOnSale={setOnSaleOnly}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          totalMatchingCount={filteredProducts.length}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        />

        {/* RIGHT COLUMN: SEARCH, SORT CONTROLS, ACTIVE PILLS, GRID */}
        <main className="flex-1 w-full space-y-5">
          
          {/* Action Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              {/* Search Bar with Live Clear */}
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Koleksiyonda model adı, kod (BA-...), taş veya ayar ara..."
                  className="w-full pl-10 pr-9 py-2.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs text-gray-900 border border-gray-200 focus:border-[#c89d3a] rounded-xl outline-none transition-all font-sans-luxury placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button (Visible on Small Screens) */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden w-full sm:w-auto px-4 py-2.5 bg-amber-50 border border-amber-300 text-[#996515] font-bold text-xs rounded-xl flex items-center justify-center gap-2 font-sans-luxury"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtrele</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#996515] text-white text-[10px] flex items-center justify-center font-mono">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort By Dropdown */}
              <div className="relative w-full sm:w-56 shrink-0">
                <ArrowUpDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-50 hover:bg-gray-100/80 text-xs font-sans-luxury font-semibold text-gray-800 border border-gray-200 focus:border-[#c89d3a] rounded-xl outline-none cursor-pointer appearance-none"
                >
                  <option value="featured">✨ Öne Çıkanlar</option>
                  <option value="newest">📅 En Yeni Eklenenler</option>
                  <option value="most-liked">❤️ En Çok Beğenilenler</option>
                  <option value="price-asc">₺ Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc">₺ Fiyat: Yüksekten Düşüğe</option>
                  <option value="weight-desc">⚖️ Ağırlık: Çoktan Aza</option>
                  <option value="oldest">🕰️ En Eski Eklenenler</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Desktop Column Layout Switcher */}
              <div className="hidden xl:flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setGridColumns(3)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    gridColumns === 3 ? 'bg-white text-[#996515] shadow-xs' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="3'lü Geniş Görünüm"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridColumns(4)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    gridColumns === 4 ? 'bg-white text-[#996515] shadow-xs' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="4'lü Kompakt Görünüm"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Popular Search Suggestions */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs scrollbar-none">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">
                Popüler:
              </span>
              {searchSuggestions.map((sug) => (
                <button
                  key={sug}
                  onClick={() => setSearchQuery(sug)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-amber-50 hover:text-[#996515] text-gray-600 rounded-lg text-[11px] font-sans-luxury transition-colors whitespace-nowrap"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Active Filters Pill Badges Bar */}
            {hasActiveFilters && (
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-gray-400 font-semibold text-[11px]">Aktif Filtreler:</span>

                  {searchQuery && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      Arama: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {selectedCategory !== 'all' && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      Kategori: {categories.find((c) => c.id === selectedCategory)?.label}
                      <button onClick={() => handleCategorySelect('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {selectedSubCategory !== 'all' && (
                    <span className="px-2.5 py-1 bg-amber-100 border border-amber-300 text-amber-900 font-bold rounded-full flex items-center gap-1">
                      Model: {activeSubCategoryObj?.label || selectedSubCategory}
                      <button onClick={() => setSelectedSubCategory('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {selectedCaratRange !== 'all' && (
                    <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold rounded-full flex items-center gap-1">
                      Karat: {DIAMOND_CARAT_FILTERS.find((d) => d.id === selectedCaratRange)?.label}
                      <button onClick={() => setSelectedCaratRange('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {selectedKarat !== 'all' && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      Ayar: {selectedKarat}
                      <button onClick={() => setSelectedKarat('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {(minPrice || maxPrice) && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      Fiyat: {minPrice ? `${parseInt(minPrice).toLocaleString()} ₺` : '0 ₺'} - {maxPrice ? `${parseInt(maxPrice).toLocaleString()} ₺` : '∞'}
                      <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {selectedGoldColor !== 'all' && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      Renk: {selectedGoldColor === 'sari' ? 'Sarı Altın' : selectedGoldColor === 'beyaz' ? 'Beyaz Altın' : 'Rose Gold'}
                      <button onClick={() => setSelectedGoldColor('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {selectedStoneType !== 'all' && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      Taş: {selectedStoneType === 'pirlanta' ? 'Pırlanta & Elmas' : selectedStoneType === 'zirkon' ? 'Taşlı / Zirkon' : 'Sade / Taşsız'}
                      <button onClick={() => setSelectedStoneType('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {selectedWeightRange !== 'all' && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      Gramaj: {selectedWeightRange === 'light' ? '< 5 gr' : selectedWeightRange === 'medium' ? '5 - 15 gr' : '15+ gr'}
                      <button onClick={() => setSelectedWeightRange('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {handcraftedOnly && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      El Zanaatı
                      <button onClick={() => setHandcraftedOnly(false)}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {inStockOnly && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      Stokta
                      <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {onSaleOnly && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      İndirimli
                      <button onClick={() => setOnSaleOnly(false)}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}

                  {selectedDateFilter !== 'all' && (
                    <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-[#996515] font-medium rounded-full flex items-center gap-1">
                      Dönem: {selectedDateFilter === 'last-7-days' ? 'Son 7 Gün' : selectedDateFilter === 'last-30-days' ? 'Son 30 Gün' : '2026'}
                      <button onClick={() => setSelectedDateFilter('all')}><X className="w-3 h-3 hover:text-red-600" /></button>
                    </span>
                  )}
                </div>

                <button
                  onClick={resetFilters}
                  className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline ml-auto"
                >
                  <RotateCcw className="w-3 h-3" />
                  Tümünü Temizle
                </button>
              </div>
            )}
          </div>

          {/* PRODUCTS GRID */}
          {filteredProducts.length > 0 ? (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                gridColumns === 4 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-2 xl:grid-cols-3'
              } gap-5`}
            >
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                const isLiked = userLikedIds.includes(product.id);
                const totalLikes = likesMap[product.id] ?? product.likesCount ?? 0;

                const whatsappQuickLink = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
                  `Merhaba Mehmet Hamdemirci Kuyumculuk,\n\n"${product.title}" (${product.code} - ${product.price.toLocaleString(
                    'tr-TR'
                  )} ₺) hakkında bilgi almak istiyorum.`
                )}`;

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-gray-200 hover:border-[#c89d3a] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.thumbnailUrl}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 cursor-pointer"
                        onClick={() => onSelectProduct(product, 'details')}
                      />

                      {/* Top Left Badges: Karat, Subcategory & Date Badge */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                        <span className="px-2 py-0.5 text-[10px] font-sans-luxury uppercase tracking-wider bg-white/95 backdrop-blur-xs text-[#996515] border border-amber-300 font-bold rounded-md shadow-xs">
                          {product.karat}
                        </span>
                        {product.subCategoryLabel && (
                          <span className="px-2 py-0.5 text-[9px] font-sans-luxury bg-amber-900/90 text-white font-semibold rounded-md">
                            {product.subCategoryLabel}
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2 py-0.5 text-[9px] font-sans-luxury uppercase tracking-wider bg-black/80 text-white font-bold rounded-md">
                            Yeni
                          </span>
                        )}
                        {product.isHandcrafted && (
                          <span className="px-2 py-0.5 text-[9px] font-sans-luxury uppercase tracking-wider bg-amber-500 text-white font-bold rounded-md flex items-center gap-1 shadow-2xs">
                            <Sparkles className="w-2.5 h-2.5" /> El İşçiliği
                          </span>
                        )}
                      </div>

                      {/* Top Right Action Icons: Wishlist Button */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                        <button
                          onClick={() => onToggleWishlist(product)}
                          className={`p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
                            isWishlisted
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-white/90 text-gray-600 hover:text-rose-600'
                          }`}
                          title={isWishlisted ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                        </button>
                      </div>

                      {/* Image Overlay: Direct Like Counter & View Detail */}
                      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-xs z-10">
                        {/* Interactive Like Counter */}
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
                          title={isLiked ? 'Beğenmekten Vazgeç' : 'Görseli Beğen'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                          <span className="font-mono">{totalLikes}</span>
                        </button>

                        {/* Quick View Button */}
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

                    {/* Card Body Content */}
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
                          title={product.title}
                        >
                          {product.title}
                        </h3>
                      </div>

                      {/* Price & Free Insured Shipping */}
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

                      {/* Action Buttons: WhatsApp Fiyat Sor + İncele */}
                      <div className="pt-2 flex gap-2">
                        <a
                          href={whatsappQuickLink}
                          target="_blank"
                          rel="noopener noreferrer"
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
          ) : (
            /* Refined Empty State */
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-8 max-w-xl mx-auto shadow-xs space-y-4">
              <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-[#996515] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-gray-900">
                Seçilen Kriterlere Uygun Model Bulunamadı
              </h3>
              <p className="font-sans-luxury text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Belirlediğiniz model, ayar veya fiyat filtreleri bu kombinasyonda ürün içermiyor olabilir. Filtreleri sıfırlayarak tüm koleksiyonu görüntüleyebilirsiniz.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#c89d3a] hover:bg-[#b38728] text-white text-xs font-sans-luxury uppercase tracking-wider font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tüm Filtreleri Temizle</span>
                </button>
              </div>

              {/* Quick Jump Category Suggestions */}
              <div className="pt-6 border-t border-gray-100">
                <span className="text-[11px] font-semibold text-gray-400 block mb-2">Popüler Kategorilere Göz Atın:</span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {categories.slice(0, 5).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        resetFilters();
                        handleCategorySelect(cat.id);
                      }}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-[#996515] border border-gray-200 rounded-lg text-xs font-sans-luxury transition-colors"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 4. CUSTOM COMMISSION BANNER */}
      <div className="mt-12 p-8 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-[11px] font-sans-luxury uppercase tracking-widest text-[#f59e0b] font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Özel Atölye Siparişi & Kişiye Özel Tasarım
          </span>
          <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-bold">
            Kataloğumuzda Göremediğiniz Bir Modeli Birlikte Tasarlayalım
          </h3>
          <p className="font-sans-luxury text-xs sm:text-sm text-gray-300 leading-relaxed">
            Eski altınlarınızı sıfır işçilik kaybıyla dönüştürmek, beğendiğiniz bir fotoğrafı 3D modelleterek atölyemizde döktürmek veya özel düğün seti hazırlatmak için sarraf uzmanımızla görüşün.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full lg:w-auto">
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
              'Merhaba Mehmet Hamdemirci Kuyumculuk, özel bir altın/mücevher tasarımı yaptırmak istiyorum. Fotoğraf gönderip bilgi alabilir miyim?'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#c89d3a] hover:bg-[#b38728] text-white font-sans-luxury text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>WhatsApp ile Model Fotoğrafı Gönder</span>
          </a>
          <a
            href={`tel:${CONTACT_INFO.phoneRaw}`}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-sans-luxury text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#c89d3a]" />
            <span>Atölyeyi Ara</span>
          </a>
        </div>
      </div>

    </div>
  );
};
