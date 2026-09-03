import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Save,
  Sparkles,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Star,
  Clock,
  Edit,
  ArrowLeft,
  Check,
  TrendingUp,
  Gem,
  Scale,
  Building2
} from 'lucide-react';
import { GuideArticle } from '../../types';
import {
  listenToGuideArticles,
  saveGuideArticle,
  deleteGuideArticle,
  seedDefaultGuideIfEmpty,
} from '../../services/guideService';
import { DEFAULT_GUIDE_ARTICLES } from '../../data/defaultGuideData';
import { ImageUploadField } from './ImageUploadField';

interface GuideManagerProps {
  onShowToast: (msg: string) => void;
}

const CATEGORIES = [
  'Altın ve Yatırım',
  'Ayar ve İşçilik',
  'Pırlanta ve Takı Seçimi',
  'Bozdurma ve Değerleme',
  'Bursa Rehberi',
];

export const GuideManager: React.FC<GuideManagerProps> = ({ onShowToast }) => {
  const [articles, setArticles] = useState<GuideArticle[]>(DEFAULT_GUIDE_ARTICLES);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<GuideArticle>({
    id: '',
    title: '',
    slug: '',
    category: 'Altın ve Yatırım',
    excerpt: '',
    content: '',
    coverImage: '',
    readTime: '4 dk',
    featured: false,
    order: 1,
    active: true,
    publishedAt: new Date().toISOString(),
  });

  useEffect(() => {
    const unsub = listenToGuideArticles((data) => {
      if (data && data.length > 0) {
        setArticles(data);
      }
    });
    return () => unsub();
  }, []);

  const filteredArticles = articles.filter((a) => {
    const matchesCat = categoryFilter === 'Tümü' || a.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartCreate = () => {
    const newId = `guide-${Date.now()}`;
    setFormData({
      id: newId,
      title: '',
      slug: `rehber-${Date.now()}`,
      category: 'Altın ve Yatırım',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1611591475152-4783113f9d42?auto=format&fit=crop&w=800&q=80',
      readTime: '4 dk',
      featured: false,
      order: articles.length + 1,
      active: true,
      publishedAt: new Date().toISOString(),
    });
    setSelectedArticleId(newId);
    setIsEditing(true);
  };

  const handleStartEdit = (article: GuideArticle) => {
    setFormData({ ...article });
    setSelectedArticleId(article.id);
    setIsEditing(true);
  };

  const handleSaveCurrent = async () => {
    if (!formData.title.trim()) {
      onShowToast('Lütfen makale başlığını doldurunuz.');
      return;
    }

    setSaving(true);
    try {
      await saveGuideArticle(formData);
      onShowToast(`"${formData.title}" makalesi başarıyla kaydedildi.`);
      setIsEditing(false);
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`"${title}" makalesini silmek istediğinize emin misiniz?`)) {
      try {
        await deleteGuideArticle(id);
        onShowToast('Makale silindi.');
        if (selectedArticleId === id) {
          setIsEditing(false);
          setSelectedArticleId(null);
        }
      } catch (err: any) {
        onShowToast(`Hata: ${err.message}`);
      }
    }
  };

  const handleToggleFeatured = async (article: GuideArticle) => {
    try {
      const updated = { ...article, featured: !article.featured };
      await saveGuideArticle(updated);
      onShowToast(updated.featured ? 'Makale öne çıkarıldı.' : 'Öne çıkarma kaldırıldı.');
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    }
  };

  const handleToggleActive = async (article: GuideArticle) => {
    try {
      const updated = { ...article, active: !article.active };
      await saveGuideArticle(updated);
      onShowToast(updated.active ? 'Makale yayına alındı.' : 'Makale gizlendi.');
    } catch (err: any) {
      onShowToast(`Hata: ${err.message}`);
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Tüm Altın Rehberi makalelerini varsayılan zengin içeriklerle geri yüklemek istiyor musunuz?')) {
      setLoading(true);
      try {
        const seeded = await seedDefaultGuideIfEmpty(true);
        setArticles(seeded);
        onShowToast('Altın Rehberi makaleleri varsayılan içeriklerle yüklendi.');
      } catch (err: any) {
        onShowToast(`Hata: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans-luxury">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-900 text-white rounded-2xl border border-gray-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#c89d3a]" />
            Altın Rehberi & Bilgi Merkezi Yönetimi
          </h2>
          <p className="text-xs text-gray-400">
            Altın yatırımı, 4C pırlanta, ayar analizi ve Bursa alışveriş rehberlerini Firebase üzerinden yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            disabled={loading}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Varsayılan Rehberleri Yükle</span>
          </button>

          {!isEditing && (
            <button
              onClick={handleStartCreate}
              className="px-6 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-gray-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Makale Ekle</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor View or List View */}
      {isEditing ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-scale-up">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Makale Listesine Dön</span>
            </button>

            <button
              onClick={handleSaveCurrent}
              disabled={saving}
              className="px-6 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-gray-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Kaydediliyor...' : 'Makaleyi Kaydet'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            
            {/* Left Col: Main Details & Content */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Makale Başlığı</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: 22 Ayar Bilezik Alırken Nelere Dikkat Edilmeli?"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-sm outline-none focus:border-[#c89d3a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs font-semibold outline-none focus:border-[#c89d3a]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Slug (URL Tanımlayıcısı)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Özet (Excerpt / Kısa Tanıtım)</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Makalenin ana fikrini özetleyen 1-2 cümle..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-[#c89d3a]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Makale Tam Metni (Markdown veya Paragraflar)
                </label>
                <textarea
                  rows={14}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Makale içeriğini detaylı olarak buraya yazınız..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-xs leading-relaxed outline-none focus:border-[#c89d3a] font-sans-luxury"
                />
              </div>
            </div>

            {/* Right Col: Media & Meta Info */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                <h4 className="font-bold text-gray-800 text-xs">Yayın ve Görsel Ayarları</h4>

                <div>
                  <ImageUploadField
                    label="Kapak Görseli"
                    imageUrl={formData.coverImage}
                    onImageChange={(url) => setFormData({ ...formData, coverImage: url })}
                    storagePath={`guide/${formData.id}/cover`}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-bold mb-1">Tahmini Okuma Süresi</label>
                  <input
                    type="text"
                    value={formData.readTime || '4 dk'}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-none"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#c89d3a]"
                    />
                    <span>Öne Çıkan Rehber Olarak Göster</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.active !== false}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span>Yayında (Aktif)</span>
                  </label>
                </div>
              </div>

              {/* SEO Meta Box */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <h4 className="font-bold text-gray-800 text-xs">SEO & Arama Motoru Ayarları</h4>
                <div>
                  <label className="block text-gray-600 mb-1">SEO Başlığı</label>
                  <input
                    type="text"
                    value={formData.seoTitle || ''}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="Bursa Altın Rehberi..."
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">SEO Açıklaması</label>
                  <textarea
                    rows={2}
                    value={formData.seoDescription || ''}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="Google arama sonuçlarında görünecek açıklama..."
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {['Tümü', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider shrink-0 transition-colors ${
                    categoryFilter === cat
                      ? 'bg-[#c89d3a] text-gray-950 font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Makale ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#c89d3a]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                    {article.category}
                  </div>
                  {article.featured && (
                    <div className="absolute top-2.5 right-2.5 bg-[#c89d3a] text-gray-950 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Öne Çıkan</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3 text-[#c89d3a]" />
                      <span>{article.readTime || '4 dk'}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleFeatured(article)}
                        className={`p-1.5 rounded transition-colors ${
                          article.featured ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={article.featured ? 'Öne Çıkarılmış' : 'Öne Çıkar'}
                      >
                        <Star className={`w-3.5 h-3.5 ${article.featured ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleToggleActive(article)}
                        className={`p-1.5 rounded transition-colors ${
                          article.active !== false ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={article.active !== false ? 'Yayında' : 'Gizli'}
                      >
                        {article.active !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                        title="Makaleyi Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleStartEdit(article)}
                      className="px-3 py-1.5 bg-[#c89d3a] hover:bg-[#b38728] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Düzenle</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
