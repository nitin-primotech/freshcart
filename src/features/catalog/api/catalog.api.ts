import categoriesData from '@/features/catalog/mocks/categories.json';
import promosData from '@/features/catalog/mocks/promos.json';
import restaurantsData from '@/features/catalog/mocks/restaurants.json';
import type {
  Category,
  MenuItem,
  Promo,
  Restaurant,
} from '@/features/catalog/types/catalog.types';
import {
  DEFAULT_MERCHANT_RESTAURANT_ID,
  isFirebaseConfigured,
} from '@/lib/firebase';
import { simulateRequest } from '@/shared/utils/simulate-request';
import {
  selectCatalogCategories,
  selectCatalogRestaurant,
  useCatalogStore,
  waitForCatalogReady,
} from '@/store/catalog.store';

const categories = categoriesData as Category[];
const restaurants = restaurantsData as Restaurant[];
const promos = promosData as Promo[];

async function getLiveRestaurant(): Promise<Restaurant> {
  await waitForCatalogReady();
  const restaurant = useCatalogStore.getState().restaurant;
  if (!restaurant) {
    throw new Error('Menu is not available from Firebase yet.');
  }
  return restaurant;
}

async function getLiveCategories(): Promise<Category[]> {
  await waitForCatalogReady();
  return useCatalogStore.getState().categories;
}

export function fetchCategories(signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  if (isFirebaseConfigured()) {
    return getLiveCategories();
  }
  return simulateRequest(categories, { delayMs: 600 });
}

export function fetchPromos(signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  return simulateRequest(promos, { delayMs: 700 });
}

export function fetchRestaurants(signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  if (isFirebaseConfigured()) {
    return getLiveRestaurant().then((restaurant) => [restaurant]);
  }
  return simulateRequest(restaurants, { delayMs: 1000 });
}

export async function fetchRestaurantById(id: string, signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (isFirebaseConfigured()) {
    const restaurant = await getLiveRestaurant();
    if (restaurant.id !== id && id !== DEFAULT_MERCHANT_RESTAURANT_ID) {
      throw new Error('Restaurant not found');
    }
    return restaurant;
  }

  const restaurant = restaurants.find((entry) => entry.id === id);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  return simulateRequest(restaurant, { delayMs: 800 });
}

export type MenuItemContext = {
  restaurant: Restaurant;
  item: MenuItem;
  sectionTitle: string;
};

export async function fetchMenuItemContext(
  restaurantId: string,
  itemId: string,
  signal?: AbortSignal,
) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const restaurant = isFirebaseConfigured()
    ? await getLiveRestaurant()
    : restaurants.find((entry) => entry.id === restaurantId);

  if (!restaurant) {
    throw new Error('Restaurant not found');
  }

  for (const section of restaurant.menu) {
    const item = section.items.find((entry) => entry.id === itemId);
    if (item) {
      if (isFirebaseConfigured()) {
        return { restaurant, item, sectionTitle: section.title };
      }
      return simulateRequest(
        { restaurant, item, sectionTitle: section.title },
        { delayMs: 650 },
      );
    }
  }

  throw new Error('Product not found');
}

export function getRelatedMenuItems(
  restaurant: Restaurant,
  itemId: string,
  limit = 3,
): MenuItem[] {
  const items = restaurant.menu.flatMap((section) => section.items);
  return items
    .filter((entry) => entry.id !== itemId)
    .sort((a, b) => Number(b.isPopular) - Number(a.isPopular))
    .slice(0, limit);
}

export async function searchRestaurants(query: string, signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const source = isFirebaseConfigured()
    ? [await getLiveRestaurant()]
    : restaurants;

  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? source.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(normalized) ||
          restaurant.cuisine.toLowerCase().includes(normalized) ||
          restaurant.tagline.toLowerCase().includes(normalized) ||
          restaurant.menu.some((section) =>
            section.items.some(
              (item) =>
                item.name.toLowerCase().includes(normalized) ||
                item.description.toLowerCase().includes(normalized),
            ),
          ),
      )
    : source;

  if (isFirebaseConfigured()) {
    return results;
  }
  return simulateRequest(results, { delayMs: 700 });
}

export async function fetchCategoryById(id: string, signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const source = isFirebaseConfigured()
    ? useCatalogStore.getState().categories
    : categories;

  if (isFirebaseConfigured() && source.length === 0) {
    await waitForCatalogReady();
  }

  const category = (
    isFirebaseConfigured() ? useCatalogStore.getState().categories : categories
  ).find((entry) => entry.id === id);

  if (!category) {
    throw new Error('Category not found');
  }

  if (isFirebaseConfigured()) {
    return category;
  }
  return simulateRequest(category, { delayMs: 400 });
}

export async function fetchRestaurantsByCategory(
  categoryId: string,
  signal?: AbortSignal,
) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const source = isFirebaseConfigured()
    ? [await getLiveRestaurant()]
    : restaurants;

  const results = source.filter((restaurant) =>
    restaurant.categoryIds.includes(categoryId),
  );

  if (isFirebaseConfigured()) {
    return results;
  }
  return simulateRequest(results, { delayMs: 850 });
}

export function getCatalogSnapshot() {
  return {
    restaurant: useCatalogStore.getState().restaurant,
    categories: useCatalogStore.getState().categories,
  };
}

export { selectCatalogCategories, selectCatalogRestaurant };
