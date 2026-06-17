import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { fetchRestaurantById } from '@/features/catalog/api/catalog.api';
import type { MenuItem } from '@/features/catalog/types/catalog.types';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { ErrorState } from '@/shared/components/error-state';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { Shimmer } from '@/shared/components/shimmer';
import { hapticAddToCart, hapticPressIn } from '@/shared/haptics/feedback';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import {
  addToCart,
  openCartSheet,
  selectCartItemCount,
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
  const scale = useSharedValue(1);
  const [sheetOpen, setSheetOpen] = useState(false);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  async function handleAdd() {
    hapticPressIn();
    hapticAddToCart();
    scale.value = withSequence(
      withSpring(1.15, { damping: 6 }),
      withSpring(1, { damping: 10 }),
    );
    addToCart(item, restaurantId, restaurantName);
    openCartSheet();
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
        <View>
          <Image source={{ uri: item.image }} style={styles.menuImage} />
          <Animated.View style={[styles.addBtn, animStyle]}>
            <Pressable
              onPress={handleAdd}
              onPressIn={hapticPressIn}
              style={styles.addBtnInner}
            >
              <AppSymbol name="plus" size={16} tintColor={colors.textInverse} />
            </Pressable>
          </Animated.View>
        </View>
      </Pressable>

      <Modal visible={sheetOpen} transparent animationType="fade">
        <Pressable
          style={styles.sheetBackdrop}
          onPress={() => setSheetOpen(false)}
        />
        <Animated.View entering={FadeIn.duration(250)} style={styles.itemSheet}>
          <Image source={{ uri: item.image }} style={styles.sheetImage} />
          <PremiumText variant="h2">{item.name}</PremiumText>
          <PremiumText variant="body" color={colors.textSecondary}>
            {item.description}
          </PremiumText>
          {item.calories ? (
            <PremiumText variant="caption" color={colors.textTertiary}>
              {item.calories} cal
            </PremiumText>
          ) : null}
          <PremiumButton
            label="Add to cart"
            onPress={() => {
              handleAdd();
              setSheetOpen(false);
            }}
          />
        </Animated.View>
      </Modal>
    </>
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
  statIcon: {
    width: 18,
    height: 18,
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
  menuImage: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
  },
  addBtn: {
    position: 'absolute',
    bottom: -8,
    right: -8,
  },
  addBtnInner: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.float,
  },
  addIcon: {
    width: 16,
    height: 16,
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
    padding: spacing.lg,
    gap: spacing.md,
    borderCurve: 'continuous',
  },
  sheetImage: {
    width: '100%',
    height: 200,
    borderRadius: radius.lg,
  },
});
