import categoriesData from '@/features/catalog/mocks/categories.json';
import restaurantsData from '@/features/catalog/mocks/restaurants.json';
import type {
  Category,
  Restaurant,
} from '@/features/catalog/types/catalog.types';
import { collectRestaurantMenuImages } from '@/lib/firebase/catalog-images';
import { isHttpImageUrl } from '@/lib/firebase/category-images';

const STARTUP_IMAGE_LIMIT = 28;

const mockCategories = categoriesData as Category[];
const mockRestaurants = (restaurantsData as Restaurant[]).map((restaurant) => {
  const images = collectRestaurantMenuImages(restaurant);
  return {
    ...restaurant,
    coverImage: images[0] ?? '',
    logoImage: images[1] ?? images[0] ?? '',
  };
});

function collectStartupImageUrls(
  categories: Category[],
  restaurants: Restaurant[],
  limit = STARTUP_IMAGE_LIMIT,
): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];

  function add(url: string) {
    if (!isHttpImageUrl(url) || seen.has(url) || urls.length >= limit) {
      return;
    }
    seen.add(url);
    urls.push(url);
  }

  for (const category of categories) {
    add(category.image);
  }

  for (const restaurant of restaurants) {
    add(restaurant.coverImage);
    add(restaurant.logoImage);
    for (const section of restaurant.menu) {
      for (const item of section.items) {
        add(item.image);
        if (urls.length >= limit) {
          return urls;
        }
      }
    }
  }

  return urls;
}

/** Lightweight startup prefetch list — avoids pulling catalog API / Firebase at boot. */
export function getStartupCatalogImageUrls(
  limit = STARTUP_IMAGE_LIMIT,
): string[] {
  return collectStartupImageUrls(mockCategories, mockRestaurants, limit);
}
