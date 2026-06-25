import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Order } from '@/features/catalog/types/catalog.types';
import { OrderListCard } from '@/features/orders/components/order-list-card';
import { OrdersSummaryCard } from '@/features/orders/components/orders-summary-card';
import {
  ORDER_TABS,
  type OrderTabId,
} from '@/features/orders/constants/orders.constants';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { EmptyState } from '@/shared/components/empty-state';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  openCartSheet,
  selectCartItemCount,
  useCartStore,
} from '@/store/cart.store';
import { selectOrders, useOrdersStore } from '@/store/orders.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';
import { fonts } from '@/theme/typography';

function filterOrdersByTab(orders: Order[], tab: OrderTabId): Order[] {
  switch (tab) {
    case 'all':
      return orders;
    case 'to_pay':
      return orders.filter((o) => o.status === 'confirmed');
    case 'processing':
      return orders.filter(
        (o) => o.status === 'confirmed' || o.status === 'preparing',
      );
    case 'shipped':
      return orders.filter((o) => o.status === 'on_the_way');
    case 'delivered':
      return orders.filter((o) => o.status === 'delivered');
    case 'cancelled':
      return orders.filter((o) => o.status === 'cancelled');
  }
}

export function OrdersScreen() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const insets = useSafeAreaInsets();
  const orders = useOrdersStore(selectOrders);
  const cartCount = useCartStore(selectCartItemCount);
  const initialTab =
    tab && ORDER_TABS.some((entry) => entry.id === tab)
      ? (tab as OrderTabId)
      : 'all';
  const [activeTab, setActiveTab] = useState<OrderTabId>(initialTab);

  const filteredOrders = useMemo(
    () => filterOrdersByTab(orders, activeTab),
    [orders, activeTab],
  );

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders],
  );

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => {
              hapticSoftTap();
              router.push('/(tabs)');
            }}
            hitSlop={10}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <AppSymbol
              name="magnifyingglass"
              size={20}
              tintColor={colors.textPrimary}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              hapticSoftTap();
              openCartSheet();
            }}
            hitSlop={10}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Cart"
          >
            <AppSymbol name="cart" size={20} tintColor={colors.textPrimary} />
            {cartCount > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 9 ? '9+' : cartCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {ORDER_TABS.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => {
                hapticSoftTap();
                setActiveTab(tab.id);
              }}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text
                style={[styles.tabLabel, selected && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
              {selected ? <View style={styles.tabIndicator} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarContentPadding(insets.bottom) },
        ]}
      >
        {orders.length > 0 ? (
          <OrdersSummaryCard
            totalOrders={orders.length}
            totalSpent={totalSpent}
          />
        ) : null}

        {filteredOrders.length === 0 ? (
          <EmptyState
            title={
              orders.length === 0 ? 'No orders yet' : 'No orders in this tab'
            }
            message={
              orders.length === 0
                ? 'When you place an order, it will appear here.'
                : 'Try another filter to see your orders.'
            }
            actionLabel={orders.length === 0 ? 'Browse restaurants' : undefined}
            onAction={
              orders.length === 0 ? () => router.replace('/(tabs)') : undefined
            }
          />
        ) : (
          <View style={styles.list}>
            {filteredOrders.map((order) => (
              <OrderListCard key={order.id} order={order} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textInverse,
  },
  tabsScroll: {
    flexGrow: 0,
    backgroundColor: colors.backgroundElevated,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tabsContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  tab: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    alignItems: 'center',
    gap: 6,
  },
  tabLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  tabIndicator: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
});
