import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { PremiumText } from "@/shared/components/premium-text";
import { useCarouselItemWidth } from "@/shared/hooks/use-carousel-item-width";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";

const SERVICES = [
	{ id: "food", label: "FOOD", icon: "fork.knife", active: true },
	{ id: "market", label: "MARKET", icon: "cart.fill", badge: "12 min" },
	{ id: "dine", label: "DINE", icon: "takeoutbag.and.cup.and.straw.fill" },
	{ id: "chef", label: "CHEF'S", icon: "sparkles" },
] as const;

export function ServiceGrid() {
	const tileWidth = useCarouselItemWidth({
		visibleCount: 4,
		peek: 0,
		gap: spacing.sm,
		paddingEnd: spacing.lg,
	});

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.row}
		>
			{SERVICES.map((svc) => {
				const isActive = "active" in svc && svc.active;
				return (
					<Pressable
						key={svc.id}
						style={[
							styles.tile,
							{ width: tileWidth },
							isActive ? styles.tileActive : styles.tileInactive,
						]}
					>
						{"badge" in svc && svc.badge ? (
							<View style={styles.badge}>
								<PremiumText variant="overline" color={colors.textPrimary}>
									{svc.badge}
								</PremiumText>
							</View>
						) : null}
						<AppSymbol
							name={svc.icon}
							size={28}
							tintColor={isActive ? colors.primary : colors.textPrimary}
						/>
						<PremiumText
							variant="label"
							color={isActive ? colors.primary : colors.textPrimary}
						>
							{svc.label}
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
		paddingVertical: spacing.sm,
	},
	tile: {
		height: 108,
		borderRadius: radius.lg,
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.sm,
		borderCurve: "continuous",
	},
	tileActive: {
		backgroundColor: colors.backgroundElevated,
		borderWidth: 1.5,
		borderColor: colors.primary,
		boxShadow: "0 4px 20px rgba(212, 84, 60, 0.12)",
	},
	tileInactive: {
		backgroundColor: colors.backgroundElevated,
		borderWidth: 1,
		borderColor: colors.border,
		boxShadow: "0 2px 12px rgba(28, 28, 30, 0.05)",
	},
	badge: {
		position: "absolute",
		top: spacing.xs,
		right: spacing.xs,
		backgroundColor: colors.accent,
		paddingHorizontal: spacing.sm,
		paddingVertical: 3,
		borderRadius: radius.full,
		boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
	},
});
