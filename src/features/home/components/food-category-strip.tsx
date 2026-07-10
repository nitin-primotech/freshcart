import { Image } from 'expo-image';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import type { Category } from '@/features/catalog/types/catalog.types';
import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { resolveCategoryImageUri } from '@/lib/firebase/category-images';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const VISIBLE_COUNT = 5;
const GRID_H_PADDING = spacing.md;

type FoodCategoryStripProps = {
  categories: Category[];
  moreHref?: Href;
};

function useCategoryGridMetrics(screenWidth: number) {
  return useMemo(() => {
    const contentWidth = screenWidth - GRID_H_PADDING * 2;
    const itemWidth = contentWidth / VISIBLE_COUNT;
    const tileSize = Math.round(Math.min(64, Math.max(48, itemWidth * 0.72)));
    const tileRadius = Math.max(radius.sm, Math.round(tileSize * 0.22));
    const imageSize = Math.round(tileSize * 0.76);
    const labelSize = Math.max(9, Math.min(11, Math.round(itemWidth * 0.1)));

    return { itemWidth, tileSize, tileRadius, imageSize, labelSize };
  }, [screenWidth]);
}

export function FoodCategoryStrip({
  categories,
  moreHref,
}: FoodCategoryStripProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { itemWidth, tileSize, tileRadius, imageSize, labelSize } =
    useCategoryGridMetrics(width);
  const visible = categories.slice(0, VISIBLE_COUNT);

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title="Shop by Category" href={moreHref} />
      <View style={styles.grid}>
        {visible.map((cat) => {
          const imageUri = resolveCategoryImageUri(cat.image);
          if (!imageUri) return null;

          return (
            <Pressable
              key={cat.id}
              style={[styles.item, { width: itemWidth }]}
              onPress={() => router.push(`/category/${cat.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Browse ${cat.name}`}
            >
              <View
                style={[
                  styles.tile,
                  {
                    width: tileSize,
                    height: tileSize,
                    borderRadius: tileRadius,
                  },
                ]}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: imageSize, height: imageSize }}
                  contentFit="contain"
                  transition={200}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  { fontSize: labelSize, lineHeight: labelSize + 2 },
                ]}
                numberOfLines={2}
              >
                {cat.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: GRID_H_PADDING,
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  tile: {
    borderCurve: 'continuous',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    overflow: 'hidden',
  },
  label: {
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
