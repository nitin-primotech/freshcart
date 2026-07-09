import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import {
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fetchRestaurantById } from "@/features/catalog/api/catalog.api";
import { HomeSectionHeader } from "@/features/home/components/home-section-header";
import { RestaurantTileCard } from "@/features/home/components/restaurant-tile-card";
import { TopPicksProductCard } from "@/features/home/components/top-picks-product-card";
import { AppStatusBar } from "@/shared/components/app-status-bar";
import { AppSymbol } from "@/shared/components/app-symbol";
import { ErrorState } from "@/shared/components/error-state";
import { Shimmer } from "@/shared/components/shimmer";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { useCarouselItemWidth } from "@/shared/hooks/use-carousel-item-width";
import { useSimulatedQuery } from "@/shared/hooks/use-simulated-query";
import { selectCartItemCount, useCartStore } from "@/store/cart.store";
import { colors } from "@/theme/colors";
import { screenTopPadding } from "@/theme/screen-edge";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

export function RestaurantScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { width } = useWindowDimensions();
	const { id } = useLocalSearchParams<{ id: string }>();
	const cartCount = useCartStore(selectCartItemCount);

	const { data, status, error, refetch, isRefreshing } = useSimulatedQuery(
		(signal) => fetchRestaurantById(id ?? "", signal),
		[id],
		{ enabled: Boolean(id) },
	);

	const menuCardWidth = useCarouselItemWidth({
		visibleCount: 2.2,
		peek: 0.03,
		gap: spacing.md,
		paddingEnd: spacing.md,
	});
	const heroCardWidth = width - spacing.md * 2;

	const onRefresh = useCallback(() => {
		refetch();
	}, [refetch]);

	function onBack() {
		hapticSoftTap();
		router.back();
	}

	if (status === "loading") {
		return (
			<View style={styles.root}>
				<AppStatusBar style="dark" />
				<View
					style={[styles.loading, { paddingTop: screenTopPadding(insets.top) }]}
				>
					<Shimmer height={220} borderRadius={14} />
					<Shimmer height={160} borderRadius={14} />
					<Shimmer height={160} borderRadius={14} />
				</View>
			</View>
		);
	}

	if (status === "error" || !data) {
		return (
			<ErrorState message={error ?? "Restaurant not found"} onRetry={refetch} />
		);
	}

	return (
		<View style={styles.root}>
			<AppStatusBar style="dark" />
			<View
				style={[styles.topBar, { paddingTop: screenTopPadding(insets.top) }]}
			>
				<Pressable
					style={styles.backBtn}
					onPress={onBack}
					accessibilityRole="button"
					accessibilityLabel="Go back"
				>
					<AppSymbol
						name="chevron.left"
						size={20}
						tintColor={colors.textPrimary}
					/>
				</Pressable>
				<Text style={styles.title} numberOfLines={1}>
					{data.name}
				</Text>
				<View style={styles.backBtn} />
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[
					styles.content,
					{ paddingBottom: insets.bottom + (cartCount > 0 ? 120 : spacing.xl) },
				]}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={onRefresh}
						tintColor={colors.textPrimary}
					/>
				}
			>
				<View style={styles.hero}>
					<RestaurantTileCard restaurant={data} width={heroCardWidth} />
				</View>

				{data.menu.map((section) => (
					<View key={section.id} style={styles.section}>
						<HomeSectionHeader title={section.title} />
						<ScrollView
							horizontal
							nestedScrollEnabled
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.menuRow}
						>
							{section.items.map((item) => (
								<TopPicksProductCard
									key={item.id}
									dish={{
										item,
										restaurantId: data.id,
										restaurantName: data.name,
										rating: data.rating,
									}}
									width={menuCardWidth}
								/>
							))}
						</ScrollView>
					</View>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: colors.background,
	},
	topBar: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.sm,
		backgroundColor: colors.background,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.border,
	},
	backBtn: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		flex: 1,
		textAlign: "center",
		fontFamily: fonts.semibold,
		fontSize: 16,
		lineHeight: 20,
		color: colors.textPrimary,
	},
	content: {
		paddingTop: spacing.sm,
		gap: spacing.md,
	},
	loading: {
		paddingHorizontal: spacing.md,
		gap: spacing.md,
	},
	hero: {
		paddingHorizontal: spacing.md,
	},
	section: {
		marginTop: spacing.xs,
	},
	menuRow: {
		paddingLeft: spacing.md,
		paddingRight: spacing.xs,
	},
});
