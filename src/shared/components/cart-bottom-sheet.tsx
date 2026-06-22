import { Image } from 'expo-image';
import { usePathname, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CartItem } from '@/features/catalog/types/catalog.types';
import { AppSymbol } from '@/shared/components/app-symbol';
import { CartLineStepper } from '@/shared/components/cart-line-stepper';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
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

function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
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
          <PremiumText
            variant="bodyMedium"
            numberOfLines={2}
            style={styles.lineName}
          >
            {line.item.name}
          </PremiumText>
          <PremiumText variant="bodyMedium" color={colors.textPrimary}>
            {formatPrice(lineTotal)}
          </PremiumText>
        </View>
        <View style={styles.lineBottom}>
          <PremiumText variant="caption" color={colors.textTertiary}>
            {formatPrice(line.item.price)} each
          </PremiumText>
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
  const insets = useSafeAreaInsets();
  const isOpen = useCartStore(selectIsSheetOpen);
  const items = useCartStore(selectCartItems);
  const subtotal = useCartStore(selectCartSubtotal);
  const itemCount = useCartStore(selectCartItemCount);

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
    router.push('/checkout');
    prepareCheckoutNavigation(pathname);
  }

  return (
    <Modal
      visible={isOpen}
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
              <PremiumText variant="h3">Your cart</PremiumText>
              <PremiumText variant="caption" color={colors.textSecondary}>
                {itemCount === 1 ? '1 item' : `${itemCount} items`}
                {groups.length > 1
                  ? ` · ${groups.length} restaurants`
                  : groups[0]
                    ? ` · ${groups[0].restaurantName}`
                    : ''}
              </PremiumText>
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
                size={22}
                tintColor={colors.textTertiary}
              />
            </Pressable>
          </View>

          {savings > 0 ? (
            <View style={styles.savingsPill}>
              <AppSymbol name="sparkles" size={14} tintColor={colors.success} />
              <PremiumText variant="captionMedium" color={colors.success}>
                You save {formatPrice(savings)} on this order
              </PremiumText>
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
                      size={14}
                      tintColor={colors.primary}
                    />
                    <PremiumText
                      variant="captionMedium"
                      color={colors.textPrimary}
                    >
                      {group.restaurantName}
                    </PremiumText>
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
              <AppSymbol name="plus" size={14} tintColor={colors.primary} />
              <PremiumText variant="captionMedium" color={colors.primary}>
                Add more items
              </PremiumText>
            </Pressable>
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <PremiumText variant="body" color={colors.textSecondary}>
                Subtotal
              </PremiumText>
              <PremiumText variant="bodyMedium">
                {formatPrice(subtotal)}
              </PremiumText>
            </View>
            <View style={styles.summaryRow}>
              <PremiumText variant="caption" color={colors.textTertiary}>
                Delivery fee
              </PremiumText>
              <PremiumText variant="captionMedium" color={colors.success}>
                Free
              </PremiumText>
            </View>
            <View style={styles.totalRow}>
              <PremiumText variant="bodyMedium">Total</PremiumText>
              <PremiumText variant="price">{formatPrice(subtotal)}</PremiumText>
            </View>
            <PremiumButton
              label={`Checkout · ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
              onPress={goCheckout}
            />
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
    paddingHorizontal: spacing.lg,
    borderCurve: 'continuous',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
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
  closeBtn: {
    width: 36,
    height: 36,
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
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
    borderCurve: 'continuous',
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
    marginBottom: spacing.sm,
    paddingTop: spacing.xxs,
  },
  groupDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  line: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundMuted,
    borderCurve: 'continuous',
  },
  lineMain: {
    flex: 1,
    gap: spacing.xs,
  },
  lineTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  lineName: {
    flex: 1,
  },
  lineBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginLeft: 52 + spacing.sm,
  },
  addMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  footer: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
});
