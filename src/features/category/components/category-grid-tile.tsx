import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Category } from '@/features/catalog/types/catalog.types';
import { resolveCategoryImageUri } from '@/lib/firebase/category-images';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type CategoryGridTileProps = {
  category: Category;
  width: number;
};

export function CategoryGridTile({ category, width }: CategoryGridTileProps) {
  const router = useRouter();
  const imageUri = resolveCategoryImageUri(category.image);

  return (
    <Pressable
      style={[styles.tile, { width }]}
      onPress={() => router.push(`/category/${category.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Browse ${category.name}`}
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
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: 2,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    minHeight: 92,
  },
  imageWrap: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 42,
    height: 42,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textPrimary,
    textAlign: 'center',
    minHeight: 22,
  },
});
