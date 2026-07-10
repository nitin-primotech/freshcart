import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatInr } from '@/features/checkout/utils/format-currency';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type OrdersSummaryCardProps = {
  totalOrders: number;
  totalSpent: number;
  onViewDetails?: () => void;
};

export function OrdersSummaryCard({
  totalOrders,
  totalSpent,
  onViewDetails,
}: OrdersSummaryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatInr(totalSpent)}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
      </View>
      {onViewDetails ? (
        <Pressable
          onPress={onViewDetails}
          style={styles.detailsBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="View order details"
        >
          <Text style={styles.detailsText}>View Details</Text>
          <AppSymbol
            name="chevron.right"
            size={12}
            tintColor={colors.primary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.16)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(212, 84, 60, 0.2)',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: spacing.xs,
  },
  detailsText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
});
