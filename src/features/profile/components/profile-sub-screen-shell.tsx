import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
	type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppStatusBar } from "@/shared/components/app-status-bar";
import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { colors } from "@/theme/colors";
import { screenTopPadding } from "@/theme/screen-edge";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

type ProfileSubScreenShellProps = {
	title: string;
	subtitle?: string;
	accentTitle?: string;
	titleConnector?: string;
	children: ReactNode;
	contentStyle?: ViewStyle;
	scroll?: boolean;
};

export function ProfileSubScreenShell({
	title,
	subtitle,
	accentTitle,
	titleConnector,
	children,
	contentStyle,
	scroll = true,
}: ProfileSubScreenShellProps) {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	function onBack() {
		hapticSoftTap();
		router.back();
	}

	const body = scroll ? (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={[
				styles.content,
				contentStyle,
				{ paddingBottom: insets.bottom + spacing.xl },
			]}
		>
			{children}
		</ScrollView>
	) : (
		<View
			style={[
				styles.content,
				contentStyle,
				{ paddingBottom: insets.bottom + spacing.xl, flex: 1 },
			]}
		>
			{children}
		</View>
	);

	return (
		<View style={styles.root}>
			<AppStatusBar style="dark" />

			<View
				style={[styles.header, { paddingTop: screenTopPadding(insets.top) }]}
			>
				<Pressable
					onPress={onBack}
					style={styles.backBtn}
					accessibilityRole="button"
					accessibilityLabel="Go back"
				>
					<AppSymbol
						name="chevron.left"
						size={20}
						tintColor={colors.textPrimary}
					/>
				</Pressable>

				<View style={styles.headerCenter}>
					{accentTitle ? (
						<View style={styles.titleRow}>
							<Text style={styles.titlePrefix}>{title}</Text>
							{titleConnector ? (
								<Text style={styles.titleConnector}>{titleConnector}</Text>
							) : (
								<Text style={styles.titlePrefix}> </Text>
							)}
							<Text style={styles.titleAccent}>{accentTitle}</Text>
						</View>
					) : (
						<Text style={styles.titleSingle}>{title}</Text>
					)}
					{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
				</View>

				<View style={styles.backBtn} />
			</View>

			{body}
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: "row",
		alignItems: "flex-start",
		paddingHorizontal: spacing.md,
		paddingBottom: spacing.md,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.border,
		backgroundColor: colors.background,
	},
	backBtn: {
		width: 40,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	headerCenter: {
		flex: 1,
		alignItems: "center",
		gap: 4,
		paddingTop: 2,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "baseline",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	titlePrefix: {
		fontFamily: fonts.display,
		fontSize: 24,
		lineHeight: 30,
		color: colors.textPrimary,
		letterSpacing: -0.3,
	},
	titleConnector: {
		fontFamily: fonts.medium,
		fontSize: 22,
		lineHeight: 30,
		color: colors.textSecondary,
		letterSpacing: 0,
	},
	titleAccent: {
		fontFamily: fonts.display,
		fontSize: 24,
		lineHeight: 30,
		color: colors.primary,
		letterSpacing: -0.3,
	},
	titleSingle: {
		fontFamily: fonts.display,
		fontSize: 24,
		lineHeight: 30,
		color: colors.textPrimary,
		letterSpacing: -0.3,
		textAlign: "center",
	},
	subtitle: {
		fontFamily: fonts.regular,
		fontSize: 12,
		lineHeight: 16,
		color: colors.textSecondary,
		textAlign: "center",
	},
	content: {
		paddingHorizontal: spacing.md,
		paddingTop: spacing.md,
		gap: spacing.md,
	},
});
