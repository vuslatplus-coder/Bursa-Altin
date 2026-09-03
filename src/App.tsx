import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroComingSoon } from './components/HeroComingSoon';
import { LiveGoldRates } from './components/LiveGoldRates';
import { CollectionPreview } from './components/CollectionPreview';
import { BlogSection } from './components/BlogSection';
import { ContactFooter } from './components/ContactFooter';
import { ManifestoModal } from './components/ManifestoModal';
import { WaitlistModal } from './components/WaitlistModal';
import { AppointmentModal } from './components/AppointmentModal';
import { LuxuryLoader } from './components/LuxuryLoader';
import { WaitlistSubscriber } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'anasayfa' | 'koleksiyon' | 'kurlar' | 'blog'>('anasayfa');
  const [manifestoOpen, setManifestoOpen] = useState<boolean>(false);
  const [waitlistOpen, setWaitlistOpen] = useState<boolean>(false);
  const [appointmentOpen, setAppointmentOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscribers, setSubscribers] = useState<WaitlistSubscriber[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial page load simulation to demonstrate the luxury blurred loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = (subscriber: WaitlistSubscriber) => {
    setSubscribers((prev) => [...prev, subscriber]);
    showToast(`Teşekkürler! VIP davetiyeniz kaydedildi.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e5e2e1] flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-[#f2ca50]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1914] border border-[#d4af37] text-[#f7e7ce] px-5 py-3 text-xs font-sans-luxury shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#f2ca50]" />
          {toastMessage}
        </div>
      )}

      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenManifesto={() => setManifestoOpen(true)}
        onOpenWaitlist={() => setWaitlistOpen(true)}
        onOpenAppointment={() => setAppointmentOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'anasayfa' && (
          <div>
            <HeroComingSoon />
          </div>
        )}

        {activeTab === 'koleksiyon' && (
          <CollectionPreview
            onOpenAppointment={() => setAppointmentOpen(true)}
            onOpenWaitlist={() => setWaitlistOpen(true)}
          />
        )}

        {activeTab === 'kurlar' && (
          <LiveGoldRates />
        )}

        {activeTab === 'blog' && (
          <BlogSection />
        )}
      </main>

      {/* Bottom Contact & Information Footer Matching Screenshot */}
      <ContactFooter
        onOpenAppointment={() => setAppointmentOpen(true)}
      />

      {/* Popups and Modals */}
      <ManifestoModal
        isOpen={manifestoOpen}
        onClose={() => setManifestoOpen(false)}
        onOpenAppointment={() => setAppointmentOpen(true)}
      />

      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <AppointmentModal
        isOpen={appointmentOpen}
        onClose={() => setAppointmentOpen(false)}
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
