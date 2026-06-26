import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  deriveMrp,
  formatInr,
} from '@/features/checkout/utils/format-currency';
import { productDetailPath } from '@/features/product/utils/product-path';
import { isHttpImageUrl } from '@/lib/firebase/category-images';
import { WishlistToggle } from '@/shared/components/wishlist-toggle';
import type { WishlistProduct } from '@/store/wishlist.store';
import { colors, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type WishlistDishRowProps = {
  entry: WishlistProduct;
};

export function WishlistDishRow({ entry }: WishlistDishRowProps) {
  const { item, restaurantId, restaurantName, rating } = entry;
  const mrp = deriveMrp(item.price);
  const imageUri = isHttpImageUrl(item.image) ? item.image : undefined;

  return (
    <View style={[styles.card, shadows.soft]}>
      <Link href={productDetailPath(restaurantId, item.id)} asChild>
        <Pressable style={styles.pressable} accessibilityRole="link">
          <View style={styles.imageWrap}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                contentFit="cover"
              />
            ) : (
              <View style={styles.imageFallback} />
            )}
          </View>

          <View style={styles.body}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.restaurant} numberOfLines={1}>
              {restaurantName}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatInr(item.price)}</Text>
              <Text style={styles.mrp}>{formatInr(mrp)}</Text>
            </View>
          </View>
        </Pressable>
      </Link>

      <WishlistToggle
        item={item}
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        rating={rating}
        style={styles.heart}
        accessibilityLabel={`Remove ${item.name} from wishlist`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    paddingRight: 48,
  },
  imageWrap: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.backgroundMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundMuted,
  },
  body: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  restaurant: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  heart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
