import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Promo } from '@/features/catalog/types/catalog.types';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type HeroBannerProps = {
  promo?: Promo;
};

export function HeroBanner({ promo }: HeroBannerProps) {
  const title = promo?.title ?? 'Free delivery';
  const subtitle = promo?.subtitle ?? 'On orders over $35 this week';

  return (
    <Pressable style={styles.wrap}>
      <LinearGradient
        colors={['#2A2A32', colors.secondary, '#141416']}
        locations={[0, 0.5, 1]}
        style={styles.banner}
      >
        <View style={styles.textCol}>
          <PremiumText variant="h1" color={colors.accent}>
            {title}
          </PremiumText>
          <PremiumText variant="bodyMedium" color={colors.textOnDarkMuted}>
            {subtitle}
          </PremiumText>
          <PremiumButton label="Order now" size="md" style={styles.cta} />
        </View>
        <Image
          source={
            promo?.image ??
            'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80'
          }
          style={styles.food}
          contentFit="cover"
        />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  banner: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 176,
    borderCurve: 'continuous',
    ...shadows.card,
  },
  textCol: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  food: {
    width: 148,
    height: '100%',
  },
});
