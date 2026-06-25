import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckoutCartLineCard } from '@/features/checkout/components/checkout-cart-line-card';
import { CheckoutPaymentTrailingLogos } from '@/features/checkout/components/checkout-payment-trailing-logos';
import { CheckoutSavingsBanner } from '@/features/checkout/components/checkout-savings-banner';
import { CheckoutStickyFooter } from '@/features/checkout/components/checkout-sticky-footer';
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  PAYMENT_METHODS,
  PLATFORM_FEE,
} from '@/features/checkout/constants/checkout.constants';
import {
  openFoodRushCheckout,
  RazorpayPaymentCancelledError,
  RazorpayUnavailableError,
} from '@/features/checkout/services/razorpay.service';
import {
  deriveMrp,
  formatInr,
} from '@/features/checkout/utils/format-currency';
import { isFirebaseConfigured } from '@/lib/firebase';
import { AppSymbol } from '@/shared/components/app-symbol';
import { MerchantOfflineBanner } from '@/shared/components/merchant-offline-banner';
import { hapticSoftTap, hapticSuccess } from '@/shared/haptics/feedback';
import { selectAddress, selectUserName, useAppStore } from '@/store/app.store';
import { selectUserPhone, useAuthStore } from '@/store/auth.store';
import {
  cartLineKey,
  clearCart,
  handleCheckoutBack,
  removeFromCart,
  selectCartItems,
  selectCartSubtotal,
  updateCartQuantity,
  useCartStore,
} from '@/store/cart.store';
import {
  selectMerchantIsOnline,
  selectMerchantReady,
  useMerchantStore,
} from '@/store/merchant.store';
import {
  placeOrder,
  selectIsPlacing,
  useOrdersStore,
} from '@/store/orders.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

function RadioMark({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radio, selected && styles.radioSelected]}>
      {selected ? <View style={styles.radioDot} /> : null}
    </View>
  );
}

