import { StyleSheet } from "react-native";

import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

export const authScreenStyles = StyleSheet.create({
	formHeader: {
		gap: spacing.xs,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 20,
		lineHeight: 20,
		color: colors.textPrimary,
	},
	subtitle: {
		fontFamily: fonts.regular,
		fontSize: 13,
		lineHeight: 18,
		color: colors.textSecondary,
	},
	phoneHighlight: {
		fontFamily: fonts.semibold,
		color: colors.textPrimary,
	},
	inputWrap: {
		borderWidth: 1.5,
		borderColor: colors.primary,
		borderRadius: radius.md,
		borderCurve: "continuous",
		paddingHorizontal: spacing.md,
		minHeight: 50,
		justifyContent: "center",
		backgroundColor: colors.backgroundElevated,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		minWidth: 0,
	},
	input: {
		flex: 1,
		flexShrink: 1,
		minWidth: 0,
		fontFamily: fonts.medium,
		fontSize: 16,
		lineHeight: 20,
		color: colors.textPrimary,
		paddingVertical: 0,
		backgroundColor: colors.backgroundElevated,
	},
	inputDivider: {
		width: StyleSheet.hairlineWidth,
		alignSelf: "stretch",
		backgroundColor: colors.borderStrong,
	},
	country: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xxs,
		flexShrink: 0,
	},
	countryChevron: {
		marginLeft: -2,
	},
	flag: {
		fontSize: 18,
		lineHeight: 22,
	},
	countryCode: {
		fontFamily: fonts.semibold,
		fontSize: 15,
		lineHeight: 20,
		color: colors.textPrimary,
	},
	error: {
		fontFamily: fonts.medium,
		fontSize: 12,
		lineHeight: 16,
		color: colors.danger,
		marginTop: -spacing.xs,
	},
	safeNote: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.xs,
		marginTop: -spacing.xs,
	},
	safeText: {
		fontFamily: fonts.medium,
		fontSize: 12,
		lineHeight: 16,
		color: colors.success,
	},
	legal: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 16,
		color: colors.textSecondary,
		textAlign: "center",
		paddingHorizontal: spacing.sm,
	},
	legalLink: {
		fontFamily: fonts.semibold,
		color: colors.primary,
	},
	codeWrap: {
		width: "100%",
		paddingVertical: spacing.xs,
	},
	sessionHint: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 15,
		color: colors.textTertiary,
		textAlign: "center",
	},
	invisibleInput: {
		position: "absolute",
		opacity: 0,
		width: 1,
		height: 1,
	},
	resendRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.xs,
	},
	resendText: {
		fontFamily: fonts.regular,
		fontSize: 12,
		lineHeight: 16,
		color: colors.textSecondary,
	},
	resendLink: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 16,
		color: colors.primary,
	},
});
