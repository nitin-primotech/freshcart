import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import type { PaymentBrandLogo } from "@/features/checkout/constants/payment-brands";
import { AppSymbol } from "@/shared/components/app-symbol";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

type CheckoutPaymentTrailingLogosProps = {
	logos?: PaymentBrandLogo[];
	showMore?: boolean;
};

export function CheckoutPaymentTrailingLogos({
	logos = [],
	showMore,
}: CheckoutPaymentTrailingLogosProps) {
	return (
		<View style={styles.row}>
			{logos.map((logo) =>
				logo.image ? (
					<Image
						key={logo.id}
						source={logo.image}
						style={styles.logo}
						contentFit="contain"
						accessibilityLabel={logo.name}
					/>
				) : logo.symbol ? (
					<AppSymbol
						key={logo.id}
						name={logo.symbol}
						size={20}
						tintColor={colors.textSecondary}
					/>
				) : null,
			)}
			{showMore ? <Text style={styles.more}>+</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		flexShrink: 0,
		marginLeft: 8,
	},
	logo: {
		height: 22,
		width: 36,
	},
	more: {
		fontFamily: fonts.medium,
		fontSize: 16,
		lineHeight: 20,
		color: colors.textTertiary,
	},
});
