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
import { ProductCardAddAction } from '@/shared/components/product-card-add-action';
import {
  hapticAddToCart,
  hapticPrimaryAction,
  hapticSoftTap,
} from '@/shared/haptics/feedback';
import {
  addToCart,
  selectCartLineQuantity,
  updateCartQuantity,
  useCartStore,
} from '@/store/cart.store';
import { colors } from '@/theme/colors';
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
    hapticPrimaryAction();
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
    hapticSoftTap();
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
          <Pressable style={styles.imagePress} accessibilityRole="link">
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="contain"
              transition={200}
            />
          </Pressable>
        </Link>
      </View>

      <View style={styles.body}>
        <Link href={productDetailPath(restaurantId, item.id)} asChild>
          <Pressable accessibilityRole="link">
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.unit} numberOfLines={1}>
              {item.description}
            </Text>
          </Pressable>
        </Link>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatUsd(item.price)}</Text>
          {discount > 0 ? (
            <Text style={styles.mrp}>{formatUsd(mrp)}</Text>
          ) : null}
        </View>

        <View style={styles.actionRow}>
          <ProductCardAddAction
            quantity={quantity}
            onAdd={handleAdd}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            itemLabel={item.name}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: spacing.sm,
    borderRadius: 14,
    borderCurve: 'continuous',
    overflow: 'hidden',
    minHeight: 200,
  },
  imageWrap: {
    height: 102,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 2,
    backgroundColor: colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textInverse,
  },
  imagePress: {
    width: '72%',
    height: '80%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: 2,
    gap: spacing.xs,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textPrimary,
    minHeight: 30,
  },
  unit: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginTop: 2,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 13,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  actionRow: {
    marginTop: spacing.xs,
    width: '100%',
  },
});
