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

type PopularProductCardProps = {
  dish: RecommendedDish;
  width: number;
  addPosition?: 'top-right' | 'bottom-right';
  outlinedAdd?: boolean;
  showDescription?: boolean;
};

export function PopularProductCard({
  dish,
  width,
  addPosition = 'top-right',
  outlinedAdd = false,
  showDescription = false,
}: PopularProductCardProps) {
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

  const addBtnStyle = [
    styles.addBtn,
    addPosition === 'bottom-right' ? styles.addBtnBottom : styles.addBtnTop,
    outlinedAdd ? styles.addBtnOutlined : styles.addBtnSolid,
  ];

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
        {addPosition === 'top-right' ? (
          <Pressable
            style={addBtnStyle}
            onPress={handleAdd}
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name} to cart`}
          >
            <AppSymbol
              name="plus"
              size={12}
              tintColor={outlinedAdd ? colors.primary : colors.textInverse}
              weight="semibold"
            />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Link href={productDetailPath(restaurantId, item.id)} asChild>
          <Pressable style={styles.meta}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            {showDescription ? (
              <Text style={styles.unit} numberOfLines={1}>
                {item.description}
              </Text>
            ) : null}
            <Text style={styles.price}>{formatUsd(item.price)}</Text>
          </Pressable>
        </Link>

        {addPosition === 'bottom-right' ? (
          <Pressable
            style={addBtnStyle}
            onPress={handleAdd}
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name} to cart`}
          >
            <AppSymbol
              name="plus"
              size={12}
              tintColor={outlinedAdd ? colors.primary : colors.textInverse}
              weight="semibold"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: spacing.sm,
  },
  imageWrap: {
    height: 96,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    position: 'relative',
  },
  imagePress: {
    width: '70%',
    height: '70%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addBtn: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnTop: {
    top: spacing.xs,
    right: spacing.xs,
  },
  addBtnBottom: {
    position: 'relative',
    top: undefined,
    right: undefined,
    flexShrink: 0,
    alignSelf: 'flex-end',
  },
  addBtnSolid: {
    backgroundColor: colors.primary,
  },
  addBtnOutlined: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  meta: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textPrimary,
  },
  unit: {
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textSecondary,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 14,
    color: colors.textPrimary,
    marginTop: 1,
  },
});
