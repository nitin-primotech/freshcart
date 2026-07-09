import { SymbolView, type SymbolViewProps } from "expo-symbols";
import regular from "expo-symbols/androidWeights/regular";
import semiBold from "expo-symbols/androidWeights/semiBold";
import type { ColorValue, StyleProp, ViewStyle } from "react-native";

import { resolveSymbol } from "@/shared/symbols/icon-registry";

type SymbolWeight = NonNullable<SymbolViewProps["weight"]>;

type AppSymbolProps = {
	name: string;
	size?: number;
	tintColor?: ColorValue;
	weight?: "regular" | "semibold";
	style?: StyleProp<ViewStyle>;
};

const WEIGHTS: Record<"regular" | "semibold", SymbolWeight> = {
	regular: { ios: "regular", android: regular },
	semibold: { ios: "semibold", android: semiBold },
};

export function AppSymbol({
	name,
	size = 22,
	tintColor,
	weight = "regular",
	style,
}: AppSymbolProps) {
	const resolved = resolveSymbol(name);
	if (!resolved) {
		return null;
	}

	return (
		<SymbolView
			name={resolved}
			size={size}
			tintColor={typeof tintColor === "string" ? tintColor : undefined}
			weight={WEIGHTS[weight]}
			style={style}
		/>
	);
}
