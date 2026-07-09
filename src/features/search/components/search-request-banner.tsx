import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

export function SearchRequestBanner() {
	return (
		<View style={styles.card}>
			<Image
				source={require("@/assets/images/home-hero-basket.png")}
				style={styles.image}
				contentFit="contain"
				transition={200}
			/>
			<View style={styles.copy}>
				<Text style={styles.title}>Can&apos;t find what you need?</Text>
				<Text style={styles.subtitle}>
					We&apos;ll help you find it in our store.
				</Text>
				<Pressable
					style={styles.linkRow}
					accessibilityRole="button"
					accessibilityLabel="Request a product"
				>
					<Text style={styles.link}>Request a Product</Text>
					<AppSymbol
						name="arrow.right"
						size={12}
						tintColor={colors.primary}
						weight="semibold"
					/>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E8F5E9",
		borderRadius: radius.lg,
		borderCurve: "continuous",
		padding: spacing.sm,
		gap: spacing.sm,
		overflow: "hidden",
	},
	image: {
		width: 72,
		height: 72,
		flexShrink: 0,
	},
	copy: {
		flex: 1,
		minWidth: 0,
		gap: 3,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 13,
		lineHeight: 17,
		color: colors.textPrimary,
	},
	subtitle: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 14,
		color: colors.textSecondary,
	},
	linkRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginTop: spacing.xxs,
	},
	link: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 15,
		color: colors.primary,
	},
});
