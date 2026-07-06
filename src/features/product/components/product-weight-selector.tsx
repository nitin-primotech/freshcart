import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatUsd } from '@/features/checkout/utils/format-currency';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export type WeightOption = {
  id: string;
  label: string;
  price: number;
};

type ProductWeightSelectorProps = {
  options: WeightOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ProductWeightSelector({
  options,
  selectedId,
  onSelect,
}: ProductWeightSelectorProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Weight</Text>
        <Pressable accessibilityRole="button">
          <Text style={styles.link}>How much do I need?</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <Pressable
              key={option.id}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => onSelect(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              <Text
                style={[
                  styles.optionLabel,
                  selected && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.optionPrice,
                  selected && styles.optionPriceSelected,
                ]}
              >
                {formatUsd(option.price)}
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
  link: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 17,
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    minWidth: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    gap: 2,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.successLight,
  },
  optionLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  optionPrice: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  optionPriceSelected: {
    color: colors.primaryDark,
  },
});
