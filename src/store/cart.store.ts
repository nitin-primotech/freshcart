import { type Href, router } from 'expo-router';
import { create } from 'zustand';

import type {
  CartItem,
  MenuItem,
} from '@/features/catalog/types/catalog.types';

export function cartLineKey(restaurantId: string, itemId: string) {
  return `${restaurantId}:${itemId}`;
}

type LastAddedItem = {
  lineKey: string;
  image: string;
};

type CartState = {
  items: CartItem[];
  isSheetOpen: boolean;
  isEmptyPromptOpen: boolean;
  lastAdded: LastAddedItem | null;
  /** Up to 3 unique cart lines for floating preview, oldest → newest. */
  previewLineKeys: string[];
  /** Route pathname when checkout was opened — used for back navigation. */
  checkoutOrigin: string | null;
  reopenCartOnCheckoutBack: boolean;
};

const initialState: CartState = {
  items: [],
  isSheetOpen: false,
  isEmptyPromptOpen: false,
  lastAdded: null,
  previewLineKeys: [],
  checkoutOrigin: null,
  reopenCartOnCheckoutBack: false,
};

export const useCartStore = create<CartState>(() => initialState);

function touchPreviewKey(
  keys: string[],
  restaurantId: string,
  itemId: string,
): string[] {
  const key = cartLineKey(restaurantId, itemId);
  return [...keys.filter((k) => k !== key), key].slice(-3);
}

function commitAdd(
  item: MenuItem,
  restaurantId: string,
  restaurantName: string,
  items: CartItem[],
) {
  const lineKey = cartLineKey(restaurantId, item.id);
  const existing = items.find(
    (line) => line.item.id === item.id && line.restaurantId === restaurantId,
  );
  const previewLineKeys = touchPreviewKey(
    useCartStore.getState().previewLineKeys,
    restaurantId,
    item.id,
  );

  if (existing) {
    useCartStore.setState({
      items: items.map((line) =>
        line.item.id === item.id && line.restaurantId === restaurantId
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      ),
      lastAdded: { lineKey, image: item.image },
      previewLineKeys,
    });
    return;
  }

  useCartStore.setState({
    items: [...items, { item, quantity: 1, restaurantId, restaurantName }],
    lastAdded: { lineKey, image: item.image },
    previewLineKeys,
  });
}

export function addToCart(
  item: MenuItem,
  restaurantId: string,
  restaurantName: string,
) {
  const { items } = useCartStore.getState();
  commitAdd(item, restaurantId, restaurantName, items);
}

export function updateCartQuantity(
  itemId: string,
  quantity: number,
  restaurantId?: string,
) {
  const { items } = useCartStore.getState();
  if (quantity <= 0) {
    removeFromCart(itemId, restaurantId);
    return;
  }
  useCartStore.setState({
    items: items.map((line) =>
      restaurantId
        ? line.item.id === itemId && line.restaurantId === restaurantId
          ? { ...line, quantity }
          : line
        : line.item.id === itemId
          ? { ...line, quantity }
          : line,
    ),
  });
}

export function removeFromCart(itemId: string, restaurantId?: string) {
  const { items, previewLineKeys } = useCartStore.getState();
  const nextItems = items.filter((line) =>
    restaurantId
      ? !(line.item.id === itemId && line.restaurantId === restaurantId)
      : line.item.id !== itemId,
  );
  useCartStore.setState({
    items: nextItems,
    previewLineKeys: previewLineKeys.filter((key) =>
      nextItems.some(
        (line) => cartLineKey(line.restaurantId, line.item.id) === key,
      ),
    ),
    ...(nextItems.length === 0 ? { isSheetOpen: false } : {}),
  });
}

export function clearCart() {
  useCartStore.setState(initialState);
}

export function openCartSheet() {
  const { items } = useCartStore.getState();
  if (items.length === 0) {
    useCartStore.setState({ isEmptyPromptOpen: true, isSheetOpen: false });
    return;
  }
  useCartStore.setState({ isSheetOpen: false, isEmptyPromptOpen: false });
  router.push('/checkout');
}

export function closeCartSheet() {
  useCartStore.setState({ isSheetOpen: false });
}

export function closeEmptyCartPrompt() {
  useCartStore.setState({ isEmptyPromptOpen: false });
}

/** Call immediately before router.push('/checkout'). */
export function prepareCheckoutNavigation(originPath: string) {
  useCartStore.setState({
    checkoutOrigin: originPath,
    reopenCartOnCheckoutBack: false,
    isSheetOpen: false,
    isEmptyPromptOpen: false,
  });
}

export function handleCheckoutBack(router: {
  back: () => void;
  canGoBack: () => boolean;
  replace: (href: Href) => void;
}) {
  const { checkoutOrigin } = useCartStore.getState();
  useCartStore.setState({
    checkoutOrigin: null,
    reopenCartOnCheckoutBack: false,
    isSheetOpen: false,
  });

  if (router.canGoBack()) {
    router.back();
  } else if (checkoutOrigin) {
    router.replace(checkoutOrigin as Href);
  }
}

export function clearLastAdded() {
  useCartStore.setState({ lastAdded: null });
}

export const selectLastAdded = (s: CartState) => s.lastAdded;

export const selectCartItems = (s: CartState) => s.items;
export const selectCartItemCount = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
export const selectCartRestaurantId = (s: CartState) =>
  s.items.length > 0 ? s.items[0].restaurantId : null;
export const selectIsSheetOpen = (s: CartState) => s.isSheetOpen;
export const selectIsEmptyPromptOpen = (s: CartState) => s.isEmptyPromptOpen;

type CartPreviewThumb = {
  id: string;
  image: string;
};

/** Up to 3 unique item thumbnails in add order; newest on the right / on top. */
export function selectCartPreviewThumbs(s: CartState): CartPreviewThumb[] {
  const fromPreview = s.previewLineKeys
    .map((key) =>
      s.items.find(
        (line) => cartLineKey(line.restaurantId, line.item.id) === key,
      ),
    )
    .filter((line): line is CartItem => line != null)
    .map((line) => ({
      id: cartLineKey(line.restaurantId, line.item.id),
      image: line.item.image,
    }));

  if (fromPreview.length > 0 || s.items.length === 0) {
    return fromPreview;
  }

  const seen = new Set<string>();
  const fallback: CartPreviewThumb[] = [];
  for (const line of s.items) {
    const key = cartLineKey(line.restaurantId, line.item.id);
    if (seen.has(key)) continue;
    seen.add(key);
    fallback.push({ id: key, image: line.item.image });
  }
  return fallback.slice(-3);
}

let previewThumbsCache: CartPreviewThumb[] = [];
let previewThumbsKey = '';

/** Stable reference when preview thumbs unchanged — avoids re-render loops. */
export function selectCartPreviewThumbsStable(
  s: CartState,
): CartPreviewThumb[] {
  const next = selectCartPreviewThumbs(s);
  const key = s.previewLineKeys.join('|');
  if (key === previewThumbsKey) {
    return previewThumbsCache;
  }
  previewThumbsKey = key;
  previewThumbsCache = next;
  return previewThumbsCache;
}

export function selectCartLineQuantity(itemId: string, restaurantId: string) {
  return (s: CartState) =>
    s.items.find(
      (line) => line.item.id === itemId && line.restaurantId === restaurantId,
    )?.quantity ?? 0;
}
