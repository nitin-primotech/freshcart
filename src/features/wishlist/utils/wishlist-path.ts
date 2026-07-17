import type { Href } from 'expo-router';

export const WISHLIST_ROUTE = '/profile/wishlist' as const satisfies Href;

export function wishlistPath(): Href {
  return WISHLIST_ROUTE;
}
