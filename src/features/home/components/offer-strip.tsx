import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { Promo } from '@/features/catalog/types/catalog.types';
import { PremiumText } from '@/shared/components/premium-text';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const FALLBACK = [
  { title: '65% OFF', subtitle: 'Every 30 mins', brand: 'RUSH MODE' },
  { title: 'Food in 10 mins', subtitle: 'Lightning delivery', brand: 'Bolt' },
  { title: 'Free delivery', subtitle: 'On orders $35+', brand: 'PREMIUM' },
];

type OfferStripProps = {
  promos?: Promo[];
};

export function OfferStrip({ promos }: OfferStripProps) {
  const cardWidth = useCarouselItemWidth({
    visibleCount: 2,
    peek: 0.12,
    gap: spacing.md,
    paddingEnd: spacing.lg,
  });

  const items =
    promos?.slice(0, 3).map((p) => ({
      title: p.title,
      subtitle: p.subtitle,
      brand: p.code,
      image: p.image,
    })) ?? FALLBACK.map((f) => ({ ...f, image: undefined }));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((item) => (
        <View key={item.brand} style={[styles.card, { width: cardWidth }]}>
          <PremiumText variant="overline" color={colors.accent}>
            {item.brand}
          </PremiumText>
          <PremiumText variant="h3" color={colors.textInverse}>
            {item.title}
          </PremiumText>
          <PremiumText variant="bodySmall" color={colors.textOnDarkMuted}>
            {item.subtitle}
          </PremiumText>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.thumb} />
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  card: {
    minHeight: 118,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: spacing.lg,
    gap: spacing.xs,
    overflow: 'hidden',
    borderCurve: 'continuous',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  thumb: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 88,
    height: 88,
    borderRadius: radius.full,
    opacity: 0.45,
  },
});
