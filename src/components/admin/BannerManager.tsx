import React, { useState, useEffect } from 'react';
import {
  LogOut,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  HeroSectionConfig,
  HeroSlide,
  PromoBannerItem,
  CategoryShowcaseItem,
  SiteVisualContent,
} from '../../types';
import {
  getSiteVisualContent,
  saveHeroSectionConfig,
  savePromoBanners,
  saveCategoryShowcase,
  seedInitialVisualContentToFirebase,
  DEFAULT_PROMO_BANNERS,
  DEFAULT_CATEGORY_CARDS,
} from '../../services/bannerContentService';
import { seedDefaultNavigationIfEmpty } from '../../services/navigationService';
import { seedDefaultGuideArticlesIfEmpty } from '../../services/guideService';
import { seedDefaultContentPagesIfEmpty, seedDefaultFooterLinksIfEmpty } from '../../services/contentPagesService';
import { safeDeleteStorageImage } from '../../services/storageService';
import { DEFAULT_HERO_CONFIG } from '../../data/heroData';
import { ImageUploadField } from './ImageUploadField';
import { LinkSelectorInput } from './LinkSelectorInput';
import { MenuManager } from './MenuManager';
import { AltininiGetirManager } from './AltininiGetirManager';
import { GuideManager } from './GuideManager';
import { CorporateManager } from './CorporateManager';
import { AnalyticsManager } from './AnalyticsManager';
import { BookOpen, Coins, Building2, Menu as MenuIcon, BarChart3 } from 'lucide-react';

interface BannerManagerProps {
  onBackToHome?: () => void;
  onShowToast?: (msg: string) => void;
}

