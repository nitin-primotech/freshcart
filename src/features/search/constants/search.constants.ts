export const SEARCH_TRENDING = [
  {
    id: 'summer',
    name: 'Summer Essentials',
    icon: 'sparkles',
    categoryId: 'cat-beverages',
  },
  {
    id: 'bbq',
    name: 'BBQ Must-Haves',
    icon: 'flame.fill',
    categoryId: 'cat-meat-seafood',
  },
  {
    id: 'healthy',
    name: 'Healthy Snacks',
    icon: 'leaf.fill',
    categoryId: 'cat-snacks',
  },
] as const;

export const SEARCH_FILTERS = [
  { id: 'top_rated', label: 'Top rated', icon: 'star.fill' },
  { id: 'fastest', label: 'Fastest delivery', icon: 'clock' },
  { id: 'free_delivery', label: 'Free delivery', icon: 'truck.box.fill' },
  { id: 'offers', label: 'Offers', icon: 'tag.fill' },
] as const;

export type SearchFilterId = (typeof SEARCH_FILTERS)[number]['id'];
