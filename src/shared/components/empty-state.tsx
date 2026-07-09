import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AppSymbol } from "@/shared/components/app-symbol";
import { PremiumText } from "@/shared/components/premium-text";
import { hapticSecondaryAction } from "@/shared/haptics/feedback";
import { colors, shadows } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";

type EmptyStateProps = {
	title: string;
	message: string;
	actionLabel?: string;
	onAction?: () => void;
	icon?: string;
};

export function EmptyState({
	title,
	message,
	actionLabel,
	onAction,
	icon = "tray",
}: EmptyStateProps) {
	return (
		<Animated.View entering={FadeIn.duration(400)} style={styles.container}>
			<View style={[styles.iconWrap, shadows.soft]}>
				<AppSymbol name={icon} size={32} tintColor={colors.primary} />
			</View>
			<PremiumText variant="h3" style={styles.title}>
				{title}
			</PremiumText>
			<PremiumText
				variant="body"
				color={colors.textSecondary}
				style={styles.message}
			>
				{message}
			</PremiumText>
			{actionLabel && onAction ? (
				<Pressable
					onPress={() => {
						hapticSecondaryAction();
						onAction();
					}}
					style={styles.button}
				>
					<PremiumText variant="bodyMedium" color={colors.textInverse}>
						{actionLabel}
					</PremiumText>
				</Pressable>
			) : null}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		paddingHorizontal: spacing.xxl,
		paddingVertical: spacing.xxxl,
		gap: spacing.sm,
	},
	iconWrap: {
		width: 72,
		height: 72,
		borderRadius: radius.full,
		backgroundColor: colors.backgroundElevated,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.sm,
	},
	title: {
		textAlign: "center",
	},
	message: {
		textAlign: "center",
	},
	button: {
		marginTop: spacing.md,
		backgroundColor: colors.primary,
		paddingHorizontal: spacing.xl,
		paddingVertical: spacing.sm,
		borderRadius: radius.xl,
		borderCurve: "continuous",
		overflow: "hidden",
	},
});
