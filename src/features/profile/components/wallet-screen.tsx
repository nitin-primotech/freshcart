import { StyleSheet, Text, View } from 'react-native';
import { strings } from '@/constants/strings';
import { formatInr } from '@/features/checkout/utils/format-currency';
import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import {
  WALLET_BALANCE,
  WALLET_TRANSACTIONS,
} from '@/features/profile/constants/profile-hub.constants';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function WalletScreen() {
  return (
    <ProfileSubScreenShell
      title={strings.appName}
      accentTitle="Wallet"
      subtitle="Cashback, refunds and rewards"
    >
      <View style={[styles.balanceCard, shadows.card]}>
        <View style={styles.balanceIcon}>
          <AppSymbol
            name="wallet.pass.fill"
            size={22}
            tintColor={colors.primary}
          />
        </View>
        <Text style={styles.balanceLabel}>Available balance</Text>
        <Text style={styles.balanceValue}>{formatInr(WALLET_BALANCE)}</Text>
        <Text style={styles.balanceHint}>
          Use at checkout on your next order
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent activity</Text>
        <View style={styles.list}>
          {WALLET_TRANSACTIONS.map((tx) => (
            <View key={tx.id} style={styles.row}>
              <View
                style={[
                  styles.rowIcon,
                  tx.amount < 0 ? styles.rowIconDebit : styles.rowIconCredit,
                ]}
              >
                <AppSymbol
                  name={tx.amount < 0 ? 'cart.fill' : 'tag.fill'}
                  size={14}
                  tintColor={
                    tx.amount < 0 ? colors.textSecondary : colors.success
                  }
                />
              </View>
              <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>{tx.title}</Text>
                <Text style={styles.rowSubtitle}>{tx.subtitle}</Text>
                <Text style={styles.rowDate}>{tx.date}</Text>
              </View>
              <Text
                style={[
                  styles.rowAmount,
                  tx.amount < 0
                    ? styles.rowAmountDebit
                    : styles.rowAmountCredit,
                ]}
              >
                {tx.amount > 0 ? '+' : ''}
                {formatInr(tx.amount)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.16)',
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  balanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  balanceLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  balanceValue: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 38,
    color: colors.primary,
  },
  balanceHint: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 15,
    color: colors.textSecondary,
    textAlign: 'center',
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
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconCredit: {
    backgroundColor: colors.successLight,
  },
  rowIconDebit: {
    backgroundColor: colors.backgroundMuted,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  rowTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  rowSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  rowDate: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textTertiary,
    marginTop: 2,
  },
  rowAmount: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 17,
  },
  rowAmountCredit: {
    color: colors.success,
  },
  rowAmountDebit: {
    color: colors.textPrimary,
  },
});
