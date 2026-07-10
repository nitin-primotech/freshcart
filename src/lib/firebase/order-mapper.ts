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

const DELIVERY_BUFFER_MIN = 15;

const APP_TO_FIRESTORE_STATUS: Record<OrderStatus, FirestoreOrderStatus> = {
  confirmed: 'placed',
  preparing: 'preparing',
  ready: 'ready_for_pickup',
  on_the_way: 'dispatched',
  delivered: 'delivered',
  cancelled: 'rejected',
};

const FIRESTORE_TO_APP_STATUS: Record<FirestoreOrderStatus, OrderStatus> = {
  placed: 'confirmed',
  preparing: 'preparing',
  ready_for_pickup: 'ready',
  dispatched: 'on_the_way',
  delivered: 'delivered',
  rejected: 'cancelled',
};

export const DEFAULT_DELIVERY_COORDS: [number, number] = [12.9698, 77.75];
export const RESTAURANT_COORDS: [number, number] = [12.9698, 77.75];

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

function computeEstimatedDelivery(order: FirestoreOrder): string {
  const prepMins = order.prepTime ?? 40;
  const prepStart = order.prepStartedAt ?? order.createdAt;
  const prepEnd = prepStart + prepMins * 60 * 1000;

  if (order.status === 'dispatched') {
    const deliveryEta = Date.now() + DELIVERY_BUFFER_MIN * 60 * 1000;
    return new Date(deliveryEta).toISOString();
  }

  if (order.status === 'delivered') {
    return new Date(order.updatedAt).toISOString();
  }

  const eta = prepEnd + DELIVERY_BUFFER_MIN * 60 * 1000;
  return new Date(eta).toISOString();
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

  const rider = order.riderName
    ? {
        name: order.riderName,
        phone: order.riderPhone,
        otp: order.riderOtp,
        avatar: order.riderAvatar,
        rating: 4.8,
      }
    : undefined;

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
    updatedAt: new Date(order.updatedAt).toISOString(),
    estimatedDelivery: computeEstimatedDelivery(order),
    address: `${order.customerName} · ${order.customerPhone}`,
    prepTime: order.prepTime,
    prepStartedAt: order.prepStartedAt
      ? new Date(order.prepStartedAt).toISOString()
      : undefined,
    rider,
    riderCoords:
      order.riderCoords ?? (order.riderName ? RESTAURANT_COORDS : undefined),
    deliveryCoords: order.deliveryCoords,
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
