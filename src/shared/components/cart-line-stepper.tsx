import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition, ZoomIn } from 'react-native-reanimated';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type CartLineStepperProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

const LAYOUT = LinearTransition.springify().damping(20).stiffness(300);

/** Compact outline stepper for cart rows — Swiggy-style inline control. */
export function CartLineStepper({
  quantity,
  onDecrease,
  onIncrease,
}: CartLineStepperProps) {
  return (
    <View style={styles.root}>
      <Pressable
        onPress={onDecrease}
        style={styles.btn}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <AppSymbol name="minus" size={14} tintColor={colors.primary} />
      </Pressable>
      <Animated.View
        key={quantity}
        entering={ZoomIn.springify().damping(18).stiffness(340).duration(160)}
        layout={LAYOUT}
        style={styles.qtyWrap}
      >
        <PremiumText variant="captionMedium" color={colors.primary}>
          {quantity}
        </PremiumText>
      </Animated.View>
      <Pressable
        onPress={onIncrease}
        style={styles.btn}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <AppSymbol name="plus" size={14} tintColor={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xxs,
    paddingVertical: 2,
    minWidth: 88,
    borderCurve: 'continuous',
  },
  btn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyWrap: {
    minWidth: 20,
    alignItems: 'center',
  },
});
