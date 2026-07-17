import { StyleSheet, Switch, Text, View } from 'react-native';

import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  selectNotificationsEnabled,
  setNotificationsEnabled,
  useAppStore,
} from '@/store/app.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function NotificationsScreen() {
  const enabled = useAppStore(selectNotificationsEnabled);

  return (
    <ProfileSubScreenShell
      title="Push"
      accentTitle="Notifications"
      subtitle="Stay updated on orders and offers"
    >
      <View style={styles.card}>
        <View style={styles.copy}>
          <Text style={styles.title}>Order updates</Text>
          <Text style={styles.subtitle}>
            Delivery status, promotions, and account alerts
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={(value) => {
            hapticSoftTap();
            setNotificationsEnabled(value);
          }}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={colors.backgroundElevated}
        />
      </View>
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
