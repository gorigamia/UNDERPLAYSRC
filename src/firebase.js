import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.databaseURL
);

let app = null;
let database = null;
let firebaseAuth = null;

if (isFirebaseConfigured) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  database = getDatabase(app, firebaseConfig.databaseURL);
  firebaseAuth = getAuth(app);
}

export const db = database;
export const auth = firebaseAuth;

let authPromise = null;

export async function ensureAuth() {
  if (!firebaseAuth) return null;
  if (firebaseAuth.currentUser) {
    return firebaseAuth.currentUser;
  }
  if (!authPromise) {
    authPromise = signInAnonymously(firebaseAuth)
      .then((cred) => cred.user)
      .catch((err) => {
        console.warn("Autenticação anônima Firebase:", err.message || err);
        return null;
      })
      .finally(() => {
        authPromise = null;
      });
  }
  return authPromise;
}
