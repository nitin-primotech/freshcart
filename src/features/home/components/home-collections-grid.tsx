import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { HomeSectionHeader } from "@/features/home/components/home-section-header";
import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const COLLECTIONS = [
	{
		id: "veg",
		title: "Veg delights",
		subtitle: "Fresh & wholesome",
		categoryId: "cat-veg-curries",
		gradient: ["#4A9B6E", "#2D6A4F"] as [string, string],
		icon: "leaf.fill",
	},
	{
		id: "tandoor",
		title: "Tandoor",
		subtitle: "Smoky & grilled",
		categoryId: "cat-tandoor-specials",
		gradient: ["#D97706", "#B45309"] as [string, string],
		icon: "flame.fill",
	},
	{
		id: "street",
		title: "Street food",
		subtitle: "Rolls & snacks",
		categoryId: "cat-rolls-street-food",
		gradient: ["#D4543C", "#9A3B2E"] as [string, string],
		icon: "takeoutbag.and.cup.and.straw.fill",
	},
	{
		id: "curries",
		title: "Curries",
		subtitle: "Rich & comforting",
		categoryId: "cat-veg-curries",
		gradient: ["#7C5CBF", "#5B3F96"] as [string, string],
		icon: "cup.and.saucer.fill",
	},
] as const;

export function HomeCollectionsGrid() {
	const router = useRouter();
	const rows = [COLLECTIONS.slice(0, 2), COLLECTIONS.slice(2, 4)];

	function openCollection(categoryId: string) {
		hapticSoftTap();
		router.push(`/category/${categoryId}`);
	}

	return (
		<View>
			<HomeSectionHeader title="In the mood for" />
			<View style={styles.grid}>
				{rows.map((row, rowIndex) => (
					<View key={`row-${rowIndex}`} style={styles.row}>
						{row.map((item) => (
							<Pressable
								key={item.id}
								style={styles.cell}
								onPress={() => openCollection(item.categoryId)}
								accessibilityRole="button"
								accessibilityLabel={item.title}
							>
								<LinearGradient
									colors={item.gradient}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={styles.card}
								>
									<View style={styles.copy}>
										<Text style={styles.title}>{item.title}</Text>
										<Text style={styles.subtitle}>{item.subtitle}</Text>
									</View>
									<View style={styles.iconWrap} pointerEvents="none">
										<AppSymbol
											name={item.icon}
											size={34}
											tintColor="rgba(255, 255, 255, 0.28)"
											weight="semibold"
										/>
									</View>
								</LinearGradient>
							</Pressable>
						))}
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	grid: {
		paddingHorizontal: spacing.md,
		gap: spacing.sm,
	},
	row: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	cell: {
		flex: 1,
	},
	card: {
		height: 78,
		borderRadius: 14,
		borderCurve: "continuous",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		overflow: "hidden",
		justifyContent: "center",
	},
	copy: {
		gap: 2,
		maxWidth: "72%",
	},
	title: {
		fontFamily: fonts.semibold,
		fontSize: 13,
		lineHeight: 17,
		color: colors.textInverse,
	},
	subtitle: {
		fontFamily: fonts.regular,
		fontSize: 10,
		lineHeight: 13,
		color: "rgba(255, 255, 255, 0.82)",
	},
	iconWrap: {
		position: "absolute",
		right: spacing.sm,
		bottom: spacing.sm,
	},
});
