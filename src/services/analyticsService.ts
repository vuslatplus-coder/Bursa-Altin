import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { app, db } from './firebase';
import appletConfig from '../../firebase-applet-config.json';
import { MarketingAdsConfig } from '../types';

export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || appletConfig.measurementId || 'G-DSLVYV6RN6';

export const DEFAULT_ADS_CONFIG: MarketingAdsConfig = {
  googleAdsId: '', // e.g. "AW-XXXXXXXXX"
  googleAdsConversionLabel: '', // e.g. "AbCdEfGhIjKlMnOpQr"
  googleAdsEnabled: false,
  adSensePublisherId: '', // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  adSenseEnabled: false,
  adSenseAutoAds: true,
  adSenseBannerInRates: false,
  adSenseBannerInBlog: false,
  adSenseBannerInHeroSide: true,
  adSenseHeroSideSlotId: '',
};

let currentAdsConfig: MarketingAdsConfig = { ...DEFAULT_ADS_CONFIG };
let firebaseAnalytics: Analytics | null = null;

// Initialize Firebase Analytics safely in browser environments
if (typeof window !== 'undefined' && app) {
  isSupported().then((supported) => {
    if (supported && app) {
      try {
        firebaseAnalytics = getAnalytics(app);
      } catch (e) {
        console.warn('Firebase Analytics başlatılamadı:', e);
      }
    }
  });
}

/**
 * Apply Google Ads & AdSense scripts dynamically
 */
export function applyMarketingAdsConfig(config: MarketingAdsConfig) {
  currentAdsConfig = { ...config };
  if (typeof window === 'undefined') return;

  // 1. Google Ads Tag (AW-ID)
  if (config.googleAdsEnabled && config.googleAdsId && (window as any).gtag) {
    try {
      (window as any).gtag('config', config.googleAdsId);
    } catch (e) {
      console.warn('Google Ads config error:', e);
    }
  }

  // 2. Google AdSense script injection
  if (config.adSenseEnabled && config.adSensePublisherId) {
    const existingScript = document.getElementById('google-adsense-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-adsense-script';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adSensePublisherId}`;
      document.head.appendChild(script);
    }
  }
}

/**
 * Listen to real-time marketing & ads configuration from Firestore
 */
export function listenToMarketingAdsConfig(callback: (config: MarketingAdsConfig) => void): () => void {
  if (!db) {
    callback(DEFAULT_ADS_CONFIG);
    return () => {};
  }

  const docRef = doc(db, 'site_settings', 'marketing_ads');
  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<MarketingAdsConfig>;
        const merged: MarketingAdsConfig = { ...DEFAULT_ADS_CONFIG, ...data };
        applyMarketingAdsConfig(merged);
        callback(merged);
      } else {
        callback(DEFAULT_ADS_CONFIG);
      }
    },
    (error) => {
      console.warn('Marketing config snapshot error:', error);
      callback(DEFAULT_ADS_CONFIG);
    }
  );

  return unsubscribe;
}

/**
 * Save marketing & ads configuration to Firestore
 */
export async function saveMarketingAdsConfig(config: MarketingAdsConfig): Promise<void> {
  if (!db) throw new Error('Firestore bağlantısı hazır değil.');
  const docRef = doc(db, 'site_settings', 'marketing_ads');
  await setDoc(docRef, { ...config, updatedAt: new Date().toISOString() }, { merge: true });
  applyMarketingAdsConfig(config);
}

/**
 * Log standard page view to Google Analytics (gtag) and Firebase Analytics
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics (gtag.js)
  if ((window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
    });
  }

  // 2. Firebase Analytics
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, 'page_view', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
        page_location: window.location.href,
      });
    } catch {}
  }
}

/**
 * Log standard ecommerce & custom interactions to Google Analytics & Firebase Analytics
 */
export function trackEvent(
  eventName: string,
  eventParams: Record<string, any> = {}
) {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics (gtag.js)
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }

  // 2. Firebase Analytics
  if (firebaseAnalytics) {
    try {
      logEvent(firebaseAnalytics, eventName, eventParams);
    } catch {}
  }
}

/**
 * Trigger Google Ads Conversion
 */
export function trackGoogleAdsConversion(conversionLabel?: string, value?: number, currency = 'TRY') {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  const targetSendTo = conversionLabel || (
    currentAdsConfig.googleAdsEnabled && currentAdsConfig.googleAdsId && currentAdsConfig.googleAdsConversionLabel
      ? `${currentAdsConfig.googleAdsId}/${currentAdsConfig.googleAdsConversionLabel}`
      : undefined
  );

  if (targetSendTo) {
    (window as any).gtag('event', 'conversion', {
      send_to: targetSendTo,
      value: value || 1.0,
      currency: currency,
    });
  }
}

/**
 * Specific E-Commerce / Jewelry Tracking Helpers
 */
export const analytics = {
  viewItem: (product: { id: string; title: string; category?: string; price?: number }) => {
    trackEvent('view_item', {
      item_id: product.id,
      item_name: product.title,
      item_category: product.category || 'Mücevher',
      price: product.price || 0,
      currency: 'TRY',
    });
  },

  addToWishlist: (product: { id: string; title: string }) => {
    trackEvent('add_to_wishlist', {
      item_id: product.id,
      item_name: product.title,
    });
  },

  contactSarrafWhatsApp: (context: string, itemTitle?: string) => {
    trackEvent('contact_whatsapp', {
      context,
      item_title: itemTitle || 'Genel',
      channel: 'WhatsApp',
    });

    // Trigger Google Ads Conversion for lead acquisition
    trackGoogleAdsConversion();
  },

  callStore: () => {
    trackEvent('call_store', {
      channel: 'Phone',
    });
    trackGoogleAdsConversion();
  },

  calculateGoldRate: (goldName: string, amount: number, totalTry: number) => {
    trackEvent('calculate_gold_rate', {
      gold_name: goldName,
      amount,
      total_try: totalTry,
    });
  },
};