export function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [priceSectionY, setPriceSectionY] = useState(0);

  const items = useCartStore(selectCartItems);
  const subtotal = useCartStore(selectCartSubtotal);
  const savedAddress = useAppStore(selectAddress);
  const userName = useAppStore(selectUserName);
  const userPhone = useAuthStore(selectUserPhone);
  const isPlacing = useOrdersStore(selectIsPlacing);
  const merchantReady = useMerchantStore(selectMerchantReady);
  const merchantIsOnline = useMerchantStore(selectMerchantIsOnline);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [paymentId, setPaymentId] = useState('upi');

  const isProcessing = isPlacing || isPaying;
  const merchantOffline = merchantReady && !merchantIsOnline;

  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);

  const paymentPrefill = useMemo(
    () => ({
      name: userName,
      contact: userPhone,
      email: userPhone ? `${userPhone.replace(/\D/g, '')}@foodrush.app` : null,
    }),
    [userName, userPhone],
  );

  const itemMrpSavings = useMemo(
    () =>
      items.reduce((sum, line) => {
        const mrp = deriveMrp(line.item.price);
        return sum + (mrp - line.item.price) * line.quantity;
      }, 0),
    [items],
  );

  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = items.length > 0 && !freeDelivery ? DELIVERY_FEE : 0;
  const displaySavings = Math.round(itemMrpSavings);
  const total = Math.max(subtotal + deliveryFee + PLATFORM_FEE, 0);

  const restaurant = items[0];
  const fullAddress = `${savedAddress.line1}, ${savedAddress.line2}`;

  function scrollToPriceDetails() {
    scrollRef.current?.scrollTo({
      y: Math.max(priceSectionY - spacing.md, 0),
      animated: true,
    });
  }

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleCheckoutBack(router);
        return true;
      },
    );
    return () => subscription.remove();
  }, [router]);

  async function submitOrder() {
    await placeOrder({
      items,
      subtotal,
      deliveryFee: deliveryFee + PLATFORM_FEE,
      tip: 0,
      address: fullAddress,
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.restaurantName,
      restaurantLogo: '',
      customerId: userPhone ?? undefined,
      customerName: userName ?? undefined,
      customerPhone: userPhone ?? undefined,
    });
    clearCart();
    router.replace('/order-success');
  }

  async function handlePlaceOrder() {
    if (!restaurant || isProcessing) return;

    if (merchantOffline) {
      Alert.alert(
        'Restaurant offline',
        'This restaurant is not accepting orders right now. Please try again later.',
      );
      return;
    }

    setPaymentError(null);
    setIsPaying(true);

    try {
      const skipPaymentForFirebaseDev =
        isFirebaseConfigured() && process.env.NODE_ENV !== 'production';

      if (!skipPaymentForFirebaseDev) {
        await openFoodRushCheckout({
          amountInr: total,
          prefill: paymentPrefill,
          description: 'Food Service Payment',
        });
      }

      hapticSuccess();
      await submitOrder();
    } catch (error) {
      if (error instanceof RazorpayPaymentCancelledError) {
        return;
      }
      if (error instanceof RazorpayUnavailableError && isFirebaseConfigured()) {
        hapticSuccess();
        await submitOrder();
        return;
      }
      if (error instanceof RazorpayUnavailableError) {
        Alert.alert('Payments unavailable', error.message);
        return;
      }
      const message =
        error instanceof Error ? error.message : 'Payment failed. Try again.';
      setPaymentError(message);
      Alert.alert('Payment failed', message);
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <Pressable
          onPress={() => {
            hapticSoftTap();
            handleCheckoutBack(router);
          }}
          hitSlop={12}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppSymbol
            name="chevron.left"
            size={22}
            tintColor={colors.textPrimary}
          />
        </Pressable>
        <Text style={styles.headerTitle}>
          Your Cart ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
        </Text>
        <View style={styles.secureBadge}>
          <AppSymbol name="shield.fill" size={14} tintColor={colors.primary} />
          <Text style={styles.secureText}>Secure Checkout</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: spacing.xl }]}
      >
        <MerchantOfflineBanner />
        <CheckoutSavingsBanner
          savings={displaySavings}
          subtotal={subtotal}
          freeDelivery={freeDelivery}
        />

        <View style={styles.items}>
          {items.map((line) => (
            <CheckoutCartLineCard
              key={cartLineKey(line.restaurantId, line.item.id)}
              line={line}
              onDecrease={() => {
                hapticSoftTap();
                updateCartQuantity(
                  line.item.id,
                  line.quantity - 1,
                  line.restaurantId,
                );
              }}
              onIncrease={() => {
                hapticSoftTap();
                updateCartQuantity(
                  line.item.id,
                  line.quantity + 1,
                  line.restaurantId,
                );
              }}
              onRemove={() => {
                removeFromCart(line.item.id, line.restaurantId);
              }}
            />
          ))}
        </View>

        <View
          onLayout={(event) => setPriceSectionY(event.nativeEvent.layout.y)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>
                Item Total ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
              </Text>
              <Text style={styles.billValue}>{formatInr(subtotal)}</Text>
            </View>
            <View style={styles.billRow}>
              <View style={styles.billLabelRow}>
                <Text style={styles.billLabel}>Delivery Charges</Text>
                <AppSymbol
                  name="info.circle"
                  size={13}
                  tintColor={colors.textTertiary}
                />
              </View>
              <Text
                style={[
                  styles.billValue,
                  deliveryFee === 0 && styles.billValueFree,
                ]}
              >
                {deliveryFee === 0 ? 'FREE' : formatInr(deliveryFee)}
              </Text>
            </View>
            <View style={styles.billRow}>
              <View style={styles.billLabelRow}>
                <Text style={styles.billLabel}>Platform Fee</Text>
                <AppSymbol
                  name="info.circle"
                  size={13}
                  tintColor={colors.textTertiary}
                />
              </View>
              <Text style={styles.billValue}>{formatInr(PLATFORM_FEE)}</Text>
            </View>
            {displaySavings > 0 ? (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, styles.savedLabel]}>
                  You Saved
                </Text>
                <Text style={styles.savedValue}>
                  −{formatInr(displaySavings)}
                </Text>
              </View>
            ) : null}
            <View style={styles.billDivider} />
            <View style={styles.billRow}>
              <Text style={styles.toPayLabel}>To Pay</Text>
              <Text style={styles.toPayValue}>{formatInr(total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.addressCard}>
            <AppSymbol
              name="location.fill"
              size={20}
              tintColor={colors.primary}
            />
            <View style={styles.addressBody}>
              <Text style={styles.addressLine} numberOfLines={2}>
                {fullAddress}
              </Text>
            </View>
            <Pressable
              hitSlop={8}
              onPress={() => {
                hapticSoftTap();
                router.push('/location');
              }}
            >
              <Text style={styles.changeLink}>Change</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Options</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.viewAll}>View All</Text>
            </Pressable>
          </View>
          <View style={styles.paymentList}>
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
                    styles.paymentRow,
                    selected && styles.paymentRowSelected,
                  ]}
                >
                  <RadioMark selected={selected} />
                  <View style={styles.paymentCenter}>
                    <View style={styles.paymentTitleRow}>
                      <Text
                        style={[
                          styles.paymentLabel,
                          selected && styles.paymentLabelSelected,
                        ]}
                      >
                        {method.label}
                      </Text>
                      {method.badge ? (
                        <View style={styles.paymentBadge}>
                          <Text style={styles.paymentBadgeText}>
                            {method.badge}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.paymentSubtitle}>
                      {method.subtitle}
                    </Text>
                  </View>
                  <CheckoutPaymentTrailingLogos
                    logos={method.trailingLogos}
                    showMore={method.showMore}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {paymentError ? (
        <Text style={styles.paymentError}>{paymentError}</Text>
      ) : null}

      <CheckoutStickyFooter
        total={total}
        savings={displaySavings}
        isPlacing={isProcessing}
        disabled={items.length === 0 || isProcessing || merchantOffline}
        onPlaceOrder={handlePlaceOrder}
        onViewPriceDetails={scrollToPriceDetails}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secureText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  items: {
    gap: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  viewAll: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.primary,
  },
  priceCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  billLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  billValue: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  billValueFree: {
    fontFamily: fonts.semibold,
    color: colors.success,
  },
  savedLabel: {
    color: colors.success,
  },
  savedValue: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.success,
  },
  billDivider: {
    borderStyle: 'dashed',
    borderTopWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.xs,
  },
  toPayLabel: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  toPayValue: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 12,
    borderCurve: 'continuous',
    padding: spacing.md,
  },
  addressBody: {
    flex: 1,
  },
  addressLine: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  changeLink: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.primary,
  },
  paymentList: {
    gap: spacing.sm,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  paymentRowSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(212, 84, 60, 0.04)',
  },
  paymentCenter: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  paymentLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  paymentLabelSelected: {
    color: colors.primary,
  },
  paymentSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  paymentBadge: {
    backgroundColor: colors.successLight,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  paymentBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.success,
    letterSpacing: 0.3,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  paymentError: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.danger,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
});
