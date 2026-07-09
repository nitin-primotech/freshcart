import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Keyboard,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

import { ProfileSubScreenShell } from "@/features/profile/components/profile-sub-screen-shell";
import { formatProfilePhone } from "@/features/profile/constants/profile.constants";
import { AppSymbol } from "@/shared/components/app-symbol";
import { PROFILE_SAVED_NAV_DELAY_MS } from "@/shared/components/profile-saved-toast";
import { hapticSoftTap, hapticSuccess } from "@/shared/haptics/feedback";
import { formTextInputProps } from "@/shared/utils/keyboard";
import { filterPersonNameInput } from "@/shared/utils/person-name";
import {
	markProfileSaved,
	selectAddress,
	selectUserName,
	updateProfileName,
	useAppStore,
} from "@/store/app.store";
import { selectUserPhone, useAuthStore } from "@/store/auth.store";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

export function EditProfileScreen() {
	const router = useRouter();
	const userName = useAppStore(selectUserName);
	const phone = useAuthStore(selectUserPhone);
	const address = useAppStore(selectAddress);
	const [name, setName] = useState(userName ?? "");
	const [isSaving, setIsSaving] = useState(false);

	const trimmed = name.trim();
	const canSave =
		!isSaving && trimmed.length >= 2 && trimmed !== (userName ?? "");
	const displayPhone = phone ? formatProfilePhone(phone) : "Not linked";

	function handleSave() {
		if (!canSave) return;
		Keyboard.dismiss();
		setIsSaving(true);
		updateProfileName(trimmed);
		markProfileSaved();
		hapticSuccess();
		setTimeout(() => {
			router.back();
		}, PROFILE_SAVED_NAV_DELAY_MS);
	}

	return (
		<ProfileSubScreenShell
			title="Edit"
			accentTitle="Profile"
			subtitle="Update your account details"
		>
			<View style={styles.fieldGroup}>
				<Text style={styles.label}>Full name</Text>
				<View style={styles.inputRow}>
					<AppSymbol
						name="person.fill"
						size={16}
						tintColor={colors.textTertiary}
					/>
					<TextInput
						value={name}
						onChangeText={(text) => setName(filterPersonNameInput(text))}
						placeholder="Your name"
						placeholderTextColor={colors.textTertiary}
						style={styles.input}
						autoCapitalize="words"
						autoCorrect={false}
						textContentType="name"
						returnKeyType="done"
						onSubmitEditing={handleSave}
						selectionColor={colors.primary}
						{...formTextInputProps}
						maxLength={30}
					/>
					{name.length > 0 ? (
						<Pressable
							onPress={() => setName("")}
							hitSlop={8}
							accessibilityRole="button"
							accessibilityLabel="Clear name"
						>
							<AppSymbol
								name="xmark.circle.fill"
								size={18}
								tintColor={colors.textTertiary}
							/>
						</Pressable>
					) : null}
				</View>
			</View>

			<View style={styles.fieldGroup}>
				<Text style={styles.label}>Mobile number</Text>
				<View style={[styles.inputRow, styles.inputRowDisabled]}>
					<AppSymbol
						name="phone.fill"
						size={16}
						tintColor={colors.textTertiary}
					/>
					<Text style={styles.readOnlyText}>{displayPhone}</Text>
					<View style={styles.verifiedPill}>
						<Text style={styles.verifiedPillText}>Verified</Text>
					</View>
				</View>
			</View>

			<View style={styles.fieldGroup}>
				<Text style={styles.label}>Delivery area</Text>
				<Pressable
					style={styles.inputRow}
					onPress={() => {
						hapticSoftTap();
						router.push("/location");
					}}
					accessibilityRole="button"
				>
					<AppSymbol
						name="location.fill"
						size={16}
						tintColor={colors.textTertiary}
					/>
					<Text style={styles.readOnlyText} numberOfLines={2}>
						{address.line2}
					</Text>
					<AppSymbol
						name="chevron.right"
						size={12}
						tintColor={colors.textTertiary}
					/>
				</Pressable>
			</View>

			<Pressable
				style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
				onPress={handleSave}
				disabled={!canSave}
				accessibilityRole="button"
				accessibilityLabel="Save profile"
			>
				<Text style={styles.saveBtnText}>Save changes</Text>
			</Pressable>

			<Pressable
				style={styles.secondaryBtn}
				onPress={() => {
					hapticSoftTap();
					Alert.alert(
						"Need help?",
						"Contact support from Help & Support on your profile.",
					);
				}}
				accessibilityRole="button"
			>
				<Text style={styles.secondaryBtnText}>
					Need help with your account?
				</Text>
			</Pressable>
		</ProfileSubScreenShell>
	);
}

const styles = StyleSheet.create({
	avatarWrap: {
		alignSelf: "center",
		width: 88,
		height: 88,
		marginBottom: spacing.xs,
		position: "relative",
	},
	avatar: {
		width: 88,
		height: 88,
		borderRadius: 44,
		backgroundColor: "rgba(212, 84, 60, 0.1)",
		borderWidth: 2,
		borderColor: "rgba(212, 84, 60, 0.2)",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarInitials: {
		fontFamily: fonts.bold,
		fontSize: 28,
		lineHeight: 34,
		color: colors.primary,
	},
	avatarIcon: {
		position: "absolute",
		right: -2,
		bottom: -2,
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
	},
	fieldGroup: {
		gap: spacing.xs,
	},
	label: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 16,
		color: colors.textSecondary,
		marginLeft: spacing.xxs,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: colors.backgroundMuted,
		borderRadius: 14,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		minHeight: 52,
	},
	inputRowDisabled: {
		opacity: 0.92,
	},
	input: {
		flex: 1,
		fontFamily: fonts.medium,
		fontSize: 14,
		lineHeight: 20,
		color: colors.textPrimary,
		paddingVertical: 0,
	},
	readOnlyText: {
		flex: 1,
		fontFamily: fonts.medium,
		fontSize: 14,
		lineHeight: 20,
		color: colors.textPrimary,
	},
	verifiedPill: {
		backgroundColor: colors.successLight,
		borderRadius: 6,
		paddingHorizontal: 8,
		paddingVertical: 3,
	},
	verifiedPillText: {
		fontFamily: fonts.semibold,
		fontSize: 10,
		lineHeight: 12,
		color: colors.success,
	},
	saveBtn: {
		marginTop: spacing.sm,
		backgroundColor: colors.primary,
		borderRadius: 14,
		borderCurve: "continuous",
		paddingVertical: 14,
		alignItems: "center",
	},
	saveBtnDisabled: {
		opacity: 0.45,
	},
	saveBtnText: {
		fontFamily: fonts.semibold,
		fontSize: 15,
		lineHeight: 19,
		color: colors.textInverse,
	},
	secondaryBtn: {
		alignItems: "center",
		paddingVertical: spacing.sm,
	},
	secondaryBtnText: {
		fontFamily: fonts.medium,
		fontSize: 12,
		lineHeight: 16,
		color: colors.primary,
	},
});
