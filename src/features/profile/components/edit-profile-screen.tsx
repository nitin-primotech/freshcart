import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CountryCodePickerButton } from '@/features/auth/components/country-code-picker-button';
import type { PhoneCountry } from '@/features/auth/types/phone-country.types';
import { ProfileAvatar } from '@/features/profile/components/profile-avatar';
import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import { formatProfilePhone } from '@/features/profile/constants/profile.constants';
import { resolveProfileIdentity } from '@/features/profile/utils/profile-identity';
import { AppInfoModal } from '@/shared/components/app-info-modal';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PROFILE_SAVED_NAV_DELAY_MS } from '@/shared/components/profile-saved-toast';
import { hapticSoftTap, hapticSuccess } from '@/shared/haptics/feedback';
import { formTextInputProps } from '@/shared/utils/keyboard';
import { filterPersonNameInput } from '@/shared/utils/person-name';
import {
  markProfileSaved,
  selectAddress,
  selectPhoneCountry,
  selectUserName,
  setPhoneCountry,
  updateProfileName,
  useAppStore,
} from '@/store/app.store';
import {
  selectSession,
  selectUserPhone,
  useAuthStore,
} from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

function localPhoneDigits(phone: string | null): string {
  if (!phone?.trim()) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    const local = digits.slice(-10);
    return `${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return phone;
}

export function EditProfileScreen() {
  const router = useRouter();
  const userName = useAppStore(selectUserName);
  const phone = useAuthStore(selectUserPhone);
  const session = useAuthStore(selectSession);
  const phoneCountry = useAppStore(selectPhoneCountry);
  const address = useAppStore(selectAddress);

  const identity = useMemo(
    () => resolveProfileIdentity({ storedName: userName, session }),
    [userName, session],
  );

  const initialName = identity.name;
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const navigateBackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (navigateBackTimeoutRef.current) {
        clearTimeout(navigateBackTimeoutRef.current);
      }
    };
  }, []);

  const trimmed = name.trim();
  const canSave = !isSaving && trimmed.length >= 2 && trimmed !== initialName;
  const displayPhone = useMemo(
    () => formatProfilePhone(phone, phoneCountry.callingCode),
    [phone, phoneCountry.callingCode],
  );
  const localPhone = useMemo(() => localPhoneDigits(phone), [phone]);
  const namePlaceholder =
    identity.provider === 'google' ? 'Your Google name' : 'Enter your name';

  function handleCountrySelect(nextCountry: PhoneCountry) {
    setPhoneCountry(nextCountry);
  }

  function handleSave() {
    if (!canSave) return;
    Keyboard.dismiss();
    setIsSaving(true);
    updateProfileName(trimmed);
    markProfileSaved();
    hapticSuccess();
    navigateBackTimeoutRef.current = setTimeout(() => {
      navigateBackTimeoutRef.current = null;
      if (router.canGoBack()) {
        router.back();
        return;
      }
      router.replace('/(tabs)/profile');
    }, PROFILE_SAVED_NAV_DELAY_MS);
  }

  return (
    <ProfileSubScreenShell
      title="Edit"
      accentTitle="Profile"
      subtitle={
        identity.needsName
          ? 'Add your name so we can personalize your orders'
          : 'Update your account details'
      }
    >
      <View style={styles.avatarSection}>
        <ProfileAvatar
          uri={identity.avatarUri}
          initials={identity.initials}
          size={88}
          showPersonFallback={identity.needsName && !identity.avatarUri}
        />
        <Text style={styles.authLabel}>{identity.authLabel}</Text>
      </View>

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
            placeholder={namePlaceholder}
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
              onPress={() => setName('')}
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
        {identity.needsName ? (
          <Text style={styles.helperText}>
            This name appears on your profile and order receipts.
          </Text>
        ) : null}
      </View>

      {identity.email ? (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.inputRow, styles.inputRowDisabled]}>
            <AppSymbol
              name="envelope.fill"
              size={16}
              tintColor={colors.textTertiary}
            />
            <Text style={styles.readOnlyText}>{identity.email}</Text>
            {identity.provider === 'google' ? (
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedPillText}>Google</Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}

      {phone ? (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Mobile number</Text>
          <View style={[styles.inputRow, styles.inputRowDisabled]}>
            <CountryCodePickerButton
              country={phoneCountry as PhoneCountry}
              onSelect={handleCountrySelect}
            />
            <View style={styles.inputDivider} />
            <Text style={styles.readOnlyText}>
              {localPhone || displayPhone}
            </Text>
            {identity.provider === 'phone' ? (
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedPillText}>Verified</Text>
              </View>
            ) : null}
          </View>
          {localPhone ? (
            <Text style={styles.helperText}>{displayPhone}</Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Delivery area</Text>
        <Pressable
          style={styles.inputRow}
          onPress={() => {
            hapticSoftTap();
            router.push('/location');
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
        <Text style={styles.saveBtnText}>
          {identity.needsName ? 'Save name' : 'Save changes'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryBtn}
        onPress={() => {
          hapticSoftTap();
          setHelpModalVisible(true);
        }}
        accessibilityRole="button"
      >
        <Text style={styles.secondaryBtnText}>
          Need help with your account?
        </Text>
      </Pressable>

      <AppInfoModal
        visible={helpModalVisible}
        title="Need help?"
        message="Contact support from Help & Support on your profile."
        icon="questionmark.circle.fill"
        onClose={() => setHelpModalVisible(false)}
      />
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  authLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundMuted,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  inputRowDisabled: {
    opacity: 0.92,
  },
  inputDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginVertical: spacing.xxs,
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
  helperText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textTertiary,
    marginLeft: spacing.xxs,
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
    borderCurve: 'continuous',
    paddingVertical: 14,
    alignItems: 'center',
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
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  secondaryBtnText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primary,
  },
});
