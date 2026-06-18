import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
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
  openCartSheet,
  selectCartItemCount,
  selectCartSubtotal,
  selectLastAdded,
  useCartStore,
} from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { floatingCartBottomOffset } from '@/theme/tab-bar';

export function FloatingCartBar() {
  const insets = useSafeAreaInsets();
  const itemCount = useCartStore(selectCartItemCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const lastAdded = useCartStore(selectLastAdded);
  const pulse = useSharedValue(1);
  const badgePulse = useSharedValue(1);

  useEffect(() => {
    if (!lastAdded) return;
    pulse.value = withSequence(
      withSpring(1.03, { damping: 14, stiffness: 260 }),
      withSpring(1, { damping: 16, stiffness: 220 }),
    );
    badgePulse.value = withSequence(
      withSpring(1.2, { damping: 12, stiffness: 280 }),
      withSpring(1, { damping: 14, stiffness: 240 }),
    );
  }, [lastAdded?.id, pulse, badgePulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgePulse.value }],
  }));

  if (itemCount === 0) return null;

  function handlePress() {
    hapticPressIn();
    hapticCartOpen();
    openCartSheet();
  }

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { bottom: floatingCartBottomOffset(insets.bottom) },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={hapticPressIn}
        style={styles.bar}
      >
        <View style={styles.left}>
          <Animated.View style={[styles.badge, badgeStyle]}>
            <PremiumText variant="label" color={colors.textInverse}>
              {itemCount}
            </PremiumText>
          </Animated.View>
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
    boxShadow: '0 8px 28px rgba(212, 84, 60, 0.35)',
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
});
