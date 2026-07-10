import type { UserPreferences } from '@/features/auth/types/user-preferences.types';
import type {
  Category,
  Restaurant,
} from '@/features/catalog/types/catalog.types';

function restaurantHasVegOptions(restaurant: Restaurant): boolean {
  return restaurant.menu.some((section) =>
    section.items.some((item) => item.isVegetarian),
  );
}

function restaurantHasNonVegOptions(restaurant: Restaurant): boolean {
  return restaurant.menu.some((section) =>
    section.items.some((item) => !item.isVegetarian),
  );
}

export function getPersonalizedRestaurants(
  restaurants: Restaurant[],
  preferences: UserPreferences,
): Restaurant[] {
  if (preferences.skipped && preferences.cuisineIds.length === 0) {
    return restaurants;
  }

  let list = [...restaurants];

  if (preferences.dietary === 'veg' || preferences.dietary === 'vegan') {
    list = list.filter(restaurantHasVegOptions);
  } else if (preferences.dietary === 'non_veg') {
    list = list.filter(restaurantHasNonVegOptions);
  }

  if (preferences.cuisineIds.length === 0) {
    return list.length > 0 ? list : restaurants;
  }

  const categoryIds = new Set(preferences.cuisineIds);

  const matched = list.filter((restaurant) =>
    restaurant.categoryIds.some((id) => categoryIds.has(id)),
  );

  const rest = list.filter(
    (restaurant) => !restaurant.categoryIds.some((id) => categoryIds.has(id)),
  );

  return [...matched, ...rest];
}

export function getPersonalizedSectionTitle(
  preferences: UserPreferences,
  categories: Category[] = [],
): string {
  if (preferences.skipped || preferences.cuisineIds.length === 0) {
    return 'Recommended for you';
  }

  const firstId = preferences.cuisineIds[0];
  const match = categories.find((category) => category.id === firstId);
  return match ? `Because you like ${match.name}` : 'Picked for you';
}
