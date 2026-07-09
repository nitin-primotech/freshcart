import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatUsd } from "@/features/checkout/utils/format-currency";
import type { RecommendedDish } from "@/features/home/utils/get-recommended-dishes";
import { productDetailPath } from "@/features/product/utils/product-path";
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
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

type PopularProductCardProps = {
	dish: RecommendedDish;
	width: number;
	showDescription?: boolean;
};

export function PopularProductCard({
	dish,
	width,
	showDescription = false,
}: PopularProductCardProps) {
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
		<View style={[styles.card, { width }]}>
			<View style={styles.imageWrap}>
				<Link href={productDetailPath(restaurantId, item.id)} asChild>
					<Pressable style={styles.imagePress} accessibilityRole="link">
						<Image
							source={{ uri: item.image }}
							style={styles.image}
							contentFit="contain"
							transition={200}
						/>
					</Pressable>
				</Link>
			</View>

			<View style={styles.body}>
				<Link href={productDetailPath(restaurantId, item.id)} asChild>
					<Pressable accessibilityRole="link">
						<Text style={styles.name} numberOfLines={2}>
							{item.name}
						</Text>
						{showDescription ? (
							<Text style={styles.unit} numberOfLines={1}>
								{item.description}
							</Text>
						) : null}
						<Text style={styles.price}>{formatUsd(item.price)}</Text>
					</Pressable>
				</Link>

				<View style={styles.actionRow}>
					<ProductCardAddAction
						quantity={quantity}
						onAdd={handleAdd}
						onIncrease={handleIncrease}
						onDecrease={handleDecrease}
						itemLabel={item.name}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		marginRight: spacing.sm,
	},
	imageWrap: {
		height: 96,
		borderRadius: 10,
		borderCurve: "continuous",
		backgroundColor: colors.backgroundElevated,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.xs,
	},
	imagePress: {
		width: "70%",
		height: "70%",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	body: {
		gap: spacing.xs,
	},
	name: {
		fontFamily: fonts.medium,
		fontSize: 11,
		lineHeight: 14,
		color: colors.textPrimary,
	},
	unit: {
		fontFamily: fonts.regular,
		fontSize: 9,
		lineHeight: 11,
		color: colors.textSecondary,
	},
	price: {
		fontFamily: fonts.bold,
		fontSize: 12,
		lineHeight: 14,
		color: colors.textPrimary,
		marginTop: 1,
	},
	actionRow: {
		marginTop: 2,
		width: "100%",
	},
});
