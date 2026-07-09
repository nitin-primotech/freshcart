import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fetchRestaurants } from "@/features/catalog/api/catalog.api";
import { RecommendedForYouSection } from "@/features/home/components/recommended-for-you-section";
import { getDishesExcluding } from "@/features/home/utils/get-recommended-dishes";
import { MyOrderCard } from "@/features/orders/components/my-order-card";
import { OrdersFilterTabs } from "@/features/orders/components/orders-filter-tabs";
import { OrdersReorderBanner } from "@/features/orders/components/orders-reorder-banner";
import {
	filterOrdersByTab,
	ORDER_TABS,
	type OrderTabId,
} from "@/features/orders/constants/orders.constants";
import { mergeOrdersWithDemo } from "@/features/orders/mocks/demo-orders";
import { AppStatusBar } from "@/shared/components/app-status-bar";
import { AppSymbol } from "@/shared/components/app-symbol";
import { EmptyState } from "@/shared/components/empty-state";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { useSimulatedQuery } from "@/shared/hooks/use-simulated-query";
import { selectOrders, useOrdersStore } from "@/store/orders.store";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { tabBarContentPadding } from "@/theme/tab-bar";
import { fonts } from "@/theme/typography";

export function OrdersScreen() {
	const router = useRouter();
	const { tab } = useLocalSearchParams<{ tab?: string }>();
	const insets = useSafeAreaInsets();
	const storeOrders = useOrdersStore(selectOrders);
	const orders = useMemo(() => mergeOrdersWithDemo(storeOrders), [storeOrders]);

	const initialTab =
		tab && ORDER_TABS.some((entry) => entry.id === tab)
			? (tab as OrderTabId)
			: "all";
	const [activeTab, setActiveTab] = useState<OrderTabId>(initialTab);

	const restaurantsQuery = useSimulatedQuery(
		(signal) => fetchRestaurants(signal),
		[],
	);
	const restaurants = restaurantsQuery.data ?? [];
	const recommendedDishes = useMemo(
		() => getDishesExcluding(restaurants, new Set(), 6, 0),
		[restaurants],
	);

	const filteredOrders = useMemo(
		() => filterOrdersByTab(orders, activeTab),
		[orders, activeTab],
	);

	return (
		<View style={styles.root}>
			<AppStatusBar style="dark" />

			<View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
				<View style={styles.headerCopy}>
					<Text style={styles.headerTitle}>My Orders</Text>
					<Text style={styles.headerSubtitle}>
						Track, view and reorder your past orders
					</Text>
				</View>
				<View style={styles.headerActions}>
					<Pressable
						onPress={() => {
							hapticSoftTap();
							router.push("/search");
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
							router.push("/(tabs)/profile");
						}}
						hitSlop={10}
						style={styles.iconBtn}
						accessibilityRole="button"
						accessibilityLabel="Notifications"
					>
						<AppSymbol name="bell" size={20} tintColor={colors.textPrimary} />
						<View style={styles.notifDot} />
					</Pressable>
				</View>
			</View>

			<OrdersFilterTabs activeTab={activeTab} onChange={setActiveTab} />

			<ScrollView
				style={styles.screen}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[
					styles.content,
					{ paddingBottom: tabBarContentPadding(insets.bottom) },
				]}
			>
				<OrdersReorderBanner />

				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Recent Orders</Text>
					{orders.length > 0 ? (
						<Pressable
							onPress={() => setActiveTab("all")}
							hitSlop={8}
							accessibilityRole="button"
						>
							<Text style={styles.sectionLink}>View all orders {">"}</Text>
						</Pressable>
					) : null}
				</View>

				{filteredOrders.length === 0 ? (
					<EmptyState
						title="No orders in this tab"
						message="Try another filter or start shopping to see orders here."
						actionLabel="Browse groceries"
						onAction={() => router.replace("/(tabs)")}
					/>
				) : (
					<View style={styles.list}>
						{filteredOrders.map((order) => (
							<MyOrderCard key={order.id} order={order} />
						))}
					</View>
				)}

				{recommendedDishes.length > 0 ? (
					<RecommendedForYouSection
						dishes={recommendedDishes}
						viewAllHref="/(tabs)"
						title="Recommended for you"
					/>
				) : null}
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
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.sm,
		backgroundColor: colors.background,
	},
	headerCopy: {
		flex: 1,
		paddingRight: spacing.sm,
		gap: 2,
	},
	headerTitle: {
		fontFamily: fonts.bold,
		fontSize: 15,
		lineHeight: 19,
		color: colors.textPrimary,
	},
	headerSubtitle: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 13,
		color: colors.textSecondary,
	},
	headerActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingTop: 4,
	},
	iconBtn: {
		width: 34,
		height: 34,
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	notifDot: {
		position: "absolute",
		top: 6,
		right: 6,
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.danger,
		borderWidth: 1.5,
		borderColor: colors.background,
	},
	screen: {
		flex: 1,
	},
	content: {
		paddingTop: spacing.md,
		gap: spacing.md,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: spacing.md,
	},
	sectionTitle: {
		fontFamily: fonts.bold,
		fontSize: 15,
		lineHeight: 19,
		color: colors.textPrimary,
	},
	sectionLink: {
		fontFamily: fonts.medium,
		fontSize: 12,
		lineHeight: 15,
		color: colors.primary,
	},
	list: {
		paddingHorizontal: spacing.md,
		gap: spacing.sm,
	},
});
