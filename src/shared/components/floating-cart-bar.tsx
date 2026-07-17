import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/utils/format-currency';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticCartOpen, hapticPressIn } from '@/shared/haptics/feedback';
import {
  openCartSheet,
  selectCartItemCount,
  selectCartSubtotal,
  selectLastAdded,
  useCartStore,
} from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { floatingCartBottomOffset } from '@/theme/tab-bar';
import { fonts } from '@/theme/typography';

const CART_BAR_ENTER = FadeIn.duration(200);
const BAR_WIDTH = '90%';

type FloatingCartBarProps = {
  hasTabBar?: boolean;
  aboveProductFooter?: boolean;
};

export function FloatingCartBar({
  hasTabBar = true,
  aboveProductFooter = false,
}: FloatingCartBarProps = {}) {
  const insets = useSafeAreaInsets();
  const itemCount = useCartStore(selectCartItemCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const lastAdded = useCartStore(selectLastAdded);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!lastAdded) return;
    pulse.value = withSequence(
      withSpring(1.02, { damping: 14, stiffness: 280 }),
      withSpring(1, { damping: 16, stiffness: 220 }),
    );
  }, [lastAdded?.lineKey, pulse, lastAdded]);

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

  const countLabel = itemCount === 1 ? '1 item' : `${itemCount} items`;
  const badgeLabel = itemCount > 99 ? '99+' : String(itemCount);

  return (
    <Animated.View
      entering={CART_BAR_ENTER}
      style={[
        styles.wrapper,
        {
          bottom: floatingCartBottomOffset(insets.bottom, {
            hasTabBar,
            aboveProductFooter,
          }),
        },
        barStyle,
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={handlePress}
        onPressIn={hapticPressIn}
        style={styles.bar}
        accessibilityRole="button"
        accessibilityLabel={`View cart, ${countLabel}, total ${formatInr(subtotal)}`}
      >
        <View style={styles.accentStripe} pointerEvents="none" />

        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <AppSymbol name="cart.fill" size={22} tintColor={colors.primary} />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        </View>

        <View style={styles.copy}>
          <Text style={styles.copyLine} numberOfLines={1}>
            <Text style={styles.copyAccent}>{countLabel}</Text>
            <Text style={styles.copyRest}> in your cart</Text>
          </Text>
          <Text style={styles.totalLine}>Total {formatInr(subtotal)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.cta}>
          <Text style={styles.ctaText}>View cart</Text>
          <AppSymbol
            name="chevron.right"
            size={12}
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
    zIndex: 10,
  },
  bar: {
    width: BAR_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 6,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm + 4,
    paddingRight: spacing.sm,
    gap: spacing.sm,
    overflow: 'hidden',
    boxShadow:
      '0 16px 40px rgba(28, 28, 30, 0.16), 0 6px 16px rgba(28, 28, 30, 0.1), 0 0 0 1px rgba(28, 28, 30, 0.04)',
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(212, 84, 60, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderCurve: 'continuous',
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textInverse,
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  copyLine: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  copyAccent: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primary,
  },
  copyRest: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  totalLine: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.divider,
    marginVertical: 2,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: 4,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: 9,
  },
  ctaText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textInverse,
  },
});
