import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const FOOTER_CONTROL_HEIGHT = 48;

type ProductFooterStepperProps = {
	quantity: number;
	onDecrease: () => void;
	onIncrease: () => void;
};

export function ProductFooterStepper({
	quantity,
	onDecrease,
	onIncrease,
}: ProductFooterStepperProps) {
	const decreaseIcon = quantity <= 1 ? "trash" : "minus";

	return (
		<View style={styles.root}>
			<Pressable
				onPress={onDecrease}
				style={styles.edgeBtn}
				hitSlop={4}
				accessibilityRole="button"
				accessibilityLabel={
					quantity <= 1 ? "Remove from cart" : "Decrease quantity"
				}
			>
				<AppSymbol
					name={decreaseIcon}
					size={15}
					tintColor={colors.textSecondary}
					weight="regular"
				/>
			</Pressable>

			<Text style={styles.qty}>{quantity}</Text>

			<Pressable
				onPress={onIncrease}
				style={styles.edgeBtn}
				hitSlop={4}
				accessibilityRole="button"
				accessibilityLabel="Increase quantity"
			>
				<AppSymbol
					name="plus"
					size={15}
					tintColor={colors.textPrimary}
					weight="regular"
				/>
			</Pressable>
		</View>
	);
}

export const productFooterControlHeight = FOOTER_CONTROL_HEIGHT;

const styles = StyleSheet.create({
	root: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 12,
		borderCurve: "continuous",
		height: FOOTER_CONTROL_HEIGHT,
		width: 112,
		paddingHorizontal: spacing.sm,
		flexShrink: 0,
	},
	edgeBtn: {
		width: 28,
		height: 28,
		alignItems: "center",
		justifyContent: "center",
	},
	qty: {
		fontFamily: fonts.bold,
		fontSize: 15,
		lineHeight: 18,
		color: colors.textPrimary,
		textAlign: "center",
		minWidth: 20,
	},
});
