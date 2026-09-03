import {
  collection,
  doc,
  getDoc,
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
import {
  AltininiGetirConfig,
  ContentPage,
  FooterLink,
  TopBarConfig,
} from '../types';
import {
  DEFAULT_ALTININI_GETIR_CONFIG,
  DEFAULT_CONTENT_PAGES,
  DEFAULT_FOOTER_LINKS,
  DEFAULT_TOP_BAR_CONFIG,
} from '../data/defaultContentPagesData';

// Collection / Doc names
const CONTENT_PAGES_COLLECTION = 'contentPages';
const FOOTER_LINKS_COLLECTION = 'footerLinks';
const SITE_SETTINGS_COLLECTION = 'siteSettings';
const TOP_BAR_DOC_ID = 'topBarConfig';
const ALTININI_GETIR_DOC_ID = 'altininiGetirConfig';

// Local storage caches
const CACHE_KEY_ALTININI_GETIR = 'bursa_altin_altinini_getir_cache';
const CACHE_KEY_CONTENT_PAGES = 'bursa_altin_content_pages_cache';
const CACHE_KEY_FOOTER_LINKS = 'bursa_altin_footer_links_cache';
const CACHE_KEY_TOP_BAR = 'bursa_altin_top_bar_cache';

// ----------------- ALTININI GETİR SERVICE -----------------

export const getCachedAltininiGetirConfig = (): AltininiGetirConfig => {
  try {
    const cached = localStorage.getItem(CACHE_KEY_ALTININI_GETIR);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Altinini Getir cache read error:', e);
  }
  return DEFAULT_ALTININI_GETIR_CONFIG;
};

const cacheAltininiGetirConfig = (config: AltininiGetirConfig) => {
  try {
    localStorage.setItem(CACHE_KEY_ALTININI_GETIR, JSON.stringify(config));
  } catch (e) {
    console.warn('Altinini Getir cache write error:', e);
  }
};

export const listenToAltininiGetirConfig = (
  callback: (config: AltininiGetirConfig) => void
): Unsubscribe => {
  callback(getCachedAltininiGetirConfig());

  if (!isFirebaseConfigured() || !db) {
    return () => {};
  }

  try {
    const docRef = doc(db, CONTENT_PAGES_COLLECTION, ALTININI_GETIR_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as AltininiGetirConfig;
          cacheAltininiGetirConfig(data);
          callback(data);
        } else {
          callback(DEFAULT_ALTININI_GETIR_CONFIG);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${CONTENT_PAGES_COLLECTION}/${ALTININI_GETIR_DOC_ID}`);
        callback(getCachedAltininiGetirConfig());
      }
    );
    return unsubscribe;
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, `${CONTENT_PAGES_COLLECTION}/${ALTININI_GETIR_DOC_ID}`);
    return () => {};
  }
};

export const saveAltininiGetirConfig = async (
  config: AltininiGetirConfig
): Promise<void> => {
  const updated = {
    ...config,
    updatedAt: new Date().toISOString(),
  };
  cacheAltininiGetirConfig(updated);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, CONTENT_PAGES_COLLECTION, ALTININI_GETIR_DOC_ID);
      await setDoc(docRef, updated, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `${CONTENT_PAGES_COLLECTION}/${ALTININI_GETIR_DOC_ID}`);
      throw e;
    }
  }
};

// ----------------- CONTENT PAGES (HAKKIMIZDA, MAGAZALAR, SSS, ETC) -----------------

export const getCachedContentPages = (): ContentPage[] => {
  try {
    const cached = localStorage.getItem(CACHE_KEY_CONTENT_PAGES);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Content pages cache read error:', e);
  }
  return DEFAULT_CONTENT_PAGES;
};

const cacheContentPages = (pages: ContentPage[]) => {
  try {
    localStorage.setItem(CACHE_KEY_CONTENT_PAGES, JSON.stringify(pages));
  } catch (e) {
    console.warn('Content pages cache write error:', e);
  }
};

export const listenToContentPages = (
  callback: (pages: ContentPage[]) => void
): Unsubscribe => {
  callback(getCachedContentPages());

  if (!isFirebaseConfigured() || !db) {
    return () => {};
  }

  try {
    const q = query(collection(db, CONTENT_PAGES_COLLECTION));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const pages: ContentPage[] = [];
          snapshot.forEach((docSnap) => {
            if (docSnap.id !== ALTININI_GETIR_DOC_ID) {
              const data = docSnap.data() as ContentPage;
              pages.push({
                ...data,
                id: docSnap.id,
              });
            }
          });
          if (pages.length > 0) {
            cacheContentPages(pages);
            callback(pages);
          } else {
            callback(DEFAULT_CONTENT_PAGES);
          }
        } else {
          callback(DEFAULT_CONTENT_PAGES);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, CONTENT_PAGES_COLLECTION);
        callback(getCachedContentPages());
      }
    );
    return unsubscribe;
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, CONTENT_PAGES_COLLECTION);
    return () => {};
  }
};

export const saveContentPage = async (page: ContentPage): Promise<void> => {
  const current = getCachedContentPages();
  const index = current.findIndex((p) => p.id === page.id);
  const updatedPage = { ...page, updatedAt: new Date().toISOString() };
  const updatedList = index >= 0 ? current.map((p) => (p.id === page.id ? updatedPage : p)) : [...current, updatedPage];
  cacheContentPages(updatedList);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, CONTENT_PAGES_COLLECTION, page.id);
      await setDoc(docRef, updatedPage, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `${CONTENT_PAGES_COLLECTION}/${page.id}`);
      throw e;
    }
  }
};

export const seedDefaultContentPagesIfEmpty = async (force: boolean = false): Promise<ContentPage[]> => {
  if (!isFirebaseConfigured() || !db) {
    cacheContentPages(DEFAULT_CONTENT_PAGES);
    return DEFAULT_CONTENT_PAGES;
  }

  try {
    const batch = writeBatch(db);
    // Also save Altınını Getir
    const getirRef = doc(db, CONTENT_PAGES_COLLECTION, ALTININI_GETIR_DOC_ID);
    batch.set(getirRef, DEFAULT_ALTININI_GETIR_CONFIG, { merge: true });

    DEFAULT_CONTENT_PAGES.forEach((page) => {
      const docRef = doc(db, CONTENT_PAGES_COLLECTION, page.id);
      const docRefFallback = doc(db, 'content_pages', page.id);
      batch.set(docRef, page, { merge: true });
      batch.set(docRefFallback, page, { merge: true });
    });

    await batch.commit();
    cacheContentPages(DEFAULT_CONTENT_PAGES);
    cacheAltininiGetirConfig(DEFAULT_ALTININI_GETIR_CONFIG);
    return DEFAULT_CONTENT_PAGES;
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, CONTENT_PAGES_COLLECTION);
  }
  return getCachedContentPages();
};

// ----------------- FOOTER LINKS SERVICE -----------------

export const getCachedFooterLinks = (): FooterLink[] => {
  try {
    const cached = localStorage.getItem(CACHE_KEY_FOOTER_LINKS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Footer links cache read error:', e);
  }
  return DEFAULT_FOOTER_LINKS;
};

const cacheFooterLinks = (links: FooterLink[]) => {
  try {
    localStorage.setItem(CACHE_KEY_FOOTER_LINKS, JSON.stringify(links));
  } catch (e) {
    console.warn('Footer links cache write error:', e);
  }
};

export const listenToFooterLinks = (
  callback: (links: FooterLink[]) => void
): Unsubscribe => {
  callback(getCachedFooterLinks());

  if (!isFirebaseConfigured() || !db) {
    return () => {};
  }

  try {
    const q = query(collection(db, FOOTER_LINKS_COLLECTION), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const links: FooterLink[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as FooterLink;
            links.push({
              ...data,
              id: docSnap.id,
            });
          });
          links.sort((a, b) => (a.order || 0) - (b.order || 0));
          cacheFooterLinks(links);
          callback(links);
        } else {
          callback(DEFAULT_FOOTER_LINKS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, FOOTER_LINKS_COLLECTION);
        callback(getCachedFooterLinks());
      }
    );
    return unsubscribe;
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, FOOTER_LINKS_COLLECTION);
    return () => {};
  }
};

export const saveFooterLink = async (link: FooterLink): Promise<void> => {
  const current = getCachedFooterLinks();
  const index = current.findIndex((l) => l.id === link.id);
  const updatedList = index >= 0 ? current.map((l) => (l.id === link.id ? link : l)) : [...current, link];
  cacheFooterLinks(updatedList);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, FOOTER_LINKS_COLLECTION, link.id);
      await setDoc(docRef, link, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `${FOOTER_LINKS_COLLECTION}/${link.id}`);
      throw e;
    }
  }
};

export const saveAllFooterLinks = async (links: FooterLink[]): Promise<void> => {
  cacheFooterLinks(links);

  if (isFirebaseConfigured() && db) {
    try {
      const batch = writeBatch(db);
      links.forEach((l, index) => {
        const docRef = doc(db, FOOTER_LINKS_COLLECTION, l.id);
        batch.set(docRef, { ...l, order: index + 1 }, { merge: true });
      });
      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, FOOTER_LINKS_COLLECTION);
      throw e;
    }
  }
};

export const deleteFooterLink = async (linkId: string): Promise<void> => {
  const current = getCachedFooterLinks().filter((l) => l.id !== linkId);
  cacheFooterLinks(current);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, FOOTER_LINKS_COLLECTION, linkId);
      await deleteDoc(docRef);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${FOOTER_LINKS_COLLECTION}/${linkId}`);
      throw e;
    }
  }
};

