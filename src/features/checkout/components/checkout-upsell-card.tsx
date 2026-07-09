import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { formatInr } from "@/features/checkout/utils/format-currency";
import type { RecommendedDish } from "@/features/home/utils/get-recommended-dishes";
import { PremiumText } from "@/shared/components/premium-text";
import { ProductCardAddAction } from "@/shared/components/product-card-add-action";
import {
	hapticAddToCart,
	hapticPrimaryAction,
	hapticSoftTap,
} from "@/shared/haptics/feedback";
import {
	addToCart,
	selectCartLineQuantity,
	updateCartQuantity,
	useCartStore,
} from "@/store/cart.store";
import { colors, shadows } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";

type CheckoutUpsellCardProps = {
	dish: RecommendedDish;
	width: number;
};

export function CheckoutUpsellCard({ dish, width }: CheckoutUpsellCardProps) {
	const { item, restaurantId, restaurantName } = dish;
	const quantity = useCartStore(selectCartLineQuantity(item.id, restaurantId));

	function handleAdd() {
		hapticPrimaryAction();
		addToCart(item, restaurantId, restaurantName);
	}

	function handleIncrease() {
		hapticAddToCart();
		if (quantity === 0) {
			addToCart(item, restaurantId, restaurantName);
			return;
		}
		updateCartQuantity(item.id, quantity + 1, restaurantId);
	}

	function handleDecrease() {
		hapticSoftTap();
		updateCartQuantity(item.id, quantity - 1, restaurantId);
	}

	return (
		<View style={[styles.card, shadows.soft, { width }]}>
			<Image
				source={{ uri: item.image }}
				style={styles.image}
				contentFit="cover"
				transition={200}
			/>
			<View style={styles.body}>
				<PremiumText
					variant="captionMedium"
					numberOfLines={2}
					style={styles.name}
				>
					{item.name}
				</PremiumText>
				<PremiumText variant="captionMedium" color={colors.textPrimary}>
					{formatInr(item.price)}
				</PremiumText>
				<ProductCardAddAction
					quantity={quantity}
					onAdd={handleAdd}
					onIncrease={handleIncrease}
					onDecrease={handleDecrease}
					itemLabel={item.name}
					variant="solid"
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: radius.lg,
		overflow: "hidden",
		backgroundColor: colors.backgroundElevated,
		borderCurve: "continuous",
	},
	image: {
		width: "100%",
		height: 88,
		backgroundColor: colors.backgroundMuted,
	},
	body: {
		padding: spacing.sm,
		gap: spacing.xs,
	},
	name: {
		minHeight: 36,
	},
});
