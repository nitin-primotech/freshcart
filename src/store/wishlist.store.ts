import { create } from 'zustand';

import type { MenuItem } from '@/features/catalog/types/catalog.types';

export type WishlistProduct = {
  restaurantId: string;
  restaurantName: string;
  rating: number;
  item: MenuItem;
  addedAt: string;
};

type WishlistLastSaved = {
  key: string;
  name: string;
  image: string;
};

type WishlistState = {
  entries: WishlistProduct[];
  lastSaved: WishlistLastSaved | null;
};

export const useWishlistStore = create<WishlistState>(() => ({
  entries: [],
  lastSaved: null,
}));

export function wishlistProductKey(restaurantId: string, itemId: string) {
  return `${restaurantId}:${itemId}`;
}

export function toggleWishlistProduct(
  item: MenuItem,
  restaurantId: string,
  restaurantName: string,
  rating: number,
): boolean {
  const key = wishlistProductKey(restaurantId, item.id);
  const entries = useWishlistStore.getState().entries;
  const exists = entries.some(
    (entry) => entry.restaurantId === restaurantId && entry.item.id === item.id,
  );

  if (exists) {
    useWishlistStore.setState({
      entries: entries.filter(
        (entry) =>
          !(entry.restaurantId === restaurantId && entry.item.id === item.id),
      ),
      lastSaved: null,
    });
    return false;
  }

  useWishlistStore.setState({
    entries: [
      {
        restaurantId,
        restaurantName,
        rating,
        item,
        addedAt: new Date().toISOString(),
      },
      ...entries,
    ],
    lastSaved: {
      key,
      name: item.name,
      image: item.image,
    },
  });
  return true;
}

export function clearLastWishlistSaved() {
  useWishlistStore.setState({ lastSaved: null });
}

export function removeWishlistEntry(key: string) {
  useWishlistStore.setState({
    entries: useWishlistStore
      .getState()
      .entries.filter(
        (entry) =>
          wishlistProductKey(entry.restaurantId, entry.item.id) !== key,
      ),
  });
}

export function clearWishlist() {
  useWishlistStore.setState({ entries: [], lastSaved: null });
}

export const selectWishlistEntries = (s: WishlistState) => s.entries;
export const selectWishlistCount = (s: WishlistState) => s.entries.length;
export const selectLastWishlistSaved = (s: WishlistState) => s.lastSaved;

export const selectIsWishlistedProduct =
  (restaurantId: string, itemId: string) => (s: WishlistState) =>
    s.entries.some(
      (entry) =>
        entry.restaurantId === restaurantId && entry.item.id === itemId,
    );
