import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Restaurant } from '@/features/catalog/types/catalog.types';
import { isHttpImageUrl } from '@/lib/firebase/category-images';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const CARD_RADIUS = 14;
const IMAGE_HEIGHT = 132;

type RestaurantTileCardProps = {
  restaurant: Restaurant;
  width: number;
  flush?: boolean;
};

export function RestaurantTileCard({
  restaurant,
  width,
  flush = false,
}: RestaurantTileCardProps) {
  const offer =
    restaurant.offerLabel ??
    (restaurant.isPromoted ? '40% OFF up to ₹99' : undefined);

  return (
    <View style={[styles.card, flush && styles.cardFlush, { width }]}>
      <View style={styles.imageWrap}>
        <Link href={`/restaurant/${restaurant.id}`} asChild>
          <Pressable style={styles.imagePressable} accessibilityRole="link">
            {isHttpImageUrl(restaurant.coverImage) ? (
              <Image
                source={{ uri: restaurant.coverImage }}
                style={styles.image}
                contentFit="cover"
                transition={250}
              />
            ) : null}
          </Pressable>
        </Link>
        {restaurant.isFastDelivery ? (
          <View style={styles.fastBadge}>
            <Text style={styles.fastBadgeText}>Fast</Text>
          </View>
        ) : null}
        {offer ? (
          <View style={styles.offerBar}>
            <Text style={styles.offerText} numberOfLines={1}>
              {offer.toUpperCase()}
            </Text>
          </View>
        ) : null}
      </View>

      <Link href={`/restaurant/${restaurant.id}`} asChild>
        <Pressable style={styles.body} accessibilityRole="link">
          <View style={styles.titleRow}>
            {isHttpImageUrl(restaurant.logoImage) ? (
              <Image
                source={{ uri: restaurant.logoImage }}
                style={styles.logo}
                contentFit="cover"
                transition={200}
              />
            ) : null}
            <View style={styles.titleCopy}>
              <Text style={styles.name} numberOfLines={1}>
                {restaurant.name}
              </Text>
              <Text style={styles.cuisine} numberOfLines={1}>
                {restaurant.cuisine}
              </Text>
            </View>
          </View>

          <View style={styles.meta}>
            <AppSymbol name="star.fill" size={11} tintColor={colors.star} />
            <Text style={styles.metaText}>{restaurant.rating.toFixed(1)}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>
              {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} mins
            </Text>
            {restaurant.isFreeDelivery ? (
              <>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaHighlight}>Free delivery</Text>
              </>
            ) : null}
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: spacing.md,
    backgroundColor: colors.backgroundElevated,
    borderRadius: CARD_RADIUS,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardFlush: {
    marginRight: 0,
  },
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: colors.backgroundMuted,
  },
  imagePressable: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fastBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 8,
    borderCurve: 'continuous',
  },
  fastBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textInverse,
    letterSpacing: 0.2,
  },
  offerBar: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    backgroundColor: 'rgba(28, 28, 30, 0.82)',
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderCurve: 'continuous',
  },
  offerText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textInverse,
    letterSpacing: 0.3,
  },
  body: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
  },
  titleCopy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  cuisine: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    marginTop: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 3,
  },
  metaText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  metaDot: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textTertiary,
  },
  metaHighlight: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.success,
  },
});
