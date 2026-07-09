import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { HomeSectionHeader } from "@/features/home/components/home-section-header";
import { DEFAULT_MERCHANT_RESTAURANT_ID } from "@/lib/firebase/inventory-mapper";
import { AppSymbol } from "@/shared/components/app-symbol";
import { useCarouselItemWidth } from "@/shared/hooks/use-carousel-item-width";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const OFFERS = [
	{
		id: "offer-1",
		eyebrow: "FLAT",
		headline: "20% OFF",
		subline: "On Popular Dishes",
		backgroundColor: "#FDEEEA",
		textColor: colors.primaryDark,
		accentColor: "rgba(212, 84, 60, 0.18)",
		iconColor: colors.primary,
		icon: "tag.fill",
	},
	{
		id: "offer-2",
		eyebrow: "UP TO",
		headline: "25% OFF",
		subline: "On Premium Meals",
		backgroundColor: colors.accentMuted,
		textColor: "#7A5C1E",
		accentColor: "rgba(201, 169, 98, 0.22)",
		iconColor: "#A8844A",
		icon: "crown.fill",
	},
	{
		id: "offer-3",
		eyebrow: "UP TO",
		headline: "30% OFF",
		subline: "On Weekend Specials",
		backgroundColor: colors.successLight,
		textColor: colors.success,
		accentColor: "rgba(45, 106, 79, 0.16)",
		iconColor: colors.success,
		icon: "sparkles",
	},
] as const;

export function HomeBestOffers() {
	const router = useRouter();
	const cardWidth = useCarouselItemWidth({
		visibleCount: 1.38,
		peek: 0.05,
		gap: spacing.md,
		paddingEnd: spacing.md,
	});

	return (
		<View style={styles.wrap}>
			<HomeSectionHeader
				title="Best Offers"
				onViewAll={() =>
					router.push(`/restaurant/${DEFAULT_MERCHANT_RESTAURANT_ID}`)
				}
			/>
			<ScrollView
				horizontal
				nestedScrollEnabled
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.row}
			>
				{OFFERS.map((offer) => (
					<View
						key={offer.id}
						style={[
							styles.card,
							{ width: cardWidth, backgroundColor: offer.backgroundColor },
						]}
					>
						<View style={styles.copy}>
							<Text style={[styles.eyebrow, { color: offer.textColor }]}>
								{offer.eyebrow}
							</Text>
							<Text style={[styles.headline, { color: offer.textColor }]}>
								{offer.headline}
							</Text>
							<Text style={[styles.subline, { color: offer.textColor }]}>
								{offer.subline}
							</Text>
						</View>

						<View style={styles.artwork}>
							<View
								style={[styles.blob, { backgroundColor: offer.accentColor }]}
							/>
							<LinearGradient
								colors={[offer.accentColor, "transparent"]}
								start={{ x: 0.2, y: 0.2 }}
								end={{ x: 1, y: 1 }}
								style={styles.blobGlow}
							/>
							<View
								style={[
									styles.iconBadge,
									{ backgroundColor: offer.backgroundColor },
								]}
							>
								<AppSymbol
									name={offer.icon}
									size={28}
									tintColor={offer.iconColor}
									weight="semibold"
								/>
							</View>
						</View>
					</View>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		marginTop: spacing.md,
	},
	row: {
		paddingLeft: spacing.md,
		paddingRight: spacing.xs,
	},
	card: {
		height: 104,
		borderRadius: 16,
		borderCurve: "continuous",
		marginRight: spacing.md,
		flexDirection: "row",
		overflow: "hidden",
		paddingLeft: spacing.md,
		paddingVertical: spacing.sm,
	},
	copy: {
		flex: 1,
		justifyContent: "center",
		gap: 1,
		paddingRight: spacing.xs,
		zIndex: 1,
	},
	eyebrow: {
		fontFamily: fonts.medium,
		fontSize: 10,
		lineHeight: 13,
		letterSpacing: 0.3,
	},
	headline: {
		fontFamily: fonts.bold,
		fontSize: 16,
		lineHeight: 20,
	},
	subline: {
		fontFamily: fonts.medium,
		fontSize: 11,
		lineHeight: 14,
		opacity: 0.9,
	},
	artwork: {
		width: 92,
		alignItems: "center",
		justifyContent: "center",
	},
	blob: {
		position: "absolute",
		width: 88,
		height: 88,
		borderRadius: 44,
		right: -18,
		top: 4,
	},
	blobGlow: {
		position: "absolute",
		width: 72,
		height: 72,
		borderRadius: 36,
		right: -8,
		top: 12,
	},
	iconBadge: {
		width: 52,
		height: 52,
		borderRadius: 26,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.65)",
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 2,
	},
});
