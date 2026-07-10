import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { AppSymbol } from '@/shared/components/app-symbol';
import { QuantityStepper } from '@/shared/components/quantity-stepper';
import { hapticPrimaryAction, hapticSoftTap } from '@/shared/haptics/feedback';
import { colors, shadows } from '@/theme/colors';
import { radius } from '@/theme/spacing';

type AnimatedCartActionProps = {
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  itemLabel?: string;
  compact?: boolean;
  small?: boolean;
};

export function AnimatedCartAction({
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
  itemLabel = 'item',
  compact = false,
  small = false,
}: AnimatedCartActionProps) {
  const btnSize = small ? 26 : compact ? 34 : 40;

  return (
    <View style={styles.root}>
      {quantity === 0 ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}
        >
          <Pressable
            style={[styles.addBtn, { width: btnSize, height: btnSize }]}
            onPress={() => {
              hapticPrimaryAction();
              onAdd();
            }}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Add ${itemLabel} to cart`}
          >
            <AppSymbol
              name="plus"
              size={small ? 14 : 18}
              tintColor={colors.primary}
            />
          </Pressable>
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}
        >
          <QuantityStepper
            quantity={quantity}
            onDecrease={() => {
              hapticSoftTap();
              onDecrease();
            }}
            onIncrease={() => {
              hapticSoftTap();
              onIncrease();
            }}
            minQuantity={0}
            compact={compact}
            small={small}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'flex-end',
  },
  addBtn: {
    borderRadius: radius.md,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
    ...shadows.soft,
  },
});
