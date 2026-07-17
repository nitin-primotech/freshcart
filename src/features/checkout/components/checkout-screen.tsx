import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  PAYMENT_METHODS,
} from '@/features/checkout/constants/checkout.constants';
import {
  openFoodRushCheckout,
  RazorpayPaymentCancelledError,
  RazorpayUnavailableError,
} from '@/features/checkout/services/razorpay.service';
import {
  CHECKOUT_DETAILS_ROUTE,
  needsCheckoutDetails,
} from '@/features/checkout/utils/checkout-readiness';
import {
  deriveMrp,
  formatUsd,
} from '@/features/checkout/utils/format-currency';
import { formatDeliveryAddressDisplay } from '@/features/checkout/utils/format-delivery-address';
import { TopPicksProductCard } from '@/features/home/components/top-picks-product-card';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { getProductReviewCount } from '@/features/product/utils/product-review-count';
import { AppFooter } from '@/shared/components/app-footer';
import { AppInfoModal } from '@/shared/components/app-info-modal';
import { AppSymbol } from '@/shared/components/app-symbol';
import { MerchantOfflineBanner } from '@/shared/components/merchant-offline-banner';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { selectAddress, selectUserName, useAppStore } from '@/store/app.store';
import {
  selectSession,
  selectUserPhone,
  useAuthStore,
} from '@/store/auth.store';
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
  selectCatalogRestaurant,
  useCatalogStore,
} from '@/store/catalog.store';
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
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const _AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const items = useCartStore(selectCartItems);
  const subtotal = useCartStore(selectCartSubtotal);
  const savedAddress = useAppStore(selectAddress);
  const userName = useAppStore(selectUserName);
  const userPhone = useAuthStore(selectUserPhone);
  const session = useAuthStore(selectSession);
  const isPlacing = useOrdersStore(selectIsPlacing);
  const merchantReady = useMerchantStore(selectMerchantReady);
  const merchantIsOnline = useMerchantStore(selectMerchantIsOnline);
  const catalogRestaurant = useCatalogStore(selectCatalogRestaurant);

  const [paymentId, setPaymentId] = useState('upi');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [avoidCalling, setAvoidCalling] = useState(false);
  const [dontRing, setDontRing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [offlineModalVisible, setOfflineModalVisible] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const merchantOffline = merchantReady && !merchantIsOnline;
  const isProcessing = isPlacing;

  useEffect(() => {
    if (
      needsCheckoutDetails({
        userName,
        address: savedAddress,
        session,
      })
    ) {
      router.replace(CHECKOUT_DETAILS_ROUTE);
    }
  }, [router, userName, savedAddress, session]);

  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const fullAddress = formatDeliveryAddressDisplay(savedAddress);

  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = items.length > 0 && !freeDelivery ? DELIVERY_FEE : 0;
  const handlingFee = items.length > 0 ? 0.49 : 0;
  const smallCartFee = items.length > 0 && subtotal < 15 ? 0.99 : 0;

  const itemMrpSavings = useMemo(
    () =>
      items.reduce((sum, line) => {
        const mrp = deriveMrp(line.item.price);
        return sum + (mrp - line.item.price) * line.quantity;
      }, 0),
    [items],
  );
  const displaySavings = Math.round(itemMrpSavings);

  const total = Math.max(
    subtotal + deliveryFee + handlingFee + smallCartFee + tipAmount,
    0,
  );

  const restaurant = items[0];

  const recommendedDishes = useMemo((): RecommendedDish[] => {
    if (!catalogRestaurant) return [];
    const cartItemIds = new Set(items.map((line) => line.item.id));
    const dishes: RecommendedDish[] = [];

    for (const section of catalogRestaurant.menu) {
      for (const item of section.items) {
        if (cartItemIds.has(item.id)) continue;
        dishes.push({
          item,
          restaurantId: catalogRestaurant.id,
          restaurantName: catalogRestaurant.name,
          rating: catalogRestaurant.rating,
          reviewCount: getProductReviewCount(
            item.id,
            catalogRestaurant.rating,
            catalogRestaurant.reviewCount,
          ),
        });
      }
    }

    dishes.sort((a, b) => {
      const aPopular = a.item.isPopular ? 1 : 0;
      const bPopular = b.item.isPopular ? 1 : 0;
      if (bPopular !== aPopular) return bPopular - aPopular;
      return b.rating - a.rating;
    });

    return dishes.slice(0, 8);
  }, [catalogRestaurant, items]);

  const upsellCardWidth = useCarouselItemWidth({
    visibleCount: 2.35,
    peek: 0.12,
    gap: spacing.sm,
    paddingStart: spacing.md,
    paddingEnd: spacing.md,
  });

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

  async function handlePlaceOrder() {
    if (!restaurant || isProcessing) return;

    if (merchantOffline) {
      setOfflineModalVisible(true);
      return;
    }

    hapticSoftTap();
    try {
      await openFoodRushCheckout({
        amount: total,
        prefill: {
          name: userName || session?.displayName || undefined,
          contact: userPhone || undefined,
          email: session?.email || undefined,
        },
        description: `FreshCart order from ${restaurant.restaurantName}`,
      });

      await placeOrder({
        items,
        subtotal,
        deliveryFee: deliveryFee + handlingFee + smallCartFee,
        tip: tipAmount,
        address: fullAddress,
        restaurantId: restaurant.restaurantId,
        restaurantName: restaurant.restaurantName,
        restaurantLogo: '',
        customerId: session?.uid ?? userPhone ?? undefined,
        customerName: userName || session?.displayName || undefined,
        customerPhone: userPhone || session?.email || session?.uid || undefined,
      });
      clearCart();
      router.replace('/order-success');
    } catch (error) {
      if (error instanceof RazorpayPaymentCancelledError) {
        return;
      }

      if (error instanceof RazorpayUnavailableError) {
        setErrorModal({
          title: 'Razorpay unavailable',
          message: error.message,
        });
        return;
      }

      setErrorModal({
        title: 'Unable to place order',
        message:
          error instanceof Error
            ? error.message
            : 'Please try again in a moment.',
      });
    }
  }

  function toggleInstruction(type: 'calling' | 'ring') {
    hapticSoftTap();
    if (type === 'calling') {
      setAvoidCalling((prev) => !prev);
    } else {
      setDontRing((prev) => !prev);
    }
  }

  function handleTipSelect(amount: number) {
    hapticSoftTap();
    setTipAmount((prev) => (prev === amount ? 0 : amount));
  }

  async function handleShare() {
    hapticSoftTap();
    try {
      await Share.share({
        message: `FreshCart Checkout: Ordering ${itemCount} items from ${restaurant?.restaurantName || 'FreshCart'} for a total of ${formatUsd(total)}.`,
      });
    } catch (_error) {
      // no-op
    }
  }

  const selectedPaymentMethod = useMemo(() => {
    return (
      PAYMENT_METHODS.find((m) => m.id === paymentId) || PAYMENT_METHODS[0]
    );
  }, [paymentId]);

  if (items.length === 0) {
    return (
      <View style={styles.root}>
        {/* Header */}
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
        </View>

        {/* Empty State Body */}
        <View style={styles.emptyContainer}>
          <Image
            source={require('@/assets/images/empty-cart.png')}
            style={styles.emptyImage}
            contentFit="contain"
          />
          <Text style={styles.emptyTitle}>Your cart is getting lonely</Text>
          <Text style={styles.emptySubtitle}>
            Fill it up with all things good!
          </Text>
          <Pressable
            onPress={() => {
              hapticSoftTap();
              router.replace('/(tabs)');
            }}
            style={({ pressed }) => [
              styles.emptyBtn,
              pressed && styles.emptyBtnPressed,
            ]}
          >
            <Text style={styles.emptyBtnText}>Start Shopping</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight}>
          <Pressable
            style={styles.headerIconBtn}
            onPress={() => {
              hapticSoftTap();
              router.push('/search');
            }}
          >
            <AppSymbol
              name="magnifyingglass"
              size={18}
              tintColor={colors.textPrimary}
            />
          </Pressable>
          <Pressable style={styles.headerIconBtn} onPress={handleShare}>
            <AppSymbol
              name="square.and.arrow.up"
              size={18}
              tintColor={colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 90 }]}
      >
        <MerchantOfflineBanner />

        {/* Delivery ETA Top Banner */}
        <View style={styles.etaBanner}>
          <AppSymbol
            name="clock.fill"
            size={16}
            tintColor={colors.textInverse}
          />
          <Text style={styles.etaText}>
            Delivery in 8 minutes · Shipment of {itemCount}{' '}
            {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {/* Cart Items List */}
        <View style={styles.sectionCard}>
          {items.map((line, idx) => {
            const mrp = deriveMrp(line.item.price);
            return (
              <View key={cartLineKey(line.restaurantId, line.item.id)}>
                {idx > 0 && <View style={styles.itemDivider} />}
                <View style={styles.cartItemRow}>
                  <Image
                    source={{ uri: line.item.image }}
                    style={styles.itemThumb}
                  />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {line.item.name}
                    </Text>
                    <Text style={styles.itemPackSize}>
                      {line.item.description || '1 pack'}
                    </Text>
                    <Pressable
                      style={styles.wishlistLink}
                      onPress={() => {
                        hapticSoftTap();
                        removeFromCart(line.item.id, line.restaurantId);
                      }}
                    >
                      <Text style={styles.wishlistLinkText}>
                        Move to wishlist
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.cartItemRight}>
                    <Text style={styles.itemPrice}>
                      {formatUsd(line.item.price * line.quantity)}
                    </Text>
                    {mrp > line.item.price && (
                      <Text style={styles.itemMrp}>
                        {formatUsd(mrp * line.quantity)}
                      </Text>
                    )}
                    <View style={styles.stepperContainer}>
                      <Pressable
                        style={styles.stepBtn}
                        onPress={() =>
                          updateCartQuantity(
                            line.item.id,
                            line.quantity - 1,
                            line.restaurantId,
                          )
                        }
                      >
                        <AppSymbol
                          name="minus"
                          size={10}
                          tintColor={colors.primary}
                        />
                      </Pressable>
                      <Text style={styles.stepQty}>{line.quantity}</Text>
                      <Pressable
                        style={styles.stepBtn}
                        onPress={() =>
                          updateCartQuantity(
                            line.item.id,
                            line.quantity + 1,
                            line.restaurantId,
                          )
                        }
                      >
                        <AppSymbol
                          name="plus"
                          size={10}
                          tintColor={colors.primary}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {recommendedDishes.length > 0 && (
          <View style={styles.recommendedSection}>
            <Text style={styles.sectionTitle}>You might also like</Text>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {recommendedDishes.map((dish) => (
                <TopPicksProductCard
                  key={dish.item.id}
                  dish={dish}
                  width={upsellCardWidth}
                  flush
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Bill Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Bill details</Text>
          <View style={styles.billRow}>
            <View style={styles.billLabelRow}>
              <AppSymbol
                name="doc.plaintext"
                size={14}
                tintColor={colors.textSecondary}
              />
              <Text style={styles.billLabel}>Items total</Text>
              {displaySavings > 0 && (
                <View style={styles.savingsTag}>
                  <Text style={styles.savingsTagText}>
                    Saved {formatUsd(displaySavings)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.billValue}>{formatUsd(subtotal)}</Text>
          </View>

          <View style={styles.billRow}>
            <View style={styles.billLabelRow}>
              <AppSymbol
                name="bicycle"
                size={14}
                tintColor={colors.textSecondary}
              />
              <Text style={styles.billLabel}>Delivery charge</Text>
            </View>
            <Text
              style={[styles.billValue, deliveryFee === 0 && styles.freeText]}
            >
              {deliveryFee === 0 ? 'FREE' : formatUsd(deliveryFee)}
            </Text>
          </View>

          <View style={styles.billRow}>
            <View style={styles.billLabelRow}>
              <AppSymbol
                name="hand.raised.fill"
                size={14}
                tintColor={colors.textSecondary}
              />
              <Text style={styles.billLabel}>Handling charge</Text>
            </View>
            <Text style={styles.billValue}>{formatUsd(handlingFee)}</Text>
          </View>

          {smallCartFee > 0 && (
            <View style={styles.billRow}>
              <View style={styles.billLabelRow}>
                <AppSymbol
                  name="exclamationmark.triangle.fill"
                  size={14}
                  tintColor={colors.textSecondary}
                />
                <Text style={styles.billLabel}>Small cart charge</Text>
              </View>
              <Text style={styles.billValue}>{formatUsd(smallCartFee)}</Text>
            </View>
          )}

          {tipAmount > 0 && (
            <View style={styles.billRow}>
              <View style={styles.billLabelRow}>
                <AppSymbol
                  name="heart.fill"
                  size={14}
                  tintColor={colors.primary}
                />
                <Text style={styles.billLabel}>Rider tip</Text>
              </View>
              <Text style={styles.billValue}>{formatUsd(tipAmount)}</Text>
            </View>
          )}

          <View style={styles.billDivider} />
          <View style={styles.billRow}>
            <Text style={styles.grandTotalLabel}>Grand total</Text>
            <Text style={styles.grandTotalValue}>{formatUsd(total)}</Text>
          </View>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>Delivery instructions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            <Pressable
              style={[
                styles.instructionCard,
                isRecording && styles.instructionCardActive,
              ]}
              onPress={() => {
                hapticSoftTap();
                setIsRecording((prev) => !prev);
              }}
            >
              <AppSymbol
                name="mic.fill"
                size={20}
                tintColor={isRecording ? colors.primary : colors.textSecondary}
              />
              <Text style={styles.instructionTitle}>Record</Text>
              <Text style={styles.instructionDesc}>Press here and hold</Text>
            </Pressable>

            <Pressable
              style={[
                styles.instructionCard,
                avoidCalling && styles.instructionCardActive,
              ]}
              onPress={() => toggleInstruction('calling')}
            >
              <AppSymbol
                name="phone.down.fill"
                size={20}
                tintColor={avoidCalling ? colors.primary : colors.textSecondary}
              />
              <Text style={styles.instructionTitle}>Avoid calling</Text>
              <View style={styles.checkRow}>
                <Text style={styles.instructionDesc}>
                  Avoid call verification
                </Text>
                {avoidCalling && (
                  <AppSymbol
                    name="checkmark.circle.fill"
                    size={14}
                    tintColor={colors.primary}
                  />
                )}
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.instructionCard,
                dontRing && styles.instructionCardActive,
              ]}
              onPress={() => toggleInstruction('ring')}
            >
              <AppSymbol
                name="bell.slash.fill"
                size={20}
                tintColor={dontRing ? colors.primary : colors.textSecondary}
              />
              <Text style={styles.instructionTitle}>Don't ring the bell</Text>
              <View style={styles.checkRow}>
                <Text style={styles.instructionDesc}>
                  Leave at gate / lobby
                </Text>
                {dontRing && (
                  <AppSymbol
                    name="checkmark.circle.fill"
                    size={14}
                    tintColor={colors.primary}
                  />
                )}
              </View>
            </Pressable>
          </ScrollView>
        </View>

        {/* Tip your delivery partner */}
        <View style={styles.sectionCard}>
          <View style={styles.tipHeader}>
            <View style={styles.scooterContainer}>
              <AppSymbol name="bicycle" size={24} tintColor={colors.primary} />
            </View>
            <View style={styles.tipHeaderText}>
              <Text style={styles.tipTitle}>Tip your delivery partner</Text>
              <Text style={styles.tipSubtitle}>
                Your kindness means a lot! 100% of your tip goes directly to the
                rider.
              </Text>
            </View>
          </View>
          <View style={styles.tipPills}>
            {[1, 2, 3, 5].map((amt) => {
              const selected = tipAmount === amt;
              return (
                <Pressable
                  key={amt}
                  style={[styles.tipPill, selected && styles.tipPillActive]}
                  onPress={() => handleTipSelect(amt)}
                >
                  <Text
                    style={[
                      styles.tipPillText,
                      selected && styles.tipPillTextActive,
                    ]}
                  >
                    {amt === 1
                      ? '😊'
                      : amt === 2
                        ? '🤩'
                        : amt === 3
                          ? '😍'
                          : '🏆'}{' '}
                    {formatUsd(amt)}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable style={styles.tipPill} onPress={hapticSoftTap}>
              <Text style={styles.tipPillText}>Custom</Text>
            </Pressable>
          </View>
        </View>

        {/* Payment selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Select Payment Option</Text>
          {PAYMENT_METHODS.map((method) => {
            const selected = paymentId === method.id;
            const disabled = method.disabled ?? false;
            return (
              <Pressable
                key={method.id}
                onPress={() => {
                  if (disabled) return;
                  hapticSoftTap();
                  setPaymentId(method.id);
                }}
                style={[
                  styles.paymentRow,
                  selected && styles.paymentRowSelected,
                  disabled && styles.paymentRowDisabled,
                ]}
              >
                <View
                  style={[
                    styles.radio,
                    selected && styles.radioSelected,
                    disabled && styles.radioDisabled,
                  ]}
                >
                  {selected && <View style={styles.radioDot} />}
                </View>
                <View style={styles.paymentCenter}>
                  <View style={styles.paymentTitleRow}>
                    <Text
                      style={[
                        styles.paymentLabel,
                        disabled && styles.paymentLabelDisabled,
                      ]}
                    >
                      {method.label}
                    </Text>
                    {method.badge && (
                      <View
                        style={[
                          styles.paymentBadge,
                          disabled && styles.paymentBadgeDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.paymentBadgeText,
                            disabled && styles.paymentBadgeTextDisabled,
                          ]}
                        >
                          {method.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  {method.subtitle && (
                    <Text style={styles.paymentSubtitle}>
                      {method.subtitle}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
        <AppFooter />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.xs }]}
      >
        <View style={styles.addressSticky}>
          <AppSymbol name="location.fill" size={14} tintColor={colors.star} />
          <Text style={styles.addressStickyText} numberOfLines={1}>
            Delivering to Home · {fullAddress}
          </Text>
          <Pressable onPress={() => router.push('/location')}>
            <Text style={styles.changeLinkText}>Change</Text>
          </Pressable>
        </View>
        <View style={styles.bottomActions}>
          <View style={styles.bottomLeft}>
            <Text style={styles.bottomPayText}>PAY USING</Text>
            <Text style={styles.bottomPayMethod} numberOfLines={1}>
              {selectedPaymentMethod.label}
            </Text>
          </View>
          <Pressable
            style={[
              styles.placeOrderBtn,
              isProcessing && styles.placeOrderBtnDisabled,
            ]}
            disabled={isProcessing}
            onPress={handlePlaceOrder}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <View style={styles.placeBtnContent}>
                <Text style={styles.placeBtnTotal}>{formatUsd(total)}</Text>
                <Text style={styles.placeBtnText}>Place Order</Text>
                <AppSymbol
                  name="chevron.right"
                  size={14}
                  tintColor={colors.textInverse}
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <AppInfoModal
        visible={offlineModalVisible}
        title="Store offline"
        message="FreshCart is not accepting orders right now. Please try again later."
        icon="storefront.fill"
        onClose={() => setOfflineModalVisible(false)}
      />

      <AppInfoModal
        visible={errorModal != null}
        title={errorModal?.title ?? ''}
        message={errorModal?.message ?? ''}
        icon="exclamationmark.triangle.fill"
        onClose={() => setErrorModal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: spacing.sm,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  etaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  etaText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textInverse,
  },
  sectionCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  cartItemRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  itemThumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundMuted,
  },
  itemDetails: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  itemPackSize: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  wishlistLink: {
    marginTop: 4,
  },
  wishlistLinkText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.primary,
  },
  cartItemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemPrice: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  itemMrp: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: 2,
    backgroundColor: colors.accent,
    marginTop: 4,
  },
  stepBtn: {
    padding: 6,
  },
  stepQty: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.primary,
    paddingHorizontal: 8,
  },
  itemDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  recommendedSection: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    paddingLeft: spacing.md,
    marginBottom: spacing.xxs,
  },
  horizontalScrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  billLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  billValue: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  freeText: {
    fontFamily: fonts.semibold,
    color: colors.success,
  },
  savingsTag: {
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  savingsTagText: {
    fontFamily: fonts.semibold,
    fontSize: 9,
    color: colors.textInverse,
  },
  billDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  grandTotalLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  grandTotalValue: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  gstCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  percentBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gstTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  gstSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
    maxWidth: 240,
  },
  instructionsSection: {
    gap: spacing.xs,
  },
  instructionCard: {
    width: 140,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  instructionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.accent,
  },
  instructionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.textPrimary,
  },
  instructionDesc: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.textSecondary,
    flex: 1,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  donationCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  donationTextContainer: {
    flex: 1,
    gap: 2,
    paddingRight: spacing.sm,
  },
  donationTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: '#1E3A8A',
  },
  donationSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#1E40AF',
  },
  donationPills: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  donationPill: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  donationPillActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  donationPillText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: '#1D4ED8',
  },
  donationPillTextActive: {
    color: colors.textInverse,
  },
  tipHeader: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  scooterContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipHeaderText: {
    flex: 1,
    gap: 2,
  },
  tipTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  tipSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  tipPills: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  tipPill: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipPillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.accent,
  },
  tipPillText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.textPrimary,
  },
  tipPillTextActive: {
    color: colors.primary,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  paymentRowSelected: {
    backgroundColor: colors.accentMuted,
  },
  paymentRowDisabled: {
    opacity: 0.5,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDisabled: {
    borderColor: colors.border,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  paymentCenter: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  paymentLabel: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  paymentLabelDisabled: {
    color: colors.textTertiary,
  },
  paymentSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  paymentBadge: {
    backgroundColor: colors.accent,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  paymentBadgeDisabled: {
    backgroundColor: colors.backgroundMuted,
  },
  paymentBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.primary,
  },
  paymentBadgeTextDisabled: {
    color: colors.textSecondary,
  },
  footer: {
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  addressSticky: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  addressStickyText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  changeLinkText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.primary,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  bottomLeft: {
    gap: 1,
  },
  bottomPayText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: colors.textSecondary,
  },
  bottomPayMethod: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primary,
    maxWidth: 120,
  },
  placeOrderBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 180,
  },
  placeOrderBtnDisabled: {
    opacity: 0.5,
  },
  placeBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  placeBtnTotal: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textInverse,
  },
  placeBtnText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textInverse,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
    gap: spacing.md,
    marginTop: -40, // offset header visual balance
  },
  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  emptyBtn: {
    backgroundColor: '#007AFF12', // transparent light blue
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 1.5,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBtnPressed: {
    opacity: 0.8,
  },
  emptyBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: '#007AFF', // bright iOS blue
  },
});
