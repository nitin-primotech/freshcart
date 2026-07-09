import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { HomeSectionHeader } from "@/features/home/components/home-section-header";
import { POPULAR_BRANDS } from "@/features/home/constants/popular-brands";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

export function SearchTopBrandsSection() {
	return (
		<View style={styles.wrap}>
			<HomeSectionHeader title="Top Brands" href="/(tabs)/categories" />
			<ScrollView
				horizontal
				nestedScrollEnabled
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.row}
			>
				{POPULAR_BRANDS.map((brand) => (
					<View key={brand.id} style={styles.card}>
						<View style={styles.logoWrap}>
							<Image
								source={brand.image}
								style={styles.logo}
								contentFit="contain"
								transition={200}
							/>
						</View>
						<Text style={styles.name} numberOfLines={1}>
							{brand.name}
						</Text>
					</View>
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
		gap: spacing.md,
	},
	card: {
		width: 68,
		alignItems: "center",
		gap: 6,
	},
	logoWrap: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.backgroundElevated,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
		padding: 8,
		overflow: "hidden",
	},
	logo: {
		width: 36,
		height: 36,
	},
	name: {
		fontFamily: fonts.medium,
		fontSize: 10,
		lineHeight: 12,
		color: colors.textPrimary,
		textAlign: "center",
	},
});
