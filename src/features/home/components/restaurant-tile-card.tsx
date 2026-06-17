import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Restaurant } from '@/features/catalog/types/catalog.types';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type RestaurantTileCardProps = {
  restaurant: Restaurant;
  width: number;
};

export function RestaurantTileCard({
  restaurant,
  width,
}: RestaurantTileCardProps) {
  const offer =
    restaurant.offerLabel ??
    (restaurant.isPromoted ? '40% OFF up to $12' : undefined);

  return (
    <Link href={`/restaurant/${restaurant.id}`} asChild>
      <Pressable style={StyleSheet.flatten([styles.card, { width }])}>
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: restaurant.coverImage }}
            style={styles.image}
            contentFit="cover"
            transition={250}
          />
          <View style={styles.heart} pointerEvents="none">
            <AppSymbol name="heart" size={16} tintColor={colors.textInverse} />
          </View>
          {restaurant.isFastDelivery ? (
            <View style={styles.boltBadge}>
              <PremiumText variant="label" color={colors.textInverse}>
                10 MIN
              </PremiumText>
            </View>
          ) : null}
          {offer ? (
            <View style={styles.offerBar}>
              <PremiumText variant="label" color={colors.textInverse}>
                {offer.toUpperCase()}
              </PremiumText>
            </View>
          ) : null}
        </View>
        <PremiumText variant="bodyMedium" numberOfLines={1} style={styles.name}>
          {restaurant.name}
        </PremiumText>
        <View style={styles.meta}>
          <AppSymbol name="star.fill" size={13} tintColor={colors.star} />
          <PremiumText variant="captionMedium" color={colors.textPrimary}>
            {restaurant.rating.toFixed(1)}
          </PremiumText>
          <PremiumText variant="caption" color={colors.textTertiary}>
            ·
          </PremiumText>
          <PremiumText variant="captionMedium" color={colors.textSecondary}>
            {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} mins
          </PremiumText>
        </View>
        <PremiumText
          variant="caption"
          color={colors.textTertiary}
          numberOfLines={1}
        >
          {restaurant.cuisine.split('·')[0]?.trim()}
        </PremiumText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: spacing.md,
  },
  imageWrap: {
    width: '100%',
    height: 212,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundMuted,
    borderCurve: 'continuous',
    ...shadows.soft,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boltBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  offerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.78)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  name: {
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
});
