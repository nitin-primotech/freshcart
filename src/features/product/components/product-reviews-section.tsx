import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StarRating } from '@/features/product/components/star-rating';
import { MOCK_PRODUCT_REVIEWS } from '@/features/product/constants/product.constants';
import { getRatingDistribution } from '@/features/product/utils/product-gallery';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type ProductReviewsSectionProps = {
  rating: number;
  reviewCount: number;
};

const RATING_BARS = [5, 4, 3, 2, 1] as const;

export function ProductReviewsSection({
  rating,
  reviewCount,
}: ProductReviewsSectionProps) {
  const distribution = useMemo(
    () => getRatingDistribution(rating, reviewCount),
    [rating, reviewCount],
  );
  const maxCount = Math.max(
    ...RATING_BARS.map((stars) => distribution[stars]),
    1,
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Customer Reviews ({reviewCount.toLocaleString('en-IN')})
        </Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
          <StarRating rating={rating} size={13} />
          <Text style={styles.ratingCount}>
            {reviewCount.toLocaleString('en-IN')} ratings
          </Text>
        </View>

        <View style={styles.bars}>
          {RATING_BARS.map((stars) => {
            const count = distribution[stars];
            const fillPercent = Math.max(
              (count / maxCount) * 100,
              count > 0 ? 8 : 0,
            );

            return (
              <View key={stars} style={styles.barRow}>
                <Text style={styles.barLabel}>{stars}</Text>
                <AppSymbol name="star.fill" size={9} tintColor={colors.star} />
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${fillPercent}%` as `${number}%` },
                    ]}
                  />
                </View>
                <Text style={styles.barCount}>
                  {count > 999 ? `${Math.round(count / 1000)}k` : count}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <Text style={styles.topReviews}>Top Reviews</Text>
      {MOCK_PRODUCT_REVIEWS.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {review.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </Text>
            </View>
            <View style={styles.reviewMeta}>
              <Text style={styles.reviewer}>{review.name}</Text>
              <View style={styles.verified}>
                <AppSymbol
                  name="checkmark.circle.fill"
                  size={10}
                  tintColor={colors.success}
                />
                <Text style={styles.verifiedText}>Verified Buyer</Text>
              </View>
            </View>
            <Text style={styles.reviewDate}>{review.daysAgo} days ago</Text>
          </View>
          <StarRating rating={review.rating} size={11} />
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
    flex: 1,
  },
  viewAll: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primary,
  },
  summaryCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  summaryLeft: {
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
  },
  ratingValue: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  ratingCount: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bars: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barLabel: {
    width: 8,
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.textSecondary,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.backgroundMuted,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.star,
  },
  barCount: {
    width: 28,
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 12,
    color: colors.textTertiary,
    textAlign: 'right',
  },
  topReviews: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  reviewCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(212, 84, 60, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primary,
  },
  reviewMeta: {
    flex: 1,
    gap: 2,
  },
  reviewer: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontFamily: fonts.medium,
    fontSize: 9,
    lineHeight: 12,
    color: colors.success,
  },
  reviewDate: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textTertiary,
  },
  reviewText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },
});
