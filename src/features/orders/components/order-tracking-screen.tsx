import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import {
  advanceOrderStatus,
  selectOrders,
  useOrdersStore,
} from '@/store/orders.store';
import { colors, screens } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const STEPS = [
  {
    key: 'confirmed',
    label: 'Order confirmed',
    icon: 'checkmark.circle.fill',
  },
  { key: 'preparing', label: 'Preparing your food', icon: 'flame.fill' },
  { key: 'on_the_way', label: 'On the way', icon: 'bicycle' },
  { key: 'delivered', label: 'Delivered', icon: 'house.fill' },
] as const;

export function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orders = useOrdersStore(selectOrders);
  const order = orders.find((o) => o.id === id);

  useEffect(() => {
    if (!order || order.status === 'delivered') return;
    const timer = setInterval(() => {
      advanceOrderStatus(order.id);
    }, 8000);
    return () => clearInterval(timer);
  }, [order]);

  if (!order) {
    return (
      <View style={styles.center}>
        <PremiumText variant="h3">Order not found</PremiumText>
      </View>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === order.status);

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <PremiumText variant="display">Tracking</PremiumText>
      <PremiumText variant="body" color={colors.textSecondary}>
        {order.restaurantName}
      </PremiumText>

      <View style={styles.mapPlaceholder}>
        <AppSymbol name="map.fill" size={48} tintColor={colors.primary} />
        <PremiumText variant="caption" color={colors.textSecondary}>
          Live map — demo placeholder
        </PremiumText>
      </View>

      <View style={styles.timeline}>
        {STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <Animated.View
              key={step.key}
              entering={FadeIn.delay(i * 100).duration(400)}
              style={styles.step}
            >
              <View
                style={[
                  styles.stepIcon,
                  {
                    backgroundColor: done
                      ? screens.tracking.activeStep
                      : colors.backgroundMuted,
                  },
                ]}
              >
                <AppSymbol
                  name={step.icon}
                  size={20}
                  tintColor={done ? colors.textInverse : colors.textTertiary}
                />
              </View>
              <View style={styles.stepText}>
                <PremiumText variant={active ? 'bodyMedium' : 'body'}>
                  {step.label}
                </PremiumText>
                {active && order.status !== 'delivered' ? (
                  <PremiumText variant="caption" color={colors.primary}>
                    In progress…
                  </PremiumText>
                ) : null}
              </View>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.summary}>
        <PremiumText variant="h3">Order summary</PremiumText>
        {order.items.map((line) => (
          <View key={line.item.id} style={styles.line}>
            <PremiumText variant="body">
              {line.quantity}× {line.item.name}
            </PremiumText>
            <PremiumText variant="bodyMedium">
              ${(line.item.price * line.quantity).toFixed(2)}
            </PremiumText>
          </View>
        ))}
        <PremiumText variant="price" style={styles.total}>
          Total ${order.total.toFixed(2)}
        </PremiumText>
      </View>

      {order.status !== 'delivered' ? (
        <PremiumButton
          label="Simulate next step"
          variant="secondary"
          onPress={() => advanceOrderStatus(order.id)}
        />
      ) : null}
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
    paddingBottom: spacing.xxxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: colors.backgroundMuted,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderCurve: 'continuous',
  },
  timeline: {
    gap: spacing.md,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  stepText: {
    flex: 1,
    gap: 2,
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
  total: {
    marginTop: spacing.sm,
    textAlign: 'right',
  },
});
