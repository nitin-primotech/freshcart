import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchRestaurantById } from '@/features/catalog/api/catalog.api';
import type { MenuItem } from '@/features/catalog/types/catalog.types';
import { AnimatedCartAction } from '@/shared/components/animated-cart-action';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { ErrorState } from '@/shared/components/error-state';
import { PremiumText } from '@/shared/components/premium-text';
import { Shimmer } from '@/shared/components/shimmer';
import { hapticAddToCart, hapticPressIn } from '@/shared/haptics/feedback';
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
  const quantity = useCartStore(selectCartLineQuantity(item.id, restaurantId));
  const [sheetOpen, setSheetOpen] = useState(false);

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

  return (
    <>
      <Pressable
        onPress={() => setSheetOpen(true)}
        style={[styles.menuRow, shadows.soft]}
      >
        <View style={styles.menuText}>
          <PremiumText variant="bodyMedium">{item.name}</PremiumText>
          <PremiumText
            variant="caption"
            color={colors.textSecondary}
            numberOfLines={2}
          >
            {item.description}
          </PremiumText>
          <PremiumText variant="price" style={styles.price}>
            ${item.price.toFixed(2)}
          </PremiumText>
          {item.isPopular ? (
            <View style={styles.popular}>
              <PremiumText variant="label" color={colors.primary}>
                Popular
              </PremiumText>
            </View>
          ) : null}
        </View>
        <View style={styles.menuImageWrap}>
          <Image source={{ uri: item.image }} style={styles.menuImage} />
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
      </Pressable>

      <ItemDetailSheet
        item={item}
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}

function ItemDetailSheet({
  item,
  restaurantId,
  restaurantName,
  visible,
  onClose,
}: {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const quantity = useCartStore(selectCartLineQuantity(item.id, restaurantId));

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

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <Animated.View
        entering={FadeInDown.duration(320).springify().damping(20)}
        style={[
          styles.itemSheet,
          { paddingBottom: insets.bottom + spacing.sm },
        ]}
      >
        <Pressable style={styles.sheetClose} onPress={onClose} hitSlop={12}>
          <AppSymbol
            name="xmark.circle.fill"
            size={28}
            tintColor={colors.textTertiary}
          />
        </Pressable>
        <Animated.View entering={FadeIn.duration(280)}>
          <Image source={{ uri: item.image }} style={styles.sheetImage} />
        </Animated.View>
        <PremiumText variant="h2">{item.name}</PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          {item.description}
        </PremiumText>
        {item.calories ? (
          <PremiumText variant="caption" color={colors.textTertiary}>
            {item.calories} cal
          </PremiumText>
        ) : null}

        <View style={styles.sheetFooter}>
          <View style={styles.priceBlock}>
            <PremiumText variant="caption" color={colors.textSecondary}>
              1 unit
            </PremiumText>
            <PremiumText variant="price" color={colors.textPrimary}>
              ${item.price.toFixed(2)}
            </PremiumText>
            <PremiumText variant="caption" color={colors.textTertiary}>
              Inclusive of all taxes
            </PremiumText>
          </View>
          <AnimatedCartAction
            quantity={quantity}
            onAdd={() => {
              hapticAddToCart();
              addToCart(item, restaurantId, restaurantName);
            }}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            itemLabel={item.name}
          />
        </View>
      </Animated.View>
    </Modal>
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
          <Image source={{ uri: data.coverImage }} style={styles.hero} />
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
              {data.isFreeDelivery ? 'Free' : `$${data.deliveryFee}`}
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
    boxShadow: '0 4px 14px rgba(212, 84, 60, 0.32)',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  itemSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
    borderCurve: 'continuous',
  },
  sheetClose: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 2,
  },
  sheetImage: {
    width: '100%',
    height: 200,
    borderRadius: radius.lg,
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
  },
  priceBlock: {
    flex: 1,
    gap: 2,
  },
  sheetAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderCurve: 'continuous',
  },
});
