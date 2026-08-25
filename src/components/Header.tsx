import React, { useState } from 'react';
import { Sparkles, Menu, X, TrendingUp, BookOpen, Layers, PhoneCall } from 'lucide-react';

interface HeaderProps {
  activeTab: 'anasayfa' | 'koleksiyon' | 'kurlar' | 'blog';
  setActiveTab: (tab: 'anasayfa' | 'koleksiyon' | 'kurlar' | 'blog') => void;
  onOpenManifesto: () => void;
  onOpenWaitlist: () => void;
  onOpenAppointment: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenManifesto,
  onOpenWaitlist,
  onOpenAppointment,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#f7e7ce]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-center relative">
        {/* Centered: Main Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-10 lg:gap-14">
          <button
            id="nav-btn-anasayfa"
            onClick={() => setActiveTab('anasayfa')}
            className={`font-sans-luxury text-sm uppercase tracking-[0.2em] font-medium transition-all relative py-2 ${
              activeTab === 'anasayfa'
                ? 'text-[#f2ca50]'
                : 'text-[#e5e2e1]/70 hover:text-[#f7e7ce]'
            }`}
          >
            Anasayfa
            {activeTab === 'anasayfa' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#d4af37]" />
            )}
          </button>

          <button
            id="nav-btn-blog"
            onClick={() => setActiveTab('blog')}
            className={`font-sans-luxury text-sm uppercase tracking-[0.2em] font-medium transition-all relative py-2 ${
              activeTab === 'blog'
                ? 'text-[#f2ca50]'
                : 'text-[#e5e2e1]/70 hover:text-[#f7e7ce]'
            }`}
          >
            Blog
            {activeTab === 'blog' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#d4af37]" />
            )}
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex md:hidden items-center">
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#e5e2e1] hover:text-[#f2ca50]"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141414] border-b border-[#f7e7ce]/15 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setActiveTab('anasayfa');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 text-sm font-sans-luxury tracking-wider ${
                activeTab === 'anasayfa'
                  ? 'text-[#f2ca50] bg-[#222]'
                  : 'text-[#e5e2e1]/80 hover:text-white'
              }`}
            >
              Anasayfa
            </button>
            <button
              onClick={() => {
                setActiveTab('blog');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 text-sm font-sans-luxury tracking-wider flex items-center gap-2 ${
                activeTab === 'blog'
                  ? 'text-[#f2ca50] bg-[#222]'
                  : 'text-[#e5e2e1]/80 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              Blog & Rehber
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
