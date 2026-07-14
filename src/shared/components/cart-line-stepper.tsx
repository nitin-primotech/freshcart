import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

type CartLineStepperProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  fullWidth?: boolean;
};

/** Compact outline stepper for cart rows. */
export function CartLineStepper({
  quantity,
  onDecrease,
  onIncrease,
  fullWidth = false,
}: CartLineStepperProps) {
  return (
    <View style={[styles.root, fullWidth && styles.rootFullWidth]}>
      <Pressable
        onPress={onDecrease}
        style={styles.btn}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Text style={styles.symbol}>−</Text>
      </Pressable>
      <Text style={styles.qty}>{quantity}</Text>
      <Pressable
        onPress={onIncrease}
        style={styles.btn}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Text style={styles.symbol}>+</Text>
      </Pressable>
    </View>
  );
}

const STEP_HEIGHT = 32;
const BTN_SIZE = 28;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    borderCurve: 'continuous',
    height: STEP_HEIGHT,
    minWidth: 88,
    paddingHorizontal: 2,
  },
  rootFullWidth: {
    alignSelf: 'stretch',
    width: '100%',
    justifyContent: 'space-between',
  },
  btn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    minWidth: 24,
    textAlign: 'center',
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.primary,
  },
  symbol: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 18,
    color: colors.primary,
  },
});
