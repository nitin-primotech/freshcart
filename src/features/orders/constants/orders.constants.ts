import type { OrderStatus } from '@/features/catalog/types/catalog.types';

export type OrderTabId =
  | 'all'
  | 'to_pay'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export const ORDER_TABS: { id: OrderTabId; label: string }[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'to_pay', label: 'To Pay' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

export type OrderStatusUi = {
  label: string;
  icon: string;
  color: string;
  bg: string;
};

export const ORDER_STATUS_UI: Record<OrderStatus, OrderStatusUi> = {
  confirmed: {
    label: 'Processing',
    icon: 'clock',
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.12)',
  },
  preparing: {
    label: 'Processing',
    icon: 'clock',
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.12)',
  },
  ready: {
    label: 'Ready',
    icon: 'shippingbox.fill',
    color: '#D4543C',
    bg: 'rgba(212, 84, 60, 0.12)',
  },
  on_the_way: {
    label: 'Shipped',
    icon: 'truck.box.fill',
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.12)',
  },
  delivered: {
    label: 'Delivered',
    icon: 'checkmark.circle.fill',
    color: '#2D6A4F',
    bg: 'rgba(45, 106, 79, 0.12)',
  },
  cancelled: {
    label: 'Cancelled',
    icon: 'xmark.circle.fill',
    color: '#B91C1C',
    bg: 'rgba(185, 28, 28, 0.12)',
  },
};

export function formatOrderId(orderId: string): string {
  const compact = orderId.replace(/\D/g, '').slice(-8).padStart(8, '0');
  return `#ORD${compact}`;
}

export function formatOrderDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDeliveryLine(
  status: OrderStatus,
  estimatedDelivery: string,
): string {
  const date = new Date(estimatedDelivery).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (status === 'delivered') return `Delivered on ${date}`;
  return `Arriving by ${date}`;
}

export function countOrderItems(items: { quantity: number }[]): number {
  return items.reduce((sum, line) => sum + line.quantity, 0);
}

export function formatPlacedOn(iso: string): string {
  const date = new Date(iso);
  return `Placed on ${date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`;
}

export function formatEstimatedWindow(
  estimatedDelivery: string,
  options?: {
    prepStartedAt?: string;
    prepTime?: number;
    status?: OrderStatus;
  },
): string {
  const eta = new Date(estimatedDelivery);
  const now = new Date();
  const isToday =
    eta.getDate() === now.getDate() &&
    eta.getMonth() === now.getMonth() &&
    eta.getFullYear() === now.getFullYear();
  const dayLabel = isToday
    ? 'Today'
    : eta.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  if (
    options?.status === 'preparing' &&
    options.prepStartedAt &&
    options.prepTime
  ) {
    const prepEnd = new Date(
      new Date(options.prepStartedAt).getTime() + options.prepTime * 60 * 1000,
    );
    const deliveryStart = prepEnd;
    const deliveryEnd = eta;
    return `${dayLabel}, ${formatTime(deliveryStart)} - ${formatTime(deliveryEnd)}`;
  }

  const start = new Date(eta.getTime() - 15 * 60 * 1000);
  return `${dayLabel}, ${formatTime(start)} - ${formatTime(eta)}`;
}

export function formatMinutesUntil(iso: string): string | null {
  const target = new Date(iso).getTime();
  const diffMins = Math.max(0, Math.round((target - Date.now()) / 60000));
  if (diffMins <= 0) return 'Arriving soon';
  return `${diffMins} min`;
}

export type TrackingStepState = 'done' | 'active' | 'pending' | 'cancelled';

export const TRACKING_STEPS = [
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    description: 'Your order has been confirmed',
    icon: 'checkmark',
  },
  {
    key: 'preparing',
    label: 'Being Prepared',
    description: 'Restaurant is preparing your food',
    icon: 'flame.fill',
  },
  {
    key: 'packed',
    label: 'Packed',
    description: 'Your items are packed and ready to ship',
    icon: 'shippingbox.fill',
  },
  {
    key: 'dispatched',
    label: 'Dispatched',
    description: 'Order handed to delivery partner',
    icon: 'truck.box.fill',
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Rider is on the way to you',
    icon: 'bicycle',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Enjoy your meal!',
    icon: 'checkmark.circle.fill',
  },
] as const;

