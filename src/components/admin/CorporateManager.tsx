import React, { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  Edit2,
  Layers,
  HelpCircle,
  Award,
  Phone,
  Link,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { ContentPage, FooterLink, TopBarConfig } from '../../types';
import {
  listenToContentPages,
  saveContentPage,
  listenToFooterLinks,
  saveAllFooterLinks,
  listenToTopBarConfig,
  saveTopBarConfig,
  seedDefaultContentPagesIfEmpty,
} from '../../services/contentPagesService';
import {
  DEFAULT_CONTENT_PAGES,
  DEFAULT_FOOTER_LINKS,
  DEFAULT_TOP_BAR_CONFIG,
} from '../../data/defaultContentPagesData';
import { ImageUploadField } from './ImageUploadField';

interface CorporateManagerProps {
  onShowToast: (msg: string) => void;
}

export const CorporateManager: React.FC<CorporateManagerProps> = ({ onShowToast }) => {
  const [subTab, setSubTab] = useState<'pages' | 'footer' | 'topbar'>('pages');

  // Pages state
  const [pages, setPages] = useState<ContentPage[]>(DEFAULT_CONTENT_PAGES);
  const [selectedPageId, setSelectedPageId] = useState<string>(DEFAULT_CONTENT_PAGES[0]?.id || 'page-hakkimizda');

  // Footer Links state
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(DEFAULT_FOOTER_LINKS);

  // Top Bar config state
  const [topBarConfig, setTopBarConfig] = useState<TopBarConfig>(DEFAULT_TOP_BAR_CONFIG);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubPages = listenToContentPages((data) => {
      if (data && data.length > 0) setPages(data);
    });
    const unsubFooter = listenToFooterLinks((data) => {
      if (data && data.length > 0) setFooterLinks(data);
    });
    const unsubTopBar = listenToTopBarConfig((data) => {
      if (data) setTopBarConfig(data);
    });

    return () => {
      unsubPages();
      unsubFooter();
      unsubTopBar();
    };
  }, []);

  const selectedPage = pages.find((p) => p.id === selectedPageId) || pages[0];

  // Save selected page
  const handleSavePage = async () => {
    if (!selectedPage) return;
    setSaving(true);
    try {
      await saveContentPage(selectedPage);
      onShowToast(`"${selectedPage.title}" sayfası kaydedildi.`);
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Save Footer Links
  const handleSaveFooter = async () => {
    setSaving(true);
    try {
      await saveAllFooterLinks(footerLinks);
      onShowToast('Footer bağlantıları başarıyla kaydedildi.');
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Save TopBar
  const handleSaveTopBar = async () => {
    setSaving(true);
    try {
      await saveTopBarConfig(topBarConfig);
      onShowToast('Üst duyuru çubuğu ve altın fiyatları linki kaydedildi.');
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Page fields update
  const handleUpdatePageField = (field: keyof ContentPage, value: any) => {
    if (!selectedPage) return;
    setPages((prev) =>
      prev.map((p) => (p.id === selectedPage.id ? { ...p, [field]: value } : p))
    );
  };

  // Page section add/update/delete
  const handleAddSection = () => {
    if (!selectedPage) return;
    const newSection = {
      id: `sec-${Date.now()}`,
      title: 'Yeni Bölüm Başlığı',
      content: 'Bölüm içeriği buraya gelecek.',
      order: (selectedPage.sections?.length || 0) + 1,
    };
    handleUpdatePageField('sections', [...(selectedPage.sections || []), newSection]);
  };

  const handleUpdateSection = (secId: string, field: string, value: string) => {
    if (!selectedPage) return;
    const updated = (selectedPage.sections || []).map((s) =>
      s.id === secId ? { ...s, [field]: value } : s
    );
    handleUpdatePageField('sections', updated);
  };

  const handleDeleteSection = (secId: string) => {
    if (!selectedPage) return;
    const updated = (selectedPage.sections || []).filter((s) => s.id !== secId);
    handleUpdatePageField('sections', updated);
  };

  // Footer Links operations
  const handleAddFooterLink = (group: 'kurumsal' | 'musteri-rehberi' | 'koleksiyonlar') => {
    const newLink: FooterLink = {
      id: `ft-${Date.now()}`,
      group,
      label: 'Yeni Bağlantı',
      link: 'page:hakkimizda',
      order: footerLinks.length + 1,
      active: true,
    };
    setFooterLinks((prev) => [...prev, newLink]);
  };

  const handleUpdateFooterLink = (id: string, field: keyof FooterLink, value: any) => {
    setFooterLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const handleDeleteFooterLink = (id: string) => {
    setFooterLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleResetDefaults = async () => {
    if (confirm('Tüm kurumsal sayfaları ve footer bağlantılarını varsayılana sıfırlamak istiyor musunuz?')) {
      setLoading(true);
      try {
        const seededPages = await seedDefaultContentPagesIfEmpty(true);
        await saveAllFooterLinks(DEFAULT_FOOTER_LINKS);
        await saveTopBarConfig(DEFAULT_TOP_BAR_CONFIG);
        setPages(seededPages);
        setFooterLinks(DEFAULT_FOOTER_LINKS);
        setTopBarConfig(DEFAULT_TOP_BAR_CONFIG);
        onShowToast('Kurumsal içerikler ve ayarlar varsayılana sıfırlandı.');
      } catch (err: any) {
        onShowToast(`Hata: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans-luxury">
      
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-900 text-white rounded-2xl border border-gray-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#c89d3a]" />
            Kurumsal Sayfalar, Footer & Üst Çubuk Yönetimi
          </h2>
          <p className="text-xs text-gray-400">
            Hakkımızda, Mağazamız, Neden Bursa Altın?, SSS, Footer linkleri ve Altın Fiyatları bildirimini yönetin.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          disabled={loading}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Varsayılana Sıfırla</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setSubTab('pages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'pages'
              ? 'bg-[#c89d3a] text-gray-950 shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Kurumsal Sayfalar ({pages.length})
        </button>

        <button
          onClick={() => setSubTab('footer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'footer'
              ? 'bg-[#c89d3a] text-gray-950 shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Footer Menü Bağlantıları ({footerLinks.length})
        </button>

        <button
          onClick={() => setSubTab('topbar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'topbar'
              ? 'bg-[#c89d3a] text-gray-950 shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Üst Duyuru & Altın Fiyatları Çubuğu
        </button>
      </div>

      {/* 1. KURUMSAL SAYFALAR TAB */}
      {subTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Pages List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 pb-2 border-b border-gray-100">
                Sayfalar
              </h3>

              {pages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => setSelectedPageId(page.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedPage?.id === page.id
                      ? 'bg-amber-50/80 border-[#c89d3a] text-[#996515] font-bold shadow-2xs'
                      : 'bg-gray-50/60 border-gray-200/80 hover:bg-gray-100/80 text-gray-800'
                  }`}
                >
                  <span className="text-xs">{page.title}</span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {page.sections?.length || 0} Bölüm
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Page Editor */}
          {selectedPage && (
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-[#c89d3a]" />
                    <span>"{selectedPage.title}" Düzenleniyor</span>
                  </h3>

                  <button
                    onClick={handleSavePage}
                    disabled={saving}
                    className="px-6 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-gray-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Kaydediliyor...' : 'Sayfayı Kaydet'}</span>
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Sayfa Başlığı</label>
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={(e) => handleUpdatePageField('title', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-xs outline-none focus:border-[#c89d3a]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Özet Açıklama</label>
                    <textarea
                      rows={3}
                      value={selectedPage.description}
                      onChange={(e) => handleUpdatePageField('description', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#c89d3a]"
                    />
                  </div>

                  <div>
                    <ImageUploadField
                      label="Sayfa Görseli (Hero / Banner)"
                      imageUrl={selectedPage.heroImage || ''}
                      onImageChange={(url) => handleUpdatePageField('heroImage', url)}
                      storagePath={`pages/${selectedPage.id}/hero`}
                    />
                  </div>
                </div>

                {/* Sections */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900">
                      Sayfa Bölümleri ({selectedPage.sections?.length || 0})
                    </h4>
                    <button
                      onClick={handleAddSection}
                      className="px-3 py-1 bg-amber-50 text-[#996515] hover:bg-amber-100 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Bölüm Ekle</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(selectedPage.sections || []).map((sec) => (
                      <div
                        key={sec.id}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => handleUpdateSection(sec.id, 'title', e.target.value)}
                            placeholder="Bölüm Başlığı"
                            className="flex-1 bg-white border border-gray-300 rounded p-2 text-xs font-bold outline-none"
                          />
                          <button
                            onClick={() => handleDeleteSection(sec.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <textarea
                          rows={4}
                          value={sec.content}
                          onChange={(e) => handleUpdateSection(sec.id, 'content', e.target.value)}
                          placeholder="Bölüm içeriği..."
                          className="w-full bg-white border border-gray-300 rounded p-2.5 text-xs leading-relaxed outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. FOOTER LINKS TAB */}
      {subTab === 'footer' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Alt Bilgi (Footer) Menü Bağlantıları
              </h3>
              <p className="text-xs text-gray-500">
                Koleksiyonlar, Kurumsal ve Müşteri Hizmetleri sütunlarındaki linkleri yönetin.
              </p>
            </div>

            <button
              onClick={handleSaveFooter}
              disabled={saving}
              className="px-6 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-gray-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Kaydediliyor...' : 'Footer Bağlantılarını Kaydet'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Kurumsal Links */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Kurumsal Sütunu
                </h4>
                <button
                  onClick={() => handleAddFooterLink('kurumsal')}
                  className="text-xs text-[#996515] font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Ekle
                </button>
              </div>

              <div className="space-y-2">
                {footerLinks
                  .filter((l) => l.group === 'kurumsal')
                  .map((link) => (
                    <div key={link.id} className="p-2.5 bg-white rounded-xl border border-gray-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleUpdateFooterLink(link.id, 'label', e.target.value)}
                          className="flex-1 font-semibold text-xs border-b border-transparent focus:border-[#c89d3a] outline-none"
                        />
                        <button
                          onClick={() => handleDeleteFooterLink(link.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={link.link}
                        onChange={(e) => handleUpdateFooterLink(link.id, 'link', e.target.value)}
                        placeholder="page:hakkimizda vb."
                        className="w-full text-[10px] font-mono text-gray-500 border border-gray-200 rounded p-1"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Müşteri Hizmetleri & Rehber Links */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Hizmetler & Rehber Sütunu
                </h4>
                <button
                  onClick={() => handleAddFooterLink('musteri-rehberi')}
                  className="text-xs text-[#996515] font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Ekle
                </button>
              </div>

              <div className="space-y-2">
                {footerLinks
                  .filter((l) => l.group === 'musteri-rehberi')
                  .map((link) => (
                    <div key={link.id} className="p-2.5 bg-white rounded-xl border border-gray-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleUpdateFooterLink(link.id, 'label', e.target.value)}
                          className="flex-1 font-semibold text-xs border-b border-transparent focus:border-[#c89d3a] outline-none"
                        />
                        <button
                          onClick={() => handleDeleteFooterLink(link.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={link.link}
                        onChange={(e) => handleUpdateFooterLink(link.id, 'link', e.target.value)}
                        placeholder="tab:altinini-getir vb."
                        className="w-full text-[10px] font-mono text-gray-500 border border-gray-200 rounded p-1"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Koleksiyonlar Links */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Koleksiyonlar Sütunu
                </h4>
                <button
                  onClick={() => handleAddFooterLink('koleksiyonlar')}
                  className="text-xs text-[#996515] font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Ekle
                </button>
              </div>

              <div className="space-y-2">
                {footerLinks
                  .filter((l) => l.group === 'koleksiyonlar')
                  .map((link) => (
                    <div key={link.id} className="p-2.5 bg-white rounded-xl border border-gray-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-1">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleUpdateFooterLink(link.id, 'label', e.target.value)}
                          className="flex-1 font-semibold text-xs border-b border-transparent focus:border-[#c89d3a] outline-none"
                        />
                        <button
                          onClick={() => handleDeleteFooterLink(link.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={link.link}
                        onChange={(e) => handleUpdateFooterLink(link.id, 'link', e.target.value)}
                        placeholder="kategori:bilezik vb."
                        className="w-full text-[10px] font-mono text-gray-500 border border-gray-200 rounded p-1"
                      />
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. TOPBAR DUYURU & ALTIN FİYATLARI TAB */}
      {subTab === 'topbar' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 max-w-3xl">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Üst Duyuru & Altın Fiyatları Çubuğu Ayarları
              </h3>
              <p className="text-xs text-gray-500">
                Sitenin en tepesinde yer alan bant metinlerini ve butonları yapılandırın.
              </p>
            </div>

            <button
              onClick={handleSaveTopBar}
              disabled={saving}
              className="px-6 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-gray-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                Kargo & Güven Duyuru Metni (Sol Taraf)
              </label>
              <input
                type="text"
                value={topBarConfig.tickerText || ''}
                onChange={(e) =>
                  setTopBarConfig({ ...topBarConfig, tickerText: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#c89d3a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  "Güncel Altın Fiyatları" Buton Metni
                </label>
                <input
                  type="text"
                  value={topBarConfig.goldRatesLinkText || ''}
                  onChange={(e) =>
                    setTopBarConfig({ ...topBarConfig, goldRatesLinkText: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Mağaza Konum Metni
                </label>
                <input
                  type="text"
                  value={topBarConfig.storeLocationText || ''}
                  onChange={(e) =>
                    setTopBarConfig({ ...topBarConfig, storeLocationText: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 pt-2">
                <input
                  type="checkbox"
                  checked={topBarConfig.goldRatesVisible !== false}
                  onChange={(e) =>
                    setTopBarConfig({ ...topBarConfig, goldRatesVisible: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#c89d3a]"
                />
                <span>"Güncel Altın Fiyatları" Bağlantısını Üst Çubukta Göster</span>
              </label>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
