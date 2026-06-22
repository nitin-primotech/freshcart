import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  fetchPromos,
  fetchRestaurants,
} from '@/features/catalog/api/catalog.api';
import type { Promo } from '@/features/catalog/types/catalog.types';
import { CheckoutUpsellCard } from '@/features/checkout/components/checkout-upsell-card';
import {
  CHECKOUT_OFFICE_ADDRESS,
  type CheckoutAddress,
  computeOfferDiscount,
  PAYMENT_METHODS,
} from '@/features/checkout/constants/checkout.constants';
import { getRecommendedDishes } from '@/features/home/utils/get-recommended-dishes';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticSoftTap, hapticSuccess } from '@/shared/haptics/feedback';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { selectAddress, useAppStore } from '@/store/app.store';
import {
  cartLineKey,
  clearCart,
  selectCartItems,
  selectCartSubtotal,
  useCartStore,
} from '@/store/cart.store';
import {
  placeOrder,
  selectIsPlacing,
  useOrdersStore,
} from '@/store/orders.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const TIPS = [0, 2, 4, 6] as const;

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <PremiumText variant="h3">{title}</PremiumText>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <PremiumText variant="captionMedium" color={colors.primary}>
            {action}
          </PremiumText>
        </Pressable>
      ) : null}
    </View>
  );
}

function RadioMark({ selected }: { selected: boolean }) {
  return selected ? (
    <AppSymbol
      name="checkmark.circle.fill"
      size={22}
      tintColor={colors.primary}
    />
  ) : (
    <View style={styles.radioEmpty} />
  );
}

