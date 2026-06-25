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

function deriveMockCategories(): Category[] {
  return categories.map((category) => {
    const restaurant = restaurants.find((entry) =>
      entry.categoryIds.includes(category.id),
    );
    const firstProductImage = restaurant?.menu
      .flatMap((section) => section.items)
      .find((item) => isHttpImageUrl(item.image))?.image;

    return {
      ...category,
      image: firstProductImage ?? '',
    };
  });
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
  if (isFirebaseConfigured()) {
    return getLiveCategories();
  }
  return simulateRequest(mockCategories, { delayMs: 600 });
}

export function fetchPromos(signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  if (isFirebaseConfigured()) {
    return getLivePromos();
  }
  return simulateRequest(mockPromos, { delayMs: 700 });
}

async function getLivePromos(): Promise<Promo[]> {
  await waitForCatalogReady();
  return getBannerPromos();
}

export function fetchRestaurants(signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  if (isFirebaseConfigured()) {
    return getLiveRestaurant().then((restaurant) => [restaurant]);
  }
  return simulateRequest(mockRestaurants, { delayMs: 1000 });
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

  const restaurant = mockRestaurants.find((entry) => entry.id === id);
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
    : mockRestaurants.find((entry) => entry.id === restaurantId);

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
    : mockCategories;

  if (isFirebaseConfigured() && source.length === 0) {
    await waitForCatalogReady();
  }

  const category = (
    isFirebaseConfigured()
      ? useCatalogStore.getState().categories
      : mockCategories
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
    : mockRestaurants;

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
