import type {
  CartItem,
  Order,
  OrderStatus,
} from '@/features/catalog/types/catalog.types';
import { DEFAULT_MERCHANT_RESTAURANT_ID } from '@/lib/firebase/inventory-mapper';
import type {
  FirestoreOrder,
  FirestoreOrderStatus,
} from '@/lib/firebase/types';

const APP_TO_FIRESTORE_STATUS: Record<OrderStatus, FirestoreOrderStatus> = {
  confirmed: 'placed',
  preparing: 'preparing',
  on_the_way: 'dispatched',
  delivered: 'delivered',
  cancelled: 'rejected',
};

const FIRESTORE_TO_APP_STATUS: Record<FirestoreOrderStatus, OrderStatus> = {
  placed: 'confirmed',
  preparing: 'preparing',
  ready_for_pickup: 'preparing',
  dispatched: 'on_the_way',
  delivered: 'delivered',
  rejected: 'cancelled',
};

export const DEFAULT_DELIVERY_COORDS: [number, number] = [25.5941, 85.1376];

export function mapAppStatusToFirestore(
  status: OrderStatus,
): FirestoreOrderStatus {
  return APP_TO_FIRESTORE_STATUS[status];
}

export function mapFirestoreStatusToApp(
  status: FirestoreOrderStatus,
): OrderStatus {
  return FIRESTORE_TO_APP_STATUS[status];
}

export function mapFirestoreOrderToApp(
  order: FirestoreOrder,
  restaurantName = 'FoodRush Kitchen',
  restaurantLogo = DEFAULT_MERCHANT_RESTAURANT_ID,
): Order {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = Math.max(0, order.totalAmount - subtotal);

  const items: CartItem[] = order.items.map((line) => ({
    quantity: line.quantity,
    restaurantId: DEFAULT_MERCHANT_RESTAURANT_ID,
    restaurantName,
    item: {
      id: line.id,
      name: line.name,
      description: '',
      price: line.price,
      image: '',
    },
  }));

  return {
    id: order.id,
    restaurantId: DEFAULT_MERCHANT_RESTAURANT_ID,
    restaurantName,
    restaurantLogo,
    items,
    subtotal,
    deliveryFee,
    tip: 0,
    total: order.totalAmount,
    status: mapFirestoreStatusToApp(order.status),
    createdAt: new Date(order.createdAt).toISOString(),
    estimatedDelivery: new Date(order.createdAt + 35 * 60 * 1000).toISOString(),
    address: `${order.customerName} · ${order.customerPhone}`,
  };
}

export type CreateFirestoreOrderInput = {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  address: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryCoords?: [number, number];
};

export function mapCartToFirestoreOrder(
  input: CreateFirestoreOrderInput,
): Omit<FirestoreOrder, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    customerId: input.customerId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    items: input.items.map((line) => ({
      id: line.item.id,
      name: line.item.name,
      price: line.item.price,
      quantity: line.quantity,
    })),
    totalAmount: input.subtotal + input.deliveryFee + input.tip,
    status: 'placed',
    deliveryCoords: input.deliveryCoords ?? DEFAULT_DELIVERY_COORDS,
  };
}
