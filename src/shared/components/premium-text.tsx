import { Text, type TextProps } from "react-native";

import { colors, typography } from "@/theme";

type TextVariant = keyof typeof typography;

type PremiumTextProps = TextProps & {
	variant?: TextVariant;
	color?: string;
};

export function PremiumText({
	variant = "body",
	color = colors.textPrimary,
	style,
	...rest
}: PremiumTextProps) {
	return (
		<Text
			selectable
			allowFontScaling
			maxFontSizeMultiplier={1.15}
			style={[typography[variant], { color }, style]}
			{...rest}
		/>
	);
}
