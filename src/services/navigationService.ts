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
import { NavigationGroup } from '../types';
import { DEFAULT_NAVIGATION_GROUPS } from '../data/defaultNavigationData';

const PRIMARY_COLLECTION = 'menu_gruplari';
const FALLBACK_COLLECTION = 'navigationGroups';

// Local cache key
const LOCAL_STORAGE_KEY = 'bursa_altin_navigation_cache';

/**
 * Fetch cached or default navigation groups
 */
export const getCachedNavigationGroups = (): NavigationGroup[] => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Navigation cache read error:', e);
  }
  return DEFAULT_NAVIGATION_GROUPS;
};

/**
 * Cache navigation groups locally
 */
const cacheNavigationGroups = (groups: NavigationGroup[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(groups));
  } catch (e) {
    console.warn('Navigation cache write error:', e);
  }
};

/**
 * Listen to real-time updates of navigation groups from Firestore
 */
export const listenToNavigationGroups = (
  callback: (groups: NavigationGroup[]) => void
): Unsubscribe => {
  // Immediately emit cached/default
  callback(getCachedNavigationGroups());

  if (!isFirebaseConfigured() || !db) {
    return () => {};
  }

  try {
    const qPrimary = query(collection(db, PRIMARY_COLLECTION), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      qPrimary,
      (snapshot) => {
        if (!snapshot.empty) {
          const groups: NavigationGroup[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as NavigationGroup;
            groups.push({
              ...data,
              id: docSnap.id,
            });
          });
          groups.sort((a, b) => (a.order || 0) - (b.order || 0));
          cacheNavigationGroups(groups);
          callback(groups);
        } else {
          // If primary is empty, try fallback collection or auto-seed defaults
          const qFallback = query(collection(db!, FALLBACK_COLLECTION), orderBy('order', 'asc'));
          getDocs(qFallback).then((fallbackSnap) => {
            if (!fallbackSnap.empty) {
              const groups: NavigationGroup[] = [];
              fallbackSnap.forEach((docSnap) => {
                const data = docSnap.data() as NavigationGroup;
                groups.push({
                  ...data,
                  id: docSnap.id,
                });
              });
              groups.sort((a, b) => (a.order || 0) - (b.order || 0));
              cacheNavigationGroups(groups);
              callback(groups);
            } else {
              // Auto-seed to Firestore so it appears in the user's Firebase Console immediately
              seedDefaultNavigationIfEmpty(true).catch(console.warn);
              callback(DEFAULT_NAVIGATION_GROUPS);
            }
          }).catch(() => {
            seedDefaultNavigationIfEmpty(true).catch(console.warn);
            callback(DEFAULT_NAVIGATION_GROUPS);
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, PRIMARY_COLLECTION);
        callback(getCachedNavigationGroups());
      }
    );

    return unsubscribe;
  } catch (e) {
    handleFirestoreError(e, OperationType.GET, PRIMARY_COLLECTION);
    return () => {};
  }
};

/**
 * Save a single navigation group
 */
export const saveNavigationGroup = async (group: NavigationGroup): Promise<void> => {
  const current = getCachedNavigationGroups();
  const index = current.findIndex((g) => g.id === group.id);
  const updated = index >= 0 ? current.map((g) => (g.id === group.id ? group : g)) : [...current, group];
  cacheNavigationGroups(updated);

  if (isFirebaseConfigured() && db) {
    try {
      const docRefPrimary = doc(db, PRIMARY_COLLECTION, group.id);
      const docRefFallback = doc(db, FALLBACK_COLLECTION, group.id);
      await Promise.all([
        setDoc(docRefPrimary, group, { merge: true }),
        setDoc(docRefFallback, group, { merge: true })
      ]);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `${PRIMARY_COLLECTION}/${group.id}`);
      throw e;
    }
  }
};

/**
 * Save all navigation groups (e.g. after reordering or adding new groups)
 */
export const saveAllNavigationGroups = async (groups: NavigationGroup[]): Promise<void> => {
  cacheNavigationGroups(groups);

  if (isFirebaseConfigured() && db) {
    try {
      const batch = writeBatch(db);
      groups.forEach((group, index) => {
        const docRefPrimary = doc(db, PRIMARY_COLLECTION, group.id);
        const docRefFallback = doc(db, FALLBACK_COLLECTION, group.id);
        const data = { ...group, order: index + 1 };
        batch.set(docRefPrimary, data, { merge: true });
        batch.set(docRefFallback, data, { merge: true });
      });
      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, PRIMARY_COLLECTION);
      throw e;
    }
  }
};

/**
 * Delete a navigation group
 */
export const deleteNavigationGroup = async (groupId: string): Promise<void> => {
  const current = getCachedNavigationGroups().filter((g) => g.id !== groupId);
  cacheNavigationGroups(current);

  if (isFirebaseConfigured() && db) {
    try {
      const docRefPrimary = doc(db, PRIMARY_COLLECTION, groupId);
      const docRefFallback = doc(db, FALLBACK_COLLECTION, groupId);
      await Promise.all([
        deleteDoc(docRefPrimary),
        deleteDoc(docRefFallback)
      ]);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `${PRIMARY_COLLECTION}/${groupId}`);
      throw e;
    }
  }
};

/**
 * Seed default navigation groups if Firestore collection is empty or upon user request
 */
export const seedDefaultNavigationIfEmpty = async (force: boolean = false): Promise<NavigationGroup[]> => {
  if (!isFirebaseConfigured() || !db) {
    cacheNavigationGroups(DEFAULT_NAVIGATION_GROUPS);
    return DEFAULT_NAVIGATION_GROUPS;
  }

  try {
    const collRef = collection(db, PRIMARY_COLLECTION);
    const snapshot = await getDocs(collRef);

    if (snapshot.empty || force) {
      const batch = writeBatch(db);
      DEFAULT_NAVIGATION_GROUPS.forEach((group) => {
        const docRefPrimary = doc(db, PRIMARY_COLLECTION, group.id);
        const docRefFallback = doc(db, FALLBACK_COLLECTION, group.id);
        batch.set(docRefPrimary, group, { merge: true });
        batch.set(docRefFallback, group, { merge: true });
      });
      await batch.commit();
      cacheNavigationGroups(DEFAULT_NAVIGATION_GROUPS);
      return DEFAULT_NAVIGATION_GROUPS;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PRIMARY_COLLECTION);
  }

  return getCachedNavigationGroups();
};
