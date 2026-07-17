import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { TopPicksProductCard } from '@/features/home/components/top-picks-product-card';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { spacing } from '@/theme/spacing';

type CategoryProductGridProps = {
  dishes: RecommendedDish[];
};

export function CategoryProductGrid({ dishes }: CategoryProductGridProps) {
  const { width } = useWindowDimensions();
  const gap = spacing.sm;
  const cardWidth = (width - spacing.md * 2 - gap) / 2;

  return (
    <View style={styles.grid}>
      {dishes.map((dish) => (
        <TopPicksProductCard
          key={`${dish.restaurantId}-${dish.item.id}`}
          dish={dish}
          width={cardWidth}
          flush
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
});
