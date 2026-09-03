import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
  writeBatch,
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';
import { GuideArticle } from '../types';
import { DEFAULT_GUIDE_ARTICLES } from '../data/defaultGuideData';

const COLLECTION_NAME = 'guideArticles';
const LOCAL_STORAGE_KEY = 'bursa_altin_guide_articles_cache';

/**
 * Fetch cached or default guide articles
 */
export const getCachedGuideArticles = (): GuideArticle[] => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Guide articles cache read error:', e);
  }
  return DEFAULT_GUIDE_ARTICLES;
};

/**
 * Cache guide articles locally
 */
const cacheGuideArticles = (articles: GuideArticle[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.warn('Guide articles cache write error:', e);
  }
};

/**
 * Listen to real-time updates of guide articles from Firestore
 */
export const listenToGuideArticles = (
  callback: (articles: GuideArticle[]) => void
): Unsubscribe => {
  // Immediately emit cached/default
  callback(getCachedGuideArticles());

  if (!isFirebaseConfigured() || !db) {
    return () => {};
  }

  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const articles: GuideArticle[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as GuideArticle;
            articles.push({
              ...data,
              id: docSnap.id,
            });
          });
          articles.sort((a, b) => (a.order || 0) - (b.order || 0));
          cacheGuideArticles(articles);
          callback(articles);
        } else {
          callback(DEFAULT_GUIDE_ARTICLES);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
        callback(getCachedGuideArticles());
      }
    );

    return unsubscribe;
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, COLLECTION_NAME);
    return () => {};
  }
};

/**
 * Save / Update a single guide article
 */
export const saveGuideArticle = async (article: GuideArticle): Promise<void> => {
  const current = getCachedGuideArticles();
  const index = current.findIndex((a) => a.id === article.id);
  const updated = index >= 0 ? current.map((a) => (a.id === article.id ? article : a)) : [...current, article];
  cacheGuideArticles(updated);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, article.id);
      await setDoc(docRef, {
        ...article,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `${COLLECTION_NAME}/${article.id}`);
      throw e;
    }
  }
};

/**
 * Delete a guide article
 */
export const deleteGuideArticle = async (articleId: string): Promise<void> => {
  const current = getCachedGuideArticles().filter((a) => a.id !== articleId);
  cacheGuideArticles(current);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, articleId);
      await deleteDoc(docRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${COLLECTION_NAME}/${articleId}`);
      throw e;
    }
  }
};

/**
 * Seed default guide articles if Firestore collection is empty
 */
export const seedDefaultGuideArticlesIfEmpty = async (force: boolean = false): Promise<GuideArticle[]> => {
  if (!isFirebaseConfigured() || !db) {
    cacheGuideArticles(DEFAULT_GUIDE_ARTICLES);
    return DEFAULT_GUIDE_ARTICLES;
  }

  try {
    const collRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(collRef);

    if (snapshot.empty || force) {
      const batch = writeBatch(db);
      DEFAULT_GUIDE_ARTICLES.forEach((art) => {
        const docRef = doc(db, COLLECTION_NAME, art.id);
        const docRefFallback = doc(db, 'guide_articles', art.id);
        batch.set(docRef, art, { merge: true });
        batch.set(docRefFallback, art, { merge: true });
      });
      await batch.commit();
      cacheGuideArticles(DEFAULT_GUIDE_ARTICLES);
      return DEFAULT_GUIDE_ARTICLES;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }

  return getCachedGuideArticles();
};

export const seedDefaultGuideIfEmpty = seedDefaultGuideArticlesIfEmpty;
