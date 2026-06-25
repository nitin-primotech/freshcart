export type FirestoreOrderStatus =
  | 'placed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'dispatched'
  | 'delivered'
  | 'rejected';

export type FirestoreOrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type FirestoreOrder = {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: FirestoreOrderItem[];
  totalAmount: number;
  status: FirestoreOrderStatus;
  createdAt: number;
  updatedAt: number;
  deliveryCoords: [number, number];
  riderCoords?: [number, number];
  prepTime?: number;
  prepStartedAt?: number;
};

export type FirestoreMenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  foodType: 'veg' | 'non-veg' | 'egg';
  serviceType: string;
  category: string;
  subcategory?: string;
  inStock: boolean;
  image: string;
  packagingCharge?: number;
  customisable?: boolean;
  backInStockTime?: number;
};
