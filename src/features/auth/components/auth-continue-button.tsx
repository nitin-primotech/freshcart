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
  tone?: 'primary' | 'success';
  showTrailingIcon?: boolean;
};

export function AuthContinueButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  tone = 'primary',
  showTrailingIcon = true,
}: AuthContinueButtonProps) {
  const isDisabled = disabled || loading;

  function handlePress() {
    if (isDisabled) return;
    hapticPrimaryAction();
    onPress();
  }

  const enabledBg = tone === 'success' ? colors.success : colors.primary;
  const disabledBg =
    tone === 'success' ? 'rgba(45, 106, 79, 0.35)' : colors.primaryLight;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={isDisabled ? undefined : hapticPressIn}
      disabled={isDisabled}
      style={[
        styles.btn,
        { backgroundColor: isDisabled ? disabledBg : enabledBg },
      ]}
      accessibilityRole="button"
      accessibilityLabel={loading ? 'Loading' : label}
      accessibilityState={{ disabled: isDisabled }}
    >
      <Text style={styles.label}>{loading ? 'Please wait…' : label}</Text>
      {showTrailingIcon ? (
        <View style={styles.arrow}>
          <AppSymbol
            name="chevron.right"
            size={16}
            tintColor={colors.textInverse}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 52,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    boxShadow: '0 6px 18px rgba(45, 139, 63, 0.22)',
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textInverse,
  },
  arrow: {
    position: 'absolute',
    right: spacing.lg,
  },
});
