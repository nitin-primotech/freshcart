import { ScrollView, StyleSheet, Text, View } from "react-native";

import { HomeSectionHeader } from "@/features/home/components/home-section-header";
import { AppSymbol } from "@/shared/components/app-symbol";
import { useCarouselItemWidth } from "@/shared/hooks/use-carousel-item-width";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const OFFERS = [
	{
		id: "bank",
		title: "10% Instant Discount",
		subtitle: "On HDFC Bank Cards",
		bg: "#E8F5E9",
		icon: "tag.fill" as const,
		iconColor: colors.primary,
	},
	{
		id: "delivery",
		title: "Free Delivery",
		subtitle: "On orders above $35",
		bg: "#FFF8E1",
		icon: "truck.box.fill" as const,
		iconColor: "#D97706",
	},
	{
		id: "weekend",
		title: "Weekend Special",
		subtitle: "Up to 30% off on snacks",
		bg: "#FCE4EC",
		icon: "bag.fill" as const,
		iconColor: "#DB2777",
	},
] as const;

export function HomeOffersSection() {
	const cardWidth = useCarouselItemWidth({
		visibleCount: 1.35,
		peek: 0.05,
		gap: spacing.md,
		paddingEnd: spacing.md,
	});

	return (
		<View style={styles.wrap}>
			<HomeSectionHeader title="Offers for you" href="/profile/offers" />
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
							{ width: cardWidth, backgroundColor: offer.bg },
						]}
					>
						<View style={styles.copy}>
							<Text style={styles.title}>{offer.title}</Text>
							<Text style={styles.subtitle}>{offer.subtitle}</Text>
						</View>
						<View style={styles.iconWrap}>
							<AppSymbol
								name={offer.icon}
								size={28}
								tintColor={offer.iconColor}
								weight="semibold"
							/>
						</View>
					</View>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		marginTop: spacing.lg,
	},
	row: {
		paddingLeft: spacing.md,
		paddingRight: spacing.xs,
	},
	card: {
		height: 96,
		borderRadius: radius.lg,
		borderCurve: "continuous",
		marginRight: spacing.md,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.md,
		overflow: "hidden",
	},
	copy: {
		flex: 1,
		gap: spacing.xxs,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 14,
		lineHeight: 18,
		color: colors.textPrimary,
	},
	subtitle: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 14,
		color: colors.textSecondary,
	},
	iconWrap: {
		width: 52,
		height: 52,
		borderRadius: radius.full,
		backgroundColor: "rgba(255,255,255,0.7)",
		alignItems: "center",
		justifyContent: "center",
	},
});
