import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { PremiumText } from '@/shared/components/premium-text';
import { colors, gradients } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

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
          <Image
            source={require('@/assets/images/foodrushlogo.png')}
            style={styles.logoImage}
            contentFit="contain"
          />
        </View>
        <PremiumText variant="h1" color={colors.textInverse}>
          FreshCart
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  tagline: {
    marginTop: spacing.xs,
  },
});
