import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import type { Category } from '@/features/catalog/types/catalog.types';
import { PremiumText } from '@/shared/components/premium-text';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const ITEM_SIZE = 72;
const ITEM_GAP = spacing.lg;

type FoodCategoryStripProps = {
  categories: Category[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
};

export function FoodCategoryStrip({
  categories,
  selectedId,
  onSelect,
}: FoodCategoryStripProps) {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={styles.row}
      >
        {categories.map((cat) => {
          const active = selectedId === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={styles.item}
              onPress={() => onSelect?.(active ? null : cat.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <View
                style={[
                  styles.circle,
                  shadows.soft,
                  active && styles.circleActive,
                ]}
              >
                <Image
                  source={{ uri: cat.image }}
                  style={styles.image}
                  contentFit="cover"
                  transition={200}
                />
              </View>
              <PremiumText
                variant="captionMedium"
                color={active ? colors.textPrimary : colors.textSecondary}
                numberOfLines={1}
              >
                {cat.name}
              </PremiumText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.sm,
  },
  row: {
    paddingHorizontal: spacing.lg,
    gap: ITEM_GAP,
    paddingVertical: spacing.xs,
  },
  item: {
    alignItems: 'center',
    width: ITEM_SIZE + 8,
    gap: spacing.sm,
  },
  circle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderCurve: 'continuous',
  },
  circleActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
