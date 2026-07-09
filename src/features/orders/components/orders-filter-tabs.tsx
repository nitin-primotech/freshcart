import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import {
	ORDER_TABS,
	type OrderTabId,
} from "@/features/orders/constants/orders.constants";
import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const ICON_SLOT = 22;

type OrdersFilterTabsProps = {
	activeTab: OrderTabId;
	onChange: (tab: OrderTabId) => void;
};

export function OrdersFilterTabs({
	activeTab,
	onChange,
}: OrdersFilterTabsProps) {
	return (
		<View style={styles.wrap}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.content}
			>
				{ORDER_TABS.map((tab) => {
					const selected = activeTab === tab.id;
					return (
						<Pressable
							key={tab.id}
							onPress={() => {
								hapticSoftTap();
								onChange(tab.id);
							}}
							style={[styles.tab, selected && styles.tabSelected]}
							accessibilityRole="button"
							accessibilityState={{ selected }}
						>
							<View style={styles.iconSlot}>
								<AppSymbol
									name={tab.icon}
									size={18}
									tintColor={selected ? colors.primary : colors.textTertiary}
									weight={selected ? "semibold" : "regular"}
								/>
							</View>
							<Text style={[styles.label, selected && styles.labelActive]}>
								{tab.label}
							</Text>
						</Pressable>
					);
				})}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.border,
		backgroundColor: colors.background,
	},
	content: {
		paddingHorizontal: spacing.sm,
	},
	tab: {
		minWidth: 88,
		alignItems: "center",
		paddingTop: spacing.sm,
		paddingBottom: spacing.sm,
		paddingHorizontal: spacing.xs,
		borderBottomWidth: 2,
		borderBottomColor: "transparent",
		gap: 4,
	},
	tabSelected: {
		borderBottomColor: colors.primary,
	},
	iconSlot: {
		width: ICON_SLOT,
		height: ICON_SLOT,
		alignItems: "center",
		justifyContent: "center",
	},
	label: {
		fontFamily: fonts.medium,
		fontSize: 10,
		lineHeight: 12,
		color: colors.textTertiary,
		textAlign: "center",
	},
	labelActive: {
		fontFamily: fonts.semibold,
		color: colors.primary,
	},
});
