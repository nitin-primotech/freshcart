import { StyleSheet, Text, View } from 'react-native';

import { FREE_DELIVERY_THRESHOLD } from '@/features/checkout/constants/checkout.constants';
import { formatInr } from '@/features/checkout/utils/format-currency';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type CheckoutSavingsBannerProps = {
  savings: number;
  subtotal: number;
  freeDelivery: boolean;
};

export function CheckoutSavingsBanner({
  savings,
  subtotal,
  freeDelivery,
}: CheckoutSavingsBannerProps) {
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const progress = Math.min(subtotal / FREE_DELIVERY_THRESHOLD, 1);
  const unlocked = freeDelivery;

  return (
    <View style={[styles.banner, unlocked && styles.bannerUnlocked]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, unlocked && styles.iconWrapUnlocked]}>
          <AppSymbol
            name={unlocked ? 'checkmark.circle.fill' : 'truck.box.fill'}
            size={20}
            tintColor={unlocked ? colors.success : colors.primary}
          />
        </View>
        <View style={styles.copy}>
          {unlocked ? (
            <>
              <Text style={styles.title}>
                <Text style={styles.titleAccentUnlocked}>FREE delivery</Text>{' '}
                unlocked on this order
              </Text>
              {savings > 0 ? (
                <Text style={styles.subtitle}>
                  You&apos;re saving{' '}
                  <Text style={styles.subtitleAccentUnlocked}>
                    {formatInr(savings)}
                  </Text>{' '}
                  on this order
                </Text>
              ) : null}
            </>
          ) : (
            <>
              {savings > 0 ? (
                <Text style={styles.title}>
                  Yay! You are saving{' '}
                  <Text style={styles.titleAccent}>{formatInr(savings)}</Text>{' '}
                  on this order
                </Text>
              ) : (
                <Text style={styles.title}>
                  Great picks! You&apos;re almost there
                </Text>
              )}
              {remaining > 0 ? (
                <Text style={styles.subtitle}>
                  Add items worth {formatInr(remaining)} more to get{' '}
                  <Text style={styles.subtitleAccent}>FREE delivery</Text>
                </Text>
              ) : null}
            </>
          )}
        </View>
      </View>

      <View
        style={[styles.progressTrack, unlocked && styles.progressTrackUnlocked]}
      >
        <View
          style={[
            styles.progressFill,
            unlocked ? styles.progressFillUnlocked : styles.progressFillPending,
            { width: unlocked ? '100%' : `${progress * 100}%` },
          ]}
        />
        <Text
          style={[
            styles.progressLabel,
            unlocked && styles.progressLabelUnlocked,
          ]}
        >
          {unlocked ? 'Unlocked' : formatInr(remaining)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.2)',
    padding: spacing.md,
    gap: spacing.sm,
  },
  bannerUnlocked: {
    backgroundColor: colors.successLight,
    borderColor: 'rgba(45, 106, 79, 0.22)',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 84, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUnlocked: {
    backgroundColor: 'rgba(45, 106, 79, 0.12)',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  titleAccent: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  titleAccentUnlocked: {
    fontFamily: fonts.bold,
    color: colors.success,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  subtitleAccent: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  subtitleAccentUnlocked: {
    fontFamily: fonts.semibold,
    color: colors.success,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
    marginTop: spacing.xs,
  },
  progressTrackUnlocked: {
    backgroundColor: 'rgba(45, 106, 79, 0.16)',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 3,
  },
  progressFillPending: {
    backgroundColor: colors.primary,
  },
  progressFillUnlocked: {
    backgroundColor: colors.success,
  },
  progressLabel: {
    position: 'absolute',
    right: 0,
    top: 10,
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textTertiary,
  },
  progressLabelUnlocked: {
    color: colors.success,
    fontFamily: fonts.semibold,
  },
});
