import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const ACTIONS = [
	{
		id: "reorder",
		label: "Reorder",
		sublabel: "Your Essentials",
		icon: "arrow.2.circlepath" as const,
		tint: "#2D8B3F",
		bg: "#E8F5E9",
		href: "/(tabs)/orders" as const,
	},
	{
		id: "offers",
		label: "Offers",
		sublabel: "Best Discounts",
		icon: "tag.fill" as const,
		tint: "#DC2626",
		bg: "#FEE2E2",
		href: "/profile/offers" as const,
	},
	{
		id: "buy-again",
		label: "Buy Again",
		sublabel: "Quick Add",
		icon: "bag.fill" as const,
		tint: "#D97706",
		bg: "#FEF3C7",
		href: "/(tabs)/categories" as const,
	},
	{
		id: "categories",
		label: "Categories",
		sublabel: "All Products",
		icon: "circle.grid.2x2.fill" as const,
		tint: "#7C3AED",
		bg: "#EDE9FE",
		href: "/(tabs)/categories" as const,
	},
] as const;

export function HomeQuickActions() {
	const router = useRouter();

	return (
		<ScrollView
			horizontal
			nestedScrollEnabled
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.row}
		>
			{ACTIONS.map((action) => (
				<Pressable
					key={action.id}
					style={styles.card}
					onPress={() => {
						hapticSoftTap();
						router.push(action.href);
					}}
					accessibilityRole="button"
					accessibilityLabel={action.label}
				>
					<View style={[styles.iconWrap, { backgroundColor: action.bg }]}>
						<AppSymbol
							name={action.icon}
							size={18}
							tintColor={action.tint}
							weight="semibold"
						/>
					</View>
					<View style={styles.copy}>
						<Text style={styles.label}>{action.label}</Text>
						<Text style={styles.sublabel}>{action.sublabel}</Text>
					</View>
				</Pressable>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	row: {
		paddingHorizontal: spacing.md,
		gap: spacing.sm,
		paddingVertical: spacing.sm,
	},
	card: {
		width: 132,
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: colors.backgroundElevated,
		borderRadius: radius.md,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.sm,
	},
	iconWrap: {
		width: 36,
		height: 36,
		borderRadius: radius.full,
		alignItems: "center",
		justifyContent: "center",
	},
	copy: {
		flex: 1,
		gap: 1,
	},
	label: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 15,
		color: colors.textPrimary,
	},
	sublabel: {
		fontFamily: fonts.regular,
		fontSize: 10,
		lineHeight: 13,
		color: colors.textSecondary,
	},
});
