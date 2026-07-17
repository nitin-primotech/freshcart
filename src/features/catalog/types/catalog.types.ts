export type Category = {
  id: string;
  name: string;
  icon: string;
  image: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  calories?: number;
};

export type MenuSection = {
  id: string;
  title: string;
  items: MenuItem[];
};

export type Restaurant = {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  distanceKm: number;
  isFreeDelivery?: boolean;
  isPromoted?: boolean;
  offerLabel?: string;
  isFastDelivery?: boolean;
  coverImage: string;
  logoImage: string;
  categoryIds: string[];
  menu: MenuSection[];
};

export type Promo = {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  gradient: [string, string];
  image: string;
};

export type CartItem = {
  item: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  note?: string;
};

export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export type OrderRider = {
  name: string;
  phone?: string;
  otp?: number;
  avatar?: string;
  rating?: number;
};

export type Order = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  address: string;
  prepTime?: number;
  prepStartedAt?: string;
  rider?: OrderRider;
  riderCoords?: [number, number];
  deliveryCoords?: [number, number];
};

export type DeliveryAddress = {
  label: string;
  line1: string;
  line2: string;
  flatOrHouse?: string;
  landmark?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};
