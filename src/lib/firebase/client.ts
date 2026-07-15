import AsyncStorage from '@react-native-async-storage/async-storage';
import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import {
  type Auth,
  getAuth,
  initializeAuth,
  type Persistence,
} from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';

import { DEFAULT_FIRESTORE_DATABASE_ID } from '@/lib/firebase/collections';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let initAttempted = false;

export function isFirebaseConfigured(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID?.trim());
}

function getDatabaseId(): string {
  return (
    process.env.EXPO_PUBLIC_FIREBASE_DATABASE_ID?.trim() ||
    DEFAULT_FIRESTORE_DATABASE_ID
  );
}

/**
 * Firebase's web typings omit RN persistence; the RN entrypoint exports it.
 * Metro resolves `firebase/auth` to the react-native build at runtime.
 */
function getReactNativeAuthPersistence(): Persistence {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const authModule = require('firebase/auth') as {
    getReactNativePersistence?: (storage: typeof AsyncStorage) => Persistence;
  };
  if (typeof authModule.getReactNativePersistence !== 'function') {
    throw new Error('React Native Auth persistence is unavailable');
  }
  return authModule.getReactNativePersistence(AsyncStorage);
}

function initAuth(firebaseApp: FirebaseApp): Auth {
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativeAuthPersistence(),
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (initAttempted) {
    return app;
  }
  initAttempted = true;

  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app, getDatabaseId());
    auth = initAuth(app);
    return app;
  } catch (error) {
    console.error('[Firebase] initialization failed:', error);
    app = null;
    auth = null;
    db = null;
    return null;
  }
}

export function getFirestoreDb(): Firestore | null {
  getFirebaseApp();
  return db;
}

export function getFirebaseAuth(): Auth | null {
  getFirebaseApp();
  return auth;
}
