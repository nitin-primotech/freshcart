import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatUsd } from '@/features/checkout/utils/format-currency';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { productDetailPath } from '@/features/product/utils/product-path';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticAddToCart } from '@/shared/haptics/feedback';
import {
  addToCart,
  selectCartLineQuantity,
  updateCartQuantity,
  useCartStore,
} from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type BestSellerCardProps = {
  dish: RecommendedDish;
  width: number;
  showBadge?: boolean;
};

export function BestSellerCard({
  dish,
  width,
  showBadge = true,
}: BestSellerCardProps) {
  const { item, restaurantId, restaurantName } = dish;
  const quantity = useCartStore(selectCartLineQuantity(item.id, restaurantId));

  function handleAdd() {
    hapticAddToCart();
    if (quantity === 0) {
      addToCart(item, restaurantId, restaurantName);
      return;
    }
    updateCartQuantity(item.id, quantity + 1, restaurantId);
  }

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.imageWrap}>
        {showBadge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Bestseller</Text>
          </View>
        ) : null}
        <Link href={productDetailPath(restaurantId, item.id)} asChild>
          <Pressable style={styles.imagePress}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="contain"
              transition={200}
            />
          </Pressable>
        </Link>
        <Pressable
          style={styles.addBtn}
          onPress={handleAdd}
          accessibilityRole="button"
          accessibilityLabel={`Add ${item.name} to cart`}
        >
          <AppSymbol
            name="plus"
            size={14}
            tintColor={colors.textInverse}
            weight="semibold"
          />
        </Pressable>
      </View>

      <Link href={productDetailPath(restaurantId, item.id)} asChild>
        <Pressable style={styles.meta}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.unit} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.price}>{formatUsd(item.price)}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: spacing.md,
  },
  imageWrap: {
    height: 128,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
    overflow: 'visible',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 2,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textInverse,
  },
  imagePress: {
    width: '88%',
    height: '88%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addBtn: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    gap: 2,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  unit: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 17,
    color: colors.textPrimary,
    marginTop: spacing.xxs,
  },
});
