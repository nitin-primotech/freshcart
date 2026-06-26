import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  fetchMenuItemContext,
  getRelatedMenuItems,
} from '@/features/catalog/api/catalog.api';
import {
  deriveDiscountPercent,
  deriveMrp,
  formatInr,
} from '@/features/checkout/utils/format-currency';
import { ProductBoughtTogether } from '@/features/product/components/product-bought-together';
import { ProductImageHero } from '@/features/product/components/product-image-hero';
import { ProductReviewsSection } from '@/features/product/components/product-reviews-section';
import { StarRating } from '@/features/product/components/star-rating';
import {
  formatDeliveryDate,
  formatServingLabel,
  getProductDetailBullets,
  PRODUCT_TRUST_ITEMS,
} from '@/features/product/constants/product.constants';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { CartLineStepper } from '@/shared/components/cart-line-stepper';
import { ErrorState } from '@/shared/components/error-state';
import { Shimmer } from '@/shared/components/shimmer';
import { WishlistToggle } from '@/shared/components/wishlist-toggle';
import {
  hapticAddToCart,
  hapticPrimaryAction,
  hapticSoftTap,
} from '@/shared/haptics/feedback';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import {
  addToCart,
  openCartSheet,
  prepareCheckoutNavigation,
  selectCartItemCount,
  selectCartLineQuantity,
  updateCartQuantity,
  useCartStore,
} from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
}

