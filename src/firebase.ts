import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredConfigKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const;

const missingConfigKeys = requiredConfigKeys.filter((key) => !firebaseConfig[key]);

export const isFirebaseConfigured = missingConfigKeys.length === 0;

export const firebaseApp = (() => {
  if (!isFirebaseConfigured) {
    console.warn(
      `Firebase is not configured. Missing env vars for: ${missingConfigKeys.join(", ")}. ` +
        "Copy .env.example to .env.local and fill in the VITE_FIREBASE_* values.",
    );
    return null;
  }

  try {
    return initializeApp(firebaseConfig);
  } catch (error) {
    console.warn("Firebase failed to initialize. The site will render without Firebase features.", error);
    return null;
  }
})();

export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage: FirebaseStorage | null = firebaseApp ? getStorage(firebaseApp) : null;

export function requireFirebaseService<T>(service: T | null, serviceName: string): T {
  if (!service) {
    throw new Error(
      `${serviceName} is not configured. Add the VITE_FIREBASE_* values to .env.local and restart the dev server.`,
    );
  }

  return service;
}
