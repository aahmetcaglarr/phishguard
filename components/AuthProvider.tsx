"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
} from "firebase/auth";
import type { AppUser, Role } from "@/lib/types";
import { getAdminEmails, getFirebase, isFirebaseEnabled } from "@/lib/firebase";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  cloud: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInGuest: (name?: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  demoAvailable: boolean;
  signOutUser: () => Promise<void>;
  setLocalName: (name: string) => void;
}

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL;
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

const AuthContext = createContext<AuthContextValue | null>(null);

const LOCAL_USER_KEY = "phishguard.localuser.v1";

function resolveRole(email: string | null): Role {
  if (!email) return "student";
  return getAdminEmails().includes(email.toLowerCase()) ? "admin" : "student";
}

function readLocalUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const cloud = isFirebaseEnabled;
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Bulut modu: Firebase auth durumunu dinle
  useEffect(() => {
    if (!cloud) {
      setUser(readLocalUser());
      setLoading(false);
      return;
    }
    const fb = getFirebase();
    if (!fb) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(fb.auth, (fu) => {
      if (fu) {
        setUser({
          uid: fu.uid,
          displayName:
            fu.displayName || (fu.isAnonymous ? "Misafir" : fu.email || "Kullanıcı"),
          email: fu.email,
          isAnonymous: fu.isAnonymous,
          role: resolveRole(fu.email),
          cloud: true,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [cloud]);

  const signInEmail = useCallback(async (email: string, password: string) => {
    const fb = getFirebase();
    if (!fb) throw new Error("Firebase etkin değil");
    await signInWithEmailAndPassword(fb.auth, email, password);
  }, []);

  const signUpEmail = useCallback(
    async (name: string, email: string, password: string) => {
      const fb = getFirebase();
      if (!fb) throw new Error("Firebase etkin değil");
      const cred = await createUserWithEmailAndPassword(fb.auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      setUser({
        uid: cred.user.uid,
        displayName: name || email,
        email: cred.user.email,
        isAnonymous: false,
        role: resolveRole(cred.user.email),
        cloud: true,
      });
    },
    []
  );

  const signInGoogle = useCallback(async () => {
    const fb = getFirebase();
    if (!fb) throw new Error("Firebase etkin değil");
    await signInWithPopup(fb.auth, new GoogleAuthProvider());
  }, []);

  const signInGuest = useCallback(
    async (name?: string) => {
      if (cloud) {
        const fb = getFirebase();
        if (!fb) throw new Error("Firebase etkin değil");
        await signInAnonymously(fb.auth);
        return;
      }
      // Yerel misafir — mevcut yerel kullanıcı varsa uid'sini koru (geçmiş kaybolmasın)
      const existing = readLocalUser();
      const guest: AppUser = {
        uid: existing?.uid ?? `local-${Math.random().toString(36).slice(2, 10)}`,
        displayName: name?.trim() || existing?.displayName || "Misafir",
        email: null,
        isAnonymous: true,
        role: "student",
        cloud: false,
      };
      window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(guest));
      setUser(guest);
    },
    [cloud]
  );

  // One-click review login: the demo account in cloud mode, a local admin otherwise.
  const signInDemo = useCallback(async () => {
    if (cloud) {
      const fb = getFirebase();
      if (!fb) throw new Error("Firebase etkin değil");
      if (!DEMO_EMAIL || !DEMO_PASSWORD)
        throw new Error("Demo girişi yapılandırılmamış");
      await signInWithEmailAndPassword(fb.auth, DEMO_EMAIL, DEMO_PASSWORD);
      return;
    }
    const demo: AppUser = {
      uid: "local-demo-egitmen",
      displayName: "Demo Eğitmen",
      email: null,
      isAnonymous: true,
      role: "admin",
      cloud: false,
    };
    window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demo));
    setUser(demo);
  }, [cloud]);

  const signOutUser = useCallback(async () => {
    if (cloud) {
      const fb = getFirebase();
      if (fb) await fbSignOut(fb.auth);
    } else {
      window.localStorage.removeItem(LOCAL_USER_KEY);
      setUser(null);
    }
  }, [cloud]);

  const setLocalName = useCallback(
    (name: string) => {
      if (cloud || !user) return;
      const updated = { ...user, displayName: name || "Misafir" };
      window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      setUser(updated);
    },
    [cloud, user]
  );

  const demoAvailable = cloud ? Boolean(DEMO_EMAIL && DEMO_PASSWORD) : true;

  const value = useMemo(
    () => ({
      user,
      loading,
      cloud,
      signInEmail,
      signUpEmail,
      signInGoogle,
      signInGuest,
      signInDemo,
      demoAvailable,
      signOutUser,
      setLocalName,
    }),
    [
      user,
      loading,
      cloud,
      signInEmail,
      signUpEmail,
      signInGoogle,
      signInGuest,
      signInDemo,
      demoAvailable,
      signOutUser,
      setLocalName,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalıdır");
  return ctx;
}
