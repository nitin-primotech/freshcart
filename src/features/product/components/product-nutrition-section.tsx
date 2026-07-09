import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

export type NutritionFact = {
	label: string;
	value: string;
};

type ProductNutritionSectionProps = {
	facts: NutritionFact[];
	onExpand?: () => void;
};

export function ProductNutritionSection({
	facts,
	onExpand,
}: ProductNutritionSectionProps) {
	return (
		<View style={styles.wrap}>
			<Pressable
				style={styles.header}
				onPress={onExpand}
				accessibilityRole="button"
			>
				<Text style={styles.title}>Nutrition (per 100g)</Text>
				<AppSymbol
					name="chevron.right"
					size={14}
					tintColor={colors.textSecondary}
				/>
			</Pressable>
			<ScrollView
				horizontal
				nestedScrollEnabled
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.row}
			>
				{facts.map((fact) => (
					<View key={fact.label} style={styles.card}>
						<Text style={styles.cardLabel}>{fact.label}</Text>
						<Text style={styles.cardValue}>{fact.value}</Text>
					</View>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		gap: spacing.sm,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 15,
		lineHeight: 19,
		color: colors.textPrimary,
	},
	row: {
		gap: spacing.xs,
		paddingRight: spacing.md,
	},
	card: {
		minWidth: 76,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.sm,
		borderRadius: 10,
		borderCurve: "continuous",
		backgroundColor: colors.backgroundMuted,
		gap: 2,
	},
	cardLabel: {
		fontFamily: fonts.regular,
		fontSize: 10,
		lineHeight: 12,
		color: colors.textSecondary,
	},
	cardValue: {
		fontFamily: fonts.bold,
		fontSize: 12,
		lineHeight: 15,
		color: colors.textPrimary,
	},
});