export const seedDefaultFooterLinksIfEmpty = async (force: boolean = false): Promise<FooterLink[]> => {
  if (!isFirebaseConfigured() || !db) {
    cacheFooterLinks(DEFAULT_FOOTER_LINKS);
    return DEFAULT_FOOTER_LINKS;
  }

  try {
    const collRef = collection(db, FOOTER_LINKS_COLLECTION);
    const snapshot = await getDocs(collRef);

    if (snapshot.empty || force) {
      const batch = writeBatch(db);
      DEFAULT_FOOTER_LINKS.forEach((link) => {
        const docRef = doc(db, FOOTER_LINKS_COLLECTION, link.id);
        const docRefFallback = doc(db, 'footer_links', link.id);
        batch.set(docRef, link, { merge: true });
        batch.set(docRefFallback, link, { merge: true });
      });
      await batch.commit();
      cacheFooterLinks(DEFAULT_FOOTER_LINKS);
      return DEFAULT_FOOTER_LINKS;
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, FOOTER_LINKS_COLLECTION);
  }
  return getCachedFooterLinks();
};

// ----------------- TOP BAR CONFIG SERVICE -----------------

export const getCachedTopBarConfig = (): TopBarConfig => {
  try {
    const cached = localStorage.getItem(CACHE_KEY_TOP_BAR);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Top bar cache read error:', e);
  }
  return DEFAULT_TOP_BAR_CONFIG;
};

