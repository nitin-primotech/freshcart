import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, type PressableProps, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { PremiumText } from '@/shared/components/premium-text';
import {
  hapticPressIn,
  hapticPrimaryAction,
  hapticSecondaryAction,
} from '@/shared/haptics/feedback';
import { colors, gradients, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PremiumButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
};

export function PremiumButton({
  label,
  variant = 'primary',
  size = 'lg',
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  style,
  ...rest
}: PremiumButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn(
    e: Parameters<NonNullable<PressableProps['onPressIn']>>[0],
  ) {
    if (!disabled) {
      hapticPressIn();
      scale.value = withSpring(0.97, { damping: 18, stiffness: 420 });
    }
    onPressIn?.(e);
  }

  function handlePressOut(
    e: Parameters<NonNullable<PressableProps['onPressOut']>>[0],
  ) {
    scale.value = withSpring(1, { damping: 14, stiffness: 320 });
    onPressOut?.(e);
  }

  function handlePress(
    e: Parameters<NonNullable<PressableProps['onPress']>>[0],
  ) {
    if (disabled) return;
    if (variant === 'primary') {
      hapticPrimaryAction();
    } else {
      hapticSecondaryAction();
    }
    onPress?.(e);
  }

  const paddingVertical = size === 'lg' ? spacing.md + 2 : spacing.sm + 2;
  const paddingHorizontal = size === 'lg' ? spacing.xl : spacing.lg;

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        style={[styles.shell, animatedStyle, style]}
        {...rest}
      >
        <LinearGradient
          colors={gradients.primary.colors}
          start={gradients.primary.start}
          end={gradients.primary.end}
          style={[
            styles.base,
            styles.primaryFill,
            shadows.float,
            {
              paddingVertical,
              paddingHorizontal,
              borderCurve: 'continuous',
            },
            disabled && styles.disabled,
          ]}
        >
          <PremiumText variant="bodyMedium" color={colors.textInverse}>
            {label}
          </PremiumText>
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      style={[
        styles.shell,
        animatedStyle,
        styles.base,
        styles.secondary,
        {
          paddingVertical,
          paddingHorizontal,
          borderCurve: 'continuous',
        },
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <PremiumText
        variant="bodyMedium"
        color={variant === 'ghost' ? colors.primary : colors.textPrimary}
      >
        {label}
      </PremiumText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignSelf: 'stretch',
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  base: {
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  primaryFill: {
    width: '100%',
  },
  secondary: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  disabled: {
    opacity: 0.5,
  },
});
