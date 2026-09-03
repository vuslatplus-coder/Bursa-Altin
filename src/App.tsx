import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroECommerceSlider } from './components/HeroECommerceSlider';
import { PromoMiniBanners } from './components/PromoMiniBanners';
import { TabbedHomeShowcase } from './components/TabbedHomeShowcase';
import { TrustBadgesSection } from './components/TrustBadgesSection';
import { CategoryShowcase } from './components/CategoryShowcase';
import { HeritageSection } from './components/HeritageSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LiveGoldRates } from './components/LiveGoldRates';
import { CollectionPreview } from './components/CollectionPreview';
import { GoldGuideSection } from './components/GoldGuideSection';
import { AltininiGetirPage } from './components/AltininiGetirPage';
import { CorporatePagesModal } from './components/CorporatePagesModal';
import { ContactFooter } from './components/ContactFooter';
import { ManifestoModal } from './components/ManifestoModal';
import { LuxuryLoader } from './components/LuxuryLoader';
import { WishlistDrawer } from './components/WishlistDrawer';
import {
  Product,
  SiteVisualContent,
  StoryFeatureConfig,
  NavigationGroup,
  GuideArticle,
  AltininiGetirConfig,
  ContentPage,
  FooterLink,
  TopBarConfig,
} from './types';
import { PRODUCTS_CATALOG } from './data/productsData';
import { CustomCategory, DEFAULT_CATEGORIES } from './data/categoriesData';
import { DEFAULT_STORY_FEATURE } from './components/StoryCategoryBar';
import { INITIAL_LIKES } from './data/likesData';
import { resolveNavigationLink } from './utils/categoryHelper';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLogin } from './components/admin/AdminLogin';
import { BannerManager } from './components/admin/BannerManager';
import {
  trackPageView,
  analytics,
} from './services/analyticsService';
import {
  listenToSiteVisualContent,
  DEFAULT_SITE_VISUAL_CONTENT,
} from './services/bannerContentService';
import {
  listenToNavigationGroups,
  seedDefaultNavigationIfEmpty,
} from './services/navigationService';
import {
  listenToGuideArticles,
  seedDefaultGuideIfEmpty,
} from './services/guideService';
import {
  listenToAltininiGetirConfig,
  listenToContentPages,
  listenToFooterLinks,
  listenToTopBarConfig,
  seedDefaultContentPagesIfEmpty,
} from './services/contentPagesService';
import { DEFAULT_NAVIGATION_GROUPS } from './data/defaultNavigationData';
import { DEFAULT_GUIDE_ARTICLES } from './data/defaultGuideData';
import {
  DEFAULT_ALTININI_GETIR_CONFIG,
  DEFAULT_CONTENT_PAGES,
  DEFAULT_FOOTER_LINKS,
  DEFAULT_TOP_BAR_CONFIG,
} from './data/defaultContentPagesData';
import { initializeAllFirestoreCollections } from './services/initFirebaseCollections';

// Sub-component that handles rendering /admin view vs customer store based on current path and auth state
const AdminRouteContainer: React.FC = () => {
  const { isAdmin, isAdminAuthenticated, loading } = useAdminAuth();
  const authenticated = isAdmin || isAdminAuthenticated;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-amber-300 font-sans-luxury">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#c89d3a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-wider uppercase">Yönetici Paneli Doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <AdminLogin
        onBackToHome={() => {
          if (window.location.hash) window.location.hash = '';
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
      />
    );
  }

  return (
    <BannerManager
      onBackToHome={() => {
        if (window.location.hash) window.location.hash = '';
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }}
    />
  );
};

