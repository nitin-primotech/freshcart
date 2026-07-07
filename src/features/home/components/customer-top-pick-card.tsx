import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatUsd } from '@/features/checkout/utils/format-currency';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { productDetailPath } from '@/features/product/utils/product-path';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticAddToCart } from '@/shared/haptics/feedback';
import { addToCart } from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
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

  function handleAdd() {
    hapticAddToCart();
    addToCart(item, restaurantId, restaurantName);
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
      </View>

      <View style={styles.body}>
        <Link href={productDetailPath(restaurantId, item.id)} asChild>
          <Pressable>
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

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatUsd(item.price)}</Text>
          <Pressable
            style={styles.addBtn}
            onPress={handleAdd}
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name} to cart`}
          >
            <AppSymbol
              name="plus"
              size={13}
              tintColor={colors.primary}
              weight="semibold"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: spacing.sm,
    minHeight: 210,
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
    justifyContent: 'space-between',
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
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 17,
    color: colors.textPrimary,
    flex: 1,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
