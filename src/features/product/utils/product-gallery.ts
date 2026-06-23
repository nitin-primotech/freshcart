import type { ImageSource } from 'expo-image';

import { getTrendingFoodImage } from '@/features/home/utils/trending-food-images';

export function getProductGalleryImages(
  itemId: string,
  count = 3,
): ImageSource[] {
  const seed = itemId
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return Array.from({ length: count }, (_, index) =>
    getTrendingFoodImage(seed + index),
  );
}

export function getRatingDistribution(
  rating: number,
  reviewCount: number,
): Record<5 | 4 | 3 | 2 | 1, number> {
  const weights = {
    5: Math.max(0.45 + (rating - 4) * 0.35, 0.2),
    4: Math.max(0.28 - (rating - 4) * 0.1, 0.12),
    3: 0.12,
    2: 0.06,
    1: 0.04,
  } as const;

  const totalWeight = Object.values(weights).reduce(
    (sum, value) => sum + value,
    0,
  );

  return {
    5: Math.round((weights[5] / totalWeight) * reviewCount),
    4: Math.round((weights[4] / totalWeight) * reviewCount),
    3: Math.round((weights[3] / totalWeight) * reviewCount),
    2: Math.round((weights[2] / totalWeight) * reviewCount),
    1: Math.max(
      0,
      reviewCount -
        Math.round((weights[5] / totalWeight) * reviewCount) -
        Math.round((weights[4] / totalWeight) * reviewCount) -
        Math.round((weights[3] / totalWeight) * reviewCount) -
        Math.round((weights[2] / totalWeight) * reviewCount),
    ),
  };
}
