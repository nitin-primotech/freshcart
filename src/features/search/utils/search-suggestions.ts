import type {
  Category,
  Restaurant,
} from '@/features/catalog/types/catalog.types';

export type SearchSuggestionKind =
  | 'recent'
  | 'category'
  | 'restaurant'
  | 'dish';

export type SearchSuggestion = {
  id: string;
  label: string;
  subtitle?: string;
  kind: SearchSuggestionKind;
  icon: string;
  query: string;
  restaurantId?: string;
  categoryId?: string;
  itemId?: string;
};

const MAX_SUGGESTIONS = 8;

export function buildSearchSuggestions(
  query: string,
  recent: string[],
  categories: Category[],
  restaurants: Restaurant[],
): SearchSuggestion[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const suggestions: SearchSuggestion[] = [];
  const seen = new Set<string>();

  function push(suggestion: SearchSuggestion) {
    const key = `${suggestion.kind}:${suggestion.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    suggestions.push(suggestion);
  }

  for (const term of recent) {
    if (!term.toLowerCase().includes(normalized)) continue;
    push({
      id: `recent-${term}`,
      label: term,
      subtitle: 'Recent search',
      kind: 'recent',
      icon: 'clock.arrow.circlepath',
      query: term,
    });
  }

  for (const category of categories) {
    if (!category.name.toLowerCase().includes(normalized)) continue;
    push({
      id: `category-${category.id}`,
      label: category.name,
      subtitle: 'Category',
      kind: 'category',
      icon: 'fork.knife',
      query: category.name,
      categoryId: category.id,
    });
  }

  for (const restaurant of restaurants) {
    const haystack =
      `${restaurant.name} ${restaurant.cuisine} ${restaurant.tagline}`.toLowerCase();
    if (!haystack.includes(normalized)) continue;
    push({
      id: `restaurant-${restaurant.id}`,
      label: restaurant.name,
      subtitle: restaurant.cuisine,
      kind: 'restaurant',
      icon: 'takeoutbag.and.cup.and.straw.fill',
      query: restaurant.name,
      restaurantId: restaurant.id,
    });
  }

  for (const restaurant of restaurants) {
    for (const section of restaurant.menu) {
      for (const item of section.items) {
        if (!item.name.toLowerCase().includes(normalized)) continue;
        push({
          id: `dish-${restaurant.id}-${item.id}`,
          label: item.name,
          subtitle: restaurant.name,
          kind: 'dish',
          icon: 'sparkles',
          query: item.name,
          restaurantId: restaurant.id,
          itemId: item.id,
        });
      }
    }
  }

  return suggestions.slice(0, MAX_SUGGESTIONS);
}

export function countRestaurantsForCategory(
  restaurants: Restaurant[],
  categoryId: string,
): number {
  return restaurants.filter((restaurant) =>
    restaurant.categoryIds.includes(categoryId),
  ).length;
}

export function estimatePriceForTwo(restaurant: Restaurant): number {
  const prices = restaurant.menu.flatMap((section) =>
    section.items.map((item) => item.price),
  );
  if (prices.length === 0) return 250;
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  return Math.round(average * 2);
}
