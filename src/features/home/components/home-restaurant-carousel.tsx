import { type Href, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { Restaurant } from '@/features/catalog/types/catalog.types';
import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { RestaurantTileCard } from '@/features/home/components/restaurant-tile-card';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { spacing } from '@/theme/spacing';

type HomeRestaurantCarouselProps = {
  title: string;
  restaurants: Restaurant[];
  viewAllHref?: Href;
};

export function HomeRestaurantCarousel({
  title,
  restaurants,
  viewAllHref,
}: HomeRestaurantCarouselProps) {
  const router = useRouter();
  const cardWidth = useCarouselItemWidth({
    visibleCount: 1.55,
    peek: 0.08,
    gap: spacing.md,
    paddingEnd: spacing.md,
  });

  if (restaurants.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader
        title={title}
        onViewAll={
          viewAllHref
            ? () => router.push(viewAllHref)
            : restaurants.length === 1
              ? () => router.push(`/restaurant/${restaurants[0].id}`)
              : undefined
        }
      />
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {restaurants.map((restaurant, index) => (
          <RestaurantTileCard
            key={`${title}-${restaurant.id}-${index}`}
            restaurant={restaurant}
            width={cardWidth}
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
    paddingBottom: spacing.sm,
  },
});
