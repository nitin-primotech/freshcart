import { create } from 'zustand';

import { USE_MOCK_CATALOG } from '@/features/catalog/constants/catalog-source';
import categoriesData from '@/features/catalog/mocks/categories.json';
import restaurantsData from '@/features/catalog/mocks/restaurants.json';
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
import {
  collectInventoryProductImages,
  collectRestaurantMenuImages,
} from '@/lib/firebase/catalog-images';
import { isHttpImageUrl } from '@/lib/firebase/category-images';
import type { FirestoreMenuItem } from '@/lib/firebase/types';

type CatalogState = {
  ready: boolean;
  items: FirestoreMenuItem[];
  restaurant: Restaurant | null;
  categories: Category[];
  productImages: string[];
};

const initialState: CatalogState = {
  ready: false,
  items: [],
  restaurant: null,
  categories: [],
  productImages: [],
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

function hydrateFromGroceryMocks(): void {
  const restaurants = restaurantsData as Restaurant[];
  const categories = categoriesData as Category[];
  const base = restaurants[0];
  if (!base) {
    useCatalogStore.setState({
      items: [],
      restaurant: null,
      categories,
      productImages: [],
      ready: true,
    });
    markCatalogReady();
    return;
  }

  const menuImages = collectRestaurantMenuImages(base);
  const restaurant: Restaurant = {
    ...base,
    coverImage: menuImages[0] ?? base.coverImage,
    logoImage: menuImages[1] ?? menuImages[0] ?? base.logoImage,
  };

  const productImages = restaurant.menu
    .flatMap((section) => section.items)
    .map((item) => item.image)
    .filter((url) => isHttpImageUrl(url));

  useCatalogStore.setState({
    items: [],
    restaurant,
    categories,
    productImages,
    ready: true,
  });
  markCatalogReady();
}

export function startCatalogSync(): void {
  if (USE_MOCK_CATALOG || !isFirebaseConfigured()) {
    hydrateFromGroceryMocks();
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
      productImages: collectInventoryProductImages(items),
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
  if (
    USE_MOCK_CATALOG ||
    !isFirebaseConfigured() ||
    useCatalogStore.getState().ready
  ) {
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
export const selectCatalogProductImages = (state: CatalogState) =>
  state.productImages;
