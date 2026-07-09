import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const ACTION_HEIGHT = 32;

type ProductCardAddActionProps = {
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  itemLabel: string;
  variant?: 'outline' | 'solid';
};

export function ProductCardAddAction({
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
  itemLabel,
  variant = 'outline',
}: ProductCardAddActionProps) {
  const isOutline = variant === 'outline';

  if (quantity === 0) {
    return (
      <Pressable
        style={[
          styles.addBtn,
          isOutline ? styles.addBtnOutline : styles.addBtnSolid,
        ]}
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel={`Add ${itemLabel} to cart`}
      >
        <Text
          style={[
            styles.addLabel,
            isOutline ? styles.addLabelOutline : styles.addLabelSolid,
          ]}
        >
          ADD
        </Text>
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.stepper,
        isOutline ? styles.stepperOutline : styles.stepperSolid,
      ]}
    >
      <Pressable
        style={styles.stepperHit}
        onPress={onDecrease}
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${itemLabel} quantity`}
      >
        <Text
          style={[
            styles.stepperSymbol,
            isOutline ? styles.stepperTextOutline : styles.stepperTextSolid,
          ]}
        >
          −
        </Text>
      </Pressable>
      <Text
        style={[
          styles.stepperQty,
          isOutline ? styles.stepperTextOutline : styles.stepperTextSolid,
        ]}
      >
        {quantity}
      </Text>
      <Pressable
        style={styles.stepperHit}
        onPress={onIncrease}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${itemLabel} quantity`}
      >
        <Text
          style={[
            styles.stepperSymbol,
            isOutline ? styles.stepperTextOutline : styles.stepperTextSolid,
          ]}
        >
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: '100%',
    height: ACTION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    borderCurve: 'continuous',
  },
  addBtnOutline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.backgroundElevated,
  },
  addBtnSolid: {
    backgroundColor: colors.primary,
  },
  addLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0.5,
  },
  addLabelOutline: {
    color: colors.primary,
  },
  addLabelSolid: {
    color: colors.textInverse,
  },
  stepper: {
    width: '100%',
    height: ACTION_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  stepperOutline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.backgroundElevated,
  },
  stepperSolid: {
    backgroundColor: colors.primary,
  },
  stepperHit: {
    flex: 1,
    height: ACTION_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQty: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    minWidth: 24,
    textAlign: 'center',
  },
  stepperSymbol: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 18,
  },
  stepperTextOutline: {
    color: colors.primary,
  },
  stepperTextSolid: {
    color: colors.textInverse,
  },
});
