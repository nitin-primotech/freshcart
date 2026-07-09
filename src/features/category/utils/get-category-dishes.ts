import type { Restaurant } from "@/features/catalog/types/catalog.types";
import type { RecommendedDish } from "@/features/home/utils/get-recommended-dishes";

export function getCategoryDishes(
	restaurants: Restaurant[],
	categoryId: string,
	limit = 24,
): RecommendedDish[] {
	const dishes: RecommendedDish[] = [];

	for (const restaurant of restaurants) {
		if (!restaurant.categoryIds.includes(categoryId)) continue;

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
