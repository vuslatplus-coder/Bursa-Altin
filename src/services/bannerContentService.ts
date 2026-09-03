import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';
import {
  HeroSectionConfig,
  PromoBannerItem,
  CategoryShowcaseItem,
  SiteVisualContent,
} from '../types';
import { DEFAULT_HERO_CONFIG } from '../data/heroData';

// Fallback Default Promo Banners
export const DEFAULT_PROMO_BANNERS: PromoBannerItem[] = [
  {
    id: 'promo-1',
    tag: 'ÖZEL EL SANATI',
    title: '22 Ayar Hasır & Kelepçeler',
    subtitle: 'Geleneksel Bursa sarrafiye işçiliği',
    ctaText: 'Şimdi Keşfet',
    imageUrl: 'https://images.unsplash.com/photo-1611591475155-426ea754ce4e?auto=format&fit=crop&w=800&q=80',
    mobileImageUrl: '',
    categoryKey: 'bilezik',
    actionType: 'category',
    bgColorGradient: 'from-[#1c1917] to-[#292524]',
    accentColor: '#d4af37',
    isEnabled: true,
    order: 1,
  },
  {
    id: 'promo-2',
    tag: 'SERTİFİKALI PIRLANTA',
    title: 'Tektaş & Baget Koleksiyonu',
    subtitle: 'HRD Antwerp uluslararası sertifikasıyla',
    ctaText: 'Modelleri Gör',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    mobileImageUrl: '',
    categoryKey: 'yuzuk',
    actionType: 'category',
    bgColorGradient: 'from-[#0f172a] to-[#1e293b]',
    accentColor: '#38bdf8',
    isEnabled: true,
    order: 2,
  },
  {
    id: 'promo-3',
    tag: 'KİŞİYE ÖZEL ATÖLYE',
    title: 'Hayalinizdeki Takıyı Üretelim',
    subtitle: 'Özel çizim ve 3D mücevher modelleme',
    ctaText: 'Koleksiyonu İncele',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    mobileImageUrl: '',
    categoryKey: 'bilezik',
    actionType: 'category',
    bgColorGradient: 'from-[#78350f] to-[#92400e]',
    accentColor: '#fde68a',
    isEnabled: true,
    order: 3,
  },
];

// Fallback Default Category Showcase Cards
export const DEFAULT_CATEGORY_CARDS: CategoryShowcaseItem[] = [
  {
    id: 'bilezik',
    title: '22 Ayar Bilezik & Hasır Kelepçe',
    description: 'Trabzon hasırı, ajda modeller, burma ve modern kelepçe çeşitleri.',
    count: '24+ Model',
    image: 'https://images.unsplash.com/photo-1611591475155-426ea754ce4e?auto=format&fit=crop&w=800&q=80',
    mobileImage: '',
    tag: 'DÜĞÜN & YATIRIM',
    isEnabled: true,
    order: 1,
  },
  {
    id: 'yuzuk',
    title: 'Pırlanta Tektaş & Baget Yüzükler',
    description: 'Uluslararası sertifikalı, kusursuz kesimli ve 18 ayar montürlü yüzükler.',
    count: '32+ Model',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    mobileImage: '',
    tag: 'EVLİLİK TEKLİFİ',
    isEnabled: true,
    order: 2,
  },
  {
    id: 'kolye',
    title: 'Altın Kolye & Tuğralı Madalyon',
    description: 'Reşat çerçeveleri, Osmanlı tuğrası, dorika ve tasarım altın gerdanlıklar.',
    count: '18+ Model',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
    mobileImage: '',
    tag: 'GELENEKSEL ŞIKLIK',
    isEnabled: true,
    order: 3,
  },
  {
    id: 'yatirim',
    title: '24 Ayar Külçe & Darphane Ziynet',
    description: '1g, 5g, 10g, 50g, 100g LBMA onaylı saf külçe ve ziynet altınları.',
    count: 'Anlık Borsa Fiyatı',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
    mobileImage: '',
    tag: 'GÜVENLİ BİRİKİM',
    isEnabled: true,
    order: 4,
  },
];

export const DEFAULT_SITE_VISUAL_CONTENT: SiteVisualContent = {
  hero: DEFAULT_HERO_CONFIG,
  promos: DEFAULT_PROMO_BANNERS,
  categoryCards: DEFAULT_CATEGORY_CARDS,
};

// Document IDs in site_content collection
const DOC_HERO = 'hero_section';
const DOC_PROMOS = 'promo_banners';
const DOC_CATEGORIES = 'category_cards';

/**
 * Fetch all visual content from Firestore with safe fallback
 */
export async function getSiteVisualContent(): Promise<SiteVisualContent> {
  if (!isFirebaseConfigured() || !db) {
    return {
      hero: DEFAULT_HERO_CONFIG,
      promos: DEFAULT_PROMO_BANNERS,
      categoryCards: DEFAULT_CATEGORY_CARDS,
    };
  }

  try {
    const [heroDoc, promosDoc, catDoc] = await Promise.all([
      getDoc(doc(db, 'site_content', DOC_HERO)),
      getDoc(doc(db, 'site_content', DOC_PROMOS)),
      getDoc(doc(db, 'site_content', DOC_CATEGORIES)),
    ]);

    const hero = heroDoc.exists()
      ? (heroDoc.data() as HeroSectionConfig)
      : DEFAULT_HERO_CONFIG;

    const promos = promosDoc.exists()
      ? (promosDoc.data().items as PromoBannerItem[])
      : DEFAULT_PROMO_BANNERS;

    const categoryCards = catDoc.exists()
      ? (catDoc.data().items as CategoryShowcaseItem[])
      : DEFAULT_CATEGORY_CARDS;

    return { hero, promos, categoryCards };
  } catch (error) {
    console.warn('Firestore görsel verileri çekilirken hata (yerel fallback kullanılıyor):', error);
    return {
      hero: DEFAULT_HERO_CONFIG,
      promos: DEFAULT_PROMO_BANNERS,
      categoryCards: DEFAULT_CATEGORY_CARDS,
    };
  }
}

