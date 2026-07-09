import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppSymbol } from "@/shared/components/app-symbol";
import {
	clearLastWishlistSaved,
	selectLastWishlistSaved,
	useWishlistStore,
} from "@/store/wishlist.store";
import { colors, shadows } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const VISIBLE_MS = 1800;

export function WishlistSavedToast() {
	const insets = useSafeAreaInsets();
	const lastSaved = useWishlistStore(selectLastWishlistSaved);
	const progress = useSharedValue(0);

	useEffect(() => {
		if (!lastSaved?.key) return;

		progress.value = 0;
		progress.value = withSequence(
			withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) }),
			withTiming(1, { duration: VISIBLE_MS }),
			withTiming(
				0,
				{ duration: 280, easing: Easing.in(Easing.cubic) },
				(done) => {
					if (done) {
						runOnJS(clearLastWishlistSaved)();
					}
				},
			),
		);
	}, [lastSaved?.key, progress]);

	const toastStyle = useAnimatedStyle(() => ({
		opacity: progress.value,
		transform: [
			{ translateY: (1 - progress.value) * -18 },
			{ scale: 0.94 + progress.value * 0.06 },
		],
	}));

	if (!lastSaved) return null;

	return (
		<View style={styles.host} pointerEvents="none">
			<Animated.View
				style={[
					styles.toast,
					shadows.card,
					toastStyle,
					{ marginTop: insets.top + spacing.sm },
				]}
			>
				<View style={styles.thumbWrap}>
					<Image
						source={{ uri: lastSaved.image }}
						style={styles.thumb}
						contentFit="cover"
					/>
					<View style={styles.thumbHeart}>
						<AppSymbol name="heart.fill" size={10} tintColor={colors.primary} />
					</View>
				</View>
				<View style={styles.copy}>
					<Text style={styles.title}>Saved to wishlist</Text>
					<Text style={styles.name} numberOfLines={1}>
						{lastSaved.name}
					</Text>
				</View>
				<View style={styles.badge}>
					<AppSymbol
						name="heart.fill"
						size={14}
						tintColor={colors.textInverse}
					/>
				</View>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	host: {
		...StyleSheet.absoluteFill,
		zIndex: 220,
		alignItems: "center",
	},
	toast: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		maxWidth: "92%",
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.sm,
		paddingRight: spacing.md,
		borderRadius: 16,
		borderCurve: "continuous",
		backgroundColor: colors.backgroundElevated,
		borderWidth: 1,
		borderColor: "rgba(212, 84, 60, 0.22)",
	},
	thumbWrap: {
		width: 44,
		height: 44,
		borderRadius: 12,
		borderCurve: "continuous",
		overflow: "hidden",
		backgroundColor: colors.backgroundMuted,
	},
	thumb: {
		width: "100%",
		height: "100%",
	},
	thumbHeart: {
		position: "absolute",
		right: 4,
		bottom: 4,
		width: 18,
		height: 18,
		borderRadius: 9,
		backgroundColor: colors.backgroundElevated,
		alignItems: "center",
		justifyContent: "center",
	},
	copy: {
		flex: 1,
		minWidth: 0,
		gap: 2,
	},
	title: {
		fontFamily: fonts.semibold,
		fontSize: 13,
		lineHeight: 17,
		color: colors.primary,
	},
	name: {
		fontFamily: fonts.medium,
		fontSize: 12,
		lineHeight: 16,
		color: colors.textPrimary,
	},
	badge: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
});
