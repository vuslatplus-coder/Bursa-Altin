import React, { useState } from 'react';
import {
  Link as LinkIcon,
  ShoppingBag,
  Sparkles,
  BookOpen,
  Building2,
  Calendar,
  Layers,
  ChevronDown,
  Globe,
} from 'lucide-react';

interface LinkOption {
  value: string;
  label: string;
  category: 'katalog' | 'hizmetler' | 'rehber' | 'kurumsal' | 'diger';
  icon?: any;
}

const PRESET_LINKS: LinkOption[] = [
  // Katalog
  { value: 'kategori:all', label: 'Tüm Ürün Kataloğu', category: 'katalog', icon: ShoppingBag },
  { value: 'kategori:bilezik', label: '22 Ayar Bilezik & Hasır', category: 'katalog', icon: ShoppingBag },
  { value: 'kategori:yuzuk', label: 'Pırlanta Tektaş & Yüzükler', category: 'katalog', icon: ShoppingBag },
  { value: 'kategori:kolye', label: 'Altın Kolye & Gerdanlık', category: 'katalog', icon: ShoppingBag },
  { value: 'kategori:kupe', label: 'Altın Küpe Modelleri', category: 'katalog', icon: ShoppingBag },
  { value: 'kategori:yatirim', label: '24 Ayar Külçe & Ziynet Altın', category: 'katalog', icon: ShoppingBag },
  { value: 'kategori:ozel', label: 'Özel Atölye Tasarımları', category: 'katalog', icon: ShoppingBag },

  // Hizmetler & Tablar
  { value: 'tab:anasayfa', label: 'Ana Sayfa', category: 'hizmetler', icon: Layers },
  { value: 'tab:kurlar', label: 'Canlı Altın Kurları & Hesaplama', category: 'hizmetler', icon: Sparkles },
  { value: 'tab:altinini-getir', label: 'Altınını Getir (Bozdur & Takas)', category: 'hizmetler', icon: Sparkles },
  { value: 'tab:koleksiyon', label: 'Yeni Koleksiyon Önizleme', category: 'hizmetler', icon: Sparkles },
  { value: 'page:magazamiz', label: 'Mağazamız & Adres Bilgisi', category: 'hizmetler', icon: Building2 },

  // Altın Rehberi
  { value: 'tab:rehber', label: 'Altın Rehberi (Tüm Makaleler)', category: 'rehber', icon: BookOpen },
  { value: 'rehber:hasir-bilezik-ozellikleri', label: 'Rehber: Trabzon Hasırı & İşçilik', category: 'rehber', icon: BookOpen },
  { value: 'rehber:22-ayar-24-ayar-farklari', label: 'Rehber: 22 Ayar ve 24 Ayar Farkları', category: 'rehber', icon: BookOpen },
  { value: 'rehber:kulce-altin-guvenli-yatirim', label: 'Rehber: Külçe Altın Yatırımı', category: 'rehber', icon: BookOpen },
  { value: 'rehber:pirlanta-4c-kurali-secim', label: 'Rehber: Pırlanta 4C Kuralı', category: 'rehber', icon: BookOpen },
  { value: 'rehber:altin-bozdururken-dikkat-edilmesi-gerekenler', label: 'Rehber: Altın Bozdurma Rehberi', category: 'rehber', icon: BookOpen },
  { value: 'rehber:bursa-kapalicarsi-kuyumculuk-tarihi', label: 'Rehber: Bursa Kapalıçarşı Tarihi', category: 'rehber', icon: BookOpen },

  // Kurumsal
  { value: 'page:hakkimizda', label: 'Kurumsal: Hakkımızda & Tarihçe', category: 'kurumsal', icon: Building2 },
  { value: 'page:magazamiz', label: 'Kurumsal: Mağazamız & İletişim', category: 'kurumsal', icon: Building2 },
  { value: 'page:sss', label: 'Kurumsal: Sıkça Sorulan Sorular (SSS)', category: 'kurumsal', icon: Building2 },
  { value: 'page:neden-bursa-altin', label: 'Kurumsal: Neden Bursa Altın?', category: 'kurumsal', icon: Building2 },
  { value: 'page:musteri-yorumlari', label: 'Kurumsal: Müşteri Değerlendirmeleri', category: 'kurumsal', icon: Building2 },
];

