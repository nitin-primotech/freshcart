import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ProfileSubScreenShell } from "@/features/profile/components/profile-sub-screen-shell";
import { formatProfilePhone } from "@/features/profile/constants/profile.constants";
import { DELETE_ACCOUNT_IMPACT } from "@/features/profile/constants/profile-hub.constants";
import { deleteUserAccount } from "@/features/profile/services/delete-account";
import { AppConfirmModal } from "@/shared/components/app-confirm-modal";
import { AppSymbol } from "@/shared/components/app-symbol";
import { hapticSoftTap } from "@/shared/haptics/feedback";
import { selectUserName, useAppStore } from "@/store/app.store";
import { selectUserPhone, useAuthStore } from "@/store/auth.store";
import { colors, shadows } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

export function DeleteProfileScreen() {
	const router = useRouter();
	const userName = useAppStore(selectUserName);
	const phone = useAuthStore(selectUserPhone);
	const [confirmVisible, setConfirmVisible] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const displayName = userName ?? "Guest User";
	const displayPhone = phone ? formatProfilePhone(phone) : "Not linked";

	async function handleDelete() {
		if (isDeleting) return;
		setIsDeleting(true);
		setConfirmVisible(false);
		try {
			await deleteUserAccount();
			router.replace("/login");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<ProfileSubScreenShell
			title="Delete"
			accentTitle="Account"
			subtitle="This action cannot be undone"
		>
			<View style={[styles.warningCard, shadows.soft]}>
				<View style={styles.warningIcon}>
					<AppSymbol
						name="exclamationmark.triangle.fill"
						size={22}
						tintColor={colors.danger}
					/>
				</View>
				<Text style={styles.warningTitle}>
					Permanently delete your account?
				</Text>
				<Text style={styles.warningSubtitle}>
					Your foodRush account and local data on this device will be removed.
					You can create a new account anytime with the same phone number.
				</Text>
			</View>

			<View style={styles.accountCard}>
				<Text style={styles.accountLabel}>Account</Text>
				<Text style={styles.accountName}>{displayName}</Text>
				<Text style={styles.accountPhone}>{displayPhone}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>What will be removed</Text>
				<View style={styles.impactList}>
					{DELETE_ACCOUNT_IMPACT.map((item, index) => (
						<View
							key={item.id}
							style={[
								styles.impactRow,
								index < DELETE_ACCOUNT_IMPACT.length - 1 &&
									styles.impactRowBorder,
							]}
						>
							<View style={styles.impactIcon}>
								<AppSymbol
									name={item.icon}
									size={16}
									tintColor={colors.danger}
								/>
							</View>
							<View style={styles.impactCopy}>
								<Text style={styles.impactTitle}>{item.title}</Text>
								<Text style={styles.impactSubtitle}>{item.subtitle}</Text>
							</View>
						</View>
					))}
				</View>
			</View>

			<Pressable
				style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]}
				onPress={() => {
					hapticSoftTap();
					setConfirmVisible(true);
				}}
				disabled={isDeleting}
				accessibilityRole="button"
				accessibilityLabel="Delete my account"
			>
				<Text style={styles.deleteBtnText}>
					{isDeleting ? "Deleting account…" : "Delete my account"}
				</Text>
			</Pressable>

			<Text style={styles.footnote}>
				Need a break instead? Log out from your profile to sign in again later
				while keeping your order history on this device.
			</Text>

			<AppConfirmModal
				visible={confirmVisible}
				title="Delete account?"
				message="This will permanently remove your profile, orders, wishlist and sign-in session from this device."
				confirmLabel="Delete account"
				icon="trash"
				destructive
				onClose={() => setConfirmVisible(false)}
				onConfirm={() => {
					void handleDelete();
				}}
			/>
		</ProfileSubScreenShell>
	);
}

const styles = StyleSheet.create({
	warningCard: {
		backgroundColor: colors.dangerLight,
		borderRadius: radius.lg,
		borderCurve: "continuous",
		padding: spacing.lg,
		alignItems: "center",
		gap: spacing.xs,
		borderWidth: 1,
		borderColor: "rgba(220, 38, 38, 0.15)",
	},
	warningIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: colors.backgroundElevated,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: spacing.xxs,
	},
	warningTitle: {
		fontFamily: fonts.bold,
		fontSize: 15,
		lineHeight: 20,
		color: colors.textPrimary,
		textAlign: "center",
	},
	warningSubtitle: {
		fontFamily: fonts.regular,
		fontSize: 12,
		lineHeight: 17,
		color: colors.textSecondary,
		textAlign: "center",
	},
	accountCard: {
		backgroundColor: colors.backgroundElevated,
		borderRadius: radius.md,
		borderCurve: "continuous",
		padding: spacing.md,
		gap: 2,
		borderWidth: 1,
		borderColor: colors.border,
	},
	accountLabel: {
		fontFamily: fonts.medium,
		fontSize: 10,
		lineHeight: 13,
		color: colors.textTertiary,
		textTransform: "uppercase",
		letterSpacing: 0.4,
	},
	accountName: {
		fontFamily: fonts.semibold,
		fontSize: 14,
		lineHeight: 18,
		color: colors.textPrimary,
	},
	accountPhone: {
		fontFamily: fonts.regular,
		fontSize: 12,
		lineHeight: 16,
		color: colors.textSecondary,
	},
	section: {
		gap: spacing.sm,
	},
	sectionTitle: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 16,
		color: colors.textPrimary,
	},
	impactList: {
		backgroundColor: colors.backgroundElevated,
		borderRadius: radius.md,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		overflow: "hidden",
	},
	impactRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
		padding: spacing.md,
	},
	impactRowBorder: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.divider,
	},
	impactIcon: {
		width: 32,
		height: 32,
		borderRadius: 16,
		borderCurve: "continuous",
		backgroundColor: colors.dangerLight,
		alignItems: "center",
		justifyContent: "center",
	},
	impactCopy: {
		flex: 1,
		gap: 2,
	},
	impactTitle: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 16,
		color: colors.textPrimary,
	},
	impactSubtitle: {
		fontFamily: fonts.regular,
		fontSize: 10,
		lineHeight: 14,
		color: colors.textSecondary,
	},
	deleteBtn: {
		backgroundColor: colors.danger,
		borderRadius: radius.lg,
		borderCurve: "continuous",
		minHeight: 48,
		alignItems: "center",
		justifyContent: "center",
		marginTop: spacing.xs,
	},
	deleteBtnDisabled: {
		opacity: 0.7,
	},
	deleteBtnText: {
		fontFamily: fonts.semibold,
		fontSize: 14,
		color: colors.textInverse,
	},
	footnote: {
		fontFamily: fonts.regular,
		fontSize: 11,
		lineHeight: 16,
		color: colors.textTertiary,
		textAlign: "center",
	},
});
