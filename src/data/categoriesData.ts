export interface CustomCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  itemCount?: number;
  isEnabled?: boolean; // Açıp kapatabilme özelliği
  badge?: string; // Örn: 'Trend', 'Çok Satan', '24K Has'
}

export const DEFAULT_CATEGORIES: CustomCategory[] = [
  {
    id: 'bilezik',
    name: '22A Bilezik & Kelepçe',
    slug: 'bilezik',
    description: '22 Ayar Trabzon Hasırı, Ajda, Şarnel, Burma ve İşçilikli Kelepçeler',
    imageUrl: 'https://images.unsplash.com/photo-1611591475155-426ea754ce4e?auto=format&fit=crop&w=600&q=80',
    isEnabled: true,
    badge: 'Trend'
  },
  {
    id: 'yuzuk',
    name: 'Yüzük & Tektaş',
    slug: 'yuzuk',
    description: 'Pırlanta Tektaş, Baget, Tria ve 14/18 Ayar Özel Tasarım Yüzükler',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    isEnabled: true,
  },
  {
    id: 'kolye',
    name: 'Kolye & Tuğra',
    slug: 'kolye',
    description: 'Osmanlı Tuğralı Kolye, Dorika, Baget ve Su Yolu Gerdanlık Modelleri',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    isEnabled: true,
  },
  {
    id: 'kupe',
    name: 'Küpe & Halka',
    slug: 'kupe',
    description: '14A ve 22A Halka, Sallantılı, Taşlı ve Baget Küpeler',
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    isEnabled: true,
  },
  {
    id: 'alyans',
    name: 'Alyans Koleksiyonu',
    slug: 'alyans',
    description: 'Klasik Bombeli, Mat & Parlak Çift Alyanslar ve Düğün Setleri',
    imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
    isEnabled: true,
  },
  {
    id: 'yatirim',
    name: '24A Külçe & Ziynet Altın',
    slug: 'yatirim',
    description: '24K Has Külçe, Çeyrek, Yarım, Tam, Ata ve Gram Altın Çeşitleri',
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80',
    isEnabled: true,
    badge: '24K Has'
  }
];
