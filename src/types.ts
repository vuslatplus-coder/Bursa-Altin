export interface GoldPrice {
  id: string;
  name: string;
  code: string;
  buying: number;
  selling: number;
  change: number; // percentage change e.g. +0.42
  high24h: number;
  low24h: number;
  updatedAt: string;
  category: 'has' | 'ziynet' | 'bilezik' | 'ons';
  unit: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
  };
  imageUrl: string;
  tags: string[];
}

export interface CollectionItem {
  id: string;
  title: string;
  category: 'bilezik' | 'pirlanta' | 'ozel-tasarim' | 'kulce-ziynet' | 'kolye';
  categoryLabel: string;
  karat: string;
  description: string;
  highlights: string[];
  estimatedLaunch: string;
  imageUrl: string;
  isExclusive?: boolean;
}

export interface AppointmentRequest {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  serviceType: 'ozel-tasarim' | 'alyans-tektaş' | 'yatirim-danismanligi' | 'vip-agirlama';
  notes?: string;
}

export interface WaitlistSubscriber {
  email: string;
  phone?: string;
  fullName?: string;
  interests?: string[];
  subscribedAt: string;
}
