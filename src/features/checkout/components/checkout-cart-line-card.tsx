import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CartItem } from '@/features/catalog/types/catalog.types';
import {
  deriveDiscountPercent,
  deriveMrp,
  formatInr,
} from '@/features/checkout/utils/format-currency';
import { AppSymbol } from '@/shared/components/app-symbol';
import { CartLineStepper } from '@/shared/components/cart-line-stepper';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type CheckoutCartLineCardProps = {
  line: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

function formatDeliveryEta(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = tomorrow.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
  return `Tomorrow, ${day}`;
}

function formatServing(line: CartItem): string {
  if (line.item.calories) return `${line.item.calories} cal`;
  return '1 serving';
}

export function CheckoutCartLineCard({
  line,
  onDecrease,
  onIncrease,
  onRemove,
}: CheckoutCartLineCardProps) {
  const mrp = deriveMrp(line.item.price);
  const discount = deriveDiscountPercent(line.item.price, mrp);
  const lineTotal = line.item.price * line.quantity;
  const showFreshBadge = line.item.isVegetarian ?? false;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Image
          source={{ uri: line.item.image }}
          style={styles.thumb}
          contentFit="cover"
        />
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2}>
            {line.item.name}
          </Text>
          <Text style={styles.meta}>{formatServing(line)}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatInr(lineTotal)}</Text>
            <Text style={styles.mrp}>{formatInr(mrp * line.quantity)}</Text>
            {discount > 0 ? (
              <Text style={styles.off}>{discount}% OFF</Text>
            ) : null}
          </View>
          <View style={styles.deliveryRow}>
            <AppSymbol name="clock" size={12} tintColor={colors.success} />
            <Text style={styles.deliveryText}>
              Delivery by{' '}
              <Text style={styles.deliveryBold}>{formatDeliveryEta()}</Text>
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            hapticSoftTap();
            onRemove();
          }}
          hitSlop={10}
          style={styles.trash}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${line.item.name}`}
        >
          <AppSymbol name="trash" size={18} tintColor={colors.textTertiary} />
        </Pressable>
      </View>

      <View style={styles.stepperRow}>
        <CartLineStepper
          quantity={line.quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </View>

      {showFreshBadge ? (
        <View style={styles.freshBadge}>
          <AppSymbol name="leaf.fill" size={12} tintColor={colors.success} />
          <Text style={styles.freshText}>This is a fresh item</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
  },
  body: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
    paddingRight: spacing.lg,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  off: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.success,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  deliveryText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  deliveryBold: {
    fontFamily: fonts.semibold,
    color: colors.success,
  },
  trash: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  stepperRow: {
    alignItems: 'flex-end',
  },
  freshBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successLight,
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  freshText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.success,
  },
});
