import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { Easing, Keyframe } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const DURATION = 600;

function useSplashKeyframe(scaleFactor: number) {
	return useMemo(
		() =>
			new Keyframe({
				0: {
					transform: [{ scale: scaleFactor }],
					opacity: 1,
				},
				20: {
					opacity: 1,
				},
				70: {
					opacity: 0,
					easing: Easing.elastic(0.7),
				},
				100: {
					opacity: 0,
					transform: [{ scale: 1 }],
					easing: Easing.elastic(0.7),
				},
			}),
		[scaleFactor],
	);
}

function useIconKeyframes(scaleFactor: number) {
	return useMemo(
		() => ({
			background: new Keyframe({
				0: {
					transform: [{ scale: scaleFactor }],
				},
				100: {
					transform: [{ scale: 1 }],
					easing: Easing.elastic(0.7),
				},
			}),
			logo: new Keyframe({
				0: {
					transform: [{ scale: 1.3 }],
					opacity: 0,
				},
				40: {
					transform: [{ scale: 1.3 }],
					opacity: 0,
					easing: Easing.elastic(0.7),
				},
				100: {
					opacity: 1,
					transform: [{ scale: 1 }],
					easing: Easing.elastic(0.7),
				},
			}),
			glow: new Keyframe({
				0: {
					transform: [{ rotateZ: "0deg" }],
				},
				100: {
					transform: [{ rotateZ: "7200deg" }],
				},
			}),
		}),
		[scaleFactor],
	);
}

export function AnimatedSplashOverlay() {
	const { height } = useWindowDimensions();
	const scaleFactor = height / 90;
	const splashKeyframe = useSplashKeyframe(scaleFactor);
	const [visible, setVisible] = useState(true);

	if (!visible) return null;

	return (
		<Animated.View
			entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
				"worklet";
				if (finished) {
					scheduleOnRN(setVisible, false);
				}
			})}
			style={styles.backgroundSolidColor}
		/>
	);
}

export function AnimatedIcon() {
	const { height } = useWindowDimensions();
	const scaleFactor = height / 90;
	const keyframes = useIconKeyframes(scaleFactor);

	return (
		<View style={styles.iconContainer}>
			<Animated.View
				entering={keyframes.glow.duration(60 * 1000 * 4)}
				style={styles.glow}
			>
				<Image
					style={styles.glow}
					source={require("@/assets/images/logo-glow.png")}
				/>
			</Animated.View>

			<Animated.View
				entering={keyframes.background.duration(DURATION)}
				style={styles.background}
			/>
			<Animated.View
				style={styles.imageContainer}
				entering={keyframes.logo.duration(DURATION)}
			>
				<Image
					style={styles.image}
					source={require("@/assets/images/expo-logo.png")}
				/>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	imageContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	glow: {
		width: 201,
		height: 201,
		position: "absolute",
	},
	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
		width: 128,
		height: 128,
		zIndex: 100,
	},
	image: {
		position: "absolute",
		width: 76,
		height: 71,
	},
	background: {
		borderRadius: 40,
		experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`,
		width: 128,
		height: 128,
		position: "absolute",
	},
	backgroundSolidColor: {
		...StyleSheet.absoluteFill,
		backgroundColor: "#208AEF",
		zIndex: 1000,
	},
});
