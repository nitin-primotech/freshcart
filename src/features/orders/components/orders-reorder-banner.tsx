import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const BANNER_IMAGES = {
	bag: "https://pngimg.com/uploads/strawberry/strawberry_PNG2630.png",
	produce: "https://pngimg.com/uploads/banana/banana_PNG843.png",
	dairy: "https://pngimg.com/uploads/milk/milk_PNG12716.png",
} as const;

export function OrdersReorderBanner() {
	const router = useRouter();

	return (
		<View style={styles.wrap}>
			<View style={styles.card}>
				<View style={styles.leadCluster}>
					<Image
						source={{ uri: BANNER_IMAGES.produce }}
						style={styles.produceImage}
						contentFit="contain"
					/>
					<Image
						source={{ uri: BANNER_IMAGES.bag }}
						style={styles.bagImage}
						contentFit="contain"
					/>
				</View>

				<View style={styles.copy}>
					<Text style={styles.message}>
						Loved something?{"\n"}Reorder your favorites in a snap
					</Text>
					<Pressable
						style={styles.cta}
						onPress={() => {
							hapticSoftTap();
							router.push("/(tabs)");
						}}
						accessibilityRole="button"
						accessibilityLabel="Shop again"
					>
						<Text style={styles.ctaText}>Shop Again</Text>
					</Pressable>
				</View>

				<View style={styles.trailing}>
					<Image
						source={{ uri: BANNER_IMAGES.dairy }}
						style={styles.dairyImage}
						contentFit="contain"
					/>
					<View style={styles.reorderIcon}>
						<AppSymbol
							name="arrow.clockwise"
							size={13}
							tintColor={colors.textInverse}
							weight="semibold"
						/>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		paddingHorizontal: spacing.md,
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.successLight,
		borderRadius: 16,
		borderCurve: "continuous",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		gap: spacing.sm,
		minHeight: 108,
	},
	leadCluster: {
		width: 58,
		height: 72,
		position: "relative",
	},
	produceImage: {
		position: "absolute",
		left: 0,
		bottom: 0,
		width: 34,
		height: 34,
	},
	bagImage: {
		position: "absolute",
		right: 0,
		top: 0,
		width: 48,
		height: 48,
	},
	copy: {
		flex: 1,
		gap: spacing.sm,
	},
	message: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 16,
		color: colors.textPrimary,
	},
	cta: {
		alignSelf: "flex-start",
		backgroundColor: colors.primary,
		borderRadius: radius.full,
		borderCurve: "continuous",
		paddingHorizontal: spacing.lg,
		paddingVertical: 8,
	},
	ctaText: {
		fontFamily: fonts.semibold,
		fontSize: 11,
		lineHeight: 14,
		color: colors.textInverse,
	},
	trailing: {
		width: 54,
		height: 72,
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	dairyImage: {
		width: 42,
		height: 42,
	},
	reorderIcon: {
		position: "absolute",
		bottom: 2,
		right: 0,
		width: 24,
		height: 24,
		borderRadius: radius.full,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: colors.successLight,
	},
});
