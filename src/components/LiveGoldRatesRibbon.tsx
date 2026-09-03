import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  ArrowRight,
  Calculator,
  ShieldCheck,
  Building,
  Phone
} from 'lucide-react';
import { INITIAL_GOLD_PRICES, CONTACT_INFO } from '../data/mockData';

interface LiveGoldRatesRibbonProps {
  onOpenDetailedRates: () => void;
  onOpenAppointment?: (prefill?: string) => void;
}

export const LiveGoldRatesRibbon: React.FC<LiveGoldRatesRibbonProps> = ({
  onOpenDetailedRates,
}) => {
  const [calcGrams, setCalcGrams] = useState<number>(20);
  const [selectedRateKey, setSelectedRateKey] = useState<string>('bilezik-22');

  // Selected rate
  const activeRate =
    INITIAL_GOLD_PRICES.find((r) => r.id === selectedRateKey) || INITIAL_GOLD_PRICES[1];

  const estimatedTotal = (calcGrams || 0) * (activeRate ? activeRate.selling : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs">
        
        {/* Header Ribbon Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#c89d3a]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-gray-900">
                  Bursa Kapalıçarşı & Serbest Piyasa Canlı Altın Kurları
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  CANLI
                </span>
              </div>
              <p className="text-xs text-gray-500 font-sans-luxury">
                Mehmet Hamdemirci Sarrafiye anlık alım-satım ve işçiliksiz referans fiyatları
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDetailedRates}
              className="text-xs font-bold text-[#996515] hover:text-[#7d500c] flex items-center gap-1 transition-colors"
            >
              <span>Tüm Kurlar & Hesaplayıcı</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Rates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 py-3.5">
          {INITIAL_GOLD_PRICES.slice(0, 6).map((rate) => {
            const isPositive = rate.change >= 0;
            return (
              <div
                key={rate.id}
                className="bg-gray-50 hover:bg-amber-50/60 border border-gray-200 hover:border-amber-300 rounded-lg p-3 transition-all cursor-pointer group"
                onClick={onOpenDetailedRates}
              >
                <div className="flex items-center justify-between text-[11px] font-medium text-gray-700">
                  <span className="truncate font-bold text-gray-800">{rate.name}</span>
                  <span
                    className={`flex items-center text-[10px] font-mono font-bold ${
                      isPositive ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {rate.change}%
                  </span>
                </div>

                <div className="mt-2 space-y-0.5 font-mono">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="text-[10px]">Alış:</span>
                    <span>{rate.buying.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                    <span className="text-[10px] text-[#996515]">Satış:</span>
                    <span className="text-gray-900 group-hover:text-[#b38728] transition-colors">
                      {rate.selling.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fast Gold Calculator & WhatsApp Lock Bar */}
        <div className="mt-1 pt-3.5 border-t border-gray-100 bg-[#fafafa] rounded-lg p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Calculator Inputs */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Calculator className="w-4 h-4 text-[#c89d3a]" />
              <span>Hızlı Altın Hesapla:</span>
            </div>

            <select
              value={selectedRateKey}
              onChange={(e) => setSelectedRateKey(e.target.value)}
              className="bg-white border border-gray-300 text-xs font-medium text-gray-800 rounded px-2.5 py-1.5 outline-none focus:border-[#c89d3a]"
            >
              {INITIAL_GOLD_PRICES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden">
              <input
                type="number"
                min="1"
                step="0.5"
                value={calcGrams}
                onChange={(e) => setCalcGrams(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1.5 text-xs font-mono font-bold text-gray-900 outline-none text-right"
              />
              <span className="px-2 text-xs text-gray-500 bg-gray-100 border-l border-gray-200">
                Gram / Adet
              </span>
            </div>

            <div className="text-xs font-sans-luxury">
              <span className="text-gray-500">Tahmini Tutar: </span>
              <span className="font-mono font-bold text-[#b38728] text-sm">
                {estimatedTotal.toLocaleString('tr-TR')} ₺
              </span>
            </div>
          </div>

          {/* Quick Lock & Order via WhatsApp */}
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(
              `Merhaba Mehmet Hamdemirci Kuyumculuk, canlı kur üzerinden ${calcGrams} gram/adet ${activeRate ? activeRate.name : 'Altın'} (Tahmini: ${estimatedTotal.toLocaleString('tr-TR')} ₺) için fiyat sabitlemek ve sipariş vermek istiyorum.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Canlı Fiyatı WhatsApp'tan Sabitle</span>
          </a>

        </div>

      </div>
    </div>
  );
};
