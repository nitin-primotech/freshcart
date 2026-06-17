import { create } from 'zustand';

import type {
  CartItem,
  Order,
  OrderStatus,
} from '@/features/catalog/types/catalog.types';
import { simulateMutation } from '@/shared/utils/simulate-request';

type OrdersState = {
  orders: Order[];
  activeOrderId: string | null;
  isPlacing: boolean;
};

const initialState: OrdersState = {
  orders: [],
  activeOrderId: null,
  isPlacing: false,
};

export const useOrdersStore = create<OrdersState>(() => initialState);

type PlaceOrderInput = {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  address: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
};

export async function placeOrder(input: PlaceOrderInput) {
  useOrdersStore.setState({ isPlacing: true });

  const total = input.subtotal + input.deliveryFee + input.tip;
  const order: Order = {
    id: `ord-${Date.now()}`,
    restaurantId: input.restaurantId,
    restaurantName: input.restaurantName,
    restaurantLogo: input.restaurantLogo,
    items: input.items,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    tip: input.tip,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    address: input.address,
  };

  await simulateMutation(order);

  useOrdersStore.setState((state) => ({
    orders: [order, ...state.orders],
    activeOrderId: order.id,
    isPlacing: false,
  }));

  return order;
}

export function advanceOrderStatus(orderId: string) {
  const order = useOrdersStore.getState().orders.find((o) => o.id === orderId);
  if (!order) return;

  const flow: OrderStatus[] = [
    'confirmed',
    'preparing',
    'on_the_way',
    'delivered',
  ];
  const idx = flow.indexOf(order.status);
  if (idx < flow.length - 1) {
    const next = flow[idx + 1];
    useOrdersStore.setState({
      orders: useOrdersStore
        .getState()
        .orders.map((o) => (o.id === orderId ? { ...o, status: next } : o)),
    });
  }
}

export const selectOrders = (s: OrdersState) => s.orders;
export const selectActiveOrder = (s: OrdersState) =>
  s.orders.find((o) => o.id === s.activeOrderId) ?? null;
export const selectIsPlacing = (s: OrdersState) => s.isPlacing;
