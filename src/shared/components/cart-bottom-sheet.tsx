import { Image } from 'expo-image';
import { usePathname, useRouter, useSegments } from 'expo-router';
import { useMemo } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CartItem } from '@/features/catalog/types/catalog.types';
import { formatInr } from '@/features/checkout/utils/format-currency';
import { AppSymbol } from '@/shared/components/app-symbol';
import { CartLineStepper } from '@/shared/components/cart-line-stepper';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  closeCartSheet,
  prepareCheckoutNavigation,
  selectCartItemCount,
  selectCartItems,
  selectCartSubtotal,
  selectIsSheetOpen,
  updateCartQuantity,
  useCartStore,
} from '@/store/cart.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type RestaurantGroup = {
  restaurantId: string;
  restaurantName: string;
  lines: CartItem[];
};

function groupByRestaurant(items: CartItem[]): RestaurantGroup[] {
  const groups: RestaurantGroup[] = [];
  for (const line of items) {
    const existing = groups.find((g) => g.restaurantId === line.restaurantId);
    if (existing) {
      existing.lines.push(line);
    } else {
      groups.push({
        restaurantId: line.restaurantId,
        restaurantName: line.restaurantName,
        lines: [line],
      });
    }
  }
  return groups;
}

function CartLineRow({
  line,
  onAdjust,
}: {
  line: CartItem;
  onAdjust: (itemId: string, restaurantId: string, qty: number) => void;
}) {
  const lineTotal = line.item.price * line.quantity;

  return (
    <View style={styles.line}>
      <Image
        source={{ uri: line.item.image }}
        style={styles.thumb}
        contentFit="cover"
      />
      <View style={styles.lineMain}>
        <View style={styles.lineTop}>
          <Text style={styles.lineName} numberOfLines={2}>
            {line.item.name}
          </Text>
          <Text style={styles.linePrice}>{formatInr(lineTotal)}</Text>
        </View>
        <View style={styles.lineBottom}>
          <Text style={styles.lineEach}>{formatInr(line.item.price)} each</Text>
          <CartLineStepper
            quantity={line.quantity}
            onDecrease={() =>
              onAdjust(line.item.id, line.restaurantId, line.quantity - 1)
            }
            onIncrease={() =>
              onAdjust(line.item.id, line.restaurantId, line.quantity + 1)
            }
          />
        </View>
      </View>
    </View>
  );
}

export function CartBottomSheet() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const isOpen = useCartStore(selectIsSheetOpen);
  const items = useCartStore(selectCartItems);
  const subtotal = useCartStore(selectCartSubtotal);
  const itemCount = useCartStore(selectCartItemCount);

  const onCheckout = segments[0] === 'checkout';
  const sheetVisible = isOpen && !onCheckout;

  const groups = useMemo(() => groupByRestaurant(items), [items]);
  const savings = subtotal > 0 ? Math.min(subtotal * 0.12, 8) : 0;

  function handleClose() {
    closeCartSheet();
  }

  function adjustQty(itemId: string, restaurantId: string, qty: number) {
    hapticSoftTap();
    updateCartQuantity(itemId, qty, restaurantId);
  }

  function goCheckout() {
    hapticSoftTap();
    prepareCheckoutNavigation(pathname);
    router.push('/checkout');
  }

  return (
    <Modal
      visible={sheetVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View
          style={[
            styles.sheet,
            shadows.card,
            { paddingBottom: insets.bottom + spacing.sm },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Your cart</Text>
              <Text style={styles.subtitle}>
                {itemCount === 1 ? '1 item' : `${itemCount} items`}
                {groups.length > 1
                  ? ` · ${groups.length} restaurants`
                  : groups[0]
                    ? ` · ${groups[0].restaurantName}`
                    : ''}
              </Text>
            </View>
            <Pressable
              onPress={handleClose}
              style={styles.closeBtn}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close cart"
            >
              <AppSymbol
                name="xmark.circle.fill"
                size={20}
                tintColor={colors.textTertiary}
              />
            </Pressable>
          </View>

          {savings > 0 ? (
            <View style={styles.savingsPill}>
              <AppSymbol name="sparkles" size={12} tintColor={colors.success} />
              <Text style={styles.savingsText}>
                You save {formatInr(savings)} on this order
              </Text>
            </View>
          ) : null}

          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {groups.map((group, groupIndex) => (
              <View key={group.restaurantId} style={styles.group}>
                {groups.length > 1 ? (
                  <View style={styles.groupHeader}>
                    <AppSymbol
                      name="fork.knife"
                      size={12}
                      tintColor={colors.primary}
                    />
                    <Text style={styles.groupTitle}>
                      {group.restaurantName}
                    </Text>
                  </View>
                ) : null}
                {group.lines.map((line, lineIndex) => (
                  <View key={`${line.restaurantId}:${line.item.id}`}>
                    {lineIndex > 0 ? <View style={styles.divider} /> : null}
                    <CartLineRow line={line} onAdjust={adjustQty} />
                  </View>
                ))}
                {groupIndex < groups.length - 1 ? (
                  <View style={styles.groupDivider} />
                ) : null}
              </View>
            ))}

            <Pressable
              onPress={handleClose}
              style={styles.addMore}
              accessibilityRole="button"
            >
              <AppSymbol name="plus" size={12} tintColor={colors.primary} />
              <Text style={styles.addMoreText}>Add more items</Text>
            </Pressable>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatInr(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryMuted}>Delivery fee</Text>
              <Text style={styles.summaryFree}>Free</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatInr(subtotal)}</Text>
            </View>
            <Pressable
              style={styles.checkoutBtn}
              onPress={goCheckout}
              accessibilityRole="button"
              accessibilityLabel="Checkout"
            >
              <Text style={styles.checkoutLabel}>
                Checkout · {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: '82%',
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.md,
    borderCurve: 'continuous',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flex: 1,
    gap: 2,
    paddingRight: spacing.md,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successLight,
    borderRadius: 10,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginBottom: spacing.sm,
  },
  savingsText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.success,
  },
  list: {
    flexGrow: 0,
    maxHeight: 360,
  },
  listContent: {
    paddingBottom: spacing.sm,
  },
  group: {
    marginBottom: spacing.xs,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
    paddingTop: spacing.xxs,
  },
  groupTitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  groupDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  line: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
  },
  lineMain: {
    flex: 1,
    gap: 4,
  },
  lineTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  lineName: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  linePrice: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  lineBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineEach: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textTertiary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginLeft: 48 + spacing.sm,
  },
  addMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  addMoreText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primary,
  },
  footer: {
    gap: 6,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  summaryMuted: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textTertiary,
  },
  summaryFree: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.success,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.xs,
    paddingTop: 2,
  },
  totalLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderCurve: 'continuous',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  checkoutLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textInverse,
  },
});
