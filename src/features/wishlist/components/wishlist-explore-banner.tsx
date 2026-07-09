import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

type WishlistExploreBannerProps = {
	onExplore: () => void;
};

export function WishlistExploreBanner({
	onExplore,
}: WishlistExploreBannerProps) {
	return (
		<View style={styles.banner}>
			<View style={styles.illustration}>
				<AppSymbol name="heart" size={28} tintColor="rgba(212, 84, 60, 0.35)" />
			</View>
			<View style={styles.copy}>
				<Text style={styles.title}>Looking for something?</Text>
				<Text style={styles.message}>
					Explore dishes and tap the heart to build your wishlist.
				</Text>
			</View>
			<Pressable
				onPress={() => {
					hapticSoftTap();
					onExplore();
				}}
				style={styles.exploreBtn}
				accessibilityRole="button"
				accessibilityLabel="Explore restaurants"
			>
				<Text style={styles.exploreText}>Explore</Text>
				<AppSymbol
					name="chevron.right"
					size={12}
					tintColor={colors.textInverse}
				/>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	banner: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginHorizontal: spacing.md,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		borderRadius: 16,
		borderCurve: "continuous",
		backgroundColor: "rgba(212, 84, 60, 0.08)",
		borderWidth: 1,
		borderColor: "rgba(212, 84, 60, 0.12)",
	},
	illustration: {
		width: 44,
		height: 44,
		alignItems: "center",
		justifyContent: "center",
	},
	copy: {
		flex: 1,
		gap: 3,
		minWidth: 0,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 13,
		lineHeight: 17,
		color: colors.textPrimary,
	},
	message: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 15,
		color: colors.textSecondary,
	},
	exploreBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		backgroundColor: colors.primary,
		paddingHorizontal: spacing.sm,
		paddingVertical: 9,
		borderRadius: 20,
		borderCurve: "continuous",
	},
	exploreText: {
		fontFamily: fonts.semibold,
		fontSize: 11,
		lineHeight: 14,
		color: colors.textInverse,
	},
});
