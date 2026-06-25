export { subscribeToInventory } from '@/lib/firebase/catalog.service';
export { getFirestoreDb, isFirebaseConfigured } from '@/lib/firebase/client';
export { FIRESTORE_COLLECTIONS } from '@/lib/firebase/collections';
export {
  DEFAULT_MERCHANT_RESTAURANT_ID,
  mapFirestoreMenuItem,
  mapInventoryToCategories,
  mapInventoryToRestaurant,
} from '@/lib/firebase/inventory-mapper';
export {
  DEFAULT_DELIVERY_COORDS,
  mapFirestoreOrderToApp,
} from '@/lib/firebase/order-mapper';
export {
  createFirestoreOrder,
  subscribeToCustomerOrders,
} from '@/lib/firebase/orders.service';
export { startFirebaseSync, stopFirebaseSync } from '@/lib/firebase/sync';
export type { FirestoreMenuItem, FirestoreOrder } from '@/lib/firebase/types';
