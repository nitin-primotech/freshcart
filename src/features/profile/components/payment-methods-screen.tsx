import { Image } from 'expo-image';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckoutPaymentTrailingLogos } from '@/features/checkout/components/checkout-payment-trailing-logos';
import { PAYMENT_METHODS } from '@/features/checkout/constants/checkout.constants';
import { PAYMENT_BRAND_LOGOS } from '@/features/checkout/constants/payment-brands';
import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import { SAVED_PAYMENT_METHODS } from '@/features/profile/constants/profile-hub.constants';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap, hapticSuccess } from '@/shared/haptics/feedback';
import { colors, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function PaymentMethodsScreen() {
  const initialDefault =
    SAVED_PAYMENT_METHODS.find((method) => method.isDefault)?.id ??
    SAVED_PAYMENT_METHODS[0]?.id ??
    null;
  const [defaultId, setDefaultId] = useState<string | null>(initialDefault);

  function setDefault(methodId: string) {
    hapticSoftTap();
    setDefaultId(methodId);
    hapticSuccess();
  }

  function handleAddMethod() {
    hapticSoftTap();
    Alert.alert(
      'Add payment method',
      'New cards and UPI IDs can be added securely at checkout when you place your next order.',
    );
  }

  function handleRemove(methodLabel: string) {
    hapticSoftTap();
    Alert.alert(
      'Remove method',
      `${methodLabel} can be removed from your Razorpay saved methods at checkout.`,
    );
  }

  return (
    <ProfileSubScreenShell
      title="Payment"
      accentTitle="Methods"
      subtitle="Cards, UPI and wallets"
    >
      <View style={[styles.hero, shadows.soft]}>
        <View style={styles.heroIcon}>
          <AppSymbol name="shield.fill" size={22} tintColor={colors.primary} />
        </View>
        <Text style={styles.heroTitle}>Payments are secure</Text>
        <Text style={styles.heroSubtitle}>
          All transactions are encrypted and processed through Razorpay.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved methods</Text>
        <View style={styles.list}>
          {SAVED_PAYMENT_METHODS.map((method, index) => {
            const isDefault = defaultId === method.id;
            const brandLogo = method.brandId
              ? PAYMENT_BRAND_LOGOS[method.brandId]
              : null;

            return (
              <Pressable
                key={method.id}
                onPress={() => setDefault(method.id)}
                onLongPress={() => handleRemove(method.label)}
                style={[
                  styles.savedRow,
                  index < SAVED_PAYMENT_METHODS.length - 1 && styles.rowBorder,
                  isDefault && styles.savedRowSelected,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isDefault }}
                accessibilityLabel={`${method.label}, ${isDefault ? 'default' : 'set as default'}`}
              >
                <View style={styles.savedLeading}>
                  {brandLogo && 'image' in brandLogo && brandLogo.image ? (
                    <Image
                      source={brandLogo.image}
                      style={styles.brandLogo}
                      contentFit="contain"
                      accessibilityLabel={brandLogo.name}
                    />
                  ) : brandLogo && 'symbol' in brandLogo && brandLogo.symbol ? (
                    <AppSymbol
                      name={brandLogo.symbol}
                      size={18}
                      tintColor={colors.primary}
                    />
                  ) : (
                    <AppSymbol
                      name={method.icon}
                      size={16}
                      tintColor={colors.primary}
                    />
                  )}
                </View>
                <View style={styles.savedCopy}>
                  <View style={styles.savedTitleRow}>
                    <Text style={styles.savedTitle}>{method.label}</Text>
                    {isDefault ? (
                      <View style={styles.defaultPill}>
                        <Text style={styles.defaultPillText}>Default</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.savedSubtitle}>{method.subtitle}</Text>
                </View>
                <View style={[styles.radio, isDefault && styles.radioSelected]}>
                  {isDefault ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={handleAddMethod}
          style={styles.addBtn}
          accessibilityRole="button"
          accessibilityLabel="Add payment method"
        >
          <AppSymbol name="plus" size={14} tintColor={colors.primary} />
          <Text style={styles.addBtnText}>Add new method</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accepted at checkout</Text>
        <View style={styles.list}>
          {PAYMENT_METHODS.map((method, index) => (
            <View
              key={method.id}
              style={[
                styles.acceptedRow,
                index < PAYMENT_METHODS.length - 1 && styles.rowBorder,
              ]}
            >
              <View style={styles.acceptedIcon}>
                <AppSymbol
                  name={
                    method.id === 'upi'
                      ? 'qrcode.viewfinder'
                      : method.id === 'card'
                        ? 'creditcard.fill'
                        : method.id === 'netbanking'
                          ? 'building.columns.fill'
                          : 'wallet.pass.fill'
                  }
                  size={16}
                  tintColor={colors.primary}
                />
              </View>
              <View style={styles.acceptedCopy}>
                <View style={styles.acceptedTitleRow}>
                  <Text style={styles.acceptedTitle}>{method.label}</Text>
                  {method.badge ? (
                    <View style={styles.fastPill}>
                      <Text style={styles.fastPillText}>{method.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.acceptedSubtitle}>{method.subtitle}</Text>
              </View>
              <CheckoutPaymentTrailingLogos
                logos={method.trailingLogos}
                showMore={method.showChevron}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.note}>
        <AppSymbol name="lock.fill" size={16} tintColor={colors.primary} />
        <Text style={styles.noteText}>
          Tap a saved method to set it as default. Long press to manage removal
          at checkout.
        </Text>
      </View>
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.16)',
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  list: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  savedRowSelected: {
    backgroundColor: 'rgba(212, 84, 60, 0.04)',
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  savedLeading: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 28,
    height: 18,
  },
  savedCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  savedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  savedTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  savedSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  defaultPill: {
    backgroundColor: colors.successLight,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  defaultPillText: {
    fontFamily: fonts.semibold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.success,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.25)',
    borderStyle: 'dashed',
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(212, 84, 60, 0.04)',
  },
  addBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.primary,
  },
  acceptedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  acceptedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptedCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  acceptedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  acceptedTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  acceptedSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  fastPill: {
    backgroundColor: 'rgba(212, 84, 60, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  fastPillText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    lineHeight: 10,
    color: colors.primary,
    letterSpacing: 0.4,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.12)',
  },
  noteText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },
});
