import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type {
  Category,
  Restaurant,
} from '@/features/catalog/types/catalog.types';
import { countRestaurantsForCategory } from '@/features/search/utils/search-suggestions';
import { resolveCategoryImageUri } from '@/lib/firebase/category-images';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type SearchCuisineCarouselProps = {
  categories: Category[];
  restaurants: Restaurant[];
  onSelect: (category: Category) => void;
};

export function SearchCuisineCarousel({
  categories,
  restaurants,
  onSelect,
}: SearchCuisineCarouselProps) {
  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((category) => {
        const count = countRestaurantsForCategory(restaurants, category.id);
        return (
          <Pressable
            key={category.id}
            style={styles.card}
            onPress={() => {
              hapticSoftTap();
              onSelect(category);
            }}
            accessibilityRole="button"
            accessibilityLabel={`${category.name}, ${count} restaurants`}
          >
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: resolveCategoryImageUri(category.image) }}
                style={styles.image}
                contentFit="cover"
              />
            </View>
            <Text style={styles.name}>{category.name}</Text>
            <Text style={styles.count}>{count} restaurants</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  card: {
    width: 112,
    gap: 4,
  },
  imageWrap: {
    width: 112,
    height: 112,
    borderRadius: 14,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.backgroundMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  count: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
});
