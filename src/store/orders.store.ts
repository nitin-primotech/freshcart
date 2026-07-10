import { create } from 'zustand';

import type {
  CartItem,
  Order,
  OrderStatus,
} from '@/features/catalog/types/catalog.types';
import {
  createFirestoreOrder,
  isFirebaseConfigured,
  mapFirestoreOrderToApp,
  subscribeToCustomerOrders,
} from '@/lib/firebase';
import { simulateMutation } from '@/shared/utils/simulate-request';
import { useCatalogStore } from '@/store/catalog.store';
import { useMerchantStore } from '@/store/merchant.store';

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

let ordersUnsubscribe: (() => void) | null = null;

function getRestaurantMeta() {
  const restaurant = useCatalogStore.getState().restaurant;
  return {
    name: restaurant?.name ?? 'FoodRush Kitchen',
    logo: restaurant?.logoImage ?? '',
  };
}

export function startOrdersSync(customerPhone: string | null): void {
  ordersUnsubscribe?.();
  ordersUnsubscribe = null;

  if (!isFirebaseConfigured() || !customerPhone?.trim()) {
    return;
  }

  ordersUnsubscribe = subscribeToCustomerOrders(
    customerPhone,
    (firestoreOrders) => {
      const { name, logo } = getRestaurantMeta();
      const orders = firestoreOrders.map((order) =>
        mapFirestoreOrderToApp(order, name, logo),
      );
      useOrdersStore.setState({ orders });
    },
  );
}

export function stopOrdersSync(): void {
  ordersUnsubscribe?.();
  ordersUnsubscribe = null;
}

export function resetOrders() {
  stopOrdersSync();
  useOrdersStore.setState(initialState);
}

type PlaceOrderInput = {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  address: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
};

export async function placeOrder(input: PlaceOrderInput) {
  useOrdersStore.setState({ isPlacing: true });

  try {
    if (isFirebaseConfigured()) {
      const merchantState = useMerchantStore.getState();
      if (merchantState.ready && !merchantState.isOnline) {
        throw new Error(
          'Restaurant is currently offline. Please try again later.',
        );
      }

      const customerPhone = input.customerPhone?.trim();
      const customerName = input.customerName?.trim() || 'FoodRush Customer';

      if (!customerPhone) {
        throw new Error('Phone number is required to place an order.');
      }

      const orderId = await createFirestoreOrder({
        items: input.items,
        subtotal: input.subtotal,
        deliveryFee: input.deliveryFee,
        tip: input.tip,
        address: input.address,
        customerId: input.customerId ?? customerPhone,
        customerName,
        customerPhone,
      });

      useOrdersStore.setState({
        activeOrderId: orderId,
        isPlacing: false,
      });

      return (
        useOrdersStore
          .getState()
          .orders.find((order) => order.id === orderId) ?? {
          id: orderId,
          restaurantId: input.restaurantId,
          restaurantName: input.restaurantName,
          restaurantLogo: input.restaurantLogo,
          items: input.items,
          subtotal: input.subtotal,
          deliveryFee: input.deliveryFee,
          tip: input.tip,
          total: input.subtotal + input.deliveryFee + input.tip,
          status: 'confirmed' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedDelivery: new Date(
            Date.now() + 35 * 60 * 1000,
          ).toISOString(),
          address: input.address,
        }
      );
    }

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
      updatedAt: new Date().toISOString(),
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
  } catch (error) {
    useOrdersStore.setState({ isPlacing: false });
    throw error;
  }
}

export function advanceOrderStatus(orderId: string) {
  if (isFirebaseConfigured()) {
    return;
  }

  const order = useOrdersStore
    .getState()
    .orders.find((entry) => entry.id === orderId);
  if (!order) return;

  const flow: OrderStatus[] = [
    'confirmed',
    'preparing',
    'ready',
    'on_the_way',
    'delivered',
  ];
  const idx = flow.indexOf(order.status);
  if (idx < flow.length - 1) {
    const next = flow[idx + 1];
    useOrdersStore.setState({
      orders: useOrdersStore
        .getState()
        .orders.map((entry) =>
          entry.id === orderId ? { ...entry, status: next } : entry,
        ),
    });
  }
}

export const selectOrders = (s: OrdersState) => s.orders;
export const selectActiveOrder = (s: OrdersState) =>
  s.orders.find((order) => order.id === s.activeOrderId) ?? null;
export const selectIsPlacing = (s: OrdersState) => s.isPlacing;
