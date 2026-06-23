import type { MenuItem } from '@/features/catalog/types/catalog.types';

export const PRODUCT_TRUST_ITEMS = [
  { icon: 'shield.fill', label: '100% Original Products' },
  { icon: 'truck.box.fill', label: 'On-time Delivery' },
  { icon: 'arrow.2.circlepath', label: 'Easy Returns' },
] as const;

export const MOCK_PRODUCT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Rahul Sharma',
    rating: 5,
    text: 'Fresh, tasty and delivered on time. Will order again.',
    daysAgo: 2,
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Priya Nair',
    rating: 4,
    text: 'Good portion size and packaging was neat.',
    daysAgo: 5,
    verified: true,
  },
] as const;

export function getProductDetailBullets(item: MenuItem): string[] {
  const bullets = [
    item.isVegetarian ? '100% vegetarian option' : 'Freshly prepared on order',
    item.calories
      ? `Rich in flavour · ${item.calories} cal per serving`
      : 'Handcrafted in-house',
    'Packed in food-safe containers',
    'No added preservatives',
  ];

  if (item.isPopular) {
    bullets.unshift('Top pick among customers');
  }

  return bullets;
}

export function formatServingLabel(item: MenuItem): string {
  if (item.calories) return `1 serving · ${item.calories} cal`;
  return '1 serving';
}

export function formatDeliveryDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}
