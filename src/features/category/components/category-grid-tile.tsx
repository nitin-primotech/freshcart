import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Category } from '@/features/catalog/types/catalog.types';
import { categoryPath } from '@/features/category/utils/category-path';
import { resolveCategoryImageUri } from '@/lib/firebase/category-images';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type CategoryGridTileProps = {
  category: Category;
  width: number;
};

export function CategoryGridTile({ category, width }: CategoryGridTileProps) {
  const router = useRouter();
  const imageUri = resolveCategoryImageUri(category.image);

  // The square container size is the tile width
  const cardSize = width;
  const imageSize = cardSize * 0.72;

  return (
    <Pressable
      style={[styles.tile, { width }]}
      onPress={() => router.push(categoryPath(category.id))}
      accessibilityRole="button"
      accessibilityLabel={`Browse ${category.name}`}
    >
      <View style={[styles.card, { width: cardSize, height: cardSize }]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: imageSize, height: imageSize }}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <AppSymbol
            name={category.icon}
            size={28}
            tintColor={colors.primary}
          />
        )}
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
    marginBottom: spacing.sm,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F2FAF5', // Soft mint pastel background matching FreshCart
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 2,
    minHeight: 24,
  },
});