const cacheTopBarConfig = (config: TopBarConfig) => {
  try {
    localStorage.setItem(CACHE_KEY_TOP_BAR, JSON.stringify(config));
  } catch (e) {
    console.warn('Top bar cache write error:', e);
  }
};

export const listenToTopBarConfig = (
  callback: (config: TopBarConfig) => void
): Unsubscribe => {
  callback(getCachedTopBarConfig());

  if (!isFirebaseConfigured() || !db) {
    return () => {};
  }

  try {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, TOP_BAR_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as TopBarConfig;
          cacheTopBarConfig(data);
          callback(data);
        } else {
          callback(DEFAULT_TOP_BAR_CONFIG);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `${SITE_SETTINGS_COLLECTION}/${TOP_BAR_DOC_ID}`);
        callback(getCachedTopBarConfig());
      }
    );
    return unsubscribe;
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, `${SITE_SETTINGS_COLLECTION}/${TOP_BAR_DOC_ID}`);
    return () => {};
  }
};

export const saveTopBarConfig = async (config: TopBarConfig): Promise<void> => {
  cacheTopBarConfig(config);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, SITE_SETTINGS_COLLECTION, TOP_BAR_DOC_ID);
      await setDoc(docRef, config, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `${SITE_SETTINGS_COLLECTION}/${TOP_BAR_DOC_ID}`);
      throw e;
    }
  }
};