export function resolveLinkDescription(link: string = ''): { text: string; color: string } {
  if (!link) return { text: 'Varsayılan Yönlendirme (Katalog/Kategori)', color: 'text-gray-400' };

  if (link.startsWith('http://') || link.startsWith('https://')) {
    return { text: `Dış Web Bağlantısı (${link})`, color: 'text-sky-400' };
  }
  if (link.startsWith('tel:') || link.startsWith('mailto:')) {
    return { text: `İletişim Hattı (${link})`, color: 'text-emerald-400' };
  }
  if (link === 'randevu' || link.startsWith('randevu:')) {
    return { text: 'VIP Mağaza Randevusu Modalı', color: 'text-purple-400' };
  }
  if (link.startsWith('kategori:') || link.startsWith('category:') || link.startsWith('cat:')) {
    const cat = link.split(':')[1];
    return { text: `Katalog Kategorisi: ${cat.toUpperCase()}`, color: 'text-amber-400' };
  }
  if (link.startsWith('tab:')) {
    const tab = link.split(':')[1];
    return { text: `Sayfa Sekmesi: ${tab}`, color: 'text-amber-300' };
  }
  if (link.startsWith('rehber:') || link.startsWith('guide:')) {
    const slug = link.split(':')[1];
    return { text: `Altın Rehberi Makalesi: ${slug}`, color: 'text-emerald-400' };
  }
  if (link.startsWith('page:') || link.startsWith('sayfa:')) {
    const page = link.split(':')[1];
    return { text: `Kurumsal Bilgi Sayfası: ${page}`, color: 'text-indigo-400' };
  }
  if (link.startsWith('product:') || link.startsWith('urun:')) {
    const prod = link.split(':')[1];
    return { text: `Ürün Detay Modalı: ${prod}`, color: 'text-rose-400' };
  }

  // Check matching preset
  const matched = PRESET_LINKS.find((p) => p.value === link);
  if (matched) {
    return { text: matched.label, color: 'text-amber-400' };
  }

  return { text: `Özel Hedef: ${link}`, color: 'text-amber-300' };
}

interface LinkSelectorInputProps {
  value?: string;
  onChange: (val: string) => void;
  label?: string;
  subLabel?: string;
  placeholder?: string;
}

export const LinkSelectorInput: React.FC<LinkSelectorInputProps> = ({
  value = '',
  onChange,
  label = 'Tıklama & Yönlendirme Hedefi',
  subLabel = 'Afiş veya görsele tıklandığında gidilecek sayfa, kategori veya link',
  placeholder = 'Örn: kategori:bilezik, tab:kurlar veya https://...',
}) => {
  const [isCustomMode, setIsCustomMode] = useState<boolean>(
    !PRESET_LINKS.some((p) => p.value === value) && value !== ''
  );

  const desc = resolveLinkDescription(value);

  const handlePresetSelect = (selectedVal: string) => {
    if (selectedVal === '__custom__') {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      onChange(selectedVal);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-[#c89d3a]" />
          <span>{label}</span>
        </label>

        <button
          type="button"
          onClick={() => setIsCustomMode(!isCustomMode)}
          className="text-[11px] text-[#c89d3a] hover:text-amber-300 underline font-medium transition-colors"
        >
          {isCustomMode ? 'Hazır Listeden Seç' : 'Serbest Link / URL Yaz'}
        </button>
      </div>

      {subLabel && <p className="text-[11px] text-gray-400">{subLabel}</p>}

      <div className="space-y-2">
        {!isCustomMode ? (
          <div className="relative">
            <select
              value={value || ''}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="w-full bg-[#121214] border border-[#27272a] hover:border-[#c89d3a] text-white text-xs rounded-lg px-3 py-2.5 outline-hidden focus:border-[#c89d3a] appearance-none pr-8 cursor-pointer"
            >
              <option value="">-- Varsayılan Yönlendirme --</option>

              <optgroup label="📁 Ürün Kataloğu & Kategoriler">
                {PRESET_LINKS.filter((p) => p.category === 'katalog').map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>

              <optgroup label="⚡ Ana Sayfalar & Hizmetler">
                {PRESET_LINKS.filter((p) => p.category === 'hizmetler').map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>

              <optgroup label="📖 Altın Rehberi (Bilgi Bankası)">
                {PRESET_LINKS.filter((p) => p.category === 'rehber').map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>

              <optgroup label="🏛️ Kurumsal Sayfalar & SSS">
                {PRESET_LINKS.filter((p) => p.category === 'kurumsal').map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>

              <option value="__custom__">✍️ Serbest Özel Bağlantı / Dış Web Sitesi Gir...</option>
            </select>

            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[#121214] border border-[#27272a] focus:border-[#c89d3a] text-white text-xs rounded-lg px-3 py-2 outline-hidden font-mono"
              />
            </div>
          </div>
        )}

        {/* Live Resolved Description Badge */}
        {value && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1a1e] rounded-md border border-[#27272a] text-[11px]">
            <Globe className="w-3 h-3 text-[#c89d3a]" />
            <span className="text-gray-400 font-medium">Hedef:</span>
            <span className={`font-semibold ${desc.color}`}>{desc.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};
