import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticPressIn, hapticPrimaryAction } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type AuthContinueButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'primary' | 'success' | 'soft' | 'brand';
  showTrailingIcon?: boolean;
  pill?: boolean;
  inlineArrow?: boolean;
};

export function AuthContinueButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  tone = 'primary',
  showTrailingIcon = true,
  pill = false,
  inlineArrow = false,
}: AuthContinueButtonProps) {
  const isDisabled = disabled || loading;

  function handlePress() {
    if (isDisabled) return;
    hapticPrimaryAction();
    onPress();
  }

  const soft = tone === 'soft';
  const brand = tone === 'brand';
  const enabledBg = soft
    ? colors.white
    : brand
      ? colors.brandGreen
      : tone === 'success'
        ? colors.success
        : colors.primary;
  const pressedBg = soft
    ? colors.accentMuted
    : brand
      ? colors.brandGreenDark
      : tone === 'success'
        ? colors.primaryLight
        : colors.primaryLight;
  const disabledBg = loading
    ? brand
      ? colors.brandGreenDark
      : colors.primaryDark
    : soft
      ? colors.backgroundMuted
      : brand
        ? colors.onboardingCurve
        : tone === 'success'
          ? 'rgba(45, 106, 79, 0.35)'
          : colors.primaryLight;
  const textColor = loading
    ? colors.textInverse
    : soft
      ? isDisabled
        ? colors.textTertiary
        : colors.brandGreenDark
      : brand && isDisabled
        ? colors.brandGreenDark
        : colors.textInverse;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={isDisabled ? undefined : hapticPressIn}
      disabled={isDisabled}
      style={({ pressed, hovered }) => [
        styles.btn,
        pill && styles.btnPill,
        soft && styles.btnSoft,
        brand && !isDisabled && styles.btnBrand,
        brand && isDisabled && styles.btnBrandDisabled,
        {
          backgroundColor: isDisabled
            ? disabledBg
            : pressed || hovered
              ? pressedBg
              : enabledBg,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={loading ? 'Loading' : label}
      accessibilityState={{ disabled: isDisabled }}
    >
      <View style={styles.contentRow}>
        <Text style={[styles.label, { color: textColor }]}>
          {loading ? 'Please wait…' : label}
        </Text>
        {showTrailingIcon && !loading ? (
          inlineArrow ? (
            <View style={styles.inlineArrow}>
              <AppSymbol name="arrow.right" size={16} tintColor={textColor} />
            </View>
          ) : (
            <View style={styles.arrow}>
              <AppSymbol name="chevron.right" size={16} tintColor={textColor} />
            </View>
          )
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 52,
    borderRadius: 14,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    boxShadow: '0 6px 18px rgba(45, 139, 63, 0.22)',
  },
  btnPill: {
    minHeight: 56,
    borderRadius: radius.full,
  },
  btnSoft: {
    borderWidth: 1,
    borderColor: colors.brandGreen,
    boxShadow: 'none',
  },
  btnBrand: {
    boxShadow: '0 6px 18px rgba(36, 155, 66, 0.24)',
  },
  btnBrandDisabled: {
    borderWidth: 1,
    borderColor: 'rgba(44, 173, 74, 0.35)',
    boxShadow: 'none',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 20,
  },
  arrow: {
    position: 'absolute',
    right: 0,
  },
  inlineArrow: {
    marginLeft: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
