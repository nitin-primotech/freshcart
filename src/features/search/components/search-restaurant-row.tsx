import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Restaurant } from "@/features/catalog/types/catalog.types";
import { formatInr } from "@/features/checkout/utils/format-currency";
import { estimatePriceForTwo } from "@/features/search/utils/search-suggestions";
import { AppSymbol } from "@/shared/components/app-symbol";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

type SearchRestaurantRowProps = {
	restaurant: Restaurant;
};

export function SearchRestaurantRow({ restaurant }: SearchRestaurantRowProps) {
	const heroItem = restaurant.menu[0]?.items[0];
	const image = heroItem?.image ?? restaurant.coverImage;
	const priceForTwo = estimatePriceForTwo(restaurant);

	return (
		<Link href={`/restaurant/${restaurant.id}`} asChild>
			<Pressable style={styles.card} accessibilityRole="button">
				<View style={styles.imageWrap}>
					<Image
						source={{ uri: image }}
						style={styles.image}
						contentFit="cover"
					/>
				</View>

				<View style={styles.body}>
					<Text style={styles.name} numberOfLines={1}>
						{restaurant.name}
					</Text>
					<Text style={styles.cuisine} numberOfLines={1}>
						{restaurant.cuisine}
					</Text>

					<View style={styles.metaRow}>
						<View style={styles.ratingBadge}>
							<AppSymbol
								name="star.fill"
								size={10}
								tintColor={colors.success}
							/>
							<Text style={styles.ratingText}>
								{restaurant.rating.toFixed(1)}
							</Text>
						</View>
						<Text style={styles.metaText}>
							{restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min
						</Text>
						<Text style={styles.metaText}>
							{formatInr(priceForTwo)} for two
						</Text>
					</View>

					{restaurant.isFreeDelivery ? (
						<Text style={styles.freeDelivery}>
							Free delivery over {formatInr(199)}
						</Text>
					) : restaurant.offerLabel ? (
						<Text style={styles.freeDelivery}>{restaurant.offerLabel}</Text>
					) : null}
				</View>
			</Pressable>
		</Link>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
		backgroundColor: colors.backgroundElevated,
		borderRadius: 14,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.sm,
	},
	imageWrap: {
		width: 88,
		height: 88,
		borderRadius: 12,
		borderCurve: "continuous",
		overflow: "hidden",
		backgroundColor: colors.backgroundMuted,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	body: {
		flex: 1,
		gap: 4,
		minWidth: 0,
		paddingTop: 2,
	},
	name: {
		fontFamily: fonts.bold,
		fontSize: 13,
		lineHeight: 17,
		color: colors.textPrimary,
	},
	cuisine: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 14,
		color: colors.textSecondary,
	},
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 6,
		marginTop: 2,
	},
	ratingBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 3,
		backgroundColor: colors.successLight,
		borderRadius: 4,
		paddingHorizontal: 5,
		paddingVertical: 2,
	},
	ratingText: {
		fontFamily: fonts.semibold,
		fontSize: 10,
		lineHeight: 12,
		color: colors.success,
	},
	metaText: {
		fontFamily: fonts.regular,
		fontSize: 10,
		lineHeight: 13,
		color: colors.textSecondary,
	},
	freeDelivery: {
		fontFamily: fonts.medium,
		fontSize: 10,
		lineHeight: 13,
		color: colors.primary,
		marginTop: 2,
	},
});
