import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export type NutritionFact = {
  label: string;
  value: string;
};

type ProductNutritionSectionProps = {
  facts: NutritionFact[];
  onExpand?: () => void;
};

export function ProductNutritionSection({
  facts,
  onExpand,
}: ProductNutritionSectionProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.header}
        onPress={onExpand}
        accessibilityRole="button"
      >
        <Text style={styles.title}>Nutrition (per 100g)</Text>
        <AppSymbol
          name="chevron.right"
          size={14}
          tintColor={colors.textSecondary}
        />
      </Pressable>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {facts.map((fact) => (
          <View key={fact.label} style={styles.card}>
            <Text style={styles.cardLabel}>{fact.label}</Text>
            <Text style={styles.cardValue}>{fact.value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  row: {
    gap: spacing.sm,
  },
  card: {
    minWidth: 88,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
    gap: 2,
  },
  cardLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  cardValue: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.textPrimary,
  },
});
