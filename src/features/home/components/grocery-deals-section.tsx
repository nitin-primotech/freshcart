import type { Href } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { GroceryDealCard } from '@/features/home/components/grocery-deal-card';
import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { spacing } from '@/theme/spacing';

type GroceryDealsSectionProps = {
  dishes: RecommendedDish[];
  viewAllHref?: Href;
};

export function GroceryDealsSection({
  dishes,
  viewAllHref,
}: GroceryDealsSectionProps) {
  const cardWidth = useCarouselItemWidth({
    visibleCount: 2.55,
    peek: 0.12,
    gap: spacing.sm,
    paddingStart: spacing.md,
    paddingEnd: spacing.md,
  });

  if (dishes.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title="Best Deals for You" href={viewAllHref} />
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {dishes.map((dish, index) => (
          <GroceryDealCard
            key={dish.item.id}
            dish={dish}
            width={cardWidth}
            index={index}
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
