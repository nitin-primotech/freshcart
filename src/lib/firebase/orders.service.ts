import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/client';
import { FIRESTORE_COLLECTIONS } from '@/lib/firebase/collections';
import type { CreateFirestoreOrderInput } from '@/lib/firebase/order-mapper';
import { mapCartToFirestoreOrder } from '@/lib/firebase/order-mapper';
import type { FirestoreOrder } from '@/lib/firebase/types';

function isFirestoreOrder(value: unknown): value is FirestoreOrder {
  if (!value || typeof value !== 'object') return false;
  const order = value as Record<string, unknown>;
  return (
    typeof order.id === 'string' &&
    typeof order.customerPhone === 'string' &&
    typeof order.totalAmount === 'number' &&
    typeof order.status === 'string' &&
    typeof order.createdAt === 'number' &&
    Array.isArray(order.items)
  );
}

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export function subscribeToCustomerOrders(
  customerKey: string,
  callback: (orders: FirestoreOrder[]) => void,
): () => void {
  const db = getFirestoreDb();
  if (!db || !customerKey.trim()) {
    callback([]);
    return () => {};
  }

  const normalizedKey = customerKey.trim();

  return onSnapshot(
    query(
      collection(db, FIRESTORE_COLLECTIONS.orders),
      orderBy('createdAt', 'desc'),
    ),
    (snapshot) => {
      const orders = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          const candidate = { ...data, id: data.id || docSnap.id };
          return isFirestoreOrder(candidate) ? candidate : null;
        })
        .filter((order): order is FirestoreOrder => order !== null)
        .filter(
          (order) =>
            order.customerPhone === normalizedKey ||
            order.customerId === normalizedKey,
        );
      callback(orders);
    },
    (error) => {
      console.error('[Firestore] orders listener failed:', error);
      callback([]);
    },
  );
}

export async function createFirestoreOrder(
  input: CreateFirestoreOrderInput,
): Promise<string> {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error(
      'Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* to .env and restart Expo.',
    );
  }

  const timestamp = Date.now();
  const id = (6300000000 + Math.floor(Math.random() * 100000000)).toString();
  const payload = mapCartToFirestoreOrder(input);
  const order: FirestoreOrder = {
    ...payload,
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await setDoc(
    doc(db, FIRESTORE_COLLECTIONS.orders, id),
    stripUndefined(order as unknown as Record<string, unknown>),
  );

  return id;
}
