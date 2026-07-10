import { StyleSheet, Text, View } from 'react-native';

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
    bg: '#F0FAF0',
  },
  {
    id: 'free',
    icon: 'truck.box.fill' as const,
    label: 'Free Delivery',
    value: 'On orders $35+',
    bg: '#F0F7FF',
  },
  {
    id: 'prices',
    icon: 'tag.fill' as const,
    label: 'Best Prices',
    value: 'Everyday',
    bg: '#F5F5F5',
  },
] as const;

export function DeliveryFeatureChips() {
  return (
    <View style={styles.row}>
      {FEATURES.map((feature) => (
        <View
          key={feature.id}
          style={[styles.chip, { backgroundColor: feature.bg }]}
        >
          <View style={styles.iconWrap}>
            <AppSymbol
              name={feature.icon}
              size={12}
              tintColor={colors.primary}
              weight="semibold"
            />
          </View>
          <View style={styles.copy}>
            <Text style={styles.label} numberOfLines={1}>
              {feature.label}
            </Text>
            <Text style={styles.value} numberOfLines={1}>
              {feature.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: 6,
    paddingTop: spacing.sm,
    paddingBottom: 2,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 10,
    borderCurve: 'continuous',
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 0,
    marginBottom: spacing.xxs,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textPrimary,
  },
  value: {
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textSecondary,
  },
});
