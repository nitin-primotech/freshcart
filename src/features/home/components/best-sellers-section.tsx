import type { Href } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { BestSellerCard } from "@/features/home/components/best-seller-card";
import { HomeSectionHeader } from "@/features/home/components/home-section-header";
import type { RecommendedDish } from "@/features/home/utils/get-recommended-dishes";
import { useCarouselItemWidth } from "@/shared/hooks/use-carousel-item-width";
import { spacing } from "@/theme/spacing";

type BestSellersSectionProps = {
	dishes: RecommendedDish[];
	viewAllHref?: Href;
};

export function BestSellersSection({
	dishes,
	viewAllHref,
}: BestSellersSectionProps) {
	const cardWidth = useCarouselItemWidth({
		visibleCount: 2.35,
		peek: 0.05,
		gap: spacing.md,
		paddingEnd: spacing.md,
	});

	if (dishes.length === 0) return null;

	return (
		<View style={styles.wrap}>
			<HomeSectionHeader title="Best Sellers" href={viewAllHref} />
			<ScrollView
				horizontal
				nestedScrollEnabled
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.row}
			>
				{dishes.map((dish) => (
					<BestSellerCard key={dish.item.id} dish={dish} width={cardWidth} />
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		marginTop: spacing.lg,
	},
	row: {
		paddingLeft: spacing.md,
		paddingRight: spacing.xs,
	},
});
