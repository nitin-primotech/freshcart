import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  PAYMENT_METHODS,
  PLATFORM_FEE,
  SAVED_CARDS,
  TAX_RATE,
} from '@/features/checkout/constants/checkout.constants';
import type { PaymentBrandLogo } from '@/features/checkout/constants/payment-brands';
import { PAYMENT_BRAND_LOGOS } from '@/features/checkout/constants/payment-brands';
import { formatUsd } from '@/features/checkout/utils/format-currency';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { hapticPrimaryAction, hapticSoftTap } from '@/shared/haptics/feedback';
import { selectAddress, selectUserName, useAppStore } from '@/store/app.store';
import { selectUserPhone, useAuthStore } from '@/store/auth.store';
import {
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
import { fonts } from '@/theme/typography';

type SavedCard = (typeof SAVED_CARDS)[number];

function RadioMark({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.radio, selected && styles.radioSelected]}>
      {selected ? <View style={styles.radioDot} /> : null}
    </View>
  );
}

function BrandLogo({ brand }: { brand: PaymentBrandLogo }) {
  if (brand.image) {
    return (
      <Image
        source={brand.image}
        style={styles.brandImage}
        contentFit="contain"
      />
    );
  }
  if (brand.symbol) {
    return (
      <AppSymbol name={brand.symbol} size={20} tintColor={colors.textPrimary} />
    );
  }
  return null;
}

function CardBrandIcon({ brand }: { brand: SavedCard['brand'] }) {
  const logoKey =
    brand === 'amex' ? 'amex' : brand === 'discover' ? 'discover' : brand;
  const logo = PAYMENT_BRAND_LOGOS[logoKey as keyof typeof PAYMENT_BRAND_LOGOS];
  if (logo && 'image' in logo && logo.image) {
    return (
      <Image
        source={logo.image}
        style={styles.cardBrand}
        contentFit="contain"
      />
    );
  }
  return (
    <AppSymbol
      name="creditcard.fill"
      size={22}
      tintColor={colors.textPrimary}
    />
  );
}

