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
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type PopularProductCardProps = {
  dish: RecommendedDish;
  width: number;
};

export function PopularProductCard({ dish, width }: PopularProductCardProps) {
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
    height: 120,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
    ...shadows.soft,
  },
  imagePress: {
    width: '75%',
    height: '75%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addBtn: {
    position: 'absolute',
    top: spacing.sm,
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
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 17,
    color: colors.textPrimary,
  },
});
