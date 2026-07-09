import { useRouter, useSegments } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { WishlistDishRow } from "@/features/wishlist/components/wishlist-dish-row";
import { WishlistExploreBanner } from "@/features/wishlist/components/wishlist-explore-banner";
import { WishlistSummaryCard } from "@/features/wishlist/components/wishlist-summary-card";
import { AppStatusBar } from "@/shared/components/app-status-bar";
import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import {
	openCartSheet,
	selectCartItemCount,
	useCartStore,
} from "@/store/cart.store";
import {
	clearWishlist,
	selectWishlistEntries,
	useWishlistStore,
} from "@/store/wishlist.store";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { tabBarContentPadding } from "@/theme/tab-bar";
import { fonts } from "@/theme/typography";

type WishlistScreenProps = {
	showBack?: boolean;
};

export function WishlistScreen({ showBack }: WishlistScreenProps) {
	const router = useRouter();
	const segments = useSegments();
	const insets = useSafeAreaInsets();
	const dishes = useWishlistStore(selectWishlistEntries);
	const cartCount = useCartStore(selectCartItemCount);

	const isTabScreen = segments[0] === "(tabs)" && segments[1] === "wishlist";
	const canGoBack = showBack ?? !isTabScreen;

	const [isManaging, setIsManaging] = useState(false);

	function onBack() {
		hapticSoftTap();
		router.back();
	}

	function onExplore() {
		router.push("/search");
	}

	return (
		<View style={styles.root}>
			<AppStatusBar style="dark" />

			<View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
				<View style={styles.headerLeading}>
					{canGoBack ? (
						<Pressable
							onPress={onBack}
							style={styles.iconBtn}
							accessibilityRole="button"
							accessibilityLabel="Go back"
						>
							<AppSymbol
								name="chevron.left"
								size={20}
								tintColor={colors.textPrimary}
							/>
						</Pressable>
					) : null}
					<Text style={styles.headerTitle}>My Wishlist</Text>
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
									{cartCount > 9 ? "9+" : cartCount}
								</Text>
							</View>
						) : null}
					</Pressable>
				</View>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[
					styles.content,
					{ paddingBottom: tabBarContentPadding(insets.bottom) },
				]}
			>
				<WishlistSummaryCard
					totalCount={dishes.length}
					isManaging={isManaging}
					onManagePress={() => setIsManaging((value) => !value)}
					onClearPress={clearWishlist}
				/>

				<View style={styles.list}>
					{dishes.length === 0 ? (
						<View style={styles.emptyPanel}>
							<AppSymbol
								name="heart"
								size={28}
								tintColor={colors.textTertiary}
							/>
							<Text style={styles.emptyTitle}>No saved dishes yet</Text>
							<Text style={styles.emptyMessage}>
								Tap the heart on any dish to save it here.
							</Text>
						</View>
					) : (
						dishes.map((entry) => (
							<WishlistDishRow
								key={`${entry.restaurantId}-${entry.item.id}`}
								entry={entry}
							/>
						))
					)}
				</View>

				<WishlistExploreBanner onExplore={onExplore} />
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
		backgroundColor: colors.backgroundElevated,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.border,
	},
	headerLeading: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xxs,
		flex: 1,
		minWidth: 0,
	},
	headerTitle: {
		fontFamily: fonts.bold,
		fontSize: 16,
		lineHeight: 20,
		color: colors.textPrimary,
	},
	headerActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		flexShrink: 0,
	},
	iconBtn: {
		width: 36,
		height: 36,
		alignItems: "center",
		justifyContent: "center",
	},
	cartBadge: {
		position: "absolute",
		top: 2,
		right: 2,
		minWidth: 16,
		height: 16,
		borderRadius: 8,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 3,
	},
	cartBadgeText: {
		fontFamily: fonts.bold,
		fontSize: 9,
		lineHeight: 11,
		color: colors.textInverse,
	},
	content: {
		gap: spacing.md,
		paddingTop: spacing.xs,
	},
	list: {
		paddingHorizontal: spacing.md,
		gap: spacing.sm,
		minHeight: 120,
	},
	emptyPanel: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing.xl,
		paddingHorizontal: spacing.lg,
		gap: spacing.sm,
		borderRadius: 16,
		borderCurve: "continuous",
		backgroundColor: colors.backgroundElevated,
		borderWidth: 1,
		borderColor: colors.border,
	},
	emptyTitle: {
		fontFamily: fonts.semibold,
		fontSize: 15,
		lineHeight: 20,
		color: colors.textPrimary,
		textAlign: "center",
	},
	emptyMessage: {
		fontFamily: fonts.regular,
		fontSize: 12,
		lineHeight: 17,
		color: colors.textSecondary,
		textAlign: "center",
	},
});
