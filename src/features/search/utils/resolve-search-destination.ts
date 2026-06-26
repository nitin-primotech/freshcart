import type {
  Category,
  Restaurant,
} from '@/features/catalog/types/catalog.types';

export type SearchDestination =
  | { type: 'category'; categoryId: string; label: string }
  | { type: 'restaurant'; restaurantId: string; label: string }
  | { type: 'product'; restaurantId: string; itemId: string; label: string }
  | { type: 'query'; query: string };

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function findCategory(
  term: string,
  categories: Category[],
): Category | undefined {
  const normalized = normalize(term);
  return (
    categories.find((category) => normalize(category.name) === normalized) ??
    categories.find((category) => normalize(category.name).includes(normalized))
  );
}

function findRestaurant(
  term: string,
  restaurants: Restaurant[],
): Restaurant | undefined {
  const normalized = normalize(term);
  return (
    restaurants.find(
      (restaurant) => normalize(restaurant.name) === normalized,
    ) ??
    restaurants.find((restaurant) =>
      normalize(restaurant.name).includes(normalized),
    )
  );
}

function findDish(
  term: string,
  restaurants: Restaurant[],
): { restaurant: Restaurant; itemId: string; name: string } | undefined {
  const normalized = normalize(term);
  const matches: {
    restaurant: Restaurant;
    itemId: string;
    name: string;
    isPopular: boolean;
  }[] = [];

  for (const restaurant of restaurants) {
    for (const section of restaurant.menu) {
      for (const item of section.items) {
        const itemName = normalize(item.name);
        if (itemName === normalized || itemName.includes(normalized)) {
          matches.push({
            restaurant,
            itemId: item.id,
            name: item.name,
            isPopular: Boolean(item.isPopular),
          });
        }
      }
    }
  }

  if (matches.length === 0) return undefined;

  matches.sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
  const best = matches[0];
  return {
    restaurant: best.restaurant,
    itemId: best.itemId,
    name: best.name,
  };
}

export function resolveSearchDestination(
  term: string,
  categories: Category[],
  restaurants: Restaurant[],
): SearchDestination {
  const trimmed = term.trim();
  if (!trimmed) {
    return { type: 'query', query: '' };
  }

  const category = findCategory(trimmed, categories);
  if (category && normalize(category.name) === normalize(trimmed)) {
    return {
      type: 'category',
      categoryId: category.id,
      label: category.name,
    };
  }

  const dish = findDish(trimmed, restaurants);
  if (dish && normalize(dish.name) === normalize(trimmed)) {
    return {
      type: 'product',
      restaurantId: dish.restaurant.id,
      itemId: dish.itemId,
      label: dish.name,
    };
  }

  const restaurant = findRestaurant(trimmed, restaurants);
  if (restaurant && normalize(restaurant.name) === normalize(trimmed)) {
    return {
      type: 'restaurant',
      restaurantId: restaurant.id,
      label: restaurant.name,
    };
  }

  if (category) {
    return {
      type: 'category',
      categoryId: category.id,
      label: category.name,
    };
  }

  if (dish) {
    return {
      type: 'product',
      restaurantId: dish.restaurant.id,
      itemId: dish.itemId,
      label: dish.name,
    };
  }

  if (restaurant) {
    return {
      type: 'restaurant',
      restaurantId: restaurant.id,
      label: restaurant.name,
    };
  }

  return { type: 'query', query: trimmed };
}
