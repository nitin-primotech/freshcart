import * as SecureStore from 'expo-secure-store';

import type { WishlistProduct } from '@/store/wishlist.store';

const WISHLIST_KEY = 'freshcart.app.wishlist';

export async function getStoredWishlist(): Promise<WishlistProduct[]> {
  let raw: string | null = null;
  if (process.env.EXPO_OS === 'web') {
    try {
      raw = localStorage.getItem(WISHLIST_KEY);
    } catch {
      // ignore
    }
  } else {
    raw = await SecureStore.getItemAsync(WISHLIST_KEY);
  }

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as WishlistProduct[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry) =>
        entry?.item?.id &&
        entry.restaurantId &&
        typeof entry.item.name === 'string',
    );
  } catch {
    return [];
  }
}

export async function saveWishlist(entries: WishlistProduct[]): Promise<void> {
  const payload = JSON.stringify(entries);
  if (process.env.EXPO_OS === 'web') {
    try {
      localStorage.setItem(WISHLIST_KEY, payload);
    } catch {
      // ignore
    }
  } else {
    await SecureStore.setItemAsync(WISHLIST_KEY, payload);
  }
}

export async function clearStoredWishlist(): Promise<void> {
  if (process.env.EXPO_OS === 'web') {
    try {
      localStorage.removeItem(WISHLIST_KEY);
    } catch {
      // ignore
    }
  } else {
    await SecureStore.deleteItemAsync(WISHLIST_KEY);
  }
}
