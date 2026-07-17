import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const APP_VERSION =
  Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

export function AboutScreen() {
  return (
    <ProfileSubScreenShell
      title="About"
      accentTitle="FreshCart"
      subtitle="Groceries delivered fast"
    >
      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          <AppSymbol name="cart.fill" size={28} tintColor={colors.primary} />
        </View>
        <Text style={styles.appName}>FreshCart</Text>
        <Text style={styles.version}>Version {APP_VERSION}</Text>
      </View>

      <Text style={styles.body}>
        FreshCart brings fresh groceries, household essentials, and daily needs
        to your doorstep with express delivery. Browse categories, reorder
        favorites, and track every order in real time.
      </Text>

      <View style={styles.metaCard}>
        <Text style={styles.metaLabel}>Made for</Text>
        <Text style={styles.metaValue}>iOS & Android</Text>
      </View>
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  appName: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  version: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  metaCard: {
    backgroundColor: colors.backgroundMuted,
    borderRadius: 12,
    borderCurve: 'continuous',
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  metaValue: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
});
