import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Order } from "@/features/catalog/types/catalog.types";
import { formatUsd } from "@/features/checkout/utils/format-currency";
import {
	countOrderItems,
	formatEstimatedWindow,
	formatOrderDateTime,
	formatOrderId,
	isOngoingOrder,
	ORDER_STATUS_UI,
} from "@/features/orders/constants/orders.constants";
import { isHttpImageUrl } from "@/lib/firebase/category-images";
import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticAddToCart, hapticSoftTap } from "@/shared/haptics/feedback";
import { addToCart } from "@/store/cart.store";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const MAX_THUMBS = 4;

type MyOrderCardProps = {
	order: Order;
};

function OrderThumb({ uri, label }: { uri?: string; label: string }) {
	if (uri && isHttpImageUrl(uri)) {
		return (
			<Image
				source={{ uri }}
				style={styles.thumb}
				contentFit="contain"
				transition={150}
			/>
		);
	}

	return (
		<View style={styles.thumbFallback} accessibilityLabel={label}>
			<AppSymbol name="bag.fill" size={16} tintColor={colors.textTertiary} />
		</View>
	);
}

export function MyOrderCard({ order }: MyOrderCardProps) {
	const router = useRouter();
	const statusUi = ORDER_STATUS_UI[order.status];
	const itemCount = countOrderItems(order.items);
	const visibleItems = order.items.slice(0, MAX_THUMBS);
	const visibleQty = visibleItems.reduce((sum, line) => sum + line.quantity, 0);
	const overflow = Math.max(0, itemCount - visibleQty);
	const isOngoing = isOngoingOrder(order.status);
	const isOutForDelivery = order.status === "on_the_way";
	const isDelivered = order.status === "delivered";
	const isCancelled = order.status === "cancelled";

	function handleDetails() {
		hapticSoftTap();
		router.push(`/order/${order.id}`);
	}

	function handleTrack() {
		hapticSoftTap();
		router.push(`/order/${order.id}`);
	}

	function handleBuyAgain() {
		hapticAddToCart();
		for (const line of order.items) {
			for (let i = 0; i < line.quantity; i += 1) {
				addToCart(line.item, line.restaurantId, line.restaurantName);
			}
		}
	}

	return (
		<View style={styles.card}>
			<View style={styles.topRow}>
				<Text style={styles.orderId}>{formatOrderId(order.id)}</Text>
				<View style={[styles.statusBadge, { backgroundColor: statusUi.bg }]}>
					<AppSymbol
						name={statusUi.icon}
						size={11}
						tintColor={statusUi.color}
					/>
					<Text style={[styles.statusText, { color: statusUi.color }]}>
						{statusUi.label}
					</Text>
				</View>
			</View>

			<Text style={styles.dateText}>
				{formatOrderDateTime(order.createdAt)}
			</Text>

			<View style={styles.thumbRow}>
				{visibleItems.map((line) => (
					<OrderThumb
						key={`${line.restaurantId}:${line.item.id}`}
						uri={line.item.image}
						label={line.item.name}
					/>
				))}
				{overflow > 0 ? (
					<View style={styles.overflow}>
						<Text style={styles.overflowText}>+{overflow}</Text>
						<Text style={styles.overflowSubtext}>more</Text>
					</View>
				) : null}
			</View>

			<Text style={styles.summary}>
				{itemCount} {itemCount === 1 ? "item" : "items"} •{" "}
				{formatUsd(order.total)}
			</Text>

			{isOngoing ? (
				<View style={styles.deliveryBlock}>
					<View style={styles.deliveryCopy}>
						<Text style={styles.deliveryTitle}>Arriving Today</Text>
						<Text
							style={[
								styles.deliveryWindow,
								isOutForDelivery && styles.deliveryWindowActive,
							]}
						>
							{formatEstimatedWindow(order.estimatedDelivery, {
								status: order.status,
								prepStartedAt: order.prepStartedAt,
								prepTime: order.prepTime,
							})}
						</Text>
						{order.rider ? (
							<Text style={styles.riderName}>{order.rider.name}</Text>
						) : null}
					</View>
					{order.rider ? (
						<View style={styles.riderAvatarWrap}>
							{order.rider.avatar && isHttpImageUrl(order.rider.avatar) ? (
								<Image
									source={{ uri: order.rider.avatar }}
									style={styles.riderAvatar}
									contentFit="cover"
								/>
							) : (
								<View style={styles.riderFallback}>
									<AppSymbol
										name="person.fill"
										size={16}
										tintColor={colors.textSecondary}
									/>
								</View>
							)}
						</View>
					) : null}
				</View>
			) : null}

			{isDelivered ? (
				<View style={styles.deliveredRow}>
					<Text style={styles.deliveredText}>
						Delivered {formatOrderDateTime(order.updatedAt)}
					</Text>
					<View style={styles.ratingRow}>
						<AppSymbol name="star.fill" size={11} tintColor={colors.primary} />
						<Text style={styles.ratingText}>4.8</Text>
						<Text style={styles.rateLink}>Rate Order</Text>
					</View>
				</View>
			) : null}

			{isCancelled ? (
				<Text style={styles.cancelledText}>
					Cancelled {formatOrderDateTime(order.updatedAt)}
				</Text>
			) : null}

			<View style={[styles.actions, isCancelled && styles.actionsSingle]}>
				{isOngoing ? (
					<>
						<Pressable
							style={styles.outlineBtn}
							onPress={handleTrack}
							accessibilityRole="button"
							accessibilityLabel="Track order"
						>
							<Text style={styles.outlineBtnText}>Track Order</Text>
						</Pressable>
						<Pressable
							style={styles.primaryBtn}
							onPress={handleDetails}
							accessibilityRole="button"
							accessibilityLabel="Order details"
						>
							<Text style={styles.primaryBtnText}>Order Details</Text>
							<AppSymbol
								name="chevron.right"
								size={11}
								tintColor={colors.textInverse}
							/>
						</Pressable>
					</>
				) : null}

				{isDelivered ? (
					<>
						<Pressable
							style={styles.outlineBtn}
							onPress={handleBuyAgain}
							accessibilityRole="button"
							accessibilityLabel="Buy again"
						>
							<AppSymbol name="cart" size={12} tintColor={colors.primary} />
							<Text style={styles.outlineBtnText}>Buy Again</Text>
						</Pressable>
						<Pressable
							style={styles.primaryBtn}
							onPress={handleDetails}
							accessibilityRole="button"
							accessibilityLabel="Order details"
						>
							<Text style={styles.primaryBtnText}>Order Details</Text>
							<AppSymbol
								name="chevron.right"
								size={11}
								tintColor={colors.textInverse}
							/>
						</Pressable>
					</>
				) : null}

				{isCancelled ? (
					<Pressable
						style={[styles.outlineBtn, styles.outlineBtnFull]}
						onPress={handleDetails}
						accessibilityRole="button"
						accessibilityLabel="Order details"
					>
						<Text style={styles.outlineBtnText}>Order Details</Text>
					</Pressable>
				) : null}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.backgroundElevated,
		borderRadius: 16,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.sm,
	},
	topRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	orderId: {
		flex: 1,
		fontFamily: fonts.bold,
		fontSize: 13,
		lineHeight: 17,
		color: colors.textPrimary,
	},
	statusBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		borderRadius: radius.full,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	statusText: {
		fontFamily: fonts.semibold,
		fontSize: 10,
		lineHeight: 12,
	},
	dateText: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 13,
		color: colors.textSecondary,
		marginTop: -4,
	},
	thumbRow: {
		flexDirection: "row",
		gap: spacing.xs,
		marginTop: spacing.xxs,
	},
	thumb: {
		width: 46,
		height: 46,
		borderRadius: 10,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.background,
	},
	thumbFallback: {
		width: 46,
		height: 46,
		borderRadius: 10,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.backgroundMuted,
		alignItems: "center",
		justifyContent: "center",
	},
	overflow: {
		width: 46,
		height: 46,
		borderRadius: 10,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.backgroundMuted,
		alignItems: "center",
		justifyContent: "center",
	},
	overflowText: {
		fontFamily: fonts.bold,
		fontSize: 10,
		lineHeight: 12,
		color: colors.textSecondary,
	},
	overflowSubtext: {
		fontFamily: fonts.medium,
		fontSize: 9,
		lineHeight: 11,
		color: colors.textTertiary,
	},
	summary: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 15,
		color: colors.textPrimary,
	},
	deliveryBlock: {
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	deliveryCopy: {
		flex: 1,
		gap: 2,
	},
	deliveryTitle: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 15,
		color: colors.textPrimary,
	},
	deliveryWindow: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 13,
		color: colors.textSecondary,
	},
	deliveryWindowActive: {
		color: colors.primary,
	},
	riderName: {
		fontFamily: fonts.medium,
		fontSize: 11,
		lineHeight: 14,
		color: colors.textSecondary,
		marginTop: 2,
	},
	riderAvatarWrap: {
		paddingBottom: 2,
	},
	riderAvatar: {
		width: 36,
		height: 36,
		borderRadius: radius.full,
		backgroundColor: colors.backgroundMuted,
	},
	riderFallback: {
		width: 36,
		height: 36,
		borderRadius: radius.full,
		backgroundColor: colors.backgroundMuted,
		alignItems: "center",
		justifyContent: "center",
	},
	deliveredRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	deliveredText: {
		flex: 1,
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 13,
		color: colors.textSecondary,
	},
	ratingRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	ratingText: {
		fontFamily: fonts.bold,
		fontSize: 11,
		lineHeight: 13,
		color: colors.textPrimary,
	},
	rateLink: {
		fontFamily: fonts.semibold,
		fontSize: 11,
		lineHeight: 13,
		color: colors.primary,
	},
	cancelledText: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 13,
		color: colors.textSecondary,
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginTop: spacing.xxs,
	},
	actionsSingle: {
		flexDirection: "column",
	},
	outlineBtn: {
		flex: 1,
		minHeight: 38,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
		borderRadius: radius.full,
		borderCurve: "continuous",
		borderWidth: 1.5,
		borderColor: colors.primary,
		backgroundColor: colors.backgroundElevated,
		paddingHorizontal: spacing.sm,
	},
	outlineBtnFull: {
		width: "100%",
		flex: undefined,
	},
	outlineBtnText: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 15,
		color: colors.primary,
	},
	primaryBtn: {
		flex: 1,
		minHeight: 38,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
		borderRadius: radius.full,
		borderCurve: "continuous",
		backgroundColor: colors.primary,
		paddingHorizontal: spacing.sm,
	},
	primaryBtnText: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 15,
		color: colors.textInverse,
	},
});
