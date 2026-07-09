import { Pressable, ScrollView, StyleSheet } from "react-native";

import type { Category } from "@/features/catalog/types/catalog.types";
import { AppSymbol } from "@/shared/components/app-symbol";
import { PremiumText } from "@/shared/components/premium-text";
import { colors, shadows } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";

type CategoryRowProps = {
	categories: Category[];
	selectedId?: string | null;
	onSelect?: (id: string | null) => void;
};

export function CategoryRow({
	categories,
	selectedId,
	onSelect,
}: CategoryRowProps) {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.row}
		>
			<Pressable
				onPress={() => onSelect?.(null)}
				style={[styles.chip, !selectedId && styles.chipActive, shadows.soft]}
			>
				<PremiumText
					variant="captionMedium"
					color={!selectedId ? colors.textInverse : colors.textPrimary}
				>
					All
				</PremiumText>
			</Pressable>
			{categories.map((cat) => {
				const active = selectedId === cat.id;
				return (
					<Pressable
						key={cat.id}
						onPress={() => onSelect?.(cat.id)}
						style={[styles.chip, active && styles.chipActive, shadows.soft]}
					>
						<AppSymbol
							name={cat.icon}
							size={16}
							tintColor={active ? colors.textInverse : colors.primary}
						/>
						<PremiumText
							variant="captionMedium"
							color={active ? colors.textInverse : colors.textPrimary}
						>
							{cat.name}
						</PremiumText>
					</Pressable>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	row: {
		paddingHorizontal: spacing.lg,
		gap: spacing.sm,
		paddingVertical: spacing.xs,
	},
	chip: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderRadius: radius.full,
		backgroundColor: colors.backgroundElevated,
		borderCurve: "continuous",
	},
	chipActive: {
		backgroundColor: colors.primary,
	},
});
