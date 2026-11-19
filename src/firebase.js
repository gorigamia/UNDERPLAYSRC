import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDlwv0aDbUHpfwIfSAe8VS6_BaV36aGwhk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "underplay-radio.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://underplay-radio-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "underplay-radio",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "underplay-radio.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "970078586628",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:970078586628:web:25e3a94b1604b8a8453251"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app, firebaseConfig.databaseURL);
export const auth = getAuth(app);

let authPromise = null;

export async function ensureAuth() {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  if (!authPromise) {
    authPromise = signInAnonymously(auth)
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
