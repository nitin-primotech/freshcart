import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { getTrendingFoodImage } from '@/features/home/utils/trending-food-images';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const OFFERS = [
  {
    id: 'offer-1',
    eyebrow: 'FLAT',
    headline: '20% OFF',
    subline: 'On Popular Dishes',
    backgroundColor: '#FDEEEA',
    textColor: colors.primaryDark,
    imageIndex: 0,
  },
  {
    id: 'offer-2',
    eyebrow: 'UP TO',
    headline: '25% OFF',
    subline: 'On Premium Meals',
    backgroundColor: colors.accentMuted,
    textColor: '#7A5C1E',
    imageIndex: 1,
  },
  {
    id: 'offer-3',
    eyebrow: 'UP TO',
    headline: '30% OFF',
    subline: 'On Weekend Specials',
    backgroundColor: colors.successLight,
    textColor: colors.success,
    imageIndex: 2,
  },
] as const;

export function HomeBestOffers() {
  const router = useRouter();
  const cardWidth = useCarouselItemWidth({
    visibleCount: 1.38,
    peek: 0.05,
    gap: spacing.md,
    paddingEnd: spacing.md,
  });

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader
        title="Best Offers"
        onViewAll={() => router.push('/(tabs)/search')}
      />
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {OFFERS.map((offer) => (
          <View
            key={offer.id}
            style={[
              styles.card,
              { width: cardWidth, backgroundColor: offer.backgroundColor },
            ]}
          >
            <View style={styles.copy}>
              <Text style={[styles.eyebrow, { color: offer.textColor }]}>
                {offer.eyebrow}
              </Text>
              <Text style={[styles.headline, { color: offer.textColor }]}>
                {offer.headline}
              </Text>
              <Text style={[styles.subline, { color: offer.textColor }]}>
                {offer.subline}
              </Text>
            </View>
            <Image
              source={getTrendingFoodImage(offer.imageIndex)}
              style={styles.image}
              contentFit="contain"
              transition={200}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
  },
  row: {
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  card: {
    height: 104,
    borderRadius: 16,
    borderCurve: 'continuous',
    marginRight: spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
  },
  copy: {
    flex: 1,
    justifyContent: 'center',
    gap: 1,
    paddingRight: spacing.xs,
  },
  eyebrow: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.3,
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
  },
  subline: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.9,
  },
  image: {
    width: 88,
    height: '100%',
    alignSelf: 'flex-end',
  },
});
