import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { fetchRestaurantById } from '@/features/catalog/api/catalog.api';
import type { MenuItem } from '@/features/catalog/types/catalog.types';
import { formatInr } from '@/features/checkout/utils/format-currency';
import { productDetailPath } from '@/features/product/utils/product-path';
import { isHttpImageUrl } from '@/lib/firebase/category-images';
import { AnimatedCartAction } from '@/shared/components/animated-cart-action';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { ErrorState } from '@/shared/components/error-state';
import { PremiumText } from '@/shared/components/premium-text';
import { Shimmer } from '@/shared/components/shimmer';
import {
  hapticAddToCart,
  hapticPressIn,
  hapticSoftTap,
} from '@/shared/haptics/feedback';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import {
  addToCart,
  selectCartItemCount,
  selectCartLineQuantity,
  updateCartQuantity,
  useCartStore,
} from '@/store/cart.store';
import { colors, screens, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

function MenuItemRow({
  item,
  restaurantId,
  restaurantName,
}: {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}) {
  const router = useRouter();
  const quantity = useCartStore(selectCartLineQuantity(item.id, restaurantId));

  function handleAdd() {
    hapticAddToCart();
    addToCart(item, restaurantId, restaurantName);
  }

  function handleIncrease() {
    hapticAddToCart();
    if (quantity === 0) {
      addToCart(item, restaurantId, restaurantName);
      return;
    }
    updateCartQuantity(item.id, quantity + 1);
  }

  function handleDecrease() {
    hapticPressIn();
    updateCartQuantity(item.id, quantity - 1);
  }

  function openProduct() {
    hapticSoftTap();
    router.push(productDetailPath(restaurantId, item.id));
  }

  return (
    <View style={[styles.menuRow, shadows.soft]}>
      <Pressable style={styles.menuText} onPress={openProduct}>
        <PremiumText variant="bodyMedium">{item.name}</PremiumText>
        <PremiumText
          variant="caption"
          color={colors.textSecondary}
          numberOfLines={2}
        >
          {item.description}
        </PremiumText>
        <PremiumText variant="price" style={styles.price}>
          ₹{Math.round(item.price)}
        </PremiumText>
        {item.isPopular ? (
          <View style={styles.popular}>
            <PremiumText variant="label" color={colors.primary}>
              Popular
            </PremiumText>
          </View>
        ) : null}
      </Pressable>
      <View style={styles.menuImageWrap}>
        <Pressable onPress={openProduct}>
          <Image source={{ uri: item.image }} style={styles.menuImage} />
        </Pressable>
        <View style={styles.menuAction}>
          <AnimatedCartAction
            quantity={quantity}
            onAdd={handleAdd}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            itemLabel={item.name}
            compact
          />
        </View>
      </View>
    </View>
  );
}

export function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cartCount = useCartStore(selectCartItemCount);

  const { data, status, error, refetch } = useSimulatedQuery(
    (signal) => fetchRestaurantById(id ?? '', signal),
    [id],
    { enabled: Boolean(id) },
  );

  const onScroll = useCallback(() => {}, []);

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <AppStatusBar style="light" />
        <Shimmer height={280} borderRadius={0} />
        <View style={styles.loadingBody}>
          <Shimmer height={32} width="60%" />
          <Shimmer height={120} />
          <Shimmer height={120} />
        </View>
      </View>
    );
  }

  if (status === 'error' || !data) {
    return (
      <ErrorState message={error ?? 'Restaurant not found'} onRetry={refetch} />
    );
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="light" />
      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: cartCount > 0 ? 140 : 80 }}
      >
        <View style={styles.heroWrap}>
          {isHttpImageUrl(data.coverImage) ? (
            <Image source={{ uri: data.coverImage }} style={styles.hero} />
          ) : null}
          <LinearGradient
            colors={screens.restaurant.heroGradient}
            style={styles.heroGradient}
          />
          <View style={styles.heroInfo}>
            <PremiumText variant="h1" color={colors.textInverse}>
              {data.name}
            </PremiumText>
            <PremiumText variant="caption" color={colors.textInverse}>
              {data.tagline}
            </PremiumText>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <AppSymbol name="star.fill" size={18} tintColor={colors.star} />
            <PremiumText variant="bodyMedium">{data.rating}</PremiumText>
            <PremiumText variant="caption" color={colors.textSecondary}>
              ({data.reviewCount})
            </PremiumText>
          </View>
          <View style={styles.stat}>
            <AppSymbol
              name="clock"
              size={18}
              tintColor={colors.textSecondary}
            />
            <PremiumText variant="bodyMedium">
              {data.deliveryTimeMin}–{data.deliveryTimeMax} min
            </PremiumText>
          </View>
          <View style={styles.stat}>
            <AppSymbol
              name="bicycle"
              size={18}
              tintColor={colors.textSecondary}
            />
            <PremiumText variant="bodyMedium">
              {data.isFreeDelivery ? 'Free' : formatInr(data.deliveryFee)}
            </PremiumText>
          </View>
        </View>

        {data.menu.map((section) => (
          <View key={section.id} style={styles.section}>
            <PremiumText variant="h2" style={styles.sectionTitle}>
              {section.title}
            </PremiumText>
            {section.items.map((item) => (
              <MenuItemRow
                key={item.id}
                item={item}
                restaurantId={data.id}
                restaurantName={data.name}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingBody: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  heroWrap: {
    height: 280,
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
  },
  heroInfo: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.xxs,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    marginTop: -spacing.xl,
    ...shadows.card,
    borderCurve: 'continuous',
  },
  stat: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  menuRow: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderCurve: 'continuous',
  },
  menuText: {
    flex: 1,
    gap: spacing.xxs,
  },
  price: {
    marginTop: spacing.xs,
  },
  popular: {
    alignSelf: 'flex-start',
    marginTop: spacing.xxs,
    backgroundColor: colors.accentMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  menuImageWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  menuImage: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
  },
  menuAction: {
    minHeight: 40,
    justifyContent: 'center',
  },
});
