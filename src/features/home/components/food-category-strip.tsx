import { Image } from "expo-image";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import {
	Pressable,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";

import type { Category } from "@/features/catalog/types/catalog.types";
import { HomeSectionHeader } from "@/features/home/components/home-section-header";
import { resolveCategoryImageUri } from "@/lib/firebase/category-images";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const VISIBLE_COUNT = 6;
const TILE_SIZE = 52;

type FoodCategoryStripProps = {
	categories: Category[];
	moreHref?: Href;
};

export function FoodCategoryStrip({
	categories,
	moreHref,
}: FoodCategoryStripProps) {
	const router = useRouter();
	const { width } = useWindowDimensions();
	const contentWidth = width - spacing.md * 2;
	const itemWidth = contentWidth / VISIBLE_COUNT;
	const visible = categories.slice(0, VISIBLE_COUNT);

	return (
		<View style={styles.wrap}>
			<HomeSectionHeader title="Shop by Category" href={moreHref} />
			<View style={styles.grid}>
				{visible.map((cat) => {
					const imageUri = resolveCategoryImageUri(cat.image);
					if (!imageUri) return null;

					return (
						<Pressable
							key={cat.id}
							style={[styles.item, { width: itemWidth }]}
							onPress={() => router.push(`/category/${cat.id}`)}
							accessibilityRole="button"
							accessibilityLabel={`Browse ${cat.name}`}
						>
							<View style={styles.tile}>
								<Image
									source={{ uri: imageUri }}
									style={styles.image}
									contentFit="contain"
									transition={200}
								/>
							</View>
							<Text style={styles.label} numberOfLines={2}>
								{cat.name}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		marginTop: spacing.md,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		paddingHorizontal: spacing.md,
	},
	item: {
		alignItems: "center",
		gap: 4,
		marginBottom: spacing.xs,
	},
	tile: {
		width: TILE_SIZE,
		height: TILE_SIZE,
		borderRadius: TILE_SIZE / 2,
		borderCurve: "continuous",
		backgroundColor: "#F3F4F6",
		alignItems: "center",
		justifyContent: "center",
		padding: 4,
		overflow: "hidden",
	},
	image: {
		width: 40,
		height: 40,
	},
	label: {
		fontFamily: fonts.medium,
		fontSize: 9,
		lineHeight: 11,
		color: colors.textPrimary,
		textAlign: "center",
	},
});
