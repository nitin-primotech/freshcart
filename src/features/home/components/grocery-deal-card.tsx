import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  deriveDiscountPercent,
  deriveMrp,
  formatUsd,
} from '@/features/checkout/utils/format-currency';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { productDetailPath } from '@/features/product/utils/product-path';
import { AnimatedCartAction } from '@/shared/components/animated-cart-action';
import { hapticAddToCart } from '@/shared/haptics/feedback';
import {
  addToCart,
  selectCartLineQuantity,
  updateCartQuantity,
  useCartStore,
} from '@/store/cart.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const CARD_BACKGROUNDS = ['#E8F5E9', '#FFF8E1', '#FCE4EC', '#E3F2FD'] as const;

type GroceryDealCardProps = {
  dish: RecommendedDish;
  width: number;
  index: number;
};

export function GroceryDealCard({ dish, width, index }: GroceryDealCardProps) {
  const { item, restaurantId, restaurantName } = dish;
  const quantity = useCartStore(selectCartLineQuantity(item.id, restaurantId));
  const mrp = deriveMrp(item.price);
  const discount = deriveDiscountPercent(item.price, mrp);
  const bgColor = CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length];

  function handleAdd() {
    addToCart(item, restaurantId, restaurantName);
  }

  function handleIncrease() {
    hapticAddToCart();
    if (quantity === 0) {
      addToCart(item, restaurantId, restaurantName);
      return;
    }
    updateCartQuantity(item.id, quantity + 1, restaurantId);
  }

  function handleDecrease() {
    updateCartQuantity(item.id, quantity - 1, restaurantId);
  }

  return (
    <View style={[styles.card, { width, backgroundColor: bgColor }]}>
      <View style={styles.imageWrap}>
        {discount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{discount}% OFF</Text>
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
        <View style={styles.actionWrap}>
          <AnimatedCartAction
            quantity={quantity}
            onAdd={handleAdd}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            itemLabel={item.name}
          />
        </View>
      </View>

      <Link href={productDetailPath(restaurantId, item.id)} asChild>
        <Pressable style={styles.meta}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.unit} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatUsd(item.price)}</Text>
            {discount > 0 ? (
              <Text style={styles.mrp}>{formatUsd(mrp)}</Text>
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
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    overflow: 'hidden',
    ...shadows.soft,
  },
  imageWrap: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 2,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textInverse,
  },
  imagePress: {
    width: '80%',
    height: '80%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionWrap: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
  },
  meta: {
    padding: spacing.sm,
    gap: 2,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  unit: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
});
