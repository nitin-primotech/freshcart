import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { FreshCartLogo } from '@/shared/components/freshcart-logo';
import { PremiumText } from '@/shared/components/premium-text';
import { colors, gradients } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type AppSplashProps = {
  /** Hide after hydration; max 2.5s either way */
  ready?: boolean;
};

/** Welcome screen shown on cold start — primary home for FreshCart branding. */
export function AppSplash({ ready = false }: AppSplashProps) {
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {}, 400);
    return () => clearTimeout(timer);
  }, [ready]);

  return (
    <LinearGradient
      colors={gradients.primary.colors}
      start={gradients.primary.start}
      end={gradients.primary.end}
      style={styles.root}
    >
      <Animated.View entering={FadeIn.duration(600)} style={styles.center}>
        <View style={styles.logoMark}>
          <FreshCartLogo width={280} height={88} />
        </View>
        <PremiumText
          variant="caption"
          color={colors.textOnDarkMuted}
          style={styles.tagline}
        >
          Groceries, delivered fast
        </PremiumText>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  logoMark: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderCurve: 'continuous',
  },
  tagline: {
    letterSpacing: 0.4,
  },
});
