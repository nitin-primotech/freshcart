import type {
  MenuItem,
  Restaurant,
} from '@/features/catalog/types/catalog.types';

import { isHttpImageUrl } from '@/lib/firebase/category-images';
import type { FirestoreMenuItem } from '@/lib/firebase/types';

export function collectProductImageUrls(
  items: Array<{ image: string; inStock?: boolean }>,
  options?: { inStockOnly?: boolean },
): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];

  for (const item of items) {
    if (options?.inStockOnly && item.inStock === false) {
      continue;
    }
    if (isHttpImageUrl(item.image) && !seen.has(item.image)) {
      seen.add(item.image);
      urls.push(item.image);
    }
  }

  return urls;
}

export function pickProductImageAt(urls: string[], index: number): string {
  if (urls.length === 0) {
    return '';
  }
  const normalized = ((index % urls.length) + urls.length) % urls.length;
  return urls[normalized] ?? '';
}

export function collectRestaurantMenuImages(restaurant: Restaurant): string[] {
  const items = restaurant.menu
    .flatMap((section) => section.items)
    .sort((a, b) => a.id.localeCompare(b.id));

  return collectProductImageUrls(items);
}

export function deriveRestaurantProfileImages(items: FirestoreMenuItem[]): {
  coverImage: string;
  logoImage: string;
} {
  const sorted = [...items]
    .filter((item) => item.inStock)
    .sort((a, b) => a.id.localeCompare(b.id));
  const urls = collectProductImageUrls(sorted);

  return {
    coverImage: urls[0] ?? '',
    logoImage: urls[1] ?? urls[0] ?? '',
  };
}

export function getRelatedProductImages(
  restaurant: Restaurant,
  itemId: string,
  limit = 3,
): string[] {
  const items = restaurant.menu.flatMap((section) => section.items);
  const primary = items.find((item) => item.id === itemId);
  const gallery: string[] = [];

  if (primary && isHttpImageUrl(primary.image)) {
    gallery.push(primary.image);
  }

  for (const item of items) {
    if (gallery.length >= limit) {
      break;
    }
    if (item.id === itemId || !isHttpImageUrl(item.image)) {
      continue;
    }
    if (!gallery.includes(item.image)) {
      gallery.push(item.image);
    }
  }

  return gallery;
}

export function collectInventoryProductImages(
  items: FirestoreMenuItem[],
): string[] {
  return collectProductImageUrls(
    [...items]
      .filter((item) => item.inStock)
      .sort((a, b) => a.id.localeCompare(b.id)),
  );
}

export function enrichWithProductImages<T extends { image: string }>(
  entries: T[],
  productImages: string[],
): T[] {
  return entries.map((entry, index) => ({
    ...entry,
    image: pickProductImageAt(productImages, index),
  }));
}

export function pickFirstProductImage(
  items: FirestoreMenuItem[],
  categoryName: string,
): string {
  const inCategory = items
    .filter((item) => item.category === categoryName)
    .sort((a, b) => a.id.localeCompare(b.id));

  return (
    collectProductImageUrls(inCategory.filter((item) => item.inStock))[0] ??
    collectProductImageUrls(inCategory)[0] ??
    ''
  );
}

export function resolveMenuItemImage(
  item: FirestoreMenuItem,
  categoryImageByName: Map<string, string>,
): string {
  if (isHttpImageUrl(item.image)) {
    return item.image;
  }
  return categoryImageByName.get(item.category) ?? '';
}

export function buildCategoryImageMap(
  items: FirestoreMenuItem[],
): Map<string, string> {
  const names = [...new Set(items.map((item) => item.category))];
  return new Map(
    names.map((name) => [name, pickFirstProductImage(items, name)]),
  );
}

export function mapMenuItemFromFirestore(
  item: FirestoreMenuItem,
  categoryImageByName: Map<string, string>,
): MenuItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    price: item.price,
    image: resolveMenuItemImage(item, categoryImageByName),
    isVegetarian: item.foodType === 'veg',
    isPopular: false,
  };
}
