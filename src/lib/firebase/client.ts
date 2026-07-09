import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Firestore, getFirestore } from "firebase/firestore";
import { DEFAULT_FIRESTORE_DATABASE_ID } from "@/lib/firebase/collections";

const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
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
		return app;
	} catch (error) {
		console.error("[Firebase] initialization failed:", error);
		app = null;
		db = null;
		return null;
	}
}

export function getFirestoreDb(): Firestore | null {
	getFirebaseApp();
	return db;
}
