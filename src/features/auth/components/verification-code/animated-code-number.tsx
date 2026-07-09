import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
	Easing,
	FadeIn,
	FadeOut,
	FlipInXDown,
	FlipOutXDown,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

export type OtpDigitStatus = "inProgress" | "correct" | "wrong";

export type AnimatedCodeNumberProps = {
	code?: number;
	highlighted: boolean;
	status: SharedValue<OtpDigitStatus>;
};

export function AnimatedCodeNumber({
	code,
	highlighted,
	status,
}: AnimatedCodeNumberProps) {
	const getColorByStatus = useCallback(
		(vStatus: OtpDigitStatus) => {
			"worklet";
			if (highlighted) return colors.primary;
			if (vStatus === "correct") return colors.success;
			if (vStatus === "wrong") return colors.danger;
			return colors.border;
		},
		[highlighted],
	);

	const rBoxStyle = useAnimatedStyle(() => ({
		borderColor: withTiming(getColorByStatus(status.value)),
		backgroundColor: withTiming(colors.backgroundElevated),
	}));

	return (
		<Animated.View style={[styles.container, rBoxStyle]}>
			{code != null ? (
				<Animated.View
					entering={FadeIn.duration(250)}
					exiting={FadeOut.duration(250)}
				>
					<Animated.Text
						entering={FlipInXDown.duration(500)
							.easing(Easing.bezier(0, 0.75, 0.5, 0.9))
							.build()}
						exiting={FlipOutXDown.duration(500)
							.easing(Easing.bezier(0.6, 0.1, 0.4, 0.8))
							.build()}
						style={styles.text}
					>
						{code}
					</Animated.Text>
				</Animated.View>
			) : (
				<View style={styles.placeholderDash} />
			)}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		borderCurve: "continuous",
		borderRadius: 12,
		borderWidth: 1.5,
		height: 52,
		width: "100%",
		maxWidth: 48,
	},
	text: {
		fontFamily: fonts.bold,
		fontSize: 22,
		lineHeight: 26,
		color: colors.textPrimary,
	},
	placeholderDash: {
		width: 14,
		height: 2,
		borderRadius: 1,
		backgroundColor: colors.borderStrong,
	},
});