export const BannerManager: React.FC<BannerManagerProps> = ({
  onBackToHome,
  onShowToast = (msg) => alert(msg),
}) => {
  const { user, isAdmin, logout } = useAdminAuth();

  // Active Tab in Admin
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'hero' | 'sidecards' | 'promos' | 'categories' | 'menu' | 'altinini-getir' | 'guide' | 'corporate'
  >('analytics');

  // Loaded Content State
  const [heroConfig, setHeroConfig] = useState<HeroSectionConfig>(DEFAULT_HERO_CONFIG);
  const [promosList, setPromosList] = useState<PromoBannerItem[]>(DEFAULT_PROMO_BANNERS);
  const [categoryCards, setCategoryCards] = useState<CategoryShowcaseItem[]>(DEFAULT_CATEGORY_CARDS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);

  // Load latest visual content from Firebase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const content = await getSiteVisualContent();
        setHeroConfig(content.hero || DEFAULT_HERO_CONFIG);
        setPromosList(content.promos || DEFAULT_PROMO_BANNERS);
        setCategoryCards(content.categoryCards || DEFAULT_CATEGORY_CARDS);
      } catch (err) {
        console.error('Veriler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save Hero Slides
  const handleSaveHero = async () => {
    setSaving(true);
    try {
      await saveHeroSectionConfig(heroConfig);
      onShowToast('Hero Slider ve afiş ayarları başarıyla kaydedildi.');
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Save Promo Banners
  const handleSavePromos = async () => {
    setSaving(true);
    try {
      await savePromoBanners(promosList);
      onShowToast('3’lü kampanya afişleri başarıyla kaydedildi.');
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Save Category Cards
  const handleSaveCategories = async () => {
    setSaving(true);
    try {
      await saveCategoryShowcase(categoryCards);
      onShowToast('Kategori vitrin kartları başarıyla kaydedildi.');
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // One-time All Content Seed Handler to Firebase
  const handleSeedDefaults = async () => {
    const confirmSeed = window.confirm(
      'Mevcut sitenin tüm görsel afişlerini, slaytlarını, menü ağacını, altın rehberini ve kurumsal sayfalarını Firebase Firestore veritabanına aktarmak istediğinize emin misiniz? (Mevcut verileri temiz bir şekilde senkronize eder).'
    );
    if (!confirmSeed) return;

    setSeedLoading(true);
    try {
      await Promise.all([
        seedInitialVisualContentToFirebase(),
        seedDefaultNavigationIfEmpty(true),
        seedDefaultGuideArticlesIfEmpty(true),
        seedDefaultContentPagesIfEmpty(true),
        seedDefaultFooterLinksIfEmpty(true),
      ]);
      const updated = await getSiteVisualContent();
      setHeroConfig(updated.hero);
      setPromosList(updated.promos);
      setCategoryCards(updated.categoryCards);
      onShowToast('🔥 Tüm afişler, menüler, rehber ve kurumsal sayfalar Firebase Firestore veritabanına başarıyla aktarıldı ve senkronize edildi.');
    } catch (err: any) {
      onShowToast(`Firebase aktarım hatası: ${err.message}`);
    } finally {
      setSeedLoading(false);
    }
  };

  // --- HERO SLIDE HANDLERS ---
  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      tag: 'YENİ KOLEKSİYON',
      title: 'Özel Zanaat Mücevherler',
      subtitle: 'Bursa Kapalıçarşı atölyelerinden en seçkin el işçiliği tasarımlar.',
      ctaText: 'Koleksiyonu Keşfet',
      category: 'bilezik',
      bgImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=80',
      mobileBgImage: '',
      isEnabled: true,
    };
    setHeroConfig((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
  };

  const handleRemoveSlide = (index: number) => {
    if (heroConfig.slides.length <= 1) {
      alert('En az 1 adet slider afişi bulunmalıdır.');
      return;
    }
    const slideToDelete = heroConfig.slides[index];
    const confirmDelete = window.confirm(`"${slideToDelete.title}" başlıklı slaytı silmek istediğinize emin misiniz?`);
    if (!confirmDelete) return;

    // Remove slide
    const updated = [...heroConfig.slides];
    updated.splice(index, 1);
    setHeroConfig((prev) => ({ ...prev, slides: updated }));

    // Safe delete image if from storage
    if (slideToDelete.bgImage) safeDeleteStorageImage(slideToDelete.bgImage);
    if (slideToDelete.mobileBgImage) safeDeleteStorageImage(slideToDelete.mobileBgImage);
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const updated = [...heroConfig.slides];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setHeroConfig((prev) => ({ ...prev, slides: updated }));
  };

  // --- PROMO BANNERS HANDLERS ---
  const handleAddPromo = () => {
    const newPromo: PromoBannerItem = {
      id: `promo-${Date.now()}`,
      tag: 'YENİ FIRSAT',
      title: 'Yeni Sezon Mücevherler',
      subtitle: 'Sertifikalı ve garantili altın modelleri',
      ctaText: 'Şimdi İncele',
      imageUrl: 'https://images.unsplash.com/photo-1611591475155-426ea754ce4e?auto=format&fit=crop&w=800&q=80',
      mobileImageUrl: '',
      categoryKey: 'bilezik',
      actionType: 'category',
      bgColorGradient: 'from-[#1c1917] to-[#292524]',
      accentColor: '#d4af37',
      isEnabled: true,
      order: promosList.length + 1,
    };
    setPromosList((prev) => [...prev, newPromo]);
  };

  const handleRemovePromo = (index: number) => {
    const item = promosList[index];
    if (window.confirm(`"${item.title}" afişini silmek istediğinize emin misiniz?`)) {
      const updated = [...promosList];
      updated.splice(index, 1);
      setPromosList(updated);
      if (item.imageUrl) safeDeleteStorageImage(item.imageUrl);
      if (item.mobileImageUrl) safeDeleteStorageImage(item.mobileImageUrl);
    }
  };

  // Access check
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#111111] text-gray-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-serif-luxury text-white mb-2">Yetkisiz Erişim</h2>
        <p className="text-xs text-gray-400 max-w-md mb-6 leading-relaxed">
          Giriş yaptığınız kullanıcı hesabı (<code className="font-mono text-gray-300">{user?.email}</code>), sistemde tanımlı Admin UID (<code className="font-mono text-[#c89d3a]">{import.meta.env.VITE_FIREBASE_ADMIN_UID || 'Belirtilmemiş'}</code>) ile eşleşmemektedir.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold"
          >
            Farklı Hesapla Giriş Yap
          </button>
          <button
            onClick={() => (onBackToHome ? onBackToHome() : (window.location.href = '/'))}
            className="px-4 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-black rounded-lg text-xs font-bold font-sans-luxury uppercase"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-gray-200 selection:bg-[#c89d3a] selection:text-black">
      
      {/* Top Header */}
      <header className="bg-[#18181b] border-b border-[#27272a] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#c89d3a]/10 border border-[#c89d3a]/40 flex items-center justify-center text-[#c89d3a]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wide">
              MEHMET HAMDEMİRCİ
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-sans-luxury uppercase tracking-widest">
                Görsel & İçerik Yönetim Konsolu
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 text-[9px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firebase Firestore Canlı
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Seed Initial Data Button */}
          <button
            type="button"
            disabled={seedLoading}
            onClick={handleSeedDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#222226] hover:bg-[#2c2c32] text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs"
            title="Mevcut tüm afiş, menü ve sayfaları Firebase Firestore'a aktarır ve senkronize eder"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>{seedLoading ? 'Aktarılıyor...' : 'Firebase’e Senkronize Et (Seed)'}</span>
          </button>

          <button
            type="button"
            onClick={() => (onBackToHome ? onBackToHome() : (window.location.href = '/'))}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Siteyi Canlı Önizle"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-lg text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Güvenli Çıkış</span>
          </button>
        </div>
      </header>

      {/* Info Banner for Firebase Firestore Live Status */}
      <div className="bg-[#121215] border-b border-[#222228] px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2 text-gray-300">
          <span className="text-amber-400">🔥 Firestore DB:</span>
          <span className="text-gray-400">Tüm afişler, yan kartlar, 3'lü bannerlar ve menüler veritabanında saklanır; yaptığınız düzenlemeler kaydedildiği anda sitede anında canlıya geçer.</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
          <span>Koleksiyon: <strong className="text-amber-300 font-normal">site_content</strong></span>
          <span>•</span>
          <span>Auth UID: <strong className="text-emerald-400 font-normal">{user?.uid ? `${user.uid.slice(0, 8)}...` : 'Yetkili'}</strong></span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 border-b border-[#27272a] gap-2 mb-6 scrollbar-none">
          {/* TAB: GOOGLE & FIREBASE ANALYTICS */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans-luxury font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-900/40 border border-amber-400/40'
                : 'bg-[#18181b] text-amber-400 hover:text-white hover:bg-[#222226] border border-amber-500/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <BarChart3 className="w-4 h-4" />
            <span>Google Analitik & Reklamlar (Ads)</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans-luxury font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'hero'
                ? 'bg-[#c89d3a] text-black shadow-md'
                : 'bg-[#18181b] text-gray-400 hover:text-white hover:bg-[#222226]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Hero Slider ({heroConfig.slides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sidecards')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans-luxury font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'sidecards'
                ? 'bg-[#c89d3a] text-black shadow-md'
                : 'bg-[#18181b] text-gray-400 hover:text-white hover:bg-[#222226]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hero Yan Kartlar</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans-luxury font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'promos'
                ? 'bg-[#c89d3a] text-black shadow-md'
                : 'bg-[#18181b] text-gray-400 hover:text-white hover:bg-[#222226]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>3’lü Afişler ({promosList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans-luxury font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'categories'
                ? 'bg-[#c89d3a] text-black shadow-md'
                : 'bg-[#18181b] text-gray-400 hover:text-white hover:bg-[#222226]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Vitrin Kartları ({categoryCards.length})</span>
          </button>

          {/* New Section 1: Menu Management */}
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans-luxury font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'menu'
                ? 'bg-[#c89d3a] text-black shadow-md'
                : 'bg-[#18181b] text-amber-300 hover:text-white hover:bg-[#222226] border border-amber-500/30'
            }`}
          >
            <MenuIcon className="w-4 h-4" />
            <span>Menü & Mega Menü</span>
          </button>

          {/* New Section 2: Altınını Getir Management */}
          <button
            onClick={() => setActiveTab('altinini-getir')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans-luxury font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'altinini-getir'
                ? 'bg-[#c89d3a] text-black shadow-md'
                : 'bg-[#18181b] text-amber-300 hover:text-white hover:bg-[#222226] border border-amber-500/30'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Altınını Getir</span>
          </button>

          {/* New Section 3: Altın Rehberi Management */}
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans-luxury font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'guide'
                ? 'bg-[#c89d3a] text-black shadow-md'
                : 'bg-[#18181b] text-amber-300 hover:text-white hover:bg-[#222226] border border-amber-500/30'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Altın Rehberi</span>
          </button>

          {/* New Section 4: Corporate Pages & Footer */}
          <button
            onClick={() => setActiveTab('corporate')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans-luxury font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === 'corporate'
                ? 'bg-[#c89d3a] text-black shadow-md'
                : 'bg-[#18181b] text-amber-300 hover:text-white hover:bg-[#222226] border border-amber-500/30'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Kurumsal & Footer</span>
          </button>
        </div>

        {/* --- TAB 0: GOOGLE & FIREBASE ANALYTICS --- */}
        {activeTab === 'analytics' && (
          <AnalyticsManager onBackToHome={onBackToHome} onShowToast={onShowToast} />
        )}

        {/* --- TAB 1: HERO SLIDER AFİŞLERİ --- */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181b] p-4 rounded-xl border border-[#27272a]">
              <div>
                <h2 className="text-sm font-bold text-white font-serif-luxury">
                  Hero Manşet Slaytları
                </h2>
                <p className="text-xs text-gray-400 font-sans-luxury">
                  Masaüstü ve mobil ekranlar için ayrı görseller yükleyebilir, başlık ve buton yönlendirmelerini düzenleyebilirsiniz.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="px-3.5 py-2 bg-[#27272a] hover:bg-[#333338] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#c89d3a]" />
                  <span>Yeni Slayt Ekle</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveHero}
                  className="px-5 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-black text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                </button>
              </div>
            </div>

            {/* Slides List */}
            <div className="space-y-6">
              {heroConfig.slides.map((slide, index) => (
                <div
                  key={slide.id || index}
                  className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 sm:p-6 space-y-5"
                >
                  {/* Card Header & Controls */}
                  <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#c89d3a]/20 text-[#c89d3a] flex items-center justify-center text-xs font-bold font-mono">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-white font-serif-luxury">
                        {slide.title || 'İsimsiz Slayt'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Toggle Visibility */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...heroConfig.slides];
                          updated[index].isEnabled = updated[index].isEnabled === false ? true : false;
                          setHeroConfig({ ...heroConfig, slides: updated });
                        }}
                        className={`p-1.5 rounded-lg text-xs flex items-center gap-1 font-semibold ${
                          slide.isEnabled !== false
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                        title={slide.isEnabled !== false ? 'Yayında (Tıklayarak Gizleyin)' : 'Gizli (Tıklayarak Yayınlayın)'}
                      >
                        {slide.isEnabled !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span className="text-[10px] hidden sm:inline">{slide.isEnabled !== false ? 'Yayında' : 'Gizli'}</span>
                      </button>

                      {/* Move Up/Down */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveSlide(index, 'up')}
                        className="p-1.5 bg-[#222226] hover:bg-[#2c2c32] text-gray-300 disabled:opacity-30 rounded-lg"
                        title="Yukarı Taşı"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={index === heroConfig.slides.length - 1}
                        onClick={() => handleMoveSlide(index, 'down')}
                        className="p-1.5 bg-[#222226] hover:bg-[#2c2c32] text-gray-300 disabled:opacity-30 rounded-lg"
                        title="Aşağı Taşı"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Remove Slide */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSlide(index)}
                        className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-lg"
                        title="Slaytı Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Desktop Image */}
                    <div className="bg-[#121214] p-4 rounded-xl border border-[#27272a]">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-2">
                        <Monitor className="w-4 h-4" />
                        <span>Masaüstü Arka Plan Görseli (Geniş Ekran)</span>
                      </div>
                      <ImageUploadField
                        label="Görsel Dosyası veya URL"
                        subLabel="Önerilen: 1920x800px veya 1600x650px yatay afiş"
                        currentUrl={slide.bgImage}
                        folderCategory="hero"
                        aspectRatioHint="16:9 / 21:9"
                        onChange={(url) => {
                          const updated = [...heroConfig.slides];
                          updated[index].bgImage = url;
                          setHeroConfig({ ...heroConfig, slides: updated });
                        }}
                      />
                    </div>

                    {/* Mobile Image */}
                    <div className="bg-[#121214] p-4 rounded-xl border border-[#27272a]">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 mb-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Mobil Arka Plan Görseli (Dikey / İsteğe Bağlı)</span>
                      </div>
                      <ImageUploadField
                        label="Mobil Görsel Dosyası veya URL"
                        subLabel="Boş bırakılırsa masaüstü görseli kullanılır. Önerilen: 800x900px dikey"
                        currentUrl={slide.mobileBgImage || ''}
                        folderCategory="hero"
                        aspectRatioHint="4:5 / 1:1"
                        onChange={(url) => {
                          const updated = [...heroConfig.slides];
                          updated[index].mobileBgImage = url;
                          setHeroConfig({ ...heroConfig, slides: updated });
                        }}
                      />
                    </div>
                  </div>

                  {/* Text Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Üst Etiket (Rozet)</label>
                      <input
                        type="text"
                        value={slide.tag}
                        onChange={(e) => {
                          const updated = [...heroConfig.slides];
                          updated[index].tag = e.target.value;
                          setHeroConfig({ ...heroConfig, slides: updated });
                        }}
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Ana Başlık</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...heroConfig.slides];
                          updated[index].title = e.target.value;
                          setHeroConfig({ ...heroConfig, slides: updated });
                        }}
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Buton Metni</label>
                      <input
                        type="text"
                        value={slide.ctaText}
                        onChange={(e) => {
                          const updated = [...heroConfig.slides];
                          updated[index].ctaText = e.target.value;
                          setHeroConfig({ ...heroConfig, slides: updated });
                        }}
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Alt Açıklama Metni</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => {
                          const updated = [...heroConfig.slides];
                          updated[index].subtitle = e.target.value;
                          setHeroConfig({ ...heroConfig, slides: updated });
                        }}
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>

                    <div className="sm:col-span-4 bg-[#121214] p-3.5 rounded-xl border border-[#27272a]">
                      <LinkSelectorInput
                        label="Slayt Tıklama & Yönlendirme Hedefi"
                        subLabel="Kullanıcı slayt görseline veya butona tıkladığında açılacak sayfa, kategori veya link"
                        value={slide.targetUrl || (slide.category ? `kategori:${slide.category}` : 'kategori:all')}
                        onChange={(val) => {
                          const updated = [...heroConfig.slides];
                          updated[index].targetUrl = val;
                          if (val.startsWith('kategori:') || val.startsWith('cat:')) {
                            updated[index].category = val.split(':')[1];
                          }
                          setHeroConfig({ ...heroConfig, slides: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: HERO SIDE CARDS --- */}
        {activeTab === 'sidecards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-[#18181b] p-4 rounded-xl border border-[#27272a]">
              <div>
                <h2 className="text-sm font-bold text-white font-serif-luxury">
                  Hero Sağ Yan Kartları (Günün Fırsatı & Canlı Kurlar)
                </h2>
                <p className="text-xs text-gray-400 font-sans-luxury">
                  Hero slider'ın sağında yer alan 2 adet öne çıkan vitrin kartının görsel ve metinlerini güncelleyin.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={handleSaveHero}
                className="px-5 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-black text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kart 1: Günün Fırsatı */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Üst Kart: Günün Fırsatı</span>
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">Hero Yan Kart 1</span>
                </div>

                <ImageUploadField
                  label="Kart Görseli (Masaüstü & Mobil)"
                  subLabel="Kare (1:1) veya yuvarlak hatlı ürün görseli"
                  currentUrl={heroConfig.dealCard.imageUrl || ''}
                  folderCategory="sidecards"
                  aspectRatioHint="1:1 Kare"
                  onChange={(url) =>
                    setHeroConfig({
                      ...heroConfig,
                      dealCard: { ...heroConfig.dealCard, imageUrl: url },
                    })
                  }
                />

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Etiket Metni</label>
                    <input
                      type="text"
                      value={heroConfig.dealCard.tag}
                      onChange={(e) =>
                        setHeroConfig({
                          ...heroConfig,
                          dealCard: { ...heroConfig.dealCard, tag: e.target.value },
                        })
                      }
                      className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Kart Başlığı</label>
                    <input
                      type="text"
                      value={heroConfig.dealCard.title}
                      onChange={(e) =>
                        setHeroConfig({
                          ...heroConfig,
                          dealCard: { ...heroConfig.dealCard, title: e.target.value },
                        })
                      }
                      className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Alt Bilgi (Ayar & Gram)</label>
                    <input
                      type="text"
                      value={heroConfig.dealCard.subtitle}
                      onChange={(e) =>
                        setHeroConfig({
                          ...heroConfig,
                          dealCard: { ...heroConfig.dealCard, subtitle: e.target.value },
                        })
                      }
                      className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Satış Fiyatı (₺)</label>
                      <input
                        type="number"
                        value={heroConfig.dealCard.customPrice || ''}
                        onChange={(e) =>
                          setHeroConfig({
                            ...heroConfig,
                            dealCard: {
                              ...heroConfig.dealCard,
                              customPrice: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Çizili Eski Fiyat (₺)</label>
                      <input
                        type="number"
                        value={heroConfig.dealCard.originalPrice || ''}
                        onChange={(e) =>
                          setHeroConfig({
                            ...heroConfig,
                            dealCard: {
                              ...heroConfig.dealCard,
                              originalPrice: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>
                  </div>

                  <div className="bg-[#121214] p-3 rounded-xl border border-[#27272a]">
                    <LinkSelectorInput
                      label="Kart Tıklama & Yönlendirme Hedefi"
                      subLabel="Günün Fırsatı kartına tıklandığında açılacak hedef"
                      value={heroConfig.dealCard.targetUrl || 'kategori:all'}
                      onChange={(val) =>
                        setHeroConfig({
                          ...heroConfig,
                          dealCard: {
                            ...heroConfig.dealCard,
                            targetUrl: val,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Kart 2: Yatırımlık Külçe & Kurlar */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Alt Kart: Yatırımlık Has Külçe Altın</span>
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">Hero Yan Kart 2</span>
                </div>

                <ImageUploadField
                  label="Kart Görseli (Masaüstü & Mobil)"
                  subLabel="Külçe veya ziynet görseli"
                  currentUrl={heroConfig.investmentCard.imageUrl || ''}
                  folderCategory="sidecards"
                  aspectRatioHint="1:1 Kare"
                  onChange={(url) =>
                    setHeroConfig({
                      ...heroConfig,
                      investmentCard: { ...heroConfig.investmentCard, imageUrl: url },
                    })
                  }
                />

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Etiket Metni</label>
                    <input
                      type="text"
                      value={heroConfig.investmentCard.tag}
                      onChange={(e) =>
                        setHeroConfig({
                          ...heroConfig,
                          investmentCard: { ...heroConfig.investmentCard, tag: e.target.value },
                        })
                      }
                      className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Kart Başlığı</label>
                    <input
                      type="text"
                      value={heroConfig.investmentCard.title}
                      onChange={(e) =>
                        setHeroConfig({
                          ...heroConfig,
                          investmentCard: { ...heroConfig.investmentCard, title: e.target.value },
                        })
                      }
                      className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Alt Bilgi (Milyem & Garanti)</label>
                    <input
                      type="text"
                      value={heroConfig.investmentCard.subtitle}
                      onChange={(e) =>
                        setHeroConfig({
                          ...heroConfig,
                          investmentCard: { ...heroConfig.investmentCard, subtitle: e.target.value },
                        })
                      }
                      className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Fiyat (₺)</label>
                      <input
                        type="number"
                        value={heroConfig.investmentCard.customPrice || ''}
                        onChange={(e) =>
                          setHeroConfig({
                            ...heroConfig,
                            investmentCard: {
                              ...heroConfig.investmentCard,
                              customPrice: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Buton Yazısı</label>
                      <input
                        type="text"
                        value={heroConfig.investmentCard.buttonText || 'Canlı Kurlar'}
                        onChange={(e) =>
                          setHeroConfig({
                            ...heroConfig,
                            investmentCard: {
                              ...heroConfig.investmentCard,
                              buttonText: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>
                  </div>

                  <div className="bg-[#121214] p-3 rounded-xl border border-[#27272a]">
                    <LinkSelectorInput
                      label="Kart Tıklama & Yönlendirme Hedefi"
                      subLabel="Külçe / Kurlar kartına tıklandığında açılacak hedef"
                      value={heroConfig.investmentCard.targetUrl || 'tab:kurlar'}
                      onChange={(val) =>
                        setHeroConfig({
                          ...heroConfig,
                          investmentCard: {
                            ...heroConfig.investmentCard,
                            targetUrl: val,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: 3'LÜ KAMPANYA AFİŞLERİ --- */}
        {activeTab === 'promos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181b] p-4 rounded-xl border border-[#27272a]">
              <div>
                <h2 className="text-sm font-bold text-white font-serif-luxury">
                  3’lü Mini Kampanya Afişleri
                </h2>
                <p className="text-xs text-gray-400 font-sans-luxury">
                  Ana sayfada slider'ın altında yer alan 3 adet yan yana kampanya kutusunu düzenleyin.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddPromo}
                  className="px-3.5 py-2 bg-[#27272a] hover:bg-[#333338] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#c89d3a]" />
                  <span>Yeni Afiş Ekle</span>
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSavePromos}
                  className="px-5 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-black text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promosList.map((promo, idx) => (
                <div
                  key={promo.id || idx}
                  className="bg-[#18181b] border border-[#27272a] rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        Kutu #{idx + 1}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...promosList];
                            updated[idx].isEnabled = !updated[idx].isEnabled;
                            setPromosList(updated);
                          }}
                          className={`p-1.5 rounded-lg text-xs ${
                            promo.isEnabled
                              ? 'bg-emerald-950/60 text-emerald-400'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {promo.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemovePromo(idx)}
                          className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <ImageUploadField
                      label="Afiş Görseli (Masaüstü)"
                      subLabel="Kutu sağ köşesinde sergilenir"
                      currentUrl={promo.imageUrl}
                      folderCategory="promos"
                      aspectRatioHint="1:1 Yuvarlak/Kare"
                      onChange={(url) => {
                        const updated = [...promosList];
                        updated[idx].imageUrl = url;
                        setPromosList(updated);
                      }}
                    />

                    <ImageUploadField
                      label="Mobil Görsel (İsteğe Bağlı)"
                      currentUrl={promo.mobileImageUrl || ''}
                      folderCategory="promos"
                      aspectRatioHint="1:1"
                      onChange={(url) => {
                        const updated = [...promosList];
                        updated[idx].mobileImageUrl = url;
                        setPromosList(updated);
                      }}
                    />

                    <div className="space-y-2.5">
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Üst Rozet</label>
                        <input
                          type="text"
                          value={promo.tag}
                          onChange={(e) => {
                            const updated = [...promosList];
                            updated[idx].tag = e.target.value;
                            setPromosList(updated);
                          }}
                          className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Başlık</label>
                        <input
                          type="text"
                          value={promo.title}
                          onChange={(e) => {
                            const updated = [...promosList];
                            updated[idx].title = e.target.value;
                            setPromosList(updated);
                          }}
                          className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Alt Açıklama</label>
                        <input
                          type="text"
                          value={promo.subtitle}
                          onChange={(e) => {
                            const updated = [...promosList];
                            updated[idx].subtitle = e.target.value;
                            setPromosList(updated);
                          }}
                          className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Buton Yazısı</label>
                        <input
                          type="text"
                          value={promo.ctaText}
                          onChange={(e) => {
                            const updated = [...promosList];
                            updated[idx].ctaText = e.target.value;
                            setPromosList(updated);
                          }}
                          className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                        />
                      </div>

                      <div className="bg-[#121214] p-3 rounded-xl border border-[#27272a]">
                        <LinkSelectorInput
                          label="Afiş Tıklama & Yönlendirme Hedefi"
                          subLabel="Bu kutuya tıklandığında açılacak hedef"
                          value={
                            promo.targetUrl ||
                            (promo.actionType === 'appointment'
                              ? 'randevu'
                              : promo.categoryKey
                              ? `kategori:${promo.categoryKey}`
                              : 'kategori:all')
                          }
                          onChange={(val) => {
                            const updated = [...promosList];
                            updated[idx].targetUrl = val;
                            if (val === 'randevu' || val.startsWith('randevu:')) {
                              updated[idx].actionType = 'appointment';
                            } else if (val.startsWith('kategori:') || val.startsWith('cat:')) {
                              updated[idx].actionType = 'category';
                              updated[idx].categoryKey = val.split(':')[1];
                            } else {
                              updated[idx].actionType = 'link';
                            }
                            setPromosList(updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: KATEGORİ VİTRİN KARTLARI --- */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181b] p-4 rounded-xl border border-[#27272a]">
              <div>
                <h2 className="text-sm font-bold text-white font-serif-luxury">
                  Kategori Vitrin Kartları (CategoryShowcase)
                </h2>
                <p className="text-xs text-gray-400 font-sans-luxury">
                  Bilezik, Yüzük, Kolye ve Külçe vitrin kapak fotoğraflarını, başlıklarını ve etiketlerini güncelleyin.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={handleSaveCategories}
                className="px-5 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-black text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {categoryCards.map((cat, idx) => (
                <div
                  key={cat.id || idx}
                  className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                      <span className="text-xs font-bold text-white font-serif-luxury uppercase">
                        {cat.id}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...categoryCards];
                          updated[idx].isEnabled = !updated[idx].isEnabled;
                          setCategoryCards(updated);
                        }}
                        className={`p-1.5 rounded-lg text-xs ${
                          cat.isEnabled
                            ? 'bg-emerald-950/60 text-emerald-400'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {cat.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <ImageUploadField
                      label="Kapak Görseli (Masaüstü)"
                      currentUrl={cat.image}
                      folderCategory="categories"
                      aspectRatioHint="4:3"
                      onChange={(url) => {
                        const updated = [...categoryCards];
                        updated[idx].image = url;
                        setCategoryCards(updated);
                      }}
                    />

                    <ImageUploadField
                      label="Mobil Görsel (İsteğe Bağlı)"
                      currentUrl={cat.mobileImage || ''}
                      folderCategory="categories"
                      aspectRatioHint="4:3"
                      onChange={(url) => {
                        const updated = [...categoryCards];
                        updated[idx].mobileImage = url;
                        setCategoryCards(updated);
                      }}
                    />

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Etiket</label>
                      <input
                        type="text"
                        value={cat.tag}
                        onChange={(e) => {
                          const updated = [...categoryCards];
                          updated[idx].tag = e.target.value;
                          setCategoryCards(updated);
                        }}
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Başlık</label>
                      <input
                        type="text"
                        value={cat.title}
                        onChange={(e) => {
                          const updated = [...categoryCards];
                          updated[idx].title = e.target.value;
                          setCategoryCards(updated);
                        }}
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Açıklama</label>
                      <textarea
                        rows={2}
                        value={cat.description}
                        onChange={(e) => {
                          const updated = [...categoryCards];
                          updated[idx].description = e.target.value;
                          setCategoryCards(updated);
                        }}
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Model Sayısı / Not</label>
                      <input
                        type="text"
                        value={cat.count}
                        onChange={(e) => {
                          const updated = [...categoryCards];
                          updated[idx].count = e.target.value;
                          setCategoryCards(updated);
                        }}
                        className="w-full bg-[#121214] border border-[#27272a] text-white text-xs rounded-lg px-3 py-2 outline-hidden focus:border-[#c89d3a]"
                      />
                    </div>

                    <div className="bg-[#121214] p-3 rounded-xl border border-[#27272a]">
                      <LinkSelectorInput
                        label="Kategori Tıklama Hedefi"
                        subLabel="Bu vitrin kartına tıklandığında açılacak hedef"
                        value={cat.targetUrl || `kategori:${cat.id}`}
                        onChange={(val) => {
                          const updated = [...categoryCards];
                          updated[idx].targetUrl = val;
                          setCategoryCards(updated);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 5: MENU & MEGA MENU YÖNETİMİ --- */}
        {activeTab === 'menu' && (
          <MenuManager onShowToast={onShowToast} />
        )}

        {/* --- TAB 6: ALTININI GETİR YÖNETİMİ --- */}
        {activeTab === 'altinini-getir' && (
          <AltininiGetirManager onShowToast={onShowToast} />
        )}

        {/* --- TAB 7: ALTIN REHBERİ YÖNETİMİ --- */}
        {activeTab === 'guide' && (
          <GuideManager onShowToast={onShowToast} />
        )}

        {/* --- TAB 8: KURUMSAL SAYFALAR & FOOTER YÖNETİMİ --- */}
        {activeTab === 'corporate' && (
          <CorporateManager onShowToast={onShowToast} />
        )}

      </div>
    </div>
  );
};
