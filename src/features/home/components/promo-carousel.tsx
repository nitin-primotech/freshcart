import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import {
	FlatList,
	Pressable,
	StyleSheet,
	useWindowDimensions,
	View,
} from "react-native";

import type { Promo } from "@/features/catalog/types/catalog.types";
import { PremiumText } from "@/shared/components/premium-text";
import { colors, shadows } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";

type PromoCarouselProps = {
	promos: Promo[];
};

export function PromoCarousel({ promos }: PromoCarouselProps) {
	const listRef = useRef<FlatList<Promo>>(null);
	const { width } = useWindowDimensions();
	const cardWidth = width - spacing.lg * 2;

	return (
		<FlatList
			ref={listRef}
			data={promos}
			horizontal
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			snapToInterval={cardWidth + spacing.md}
			decelerationRate="fast"
			contentContainerStyle={styles.list}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<Pressable style={[styles.card, shadows.card, { width: cardWidth }]}>
					<Image source={{ uri: item.image }} style={styles.image} />
					<LinearGradient
						colors={["transparent", "rgba(0,0,0,0.75)"]}
						style={styles.gradient}
					/>
					<View style={styles.content}>
						<PremiumText variant="h3" color={colors.textInverse}>
							{item.title}
						</PremiumText>
						<PremiumText variant="caption" color={colors.textInverse}>
							{item.subtitle}
						</PremiumText>
						<View style={styles.code}>
							<PremiumText variant="label" color={colors.primary}>
								{item.code}
							</PremiumText>
						</View>
					</View>
				</Pressable>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	list: {
		paddingHorizontal: spacing.lg,
		gap: spacing.md,
	},
	card: {
		height: 168,
		borderRadius: radius.lg,
		overflow: "hidden",
		borderCurve: "continuous",
	},
	image: {
		...StyleSheet.absoluteFill,
	},
	gradient: {
		...StyleSheet.absoluteFill,
	},
	content: {
		flex: 1,
		justifyContent: "flex-end",
		padding: spacing.lg,
		gap: spacing.xxs,
	},
	code: {
		alignSelf: "flex-start",
		marginTop: spacing.xs,
		backgroundColor: colors.backgroundElevated,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xxs,
		borderRadius: radius.full,
	},
});
