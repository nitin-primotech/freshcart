import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const FEATURES = [
  {
    id: 'express',
    icon: 'bolt.fill' as const,
    label: 'Express Delivery',
    value: '15–30 mins',
  },
  {
    id: 'free',
    icon: 'gift.fill' as const,
    label: 'Free Delivery',
    value: 'On orders $35+',
  },
  {
    id: 'prices',
    icon: 'tag.fill' as const,
    label: 'Best Prices',
    value: 'Everyday',
  },
] as const;

export function DeliveryFeatureChips() {
  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {FEATURES.map((feature) => (
        <View key={feature.id} style={styles.chip}>
          <View style={styles.iconWrap}>
            <AppSymbol
              name={feature.icon}
              size={14}
              tintColor={colors.primary}
              weight="semibold"
            />
          </View>
          <View style={styles.copy}>
            <Text style={styles.label}>{feature.label}</Text>
            <Text style={styles.value}>{feature.value}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    gap: 1,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  value: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textPrimary,
  },
});
