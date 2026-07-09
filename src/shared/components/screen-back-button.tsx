import { Pressable, StyleSheet } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/spacing";

export const SCREEN_BACK_BUTTON_SIZE = 44;
const ICON_SIZE = 26;

type ScreenBackButtonProps = {
	onPress: () => void;
	tintColor?: string;
	backgroundColor?: string;
};

export function ScreenBackButton({
	onPress,
	tintColor = colors.textPrimary,
	backgroundColor = colors.backgroundMuted,
}: ScreenBackButtonProps) {
	return (
		<Pressable
			onPress={onPress}
			hitSlop={16}
			style={[styles.button, { backgroundColor }]}
			accessibilityRole="button"
			accessibilityLabel="Go back"
		>
			<AppSymbol name="chevron.left" size={ICON_SIZE} tintColor={tintColor} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		width: SCREEN_BACK_BUTTON_SIZE,
		height: SCREEN_BACK_BUTTON_SIZE,
		borderRadius: radius.full,
		alignItems: "center",
		justifyContent: "center",
		borderCurve: "continuous",
	},
});
