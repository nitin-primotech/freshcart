import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

type HomeSectionHeaderProps = {
	title: string;
	onViewAll?: () => void;
	href?: Href;
};

export function HomeSectionHeader({
	title,
	onViewAll,
	href,
}: HomeSectionHeaderProps) {
	const router = useRouter();
	const handleViewAll =
		onViewAll ?? (href ? () => router.push(href) : undefined);

	return (
		<View style={styles.row}>
			<Text style={styles.title}>{title}</Text>
			{handleViewAll ? (
				<Pressable
					onPress={handleViewAll}
					hitSlop={8}
					accessibilityRole="button"
				>
					<Text style={styles.viewAll}>See all {">"}</Text>
				</Pressable>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: spacing.md,
		marginBottom: spacing.xs,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 15,
		lineHeight: 19,
		color: colors.textPrimary,
	},
	viewAll: {
		fontFamily: fonts.medium,
		fontSize: 12,
		lineHeight: 15,
		color: colors.primary,
	},
});
