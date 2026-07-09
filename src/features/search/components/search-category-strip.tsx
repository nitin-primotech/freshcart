import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { Category } from "@/features/catalog/types/catalog.types";
import { resolveCategoryImageUri } from "@/lib/firebase/category-images";
import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const TILE_SIZE = 64;

type SearchCategoryStripProps = {
	categories: Category[];
	activeCategoryId?: string | null;
	onSelect: (category: Category | null) => void;
};

export function SearchCategoryStrip({
	categories,
	activeCategoryId,
	onSelect,
}: SearchCategoryStripProps) {
	const allActive = activeCategoryId == null;

	return (
		<ScrollView
			horizontal
			nestedScrollEnabled
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.row}
		>
			<Pressable
				style={styles.item}
				onPress={() => {
					hapticSoftTap();
					onSelect(null);
				}}
				accessibilityRole="button"
				accessibilityLabel="All categories"
			>
				<View style={[styles.tile, allActive && styles.tileActive]}>
					<AppSymbol name="fork.knife" size={22} tintColor={colors.primary} />
				</View>
				<Text style={[styles.label, allActive && styles.labelActive]}>All</Text>
			</Pressable>

			{categories.map((category) => {
				const active = activeCategoryId === category.id;
				return (
					<Pressable
						key={category.id}
						style={styles.item}
						onPress={() => {
							hapticSoftTap();
							onSelect(category);
						}}
						accessibilityRole="button"
						accessibilityLabel={`Search ${category.name}`}
					>
						<View style={[styles.tile, active && styles.tileActive]}>
							<Image
								source={{ uri: resolveCategoryImageUri(category.image) }}
								style={styles.image}
								contentFit="cover"
							/>
						</View>
						<Text style={[styles.label, active && styles.labelActive]}>
							{category.name}
						</Text>
					</Pressable>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	row: {
		gap: spacing.sm,
		paddingVertical: spacing.xxs,
	},
	item: {
		alignItems: "center",
		width: TILE_SIZE + 8,
		gap: 6,
	},
	tile: {
		width: TILE_SIZE,
		height: TILE_SIZE,
		borderRadius: 14,
		borderCurve: "continuous",
		backgroundColor: colors.backgroundElevated,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	tileActive: {
		borderColor: colors.primary,
		backgroundColor: "rgba(212, 84, 60, 0.08)",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	label: {
		fontFamily: fonts.medium,
		fontSize: 11,
		lineHeight: 14,
		color: colors.textSecondary,
		textAlign: "center",
	},
	labelActive: {
		color: colors.primary,
		fontFamily: fonts.semibold,
	},
});
