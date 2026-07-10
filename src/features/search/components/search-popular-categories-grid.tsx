import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Category } from '@/features/catalog/types/catalog.types';
import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { resolveCategoryImageUri } from '@/lib/firebase/category-images';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type SearchPopularCategoriesGridProps = {
  categories: Category[];
  onSelect: (category: Category) => void;
};

export function SearchPopularCategoriesGrid({
  categories,
  onSelect,
}: SearchPopularCategoriesGridProps) {
  const visible = categories.slice(0, 8);

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title="Popular Searches" />
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {visible.map((category) => {
          const imageUri = resolveCategoryImageUri(category.image);
          return (
            <Pressable
              key={category.id}
              style={styles.card}
              onPress={() => {
                hapticSoftTap();
                onSelect(category);
              }}
              accessibilityRole="button"
              accessibilityLabel={category.name}
            >
              <View style={styles.imageWrap}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    contentFit="contain"
                    transition={200}
                  />
                ) : null}
              </View>
              <Text style={styles.label} numberOfLines={2}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xs,
  },
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  card: {
    width: 76,
    alignItems: 'center',
    gap: 6,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textPrimary,
    textAlign: 'center',
    minHeight: 24,
  },
});
