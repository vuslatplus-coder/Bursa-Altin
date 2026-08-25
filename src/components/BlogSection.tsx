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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="blog-section">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#d4af37]/30 bg-[#161616] text-[10px] font-sans-luxury uppercase tracking-[0.25em] text-[#f2ca50] mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          Bursa Altın Güncesi
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f7e7ce]">
          Mücevherat, Altın ve Zanaat Kültürü
        </h2>
        <p className="font-sans-luxury text-sm text-[#e5e2e1]/70 mt-3">
          Kapalıçarşı sarraflığından pırlanta standartlarına, altın yatırımından asırlık miras hikayelerine uzman görüşleri.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-sans-luxury tracking-wider border transition-all ${
              selectedCategory === cat.id
                ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f2ca50]'
                : 'border-[#f7e7ce]/15 text-[#e5e2e1]/70 hover:border-[#d4af37]/40 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setActivePost(post)}
            className="group bg-[#141414] border border-[#f7e7ce]/15 hover:border-[#d4af37] transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-16/9 overflow-hidden bg-[#0c0c0c]">
              <img
                src={post.imageUrl}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0f0f0f]/90 border border-[#d4af37]/40 text-[10px] font-sans-luxury uppercase tracking-widest text-[#f2ca50]">
                {post.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-[#e5e2e1]/50 font-sans-luxury mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d4af37]" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="font-serif-luxury text-xl text-[#f7e7ce] group-hover:text-[#f2ca50] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="font-sans-luxury text-xs sm:text-sm text-[#e5e2e1]/65 mt-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f7e7ce]/10 flex items-center justify-end">
                <span className="text-xs text-[#d4af37] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-sans-luxury font-medium">
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
          className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto"
        >
          <div
            id="blog-modal-content"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#141414] border border-[#d4af37] max-w-3xl w-full my-6 sm:my-10 p-6 sm:p-10 relative shadow-2xl animate-fade-in"
          >
            {/* Top Close Button Bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#f7e7ce]/15">
              <span className="inline-block px-3 py-1 bg-[#1a1813] border border-[#d4af37]/40 text-xs font-sans-luxury text-[#f2ca50]">
                {activePost.category}
              </span>
              <button
                id="btn-close-blog-modal"
                onClick={() => setActivePost(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[#e5e2e1] hover:text-[#f2ca50] border border-[#f7e7ce]/20 hover:border-[#d4af37] transition-all text-xs font-sans-luxury cursor-pointer"
                title="Kapat (Esc)"
              >
                <span>Kapat</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Title & Meta */}
            <div className="mb-6">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#f7e7ce] leading-tight">
                {activePost.title}
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-[#f7e7ce]/10 text-xs text-[#e5e2e1]/60 font-sans-luxury">
                <div className="flex items-center gap-1.5 text-[#d4af37]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activePost.readTime} okuma süresi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{activePost.date}</span>
                </div>
              </div>
            </div>

            {/* Article Main Image */}
            <div className="w-full aspect-21/9 bg-black border border-[#f7e7ce]/15 overflow-hidden mb-8">
              <img
                src={activePost.imageUrl}
                alt={activePost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-5 font-sans-luxury text-sm sm:text-base text-[#e5e2e1]/90 leading-relaxed">
              {activePost.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Tags & Sharing & Bottom Close */}
            <div className="mt-10 pt-6 border-t border-[#f7e7ce]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 items-center">
                <Tag className="w-4 h-4 text-[#d4af37]" />
                {activePost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-[#1c1c1c] text-[11px] font-sans-luxury text-[#e5e2e1]/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  id="btn-share-blog"
                  onClick={handleShare}
                  className="px-4 py-2 border border-[#d4af37]/40 text-xs text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-1.5 font-sans-luxury cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Bağlantı Kopyalandı' : 'Yazıyı Paylaş'}
                </button>
                <button
                  id="btn-close-blog-bottom"
                  onClick={() => setActivePost(null)}
                  className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] text-xs text-[#e5e2e1] hover:text-[#f2ca50] border border-[#f7e7ce]/20 hover:border-[#d4af37] transition-all font-sans-luxury cursor-pointer"
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
