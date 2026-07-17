import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppLanguage } from '@/features/auth/types/user-preferences.types';
import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap, hapticSuccess } from '@/shared/haptics/feedback';
import {
  selectAppLanguage,
  setAppLanguage,
  useAppStore,
} from '@/store/app.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const LANGUAGE_OPTIONS: { id: AppLanguage; label: string; native: string }[] = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

export function LanguageScreen() {
  const language = useAppStore(selectAppLanguage);

  function handleSelect(next: AppLanguage) {
    hapticSoftTap();
    setAppLanguage(next);
    hapticSuccess();
  }

  return (
    <ProfileSubScreenShell
      title="App"
      accentTitle="Language"
      subtitle="Choose your preferred language"
    >
      <View style={styles.list}>
        {LANGUAGE_OPTIONS.map((option, index) => {
          const selected = language === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => handleSelect(option.id)}
              style={[
                styles.row,
                index < LANGUAGE_OPTIONS.length - 1 && styles.rowBorder,
                selected && styles.rowSelected,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <View style={styles.copy}>
                <Text style={styles.label}>{option.label}</Text>
                <Text style={styles.native}>{option.native}</Text>
              </View>
              {selected ? (
                <AppSymbol
                  name="checkmark.circle.fill"
                  size={18}
                  tintColor={colors.primary}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    gap: spacing.sm,
  },
  rowSelected: {
    backgroundColor: 'rgba(212, 84, 60, 0.04)',
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  copy: {
    gap: 2,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  native: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
