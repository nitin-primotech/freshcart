import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchMenuItemContext } from '@/features/catalog/api/catalog.api';
import {
  deriveDiscountPercent,
  deriveMrp,
  formatInr,
} from '@/features/checkout/utils/format-currency';
import {
  ProductFooterStepper,
  productFooterControlHeight,
} from '@/features/product/components/product-footer-stepper';
import { ProductImageGalleryModal } from '@/features/product/components/product-image-gallery-modal';
import { ProductImageHero } from '@/features/product/components/product-image-hero';
import { ProductNutritionSection } from '@/features/product/components/product-nutrition-section';
import {
  ProductWeightSelector,
  type WeightOption,
} from '@/features/product/components/product-weight-selector';
import {
  getProductTagline,
  PRODUCT_TRUST_ITEMS,
} from '@/features/product/constants/product.constants';
import {
  formatInstantDeliveryLabel,
  getInstantDeliveryMinutes,
} from '@/features/product/utils/product-delivery';
import { getProductGalleryImages } from '@/features/product/utils/product-gallery';
import { getProductReviewCount } from '@/features/product/utils/product-review-count';
import { AppChoiceModal } from '@/shared/components/app-choice-modal';
import { AppInfoModal } from '@/shared/components/app-info-modal';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { ScreenBackButton } from '@/shared/components/screen-back-button';
import { Shimmer } from '@/shared/components/shimmer';
import { WishlistToggle } from '@/shared/components/wishlist-toggle';
import { hapticAddToCart, hapticSoftTap } from '@/shared/haptics/feedback';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import {
  addToCart,
  openCartSheet,
  selectCartLineQuantity,
  updateCartQuantity,
  useCartStore,
} from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

function asRouteParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export function ProductDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { restaurantId: restaurantIdParam, itemId: itemIdParam } =
    useLocalSearchParams<{
      restaurantId?: string | string[];
      itemId?: string | string[];
    }>();
  const restaurantId = asRouteParam(restaurantIdParam);
  const itemId = asRouteParam(itemIdParam);

  const { data, status } = useSimulatedQuery(
    (signal) => fetchMenuItemContext(restaurantId, itemId, signal),
    [restaurantId, itemId],
    { enabled: Boolean(restaurantId && itemId) },
  );

  const quantity = useCartStore(selectCartLineQuantity(itemId, restaurantId));
  const [selectedWeightId, setSelectedWeightId] = useState('w1');
  const [deliveryMinutes, setDeliveryMinutes] = useState<number | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [weightHelpVisible, setWeightHelpVisible] = useState(false);
  const [nutritionVisible, setNutritionVisible] = useState(false);

  const itemPrice = data?.item.price ?? 0;
  const itemCalories = data?.item.calories;

  const weightOptions = useMemo((): WeightOption[] => {
    const base = itemPrice;
    if (!base) return [];
    return [
      { id: 'w1', label: '250g', price: base },
      { id: 'w2', label: '500g', price: Math.round(base * 1.75 * 100) / 100 },
      { id: 'w3', label: '1 lb', price: Math.round(base * 2.25 * 100) / 100 },
      { id: 'w4', label: '2 lb', price: Math.round(base * 4 * 100) / 100 },
    ];
  }, [itemPrice]);

  const nutritionFacts = useMemo(() => {
    const cal = itemCalories ?? 32;
    return [
      { label: 'Calories', value: `${cal} kcal` },
      { label: 'Carbs', value: `${(cal * 0.24).toFixed(1)} g` },
      { label: 'Protein', value: `${(cal * 0.07).toFixed(1)} g` },
      { label: 'Fat', value: `${(cal * 0.03).toFixed(1)} g` },
      { label: 'Fiber', value: `${(cal * 0.06).toFixed(1)} g` },
    ];
  }, [itemCalories]);

  if (status === 'loading' || !data) {
    return (
      <View style={styles.root}>
        <AppStatusBar style="dark" />
        <View style={[styles.loading, { paddingTop: insets.top + spacing.md }]}>
          <Shimmer height={280} borderRadius={0} />
          <Shimmer height={120} borderRadius={12} />
          <Shimmer height={80} borderRadius={12} />
        </View>
      </View>
    );
  }

  const { restaurant, item } = data;
  const selectedWeight =
    weightOptions.find((w) => w.id === selectedWeightId) ?? weightOptions[0];
  const displayPrice = selectedWeight?.price ?? item.price;
  const mrp = deriveMrp(displayPrice);
  const discount = deriveDiscountPercent(displayPrice, mrp);
  const reviewCount = getProductReviewCount(
    item.id,
    restaurant.rating,
    restaurant.reviewCount,
  );
  const instantMinutes = deliveryMinutes ?? getInstantDeliveryMinutes(item.id);
  const galleryImages = getProductGalleryImages(item.image, [], 3);
  const lineTotal = displayPrice * quantity;
  const detailCopy = `${item.name} are carefully selected for freshness and quality. ${item.description ? `Each pack is ${item.description.toLowerCase()}.` : ''} Store in a cool, dry place and consume within the recommended period for best taste.`;
  const tagline = getProductTagline(item);

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
    if (quantity === 0) {
      return;
    }
    updateCartQuantity(item.id, quantity - 1, restaurant.id);
  }

  function handleAddToCart() {
    hapticAddToCart();
    if (quantity === 0) {
      addToCart(item, restaurant.id, restaurant.name);
      return;
    }
    openCartSheet();
  }

  function handleShare() {
    hapticSoftTap();
    void Share.share({
      message: `Check out ${item.name} on FreshCart — ${formatInr(displayPrice)}`,
    });
  }

  function handleViewImages() {
    hapticSoftTap();
    setGalleryOpen(true);
  }

  function handleChangeDelivery() {
    hapticSoftTap();
    setDeliveryModalVisible(true);
  }

  function handleWeightHelp() {
    hapticSoftTap();
    setWeightHelpVisible(true);
  }

  function handleNutritionExpand() {
    hapticSoftTap();
    setNutritionVisible(true);
  }

  function handleDeliveryChoice(optionId: string) {
    setDeliveryMinutes(Number(optionId));
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <ScreenBackButton
          onPress={() => {
            hapticSoftTap();
            router.back();
          }}
        />

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => router.push('/search')}
            style={styles.headerBtn}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <AppSymbol
              name="magnifyingglass"
              size={18}
              tintColor={colors.textPrimary}
            />
          </Pressable>
          <Pressable
            onPress={handleShare}
            style={styles.headerBtn}
            accessibilityRole="button"
            accessibilityLabel="Share"
          >
            <AppSymbol
              name="square.and.arrow.up"
              size={17}
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
        </View>
      </View>

      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 96 },
        ]}
      >
        <ProductImageHero
          primaryImage={item.image}
          relatedImages={[]}
          discountPercent={discount}
          onViewImages={handleViewImages}
        />

        <View style={styles.body}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>{tagline}</Text>

          <View style={styles.socialRow}>
            <AppSymbol
              name="star.fill"
              size={12}
              tintColor={colors.primary}
              weight="semibold"
            />
            <Text style={styles.socialText}>
              {restaurant.rating.toFixed(1)} (
              {reviewCount.toLocaleString('en-US')} reviews)
            </Text>
            <View style={styles.socialDivider} />
            <Text style={styles.socialText}>2K+ bought this week</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatInr(displayPrice)}</Text>
            {discount > 0 ? (
              <>
                <Text style={styles.mrp}>{formatInr(mrp)}</Text>
                <View style={styles.offPill}>
                  <Text style={styles.offText}>{discount}% OFF</Text>
                </View>
              </>
            ) : null}
          </View>

          <ProductWeightSelector
            options={weightOptions}
            selectedId={selectedWeightId}
            onSelect={setSelectedWeightId}
            onHelpPress={handleWeightHelp}
          />

          <View style={styles.deliveryCard}>
            <View style={styles.deliveryIconWrap}>
              <AppSymbol name="scooter" size={18} tintColor={colors.primary} />
            </View>
            <View style={styles.deliveryCopy}>
              <Text style={styles.deliveryTitle}>
                Get it in{' '}
                <Text style={styles.deliveryAccent}>
                  {formatInstantDeliveryLabel(instantMinutes)}
                </Text>
              </Text>
              <Text style={styles.deliverySubtitle}>
                Instant delivery · express slots available
              </Text>
            </View>
            <Pressable
              onPress={handleChangeDelivery}
              accessibilityRole="button"
              accessibilityLabel="Change delivery time"
            >
              <Text style={styles.changeLink}>Change</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <Text style={styles.description}>{detailCopy}</Text>

            <View style={styles.trustRow}>
              {PRODUCT_TRUST_ITEMS.map((entry) => (
                <View key={entry.label} style={styles.trustItem}>
                  <View style={styles.trustIcon}>
                    <AppSymbol
                      name={entry.icon}
                      size={16}
                      tintColor={colors.primary}
                      weight="semibold"
                    />
                  </View>
                  <Text style={styles.trustLabel}>{entry.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <ProductNutritionSection
            facts={nutritionFacts}
            onExpand={handleNutritionExpand}
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.sm) },
        ]}
      >
        {quantity > 0 ? (
          <ProductFooterStepper
            quantity={quantity}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
          />
        ) : null}
        <Pressable
          style={[
            styles.addToCartBtn,
            quantity === 0 && styles.addToCartBtnExpanded,
          ]}
          onPress={handleAddToCart}
          accessibilityRole="button"
          accessibilityLabel={quantity > 0 ? 'View cart' : 'Add to cart'}
        >
          <Text style={styles.addToCartText}>
            {quantity > 0
              ? `View Cart (${quantity}) – ${formatInr(lineTotal)}`
              : `Add to Cart – ${formatInr(displayPrice)}`}
          </Text>
        </Pressable>
      </View>

      <ProductImageGalleryModal
        visible={galleryOpen}
        images={galleryImages}
        productName={item.name}
        onClose={() => setGalleryOpen(false)}
      />

      <AppChoiceModal
        visible={deliveryModalVisible}
        title="Delivery time"
        message="Choose an instant delivery slot"
        icon="clock.fill"
        options={[
          { id: '12', label: '12 min' },
          { id: '15', label: '15 min' },
          { id: '20', label: '20 min' },
        ]}
        onSelect={handleDeliveryChoice}
        onClose={() => setDeliveryModalVisible(false)}
      />

      <AppInfoModal
        visible={weightHelpVisible}
        title="How much do I need?"
        message="For 1–2 servings, choose 250g. For a family of 3–4, 500g or 1 lb works well. Larger packs offer better value for weekly stock-ups."
        icon="questionmark.circle.fill"
        onClose={() => setWeightHelpVisible(false)}
      />

      <AppInfoModal
        visible={nutritionVisible}
        title="Nutrition (per 100g)"
        message={nutritionFacts
          .map((fact) => `${fact.label}: ${fact.value}`)
          .join('\n')}
        icon="leaf.fill"
        onClose={() => setNutritionVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  content: {
    flexGrow: 1,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: -4,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
    marginTop: spacing.xxs,
  },
  socialText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textSecondary,
  },
  socialDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 30,
    color: colors.primary,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  offPill: {
    backgroundColor: colors.successLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  offText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 13,
    color: colors.primary,
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  deliveryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  deliveryCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  deliveryTitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  deliveryAccent: {
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  deliverySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  changeLink: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.primary,
    flexShrink: 0,
  },
  section: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  trustIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustLabel: {
    fontFamily: fonts.semibold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  addToCartBtn: {
    flex: 1,
    height: productFooterControlHeight,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartBtnExpanded: {
    flex: 1,
  },
  addToCartText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 18,
    color: colors.textInverse,
  },
});
