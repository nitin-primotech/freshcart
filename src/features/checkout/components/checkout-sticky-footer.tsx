import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatInr } from '@/features/checkout/utils/format-currency';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type CheckoutStickyFooterProps = {
  total: number;
  savings: number;
  isPlacing: boolean;
  disabled: boolean;
  onPlaceOrder: () => void;
  onViewPriceDetails: () => void;
};

export function CheckoutStickyFooter({
  total,
  savings,
  isPlacing,
  disabled,
  onPlaceOrder,
  onViewPriceDetails,
}: CheckoutStickyFooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + spacing.sm }]}>
      <View style={styles.left}>
        <Text style={styles.total}>{formatInr(total)}</Text>
        <Pressable
          onPress={onViewPriceDetails}
          hitSlop={8}
          style={styles.detailsLink}
          accessibilityRole="button"
          accessibilityLabel="View price details"
        >
          <Text style={styles.detailsText}>View Price Details</Text>
          <AppSymbol name="chevron.up" size={12} tintColor={colors.primary} />
        </Pressable>
      </View>

      <Pressable
        style={[styles.placeBtn, disabled && styles.placeBtnDisabled]}
        onPress={onPlaceOrder}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Place order"
      >
        {isPlacing ? (
          <ActivityIndicator color={colors.textInverse} />
        ) : (
          <>
            <Text style={styles.placeLabel}>Place Order</Text>
            {savings > 0 ? (
              <Text style={styles.placeSub}>
                You will save {formatInr(savings)} on this order
              </Text>
            ) : null}
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  left: {
    gap: 2,
    minWidth: 100,
  },
  total: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
  placeBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  placeBtnDisabled: {
    opacity: 0.5,
  },
  placeLabel: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textInverse,
  },
  placeSub: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    textAlign: 'center',
  },
});
