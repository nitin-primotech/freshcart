/** Stable per-product review count derived from item id and rating. */
export function getProductReviewCount(
  itemId: string,
  rating = 4.2,
  restaurantReviewCount?: number,
): number {
  let hash = 0;
  for (const char of itemId) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  const spread = 52 + (hash % 948);
  const ratingBoost = 0.88 + (rating / 5) * 0.24;

  if (restaurantReviewCount != null && restaurantReviewCount > 0) {
    const cap = Math.max(52, Math.round(restaurantReviewCount * 0.35));
    return Math.min(cap, Math.round(spread * ratingBoost));
  }

  return Math.round(spread * ratingBoost);
}
