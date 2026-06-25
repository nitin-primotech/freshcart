import { create } from 'zustand';

import type {
  Category,
  Restaurant,
} from '@/features/catalog/types/catalog.types';
import {
  isFirebaseConfigured,
  mapInventoryToCategories,
  mapInventoryToRestaurant,
  subscribeToInventory,
} from '@/lib/firebase';
import type { FirestoreMenuItem } from '@/lib/firebase/types';

type CatalogState = {
  ready: boolean;
  items: FirestoreMenuItem[];
  restaurant: Restaurant | null;
  categories: Category[];
};

const initialState: CatalogState = {
  ready: false,
  items: [],
  restaurant: null,
  categories: [],
};

export const useCatalogStore = create<CatalogState>(() => initialState);

let catalogUnsubscribe: (() => void) | null = null;
let readyResolvers: Array<() => void> = [];

function markCatalogReady() {
  useCatalogStore.setState({ ready: true });
  for (const resolve of readyResolvers) {
    resolve();
  }
  readyResolvers = [];
}

export function startCatalogSync(): void {
  if (!isFirebaseConfigured()) {
    markCatalogReady();
    return;
  }
  if (catalogUnsubscribe) {
    return;
  }

  catalogUnsubscribe = subscribeToInventory((items) => {
    useCatalogStore.setState({
      items,
      categories: mapInventoryToCategories(items),
      restaurant: mapInventoryToRestaurant(items),
      ready: true,
    });
    markCatalogReady();
  });
}

export function stopCatalogSync(): void {
  catalogUnsubscribe?.();
  catalogUnsubscribe = null;
}

export function waitForCatalogReady(): Promise<void> {
  if (!isFirebaseConfigured() || useCatalogStore.getState().ready) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    readyResolvers.push(resolve);
  });
}

export const selectCatalogReady = (state: CatalogState) => state.ready;
export const selectCatalogRestaurant = (state: CatalogState) =>
  state.restaurant;
export const selectCatalogCategories = (state: CatalogState) =>
  state.categories;
