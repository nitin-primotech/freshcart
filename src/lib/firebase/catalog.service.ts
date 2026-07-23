import { collection, onSnapshot } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/client';
import { FIRESTORE_COLLECTIONS } from '@/lib/firebase/collections';
import { DEFAULT_MERCHANT_RESTAURANT_ID } from '@/lib/firebase/inventory-mapper';
import type { FirestoreMenuItem } from '@/lib/firebase/types';

function isFirestoreMenuItem(value: unknown): value is FirestoreMenuItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    typeof item.foodType === 'string' &&
    typeof item.category === 'string' &&
    typeof item.inStock === 'boolean' &&
    typeof item.image === 'string'
  );
}

function belongsToThisApp(item: FirestoreMenuItem): boolean {
  const merchantId =
    typeof item.merchantId === 'string' ? item.merchantId : undefined;
  // FreshCart only shows explicitly tagged grocery inventory.
  return merchantId === DEFAULT_MERCHANT_RESTAURANT_ID;
}

export function subscribeToInventory(
  callback: (items: FirestoreMenuItem[]) => void,
): () => void {
  const db = getFirestoreDb();
  if (!db) {
    callback([]);
    return () => {};
  }

  return onSnapshot(
    collection(db, FIRESTORE_COLLECTIONS.inventory),
    (snapshot) => {
      const items = snapshot.docs
        .map((docSnap) => {
          const candidate = { id: docSnap.id, ...docSnap.data() };
          return isFirestoreMenuItem(candidate) ? candidate : null;
        })
        .filter((item): item is FirestoreMenuItem => item !== null)
        .filter(belongsToThisApp);
      callback(items);
    },
    (error) => {
      console.error('[Firestore] inventory listener failed:', error);
      callback([]);
    },
  );
}