function SummaryRow({
  label,
  value,
  info,
}: {
  label: string;
  value: string;
  info?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryLabelRow}>
        <Text style={styles.summaryLabel}>{label}</Text>
        {info ? (
          <AppSymbol
            name="info.circle"
            size={13}
            tintColor={colors.textTertiary}
          />
        ) : null}
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

export function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const items = useCartStore(selectCartItems);
  const subtotal = useCartStore(selectCartSubtotal);
  const savedAddress = useAppStore(selectAddress);
  const userName = useAppStore(selectUserName);
  const userPhone = useAuthStore(selectUserPhone);
  const isPlacing = useOrdersStore(selectIsPlacing);

  const [paymentMethod, setPaymentMethod] = useState('apple-pay');
  const [savedCardId, setSavedCardId] = useState(
    SAVED_CARDS.find((c) => c.isDefault)?.id ?? SAVED_CARDS[0]?.id,
  );

  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = items.length > 0 && !freeDelivery ? DELIVERY_FEE : 0;
  const taxes = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.max(subtotal + deliveryFee + PLATFORM_FEE + taxes, 0);

  const restaurant = items[0];
  const fullAddress = `${savedAddress.line1}, ${savedAddress.line2}`;

  async function handlePay() {
    if (!restaurant || items.length === 0) return;
    hapticPrimaryAction();
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

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppSymbol
            name="chevron.left"
            size={20}
            tintColor={colors.textPrimary}
          />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Payment</Text>
          <Text style={styles.subtitle}>
            Total Payable:{' '}
            <Text style={styles.totalHighlight}>{formatUsd(total)}</Text>
          </Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.secureBanner}>
        <AppSymbol name="lock.fill" size={12} tintColor={colors.primary} />
        <Text style={styles.secureText}>
          Secure checkout powered by industry-standard encryption.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <Pressable accessibilityRole="button">
              <Text style={styles.link}>View Details ›</Text>
            </Pressable>
          </View>
          <View style={styles.summaryCard}>
            <SummaryRow label="Items Total" value={formatUsd(subtotal)} />
            <SummaryRow
              label="Delivery Fee"
              value={deliveryFee === 0 ? 'FREE' : formatUsd(deliveryFee)}
            />
            <SummaryRow
              label="Taxes & Fees"
              value={formatUsd(taxes + PLATFORM_FEE)}
              info
            />
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>{formatUsd(total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Payment Method</Text>
          <View style={styles.methodList}>
            {PAYMENT_METHODS.map((method) => {
              const selected = paymentMethod === method.id;
              return (
                <Pressable
                  key={method.id}
                  style={[
                    styles.methodCard,
                    selected && styles.methodCardSelected,
                  ]}
                  onPress={() => {
                    hapticSoftTap();
                    setPaymentMethod(method.id);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <RadioMark selected={selected} />
                  <View style={styles.methodCopy}>
                    <View style={styles.methodTitleRow}>
                      <Text style={styles.methodLabel}>{method.label}</Text>
                      {method.badge ? (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{method.badge}</Text>
                        </View>
                      ) : null}
                    </View>
                    {method.subtitle ? (
                      <Text style={styles.methodSubtitle}>
                        {method.subtitle}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.methodTrailing}>
                    {method.trailingLogos?.map((logo) => (
                      <BrandLogo key={logo.id} brand={logo} />
                    ))}
                    {method.trailingSymbol ? (
                      <AppSymbol
                        name={method.trailingSymbol}
                        size={20}
                        tintColor={colors.textSecondary}
                      />
                    ) : null}
                    {method.showChevron ? (
                      <AppSymbol
                        name="chevron.right"
                        size={14}
                        tintColor={colors.textTertiary}
                      />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Cards</Text>
          <View style={styles.methodList}>
            {SAVED_CARDS.map((card) => {
              const selected = savedCardId === card.id;
              return (
                <Pressable
                  key={card.id}
                  style={[
                    styles.methodCard,
                    selected && styles.methodCardSelected,
                  ]}
                  onPress={() => {
                    hapticSoftTap();
                    setSavedCardId(card.id);
                    setPaymentMethod('card');
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <RadioMark selected={selected} />
                  <CardBrandIcon brand={card.brand} />
                  <View style={styles.methodCopy}>
                    <View style={styles.methodTitleRow}>
                      <Text style={styles.methodLabel}>•••• {card.last4}</Text>
                      {card.isDefault ? (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>Default</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.methodSubtitle}>
                      Expires {card.expiry}
                    </Text>
                  </View>
                  <Pressable hitSlop={8} accessibilityRole="button">
                    <AppSymbol
                      name="ellipsis"
                      size={16}
                      tintColor={colors.textSecondary}
                    />
                  </Pressable>
                </Pressable>
              );
            })}
          </View>
          <Pressable style={styles.addCardBtn} accessibilityRole="button">
            <AppSymbol
              name="plus.circle.fill"
              size={18}
              tintColor={colors.primary}
            />
            <Text style={styles.addCardText}>Add New Card</Text>
          </Pressable>
        </View>

        <View style={styles.chargeNote}>
          <AppSymbol
            name="checkmark.shield.fill"
            size={18}
            tintColor={colors.primary}
          />
          <Text style={styles.chargeNoteText}>
            You will not be charged until you place the order.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <PremiumButton
          label={`Pay Securely – ${formatUsd(total)}`}
          onPress={handlePay}
          disabled={isPlacing}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  totalHighlight: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  secureBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  secureText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primaryDark,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  link: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 17,
    color: colors.primary,
  },
  summaryCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  summaryLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.xxs,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.primary,
  },
  methodList: {
    gap: spacing.sm,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.accentMuted,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
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
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  methodCopy: {
    flex: 1,
    gap: 2,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  methodLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  methodSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.primary,
  },
  methodTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  brandImage: {
    width: 28,
    height: 20,
  },
  cardBrand: {
    width: 32,
    height: 22,
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  addCardText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.primary,
  },
  chargeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    padding: spacing.md,
  },
  chargeNoteText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 17,
    color: colors.primaryDark,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