export const CANCELLED_TRACKING_STEP = {
  key: 'cancelled',
  label: 'Order Cancelled',
  description: 'This order was cancelled and will not be delivered',
  icon: 'xmark.circle.fill',
} as const;

export const TRACKING_STATUS_BADGE: Record<OrderStatus, OrderStatusUi> = {
  confirmed: {
    label: 'Confirmed',
    icon: 'checkmark',
    color: '#D4543C',
    bg: 'rgba(212, 84, 60, 0.12)',
  },
  preparing: {
    label: 'Preparing',
    icon: 'flame.fill',
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.12)',
  },
  ready: {
    label: 'Packed',
    icon: 'shippingbox.fill',
    color: '#D4543C',
    bg: 'rgba(212, 84, 60, 0.12)',
  },
  on_the_way: {
    label: 'In transit',
    icon: 'truck.box.fill',
    color: '#D4543C',
    bg: 'rgba(212, 84, 60, 0.12)',
  },
  delivered: {
    label: 'Delivered',
    icon: 'checkmark.circle.fill',
    color: '#2D6A4F',
    bg: 'rgba(45, 106, 79, 0.12)',
  },
  cancelled: {
    label: 'Cancelled',
    icon: 'xmark.circle.fill',
    color: '#B91C1C',
    bg: 'rgba(185, 28, 28, 0.12)',
  },
};

export function getCancelledProgressIndex(
  timestamps: TrackingTimestamps,
): number {
  if (!timestamps.prepStartedAt) {
    return 0;
  }
  return 1;
}

export function resolveTrackingStepState(
  stepIndex: number,
  status: OrderStatus,
  timestamps?: TrackingTimestamps,
): TrackingStepState {
  if (status === 'cancelled') {
    const progress = timestamps ? getCancelledProgressIndex(timestamps) : 0;
    if (stepIndex <= progress) {
      return 'done';
    }
    return 'pending';
  }
  if (status === 'delivered') return 'done';

  const activeIndex: Record<OrderStatus, number> = {
    confirmed: 0,
    preparing: 1,
    ready: 2,
    on_the_way: 4,
    delivered: 5,
    cancelled: 0,
  };

  const active = activeIndex[status];

  if (stepIndex < active) return 'done';
  if (status === 'on_the_way' && stepIndex === 3) return 'done';
  if (stepIndex === active) return 'active';
  return 'pending';
}

export function formatCancelledOn(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export type TrackingTimestamps = {
  createdAt: string;
  prepStartedAt?: string;
  prepTime?: number;
  updatedAt: string;
};

export function formatTrackingStepTime(
  stepKey:
    | (typeof TRACKING_STEPS)[number]['key']
    | typeof CANCELLED_TRACKING_STEP.key,
  state: TrackingStepState,
  timestamps: TrackingTimestamps,
): string | null {
  if (state === 'pending') return null;

  const format = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  switch (stepKey) {
    case 'confirmed':
      return format(timestamps.createdAt);
    case 'preparing':
      return timestamps.prepStartedAt
        ? format(timestamps.prepStartedAt)
        : format(timestamps.createdAt);
    case 'packed':
      if (timestamps.prepStartedAt && timestamps.prepTime) {
        return format(
          new Date(
            new Date(timestamps.prepStartedAt).getTime() +
              timestamps.prepTime * 60 * 1000,
          ).toISOString(),
        );
      }
      return timestamps.updatedAt ? format(timestamps.updatedAt) : null;
    case 'dispatched':
    case 'out_for_delivery':
      return timestamps.updatedAt ? format(timestamps.updatedAt) : null;
    case 'delivered':
      return timestamps.updatedAt ? format(timestamps.updatedAt) : null;
    case 'cancelled':
      return timestamps.updatedAt ? format(timestamps.updatedAt) : null;
    default:
      return null;
  }
}
