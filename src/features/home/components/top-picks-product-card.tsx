import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  deriveMrp,
  formatInr,
} from '@/features/checkout/utils/format-currency';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { productDetailPath } from '@/features/product/utils/product-path';
import { isHttpImageUrl } from '@/lib/firebase/category-images';
import { AppSymbol } from '@/shared/components/app-symbol';
import { ProductCardAddAction } from '@/shared/components/product-card-add-action';
import { WishlistToggle } from '@/shared/components/wishlist-toggle';
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
  flush?: boolean;
};

export function TopPicksProductCard({
  dish,
  width,
  flush = false,
}: TopPicksProductCardProps) {
  const { item, restaurantId, restaurantName, rating, reviewCount } = dish;
  const quantity = useCartStore(selectCartLineQuantity(item.id, restaurantId));
  const imageUri = isHttpImageUrl(item.image) ? item.image : undefined;

  // Dynamic badge calculation (only show badges selectively so not all products have them)
  const hasSeed = item.id.length % 3 === 0;
  const isTopRated = rating && rating >= 4.7 && hasSeed;
  const isTrending = item.isPopular && !isTopRated && item.id.length % 2 === 0;
  const badgeText = isTopRated
    ? 'Top Rated'
    : isTrending
      ? 'Trending'
      : undefined;

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
    updateCartQuantity(item.id, quantity + 1, restaurantId);
  }

  function handleDecrease() {
    hapticSoftTap();
    updateCartQuantity(item.id, quantity - 1, restaurantId);
  }

  // Pseudo-random delivery info based on ID length
  const deliveryTime = 15 + (item.id.length % 11);
  const stockLeft = item.id.length % 4;

  return (
    <View style={[styles.card, flush && styles.cardFlush, { width }]}>
      {/* Image wrap with absolute overlay badges and ADD action */}
      <View style={styles.imageWrap}>
        {badgeText ? (
          <View
            style={[
              styles.badge,
              badgeText === 'Top Rated'
                ? styles.badgeTopRated
                : styles.badgeTrending,
            ]}
          >
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        ) : null}

        <Link href={productDetailPath(restaurantId, item.id)} asChild>
          <Pressable style={styles.imagePressable} accessibilityRole="link">
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                contentFit="contain"
                transition={200}
              />
            ) : (
              <View style={styles.imageFallback} />
            )}
          </Pressable>
        </Link>

        <WishlistToggle
          item={item}
          restaurantId={restaurantId}
          restaurantName={restaurantName}
          rating={rating ?? 4.0}
          variant="overlay"
          style={styles.heart}
          accessibilityLabel={`Save ${item.name} to wishlist`}
        />

        {/* Floating ADD action button overlapping bottom border */}
        <View style={styles.actionContainer}>
          <ProductCardAddAction
            quantity={quantity}
            onAdd={handleAdd}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            itemLabel={item.name}
            variant="outline"
          />
        </View>
      </View>

      {/* Description, price, and metadata details */}
      <View style={styles.body}>
        <Link href={productDetailPath(restaurantId, item.id)} asChild>
          <Pressable accessibilityRole="link" style={styles.detailsPress}>
            <Text style={styles.weight} numberOfLines={1}>
              {item.description || '1 pc'}
            </Text>

            <Text style={styles.price}>{formatInr(item.price)}</Text>

            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>

            {/* Ratings & reviews */}
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <AppSymbol
                  key={`star-${i}`}
                  name="star.fill"
                  size={10}
                  tintColor={
                    i < Math.round(rating ?? 4.2) ? '#F5A623' : '#D1D5DB'
                  }
                />
              ))}
              <Text style={styles.reviewsCount}>{reviewCount}</Text>
            </View>

            {/* Delivery time and urgent stock warning */}
            <View style={styles.deliveryRow}>
              <View style={styles.deliveryItem}>
                <AppSymbol name="clock" size={9} tintColor="#8E8E93" />
                <Text style={styles.deliveryText}>{deliveryTime} mins</Text>
              </View>
              {stockLeft > 0 && stockLeft <= 2 ? (
                <View style={styles.deliveryItem}>
                  <View style={styles.stockDot} />
                  <Text style={styles.stockText}>{stockLeft} left</Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const IMAGE_HEIGHT = 112;
const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  card: {
    marginRight: spacing.md,
    backgroundColor: colors.background,
    borderRadius: CARD_RADIUS,
    overflow: 'visible', // allow floating action button to overflow outside imageWrap
    marginBottom: spacing.xs,
  },
  cardFlush: {
    marginRight: 0,
  },
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#F8F9FA',
    borderRadius: CARD_RADIUS - 2,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  imagePressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '82%',
    height: '82%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
  },
  heart: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    zIndex: 12,
  },
  badge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
  },
  badgeTopRated: {
    backgroundColor: '#FFF3C4',
  },
  badgeTrending: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 7.5,
    letterSpacing: 0.2,
    color: '#7A5E00',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  pagDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  pagDotActive: {
    backgroundColor: '#757575',
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  actionContainer: {
    position: 'absolute',
    bottom: -14,
    right: 8,
    width: 62,
    height: 32,
    zIndex: 10,
  },
  body: {
    paddingHorizontal: 2,
    paddingTop: spacing.sm + 4, // leave gap for absolute ADD action button overlay
    paddingBottom: spacing.xs,
  },
  detailsPress: {
    gap: 2,
  },
  weight: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: '#8E8E93',
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 18,
    color: '#1C1C1E',
    marginTop: 1,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 11.5,
    lineHeight: 14,
    color: '#1C1C1E',
    marginTop: 2,
    minHeight: 28,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  reviewsCount: {
    fontFamily: fonts.regular,
    fontSize: 9.5,
    color: '#8E8E93',
    marginLeft: 3,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
  },
  deliveryText: {
    fontFamily: fonts.regular,
    fontSize: 9.5,
    color: '#8E8E93',
  },
  stockDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FF7043',
  },
  stockText: {
    fontFamily: fonts.bold,
    fontSize: 9.5,
    color: '#D84315',
  },
});
