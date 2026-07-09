import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { HomeSectionHeader } from "@/features/home/components/home-section-header";
import { SEARCH_TRENDING } from "@/features/search/constants/search.constants";
import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

export function SearchTrendingSection() {
	const router = useRouter();

	return (
		<View style={styles.wrap}>
			<HomeSectionHeader title="Trending Now" href="/(tabs)/categories" />
			<ScrollView
				horizontal
				nestedScrollEnabled
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.row}
			>
				{SEARCH_TRENDING.map((item) => (
					<Pressable
						key={item.id}
						style={styles.chip}
						onPress={() => {
							hapticSoftTap();
							router.push(`/category/${item.categoryId}`);
						}}
						accessibilityRole="button"
						accessibilityLabel={item.name}
					>
						<AppSymbol name={item.icon} size={14} tintColor={colors.primary} />
						<Text style={styles.chipText}>{item.name}</Text>
					</Pressable>
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
		paddingHorizontal: spacing.md,
		gap: spacing.sm,
	},
	chip: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: colors.backgroundElevated,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.full,
		borderCurve: "continuous",
		paddingHorizontal: spacing.sm,
		paddingVertical: 8,
	},
	chipText: {
		fontFamily: fonts.medium,
		fontSize: 12,
		lineHeight: 15,
		color: colors.textPrimary,
	},
});
