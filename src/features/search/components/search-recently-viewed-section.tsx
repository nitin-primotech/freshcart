import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { HomeSectionHeader } from "@/features/home/components/home-section-header";
import type { RecommendedDish } from "@/features/home/utils/get-recommended-dishes";
import { productDetailPath } from "@/features/product/utils/product-path";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";

type SearchRecentlyViewedSectionProps = {
	dishes: RecommendedDish[];
};

export function SearchRecentlyViewedSection({
	dishes,
}: SearchRecentlyViewedSectionProps) {
	if (dishes.length === 0) {
		return null;
	}

	return (
		<View style={styles.wrap}>
			<HomeSectionHeader title="Recently Viewed" />
			<ScrollView
				horizontal
				nestedScrollEnabled
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.row}
			>
				{dishes.map((dish) => (
					<Link
						key={`${dish.restaurantId}-${dish.item.id}`}
						href={productDetailPath(dish.restaurantId, dish.item.id)}
						asChild
					>
						<Pressable
							style={styles.thumb}
							accessibilityRole="link"
							accessibilityLabel={dish.item.name}
						>
							<Image
								source={{ uri: dish.item.image }}
								style={styles.image}
								contentFit="cover"
								transition={200}
							/>
						</Pressable>
					</Link>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		marginTop: spacing.md,
	},
	row: {
		paddingHorizontal: spacing.md,
		gap: spacing.sm,
	},
	thumb: {
		width: 72,
		height: 72,
		borderRadius: radius.md,
		borderCurve: "continuous",
		overflow: "hidden",
		backgroundColor: colors.backgroundMuted,
		borderWidth: 1,
		borderColor: colors.border,
	},
	image: {
		width: "100%",
		height: "100%",
	},
});
