import categoriesData from '@/features/catalog/mocks/categories.json';
import promosData from '@/features/catalog/mocks/promos.json';
import restaurantsData from '@/features/catalog/mocks/restaurants.json';
import type {
  Category,
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
