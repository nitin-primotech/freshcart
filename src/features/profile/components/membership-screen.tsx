import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import { MEMBERSHIP_PERKS } from '@/features/profile/constants/profile-hub.constants';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors, gradients, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function MembershipScreen() {
  return (
    <ProfileSubScreenShell
      title={strings.appName}
      accentTitle="Gold"
      subtitle="Your membership benefits"
    >
      <LinearGradient
        colors={gradients.gold.colors}
        start={gradients.gold.start}
        end={gradients.gold.end}
        style={[styles.hero, shadows.card]}
      >
        <View style={styles.heroIcon}>
          <AppSymbol
            name="crown.fill"
            size={28}
            tintColor={colors.textInverse}
          />
        </View>
        <Text style={styles.heroTitle}>Active Member</Text>
        <Text style={styles.heroSubtitle}>Renews on 15 Aug 2026</Text>
        <View style={styles.heroBadge}>
          <AppSymbol
            name="checkmark.circle.fill"
            size={12}
            tintColor={colors.textInverse}
          />
          <Text style={styles.heroBadgeText}>Premium benefits unlocked</Text>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your perks</Text>
        <View style={styles.perkList}>
          {MEMBERSHIP_PERKS.map((perk, index) => (
            <View
              key={perk.id}
              style={[
                styles.perkRow,
                index < MEMBERSHIP_PERKS.length - 1 && styles.perkRowBorder,
              ]}
            >
              <View style={styles.perkIcon}>
                <AppSymbol
                  name={perk.icon}
                  size={16}
                  tintColor={colors.primary}
                />
              </View>
              <View style={styles.perkCopy}>
                <Text style={styles.perkTitle}>{perk.title}</Text>
                <Text style={styles.perkSubtitle}>{perk.subtitle}</Text>
              </View>
              <AppSymbol
                name="checkmark.circle.fill"
                size={16}
                tintColor={colors.success}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.note}>
        <AppSymbol name="sparkles" size={16} tintColor={colors.primary} />
        <Text style={styles.noteText}>
          Gold members save an average of $320 per month on delivery and
          exclusive offers.
        </Text>
      </View>
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.textInverse,
  },
  heroSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 0.88)',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  heroBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textInverse,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  perkList: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  perkRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  perkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  perkTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  perkSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.12)',
  },
  noteText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },
});
