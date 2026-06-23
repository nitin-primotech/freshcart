export const SEARCH_FILTERS = [
  { id: 'top_rated', label: 'Top rated', icon: 'star.fill' },
  { id: 'fastest', label: 'Fastest delivery', icon: 'clock' },
  { id: 'free_delivery', label: 'Free delivery', icon: 'truck.box.fill' },
  { id: 'offers', label: 'Offers', icon: 'tag.fill' },
] as const;

export type SearchFilterId = (typeof SEARCH_FILTERS)[number]['id'];
