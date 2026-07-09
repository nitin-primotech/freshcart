import {
	DMSans_400Regular,
	DMSans_500Medium,
	DMSans_600SemiBold,
	DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
	PlayfairDisplay_600SemiBold,
	PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export const fontAssets = {
	DMSans_400Regular,
	DMSans_500Medium,
	DMSans_600SemiBold,
	DMSans_700Bold,
	PlayfairDisplay_600SemiBold,
	PlayfairDisplay_700Bold,
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
} as const;

export const fonts = {
	regular: "DMSans_400Regular",
	medium: "DMSans_500Medium",
	semibold: "DMSans_600SemiBold",
	bold: "DMSans_700Bold",
	display: "PlayfairDisplay_700Bold",
	displaySemi: "PlayfairDisplay_600SemiBold",
	poppinsRegular: "Poppins_400Regular",
	poppinsMedium: "Poppins_500Medium",
	poppinsSemibold: "Poppins_600SemiBold",
	poppinsBold: "Poppins_700Bold",
} as const;

type FontStyle = {
	fontFamily: string;
	fontSize: number;
	lineHeight: number;
	letterSpacing?: number;
};

function style(
	fontFamily: string,
	fontSize: number,
	lineHeight: number,
	letterSpacing?: number,
): FontStyle {
	return { fontFamily, fontSize, lineHeight, letterSpacing };
}

export const typography = {
	display: style(fonts.display, 34, 42, -0.6),
	h1: style(fonts.displaySemi, 28, 36, -0.4),
	h2: style(fonts.bold, 24, 32, -0.2),
	h3: style(fonts.semibold, 20, 28, -0.1),
	body: style(fonts.regular, 17, 26),
	bodyMedium: style(fonts.medium, 17, 26),
	bodySmall: style(fonts.regular, 15, 22),
	caption: style(fonts.regular, 14, 20),
	captionMedium: style(fonts.medium, 14, 20),
	label: style(fonts.bold, 13, 18, 1.1),
	overline: style(fonts.bold, 11, 14, 1.4),
	price: style(fonts.bold, 20, 26),
	sectionTitle: style(fonts.displaySemi, 22, 30, -0.2),
} as const;
