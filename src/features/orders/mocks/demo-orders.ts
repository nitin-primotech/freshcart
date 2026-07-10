import restaurantsData from '@/features/catalog/mocks/restaurants.json';
import type {
  CartItem,
  Order,
  Restaurant,
} from '@/features/catalog/types/catalog.types';

const restaurant = restaurantsData[0] as Restaurant;
const DEMO_ORDER_IDS = new Set(['fc-12567890', 'fc-12567891', 'fc-12567892']);

function cartLine(itemId: string, quantity: number): CartItem {
  for (const section of restaurant.menu) {
    const item = section.items.find((entry) => entry.id === itemId);
    if (item) {
      return {
        item,
        quantity,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      };
    }
  }
  throw new Error(`Demo menu item not found: ${itemId}`);
}

function buildOrder(
  id: string,
  status: Order['status'],
  items: CartItem[],
  createdAt: string,
  estimatedDelivery: string,
  extras?: Partial<Order>,
): Order {
  const subtotal = items.reduce(
    (sum, line) => sum + line.item.price * line.quantity,
    0,
  );
  const deliveryFee = 2.99;
  const tip = 3;

  return {
    id,
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    restaurantLogo: restaurant.logoImage,
    items,
    subtotal,
    deliveryFee,
    tip,
    total: subtotal + deliveryFee + tip,
    status,
    createdAt,
    updatedAt: estimatedDelivery,
    estimatedDelivery,
    address: '221B Baker Street, New York',
    ...extras,
  };
}

/** Rich demo orders used to populate the My Orders screen in FreshCart demo mode. */
export function getDemoOrders(): Order[] {
  const outForDeliveryItems = [
    cartLine('prod-banana', 2),
    cartLine('prod-milk', 1),
    cartLine('prod-bread', 1),
    cartLine('prod-strawberries', 1),
    cartLine('prod-eggs', 1),
    cartLine('prod-lays', 2),
  ];

  const deliveredItems = [
    cartLine('prod-avocado', 2),
    cartLine('prod-blueberries', 1),
    cartLine('prod-butter', 1),
    cartLine('prod-cheese', 1),
    cartLine('prod-granola', 2),
    cartLine('prod-water', 1),
  ];

  const cancelledItems = [
    cartLine('prod-tomatoes', 1),
    cartLine('prod-carrots', 2),
    cartLine('prod-orange-juice', 1),
  ];

  const deliveryEnd = new Date();
  deliveryEnd.setHours(12, 15, 0, 0);

  return [
    buildOrder(
      'fc-12567890',
      'on_the_way',
      outForDeliveryItems,
      '2024-05-20T10:30:00.000Z',
      deliveryEnd.toISOString(),
      {
        rider: {
          name: 'John Doe',
          rating: 4.9,
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
        },
      },
    ),
    buildOrder(
      'fc-12567891',
      'delivered',
      deliveredItems,
      '2024-05-18T14:15:00.000Z',
      '2024-05-18T15:05:00.000Z',
    ),
    buildOrder(
      'fc-12567892',
      'cancelled',
      cancelledItems,
      '2024-05-15T09:45:00.000Z',
      '2024-05-15T10:00:00.000Z',
    ),
  ];
}

export function isDemoOrderId(id: string): boolean {
  return DEMO_ORDER_IDS.has(id);
}

/** Demo orders always appear first, followed by any real orders. */
export function mergeOrdersWithDemo(orders: Order[]): Order[] {
  const demo = getDemoOrders();
  const storeIds = new Set(orders.map((order) => order.id));
  const uniqueDemo = demo.filter((order) => !storeIds.has(order.id));
  return [...uniqueDemo, ...orders];
}

export function findOrderById(orders: Order[], id: string): Order | undefined {
  return mergeOrdersWithDemo(orders).find((order) => order.id === id);
}
