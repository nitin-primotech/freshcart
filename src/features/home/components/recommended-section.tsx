import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { RecommendedDishCard } from '@/features/home/components/recommended-dish-card';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { PremiumText } from '@/shared/components/premium-text';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type RecommendedSectionProps = {
  dishes: RecommendedDish[];
};

export function RecommendedSection({ dishes }: RecommendedSectionProps) {
  const router = useRouter();
  const cardWidth = useCarouselItemWidth({
    visibleCount: 1.55,
    peek: 0.08,
    gap: spacing.md,
    paddingEnd: spacing.lg,
  });

  if (dishes.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <PremiumText variant="h2" color={colors.textPrimary}>
          Recommended For You
        </PremiumText>
        <Pressable
          onPress={() => router.push('/(tabs)/search')}
          hitSlop={8}
          accessibilityRole="button"
        >
          <PremiumText variant="bodyMedium" color={colors.textSecondary}>
            See All
          </PremiumText>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {dishes.map((dish) => (
          <RecommendedDishCard
            key={`${dish.restaurantId}-${dish.item.id}`}
            dish={dish}
            width={cardWidth}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  row: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
  },
});
