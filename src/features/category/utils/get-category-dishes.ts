import type { Restaurant } from '@/features/catalog/types/catalog.types';
import {
  getCategoryCatalogProducts,
  getCategoryCatalogRestaurantId,
} from '@/features/category/constants/category-product-catalog';
import { menuSectionMatchesCategory } from '@/features/category/utils/category-section-map';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { getProductReviewCount } from '@/features/product/utils/product-review-count';

function catalogDishesForCategory(
  categoryId: string,
  rating: number,
  reviewCount: number,
): RecommendedDish[] {
  const restaurantId = getCategoryCatalogRestaurantId();
  const restaurantName = 'FreshCart';

  return getCategoryCatalogProducts(categoryId).map((item) => ({
    item,
    restaurantId,
    restaurantName,
    rating,
    reviewCount: getProductReviewCount(item.id, rating, reviewCount),
  }));
}

export function getCategoryDishes(
  restaurants: Restaurant[],
  categoryId: string,
  limit = 48,
): RecommendedDish[] {
  const primaryRestaurant = restaurants[0];
  const rating = primaryRestaurant?.rating ?? 4.8;
  const reviewCount = primaryRestaurant?.reviewCount ?? 12480;

  const catalogDishes = catalogDishesForCategory(
    categoryId,
    rating,
    reviewCount,
  );
  const menuDishes: RecommendedDish[] = [];

  for (const restaurant of restaurants) {
    if (!restaurant.categoryIds.includes(categoryId)) continue;

    for (const section of restaurant.menu) {
      if (!menuSectionMatchesCategory(section.id, categoryId)) continue;

      for (const item of section.items) {
        menuDishes.push({
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

  const seen = new Set<string>();
  const merged: RecommendedDish[] = [];

  for (const dish of [...catalogDishes, ...menuDishes]) {
    if (seen.has(dish.item.id)) continue;
    seen.add(dish.item.id);
    merged.push(dish);
  }

  merged.sort((a, b) => {
    const aPopular = a.item.isPopular ? 1 : 0;
    const bPopular = b.item.isPopular ? 1 : 0;
    if (bPopular !== aPopular) return bPopular - aPopular;
    return b.rating - a.rating;
  });

  return merged.slice(0, limit);
}
