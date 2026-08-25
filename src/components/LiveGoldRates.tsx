import React, { useState, useEffect } from 'react';
import { INITIAL_GOLD_PRICES } from '../data/mockData';
import { GoldPrice } from '../types';
import { TrendingUp, TrendingDown, RefreshCw, Calculator, Shield, MessageSquare, ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '../data/mockData';

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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="live-gold-rates-section">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#d4af37]/30 bg-[#161616] text-[10px] font-sans-luxury uppercase tracking-[0.25em] text-[#f2ca50] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Bursa Kapalıçarşı Canlı Piyasa
        </div>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#f7e7ce]">
          Canlı Altın & Ziynet Kurları
        </h2>
        <p className="font-sans-luxury text-sm text-[#e5e2e1]/70 mt-3">
          Mehmet Hamdemirci Kuyumculuk anlık serbest piyasa alış ve satış fiyatları. Tüm işlemler tescilli darphane ve has altın güvencesindedir.
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-[#f7e7ce]/10 pb-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Tüm Kurlar' },
            { id: 'has', label: 'Has & Külçe' },
            { id: 'bilezik', label: '22 Ayar Bilezik' },
            { id: 'ziynet', label: 'Ziynet & Darphane' },
            { id: 'ons', label: 'Ons ($)' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 text-xs font-sans-luxury tracking-wider border ${
                activeCategory === cat.id
                  ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f2ca50]'
                  : 'border-[#f7e7ce]/15 text-[#e5e2e1]/70 hover:border-[#d4af37]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Refresh button */}
        <button
          onClick={refreshPrices}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-sans-luxury uppercase tracking-wider text-[#d4af37] border border-[#d4af37]/40 hover:border-[#f2ca50] hover:bg-[#d4af37]/10 transition-all self-end sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Piyasa Çekiliyor...' : 'Fiyatları Yenile'}
        </button>
      </div>

      {/* Main Grid: Live Rates Table + Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Rates List (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-sans-luxury uppercase tracking-widest text-[#d4af37]/80 border-b border-[#f7e7ce]/10">
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
                className={`p-4 bg-[#141414] border transition-all cursor-pointer hover:border-[#d4af37] flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-center ${
                  selectedItemForCalc === item.id
                    ? 'border-[#d4af37] bg-[#1a1914] gold-glow-border'
                    : 'border-[#f7e7ce]/10'
                }`}
              >
                {/* Title & Code */}
                <div className="w-full sm:w-auto sm:col-span-5 flex items-center justify-between sm:justify-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <div>
                    <h4 className="font-serif-luxury text-base text-[#f7e7ce] font-normal">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-sans-luxury text-[#e5e2e1]/50 tracking-wider">
                      {item.code} • {item.unit}
                    </span>
                  </div>
                </div>

                {/* Buy price */}
                <div className="w-full sm:w-auto sm:col-span-3 flex sm:flex-col justify-between sm:items-end">
                  <span className="sm:hidden text-xs text-[#e5e2e1]/60 font-sans-luxury">Alış:</span>
                  <div className="font-sans-luxury text-base sm:text-lg font-medium text-[#e5e2e1]">
                    {item.buying.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </div>
                  <span className="text-[9px] text-[#e5e2e1]/40 sm:block hidden">Düşük: {item.low24h.toLocaleString('tr-TR')} ₺</span>
                </div>

                {/* Sell price */}
                <div className="w-full sm:w-auto sm:col-span-3 flex sm:flex-col justify-between sm:items-end">
                  <span className="sm:hidden text-xs text-[#e5e2e1]/60 font-sans-luxury">Satış:</span>
                  <div className="font-sans-luxury text-base sm:text-lg font-semibold text-[#f2ca50]">
                    {item.selling.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                  </div>
                  <span className="text-[9px] text-[#e5e2e1]/40 sm:block hidden">Yüksek: {item.high24h.toLocaleString('tr-TR')} ₺</span>
                </div>

                {/* Change % */}
                <div className="w-full sm:w-auto sm:col-span-1 flex sm:flex-col justify-between sm:items-end">
                  <span className="sm:hidden text-xs text-[#e5e2e1]/60 font-sans-luxury">Günlük:</span>
                  <div
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
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

          <p className="text-[11px] text-[#e5e2e1]/40 font-sans-luxury pt-2">
            * Fiyatlar serbest piyasa Kapalıçarşı koşullarına göre değişkenlik gösterebilir. Yüklü alım/satım talepleriniz için lütfen mağazamızla iletişime geçiniz.
          </p>
        </div>

        {/* Right: Interactive Gold & Investment Calculator (4 cols) */}
        <div className="lg:col-span-4 bg-[#141414] border border-[#d4af37]/40 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-[#f7e7ce]/10">
              <Calculator className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-serif-luxury text-lg text-[#f7e7ce]">
                Altın Hesaplama Robotu
              </h3>
            </div>

            <div className="mt-6 space-y-4">
              {/* Select Rate Item */}
              <div>
                <label className="block text-[11px] font-sans-luxury uppercase tracking-wider text-[#d4af37] mb-2">
                  Hesaplanacak Ürün / Ayar:
                </label>
                <select
                  value={selectedItemForCalc}
                  onChange={(e) => setSelectedItemForCalc(e.target.value)}
                  className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none text-sm font-sans-luxury"
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
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-sans-luxury uppercase tracking-wider text-[#d4af37]">
                    Miktar / Adet / Gram:
                  </label>
                  <span className="text-xs text-[#f2ca50] font-sans-luxury font-bold">
                    {calcGrams} {currentCalcPrice.category === 'ziynet' ? 'Adet' : 'Gram'}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={calcGrams}
                  onChange={(e) => setCalcGrams(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-[#1c1c1c] text-[#e5e2e1] p-3 border border-[#f7e7ce]/20 focus:border-[#d4af37] focus:outline-none text-sm font-sans-luxury font-medium"
                />
                <div className="flex gap-2 mt-2">
                  {[5, 10, 20, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCalcGrams(preset)}
                      className="px-2.5 py-1 text-[10px] bg-[#202020] hover:bg-[#d4af37]/20 text-[#e5e2e1] border border-[#f7e7ce]/10"
                    >
                      {preset} {currentCalcPrice.category === 'ziynet' ? 'Ad.' : 'Gr.'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Calculated Totals */}
              <div className="mt-6 p-4 bg-[#1b1915] border border-[#d4af37]/30 space-y-3">
                <div className="flex justify-between items-center text-xs text-[#e5e2e1]/70">
                  <span>Toplam Satış Değeri (Alışınız):</span>
                  <span className="font-serif-luxury text-base text-[#f2ca50] font-semibold">
                    {calculatedSellTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#e5e2e1]/70 border-t border-[#f7e7ce]/10 pt-2">
                  <span>Toplam Alış Değeri (Bozdurma):</span>
                  <span className="font-serif-luxury text-base text-[#e5e2e1]">
                    {calculatedBuyTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Quote CTA */}
          <div className="mt-6 pt-4 border-t border-[#f7e7ce]/10">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(`Merhaba, ${calcGrams} ${currentCalcPrice.name} için anlık fiyat ve sipariş bilgisi almak istiyorum.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#d4af37] hover:bg-[#f2ca50] text-[#0f0f0f] font-sans-luxury text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp ile Özel Fiyat Al
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
