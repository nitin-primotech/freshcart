import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <Animated.View entering={FadeIn.duration(350)} style={styles.container}>
      <AppSymbol
        name="wifi.exclamationmark"
        size={40}
        tintColor={colors.danger}
        style={styles.icon}
      />
      <PremiumText variant="h3">{title}</PremiumText>
      <PremiumText
        variant="caption"
        color={colors.textSecondary}
        style={styles.message}
      >
        {message}
      </PremiumText>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.retry}>
          <PremiumText variant="bodyMedium" color={colors.primary}>
            Try again
          </PremiumText>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xxl,
    gap: spacing.xs,
  },
  icon: {
    marginBottom: spacing.sm,
  },
  message: {
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
