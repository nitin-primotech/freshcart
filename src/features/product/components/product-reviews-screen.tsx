import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ProductReviewCard } from '@/features/product/components/product-review-card';
import { StarRating } from '@/features/product/components/star-rating';
import { MOCK_PRODUCT_REVIEWS } from '@/features/product/constants/product.constants';
import { getRatingDistribution } from '@/features/product/utils/product-gallery';
import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const RATING_BARS = [5, 4, 3, 2, 1] as const;

export function ProductReviewsScreen() {
  const { itemName, rating, reviewCount } = useLocalSearchParams<{
    itemName?: string;
    rating?: string;
    reviewCount?: string;
  }>();

  const parsedRating = Number(rating) || 4.5;
  const parsedReviewCount = Number(reviewCount) || MOCK_PRODUCT_REVIEWS.length;
  const title = itemName?.trim() || 'This dish';

  const distribution = useMemo(
    () => getRatingDistribution(parsedRating, parsedReviewCount),
    [parsedRating, parsedReviewCount],
  );
  const maxCount = Math.max(
    ...RATING_BARS.map((stars) => distribution[stars]),
    1,
  );

  return (
    <ProfileSubScreenShell
      title="Customer"
      accentTitle="Reviews"
      subtitle={title}
    >
      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.ratingValue}>{parsedRating.toFixed(1)}</Text>
          <StarRating rating={parsedRating} size={13} />
          <Text style={styles.ratingCount}>
            {parsedReviewCount.toLocaleString('en-IN')} ratings
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

      <Text style={styles.sectionTitle}>All reviews</Text>
      <View style={styles.list}>
        {MOCK_PRODUCT_REVIEWS.map((review) => (
          <ProductReviewCard key={review.id} review={review} />
        ))}
      </View>
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  list: {
    gap: spacing.sm,
  },
});
