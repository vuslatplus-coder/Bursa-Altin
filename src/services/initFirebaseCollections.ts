import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { DEFAULT_NAVIGATION_GROUPS } from '../data/defaultNavigationData';
import { DEFAULT_GUIDE_ARTICLES } from '../data/defaultGuideData';
import {
  DEFAULT_ALTININI_GETIR_CONFIG,
  DEFAULT_CONTENT_PAGES,
  DEFAULT_FOOTER_LINKS,
  DEFAULT_TOP_BAR_CONFIG,
} from '../data/defaultContentPagesData';
import { DEFAULT_HERO_CONFIG } from '../data/heroData';
import { DEFAULT_PROMO_BANNERS, DEFAULT_CATEGORY_CARDS } from './bannerContentService';

let isSeedingRunning = false;

/**
 * Initializes and auto-populates all Firestore collections if they do not exist
 * so that all menu groups, guide articles, pages, and site banners are directly
 * visible and editable inside the user's Firebase Console.
 */
export async function initializeAllFirestoreCollections(force: boolean = false): Promise<void> {
  if (!isFirebaseConfigured() || !db || isSeedingRunning) {
    return;
  }

  isSeedingRunning = true;

  try {
    console.log('🔄 Checking and initializing Firestore collections...');

    // 1. MENU & MEGA MENU COLLECTION: menu_gruplari & navigationGroups
    try {
      const menuSnap = await getDocs(collection(db, 'menu_gruplari'));
      if (menuSnap.empty || force) {
        console.log('📦 Seeding menu_gruplari & navigationGroups to Firestore...');
        const batch = writeBatch(db);
        DEFAULT_NAVIGATION_GROUPS.forEach((group) => {
          const docRefPrimary = doc(db, 'menu_gruplari', group.id);
          const docRefFallback = doc(db, 'navigationGroups', group.id);
          batch.set(docRefPrimary, group, { merge: true });
          batch.set(docRefFallback, group, { merge: true });
        });
        await batch.commit();
        console.log('✅ menu_gruplari populated successfully!');
      }
    } catch (err) {
      console.warn('menu_gruplari init error:', err);
    }

    // 2. GUIDE ARTICLES COLLECTION: guideArticles & guide_articles
    try {
      const guideSnap = await getDocs(collection(db, 'guideArticles'));
      if (guideSnap.empty || force) {
        console.log('📦 Seeding guideArticles to Firestore...');
        const batch = writeBatch(db);
        DEFAULT_GUIDE_ARTICLES.forEach((article) => {
          const docRefPrimary = doc(db, 'guideArticles', article.id);
          const docRefFallback = doc(db, 'guide_articles', article.id);
          batch.set(docRefPrimary, article, { merge: true });
          batch.set(docRefFallback, article, { merge: true });
        });
        await batch.commit();
        console.log('✅ guideArticles populated successfully!');
      }
    } catch (err) {
      console.warn('guideArticles init error:', err);
    }

    // 3. CORPORATE CONTENT PAGES: contentPages & content_pages
    try {
      const pagesSnap = await getDocs(collection(db, 'contentPages'));
      if (pagesSnap.empty || force) {
        console.log('📦 Seeding contentPages to Firestore...');
        const batch = writeBatch(db);
        DEFAULT_CONTENT_PAGES.forEach((page) => {
          const docRefPrimary = doc(db, 'contentPages', page.id);
          const docRefFallback = doc(db, 'content_pages', page.id);
          batch.set(docRefPrimary, page, { merge: true });
          batch.set(docRefFallback, page, { merge: true });
        });
        // Also seed Altinini Getir page configuration doc
        const getirRef = doc(db, 'contentPages', 'altininiGetirConfig');
        batch.set(getirRef, DEFAULT_ALTININI_GETIR_CONFIG, { merge: true });

        await batch.commit();
        console.log('✅ contentPages populated successfully!');
      }
    } catch (err) {
      console.warn('contentPages init error:', err);
    }

    // 4. FOOTER LINKS: footerLinks & footer_links
    try {
      const footerSnap = await getDocs(collection(db, 'footerLinks'));
      if (footerSnap.empty || force) {
        console.log('📦 Seeding footerLinks to Firestore...');
        const batch = writeBatch(db);
        DEFAULT_FOOTER_LINKS.forEach((link) => {
          const docRefPrimary = doc(db, 'footerLinks', link.id);
          const docRefFallback = doc(db, 'footer_links', link.id);
          batch.set(docRefPrimary, link, { merge: true });
          batch.set(docRefFallback, link, { merge: true });
        });
        await batch.commit();
        console.log('✅ footerLinks populated successfully!');
      }
    } catch (err) {
      console.warn('footerLinks init error:', err);
    }

    // 5. GLOBAL SITE SETTINGS: siteSettings & top_bar_config
    try {
      const topBarRef = doc(db, 'siteSettings', 'topBarConfig');
      const topBarSnap = await getDoc(topBarRef);
      if (!topBarSnap.exists() || force) {
        await setDoc(topBarRef, DEFAULT_TOP_BAR_CONFIG, { merge: true });
        await setDoc(doc(db, 'top_bar_config', 'settings'), DEFAULT_TOP_BAR_CONFIG, { merge: true });
      }

      const altininiGetirRef = doc(db, 'siteSettings', 'altininiGetirConfig');
      const altininiGetirSnap = await getDoc(altininiGetirRef);
      if (!altininiGetirSnap.exists() || force) {
        await setDoc(altininiGetirRef, DEFAULT_ALTININI_GETIR_CONFIG, { merge: true });
      }
    } catch (err) {
      console.warn('siteSettings init error:', err);
    }

    // 6. SITE VISUAL CONTENT: site_content
    try {
      const heroRef = doc(db, 'site_content', 'hero_section');
      const heroSnap = await getDoc(heroRef);
      if (!heroSnap.exists() || force) {
        await setDoc(heroRef, DEFAULT_HERO_CONFIG, { merge: true });
      }

      const promosRef = doc(db, 'site_content', 'promo_banners');
      const promosSnap = await getDoc(promosRef);
      if (!promosSnap.exists() || force) {
        await setDoc(promosRef, {
          items: DEFAULT_PROMO_BANNERS,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      const catsRef = doc(db, 'site_content', 'category_cards');
      const catsSnap = await getDoc(catsRef);
      if (!catsSnap.exists() || force) {
        await setDoc(catsRef, {
          items: DEFAULT_CATEGORY_CARDS,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('site_content init error:', err);
    }

    console.log('🎉 All Firestore collections verified and active!');
  } catch (error) {
    console.error('Error initializing Firestore collections:', error);
  } finally {
    isSeedingRunning = false;
  }
}
