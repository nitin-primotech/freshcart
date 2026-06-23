import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Category } from '@/features/catalog/types/catalog.types';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const TILE_SIZE = 76;
const TILE_RADIUS = 16;
const ITEM_GAP = spacing.md;

type FoodCategoryStripProps = {
  categories: Category[];
};

export function FoodCategoryStrip({ categories }: FoodCategoryStripProps) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={styles.row}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={styles.item}
            onPress={() => router.push(`/category/${cat.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Browse ${cat.name}`}
          >
            <View style={styles.tile}>
              <Image
                source={{ uri: cat.image }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
            </View>
            <Text style={styles.label} numberOfLines={2}>
              {cat.name}
            </Text>
          </Pressable>
        ))}

        <Pressable
          style={styles.item}
          onPress={() => router.push('/(tabs)/search')}
          accessibilityRole="button"
          accessibilityLabel="Browse more categories"
        >
          <View style={[styles.tile, styles.moreTile]}>
            <AppSymbol
              name="circle.grid.2x2.fill"
              size={24}
              tintColor={colors.textSecondary}
            />
          </View>
          <Text style={styles.label}>More</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
  },
  row: {
    paddingHorizontal: spacing.md,
    gap: ITEM_GAP,
  },
  item: {
    alignItems: 'center',
    width: TILE_SIZE + 4,
    gap: spacing.sm,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: TILE_RADIUS,
    backgroundColor: colors.backgroundElevated,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderCurve: 'continuous',
  },
  moreTile: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
