import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { EmptyState } from '@/shared/components/empty-state';
import { PremiumText } from '@/shared/components/premium-text';
import { selectOrders, useOrdersStore } from '@/store/orders.store';
import { colors, screens, shadows } from '@/theme/colors';
import { screenTopPadding } from '@/theme/screen-edge';
import { radius, spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  on_the_way: 'On the way',
  delivered: 'Delivered',
};

export function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const orders = useOrdersStore(selectOrders);
  const active = orders.find((o) => o.status !== 'delivered');

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />
      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: screenTopPadding(insets.top),
            paddingBottom: tabBarContentPadding(insets.bottom),
          },
        ]}
      >
        <PremiumText variant="display">Orders</PremiumText>

        {active ? (
          <Link href={`/order/${active.id}`} asChild>
            <AnimatedPressable
              entering={FadeInDown.duration(400)}
              style={styles.activeCard}
            >
              <PremiumText variant="label" color={colors.primary}>
                Active order
              </PremiumText>
              <PremiumText variant="h3">{active.restaurantName}</PremiumText>
              <View style={styles.progress}>
                {(
                  ['confirmed', 'preparing', 'on_the_way', 'delivered'] as const
                ).map((step, i) => {
                  const steps = [
                    'confirmed',
                    'preparing',
                    'on_the_way',
                    'delivered',
                  ];
                  const idx = steps.indexOf(active.status);
                  const done = i <= idx;
                  return (
                    <View key={step} style={styles.stepRow}>
                      <View
                        style={[
                          styles.dot,
                          {
                            backgroundColor: done
                              ? screens.tracking.activeStep
                              : screens.tracking.inactiveStep,
                          },
                        ]}
                      />
                      {i < 3 ? (
                        <View
                          style={[
                            styles.line,
                            {
                              backgroundColor:
                                i < idx
                                  ? screens.tracking.activeStep
                                  : screens.tracking.inactiveStep,
                            },
                          ]}
                        />
                      ) : null}
                    </View>
                  );
                })}
              </View>
              <PremiumText variant="caption" color={colors.textSecondary}>
                {STATUS_LABEL[active.status]} · ${active.total.toFixed(2)}
              </PremiumText>
            </AnimatedPressable>
          </Link>
        ) : null}

        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            message="When you place an order, it will appear here."
            actionLabel="Browse restaurants"
            onAction={() => router.replace('/(tabs)')}
          />
        ) : (
          <View style={styles.history}>
            <PremiumText variant="h3">Past orders</PremiumText>
            {orders.map((order, i) => (
              <Link key={order.id} href={`/order/${order.id}`} asChild>
                <AnimatedPressable
                  entering={FadeInDown.delay(i * 60).duration(350)}
                  style={styles.orderRow}
                >
                  <Image
                    source={{
                      uri: order.restaurantLogo || order.items[0]?.item.image,
                    }}
                    style={styles.thumb}
                  />
                  <View style={styles.orderMeta}>
                    <PremiumText variant="bodyMedium">
                      {order.restaurantName}
                    </PremiumText>
                    <PremiumText variant="caption" color={colors.textSecondary}>
                      {new Date(order.createdAt).toLocaleDateString()} ·{' '}
                      {order.items.length} items
                    </PremiumText>
                  </View>
                  <PremiumText variant="bodyMedium">
                    ${order.total.toFixed(2)}
                  </PremiumText>
                </AnimatedPressable>
              </Link>
            ))}
          </View>
        )}
      </ScrollView>
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
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  activeCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderCurve: 'continuous',
    ...shadows.card,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
  },
  line: {
    flex: 1,
    height: 3,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  history: {
    gap: spacing.md,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    padding: spacing.md,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    ...shadows.soft,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
  },
  orderMeta: {
    flex: 1,
    gap: 2,
  },
});
