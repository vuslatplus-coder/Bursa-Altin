import React, { useState, useEffect } from 'react';
import { BLOG_POSTS } from '../data/mockData';
import { BlogPost } from '../types';
import { BookOpen, Clock, ArrowRight, X, Tag, Share2, Check } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (activePost) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setActivePost(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [activePost]);

  const categories = [
    { id: 'all', label: 'Tüm Yazılar' },
    { id: 'Yatırım Rehberi', label: 'Yatırım & Piyasa' },
    { id: 'Tarih & Zanaat', label: 'Tarih & Zanaat' },
    { id: 'Mücevher Rehberi', label: 'Mücevher & Pırlanta Rehberi' }
  ];

  const filteredPosts = selectedCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="blog-section">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-[10px] font-sans-luxury uppercase tracking-widest text-[#996515] font-bold rounded-full mb-3">
          <BookOpen className="w-3.5 h-3.5 text-[#c89d3a]" />
          Kuyumculuk & Altın Güncesi
        </div>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl text-gray-900 font-bold">
          Mücevherat, Altın ve Zanaat Kültürü
        </h2>
        <p className="font-sans-luxury text-xs sm:text-sm text-gray-500 mt-2">
          Kapalıçarşı sarraflığından pırlanta standartlarına, altın yatırımından asırlık miras hikayelerine uzman görüşleri.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-md transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#c89d3a] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setActivePost(post)}
            className="group bg-white border border-gray-200 rounded-xl hover:border-[#c89d3a] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-16/9 overflow-hidden bg-gray-100">
              <img
                src={post.imageUrl}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs border border-gray-200 text-[10px] font-sans-luxury font-bold uppercase tracking-wider text-[#996515] rounded">
                {post.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-gray-400 font-sans-luxury mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#c89d3a]" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="font-serif-luxury text-lg sm:text-xl text-gray-900 group-hover:text-[#996515] transition-colors leading-snug font-bold">
                  {post.title}
                </h3>

                <p className="font-sans-luxury text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end">
                <span className="text-xs text-[#996515] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-sans-luxury font-bold">
                  Yazıyı Oku
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {activePost && (
        <div
          id="blog-modal-backdrop"
          onClick={() => setActivePost(null)}
          className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 bg-black/60 backdrop-blur-xs overflow-y-auto"
        >
          <div
            id="blog-modal-content"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-gray-200 max-w-3xl w-full my-6 sm:my-10 p-6 sm:p-10 relative shadow-2xl animate-fade-in"
          >
            {/* Top Close Button Bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-xs font-sans-luxury font-bold text-[#996515] rounded">
                {activePost.category}
              </span>
              <button
                id="btn-close-blog-modal"
                onClick={() => setActivePost(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs font-sans-luxury font-semibold cursor-pointer"
                title="Kapat (Esc)"
              >
                <span>Kapat</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Title & Meta */}
            <div className="mb-6">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-gray-900 font-bold leading-tight">
                {activePost.title}
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 font-sans-luxury">
                <div className="flex items-center gap-1.5 text-[#996515] font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activePost.readTime} okuma süresi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{activePost.date}</span>
                </div>
              </div>
            </div>

            {/* Article Main Image */}
            <div className="w-full aspect-21/9 bg-gray-100 rounded-xl overflow-hidden mb-6 border border-gray-200">
              <img
                src={activePost.imageUrl}
                alt={activePost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-4 font-sans-luxury text-xs sm:text-sm text-gray-700 leading-relaxed">
              {activePost.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Tags & Sharing & Bottom Close */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 items-center">
                <Tag className="w-4 h-4 text-[#c89d3a]" />
                {activePost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 rounded text-[11px] font-sans-luxury text-gray-600 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  id="btn-share-blog"
                  onClick={handleShare}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-xs text-gray-700 rounded-lg flex items-center gap-1.5 font-sans-luxury font-semibold cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Bağlantı Kopyalandı' : 'Yazıyı Paylaş'}
                </button>
                <button
                  id="btn-close-blog-bottom"
                  onClick={() => setActivePost(null)}
                  className="px-4 py-2 bg-[#c89d3a] hover:bg-[#b38728] text-xs text-white rounded-lg transition-colors font-sans-luxury font-bold cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
