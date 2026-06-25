import type {
  Category,
  MenuItem,
  MenuSection,
  Restaurant,
} from '@/features/catalog/types/catalog.types';
import type { FirestoreMenuItem } from '@/lib/firebase/types';

export const DEFAULT_MERCHANT_RESTAURANT_ID = 'foodrush-main';

const DEFAULT_CATEGORY_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80';

const DEFAULT_RESTAURANT_PROFILE: Omit<Restaurant, 'categoryIds' | 'menu'> = {
  id: DEFAULT_MERCHANT_RESTAURANT_ID,
  name: 'FoodRush Kitchen',
  tagline: 'Fresh food, fast delivery',
  cuisine: 'North Indian · Bihari · Street Food',
  rating: 4.7,
  reviewCount: 520,
  deliveryTimeMin: 25,
  deliveryTimeMax: 40,
  deliveryFee: 29,
  distanceKm: 2.1,
  isFreeDelivery: false,
  isPromoted: true,
  offerLabel: 'Free delivery on orders above ₹299',
  isFastDelivery: true,
  coverImage:
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',
  logoImage:
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80',
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function mapFirestoreMenuItem(item: FirestoreMenuItem): MenuItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    price: item.price,
    image: item.image,
    isVegetarian: item.foodType === 'veg',
    isPopular: false,
  };
}

export function mapInventoryToCategories(
  items: FirestoreMenuItem[],
): Category[] {
  const names = [...new Set(items.map((item) => item.category))].sort();

  return names.map((name) => {
    const sample = items.find((item) => item.category === name && item.inStock);
    return {
      id: `cat-${slugify(name)}`,
      name,
      icon: '🍽️',
      image: sample?.image ?? DEFAULT_CATEGORY_IMAGE,
    };
  });
}

export function mapInventoryToRestaurant(
  items: FirestoreMenuItem[],
): Restaurant {
  const categories = mapInventoryToCategories(items);
  const grouped = new Map<string, FirestoreMenuItem[]>();

  for (const item of items) {
    const sectionTitle = item.subcategory?.trim() || item.category;
    const bucket = grouped.get(sectionTitle) ?? [];
    bucket.push(item);
    grouped.set(sectionTitle, bucket);
  }

  const menu: MenuSection[] = [...grouped.entries()].map(
    ([title, sectionItems]) => ({
      id: `sec-${slugify(title)}`,
      title,
      items: sectionItems
        .filter((item) => item.inStock)
        .map((item) => mapFirestoreMenuItem(item)),
    }),
  );

  return {
    ...DEFAULT_RESTAURANT_PROFILE,
    categoryIds: categories.map((category) => category.id),
    menu: menu.filter((section) => section.items.length > 0),
  };
}