function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const items = useCartStore(selectCartItems);
  const subtotal = useCartStore(selectCartSubtotal);
  const savedAddress = useAppStore(selectAddress);
  const isPlacing = useOrdersStore(selectIsPlacing);

  const [tip, setTip] = useState(2);
  const [addressId, setAddressId] = useState('home');
  const [paymentId, setPaymentId] = useState('card');
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);

  const { data: promos = [] } = useSimulatedQuery(
    (signal) => fetchPromos(signal),
    [],
  );
  const { data: restaurants = [] } = useSimulatedQuery(
    (signal) => fetchRestaurants(signal),
    [],
  );

  const upsellCardWidth = useCarouselItemWidth({
    visibleCount: 2.4,
    peek: 0.2,
    gap: spacing.sm,
    paddingStart: 0,
    paddingEnd: spacing.lg,
  });

  const homeAddress: CheckoutAddress = {
    id: 'home',
    label: savedAddress.label,
    line1: savedAddress.line1,
    line2: savedAddress.line2,
  };
  const addresses = [homeAddress, CHECKOUT_OFFICE_ADDRESS];

  const cartKeys = useMemo(
    () =>
      new Set(
        items.map((line) => cartLineKey(line.restaurantId, line.item.id)),
      ),
    [items],
  );

  const upsellDishes = useMemo(() => {
    const cartRestaurantIds = new Set(items.map((line) => line.restaurantId));
    return getRecommendedDishes(restaurants, 16)
      .filter(
        (dish) => !cartKeys.has(cartLineKey(dish.restaurantId, dish.item.id)),
      )
      .sort((a, b) => {
        const aSame = cartRestaurantIds.has(a.restaurantId) ? 1 : 0;
        const bSame = cartRestaurantIds.has(b.restaurantId) ? 1 : 0;
        return bSame - aSame;
      })
      .slice(0, 6);
  }, [restaurants, items, cartKeys]);

  const offerBenefit = appliedPromo
    ? computeOfferDiscount(appliedPromo.code, subtotal)
    : { discount: 0, freeDelivery: false };

  const deliveryFee = items.length > 0 && !offerBenefit.freeDelivery ? 2.99 : 0;
  const discount = offerBenefit.discount;
  const total = Math.max(subtotal - discount + deliveryFee + tip, 0);
  const restaurant = items[0];
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

  function togglePromo(promo: Promo) {
    hapticSoftTap();
    setAppliedPromo((current) => (current?.id === promo.id ? null : promo));
  }

  async function handlePay() {
    if (!restaurant || isPlacing) return;
    hapticSuccess();
    await placeOrder({
      items,
      subtotal,
      deliveryFee,
      tip,
      address: `${addresses.find((a) => a.id === addressId)?.line1 ?? savedAddress.line1}, ${savedAddress.line2}`,
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.restaurantName,
      restaurantLogo: '',
    });
    clearCart();
    router.replace('/order-success');
  }

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: spacing.xl }]}
      >
        {/* Order summary */}
        <Animated.View entering={FadeInDown.duration(320)}>
          <SectionHeader title="Order summary" />
          <View style={[styles.card, shadows.soft]}>
            {items.map((line, index) => (
              <View key={cartLineKey(line.restaurantId, line.item.id)}>
                {index > 0 ? <View style={styles.itemDivider} /> : null}
                <View style={styles.orderLine}>
                  <Image
                    source={{ uri: line.item.image }}
                    style={styles.orderThumb}
                    contentFit="cover"
                  />
                  <View style={styles.orderBody}>
                    <PremiumText variant="bodyMedium" numberOfLines={1}>
                      {line.item.name}
                    </PremiumText>
                    <PremiumText variant="caption" color={colors.textTertiary}>
                      {line.restaurantName} · Qty {line.quantity}
                    </PremiumText>
                  </View>
                  <PremiumText variant="bodyMedium">
                    {formatPrice(line.item.price * line.quantity)}
                  </PremiumText>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Delivery location */}
        <Animated.View entering={FadeInDown.delay(60).duration(320)}>
          <SectionHeader title="Delivery location" action="Add new" />
          <View style={styles.stackGap}>
            {addresses.map((address) => {
              const selected = addressId === address.id;
              return (
                <Pressable
                  key={address.id}
                  onPress={() => {
                    hapticSoftTap();
                    setAddressId(address.id);
                  }}
                  style={[
                    styles.selectCard,
                    selected && styles.selectCardActive,
                  ]}
                >
                  <RadioMark selected={selected} />
                  <View style={styles.selectBody}>
                    <PremiumText variant="bodyMedium">
                      {address.label}
                    </PremiumText>
                    <PremiumText variant="caption" color={colors.textSecondary}>
                      {address.line1}, {address.line2}
                    </PremiumText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Delivery estimate */}
        <View style={styles.estimatePill}>
          <AppSymbol name="clock" size={16} tintColor={colors.primary} />
          <PremiumText variant="captionMedium" color={colors.textPrimary}>
            Arriving in 25–35 min
          </PremiumText>
        </View>

        {/* Offers */}
        <Animated.View entering={FadeInDown.delay(120).duration(320)}>
          <SectionHeader title="Offers & coupons" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offerRow}
          >
            {promos.slice(0, 4).map((promo) => {
              const active = appliedPromo?.id === promo.id;
              return (
                <Pressable
                  key={promo.id}
                  onPress={() => togglePromo(promo)}
                  style={[styles.offerCard, active && styles.offerCardActive]}
                >
                  <LinearGradient
                    colors={promo.gradient}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.offerGradient}
                  >
                    <PremiumText
                      variant="captionMedium"
                      color={colors.textInverse}
                    >
                      {promo.title}
                    </PremiumText>
                    <PremiumText
                      variant="caption"
                      color={colors.textOnDarkMuted}
                      numberOfLines={1}
                    >
                      {promo.code}
                    </PremiumText>
                    {active ? (
                      <View style={styles.appliedBadge}>
                        <PremiumText
                          variant="overline"
                          color={colors.textInverse}
                        >
                          Applied
                        </PremiumText>
                      </View>
                    ) : null}
                  </LinearGradient>
                </Pressable>
              );
            })}
          </ScrollView>
          {appliedPromo ? (
            <PremiumText
              variant="caption"
              color={colors.success}
              style={styles.appliedNote}
            >
              {appliedPromo.subtitle}
            </PremiumText>
          ) : null}
        </Animated.View>

        {/* Payment */}
        <Animated.View entering={FadeInDown.delay(180).duration(320)}>
          <SectionHeader title="Payment method" action="Add new" />
          <View style={styles.stackGap}>
            {PAYMENT_METHODS.map((method) => {
              const selected = paymentId === method.id;
              return (
                <Pressable
                  key={method.id}
                  onPress={() => {
                    hapticSoftTap();
                    setPaymentId(method.id);
                  }}
                  style={[
                    styles.selectCard,
                    selected && styles.selectCardActive,
                  ]}
                >
                  <View style={styles.paymentIcon}>
                    <AppSymbol
                      name={method.icon}
                      size={18}
                      tintColor={colors.primary}
                    />
                  </View>
                  <View style={styles.selectBody}>
                    <PremiumText variant="bodyMedium">
                      {method.label}
                    </PremiumText>
                    <PremiumText variant="caption" color={colors.textSecondary}>
                      {method.detail ?? method.subtitle}
                    </PremiumText>
                  </View>
                  <RadioMark selected={selected} />
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Upsell recommendations */}
        {upsellDishes.length > 0 ? (
          <Animated.View entering={FadeInDown.delay(240).duration(320)}>
            <SectionHeader title="Complete your order" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.upsellRow}
            >
              {upsellDishes.map((dish) => (
                <CheckoutUpsellCard
                  key={`${dish.restaurantId}-${dish.item.id}`}
                  dish={dish}
                  width={upsellCardWidth}
                />
              ))}
            </ScrollView>
          </Animated.View>
        ) : null}

        {/* Tip */}
        <View style={styles.block}>
          <PremiumText variant="h3">Add a tip</PremiumText>
          <View style={styles.tips}>
            {TIPS.map((amount) => {
              const selected = tip === amount;
              return (
                <Pressable
                  key={amount}
                  onPress={() => {
                    hapticSoftTap();
                    setTip(amount);
                  }}
                  style={[styles.tipChip, selected && styles.tipChipActive]}
                >
                  <PremiumText
                    variant="captionMedium"
                    color={selected ? colors.textInverse : colors.textPrimary}
                  >
                    {amount === 0 ? 'No tip' : `$${amount}`}
                  </PremiumText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Bill summary */}
        <View style={[styles.card, shadows.soft]}>
          <View style={styles.billRow}>
            <PremiumText variant="body" color={colors.textSecondary}>
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </PremiumText>
            <PremiumText variant="bodyMedium">
              {formatPrice(subtotal)}
            </PremiumText>
          </View>
          {discount > 0 ? (
            <View style={styles.billRow}>
              <PremiumText variant="body" color={colors.success}>
                Coupon savings
              </PremiumText>
              <PremiumText variant="bodyMedium" color={colors.success}>
                −{formatPrice(discount)}
              </PremiumText>
            </View>
          ) : null}
          <View style={styles.billRow}>
            <PremiumText variant="body" color={colors.textSecondary}>
              Delivery
            </PremiumText>
            <PremiumText
              variant="bodyMedium"
              color={deliveryFee === 0 ? colors.success : colors.textPrimary}
            >
              {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
            </PremiumText>
          </View>
          <View style={styles.billRow}>
            <PremiumText variant="body" color={colors.textSecondary}>
              Tip
            </PremiumText>
            <PremiumText variant="bodyMedium">{formatPrice(tip)}</PremiumText>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <PremiumText variant="h3">Total</PremiumText>
            <PremiumText variant="price">{formatPrice(total)}</PremiumText>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          shadows.card,
          { paddingBottom: insets.bottom + spacing.sm },
        ]}
      >
        <PremiumButton
          label={
            isPlacing
              ? 'Processing…'
              : paymentId === 'cod'
                ? `Place order · ${formatPrice(total)}`
                : `Confirm payment · ${formatPrice(total)}`
          }
          onPress={handlePay}
          disabled={items.length === 0 || isPlacing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderCurve: 'continuous',
  },
  stackGap: {
    gap: spacing.sm,
  },
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderCurve: 'continuous',
  },
  selectCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundElevated,
  },
  selectBody: {
    flex: 1,
    gap: 2,
  },
  radioEmpty: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.borderStrong,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  orderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  orderThumb: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundMuted,
  },
  orderBody: {
    flex: 1,
    gap: 2,
  },
  itemDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.xs,
  },
  estimatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderCurve: 'continuous',
  },
  offerRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  offerCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  offerCardActive: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  offerGradient: {
    width: 148,
    height: 72,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  appliedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  appliedNote: {
    marginTop: spacing.xs,
  },
  upsellRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  block: {
    gap: spacing.sm,
  },
  tips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tipChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderCurve: 'continuous',
  },
  tipChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
});
