import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Truck,
  ShieldCheck,
  TrendingUp,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Sparkles,
  MapPin,
  ArrowRight,
  Gem,
  Award,
  BookOpen
} from 'lucide-react';
import brandLogoImage from '../assets/images/regenerated_image_1787651210294.png';
import { CONTACT_INFO, INITIAL_GOLD_PRICES } from '../data/mockData';
import { PRODUCTS_CATALOG } from '../data/productsData';
import { Product, NavigationGroup, TopBarConfig } from '../types';
import { DEFAULT_NAVIGATION_GROUPS } from '../data/defaultNavigationData';
import { DEFAULT_TOP_BAR_CONFIG } from '../data/defaultContentPagesData';
import { resolveNavigationLink } from '../utils/categoryHelper';

interface HeaderProps {
  activeTab: 'anasayfa' | 'katalog' | 'koleksiyon' | 'kurlar' | 'rehber' | 'altinini-getir' | 'blog';
  setActiveTab: (tab: 'anasayfa' | 'katalog' | 'koleksiyon' | 'kurlar' | 'rehber' | 'altinini-getir' | 'blog') => void;
  onSelectProduct: (product: Product) => void;
  onNavigateCategory: (categoryKey: string) => void;
  onOpenGuideArticle?: (slug: string) => void;
  onOpenAdmin?: () => void;
  navigationGroups?: NavigationGroup[];
  topBarConfig?: TopBarConfig;
  productsList?: Product[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSelectProduct,
  onNavigateCategory,
  onOpenGuideArticle,
  onOpenAdmin,
  navigationGroups = DEFAULT_NAVIGATION_GROUPS,
  topBarConfig = DEFAULT_TOP_BAR_CONFIG,
  productsList = PRODUCTS_CATALOG,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);
  const [mobileExpandedColumn, setMobileExpandedColumn] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navHoverTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort active navigation groups from Firestore
  const sortedNavGroups = useMemo(() => {
    const active = (navigationGroups || []).filter((g) => g.active !== false);
    return [...active].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [navigationGroups]);

  // Filtered search results
  const searchResults = searchQuery.trim()
    ? productsList.filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          (p.title || '').toLowerCase().includes(q) ||
          (p.code || '').toLowerCase().includes(q) ||
          (p.categoryLabel || '').toLowerCase().includes(q) ||
          (p.karat || '').toLowerCase().includes(q) ||
          (p.tags || []).some((t) => (t || '').toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

  const handleNavMouseEnter = (groupId: string, hasColumns: boolean) => {
    if (navHoverTimeout.current) {
      clearTimeout(navHoverTimeout.current);
    }
    if (hasColumns) {
      setActiveMegaMenu(groupId);
    } else {
      setActiveMegaMenu(null);
    }
  };

  const handleNavMouseLeave = () => {
    navHoverTimeout.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  const handleItemClick = (itemLink: string, itemSlug: string) => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);

    const resolved = resolveNavigationLink(itemLink, itemSlug);
    if (resolved.targetTab === 'rehber' && resolved.guideSlug) {
      if (onOpenGuideArticle) {
        onOpenGuideArticle(resolved.guideSlug);
      }
      setActiveTab('rehber');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (resolved.targetTab === 'kurlar') {
      setActiveTab('kurlar');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (resolved.targetTab === 'altinini-getir') {
      setActiveTab('altinini-getir');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateCategory(resolved.category || 'all');
    }
  };

  const handleGroupClick = (group: NavigationGroup) => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);

    if (group.slug === 'altin-rehberi') {
      setActiveTab('rehber');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (group.slug === 'firsatlar') {
      onNavigateCategory('all');
      return;
    }

    const resolved = resolveNavigationLink(group.slug);
    if (resolved.targetTab === 'katalog') {
      onNavigateCategory(resolved.category || 'all');
    } else {
      setActiveTab(resolved.targetTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-gray-200">
      
      {/* 1. TOP TICKER & LIVE ANNOUNCEMENT BAR */}
      <div className="bg-[#18181b] text-[#f4f4f5] text-[11px] py-1.5 px-4 font-sans-luxury border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Shipping & Security Notice */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#f59e0b]">
              <Truck className="w-3.5 h-3.5" />
              <span className="font-semibold text-white hidden sm:inline">
                {topBarConfig.tickerText || "Tüm Türkiye'ye %100 Sigortalı ve Ücretsiz Kargo"}
              </span>
              <span className="font-semibold text-white sm:hidden">
                Ücretsiz Sigortalı Kargo
              </span>
            </div>
            <span className="text-gray-600 hidden md:inline">•</span>
            <div className="hidden md:flex items-center gap-1.5 text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Darphane Damgalı & HRD Sertifikalı</span>
            </div>
          </div>

          {/* Right: Gold Rates Link, Bursa Mağazası & WhatsApp */}
          <div className="flex items-center gap-4 text-gray-300">
            
            {/* Live Gold Rates Header Link (Managed via Firebase) */}
            {topBarConfig.goldRatesVisible !== false && (
              <button
                onClick={() => {
                  setActiveTab('kurlar');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 text-[#fde68a] hover:text-white font-bold transition-colors bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40"
              >
                <TrendingUp className="w-3 h-3 text-[#f59e0b]" />
                <span>{topBarConfig.goldRatesLinkText || 'Güncel Altın Fiyatları'}</span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#f59e0b]" />
              <span>{topBarConfig.storeLocationText || 'Tarihi Bedesten No: 16, Bursa'}</span>
            </div>

            <span className="text-gray-600 hidden sm:inline">•</span>

            <a
              href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent('Merhaba Mehmet Hamdemirci Kuyumculuk, ürünler ve canlı altın fiyatları hakkında bilgi almak istiyorum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span className="hidden sm:inline">{topBarConfig.whatsappButtonText || 'WhatsApp Danışma'}</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>

        </div>
      </div>

      {/* 1.5. LIVE GOLD RATES MARQUEE TICKER (Kayan Altın Fiyatları Bandı) */}
      <div className="bg-[#111113] border-b border-amber-900/30 overflow-hidden select-none py-1 px-2 text-[11px] font-sans-luxury text-gray-300">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          
          {/* Static Live Indicator Pill */}
          <div
            onClick={() => {
              setActiveTab('kurlar');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded text-[#fde68a] text-[10px] font-bold tracking-wider cursor-pointer hover:bg-amber-500/25 transition-colors"
            title="Tüm Canlı Altın Kurlarını İncele"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xs:inline uppercase">CANLI KAPALIÇARŞI KURLARI</span>
            <span className="xs:hidden uppercase">CANLI</span>
          </div>

          {/* Marquee Scrolling Content */}
          <div
            onClick={() => {
              setActiveTab('kurlar');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="overflow-hidden flex-1 cursor-pointer"
            title="Canlı Kurlar ve Altın Hesaplayıcı için tıklayınız"
          >
            <div className="animate-marquee flex items-center gap-8 text-[11px] whitespace-nowrap">
              {/* First loop of rates */}
              {INITIAL_GOLD_PRICES.map((rate) => {
                const isPositive = rate.change >= 0;
                return (
                  <div key={`m1-${rate.id}`} className="inline-flex items-center gap-2">
                    <span className="font-semibold text-gray-200">{rate.name}:</span>
                    <span className="text-gray-400 text-[10px]">Alış</span>
                    <span className="font-mono text-gray-300 font-medium">{rate.buying.toLocaleString('tr-TR')} ₺</span>
                    <span className="text-amber-400 text-[10px]">Satış</span>
                    <span className="font-mono font-bold text-[#fde68a]">{rate.selling.toLocaleString('tr-TR')} ₺</span>
                    <span className={`font-mono text-[10px] font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ({isPositive ? '+' : ''}{rate.change}%)
                    </span>
                    <span className="text-neutral-700 ml-3">•</span>
                  </div>
                );
              })}

              {/* Second duplicate loop of rates for seamless continuous marquee loop */}
              {INITIAL_GOLD_PRICES.map((rate) => {
                const isPositive = rate.change >= 0;
                return (
                  <div key={`m2-${rate.id}`} className="inline-flex items-center gap-2">
                    <span className="font-semibold text-gray-200">{rate.name}:</span>
                    <span className="text-gray-400 text-[10px]">Alış</span>
                    <span className="font-mono text-gray-300 font-medium">{rate.buying.toLocaleString('tr-TR')} ₺</span>
                    <span className="text-amber-400 text-[10px]">Satış</span>
                    <span className="font-mono font-bold text-[#fde68a]">{rate.selling.toLocaleString('tr-TR')} ₺</span>
                    <span className={`font-mono text-[10px] font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ({isPositive ? '+' : ''}{rate.change}%)
                    </span>
                    <span className="text-neutral-700 ml-3">•</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER (LOGO, CENTRAL SEARCH BAR, APPOINTMENT CTA) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <div
          onClick={() => {
            setActiveTab('anasayfa');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer shrink-0 group"
          title="Mehmet Hamdemirci - Bursa Altın"
        >
          <img
            src={brandLogoImage}
            alt="Mehmet Hamdemirci Kuyumculuk"
            referrerPolicy="no-referrer"
            className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-102"
          />
        </div>

        {/* Central Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
          <div className="flex items-center border-2 border-[#c89d3a]/70 rounded-lg overflow-hidden bg-white shadow-2xs focus-within:border-[#c89d3a] focus-within:ring-2 focus-within:ring-[#c89d3a]/20">
            <input
              type="text"
              placeholder="Bilezik, tektaş, külçe veya ürün kodu ara (Örn: Ajda, BA-BK-2201)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="flex-1 py-2 px-3.5 text-xs text-gray-900 placeholder-gray-400 outline-none font-sans-luxury"
            />
            <button
              onClick={() => setSearchFocused(true)}
              className="bg-[#c89d3a] hover:bg-[#b38728] text-white px-4 py-2 flex items-center justify-center transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Search Dropdown */}
          {searchFocused && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
              <div className="p-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-sans-luxury uppercase text-[#996515] font-bold flex justify-between">
                <span>Arama Sonuçları ({searchResults.length})</span>
                <span className="text-gray-400 normal-case font-normal">Mehmet Hamdemirci Vitrini</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-5 text-center text-xs text-gray-500 font-sans-luxury">
                  "{searchQuery}" ile eşleşen ürün bulunamadı.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        setSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="p-3 hover:bg-amber-50/50 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <img
                        src={product.thumbnailUrl}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-gray-900 truncate">
                            {product.title}
                          </h4>
                          <span className="font-mono text-xs font-bold text-[#b38728] ml-2">
                            {product.price.toLocaleString('tr-TR')} ₺
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-sans-luxury mt-0.5">
                          <span className="text-[#996515] font-medium">{product.karat}</span>
                          <span>•</span>
                          <span>{product.weightGrams} gr</span>
                          <span>•</span>
                          <span className="font-mono text-gray-400">{product.code}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-black md:hidden rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
          </button>
        </div>

      </div>

      {/* 3. MAIN NAVIGATION BAR WITH DYNAMIC FIRESTORE MEGA MENU */}
      <nav
        onMouseLeave={handleNavMouseLeave}
        className="border-t border-gray-200 bg-[#fdfdfc] hidden md:block relative shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Main Navigation Items (TAKI | PIRLANTA | ALTIN & YATIRIM | ÖZEL GÜNLER | FIRSATLAR | ALTIN REHBERİ) */}
          <div className="flex items-center space-x-1 lg:space-x-2 py-0.5">
            {sortedNavGroups.map((group) => {
              const hasColumns = Array.isArray(group.columns) && group.columns.length > 0;
              const isMegaOpen = activeMegaMenu === group.id;
              const isRehber = group.slug === 'altin-rehberi';
              const isFirsatlar = group.slug === 'firsatlar';

              return (
                <div
                  key={group.id}
                  onMouseEnter={() => handleNavMouseEnter(group.id, hasColumns)}
                  className="relative py-2"
                >
                  <button
                    onClick={() => handleGroupClick(group)}
                    className={`px-3 py-2 text-xs font-sans-luxury font-bold tracking-wider uppercase transition-all rounded-md flex items-center gap-1.5 ${
                      isMegaOpen
                        ? 'text-[#996515] bg-amber-50/80 shadow-2xs'
                        : isRehber && activeTab === 'rehber'
                        ? 'text-[#996515] bg-amber-50/60'
                        : isFirsatlar
                        ? 'text-red-700 hover:text-red-800'
                        : 'text-gray-800 hover:text-[#996515] hover:bg-gray-100/70'
                    }`}
                  >
                    <span>{group.label}</span>
                    {hasColumns && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isMegaOpen ? 'rotate-180 text-[#c89d3a]' : 'text-gray-400'
                        }`}
                      />
                    )}
                    {isFirsatlar && (
                      <span className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[9px] font-extrabold rounded">
                        %
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE: ALTININI GETİR PROMINENT GOLD CTA BUTTON */}
          <div className="py-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('altinini-getir');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative px-4 py-2 rounded-lg text-xs font-sans-luxury font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-md ${
                activeTab === 'altinini-getir'
                  ? 'bg-gradient-to-r from-[#996515] to-[#78350f] text-white ring-2 ring-[#c89d3a]'
                  : 'bg-gradient-to-r from-[#c89d3a] via-[#dfba5a] to-[#c89d3a] hover:from-[#b38728] hover:to-[#c89d3a] text-gray-950 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-gray-950" />
              <span>Altınını Getir</span>
              <span className="text-[9px] font-extrabold bg-black/15 text-gray-950 px-1.5 py-0.5 rounded">
                Bozdur & Takas
              </span>
            </button>
          </div>

        </div>

        {/* 4. MEGA MENU FLOATING DROPDOWN PANEL (Luxury layout) */}
        {activeMegaMenu && (
          <div
            onMouseEnter={() => {
              if (navHoverTimeout.current) clearTimeout(navHoverTimeout.current);
            }}
            onMouseLeave={handleNavMouseLeave}
            className="absolute top-full left-0 w-full bg-white border-t border-b border-amber-200/60 shadow-2xl z-50 animate-fade-in"
          >
            {sortedNavGroups
              .filter((g) => g.id === activeMegaMenu && Array.isArray(g.columns) && g.columns.length > 0)
              .map((group) => {
                const activeColumns = (group.columns || []).filter((c) => c.active !== false);

                return (
                  <div key={group.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      
                      {/* Dynamic Columns */}
                      <div className={`grid gap-6 ${
                        group.featuredImage
                          ? 'md:col-span-8 lg:col-span-9'
                          : 'md:col-span-12'
                      } ${
                        activeColumns.length <= 2
                          ? 'grid-cols-2'
                          : activeColumns.length === 3
                          ? 'grid-cols-3'
                          : activeColumns.length === 4
                          ? 'grid-cols-4'
                          : activeColumns.length === 5
                          ? 'grid-cols-5'
                          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
                      }`}>
                        {activeColumns.map((col) => {
                          const activeItems = (col.items || []).filter((i) => i.active !== false);

                          return (
                            <div key={col.id} className="space-y-3">
                              <h4 className="text-xs font-bold text-[#996515] uppercase tracking-wider pb-1.5 border-b border-amber-200/50 flex items-center justify-between">
                                <span>{col.title}</span>
                              </h4>

                              <ul className="space-y-2">
                                {activeItems.map((item) => (
                                  <li key={item.id}>
                                    <button
                                      onClick={() => handleItemClick(item.link, item.slug)}
                                      className="text-xs text-gray-700 hover:text-[#996515] hover:translate-x-1 font-medium transition-all flex items-center justify-between w-full text-left py-0.5 group"
                                    >
                                      <span className="group-hover:font-semibold">{item.label}</span>
                                      {item.badge && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-[#996515] rounded">
                                          {item.badge}
                                        </span>
                                      )}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>

                      {/* Featured Promo Card on Right Side of Mega Menu */}
                      {group.featuredImage && (
                        <div className="md:col-span-4 lg:col-span-3 bg-gradient-to-br from-amber-50/80 to-[#f7f5f0] border border-amber-200/70 rounded-xl p-4 space-y-3 shadow-inner">
                          <div className="h-32 rounded-lg overflow-hidden relative shadow-sm">
                            <img
                              src={group.featuredImage}
                              alt={group.featuredTitle || group.label}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2.5">
                              <span className="text-white text-xs font-bold font-serif">
                                {group.featuredTitle || 'Özel Koleksiyon'}
                              </span>
                            </div>
                          </div>

                          <p className="text-[11px] text-gray-600 leading-relaxed font-sans-luxury">
                            {group.featuredSubtitle || 'Bursa Kapalıçarşı güvencesiyle en yeni tasarımları keşfedin.'}
                          </p>

                          <button
                            onClick={() => {
                              setActiveMegaMenu(null);
                              handleItemClick(group.featuredLink || `kategori:${group.slug}`, group.slug);
                            }}
                            className="w-full py-2 bg-[#c89d3a] hover:bg-[#b38728] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span>Koleksiyonu Gör</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </nav>

      {/* 5. MOBILE 2-LEVEL ACCORDION DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-5 space-y-4 animate-fade-in shadow-2xl max-h-[85vh] overflow-y-auto">
          
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Mücevher veya altın ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2.5 pl-9 pr-3 text-xs text-gray-900 font-sans-luxury outline-none focus:border-[#c89d3a]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Prominent ALTININI GETİR Mobile Button */}
          <button
            onClick={() => {
              setActiveTab('altinini-getir');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#c89d3a] via-[#dfba5a] to-[#c89d3a] text-gray-950 font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gray-950" />
              <span>Altınını Getir & Bozdur</span>
            </div>
            <span className="text-[10px] bg-black/15 px-2 py-0.5 rounded font-extrabold">
              Nakit & Takas
            </span>
          </button>

          {/* 2-Level Dynamic Navigation Accordion */}
          <div className="divide-y divide-gray-100 text-xs font-sans-luxury">
            
            {sortedNavGroups.map((group) => {
              const hasColumns = Array.isArray(group.columns) && group.columns.length > 0;
              const isExpanded = mobileExpandedGroup === group.id;

              return (
                <div key={group.id} className="py-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (hasColumns) {
                          setMobileExpandedGroup(isExpanded ? null : group.id);
                        } else {
                          handleGroupClick(group);
                        }
                      }}
                      className="py-1.5 font-bold uppercase tracking-wider text-gray-800 text-left flex-1 flex items-center justify-between"
                    >
                      <span>{group.label}</span>
                      {hasColumns && (
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-180 text-[#c89d3a]' : ''
                          }`}
                        />
                      )}
                    </button>
                  </div>

                  {/* Level 1: Columns */}
                  {hasColumns && isExpanded && (
                    <div className="pl-3 pr-1 py-2 space-y-3 bg-gray-50/70 rounded-lg mt-1">
                      {group.columns
                        .filter((c) => c.active !== false)
                        .map((col) => {
                          const isColExpanded = mobileExpandedColumn === col.id;

                          return (
                            <div key={col.id} className="space-y-1.5">
                              <button
                                onClick={() => setMobileExpandedColumn(isColExpanded ? null : col.id)}
                                className="w-full text-left font-bold text-[#996515] text-[11px] uppercase tracking-wide flex items-center justify-between py-1 border-b border-gray-200/60"
                              >
                                <span>{col.title}</span>
                                <ChevronRight
                                  className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                                    isColExpanded ? 'rotate-90 text-[#996515]' : ''
                                  }`}
                                />
                              </button>

                              {/* Level 2: Sub-items */}
                              {isColExpanded && (
                                <ul className="pl-2 space-y-1.5 pt-1">
                                  {col.items
                                    .filter((i) => i.active !== false)
                                    .map((item) => (
                                      <li key={item.id}>
                                        <button
                                          onClick={() => handleItemClick(item.link, item.slug)}
                                          className="text-xs text-gray-700 hover:text-[#996515] py-1 flex items-center justify-between w-full text-left"
                                        >
                                          <span>{item.label}</span>
                                          {item.badge && (
                                            <span className="text-[9px] bg-amber-100 text-[#996515] font-bold px-1.5 py-0.2 rounded">
                                              {item.badge}
                                            </span>
                                          )}
                                        </button>
                                      </li>
                                    ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Quick Links inside mobile menu */}
            <div className="pt-3 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('kurlar');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-[#996515] font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Canlı Altın Fiyatları & Hesaplama</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </header>
  );
};