/**
 * Real-time listener for site visual content
 */
export function listenToSiteVisualContent(
  onUpdate: (data: SiteVisualContent) => void
): Unsubscribe | null {
  if (!isFirebaseConfigured() || !db) {
    onUpdate({
      hero: DEFAULT_HERO_CONFIG,
      promos: DEFAULT_PROMO_BANNERS,
      categoryCards: DEFAULT_CATEGORY_CARDS,
    });
    return null;
  }

  try {
    let currentHero = DEFAULT_HERO_CONFIG;
    let currentPromos = DEFAULT_PROMO_BANNERS;
    let currentCategories = DEFAULT_CATEGORY_CARDS;

    const unsubs: Unsubscribe[] = [];

    // Optional seeding: only attempt if admin is authenticated
    if (auth?.currentUser) {
      const initFirestoreDocs = async () => {
        if (!db) return;
        try {
          const [heroSnap, promoSnap, catSnap] = await Promise.all([
            getDoc(doc(db, 'site_content', DOC_HERO)),
            getDoc(doc(db, 'site_content', DOC_PROMOS)),
            getDoc(doc(db, 'site_content', DOC_CATEGORIES)),
          ]);

          if (!heroSnap.exists()) {
            await setDoc(doc(db, 'site_content', DOC_HERO), DEFAULT_HERO_CONFIG);
          }
          if (!promoSnap.exists()) {
            await setDoc(doc(db, 'site_content', DOC_PROMOS), {
              items: DEFAULT_PROMO_BANNERS,
              updatedAt: new Date().toISOString(),
            });
          }
          if (!catSnap.exists()) {
            await setDoc(doc(db, 'site_content', DOC_CATEGORIES), {
              items: DEFAULT_CATEGORY_CARDS,
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'site_content');
        }
      };
      initFirestoreDocs();
    }

    const handleError = (error: unknown) => {
      handleFirestoreError(error, OperationType.GET, 'site_content');
      onUpdate({ hero: currentHero, promos: currentPromos, categoryCards: currentCategories });
    };

    unsubs.push(
      onSnapshot(
        doc(db, 'site_content', DOC_HERO),
        (snapshot) => {
          if (snapshot.exists()) {
            currentHero = snapshot.data() as HeroSectionConfig;
          }
          onUpdate({ hero: currentHero, promos: currentPromos, categoryCards: currentCategories });
        },
        handleError
      )
    );

    unsubs.push(
      onSnapshot(
        doc(db, 'site_content', DOC_PROMOS),
        (snapshot) => {
          if (snapshot.exists()) {
            currentPromos = (snapshot.data().items as PromoBannerItem[]) || DEFAULT_PROMO_BANNERS;
          }
          onUpdate({ hero: currentHero, promos: currentPromos, categoryCards: currentCategories });
        },
        handleError
      )
    );

    unsubs.push(
      onSnapshot(
        doc(db, 'site_content', DOC_CATEGORIES),
        (snapshot) => {
          if (snapshot.exists()) {
            currentCategories = (snapshot.data().items as CategoryShowcaseItem[]) || DEFAULT_CATEGORY_CARDS;
          }
          onUpdate({ hero: currentHero, promos: currentPromos, categoryCards: currentCategories });
        },
        handleError
      )
    );

    return () => {
      unsubs.forEach((u) => u());
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'site_content');
    return null;
  }
}

/**
 * Save updated Hero Section config to Firestore
 */
export async function saveHeroSectionConfig(config: HeroSectionConfig): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore bağlantısı hazır değil.');
  }
  await setDoc(doc(db, 'site_content', DOC_HERO), config, { merge: true });
}

/**
 * Save updated Promo Banners list to Firestore
 */
export async function savePromoBanners(promos: PromoBannerItem[]): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore bağlantısı hazır değil.');
  }
  await setDoc(doc(db, 'site_content', DOC_PROMOS), { items: promos, updatedAt: new Date().toISOString() });
}

/**
 * Save updated Category Showcase items to Firestore
 */
export async function saveCategoryShowcase(items: CategoryShowcaseItem[]): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore bağlantısı hazır değil.');
  }
  await setDoc(doc(db, 'site_content', DOC_CATEGORIES), { items, updatedAt: new Date().toISOString() });
}

/**
 * One-time idempotent seed function: Upload all site visual content, slides, promos, and categories to Firebase
 * Overwrites with clean data without duplicating records.
 */
export async function seedInitialVisualContentToFirebase(): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase yapılandırılmamış.');
  }

  await Promise.all([
    setDoc(doc(db, 'site_content', DOC_HERO), DEFAULT_HERO_CONFIG, { merge: true }),
    setDoc(doc(db, 'site_content', DOC_PROMOS), { items: DEFAULT_PROMO_BANNERS, updatedAt: new Date().toISOString() }, { merge: true }),
    setDoc(doc(db, 'site_content', DOC_CATEGORIES), { items: DEFAULT_CATEGORY_CARDS, updatedAt: new Date().toISOString() }, { merge: true }),
  ]);
}

