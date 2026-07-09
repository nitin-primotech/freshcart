import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
	deriveMrp,
	formatInr,
} from "@/features/checkout/utils/format-currency";
import type { RecommendedDish } from "@/features/home/utils/get-recommended-dishes";
import { productDetailPath } from "@/features/product/utils/product-path";
import { isHttpImageUrl } from "@/lib/firebase/category-images";
import { ProductCardAddAction } from "@/shared/components/product-card-add-action";
import { WishlistToggle } from "@/shared/components/wishlist-toggle";
import { hapticAddToCart, hapticSoftTap } from "@/shared/haptics/feedback";
import {
	addToCart,
	selectCartLineQuantity,
	updateCartQuantity,
	useCartStore,
} from "@/store/cart.store";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

type TopPicksProductCardProps = {
	dish: RecommendedDish;
	width: number;
	flush?: boolean;
};

function formatPrice(price: number): string {
	return formatInr(price);
}

function formatWeight(calories?: number): string {
	if (calories) return `${calories} cal`;
	return "1 serving";
}

export function TopPicksProductCard({
	dish,
	width,
	flush = false,
}: TopPicksProductCardProps) {
	const { item, restaurantId, restaurantName, rating } = dish;
	const quantity = useCartStore(selectCartLineQuantity(item.id, restaurantId));
	const originalPrice = deriveMrp(item.price);
	const imageUri = isHttpImageUrl(item.image) ? item.image : undefined;

	function handleAdd() {
		hapticAddToCart();
		addToCart(item, restaurantId, restaurantName);
	}

	function handleIncrease() {
		hapticSoftTap();
		if (quantity === 0) {
			addToCart(item, restaurantId, restaurantName);
			return;
		}
		updateCartQuantity(item.id, quantity + 1);
	}

	function handleDecrease() {
		hapticSoftTap();
		updateCartQuantity(item.id, quantity - 1);
	}

	return (
		<View style={[styles.card, flush && styles.cardFlush, { width }]}>
			<View style={styles.imageWrap}>
				<Link href={productDetailPath(restaurantId, item.id)} asChild>
					<Pressable style={styles.imagePressable} accessibilityRole="link">
						{imageUri ? (
							<Image
								source={{ uri: imageUri }}
								style={styles.image}
								contentFit="cover"
								transition={200}
							/>
						) : (
							<View style={styles.imageFallback} />
						)}
					</Pressable>
				</Link>
				<WishlistToggle
					item={item}
					restaurantId={restaurantId}
					restaurantName={restaurantName}
					rating={rating}
					variant="overlay"
					style={styles.heart}
					accessibilityLabel={`Save ${item.name} to wishlist`}
				/>
			</View>

			<View style={styles.body}>
				<Link href={productDetailPath(restaurantId, item.id)} asChild>
					<Pressable accessibilityRole="link">
						<Text style={styles.name} numberOfLines={1}>
							{item.name}
						</Text>
						<Text style={styles.weight}>{formatWeight(item.calories)}</Text>

						<View style={styles.priceRow}>
							<Text style={styles.price}>{formatPrice(item.price)}</Text>
							<Text style={styles.originalPrice}>
								{formatPrice(originalPrice)}
							</Text>
						</View>
					</Pressable>
				</Link>

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

const IMAGE_HEIGHT = 112;
const CARD_RADIUS = 14;

const styles = StyleSheet.create({
	card: {
		marginRight: spacing.md,
		backgroundColor: colors.backgroundElevated,
		borderRadius: CARD_RADIUS,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		overflow: "hidden",
	},
	cardFlush: {
		marginRight: 0,
	},
	imageWrap: {
		width: "100%",
		height: IMAGE_HEIGHT,
		backgroundColor: colors.backgroundMuted,
	},
	imagePressable: {
		width: "100%",
		height: "100%",
	},
	heart: {
		position: "absolute",
		top: spacing.xs,
		right: spacing.xs,
		zIndex: 2,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	imageFallback: {
		width: "100%",
		height: "100%",
		backgroundColor: colors.backgroundMuted,
	},
	body: {
		paddingHorizontal: spacing.sm,
		paddingTop: spacing.sm,
		paddingBottom: spacing.sm,
		gap: 2,
	},
	name: {
		fontFamily: fonts.semibold,
		fontSize: 13,
		lineHeight: 17,
		color: colors.textPrimary,
	},
	weight: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 14,
		color: colors.textSecondary,
		marginBottom: spacing.xxs,
	},
	priceRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		marginBottom: spacing.sm,
	},
	price: {
		fontFamily: fonts.bold,
		fontSize: 14,
		lineHeight: 18,
		color: colors.textPrimary,
	},
	originalPrice: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 14,
		color: colors.textTertiary,
		textDecorationLine: "line-through",
	},
});
