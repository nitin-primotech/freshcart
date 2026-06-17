import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { PremiumText } from '@/shared/components/premium-text';
import { colors, gradients } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type AppSplashProps = {
  /** Hide after hydration; max 2.5s either way */
  ready?: boolean;
};

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
          <PremiumText variant="display" color={colors.primary}>
            FR
          </PremiumText>
        </View>
        <PremiumText variant="h1" color={colors.textInverse}>
          foodRush
        </PremiumText>
        <PremiumText
          variant="caption"
          color={colors.textOnDarkMuted}
          style={styles.tagline}
        >
          Premium food, delivered fast
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
    gap: spacing.sm,
  },
  logoMark: {
    width: 88,
    height: 88,
    borderRadius: radius.xl,
    backgroundColor: colors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
    borderCurve: 'continuous',
  },
  tagline: {
    marginTop: spacing.xs,
  },
});
