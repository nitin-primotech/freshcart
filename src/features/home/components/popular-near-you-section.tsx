import type { Href } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { PopularProductCard } from '@/features/home/components/popular-product-card';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { spacing } from '@/theme/spacing';

type PopularNearYouSectionProps = {
  dishes: RecommendedDish[];
  viewAllHref?: Href;
};

export function PopularNearYouSection({
  dishes,
  viewAllHref,
}: PopularNearYouSectionProps) {
  const cardWidth = useCarouselItemWidth({
    visibleCount: 2.65,
    peek: 0.1,
    gap: spacing.sm,
    paddingStart: spacing.md,
    paddingEnd: spacing.md,
  });

  if (dishes.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title="Popular Near You" href={viewAllHref} />
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {dishes.map((dish) => (
          <PopularProductCard
            key={dish.item.id}
            dish={dish}
            width={cardWidth}
            showDescription
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
