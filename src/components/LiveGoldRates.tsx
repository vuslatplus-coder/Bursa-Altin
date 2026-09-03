import React, { useState } from 'react';
import { INITIAL_GOLD_PRICES, CONTACT_INFO } from '../data/mockData';
import { GoldPrice } from '../types';
import { TrendingUp, TrendingDown, RefreshCw, Calculator, Shield, MessageSquare, ArrowRight, Truck } from 'lucide-react';
import { analytics } from '../services/analyticsService';

export const LiveGoldRates: React.FC = () => {
  const [prices, setPrices] = useState<GoldPrice[]>(INITIAL_GOLD_PRICES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItemForCalc, setSelectedItemForCalc] = useState<string>('gram-has');
  const [calcGrams, setCalcGrams] = useState<number>(10);
  const [activeCategory, setActiveCategory] = useState<'all' | 'has' | 'ziynet' | 'bilezik' | 'ons'>('all');

  // Simulated live minor fluctuations to give real-time market vitality
  const refreshPrices = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPrices((prev) =>
        prev.map((item) => {
          const delta = (Math.random() * 4 - 1.8) * (item.buying > 1000 ? 1.5 : 0.5);
          const newBuy = Math.max(item.buying + delta, 10);
          const spread = item.selling - item.buying;
          return {
            ...item,
            buying: Number(newBuy.toFixed(2)),
            selling: Number((newBuy + spread).toFixed(2)),
            change: Number(((Math.random() * 0.4 + 0.3) * (delta >= 0 ? 1 : -1)).toFixed(2)),
            updatedAt: 'Şimdi güncellendi'
          };
        })
      );
      setIsRefreshing(false);
    }, 450);
  };

  const filteredPrices = activeCategory === 'all'
    ? prices
    : prices.filter((p) => p.category === activeCategory);

  const currentCalcPrice = prices.find((p) => p.id === selectedItemForCalc) || prices[0];
  const calculatedBuyTotal = currentCalcPrice.buying * calcGrams;
  const calculatedSellTotal = currentCalcPrice.selling * calcGrams;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="live-gold-rates-section">
      
      {/* Header section */}
      <div className="mb-8">
        <div className="text-xs text-gray-500 font-sans-luxury mb-2">
          <span>Anasayfa</span>
          <span className="mx-2">/</span>
          <span className="text-[#996515] font-semibold">Canlı Altın ve Sarrafiye Fiyatları</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Bursa Kapalıçarşı & Serbest Piyasa
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Canlı Altın & Ziynet Fiyat Tablosu
            </h1>
            <p className="font-sans-luxury text-xs sm:text-sm text-gray-600 mt-1.5 max-w-2xl">
              Mehmet Hamdemirci anlık serbest piyasa altın alış ve satış fiyatları. Bütün külçe ve ziynet alımlarınız %100 sigortalı teslim edilir.
            </p>
          </div>

          {/* Refresh button */}
          <button
            onClick={refreshPrices}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-sans-luxury font-bold uppercase tracking-wider text-[#996515] bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-md transition-all self-start md:self-auto shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Kurlar Yenileniyor...' : 'Fiyatları Yenile'}
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'Tüm Kurlar' },
          { id: 'has', label: 'Has & Külçe Altın' },
          { id: 'bilezik', label: '22 Ayar Bilezik' },
          { id: 'ziynet', label: 'Ziynet & Çeyrek' },
          { id: 'ons', label: 'Ons ($)' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3.5 py-1.5 text-xs font-sans-luxury font-bold uppercase tracking-wider rounded-md transition-all ${
              activeCategory === cat.id
                ? 'bg-[#c89d3a] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Live Rates Table + Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Rates List (8 cols) */}
        <div className="lg:col-span-8 space-y-2.5">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2.5 text-[11px] font-sans-luxury font-bold uppercase tracking-wider text-gray-500 bg-gray-100 rounded-lg">
            <div className="col-span-5">Ürün / Ayar</div>
            <div className="col-span-3 text-right">Alış (₺)</div>
            <div className="col-span-3 text-right">Satış (₺)</div>
            <div className="col-span-1 text-right">Değişim</div>
          </div>

          {filteredPrices.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemForCalc(item.id)}
                className={`p-4 bg-white border rounded-xl transition-all cursor-pointer hover:border-[#c89d3a] flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-center shadow-xs ${
                  selectedItemForCalc === item.id
                    ? 'border-[#c89d3a] ring-2 ring-[#c89d3a]/20 bg-amber-50/30'
                    : 'border-gray-200'
                }`}
              >
                {/* Title & Code */}
                <div className="w-full sm:w-auto sm:col-span-5 flex items-center justify-between sm:justify-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#c89d3a]" />
                  <div>
                    <h4 className="font-serif-luxury text-sm font-bold text-gray-900">
                      {item.name}
                    </h4>
                    <span className="text-[11px] font-sans-luxury text-gray-500">
                      {item.code} • {item.unit}
                    </span>
                  </div>
                </div>

                {/* Buy price */}
                <div className="w-full sm:w-auto sm:col-span-3 flex sm:flex-col justify-between sm:items-end">
                  <span className="sm:hidden text-xs text-gray-500 font-sans-luxury">Alış:</span>
                  <div className="font-mono text-sm sm:text-base font-medium text-gray-700">
                    {item.buying.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </div>
                  <span className="text-[10px] text-gray-400 sm:block hidden font-mono">Düşük: {item.low24h.toLocaleString('tr-TR')} ₺</span>
                </div>

                {/* Sell price */}
                <div className="w-full sm:w-auto sm:col-span-3 flex sm:flex-col justify-between sm:items-end">
                  <span className="sm:hidden text-xs text-gray-500 font-sans-luxury">Satış:</span>
                  <div className="font-mono text-sm sm:text-base font-bold text-[#b38728]">
                    {item.selling.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </div>
                  <span className="text-[10px] text-gray-400 sm:block hidden font-mono">Yüksek: {item.high24h.toLocaleString('tr-TR')} ₺</span>
                </div>

                {/* Change % */}
                <div className="w-full sm:w-auto sm:col-span-1 flex sm:flex-col justify-between sm:items-end">
                  <span className="sm:hidden text-xs text-gray-500 font-sans-luxury">Günlük:</span>
                  <div
                    className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold ${
                      isPositive ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    %{Math.abs(item.change)}
                  </div>
                </div>
              </div>
            );
          })}

          <p className="text-xs text-gray-400 font-sans-luxury pt-2">
            * Fiyatlar serbest piyasa ve Bursa Kapalıçarşı koşullarına göre değişkenlik gösterebilir. Yüklü alım/satım talepleriniz için lütfen mağazamızla iletişime geçiniz.
          </p>
        </div>

        {/* Right: Interactive Gold & Investment Calculator (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#c89d3a]">
                <Calculator className="w-4 h-4" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-gray-900">
                Canlı Altın & Sarrafiye Hesaplayıcı
              </h3>
            </div>

            <div className="mt-4 space-y-4">
              {/* Select Rate Item */}
              <div>
                <label className="block text-xs font-sans-luxury font-bold uppercase text-gray-700 mb-1.5">
                  Hesaplanacak Ürün / Ayar:
                </label>
                <select
                  value={selectedItemForCalc}
                  onChange={(e) => setSelectedItemForCalc(e.target.value)}
                  className="w-full bg-gray-50 text-gray-900 p-2.5 border border-gray-300 rounded-md focus:border-[#c89d3a] focus:outline-none text-xs font-sans-luxury"
                >
                  {prices.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-sans-luxury font-bold uppercase text-gray-700">
                    Miktar / Adet / Gram:
                  </label>
                  <span className="text-xs text-[#996515] font-mono font-bold">
                    {calcGrams} {currentCalcPrice.category === 'ziynet' ? 'Adet' : 'Gram'}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={calcGrams}
                  onChange={(e) => setCalcGrams(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-gray-50 text-gray-900 p-2.5 border border-gray-300 rounded-md focus:border-[#c89d3a] focus:outline-none text-xs font-mono font-bold"
                />
                <div className="flex gap-2 mt-2">
                  {[5, 10, 20, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setCalcGrams(preset);
                        analytics.calculateGoldRate(
                          currentCalcPrice.name,
                          preset,
                          currentCalcPrice.selling * preset
                        );
                      }}
                      className="px-2.5 py-1 text-[11px] bg-gray-100 hover:bg-amber-100 hover:text-[#996515] text-gray-700 border border-gray-200 rounded font-semibold transition-colors"
                    >
                      {preset} {currentCalcPrice.category === 'ziynet' ? 'Ad.' : 'Gr.'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Calculated Totals */}
              <div className="mt-4 p-4 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>Toplam Satış Değeri (Alışınız):</span>
                  <span className="font-mono text-base text-[#b38728] font-bold">
                    {calculatedSellTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600 border-t border-amber-200/60 pt-2">
                  <span>Toplam Alış Değeri (Bozdurma):</span>
                  <span className="font-mono text-base text-gray-900 font-bold">
                    {calculatedBuyTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Quote CTA */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(`Merhaba Mehmet Hamdemirci Kuyumculuk, ${calcGrams} ${currentCalcPrice.name} için anlık fiyat sabitlemek ve sipariş vermek istiyorum.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                analytics.contactSarrafWhatsApp(
                  'Canlı Kur Fiyat Sabitleme',
                  `${calcGrams} ${currentCalcPrice.name}`
                );
              }}
              className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans-luxury text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp ile Fiyatı Sabitle
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
