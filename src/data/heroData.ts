import { HeroSlide, HeroSectionConfig } from '../types';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    tag: 'BURSA KAPALIÇARŞI USTA İŞÇİLİĞİ',
    title: '22 Ayar Hasır & Kelepçe Koleksiyonu',
    subtitle: 'Bursa Tarihi Bedesten atölyelerinde nesillerdir örülen geleneksel hasır zanaatı ve modern kelepçe tasarımları.',
    discountBadge: 'ÖZEL İŞÇİLİK FIRSATI',
    ctaText: 'Bilezikleri İncele',
    category: 'bilezik',
    bgImage: 'https://images.unsplash.com/photo-1611591475155-426ea754ce4e?auto=format&fit=crop&w=1600&q=80',
    primaryColor: '#c89d3a',
    isEnabled: true
  },
  {
    id: 'slide-2',
    tag: 'ULUSLARARASI HRD & GIA SERTİFİKALI',
    title: 'Pırlanta Tektaş & Baget Yüzükler',
    subtitle: 'Kusursuz faset kesimli, ışığı maksimum yansıtan 18 ayar montürlü evlilik teklifi ve yıldönümü koleksiyonu.',
    discountBadge: '%20 İNDİRİM',
    ctaText: 'Pırlantaları Keşfet',
    category: 'yuzuk',
    bgImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=80',
    primaryColor: '#996515',
    isEnabled: true
  },
  {
    id: 'slide-3',
    tag: 'GÜVENLİ FİZİKİ ALTIN YATIRIMI',
    title: '24 Ayar Has Külçe ve Darphane Ziynet',
    subtitle: 'Sıfır işçilik kaybı, güvenlik hologramlı blister ambalajında anlık borsa fiyatlarıyla fiziki teslimat.',
    discountBadge: 'CANLI BORSA KURU',
    ctaText: 'Külçe Fiyatlarını Gör',
    category: 'yatirim',
    bgImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=80',
    primaryColor: '#c89d3a',
    isEnabled: true
  }
];

export const DEFAULT_HERO_CONFIG: HeroSectionConfig = {
  slides: DEFAULT_HERO_SLIDES,
  dealCard: {
    tag: 'Günün Fırsatı',
    title: 'Pırlanta Baget Yüzük 0.45 Karat',
    subtitle: '18 Ayar Beyaz Altın • HRD Sertifikalı',
    productId: 'prod-6',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    buttonText: 'İncele',
    badgeType: 'deal'
  },
  investmentCard: {
    tag: 'Has Külçe Altın',
    title: '50 Gram 24 Ayar Külçe Altın',
    subtitle: '999.9 Has Milyem • Darphane & LBMA Tescilli',
    productId: 'prod-4',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80',
    buttonText: 'Canlı Kurlar',
    badgeType: 'investment'
  }
};
