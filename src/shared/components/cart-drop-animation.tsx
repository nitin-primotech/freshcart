import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	CART_THUMB_SIZE,
	cartThumbStackWidth,
} from "@/shared/components/cart-thumb-stack";
import {
	clearLastAdded,
	selectLastAdded,
	useCartStore,
} from "@/store/cart.store";
import { colors, shadows } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { floatingCartBottomOffset } from "@/theme/tab-bar";

const DROP_SIZE = 44;

export function CartDropAnimation() {
	const insets = useSafeAreaInsets();
	const { height, width } = useWindowDimensions();
	const lastAdded = useCartStore(selectLastAdded);
	const progress = useSharedValue(0);

	const cartBarCenterY =
		height - floatingCartBottomOffset(insets.bottom) - spacing.sm - 28;
	const stackW = cartThumbStackWidth(3);
	const cartBarTargetX = width / 2 - stackW / 2 + CART_THUMB_SIZE / 2;
	const startY = height * 0.34;
	const startX = width * 0.72;

	useEffect(() => {
		if (!lastAdded?.lineKey) return;

		progress.value = 0;
		progress.value = withTiming(
			1,
			{
				duration: 620,
				easing: Easing.out(Easing.cubic),
			},
			(finished) => {
				if (finished) {
					runOnJS(clearLastAdded)();
				}
			},
		);
	}, [lastAdded?.lineKey, progress]);

	const dropStyle = useAnimatedStyle(() => {
		const t = Math.min(progress.value, 1);
		const x = startX + (cartBarTargetX - startX) * t;
		const y = startY + (cartBarCenterY - startY) * t;

		return {
			position: "absolute",
			left: x - DROP_SIZE / 2,
			top: y - DROP_SIZE / 2,
			width: DROP_SIZE,
			height: DROP_SIZE,
			transform: [{ scale: 1 - t * 0.28 }, { rotate: `${(1 - t) * -16}deg` }],
			opacity: t < 0.9 ? 1 : 1 - (t - 0.9) / 0.1,
		};
	});

	if (!lastAdded) return null;

	return (
		<View style={styles.overlay} pointerEvents="none">
			<Animated.View style={[styles.drop, shadows.card, dropStyle]}>
				<Image
					source={{ uri: lastAdded.image }}
					style={styles.image}
					contentFit="cover"
				/>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFill,
		zIndex: 200,
	},
	drop: {
		borderRadius: radius.full,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: colors.backgroundElevated,
		backgroundColor: colors.backgroundMuted,
		borderCurve: "continuous",
	},
	image: {
		width: "100%",
		height: "100%",
	},
});
