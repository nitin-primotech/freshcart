export const CUISINE_OPTIONS = [
  {
    id: 'burgers',
    label: 'Burgers & Grill',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    categoryId: 'cat-1',
  },
  {
    id: 'sushi',
    label: 'Sushi & Japanese',
    image:
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80',
    categoryId: 'cat-2',
  },
  {
    id: 'pizza',
    label: 'Pizza & Italian',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    categoryId: 'cat-3',
  },
  {
    id: 'healthy',
    label: 'Healthy Bowls',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    categoryId: 'cat-4',
  },
  {
    id: 'desserts',
    label: 'Desserts',
    image:
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80',
    categoryId: 'cat-5',
  },
  {
    id: 'coffee',
    label: 'Coffee & Café',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    categoryId: 'cat-6',
  },
  {
    id: 'biryani',
    label: 'Biryani & Indian',
    image:
      'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&q=80',
    categoryId: 'cat-1',
  },
  {
    id: 'street',
    label: 'Street Food',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    categoryId: 'cat-1',
  },
] as const;

export const DIETARY_OPTIONS = [
  { id: 'veg' as const, label: 'Veg only', icon: 'leaf.fill' },
  { id: 'non_veg' as const, label: 'Non-veg', icon: 'flame.fill' },
  { id: 'vegan' as const, label: 'Vegan', icon: 'heart.fill' },
  { id: 'eggetarian' as const, label: 'Eggetarian', icon: 'circle.fill' },
] as const;

export const CUISINE_CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  CUISINE_OPTIONS.map((c) => [c.id, c.categoryId]),
);
