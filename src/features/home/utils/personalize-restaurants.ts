import {
  CUISINE_CATEGORY_MAP,
  CUISINE_OPTIONS,
} from '@/features/auth/constants/personalization';
import type { UserPreferences } from '@/features/auth/types/onboarding.types';
import type { Restaurant } from '@/features/catalog/types/catalog.types';

const VEG_FRIENDLY_CATEGORY_IDS = new Set(['cat-2', 'cat-4', 'cat-6']);

export function getPersonalizedRestaurants(
  restaurants: Restaurant[],
  preferences: UserPreferences,
): Restaurant[] {
  if (preferences.skipped && preferences.cuisineIds.length === 0) {
    return restaurants;
  }

  let list = [...restaurants];

  if (preferences.dietary === 'veg' || preferences.dietary === 'vegan') {
    list = list.filter((r) =>
      r.categoryIds.some((id) => VEG_FRIENDLY_CATEGORY_IDS.has(id)),
    );
  }

  if (preferences.cuisineIds.length === 0) {
    return list.length > 0 ? list : restaurants;
  }

  const categoryIds = new Set(
    preferences.cuisineIds
      .map((id) => CUISINE_CATEGORY_MAP[id])
      .filter(Boolean),
  );

  const matched = list.filter((r) =>
    r.categoryIds.some((id) => categoryIds.has(id)),
  );

  const rest = list.filter(
    (r) => !r.categoryIds.some((id) => categoryIds.has(id)),
  );

  return [...matched, ...rest];
}

export function getPersonalizedSectionTitle(
  preferences: UserPreferences,
): string {
  if (preferences.skipped || preferences.cuisineIds.length === 0) {
    return 'Recommended for you';
  }
  const firstId = preferences.cuisineIds[0];
  const match = CUISINE_OPTIONS.find((c) => c.id === firstId);
  return match ? `Because you like ${match.label}` : 'Picked for you';
}
