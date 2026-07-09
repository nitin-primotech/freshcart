import { Pressable, StyleSheet, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { PremiumText } from "@/shared/components/premium-text";
import { colors, shadows } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";

type QuantityStepperProps = {
	quantity: number;
	onDecrease: () => void;
	onIncrease: () => void;
	minQuantity?: number;
	compact?: boolean;
	small?: boolean;
};

export function QuantityStepper({
	quantity,
	onDecrease,
	onIncrease,
	minQuantity = 0,
	compact = false,
	small = false,
}: QuantityStepperProps) {
	const btnSize = small ? 22 : compact ? 28 : 32;
	const iconSize = small ? 12 : 16;

	return (
		<View
			style={[
				styles.root,
				compact && styles.rootCompact,
				small && styles.rootSmall,
			]}
		>
			<Pressable
				onPress={onDecrease}
				disabled={quantity <= minQuantity}
				style={[
					styles.btn,
					{ width: btnSize, height: btnSize },
					quantity <= minQuantity && styles.btnDisabled,
				]}
				accessibilityRole="button"
				accessibilityLabel="Decrease quantity"
			>
				<AppSymbol name="minus" size={iconSize} tintColor={colors.primary} />
			</Pressable>
			<PremiumText
				variant="bodyMedium"
				color={colors.primary}
				style={[styles.qty, small && styles.qtySmall]}
			>
				{quantity}
			</PremiumText>
			<Pressable
				onPress={onIncrease}
				style={[styles.btn, { width: btnSize, height: btnSize }]}
				accessibilityRole="button"
				accessibilityLabel="Increase quantity"
			>
				<AppSymbol name="plus" size={iconSize} tintColor={colors.primary} />
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: colors.backgroundElevated,
		borderRadius: radius.md,
		paddingHorizontal: spacing.xs,
		paddingVertical: spacing.xs,
		borderWidth: 1,
		borderColor: colors.border,
		borderCurve: "continuous",
		...shadows.soft,
	},
	rootCompact: {
		gap: spacing.xs,
		paddingHorizontal: spacing.xs,
	},
	rootSmall: {
		gap: 2,
		paddingHorizontal: 2,
		paddingVertical: 2,
	},
	qty: {
		minWidth: 18,
		textAlign: "center",
		color: colors.primary,
	},
	qtySmall: {
		minWidth: 14,
		fontSize: 12,
		lineHeight: 14,
	},
	btn: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: radius.full,
		borderCurve: "continuous",
	},
	btnDisabled: {
		opacity: 0.45,
	},
});
