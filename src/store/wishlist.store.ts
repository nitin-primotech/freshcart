import { create } from 'zustand';
import type { MenuItem } from '@/features/catalog/types/catalog.types';
import {
  clearStoredWishlist,
  getStoredWishlist,
  saveWishlist,
} from '@/features/wishlist/services/wishlist-storage';

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

export async function hydrateWishlist() {
  const entries = await getStoredWishlist();
  useWishlistStore.setState({ entries });
}

async function persistWishlist(entries: WishlistProduct[]) {
  await saveWishlist(entries);
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
    const nextEntries = entries.filter(
      (entry) =>
        !(entry.restaurantId === restaurantId && entry.item.id === item.id),
    );
    useWishlistStore.setState({
      entries: nextEntries,
      lastSaved: null,
    });
    void persistWishlist(nextEntries);
    return false;
  }

  const nextEntries = [
    {
      restaurantId,
      restaurantName,
      rating,
      item,
      addedAt: new Date().toISOString(),
    },
    ...entries,
  ];
  useWishlistStore.setState({
    entries: nextEntries,
    lastSaved: {
      key,
      name: item.name,
      image: item.image,
    },
  });
  void persistWishlist(nextEntries);
  return true;
}

export function clearLastWishlistSaved() {
  useWishlistStore.setState({ lastSaved: null });
}

export function removeWishlistEntry(key: string) {
  const nextEntries = useWishlistStore
    .getState()
    .entries.filter(
      (entry) => wishlistProductKey(entry.restaurantId, entry.item.id) !== key,
    );
  useWishlistStore.setState({ entries: nextEntries });
  void persistWishlist(nextEntries);
}

export function clearWishlist() {
  useWishlistStore.setState({ entries: [], lastSaved: null });
  void clearStoredWishlist();
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
