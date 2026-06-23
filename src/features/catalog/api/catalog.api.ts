import categoriesData from '@/features/catalog/mocks/categories.json';
import promosData from '@/features/catalog/mocks/promos.json';
import restaurantsData from '@/features/catalog/mocks/restaurants.json';
import type {
  Category,
  MenuItem,
  Promo,
  Restaurant,
} from '@/features/catalog/types/catalog.types';
import { simulateRequest } from '@/shared/utils/simulate-request';

const categories = categoriesData as Category[];
const restaurants = restaurantsData as Restaurant[];
const promos = promosData as Promo[];

export function fetchCategories(signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
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
  return simulateRequest(restaurants, { delayMs: 1000 });
}

export function fetchRestaurantById(id: string, signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  const restaurant = restaurants.find((r) => r.id === id);
  if (!restaurant) {
    return Promise.reject(new Error('Restaurant not found'));
  }
  return simulateRequest(restaurant, { delayMs: 800 });
}

export type MenuItemContext = {
  restaurant: Restaurant;
  item: MenuItem;
  sectionTitle: string;
};

export function fetchMenuItemContext(
  restaurantId: string,
  itemId: string,
  signal?: AbortSignal,
) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  const restaurant = restaurants.find((entry) => entry.id === restaurantId);
  if (!restaurant) {
    return Promise.reject(new Error('Restaurant not found'));
  }

  for (const section of restaurant.menu) {
    const item = section.items.find((entry) => entry.id === itemId);
    if (item) {
      return simulateRequest(
        { restaurant, item, sectionTitle: section.title },
        { delayMs: 650 },
      );
    }
  }

  return Promise.reject(new Error('Product not found'));
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

export function searchRestaurants(query: string, signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(normalized) ||
          r.cuisine.toLowerCase().includes(normalized) ||
          r.tagline.toLowerCase().includes(normalized),
      )
    : restaurants;
  return simulateRequest(results, { delayMs: 700 });
}

export function fetchCategoryById(id: string, signal?: AbortSignal) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  const category = categories.find((c) => c.id === id);
  if (!category) {
    return Promise.reject(new Error('Category not found'));
  }
  return simulateRequest(category, { delayMs: 400 });
}

export function fetchRestaurantsByCategory(
  categoryId: string,
  signal?: AbortSignal,
) {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  const results = restaurants.filter((r) => r.categoryIds.includes(categoryId));
  return simulateRequest(results, { delayMs: 850 });
}
