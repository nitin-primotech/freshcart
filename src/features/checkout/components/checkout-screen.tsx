import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppSymbol } from '@/shared/components/app-symbol';
import { GlassCard } from '@/shared/components/glass-card';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticSuccess } from '@/shared/haptics/feedback';
import { selectAddress, useAppStore } from '@/store/app.store';
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

const TIPS = [0, 2, 4, 6];

export function CheckoutScreen() {
  const router = useRouter();
  const items = useCartStore(selectCartItems);
  const subtotal = useCartStore(selectCartSubtotal);
  const address = useAppStore(selectAddress);
  const isPlacing = useOrdersStore(selectIsPlacing);
  const [tip, setTip] = useState(2);

  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee + tip;
  const restaurant = items[0];

  async function handlePay() {
    if (!restaurant || isPlacing) return;
    hapticSuccess();
    await placeOrder({
      items,
      subtotal,
      deliveryFee,
      tip,
      address: `${address.line1}, ${address.line2}`,
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.restaurantName,
      restaurantLogo: '',
    });
    clearCart();
    router.replace('/order-success');
  }

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <GlassCard padding={spacing.lg}>
        <View style={styles.row}>
          <AppSymbol
            name="location.fill"
            size={22}
            tintColor={colors.primary}
          />
          <View style={styles.flex}>
            <PremiumText variant="bodyMedium">{address.label}</PremiumText>
            <PremiumText variant="caption" color={colors.textSecondary}>
              {address.line1}, {address.line2}
            </PremiumText>
          </View>
        </View>
      </GlassCard>

      <View style={styles.block}>
        <PremiumText variant="h3">Delivery time</PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          Estimated 25–35 min
        </PremiumText>
      </View>

      <View style={styles.block}>
        <PremiumText variant="h3">Add a tip</PremiumText>
        <View style={styles.tips}>
          {TIPS.map((t) => (
            <PremiumButton
              key={t}
              label={t === 0 ? 'No tip' : `$${t}`}
              variant={tip === t ? 'primary' : 'secondary'}
              size="md"
              onPress={() => setTip(t)}
              style={styles.tipBtn}
            />
          ))}
        </View>
      </View>

      <View style={[styles.summary, shadows.soft]}>
        <View style={styles.line}>
          <PremiumText variant="body" color={colors.textSecondary}>
            Subtotal
          </PremiumText>
          <PremiumText variant="bodyMedium">${subtotal.toFixed(2)}</PremiumText>
        </View>
        <View style={styles.line}>
          <PremiumText variant="body" color={colors.textSecondary}>
            Delivery
          </PremiumText>
          <PremiumText variant="bodyMedium">
            ${deliveryFee.toFixed(2)}
          </PremiumText>
        </View>
        <View style={styles.line}>
          <PremiumText variant="body" color={colors.textSecondary}>
            Tip
          </PremiumText>
          <PremiumText variant="bodyMedium">${tip.toFixed(2)}</PremiumText>
        </View>
        <View style={[styles.line, styles.totalLine]}>
          <PremiumText variant="h3">Total</PremiumText>
          <PremiumText variant="price">${total.toFixed(2)}</PremiumText>
        </View>
      </View>

      <PremiumButton
        label={isPlacing ? 'Processing…' : `Pay $${total.toFixed(2)}`}
        onPress={handlePay}
        disabled={items.length === 0 || isPlacing}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl + spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
  flex: {
    flex: 1,
    gap: 2,
  },
  block: {
    gap: spacing.sm,
  },
  tips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tipBtn: {
    minWidth: 72,
  },
  summary: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderCurve: 'continuous',
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLine: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
