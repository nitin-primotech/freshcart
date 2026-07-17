import { Image } from 'expo-image';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import type { Category } from '@/features/catalog/types/catalog.types';
import { resolveCategoryImageUri } from '@/lib/firebase/category-images';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const TILE_BACKGROUNDS = [
  '#F1F8F2',
  '#FFF8E8',
  '#F3EEF8',
  '#EEF6FF',
  '#FCEEF5',
  '#FFF3E8',
  '#F2F7FF',
  '#F8F2EA',
] as const;

const GAP = 10;
const COLUMNS = 5; // Max 5 items per row
const TILE_BORDER_RADIUS = 14;

type GroceryCategoryGridProps = {
  categories: Category[];
  moreHref?: Href;
};

export function GroceryCategoryGrid({
  categories,
  moreHref,
}: GroceryCategoryGridProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const contentWidth = width - spacing.md * 2;
  // Compute square tile size based on screen width with 5 columns and gaps
  const tileSize = Math.floor((contentWidth - GAP * (COLUMNS - 1)) / COLUMNS);
  const imageSize = tileSize * 0.62;
  const visible = categories.slice(0, 14); // show up to 14 + view all = 15 = 3 rows of 5

  // Build rows of 5 items
  const allItems = [
    ...visible.map((cat) => ({ type: 'category' as const, cat })),
    { type: 'more' as const, cat: null },
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {allItems.map((entry, index) => {
          if (entry.type === 'more') {
            return (
              <Pressable
                key="view-all"
                style={[styles.item, { width: tileSize }]}
                onPress={() => moreHref && router.push(moreHref)}
                disabled={!moreHref}
                accessibilityRole="button"
                accessibilityLabel="View all categories"
              >
                <View
                  style={[
                    styles.tile,
                    styles.moreTile,
                    { width: tileSize, height: tileSize },
                  ]}
                >
                  <AppSymbol
                    name="circle.grid.2x2.fill"
                    size={22}
                    tintColor={colors.primary}
                  />
                </View>
                <Text style={styles.label}>View All</Text>
              </Pressable>
            );
          }

          const cat = entry.cat!;
          const imageUri = resolveCategoryImageUri(cat.image);
          if (!imageUri) return null;

          return (
            <Pressable
              key={cat.id}
              style={[styles.item, { width: tileSize }]}
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
                    backgroundColor:
                      TILE_BACKGROUNDS[index % TILE_BACKGROUNDS.length],
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
              <Text style={styles.label} numberOfLines={2}>
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
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  item: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  tile: {
    borderRadius: TILE_BORDER_RADIUS,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  moreTile: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
