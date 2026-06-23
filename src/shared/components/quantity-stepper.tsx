import { Pressable, StyleSheet, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type QuantityStepperProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  minQuantity?: number;
  compact?: boolean;
};

export function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  minQuantity = 0,
  compact = false,
}: QuantityStepperProps) {
  const btnSize = compact ? 28 : 32;

  return (
    <View style={[styles.root, compact && styles.rootCompact]}>
      <Pressable
        onPress={onDecrease}
        disabled={quantity <= minQuantity}
        style={[
          styles.btn,
          { width: btnSize, height: btnSize },
          quantity <= minQuantity && styles.btnDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <AppSymbol name="minus" size={16} tintColor={colors.textInverse} />
      </Pressable>
      <PremiumText
        variant="bodyMedium"
        color={colors.textInverse}
        style={styles.qty}
      >
        {quantity}
      </PremiumText>
      <Pressable
        onPress={onIncrease}
        style={[styles.btn, { width: btnSize, height: btnSize }]}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <AppSymbol name="plus" size={16} tintColor={colors.textInverse} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderCurve: 'continuous',
  },
  rootCompact: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  qty: {
    minWidth: 18,
    textAlign: 'center',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.45,
  },
});
