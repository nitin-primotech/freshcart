import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import { PROFILE_OFFERS } from '@/features/profile/constants/profile-hub.constants';
import { AppInfoModal } from '@/shared/components/app-info-modal';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap, hapticSuccess } from '@/shared/haptics/feedback';
import { colors, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function OffersScreen() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  function copyCode(code: string) {
    hapticSuccess();
    setCopiedCode(code);
  }

  return (
    <ProfileSubScreenShell
      title="Your"
      accentTitle="Offers"
      subtitle={`${PROFILE_OFFERS.length} coupons available`}
    >
      <View style={styles.summary}>
        <AppSymbol name="tag.fill" size={18} tintColor={colors.primary} />
        <Text style={styles.summaryText}>
          Apply these codes on the checkout screen before you place your order.
        </Text>
      </View>

      {PROFILE_OFFERS.map((offer) => (
        <Pressable
          key={offer.id}
          onPress={() => {
            hapticSoftTap();
            copyCode(offer.code);
          }}
          style={[styles.card, shadows.soft]}
          accessibilityRole="button"
          accessibilityLabel={`Copy offer ${offer.title}`}
        >
          <LinearGradient
            colors={offer.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.cardCopy}>
              <Text style={styles.cardTitle}>{offer.title}</Text>
              <Text style={styles.cardSubtitle}>{offer.subtitle}</Text>
              <View style={styles.codePill}>
                <Text style={styles.codeText}>{offer.code}</Text>
                <AppSymbol
                  name="doc.text.fill"
                  size={11}
                  tintColor={colors.textInverse}
                />
              </View>
              <Text style={styles.expires}>{offer.expiresLabel}</Text>
            </View>
            <View style={styles.cardIcon}>
              <AppSymbol
                name={offer.icon}
                size={34}
                tintColor="rgba(255, 255, 255, 0.28)"
              />
            </View>
          </LinearGradient>
        </Pressable>
      ))}

      <AppInfoModal
        visible={copiedCode != null}
        title="Coupon copied"
        message={copiedCode ? `${copiedCode} is ready to use at checkout.` : ''}
        icon="tag.fill"
        onClose={() => setCopiedCode(null)}
      />
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 12,
    borderCurve: 'continuous',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.12)',
  },
  summaryText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
  },
  card: {
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  gradient: {
    minHeight: 108,
    padding: spacing.md,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardCopy: {
    gap: 4,
    maxWidth: '72%',
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textInverse,
  },
  cardSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 0.88)',
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  codeText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textInverse,
    letterSpacing: 0.6,
  },
  expires: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: spacing.xs,
  },
  cardIcon: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
});
