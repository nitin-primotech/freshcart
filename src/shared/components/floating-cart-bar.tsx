import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppSymbol } from '@/shared/components/app-symbol';
import {
  CartThumbStack,
  cartThumbStackWidth,
} from '@/shared/components/cart-thumb-stack';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticCartOpen, hapticPressIn } from '@/shared/haptics/feedback';
import {
  openCartSheet,
  selectCartItemCount,
  selectCartPreviewThumbsStable,
  selectLastAdded,
  useCartStore,
} from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { floatingCartBottomOffset } from '@/theme/tab-bar';

const CART_BAR_ENTER = FadeInUp.springify().damping(18).stiffness(220);

export function FloatingCartBar() {
  const insets = useSafeAreaInsets();
  const itemCount = useCartStore(selectCartItemCount);
  const previewThumbs = useCartStore(selectCartPreviewThumbsStable);
  const lastAdded = useCartStore(selectLastAdded);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!lastAdded) return;
    pulse.value = withSequence(
      withSpring(1.04, { damping: 14, stiffness: 280 }),
      withSpring(1, { damping: 16, stiffness: 220 }),
    );
  }, [lastAdded?.lineKey]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (itemCount === 0) {
    return null;
  }

  function handlePress() {
    hapticPressIn();
    hapticCartOpen();
    openCartSheet();
  }

  const itemLabel = itemCount === 1 ? '1 Item' : `${itemCount} Items`;
  const stackWidth = cartThumbStackWidth(previewThumbs.length);

  return (
    <Animated.View
      entering={CART_BAR_ENTER}
      style={[
        styles.wrapper,
        { bottom: floatingCartBottomOffset(insets.bottom) },
        barStyle,
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={handlePress}
        onPressIn={hapticPressIn}
        style={styles.bar}
        accessibilityRole="button"
        accessibilityLabel={`View cart, ${itemLabel}`}
      >
        <View style={[styles.stackSlot, { width: stackWidth }]}>
          <CartThumbStack
            thumbs={previewThumbs}
            highlightId={lastAdded?.lineKey}
          />
        </View>

        <View style={styles.copy}>
          <PremiumText variant="bodyMedium" color={colors.textInverse}>
            View cart
          </PremiumText>
          <PremiumText variant="caption" color={colors.textOnDarkMuted}>
            {itemLabel}
          </PremiumText>
        </View>

        <View style={styles.chevronWrap}>
          <AppSymbol
            name="chevron.right"
            size={16}
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
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingLeft: spacing.xs,
    paddingRight: spacing.xxs,
    paddingVertical: spacing.xs,
    borderCurve: 'continuous',
    boxShadow: '0 8px 24px rgba(212, 84, 60, 0.34)',
    overflow: 'visible',
  },
  stackSlot: {
    height: 40,
    justifyContent: 'center',
    overflow: 'visible',
    marginLeft: spacing.xxs,
  },
  copy: {
    gap: 1,
    minWidth: 72,
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xxs,
  },
});
