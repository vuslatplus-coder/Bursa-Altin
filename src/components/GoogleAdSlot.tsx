import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Info,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { MarketingAdsConfig } from '../types';
import { CONTACT_INFO } from '../data/mockData';
import {
  DEFAULT_ADS_CONFIG,
  listenToMarketingAdsConfig,
  analytics
} from '../services/analyticsService';

interface GoogleAdSlotProps {
  slotId?: string;
  className?: string;
  variant?: 'hero-side' | 'banner' | 'in-feed';
}

export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({
  slotId,
  className = '',
  variant = 'hero-side',
}) => {
  const [adsConfig, setAdsConfig] = useState<MarketingAdsConfig>(DEFAULT_ADS_CONFIG);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const adRef = useRef<HTMLModElement | null>(null);

  // Subscribe to real-time Marketing & Ads configuration from Firestore
  useEffect(() => {
    const unsubscribe = listenToMarketingAdsConfig((config) => {
      setAdsConfig(config);
    });
    return () => unsubscribe();
  }, []);

  // Initialize Google AdSense tag if active
  useEffect(() => {
    if (adsConfig.adSenseEnabled && adsConfig.adSensePublisherId) {
      try {
        if (typeof window !== 'undefined') {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (err) {
        // Safe catch for ad blockers or preview environments
        console.debug('Google AdSense slot push:', err);
      }
    }
  }, [adsConfig.adSenseEnabled, adsConfig.adSensePublisherId, slotId]);

  const publisherId = adsConfig.adSensePublisherId || 'ca-pub-0000000000000000';
  const effectiveSlotId = slotId || adsConfig.adSenseHeroSideSlotId || '1001001001';
  const isLiveAdSense = adsConfig.adSenseEnabled && Boolean(adsConfig.adSensePublisherId);

  // Direct WhatsApp contact for corporate advertising / sponsor bookings
  const handleContactForAds = (e: React.MouseEvent) => {
    e.stopPropagation();
    analytics.contactSarrafWhatsApp('Google Reklam & Sponsorluk Alanı', 'Anasayfa Vitrin Yanı');
    const msg = encodeURIComponent(
      'Merhaba Mehmet Hamdemirci Kuyumculuk, web sitenizdeki vitrin yanı Google/Sponsorlu reklam alanı hakkında bilgi ve iş birliği teklifi almak istiyorum.'
    );
    window.open(`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${msg}`, '_blank');
  };

  return (
    <div
      id="google-ad-slot-hero"
      className={`relative flex-1 rounded-xl overflow-hidden flex flex-col justify-between transition-all bg-white border border-gray-200/90 shadow-2xs hover:shadow-xs group ${className}`}
    >
      {/* 4-Color Google Accent Top Line */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#4285F4]" />
        <div className="flex-1 bg-[#EA4335]" />
        <div className="flex-1 bg-[#FBBC05]" />
        <div className="flex-1 bg-[#34A853]" />
      </div>

      {/* Header: Google AdSense Policy-Compliant Labeling */}
      <div className="px-3.5 pt-2.5 pb-1 flex items-center justify-between border-b border-gray-100 bg-[#fdfdfd]">
        <div className="flex items-center gap-1.5">
          {/* Google G Emblem */}
          <div className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px] rounded-xs bg-white text-gray-700 shadow-2xs border border-gray-200">
            <span className="text-[#4285F4]">G</span>
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-gray-500">
            REKLAM • GOOGLE ADS
          </span>
          <span className="text-[9px] px-1.5 py-0.2 bg-amber-50 text-[#996515] border border-amber-200/60 rounded font-semibold">
            {isLiveAdSense ? 'AdSense Yayında' : 'Onay Zemininde'}
          </span>
        </div>

        {/* Info & Policies Tooltip Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }}
            className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors"
            title="Google Reklam Politikaları Bilgisi"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {showInfo && (
            <div className="absolute right-0 top-6 z-30 w-64 p-3 bg-neutral-900 text-white text-[11px] rounded-lg shadow-xl leading-relaxed border border-neutral-700">
              <p className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Google AdSense Politikası
              </p>
              <p className="text-neutral-300">
                Bu zemin, Google AdSense ve kurumsal sponsorluk standartlarına uygun olarak 300×250 / esnek duyarlı formatta ayrılmıştır.
              </p>
              <div className="mt-2 pt-2 border-t border-neutral-800 text-[10px] text-neutral-400">
                Yayıncı ID: <span className="font-mono text-gray-200">{publisherId}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        {/* If live AdSense is enabled and configured, render the official Google AdSense ins tag */}
        {isLiveAdSense ? (
          <div className="w-full flex-1 flex items-center justify-center min-h-[140px] overflow-hidden">
            <ins
              ref={adRef}
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: '140px' }}
              data-ad-client={publisherId}
              data-ad-slot={effectiveSlotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          /* High-converting ground & placeholder ready for Google Ads approval */
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/80 text-[10px] font-bold rounded-md uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Google Reklam Alanı</span>
                </div>

                <h3 className="font-serif-luxury text-sm font-bold text-gray-900 leading-snug">
                  Google AdSense & Sponsorluk Slotu
                </h3>

                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  300×250 & Responsive reklam alanı Google onayına ve kurumsal marka tanıtımlarına hazırdır.
                </p>
              </div>

              {/* Google Brand Visual Badge */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50/80 via-white to-amber-50/50 border border-gray-200/80 p-2 flex flex-col items-center justify-center shadow-2xs shrink-0">
                <div className="flex gap-0.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                </div>
                <span className="text-[9px] font-mono font-bold text-gray-700">ADS</span>
              </div>
            </div>

            {/* Bottom Specs & Monetization Actions */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 font-mono">
                  Birim: <strong className="text-gray-700">300×250 / Esnek</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleContactForAds}
                  className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-[10px] font-bold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Reklam İletişimi</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Discreet Footer Note */}
      <div className="px-3.5 py-1 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400">
        <span>Google Certified Publishing Partner Ready</span>
        <span className="font-mono">Slot ID: {effectiveSlotId}</span>
      </div>
    </div>
  );
};
