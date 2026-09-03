import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Clock,
  ChevronRight,
  TrendingUp,
  Gem,
  Scale,
  Building2,
  Share2,
  X,
  ArrowRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { GuideArticle } from '../types';
import { DEFAULT_GUIDE_ARTICLES } from '../data/defaultGuideData';

interface GoldGuideSectionProps {
  articles?: GuideArticle[];
  selectedArticleSlug?: string | null;
  onSelectArticleSlug?: (slug: string | null) => void;
  onOpenAppointment?: (prefill?: string) => void;
  onNavigateCatalog?: (category?: string) => void;
}

const CATEGORIES = [
  'Tümü',
  'Altın ve Yatırım',
  'Ayar ve İşçilik',
  'Pırlanta ve Takı Seçimi',
  'Bozdurma ve Değerleme',
  'Bursa Rehberi',
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Altın ve Yatırım':
      return <TrendingUp className="w-4 h-4 text-[#c89d3a]" />;
    case 'Ayar ve İşçilik':
      return <Scale className="w-4 h-4 text-[#c89d3a]" />;
    case 'Pırlanta ve Takı Seçimi':
      return <Gem className="w-4 h-4 text-[#c89d3a]" />;
    case 'Bozdurma ve Değerleme':
      return <Sparkles className="w-4 h-4 text-[#c89d3a]" />;
    case 'Bursa Rehberi':
      return <Building2 className="w-4 h-4 text-[#c89d3a]" />;
    default:
      return <BookOpen className="w-4 h-4 text-[#c89d3a]" />;
  }
};

