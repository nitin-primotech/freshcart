import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatUsd } from "@/features/checkout/utils/format-currency";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

export type WeightOption = {
	id: string;
	label: string;
	price: number;
};

type ProductWeightSelectorProps = {
	options: WeightOption[];
	selectedId: string;
	onSelect: (id: string) => void;
};

export function ProductWeightSelector({
	options,
	selectedId,
	onSelect,
}: ProductWeightSelectorProps) {
	return (
		<View style={styles.wrap}>
			<View style={styles.header}>
				<Text style={styles.title}>Select Weight</Text>
				<Pressable accessibilityRole="button">
					<Text style={styles.link}>How much do I need?</Text>
				</Pressable>
			</View>
			<View style={styles.row}>
				{options.map((option) => {
					const selected = option.id === selectedId;
					return (
						<Pressable
							key={option.id}
							style={[styles.option, selected && styles.optionSelected]}
							onPress={() => onSelect(option.id)}
							accessibilityRole="radio"
							accessibilityState={{ selected }}
						>
							<Text
								style={[
									styles.optionLabel,
									selected && styles.optionLabelSelected,
								]}
							>
								{option.label}
							</Text>
							<Text
								style={[
									styles.optionPrice,
									selected && styles.optionPriceSelected,
								]}
							>
								{formatUsd(option.price)}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		gap: spacing.sm,
		marginTop: spacing.sm,
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
	link: {
		fontFamily: fonts.medium,
		fontSize: 12,
		lineHeight: 15,
		color: colors.primary,
	},
	row: {
		flexDirection: "row",
		gap: spacing.xs,
	},
	option: {
		flex: 1,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.xs,
		borderRadius: 10,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.background,
		alignItems: "center",
		gap: 2,
		minWidth: 0,
	},
	optionSelected: {
		borderColor: colors.primary,
		backgroundColor: colors.successLight,
	},
	optionLabel: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 15,
		color: colors.textPrimary,
	},
	optionLabelSelected: {
		color: colors.primary,
	},
	optionPrice: {
		fontFamily: fonts.regular,
		fontSize: 10,
		lineHeight: 12,
		color: colors.textSecondary,
	},
	optionPriceSelected: {
		color: colors.primaryDark,
	},
});
