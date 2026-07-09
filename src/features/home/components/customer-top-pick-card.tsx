import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatUsd } from '@/features/checkout/utils/format-currency';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { productDetailPath } from '@/features/product/utils/product-path';
import { AppSymbol } from '@/shared/components/app-symbol';
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
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type CustomerTopPickCardProps = {
  dish: RecommendedDish;
  width: number;
};

function formatReviewLabel(dish: RecommendedDish): string {
  const seed = dish.item.id.length + dish.item.name.length;
  const count = 400 + seed * 47;
  if (count >= 1000) {
    return `(${Math.round(count / 100) / 10}K)`;
  }
  return `(${count})`;
}

export function CustomerTopPickCard({ dish, width }: CustomerTopPickCardProps) {
  const { item, restaurantId, restaurantName, rating } = dish;
  const quantity = useCartStore(selectCartLineQuantity(item.id, restaurantId));

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
    <View style={[styles.card, { width }]}>
      <View style={styles.imageWrap}>
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
            <Text style={styles.unit} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.ratingRow}>
              <AppSymbol
                name="star.fill"
                size={10}
                tintColor={colors.primary}
                weight="semibold"
              />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
              <Text style={styles.reviews}>{formatReviewLabel(dish)}</Text>
            </View>
          </Pressable>
        </Link>

        <Text style={styles.price}>{formatUsd(item.price)}</Text>

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
    minHeight: 230,
  },
  imageWrap: {
    height: 108,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  imagePress: {
    width: '72%',
    height: '72%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textPrimary,
  },
  unit: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  rating: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textPrimary,
  },
  reviews: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textSecondary,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  actionRow: {
    marginTop: 2,
    width: '100%',
  },
});
