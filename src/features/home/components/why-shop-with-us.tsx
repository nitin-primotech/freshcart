import { StyleSheet, Text, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const TRUST_ITEMS = [
	{
		id: "fast",
		title: "Fast Delivery",
		subtitle: "15–30 mins",
		icon: "bolt.fill" as const,
	},
	{
		id: "prices",
		title: "Best Prices",
		subtitle: "Everyday",
		icon: "tag.fill" as const,
	},
	{
		id: "selection",
		title: "Wide Selection",
		subtitle: "10,000+ products",
		icon: "cart.fill" as const,
	},
	{
		id: "secure",
		title: "Secure Payment",
		subtitle: "100% secure",
		icon: "shield.fill" as const,
	},
] as const;

export function WhyShopWithUs() {
	return (
		<View style={styles.wrap}>
			<Text style={styles.title}>Why Shop With FreshCart?</Text>
			<View style={styles.grid}>
				{TRUST_ITEMS.map((item) => (
					<View key={item.id} style={styles.item}>
						<View style={styles.iconWrap}>
							<AppSymbol
								name={item.icon}
								size={14}
								tintColor={colors.primary}
								weight="semibold"
							/>
						</View>
						<View style={styles.copy}>
							<Text style={styles.itemTitle}>{item.title}</Text>
							<Text style={styles.itemSubtitle}>{item.subtitle}</Text>
						</View>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		marginTop: spacing.md,
		marginHorizontal: spacing.md,
		padding: spacing.md,
		backgroundColor: colors.backgroundElevated,
		borderRadius: 12,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 15,
		lineHeight: 19,
		color: colors.textPrimary,
		marginBottom: spacing.sm,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: spacing.sm,
	},
	item: {
		width: "50%",
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingRight: spacing.xs,
	},
	iconWrap: {
		width: 32,
		height: 32,
		borderRadius: 8,
		borderCurve: "continuous",
		backgroundColor: colors.successLight,
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
	},
	copy: {
		flex: 1,
		minWidth: 0,
		gap: 1,
	},
	itemTitle: {
		fontFamily: fonts.semibold,
		fontSize: 11,
		lineHeight: 13,
		color: colors.textPrimary,
	},
	itemSubtitle: {
		fontFamily: fonts.regular,
		fontSize: 9,
		lineHeight: 11,
		color: colors.textSecondary,
	},
});
