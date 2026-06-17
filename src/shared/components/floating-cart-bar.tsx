import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticCartOpen, hapticPressIn } from '@/shared/haptics/feedback';
import {
  clearLastAdded,
  openCartSheet,
  selectCartItemCount,
  selectCartSubtotal,
  useCartStore,
} from '@/store/cart.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { floatingCartBottomOffset } from '@/theme/tab-bar';

export function FloatingCartBar() {
  const insets = useSafeAreaInsets();
  const itemCount = useCartStore(selectCartItemCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const lastAdded = useCartStore((s) => s.lastAddedItemId);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!lastAdded) return;
    pulse.value = withSequence(
      withSpring(1.08, { damping: 8 }),
      withSpring(1, { damping: 12 }),
    );
    clearLastAdded();
  }, [lastAdded, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (itemCount === 0) return null;

  async function handlePress() {
    hapticPressIn();
    hapticCartOpen();
    pulse.value = withSequence(
      withSpring(1.04, { damping: 8 }),
      withSpring(1, { damping: 12 }),
    );
    openCartSheet();
  }

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(16)}
      style={[
        styles.wrapper,
        { bottom: floatingCartBottomOffset(insets.bottom) },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={hapticPressIn}
        style={[styles.bar, shadows.float]}
      >
        <View style={styles.left}>
          <View style={styles.badge}>
            <PremiumText variant="label" color={colors.textInverse}>
              {itemCount}
            </PremiumText>
          </View>
          <PremiumText variant="bodyMedium" color={colors.textInverse}>
            View cart
          </PremiumText>
        </View>
        <View style={styles.right}>
          <PremiumText variant="price" color={colors.textInverse}>
            ${subtotal.toFixed(2)}
          </PremiumText>
          <AppSymbol
            name="chevron.up"
            size={18}
            tintColor={colors.textInverse}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 100,
  },
  bar: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    minWidth: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxs,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chevron: {
    width: 14,
    height: 14,
  },
});
