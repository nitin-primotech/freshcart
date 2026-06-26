import type {
  MenuItem,
  Restaurant,
} from '@/features/catalog/types/catalog.types';

export type RecommendedDish = {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
  rating: number;
};

export function getRecommendedDishes(
  restaurants: Restaurant[],
  limit = 8,
): RecommendedDish[] {
  const dishes: RecommendedDish[] = [];

  for (const restaurant of restaurants) {
    for (const section of restaurant.menu) {
      for (const item of section.items) {
        dishes.push({
          item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          rating: restaurant.rating,
        });
      }
    }
  }

  dishes.sort((a, b) => {
    const aPopular = a.item.isPopular ? 1 : 0;
    const bPopular = b.item.isPopular ? 1 : 0;
    if (bPopular !== aPopular) return bPopular - aPopular;
    return b.rating - a.rating;
  });

  return dishes.slice(0, limit);
}

export function getDishesForCategoryIds(
  restaurants: Restaurant[],
  categoryIds: string[],
  limit = 6,
): RecommendedDish[] {
  if (categoryIds.length === 0) return [];

  const idSet = new Set(categoryIds);
  const dishes: RecommendedDish[] = [];

  for (const restaurant of restaurants) {
    if (!restaurant.categoryIds.some((id) => idSet.has(id))) continue;

    for (const section of restaurant.menu) {
      for (const item of section.items) {
        dishes.push({
          item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          rating: restaurant.rating,
        });
      }
    }
  }

  dishes.sort((a, b) => {
    const aPopular = a.item.isPopular ? 1 : 0;
    const bPopular = b.item.isPopular ? 1 : 0;
    if (bPopular !== aPopular) return bPopular - aPopular;
    return b.rating - a.rating;
  });

  return dishes.slice(0, limit);
}

export function getDishesExcluding(
  restaurants: Restaurant[],
  excludeItemIds: Set<string>,
  limit = 6,
  offset = 0,
): RecommendedDish[] {
  const dishes: RecommendedDish[] = [];

  for (const restaurant of restaurants) {
    for (const section of restaurant.menu) {
      for (const item of section.items) {
        if (excludeItemIds.has(item.id)) continue;
        dishes.push({
          item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          rating: restaurant.rating,
        });
      }
    }
  }

  dishes.sort((a, b) => {
    const aPopular = a.item.isPopular ? 1 : 0;
    const bPopular = b.item.isPopular ? 1 : 0;
    if (bPopular !== aPopular) return bPopular - aPopular;
    return b.rating - a.rating;
  });

  return dishes.slice(offset, offset + limit);
}
