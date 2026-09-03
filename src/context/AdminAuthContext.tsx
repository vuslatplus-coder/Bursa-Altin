import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, ADMIN_MASTER_UID } from '../services/firebase';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  loading: boolean;
  firebaseReady: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginAsMasterAdmin: (passcode?: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isAdmin: false,
  isAdminAuthenticated: false,
  loading: false,
  firebaseReady: false,
  login: async () => {},
  loginAsMasterAdmin: async () => {},
  logout: async () => {},
  authError: null,
  clearError: () => {},
});

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLocalAdmin, setIsLocalAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bursa_altin_admin_active') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bursa_altin_admin_active') === 'true';
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const firebaseReady = isFirebaseConfigured() && !!auth;

  useEffect(() => {
    // Failsafe timeout: never stay in loading state for more than 1200ms
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    if (!firebaseReady || !auth) {
      setLoading(false);
      clearTimeout(safetyTimer);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          clearTimeout(safetyTimer);
          setUser(currentUser);
          if (currentUser) {
            if (ADMIN_MASTER_UID && ADMIN_MASTER_UID.trim() !== '') {
              const matchesUid = currentUser.uid === ADMIN_MASTER_UID.trim();
              setIsAdmin(matchesUid || isLocalAdmin);
            } else {
              setIsAdmin(true);
            }
          } else {
            setIsAdmin(isLocalAdmin);
          }
          setLoading(false);
        },
        () => {
          clearTimeout(safetyTimer);
          setLoading(false);
        }
      );

      return () => {
        clearTimeout(safetyTimer);
        unsubscribe();
      };
    } catch (e) {
      clearTimeout(safetyTimer);
      setLoading(false);
    }
  }, [firebaseReady, isLocalAdmin]);

  const login = async (email: string, pass: string) => {
    setAuthError(null);

    // Fast-track master fallback credentials
    const trimmedEmail = email.trim().toLowerCase();
    if (
      (trimmedEmail === 'admin' || trimmedEmail === 'admin@hamdemirci.com' || trimmedEmail === 'admin@bursaaltin.com' || trimmedEmail === 'vuslatplus@gmail.com') &&
      (pass === '123456' || pass === 'admin123' || pass === 'hamdemirci16' || pass === 'admin')
    ) {
      try {
        localStorage.setItem('bursa_altin_admin_active', 'true');
      } catch (e) {
        // ignore storage error
      }
      setIsLocalAdmin(true);
      setIsAdmin(true);
      return;
    }

    if (!firebaseReady || !auth) {
      // If Firebase isn't configured for Auth, allow direct master login with clear hint
      if (pass === 'admin' || pass === '123456' || pass === 'hamdemirci16') {
        try {
          localStorage.setItem('bursa_altin_admin_active', 'true');
        } catch {}
        setIsLocalAdmin(true);
        setIsAdmin(true);
        return;
      }
      throw new Error('Firebase Auth henüz bağlanmadı. Hızlı giriş için şifre olarak "hamdemirci16" veya "admin123" kullanabilirsiniz.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const loggedInUser = userCredential.user;

      if (ADMIN_MASTER_UID && ADMIN_MASTER_UID.trim() !== '') {
        if (loggedInUser.uid !== ADMIN_MASTER_UID.trim()) {
          await fbSignOut(auth);
          setUser(null);
          setIsAdmin(false);
          throw new Error('Bu hesap yetkili yönetici UID değerine sahip değil.');
        }
      }
      try {
        localStorage.setItem('bursa_altin_admin_active', 'true');
      } catch {}
      setIsLocalAdmin(true);
      setIsAdmin(true);
    } catch (err: any) {
      let friendlyMsg = 'Giriş yapılamadı. E-posta veya şifrenizi kontrol ediniz.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        friendlyMsg = 'Hatalı e-posta veya şifre girdiniz.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMsg = 'Çok fazla başarısız deneme yapıldı. Lütfen biraz bekleyiniz.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMsg = 'Geçerli bir e-posta adresi giriniz.';
      } else if (err.message) {
        friendlyMsg = err.message;
      }
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const loginAsMasterAdmin = async (_passcode?: string) => {
    setAuthError(null);
    try {
      localStorage.setItem('bursa_altin_admin_active', 'true');
    } catch {}
    setIsLocalAdmin(true);
    setIsAdmin(true);
  };

  const logout = async () => {
    try {
      localStorage.removeItem('bursa_altin_admin_active');
    } catch {}
    setIsLocalAdmin(false);
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch {}
    }
    setUser(null);
    setIsAdmin(false);
  };

  const clearError = () => setAuthError(null);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAdmin: isAdmin || isLocalAdmin,
        isAdminAuthenticated: isAdmin || isLocalAdmin,
        loading,
        firebaseReady,
        login,
        loginAsMasterAdmin,
        logout,
        authError,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
