// Firebase başlatma — yalnızca gerekli ortam değişkenleri tanımlıysa etkinleşir.
// Anahtarlar yoksa uygulama otomatik olarak "yerel mod"a (localStorage) düşer.
// Bu sayede uygulama, Firebase yapılandırılmadan da eksiksiz çalışır.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Firebase kullanılabilir mi? (Zorunlu anahtarlar tanımlı mı?) */
export const isFirebaseEnabled = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId
);

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

/** Firebase örneklerini (tembel) başlatır. Devre dışıysa null döndürür. */
export function getFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
} | null {
  if (!isFirebaseEnabled) return null;
  if (!_app) {
    _app = getApps().length ? getApp() : initializeApp(config);
    _auth = getAuth(_app);
    _db = getFirestore(_app);
  }
  return { app: _app!, auth: _auth!, db: _db! };
}

/** Yönetici (eğitmen) e-postaları — virgülle ayrılmış ortam değişkeni. */
export function getAdminEmails(): string[] {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}
