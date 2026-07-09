import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { ScreenBackButton } from "@/shared/components/screen-back-button";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import {
	openCartSheet,
	selectCartItemCount,
	useCartStore,
} from "@/store/cart.store";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

export function SearchScreenHeader() {
	const router = useRouter();
	const cartCount = useCartStore(selectCartItemCount);
	const cartBadge = cartCount > 99 ? "99+" : String(cartCount);

	return (
		<View style={styles.row}>
			<ScreenBackButton
				onPress={() => {
					hapticSoftTap();
					if (router.canGoBack()) {
						router.back();
						return;
					}
					router.replace("/(tabs)");
				}}
			/>
			<Text style={styles.title}>Search</Text>
			<Pressable
				style={styles.cartBtn}
				onPress={openCartSheet}
				accessibilityRole="button"
				accessibilityLabel={`Cart, ${cartCount} items`}
			>
				<AppSymbol name="cart" size={22} tintColor={colors.textPrimary} />
				{cartCount > 0 ? (
					<View style={styles.cartBadge}>
						<Text style={styles.cartBadgeText}>{cartBadge}</Text>
					</View>
				) : null}
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginBottom: spacing.sm,
	},
	title: {
		flex: 1,
		fontFamily: fonts.bold,
		fontSize: 24,
		lineHeight: 30,
		color: colors.textPrimary,
	},
	cartBtn: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	cartBadge: {
		position: "absolute",
		top: 2,
		right: 0,
		minWidth: 16,
		height: 16,
		borderRadius: radius.full,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 3,
		borderWidth: 1.5,
		borderColor: colors.background,
	},
	cartBadgeText: {
		fontFamily: fonts.bold,
		fontSize: 9,
		lineHeight: 11,
		color: colors.textInverse,
	},
});
