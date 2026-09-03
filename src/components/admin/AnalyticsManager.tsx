import React, { useState, useEffect } from 'react';
import {
  Activity,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Globe,
  Radio,
  Flame,
  Send,
  Sparkles,
  Layers,
  TrendingUp,
  Clock,
  Users,
  Target,
  DollarSign,
  Copy,
  Check,
  Settings,
  Save,
  HelpCircle,
  Megaphone,
  Smartphone,
  MousePointerClick
} from 'lucide-react';
import {
  GA_MEASUREMENT_ID,
  DEFAULT_ADS_CONFIG,
  listenToMarketingAdsConfig,
  saveMarketingAdsConfig,
  trackEvent,
  trackGoogleAdsConversion
} from '../../services/analyticsService';
import { MarketingAdsConfig } from '../../types';
import appletConfig from '../../../firebase-applet-config.json';

interface AnalyticsManagerProps {
  onBackToHome?: () => void;
  onShowToast?: (msg: string) => void;
}

export const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({
  onShowToast = (msg) => alert(msg),
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'google_ads' | 'adsense' | 'code_snippet'>('analytics');
  const [adsConfig, setAdsConfig] = useState<MarketingAdsConfig>(DEFAULT_ADS_CONFIG);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  // Listen to live config
  useEffect(() => {
    const unsub = listenToMarketingAdsConfig((cfg) => {
      setAdsConfig(cfg);
    });
    return () => unsub();
  }, []);

  const handleSaveAdsConfig = async () => {
    setIsSaving(true);
    try {
      await saveMarketingAdsConfig(adsConfig);
      onShowToast('Google Ads & AdSense ayarları başarıyla kaydedildi!');
    } catch (err: any) {
      alert('Ayarlar kaydedilirken hata oluştu: ' + (err?.message || 'Bilinmeyen hata'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEvent = () => {
    trackEvent('admin_test_event', {
      timestamp: new Date().toISOString(),
      source: 'Admin Paneli Test Butonu',
      label: 'Google & Firebase Analytics Doğrulama',
    });
    trackGoogleAdsConversion();
    setTestStatus('Canlı test olayı Google Analytics, Firebase ve Google Ads motoruna gönderildi!');
    onShowToast('Test olayı başarıyla iletildi.');
    setTimeout(() => setTestStatus(null), 5000);
  };

  // Generate full index.html snippet with Ads & AdSense
  const generateIndexHtmlSnippet = () => {
    const gaId = GA_MEASUREMENT_ID || 'G-DSLVYV6RN6';
    const adsId = adsConfig.googleAdsEnabled && adsConfig.googleAdsId ? adsConfig.googleAdsId : '';
    const adSensePub = adsConfig.adSenseEnabled && adsConfig.adSensePublisherId ? adsConfig.adSensePublisherId : '';

    return `<!-- Google Analytics (GA4) & Google Ads Tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  // Google Analytics 4
  gtag('config', '${gaId}', { send_page_view: true });
${adsId ? `
  // Google Ads (Reklam Dönüşüm Takibi)
  gtag('config', '${adsId}');` : ''}
</script>
${adSensePub ? `
<!-- Google AdSense (Siteye Reklam Alma) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSensePub}" crossorigin="anonymous"></script>` : ''}`;
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(generateIndexHtmlSnippet());
    setCopied(true);
    onShowToast('Kod panoya kopyalandı! GitHub index.html içine yapıştırabilirsiniz.');
    setTimeout(() => setCopied(false), 3000);
  };

  const gaRealtimeUrl = 'https://analytics.google.com/analytics/web/';
  const firebaseAnalyticsUrl = `https://console.firebase.google.com/project/${appletConfig.projectId || 'bursa-altin'}/analytics`;
  const googleAdsUrl = 'https://ads.google.com/aw/conversions';
  const googleAdSenseUrl = 'https://adsense.google.com/';

  return (
    <div className="space-y-6 font-sans-luxury">
      
      {/* 1. TOP HERO BADGE */}
      <div className="bg-gradient-to-r from-gray-950 via-neutral-900 to-gray-950 rounded-2xl p-6 border border-amber-500/30 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-400/40 shrink-0">
              <Megaphone className="w-7 h-7 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  GOOGLE PAZARLAMA & REKLAM KONSOLU
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Google Analitik, Google Ads & AdSense
              </h2>
              <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                Sitenizin canlı ziyaretçilerini takip edin, Google Ads ile sitenize müşteri çekip dönüşümleri ölçün ve Google AdSense ile sitenizden reklam geliri elde edin.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSendTestEvent}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Canlı Test Olayı Gönder</span>
            </button>
          </div>
        </div>

        {testStatus && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{testStatus}</span>
          </div>
        )}
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'analytics'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-500" />
          <span>1. Canlı Trafik (GA4 & Firebase)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('google_ads')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'google_ads'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Target className="w-4 h-4 text-blue-500" />
          <span>2. Sitenin Reklamını Yapma (Google Ads)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('adsense')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'adsense'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span>3. Siteye Reklam Alma (Google AdSense)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('code_snippet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'code_snippet'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Copy className="w-4 h-4 text-purple-500" />
          <span>GitHub / Hostinger HTML Kodu</span>
        </button>

      </div>

      {/* --- TAB 1: ANALYTICS (GA4 & FIREBASE) --- */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Google Analytics GA4 Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-gray-900 text-base">
                        Google Analytics (GA4) Konsolu
                      </h3>
                      <p className="text-xs text-gray-500">Gerçek Zamanlı (Realtime) Raporlar</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                    Aktif
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Ölçüm Kimliği (Measurement ID):</span>
                    <span className="font-bold text-gray-900">{GA_MEASUREMENT_ID}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>İzleme Kütüphanesi:</span>
                    <span className="text-emerald-700 font-semibold">gtag.js (GA4)</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Google Analytics paneline giderek <strong>Raporlar &gt; Gerçek Zamanlı (Realtime)</strong> sekmesinden şu an sitede bulunan anlık kullanıcıları, bulundukları şehirleri, baktıkları ürünleri ve etkileşimleri canlı olarak izleyebilirsiniz.
                </p>
              </div>

              <a
                href={gaRealtimeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#111827] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Google Analytics Canlı Paneli Aç</span>
                <ExternalLink className="w-4 h-4 text-amber-400" />
              </a>
            </div>

            {/* Firebase Analytics Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-gray-900 text-base">
                        Firebase Console Analytics
                      </h3>
                      <p className="text-xs text-gray-500">StreamView & Anlık Etkileşimler</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                    Aktif
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Firebase Proje ID:</span>
                    <span className="font-bold text-gray-900">{appletConfig.projectId || 'bursa-altin'}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Veritabanı:</span>
                    <span className="text-gray-900">Firestore (Cloud)</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Firebase konsolunuzda <strong>Analytics &gt; StreamView</strong> veya <strong>Analytics &gt; Realtime</strong> bölümünden kullanıcı hareketlerini, düğme tıklamalarını ve coğrafi canlı haritayı izleyebilirsiniz.
                </p>
              </div>

              <a
                href={firebaseAnalyticsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Firebase Analytics Konsolunu Aç</span>
                <ExternalLink className="w-4 h-4 text-white" />
              </a>
            </div>

          </div>

          {/* Events Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
            <h3 className="font-serif font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#c89d3a]" />
              <span>Otomatik Olarak İzlenen Canlı E-Ticaret & Kullanıcı Olayları</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Sayfa Gezinmeleri</span>
                  <code className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200 text-blue-700 font-mono">page_view</code>
                </div>
                <p className="text-gray-600">Anasayfa, katalog, canlı altın kurları ve blog sayfaları arasındaki anlık geçişler.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Ürün İnceleme</span>
                  <code className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200 text-purple-700 font-mono">view_item</code>
                </div>
                <p className="text-gray-600">22 ayar bilezik, tektaş yüzük ve mücevher detay modalı açılışları.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">WhatsApp Sarraf Danışma</span>
                  <code className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-200 text-emerald-700 font-mono">contact_whatsapp</code>
                </div>
                <p className="text-gray-600">Ürün veya canlı kurlar üzerinden doğrudan WhatsApp ile fiyat sabitleme talepleri.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: GOOGLE ADS (SİTENİN REKLAMINI YAPMA & DÖNÜŞÜM TAKİBİ) --- */}
      {activeSubTab === 'google_ads' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6">
            
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Google Ads Reklam & Dönüşüm (Conversion) Entegrasyonu</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Google'da arama yapan müşterilerin sitenize gelmesi, WhatsApp'tan yazması veya aramasının Google Ads reklam hesabınızda başarı (Dönüşüm) olarak sayılmasını sağlar.
                </p>
              </div>

              <a
                href={googleAdsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>Google Ads Dönüşüm Paneli</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Google Ads Enable Switch */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="text-sm font-bold text-gray-900 block">Google Ads Etiketini Aktif Et</span>
                <span className="text-xs text-gray-500">Google Ads tag kodunu siteye enjekte eder ve reklam tıklayanları takip eder.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsConfig.googleAdsEnabled}
                  onChange={(e) => setAdsConfig({ ...adsConfig, googleAdsEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Google Ads Dönüşüm Kimliği (Conversion ID)
                </label>
                <input
                  type="text"
                  placeholder="Örn: AW-1234567890"
                  value={adsConfig.googleAdsId}
                  onChange={(e) => setAdsConfig({ ...adsConfig, googleAdsId: e.target.value.trim() })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
                <p className="text-[11px] text-gray-500 mt-1">Google Ads panelinizde Araçlar &gt; Dönüşümler &gt; Etiket kurulumunda verilen `AW-` ile başlayan kod.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Varsayılan Dönüşüm Etiketi (Conversion Label - İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  placeholder="Örn: AbCdEfGhIjKlMnOpQr"
                  value={adsConfig.googleAdsConversionLabel}
                  onChange={(e) => setAdsConfig({ ...adsConfig, googleAdsConversionLabel: e.target.value.trim() })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
                <p className="text-[11px] text-gray-500 mt-1">Özellikle WhatsApp tıklaması veya teklif alma dönüşümünün etiket kodu.</p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveAdsConfig}
                disabled={isSaving}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Kaydediliyor...' : 'Google Ads Ayarlarını Kaydet'}</span>
              </button>
            </div>

            {/* Quick Guide Card */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs space-y-2 text-blue-900">
              <div className="font-bold flex items-center gap-1.5 text-blue-950">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Google Ads ile En Kolay Reklam Verme Yolu (GA4 Bağlantısı):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-blue-800 leading-relaxed">
                <li><strong>Google Ads</strong> hesabınıza giriş yapın.</li>
                <li><strong>Yönetici &gt; Bağlı Hesaplar (Linked Accounts)</strong> bölümünden <strong>Google Analytics (GA4)</strong>'ü seçin.</li>
                <li>Projenizi (`{GA_MEASUREMENT_ID}`) seçip <strong>Bağla (Link)</strong> butonuna tıklayın.</li>
                <li>Artık sitenizde müşterilerin yaptığı tüm WhatsApp danışma tıklamaları, altın hesaplama ve ürün incelemeleri otomatik olarak Google Ads kampanyalarınızda dönüşüm olarak sayılır!</li>
              </ol>
            </div>

          </div>
        </div>
      )}

      {/* --- TAB 3: GOOGLE ADSENSE (SİTEYE REKLAM ALIP PARA KAZANMA) --- */}
      {activeSubTab === 'adsense' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6">
            
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-gray-900 text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Google AdSense (Siteye Reklam Alma & Gelir Elde Etme)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Sitenizin belirli alanlarında veya sayfa aralarında Google reklamları göstererek ziyaretçilerden reklam geliri elde etmenizi sağlar.
                </p>
              </div>

              <a
                href={googleAdSenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>Google AdSense Paneli</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* AdSense Enable Switch */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="text-sm font-bold text-gray-900 block">Google AdSense'i Aktif Et</span>
                <span className="text-xs text-gray-500">Google AdSense reklam betiğini siteye ekler ve sitenizi onaya hazır hale getirir.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsConfig.adSenseEnabled}
                  onChange={(e) => setAdsConfig({ ...adsConfig, adSenseEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Publisher ID Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Google AdSense Yayıncı Kimliği (Publisher ID)
              </label>
              <input
                type="text"
                placeholder="Örn: ca-pub-1234567890123456"
                value={adsConfig.adSensePublisherId}
                onChange={(e) => setAdsConfig({ ...adsConfig, adSensePublisherId: e.target.value.trim() })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
              <p className="text-[11px] text-gray-500 mt-1">Google AdSense hesabınızda <strong>Hesap &gt; Ayarlar &gt; Hesap Bilgileri</strong> altında yer alan `ca-pub-` ile başlayan kimlik.</p>
            </div>

            {/* AdSense Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsConfig.adSenseBannerInHeroSide ?? true}
                  onChange={(e) => setAdsConfig({ ...adsConfig, adSenseBannerInHeroSide: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Vitrin Yanı Reklam Alanı</span>
                  <span className="text-[11px] text-gray-500">Anasayfa vitrin yanındaki 2. kutuda Google reklam alanını gösterir.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsConfig.adSenseAutoAds}
                  onChange={(e) => setAdsConfig({ ...adsConfig, adSenseAutoAds: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Google Otomatik Reklamlar</span>
                  <span className="text-[11px] text-gray-500">Google yapay zekası en uygun alanlara reklam yerleştirir.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsConfig.adSenseBannerInBlog}
                  onChange={(e) => setAdsConfig({ ...adsConfig, adSenseBannerInBlog: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Rehber Makale Reklamları</span>
                  <span className="text-[11px] text-gray-500">Altın rehberi makalelerinin altında reklam gösterir.</span>
                </div>
              </label>
            </div>

            {/* Optional Ad Unit Slot ID */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Vitrin Reklam Birimi Slot Kimliği (Ad Unit Slot ID - İsteğe Bağlı)
              </label>
              <input
                type="text"
                placeholder="Örn: 1234567890 (Boş bırakılırsa duyarlı otomatik reklam çalışır)"
                value={adsConfig.adSenseHeroSideSlotId || ''}
                onChange={(e) => setAdsConfig({ ...adsConfig, adSenseHeroSideSlotId: e.target.value.trim() })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
              <p className="text-[11px] text-gray-500 mt-1">Google AdSense panelinde oluşturduğunuz 300x250 veya duyarlı reklam biriminin sayısal Slot ID kodu.</p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveAdsConfig}
                disabled={isSaving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Kaydediliyor...' : 'AdSense Ayarlarını Kaydet'}</span>
              </button>
            </div>

            {/* Approval Steps */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs space-y-2 text-emerald-900">
              <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>AdSense Onayı Almak İçin Adımlar:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-emerald-800 leading-relaxed">
                <li><a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">Google AdSense</a>'e kaydolup sitenizi (`bursaaltin.com`) ekleyin.</li>
                <li>Size verilen `ca-pub-xxxxxxxxxxxxxxxx` kodunu yukarıdaki alana girip kaydedin.</li>
                <li>Aşağıdaki <strong>GitHub / Hostinger HTML Kodu</strong> sekmesindeki kodu kopyalayıp GitHub'daki `index.html` dosyanıza yapıştırın.</li>
                <li>AdSense panelinde <em>"Kodu yerleştirdim, inceleme iste"</em> butonuna basın. Birkaç gün içinde onaylanıp reklamlar otomatik görünmeye başlar.</li>
              </ol>
            </div>

          </div>
        </div>
      )}

      {/* --- TAB 4: GITHUB / HOSTINGER HTML CODE GENERATOR --- */}
      {activeSubTab === 'code_snippet' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Copy className="w-5 h-5 text-purple-600" />
                  <span>GitHub & Hostinger İçin Hazır Header Takip Kodu</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Yukarıdaki ayarlarınıza (GA4, Google Ads, AdSense) göre otomatik derlenen hazır HTML kodunuz. Bu kodu kopyalayıp GitHub reponuzdaki `index.html` dosyasının `&lt;head&gt;` kısmına yapıştırmanız yeterlidir.
                </p>
              </div>

              <button
                onClick={handleCopySnippet}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 bg-gray-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-gray-800 leading-relaxed">
                {generateIndexHtmlSnippet()}
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1.5">
              <span className="font-bold text-gray-900 block">📌 Nasıl Uygulanır?</span>
              <p>1. <strong>GitHub</strong>'a gidip reponuzdaki <code>index.html</code> dosyasını açın.</p>
              <p>2. <code>&lt;head&gt;</code> etiketinin hemen altına bu kopyaladığınız kodu yapıştırın.</p>
              <p>3. <strong>Commit changes</strong> butonuna bastığınızda Hostinger sitenizi günceller ve Google Analytics, Google Ads dönüşüm takibi ve AdSense reklamları aynı anda aktif olur.</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