export const GoldGuideSection: React.FC<GoldGuideSectionProps> = ({
  articles = DEFAULT_GUIDE_ARTICLES,
  selectedArticleSlug,
  onSelectArticleSlug,
  onNavigateCatalog,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingArticle, setReadingArticle] = useState<GuideArticle | null>(null);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Active articles list
  const activeArticles = useMemo(() => {
    return articles.filter((a) => a.active !== false);
  }, [articles]);

  // Open article if initial slug is provided
  React.useEffect(() => {
    if (selectedArticleSlug) {
      const found = activeArticles.find((a) => a.slug === selectedArticleSlug);
      if (found) {
        setReadingArticle(found);
      }
    }
  }, [selectedArticleSlug, activeArticles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return activeArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'Tümü' || article.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeArticles, selectedCategory, searchQuery]);

  // Featured articles
  const featuredArticles = useMemo(() => {
    return activeArticles.filter((a) => a.featured).slice(0, 2);
  }, [activeArticles]);

  // Grouped by category for Knowledge Hub structure
  const articlesByCategory = useMemo(() => {
    const groups: Record<string, GuideArticle[]> = {};
    CATEGORIES.filter((c) => c !== 'Tümü').forEach((cat) => {
      groups[cat] = activeArticles.filter((a) => a.category === cat);
    });
    return groups;
  }, [activeArticles]);

  const handleShareArticle = (article: GuideArticle) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  return (
    <div className="bg-[#fbfbfa] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans-luxury text-gray-900 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* 1. KNOWLEDGE HUB HEADER */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#1b1917] via-[#292524] to-[#171615] text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-[#c89d3a]/30">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c89d3a]/20 border border-[#c89d3a]/50 text-[#fde68a] text-xs font-bold tracking-widest uppercase">
              <BookOpen className="w-3.5 h-3.5 text-[#c89d3a]" />
              Bursa Altın Bilgi & Danışmanlık Merkezi
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Altın, Pırlanta & Sarrafiye Rehberi
            </h1>
            
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Yatırım kararlarınızda, takı alışverişlerinizde ve altın bozdurma süreçlerinizde doğru ve şeffaf bilgiye ulaşmanız için uzman sarraflarımız tarafından hazırlandı.
            </p>

            {/* Search Input inside Banner */}
            <div className="pt-2 max-w-md relative">
              <input
                type="text"
                placeholder="Örn: 4C nedir, sahte altın, 22 ayar bilezik, bozdurma..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-gray-400 outline-none focus:border-[#c89d3a] transition-colors"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* 2. CATEGORY TOPIC TABS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-gray-200">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider shrink-0 transition-all flex items-center gap-2 ${
                selectedCategory === cat
                  ? 'bg-[#c89d3a] text-gray-950 shadow-md scale-102'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat !== 'Tümü' && getCategoryIcon(cat)}
              <span>{cat}</span>
              {cat !== 'Tümü' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat ? 'bg-black/20 text-gray-950 font-mono' : 'bg-gray-100 text-gray-500 font-mono'
                }`}>
                  {articlesByCategory[cat]?.length || 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 3. FEATURED GUIDES SPOTLIGHT (When "Tümü" is selected and no search) */}
        {selectedCategory === 'Tümü' && !searchQuery.trim() && featuredArticles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#c89d3a]" />
                Öne Çıkan Başvuru Rehberleri
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setReadingArticle(article)}
                  className="group relative bg-white rounded-2xl border border-gray-200 hover:border-[#c89d3a] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col sm:flex-row"
                >
                  <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden bg-gray-100">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#c89d3a] text-gray-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Öne Çıkan
                    </div>
                  </div>

                  <div className="p-6 sm:w-3/5 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="font-bold text-[#c89d3a] tracking-wider uppercase">
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime || '4 dk'}
                        </span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-gray-900 group-hover:text-[#996515] transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-bold text-[#c89d3a] gap-1 pt-2">
                      <span>Rehberi İncele</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TOPIC-GROUPED KNOWLEDGE BASE (When category is selected or searching) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-gray-900">
              {selectedCategory === 'Tümü' ? 'Tüm Bilgi Başlıkları' : `${selectedCategory} Rehberi`}
              <span className="text-sm font-normal text-gray-500 ml-2 font-mono">
                ({filteredArticles.length} Makale)
              </span>
            </h2>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 space-y-3">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-800">Aramanıza uygun rehber bulunamadı</p>
              <p className="text-xs text-gray-500">Farklı bir anahtar kelime deneyebilir veya tüm kategorilere göz atabilirsiniz.</p>
              <button
                onClick={() => {
                  setSelectedCategory('Tümü');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 bg-amber-50 text-[#c89d3a] text-xs font-bold rounded-lg hover:bg-amber-100 transition-colors"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setReadingArticle(article)}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-[#c89d3a] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#996515] text-[10px] font-bold px-2 py-0.5 rounded shadow border border-amber-200/50">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3 text-[#c89d3a]" />
                        <span>{article.readTime || '4 dk'} Okuma</span>
                      </div>

                      <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-[#996515] transition-colors leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#c89d3a]">
                      <span>Detaylı Oku</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 5. ARTICLE READER MODAL */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col my-auto animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-amber-100 text-[#996515] text-[10px] font-bold uppercase">
                  {readingArticle.category}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#c89d3a]" /> {readingArticle.readTime || '4 dk'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareArticle(readingArticle)}
                  className="p-2 text-gray-500 hover:text-[#c89d3a] hover:bg-amber-50 rounded-lg transition-colors"
                  title="Paylaş"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setReadingArticle(null);
                    if (onSelectArticleSlug) onSelectArticleSlug(null);
                  }}
                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Cover Image */}
              <div className="h-64 sm:h-72 rounded-xl overflow-hidden shadow-inner bg-gray-100">
                <img
                  src={readingArticle.coverImage}
                  alt={readingArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 leading-tight">
                  {readingArticle.title}
                </h1>
                <p className="text-sm sm:text-base font-medium text-gray-600 border-l-3 border-[#c89d3a] pl-4 py-1 italic bg-amber-50/50 rounded-r-lg">
                  {readingArticle.excerpt}
                </p>
              </div>

              {/* Formatted Markdown/Text Body */}
              <div className="text-xs sm:text-sm text-gray-800 leading-relaxed space-y-4 whitespace-pre-line font-sans-luxury">
                {readingArticle.content}
              </div>

              {/* Expert Advisory CTA Box inside Modal */}
              <div className="p-6 rounded-xl bg-[#faf8f5] border border-amber-200/80 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c89d3a] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Bursa Altın Uzman Danışmanlığı
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Bu konuyla ilgili mağazamızda birebir danışmanlık almak veya güncel kurlarla takı/yatırım değerlendirmek için bize ulaşabilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/905321234567?text=${encodeURIComponent(`Merhaba Mehmet Hamdemirci Kuyumculuk, Altın Rehberi'ndeki "${readingArticle.title}" makalenizi okudum ve danışmak istiyorum.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>WhatsApp ile Sarrafa Danış</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Copied Toast */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white border border-[#c89d3a] px-4 py-2 text-xs rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#c89d3a]" />
          <span>Bağlantı kopyalandı!</span>
        </div>
      )}

    </div>
  );
};
