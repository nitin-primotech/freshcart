import type { Restaurant } from '@/features/catalog/types/catalog.types';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { getProductReviewCount } from '@/features/product/utils/product-review-count';

export function searchDishes(
  query: string,
  restaurants: Restaurant[],
  limit = 8,
): RecommendedDish[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const dishes: RecommendedDish[] = [];

  for (const restaurant of restaurants) {
    for (const section of restaurant.menu) {
      for (const item of section.items) {
        const haystack = `${item.name} ${item.description}`.toLowerCase();
        if (!haystack.includes(normalized)) continue;

        dishes.push({
          item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          rating: restaurant.rating,
          reviewCount: getProductReviewCount(
            item.id,
            restaurant.rating,
            restaurant.reviewCount,
          ),
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