export function ProductDetailScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { restaurantId, itemId } = useLocalSearchParams<{
    restaurantId: string;
    itemId: string;
  }>();
  const cartCount = useCartStore(selectCartItemCount);
  const [countdown, setCountdown] = useState(2 * 3600 + 15 * 60 + 30);

  const { data, status, error, refetch } = useSimulatedQuery(
    (signal) => fetchMenuItemContext(restaurantId ?? '', itemId ?? '', signal),
    [restaurantId, itemId],
    { enabled: Boolean(restaurantId && itemId) },
  );

  const quantity = useCartStore(
    selectCartLineQuantity(itemId ?? '', restaurantId ?? ''),
  );

  const relatedItems = useMemo(
    () => (data ? getRelatedMenuItems(data.restaurant, data.item.id, 3) : []),
    [data],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (status === 'loading') {
    return (
      <View style={styles.root}>
        <AppStatusBar style="dark" />
        <View style={[styles.loading, { paddingTop: insets.top + spacing.md }]}>
          <Shimmer height={220} borderRadius={14} />
          <Shimmer height={120} borderRadius={14} />
          <Shimmer height={180} borderRadius={14} />
        </View>
      </View>
    );
  }

  if (status === 'error' || !data) {
    return (
      <ErrorState message={error ?? 'Product not found'} onRetry={refetch} />
    );
  }

  const { restaurant, item } = data;
  const mrp = deriveMrp(item.price);
  const discount = deriveDiscountPercent(item.price, mrp);
  const savings = mrp - Math.round(item.price);
  const bullets = getProductDetailBullets(item);

  function handleIncrease() {
    hapticSoftTap();
    if (quantity === 0) {
      addToCart(item, restaurant.id, restaurant.name);
      return;
    }
    updateCartQuantity(item.id, quantity + 1, restaurant.id);
  }

  function handleDecrease() {
    hapticSoftTap();
    if (quantity <= 1) {
      if (quantity === 1) {
        updateCartQuantity(item.id, 0, restaurant.id);
      }
      return;
    }
    updateCartQuantity(item.id, quantity - 1, restaurant.id);
  }

  function handleAddToCart() {
    hapticAddToCart();
    if (quantity === 0) {
      addToCart(item, restaurant.id, restaurant.name);
    }
    openCartSheet();
  }

  function handleBuyNow() {
    hapticPrimaryAction();
    if (quantity === 0) {
      addToCart(item, restaurant.id, restaurant.name);
    }
    prepareCheckoutNavigation(pathname);
    router.push('/checkout');
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <Pressable
          onPress={() => {
            hapticSoftTap();
            router.back();
          }}
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppSymbol
            name="chevron.left"
            size={18}
            tintColor={colors.textPrimary}
          />
        </Pressable>

        <View style={styles.headerActions}>
          <Pressable
            onPress={hapticSoftTap}
            style={styles.headerBtn}
            accessibilityRole="button"
            accessibilityLabel="Share"
          >
            <AppSymbol
              name="square.and.arrow.up"
              size={16}
              tintColor={colors.textPrimary}
            />
          </Pressable>
          <WishlistToggle
            item={item}
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
            rating={restaurant.rating}
            size={18}
            style={styles.headerBtn}
            accessibilityLabel="Add to wishlist"
          />
          <Pressable
            onPress={() => {
              hapticSoftTap();
              openCartSheet();
            }}
            style={styles.headerBtn}
            accessibilityRole="button"
            accessibilityLabel="Open cart"
          >
            <AppSymbol name="cart" size={16} tintColor={colors.textPrimary} />
            {cartCount > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 9 ? '9+' : cartCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 96 },
        ]}
      >
        <View style={styles.hero}>
          <ProductImageHero
            primaryImage={item.image}
            relatedImages={relatedItems.map((entry) => entry.image)}
            discountPercent={discount}
          />

          <View style={styles.infoCol}>
            <Text style={styles.brand}>{restaurant.name}</Text>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.serving}>{formatServingLabel(item)}</Text>

            <View style={styles.ratingChip}>
              <Text style={styles.ratingValue}>
                {restaurant.rating.toFixed(1)}
              </Text>
              <StarRating rating={restaurant.rating} size={13} />
              <Text style={styles.ratingCount}>
                ({restaurant.reviewCount.toLocaleString('en-IN')} ratings)
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatInr(item.price)}</Text>
              <Text style={styles.mrp}>{formatInr(mrp)}</Text>
              {discount > 0 ? (
                <View style={styles.offPill}>
                  <Text style={styles.offText}>{discount}% OFF</Text>
                </View>
              ) : null}
            </View>

            {savings > 0 ? (
              <View style={styles.savingsPill}>
                <AppSymbol
                  name="tag.fill"
                  size={12}
                  tintColor={colors.primary}
                />
                <Text style={styles.savingsText}>
                  You save {formatInr(savings)} on this item
                </Text>
              </View>
            ) : null}

            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryTitle}>
                Delivery by{' '}
                <Text style={styles.deliveryAccent}>
                  {formatDeliveryDate()}
                </Text>
              </Text>
              <Text style={styles.deliveryCountdown}>
                Order within{' '}
                <Text style={styles.deliveryAccent}>
                  {formatCountdown(countdown)}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.trustRow}>
          {PRODUCT_TRUST_ITEMS.map((entry) => (
            <View key={entry.label} style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <AppSymbol
                  name={entry.icon}
                  size={16}
                  tintColor={colors.primary}
                />
              </View>
              <Text style={styles.trustLabel}>{entry.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.description}>{item.description}</Text>
          {bullets.map((bullet) => (
            <View key={bullet} style={styles.bulletRow}>
              <AppSymbol
                name="checkmark.circle.fill"
                size={14}
                tintColor={colors.success}
              />
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>

        <ProductBoughtTogether restaurant={restaurant} items={relatedItems} />

        <ProductReviewsSection
          rating={restaurant.rating}
          reviewCount={restaurant.reviewCount}
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.sm) },
        ]}
      >
        <CartLineStepper
          quantity={quantity > 0 ? quantity : 1}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
        />
        <Pressable
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          accessibilityRole="button"
          accessibilityLabel="Add to cart"
        >
          <AppSymbol name="cart" size={14} tintColor={colors.primary} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
        <Pressable
          style={styles.buyNowBtn}
          onPress={handleBuyNow}
          accessibilityRole="button"
          accessibilityLabel="Buy now"
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  loading: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    lineHeight: 10,
    color: colors.textInverse,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.md,
  },
  infoCol: {
    gap: spacing.xs,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: spacing.xxs,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.18)',
  },
  brand: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  serving: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  ratingValue: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  ratingCount: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  offPill: {
    backgroundColor: 'rgba(212, 84, 60, 0.12)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  offText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.primary,
  },
  savingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginTop: spacing.xs,
  },
  savingsText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
  deliveryCard: {
    marginTop: spacing.sm,
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    padding: spacing.sm,
    gap: 4,
  },
  deliveryTitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  deliveryAccent: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  deliveryCountdown: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  trustIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustLabel: {
    fontFamily: fonts.medium,
    fontSize: 9,
    lineHeight: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    boxShadow: '0 -8px 24px rgba(28, 28, 30, 0.08)',
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    backgroundColor: colors.backgroundElevated,
  },
  addToCartText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.primary,
  },
  buyNowBtn: {
    flex: 1,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textInverse,
  },
});
