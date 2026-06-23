import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  deriveMrp,
  formatInr,
} from '@/features/checkout/utils/format-currency';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { getTrendingFoodImage } from '@/features/home/utils/trending-food-images';
import { productDetailPath } from '@/features/product/utils/product-path';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticAddToCart, hapticSoftTap } from '@/shared/haptics/feedback';
import {
  addToCart,
  selectCartLineQuantity,
  updateCartQuantity,
  useCartStore,
} from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type TopPicksProductCardProps = {
  dish: RecommendedDish;
  width: number;
  imageIndex: number;
};

function formatPrice(price: number): string {
  return formatInr(price);
}

function formatWeight(calories?: number): string {
  if (calories) return `${calories} cal`;
  return '1 serving';
}

export function TopPicksProductCard({
  dish,
  width,
  imageIndex,
}: TopPicksProductCardProps) {
  const { item, restaurantId, restaurantName } = dish;
  const quantity = useCartStore(selectCartLineQuantity(item.id, restaurantId));
  const originalPrice = deriveMrp(item.price);

  function handleAdd() {
    hapticAddToCart();
    addToCart(item, restaurantId, restaurantName);
  }

  function handleIncrease() {
    hapticSoftTap();
    if (quantity === 0) {
      addToCart(item, restaurantId, restaurantName);
      return;
    }
    updateCartQuantity(item.id, quantity + 1);
  }

  function handleDecrease() {
    hapticSoftTap();
    updateCartQuantity(item.id, quantity - 1);
  }

  return (
    <View style={[styles.card, { width }]}>
      <Link href={productDetailPath(restaurantId, item.id)} asChild>
        <Pressable style={styles.imageWrap} accessibilityRole="link">
          <Image
            source={getTrendingFoodImage(imageIndex)}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        </Pressable>
      </Link>

      <View style={styles.body}>
        <Link href={productDetailPath(restaurantId, item.id)} asChild>
          <Pressable accessibilityRole="link">
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.weight}>{formatWeight(item.calories)}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(item.price)}</Text>
              <Text style={styles.originalPrice}>
                {formatPrice(originalPrice)}
              </Text>
            </View>
          </Pressable>
        </Link>

        {quantity === 0 ? (
          <Pressable
            style={styles.actionBtn}
            onPress={handleAdd}
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name} to cart`}
          >
            <View style={styles.addLabelWrap}>
              <Text style={styles.addLabel}>Add</Text>
            </View>
            <View style={styles.addDivider} />
            <View style={styles.cartIconWrap}>
              <AppSymbol
                name="cart.fill"
                size={11}
                tintColor={colors.textInverse}
              />
            </View>
          </Pressable>
        ) : (
          <View style={styles.actionBtn}>
            <Pressable
              style={styles.stepperHit}
              onPress={handleDecrease}
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
            >
              <Text style={styles.stepperSymbol}>−</Text>
            </Pressable>
            <Text style={styles.stepperQty}>{quantity}</Text>
            <Pressable
              style={styles.stepperHit}
              onPress={handleIncrease}
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
            >
              <Text style={styles.stepperSymbol}>+</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const ACTION_HEIGHT = 30;

const styles = StyleSheet.create({
  card: {
    marginRight: spacing.md,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageWrap: {
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  body: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    gap: 2,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  weight: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  originalPrice: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    height: ACTION_HEIGHT,
    borderCurve: 'continuous',
  },
  addLabelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textInverse,
  },
  addDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  cartIconWrap: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperHit: {
    flex: 1,
    height: ACTION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQty: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textInverse,
    minWidth: 18,
    textAlign: 'center',
  },
  stepperSymbol: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 16,
    color: colors.textInverse,
  },
});
