import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import type { Restaurant } from '@/features/catalog/types/catalog.types';
import { formatInr } from '@/features/checkout/utils/format-currency';
import { isHttpImageUrl } from '@/lib/firebase/category-images';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type RestaurantCardProps = {
  restaurant: Restaurant;
  index?: number;
};

export function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`} asChild>
      <AnimatedPressable
        entering={FadeInRight.delay(index * 80).duration(400)}
        style={styles.card}
      >
        {isHttpImageUrl(restaurant.coverImage) ? (
          <Image
            source={{ uri: restaurant.coverImage }}
            style={styles.cover}
            contentFit="cover"
            transition={300}
          />
        ) : null}
        {restaurant.isPromoted ? (
          <View style={styles.promoBadge}>
            <PremiumText variant="label" color={colors.textInverse}>
              Featured
            </PremiumText>
          </View>
        ) : null}
        <View style={styles.body}>
          <View style={styles.row}>
            {isHttpImageUrl(restaurant.logoImage) ? (
              <Image
                source={{ uri: restaurant.logoImage }}
                style={styles.logo}
              />
            ) : null}
            <View style={styles.meta}>
              <PremiumText variant="h3" numberOfLines={1}>
                {restaurant.name}
              </PremiumText>
              <PremiumText
                variant="caption"
                color={colors.textSecondary}
                numberOfLines={1}
              >
                {restaurant.cuisine}
              </PremiumText>
            </View>
            <View style={styles.rating}>
              <AppSymbol name="star.fill" size={14} tintColor={colors.star} />
              <PremiumText variant="captionMedium">
                {restaurant.rating.toFixed(1)}
              </PremiumText>
            </View>
          </View>
          <View style={styles.footer}>
            <PremiumText variant="caption" color={colors.textSecondary}>
              {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min
            </PremiumText>
            <PremiumText variant="caption" color={colors.textTertiary}>
              ·
            </PremiumText>
            <PremiumText variant="caption" color={colors.textSecondary}>
              {restaurant.isFreeDelivery
                ? 'Free delivery'
                : `${formatInr(restaurant.deliveryFee)} delivery`}
            </PremiumText>
          </View>
        </View>
      </AnimatedPressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.backgroundElevated,
    borderCurve: 'continuous',
    ...shadows.card,
  },
  cover: {
    width: '100%',
    height: 160,
  },
  promoBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.backgroundMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
  },
  star: {
    width: 12,
    height: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
