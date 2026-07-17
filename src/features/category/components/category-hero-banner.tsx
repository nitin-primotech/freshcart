import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import type { Category } from '@/features/catalog/types/catalog.types';
import { resolveCategoryImageUri } from '@/lib/firebase/category-images';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type CategoryHeroBannerProps = {
  category: Category;
  productCount: number;
};

export function CategoryHeroBanner({
  category,
  productCount,
}: CategoryHeroBannerProps) {
  const imageUri = resolveCategoryImageUri(category.image);

  return (
    <View style={styles.wrap}>
      <View style={styles.banner}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.heroImage}
            contentFit="contain"
            transition={200}
          />
        ) : null}
        <View style={styles.copy}>
          <Text style={styles.title}>{category.name}</Text>
          <Text style={styles.subtitle}>
            {productCount} items available · tap to view details
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.successLight,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(36, 155, 66, 0.15)',
  },
  heroImage: {
    width: 72,
    height: 72,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
