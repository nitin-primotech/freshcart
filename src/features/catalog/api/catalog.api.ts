import { USE_MOCK_CATALOG } from '@/features/catalog/constants/catalog-source';
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
  findCategoryCatalogItem,
  getCategoryCatalogSectionTitle,
  getCategoryIdForCatalogItem,
} from '@/features/category/constants/category-product-catalog';
import {
  DEFAULT_MERCHANT_RESTAURANT_ID,
  isFirebaseConfigured,
} from '@/lib/firebase';
import { collectRestaurantMenuImages } from '@/lib/firebase/catalog-images';
import { isHttpImageUrl } from '@/lib/firebase/category-images';
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

function usesLiveCatalog(): boolean {
  return isFirebaseConfigured() && !USE_MOCK_CATALOG;
}

function deriveMockCategories(): Category[] {
  return categories;
}

function getBannerPromos(): Promo[] {
  return promos.filter((promo) => isHttpImageUrl(promo.image));
}

function deriveRestaurantImages(restaurant: Restaurant): Restaurant {
  const images = collectRestaurantMenuImages(restaurant);
  return {
    ...restaurant,
    coverImage: images[0] ?? '',
    logoImage: images[1] ?? images[0] ?? '',
  };
}

const mockCategories = deriveMockCategories();
const mockPromos = getBannerPromos();
const mockRestaurants = restaurants.map(deriveRestaurantImages);

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
  if (usesLiveCatalog()) {
    return getLiveCategories();
  }
  return simulateRequest(mockCategories, { delayMs: 120, jitterMs: 60 });
}

export function fetchPromos(signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  if (usesLiveCatalog()) {
    return getLivePromos();
  }
  return simulateRequest(mockPromos, { delayMs: 140, jitterMs: 60 });
}

async function getLivePromos(): Promise<Promo[]> {
  await waitForCatalogReady();
  return getBannerPromos();
}

export function fetchRestaurants(signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  if (usesLiveCatalog()) {
    return getLiveRestaurant().then((restaurant) => [restaurant]);
  }
  return simulateRequest(mockRestaurants, { delayMs: 180, jitterMs: 80 });
}

export async function fetchRestaurantById(id: string, signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (usesLiveCatalog()) {
    const restaurant = await getLiveRestaurant();
    if (restaurant.id !== id && id !== DEFAULT_MERCHANT_RESTAURANT_ID) {
      throw new Error('Restaurant not found');
    }
    return restaurant;
  }

  const restaurant = mockRestaurants.find((entry) => entry.id === id);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  return simulateRequest(restaurant, { delayMs: 160, jitterMs: 70 });
}

export type MenuItemContext = {
  restaurant: Restaurant;
  item: MenuItem;
  sectionTitle: string;
};

function findMenuItemInMockCatalog(
  restaurantId: string,
  itemId: string,
): MenuItemContext | null {
  const stores = restaurantId
    ? mockRestaurants.filter((entry) => entry.id === restaurantId)
    : mockRestaurants;

  for (const restaurant of stores.length > 0 ? stores : mockRestaurants) {
    for (const section of restaurant.menu) {
      const item = section.items.find((entry) => entry.id === itemId);
      if (item) {
        return { restaurant, item, sectionTitle: section.title };
      }
    }
  }

  const catalogItem = findCategoryCatalogItem(itemId);
  if (catalogItem) {
    const restaurant =
      mockRestaurants.find((entry) => entry.id === restaurantId) ??
      mockRestaurants[0];
    const categoryId = getCategoryIdForCatalogItem(itemId);
    return {
      restaurant,
      item: catalogItem,
      sectionTitle: getCategoryCatalogSectionTitle(categoryId ?? ''),
    };
  }

  return null;
}

export async function fetchMenuItemContext(
  restaurantId: string,
  itemId: string,
  signal?: AbortSignal,
) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (usesLiveCatalog()) {
    const restaurant = await getLiveRestaurant();
    for (const section of restaurant.menu) {
      const item = section.items.find((entry) => entry.id === itemId);
      if (item) {
        return { restaurant, item, sectionTitle: section.title };
      }
    }
    throw new Error('Product not found');
  }

  const context = findMenuItemInMockCatalog(restaurantId, itemId);
  if (!context) {
    throw new Error('Product not found');
  }

  return simulateRequest(context, { delayMs: 120, jitterMs: 50 });
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

  const source = usesLiveCatalog()
    ? [await getLiveRestaurant()]
    : mockRestaurants;

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

  if (usesLiveCatalog()) {
    return results;
  }
  return simulateRequest(results, { delayMs: 140, jitterMs: 60 });
}

export async function fetchCategoryById(id: string, signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const source = usesLiveCatalog()
    ? useCatalogStore.getState().categories
    : mockCategories;

  if (usesLiveCatalog() && source.length === 0) {
    await waitForCatalogReady();
  }

  const category = (
    usesLiveCatalog() ? useCatalogStore.getState().categories : mockCategories
  ).find((entry) => entry.id === id);

  if (!category) {
    throw new Error('Category not found');
  }

  if (usesLiveCatalog()) {
    return category;
  }
  return simulateRequest(category, { delayMs: 100, jitterMs: 40 });
}

export async function fetchRestaurantsByCategory(
  categoryId: string,
  signal?: AbortSignal,
) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const source = usesLiveCatalog()
    ? [await getLiveRestaurant()]
    : mockRestaurants;

  const results = source.filter((restaurant) =>
    restaurant.categoryIds.includes(categoryId),
  );

  if (usesLiveCatalog()) {
    return results;
  }
  return simulateRequest(results, { delayMs: 160, jitterMs: 70 });
}

export function getCatalogSnapshot() {
  return {
    restaurant: useCatalogStore.getState().restaurant,
    categories: useCatalogStore.getState().categories,
  };
}

export { selectCatalogCategories, selectCatalogRestaurant };