export default function App() {
  // Check if current URL path or hash is /admin or #admin
  const [isAdminPath, setIsAdminPath] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path.startsWith('/admin') || hash.startsWith('#admin') || path.endsWith('/admin');
  });

  // Listen to popstate and hashchange for direct link navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setIsAdminPath(path.startsWith('/admin') || hash.startsWith('#admin') || path.endsWith('/admin'));
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // 1. Site Visual Content State (Banners, Hero Slider, Vitrin)
  const [siteVisualContent, setSiteVisualContent] = useState<SiteVisualContent>(DEFAULT_SITE_VISUAL_CONTENT);

  // 2. Navigation Groups State (Firestore driven)
  const [navGroups, setNavGroups] = useState<NavigationGroup[]>(DEFAULT_NAVIGATION_GROUPS);

  // 3. Altın Rehberi State (Firestore driven)
  const [guideArticles, setGuideArticles] = useState<GuideArticle[]>(DEFAULT_GUIDE_ARTICLES);
  const [selectedGuideSlug, setSelectedGuideSlug] = useState<string | null>(null);

  // 4. Altınını Getir Config (Firestore driven)
  const [altininiGetirConfig, setAltininiGetirConfig] = useState<AltininiGetirConfig>(DEFAULT_ALTININI_GETIR_CONFIG);

  // 5. Corporate Content Pages (Firestore driven)
  const [contentPages, setContentPages] = useState<ContentPage[]>(DEFAULT_CONTENT_PAGES);
  const [selectedCorporatePage, setSelectedCorporatePage] = useState<ContentPage | null>(null);
  const [corporateModalOpen, setCorporateModalOpen] = useState<boolean>(false);

  // 6. Footer Links (Firestore driven)
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(DEFAULT_FOOTER_LINKS);

  // 7. Top Bar Config (Firestore driven)
  const [topBarConfig, setTopBarConfig] = useState<TopBarConfig>(DEFAULT_TOP_BAR_CONFIG);

  // Subscribe to all Firestore real-time streams & auto-populate collections if needed
  useEffect(() => {
    // Auto-verify and populate collections in Firestore
    initializeAllFirestoreCollections().catch(console.warn);

    const unsubVisual = listenToSiteVisualContent((content) => {
      if (content) setSiteVisualContent(content);
    });

    const unsubNav = listenToNavigationGroups((groups) => {
      if (groups && groups.length > 0) setNavGroups(groups);
    });

    const unsubGuide = listenToGuideArticles((articles) => {
      if (articles && articles.length > 0) setGuideArticles(articles);
    });

    const unsubAltininiGetir = listenToAltininiGetirConfig((config) => {
      if (config) setAltininiGetirConfig(config);
    });

    const unsubPages = listenToContentPages((pages) => {
      if (pages && pages.length > 0) setContentPages(pages);
    });

    const unsubFooter = listenToFooterLinks((links) => {
      if (links && links.length > 0) setFooterLinks(links);
    });

    const unsubTopBar = listenToTopBarConfig((config) => {
      if (config) setTopBarConfig(config);
    });

    return () => {
      unsubVisual?.();
      unsubNav?.();
      unsubGuide?.();
      unsubAltininiGetir?.();
      unsubPages?.();
      unsubFooter?.();
      unsubTopBar?.();
    };
  }, []);

  const [activeTab, setActiveTab] = useState<
    'anasayfa' | 'katalog' | 'koleksiyon' | 'kurlar' | 'rehber' | 'altinini-getir' | 'blog'
  >('anasayfa');

  // Google Analytics & Firebase Analytics Page Tracking
  useEffect(() => {
    const titles: Record<string, string> = {
      anasayfa: 'Bursa Altın - Anasayfa',
      katalog: 'Bursa Altın - Mücevher & Altın Kataloğu',
      koleksiyon: 'Bursa Altın - Özel Koleksiyon',
      kurlar: 'Bursa Altın - Canlı Kapalıçarşı Altın Kurları',
      rehber: 'Bursa Altın - Altın ve Mücevher Rehberi',
      'altinini-getir': 'Bursa Altın - Altınını Getir (Bozdur & Takas)',
      blog: 'Bursa Altın - Blog & Haberler',
    };
    trackPageView(`/${activeTab}`, titles[activeTab] || `Bursa Altın - ${activeTab}`);
  }, [activeTab]);

  const [catalogInitialCategory, setCatalogInitialCategory] = useState<string>('all');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [detailModalInitialTab, setDetailModalInitialTab] = useState<'details' | 'gallery'>('details');

  // Dynamic Products and Categories with localStorage persistence
  const [productsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bursa_altin_custom_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return PRODUCTS_CATALOG;
    } catch {
      return PRODUCTS_CATALOG;
    }
  });

  const [categoriesList] = useState<CustomCategory[]>(() => {
    try {
      const saved = localStorage.getItem('bursa_altin_custom_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((c: CustomCategory) => c.id !== 'ozel');
        }
      }
      return DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  // Story / Live Rates spotlight configuration
  const [storyFeature] = useState<StoryFeatureConfig>(() => {
    try {
      const saved = localStorage.getItem('bursa_altin_story_feature');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_STORY_FEATURE;
  });

  const [likesMap, setLikesMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('bursa_altin_likes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return INITIAL_LIKES;
  });

  const [userLikedIds, setUserLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bursa_altin_user_liked_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return ['prod-1', 'prod-4'];
  });

  useEffect(() => {
    try {
      localStorage.setItem('bursa_altin_likes', JSON.stringify(likesMap));
    } catch (e) {
      console.error(e);
    }
  }, [likesMap]);

  useEffect(() => {
    try {
      localStorage.setItem('bursa_altin_user_liked_ids', JSON.stringify(userLikedIds));
    } catch (e) {
      console.error(e);
    }
  }, [userLikedIds]);

  // Modals and Drawers
  const [manifestoOpen, setManifestoOpen] = useState<boolean>(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bursa_altin_wishlist');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Sync Wishlist with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('bursa_altin_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  // Initial page load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleNavigateToCatalogWithCategory = (categoryInput: string = 'all') => {
    const resolved = resolveNavigationLink(categoryInput);
    if (resolved.targetTab === 'rehber' && resolved.guideSlug) {
      handleOpenGuideArticle(resolved.guideSlug);
      return;
    }
    if (resolved.targetTab === 'altinini-getir') {
      setActiveTab('altinini-getir');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (resolved.targetTab === 'kurlar') {
      setActiveTab('kurlar');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCatalogInitialCategory(categoryInput || 'all');
    setActiveTab('katalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductDetail = (
    product: Product,
    initialTab: 'details' | 'gallery' = 'details'
  ) => {
    setSelectedProductForDetail(product);
    setDetailModalInitialTab(initialTab);
    analytics.viewItem({
      id: product.id,
      title: product.title,
      category: product.categoryLabel,
      price: product.price,
    });
  };

  // Like Toggle Operation
  const handleToggleLike = (productId: string) => {
    const isAlreadyLiked = userLikedIds.includes(productId);
    if (isAlreadyLiked) {
      setUserLikedIds((prev) => prev.filter((id) => id !== productId));
      setLikesMap((prev) => ({
        ...prev,
        [productId]: Math.max(0, (prev[productId] || 1) - 1),
      }));
      showToast('Beğeniniz geri alındı.');
    } else {
      setUserLikedIds((prev) => [...prev, productId]);
      setLikesMap((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      }));
      showToast('Ürünü beğendiniz.');
    }
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    const isPresent = wishlistIds.includes(product.id);
    if (isPresent) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`"${product.title}" favorilerden kaldırıldı.`);
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      analytics.addToWishlist({
        id: product.id,
        title: product.title,
      });
      showToast(`"${product.title}" favorilere eklendi.`);
    }
  };

  const handleRemoveWishlist = (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    showToast('Ürün favorilerden kaldırıldı.');
  };

  const wishlistProducts = useMemo(() => {
    return productsList.filter((p) => wishlistIds.includes(p.id));
  }, [productsList, wishlistIds]);

  const handleOpenCorporatePage = (slug: string) => {
    const found = contentPages.find(
      (p) => p.slug === slug || p.pageType === slug || p.id === slug || p.id === `page-${slug}`
    );
    if (found) {
      setSelectedCorporatePage(found);
      setCorporateModalOpen(true);
    } else if (slug === 'hakkimizda' || slug === 'miras') {
      setManifestoOpen(true);
    } else {
      showToast(`${slug} sayfası açılıyor...`);
    }
  };

  const handleOpenGuideArticle = (slug: string) => {
    setSelectedGuideSlug(slug);
    setActiveTab('rehber');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Universal Link Router for all banners, hero slides, promo boxes, and category cards
  const handleUniversalLink = (targetUrl: string) => {
    if (!targetUrl) return;

    const url = targetUrl.trim();

    // 1. External Links
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (url.startsWith('tel:') || url.startsWith('mailto:')) {
      window.location.href = url;
      return;
    }

    // 2. Tab navigation
    if (url.startsWith('tab:')) {
      const tabKey = url.replace('tab:', '') as any;
      const validTabs = ['anasayfa', 'katalog', 'koleksiyon', 'kurlar', 'rehber', 'altinini-getir', 'blog'];
      if (validTabs.includes(tabKey)) {
        setActiveTab(tabKey);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 4. Kategori navigation
    if (
      url.startsWith('kategori:') ||
      url.startsWith('category:') ||
      url.startsWith('cat:') ||
      url.startsWith('/kategori/') ||
      url.startsWith('/katalog?category=')
    ) {
      let cat = '';
      if (url.includes(':')) {
        cat = url.split(':')[1];
      } else if (url.includes('=')) {
        cat = url.split('=')[1];
      } else {
        cat = url.replace('/kategori/', '');
      }
      handleNavigateToCatalogWithCategory(cat || 'all');
      return;
    }

    // 5. Altın Rehberi Article
    if (
      url.startsWith('rehber:') ||
      url.startsWith('guide:') ||
      url.startsWith('article:') ||
      url.startsWith('/rehber/')
    ) {
      let slug = '';
      if (url.includes(':')) {
        slug = url.split(':')[1];
      } else {
        slug = url.replace('/rehber/', '');
      }
      handleOpenGuideArticle(slug);
      return;
    }

    // 6. Corporate Pages
    if (url.startsWith('page:') || url.startsWith('sayfa:') || url.startsWith('/sayfa/')) {
      let slug = '';
      if (url.includes(':')) {
        slug = url.split(':')[1];
      } else {
        slug = url.replace('/sayfa/', '');
      }
      handleOpenCorporatePage(slug);
      return;
    }

    // 7. Product Detail Modal
    if (url.startsWith('product:') || url.startsWith('urun:') || url.startsWith('prod:')) {
      const prodId = url.split(':')[1];
      const found = productsList.find((p) => p.id === prodId) || PRODUCTS_CATALOG.find((p) => p.id === prodId);
      if (found) {
        handleOpenProductDetail(found, 'details');
        return;
      }
    }

    // 8. Direct matching by tab, category, article or corporate slug
    const standardTabs = ['anasayfa', 'katalog', 'koleksiyon', 'kurlar', 'rehber', 'altinini-getir'];
    if (standardTabs.includes(url)) {
      setActiveTab(url as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const knownCategories = ['bilezik', 'yuzuk', 'kolye', 'kupe', 'yatirim', 'all', 'ozel'];
    if (knownCategories.includes(url)) {
      handleNavigateToCatalogWithCategory(url);
      return;
    }

    const matchedGuide = guideArticles.find((g) => g.slug === url || g.id === url);
    if (matchedGuide) {
      handleOpenGuideArticle(matchedGuide.slug);
      return;
    }

    const matchedPage = contentPages.find((p) => p.slug === url || p.id === url || p.pageType === url);
    if (matchedPage) {
      handleOpenCorporatePage(matchedPage.slug);
      return;
    }

    // Default fallback: search category in catalog
    handleNavigateToCatalogWithCategory(url);
  };

  // If URL path is /admin, render Admin Route
  if (isAdminPath) {
    return (
      <AdminAuthProvider>
        <AdminRouteContainer />
      </AdminAuthProvider>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-gray-900 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white border border-[#c89d3a] px-5 py-3 text-xs font-sans-luxury font-medium rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#c89d3a]" />
          {toastMessage}
        </div>
      )}

      {/* Top Header Navigation (Dynamic Firestore Driven) */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectProduct={(prod) => handleOpenProductDetail(prod, 'details')}
        onNavigateCategory={(cat) => handleNavigateToCatalogWithCategory(cat)}
        onOpenGuideArticle={(slug) => handleOpenGuideArticle(slug)}
        navigationGroups={navGroups}
        topBarConfig={topBarConfig}
        productsList={productsList}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        
        {/* 1. HOMEPAGE VIEW */}
        {activeTab === 'anasayfa' && (
          <div className="space-y-4">
            {/* Hero E-Commerce Slider (Synced with Firestore) */}
            <HeroECommerceSlider
              onNavigateCatalog={(catId) => handleNavigateToCatalogWithCategory(catId || 'all')}
              onNavigateRates={() => {
                setActiveTab('kurlar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectProduct={(prod) => handleOpenProductDetail(prod, 'details')}
              onUniversalLink={handleUniversalLink}
              heroConfig={siteVisualContent.hero}
              productsList={productsList}
            />

            {/* 3-Box Promo Mini-Banners (Synced with Firestore) */}
            <PromoMiniBanners
              onNavigateCatalog={(catId) => handleNavigateToCatalogWithCategory(catId || 'all')}
              onUniversalLink={handleUniversalLink}
              promosList={siteVisualContent.promos || (siteVisualContent as any).promoBanners}
            />

            {/* Tabbed Product Showcase */}
            <TabbedHomeShowcase
              onSelectProduct={(product, initialTab) => handleOpenProductDetail(product, initialTab || 'details')}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onNavigateCatalog={(catId) => handleNavigateToCatalogWithCategory(catId || 'all')}
              productsList={productsList}
              categoriesList={categoriesList}
              likesMap={likesMap}
              userLikedIds={userLikedIds}
              onToggleLike={handleToggleLike}
            />

            {/* Trust & Insured Delivery Badges */}
            <TrustBadgesSection />

            {/* Visual Category Showcase (Synced with Firestore) */}
            <CategoryShowcase
              onSelectCategory={(catId) => handleNavigateToCatalogWithCategory(catId)}
              onUniversalLink={handleUniversalLink}
              categoryCards={siteVisualContent.categoryCards}
            />

            {/* Heritage, Craftsmanship & Kapalıçarşı Story */}
            <HeritageSection
              onOpenManifesto={() => setManifestoOpen(true)}
            />
          </div>
        )}

        {/* 2. ALTININI GETİR DEDICATED SERVICE PAGE */}
        {activeTab === 'altinini-getir' && (
          <AltininiGetirPage
            config={altininiGetirConfig}
            onOpenGuideArticle={(slug) => handleOpenGuideArticle(slug)}
          />
        )}

        {/* 3. ALTIN REHBERİ (GOLD GUIDE KNOWLEDGE HUB) */}
        {(activeTab === 'rehber' || activeTab === 'blog') && (
          <GoldGuideSection
            articles={guideArticles}
            selectedArticleSlug={selectedGuideSlug}
            onSelectArticleSlug={(slug) => setSelectedGuideSlug(slug)}
            onNavigateCatalog={(cat) => handleNavigateToCatalogWithCategory(cat)}
          />
        )}

        {/* 4. INTERACTIVE PRODUCT CATALOG VIEW */}
        {activeTab === 'katalog' && (
          <ProductCatalog
            initialCategory={catalogInitialCategory}
            onSelectProduct={(product, initialTab) => handleOpenProductDetail(product, initialTab || 'details')}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            productsList={productsList}
            categoriesList={categoriesList}
            likesMap={likesMap}
            userLikedIds={userLikedIds}
            onToggleLike={handleToggleLike}
          />
        )}

        {/* 5. SNEAK PEEK & EXCLUSIVE COLLECTION VIEW */}
        {activeTab === 'koleksiyon' && (
          <CollectionPreview />
        )}

        {/* 6. LIVE GOLD RATES & CALCULATOR VIEW */}
        {activeTab === 'kurlar' && (
          <LiveGoldRates />
        )}

      </main>

      {/* Bottom Contact & Information Footer (Dynamic Firestore Links) */}
      <ContactFooter
        onOpenManifesto={() => setManifestoOpen(true)}
        onNavigateCategory={(cat) => handleNavigateToCatalogWithCategory(cat)}
        onOpenCorporatePage={(slug) => handleOpenCorporatePage(slug)}
        onOpenGuideArticle={(slug) => handleOpenGuideArticle(slug)}
        onOpenAdmin={() => {
          window.history.pushState({}, '', '/admin');
          setIsAdminPath(true);
        }}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        footerLinks={footerLinks}
      />

      {/* Corporate Pages Modal */}
      <CorporatePagesModal
        isOpen={corporateModalOpen}
        page={selectedCorporatePage}
        onClose={() => setCorporateModalOpen(false)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistDrawerOpen}
        onClose={() => setWishlistDrawerOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveWishlist={handleRemoveWishlist}
        onSelectProduct={(product) => handleOpenProductDetail(product, 'details')}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProductForDetail ? wishlistIds.includes(selectedProductForDetail.id) : false}
        onShowToast={showToast}
        likesCount={selectedProductForDetail ? (likesMap[selectedProductForDetail.id] ?? selectedProductForDetail.likesCount ?? 0) : 0}
        isLikedByUser={selectedProductForDetail ? userLikedIds.includes(selectedProductForDetail.id) : false}
        onToggleLike={handleToggleLike}
        initialTab={detailModalInitialTab}
      />

      {/* Popups and Modals */}
      <ManifestoModal
        isOpen={manifestoOpen}
        onClose={() => setManifestoOpen(false)}
      />

      {/* Luxury Blurred Logo Loader */}
      <LuxuryLoader
        isLoading={isLoading}
        onClose={() => setIsLoading(false)}
        message="Bursa Altın Deneyimi Yükleniyor"
      />
    </div>
  );
}
