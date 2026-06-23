import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { TopPicksProductCard } from '@/features/home/components/top-picks-product-card';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { spacing } from '@/theme/spacing';

type RecommendedSectionProps = {
  dishes: RecommendedDish[];
  title?: string;
  imageIndexOffset?: number;
};

export function RecommendedSection({
  dishes,
  title = 'Top Picks for You',
  imageIndexOffset = 0,
}: RecommendedSectionProps) {
  const router = useRouter();
  const cardWidth = useCarouselItemWidth({
    visibleCount: 2.2,
    peek: 0.03,
    gap: spacing.md,
    paddingEnd: spacing.md,
  });

  if (dishes.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader
        title={title}
        onViewAll={() => router.push('/(tabs)/search')}
      />

      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {dishes.map((dish, index) => (
          <TopPicksProductCard
            key={`${dish.restaurantId}-${dish.item.id}`}
            dish={dish}
            width={cardWidth}
            imageIndex={imageIndexOffset + index}
          />
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
});
