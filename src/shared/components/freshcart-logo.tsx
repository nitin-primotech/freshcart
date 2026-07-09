import type { ImageSource } from "expo-image";
import { Image } from "expo-image";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import { FRESHCART_LOGO } from "@/constants/brand-assets";

const LOGO_ASPECT_RATIO = 883 / 282;

type FreshCartLogoProps = {
	height?: number;
	width?: number;
	style?: StyleProp<ViewStyle>;
	accessibilityLabel?: string;
};

export function FreshCartLogo({
	height = 40,
	width,
	style,
	accessibilityLabel = "FreshCart",
}: FreshCartLogoProps) {
	const logoWidth = width ?? Math.round(height * LOGO_ASPECT_RATIO);

	return (
		<View
			style={[styles.wrap, { width: logoWidth, height }, style]}
			accessibilityRole="image"
			accessibilityLabel={accessibilityLabel}
		>
			<Image
				source={FRESHCART_LOGO as ImageSource}
				style={{ width: logoWidth, height }}
				contentFit="contain"
				cachePolicy="memory-disk"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		zIndex: 2,
		elevation: 2,
	},
});
