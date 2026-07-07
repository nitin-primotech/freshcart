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

const TILE_SIZE = 56;
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
  const columns = 4;
  const itemWidth = contentWidth / columns;
  const visible = categories.slice(0, 12);

  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {visible.map((cat, index) => {
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
                    backgroundColor:
                      TILE_BACKGROUNDS[index % TILE_BACKGROUNDS.length],
                  },
                ]}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
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

        <Pressable
          style={[styles.item, { width: itemWidth }]}
          onPress={() => moreHref && router.push(moreHref)}
          disabled={!moreHref}
          accessibilityRole="button"
          accessibilityLabel="View all categories"
        >
          <View style={[styles.tile, styles.moreTile]}>
            <AppSymbol
              name="circle.grid.2x2.fill"
              size={22}
              tintColor={colors.primary}
            />
          </View>
          <Text style={styles.label}>View All</Text>
        </Pressable>
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
  },
  item: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: TILE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    overflow: 'visible',
  },
  moreTile: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: 46,
    height: 46,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
