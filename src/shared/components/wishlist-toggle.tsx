import { Pressable, StyleSheet, type ViewStyle } from "react-native";

import type { MenuItem } from "@/features/catalog/types/catalog.types";
import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap, hapticWishlistSave } from "@/shared/haptics/feedback";
import {
	selectIsWishlistedProduct,
	toggleWishlistProduct,
	useWishlistStore,
} from "@/store/wishlist.store";
import { colors } from "@/theme/colors";

type WishlistToggleProps = {
	item: MenuItem;
	restaurantId: string;
	restaurantName: string;
	rating: number;
	size?: number;
	style?: ViewStyle;
	variant?: "overlay" | "inline";
	accessibilityLabel?: string;
};

export function WishlistToggle({
	item,
	restaurantId,
	restaurantName,
	rating,
	size,
	style,
	variant = "inline",
	accessibilityLabel = "Toggle wishlist",
}: WishlistToggleProps) {
	const isOverlay = variant === "overlay";
	const iconSize = size ?? (isOverlay ? 18 : 17);

	const isSaved = useWishlistStore(
		selectIsWishlistedProduct(restaurantId, item.id),
	);

	function handlePress() {
		const added = toggleWishlistProduct(
			item,
			restaurantId,
			restaurantName,
			rating,
		);
		if (added) {
			hapticWishlistSave();
			return;
		}
		hapticSoftTap();
	}

	return (
		<Pressable
			onPress={handlePress}
			hitSlop={isOverlay ? 14 : 10}
			style={[isOverlay ? styles.overlay : styles.inline, style]}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			accessibilityState={{ selected: isSaved }}
		>
			<AppSymbol
				name={isSaved ? "heart.fill" : "heart"}
				size={iconSize}
				tintColor={
					isSaved
						? colors.primary
						: isOverlay
							? colors.textInverse
							: colors.textPrimary
				}
			/>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	overlay: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "rgba(0, 0, 0, 0.42)",
		alignItems: "center",
		justifyContent: "center",
	},
	inline: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
});
