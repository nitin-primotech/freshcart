import { create } from 'zustand';

import type {
  CartItem,
  MenuItem,
} from '@/features/catalog/types/catalog.types';

type LastAddedItem = {
  id: string;
  image: string;
};

type CartState = {
  items: CartItem[];
  isSheetOpen: boolean;
  lastAdded: LastAddedItem | null;
};

const initialState: CartState = {
  items: [],
  isSheetOpen: false,
  lastAdded: null,
};

export const useCartStore = create<CartState>(() => initialState);

export function addToCart(
  item: MenuItem,
  restaurantId: string,
  restaurantName: string,
) {
  const { items } = useCartStore.getState();
  const existing = items.find(
    (i) => i.item.id === item.id && i.restaurantId === restaurantId,
  );

  if (items.length > 0 && items[0].restaurantId !== restaurantId) {
    useCartStore.setState({
      items: [{ item, quantity: 1, restaurantId, restaurantName }],
      lastAdded: { id: item.id, image: item.image },
    });
    return;
  }

  if (existing) {
    useCartStore.setState({
      items: items.map((i) =>
        i.item.id === item.id && i.restaurantId === restaurantId
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
      lastAdded: { id: item.id, image: item.image },
    });
    return;
  }

  useCartStore.setState({
    items: [...items, { item, quantity: 1, restaurantId, restaurantName }],
    lastAdded: { id: item.id, image: item.image },
  });
}

export function updateCartQuantity(itemId: string, quantity: number) {
  const { items } = useCartStore.getState();
  if (quantity <= 0) {
    removeFromCart(itemId);
    return;
  }
  useCartStore.setState({
    items: items.map((i) => (i.item.id === itemId ? { ...i, quantity } : i)),
  });
}

export function removeFromCart(itemId: string) {
  useCartStore.setState({
    items: useCartStore.getState().items.filter((i) => i.item.id !== itemId),
  });
}

export function clearCart() {
  useCartStore.setState(initialState);
}

export function openCartSheet() {
  useCartStore.setState({ isSheetOpen: true });
}

export function closeCartSheet() {
  useCartStore.setState({ isSheetOpen: false });
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
