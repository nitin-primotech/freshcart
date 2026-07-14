import { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { strings } from '@/constants/strings';
import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import {
  SUPPORT_CONTACT_OPTIONS,
  SUPPORT_EMAIL,
  SUPPORT_FAQS,
  SUPPORT_HOURS,
  SUPPORT_PHONE,
} from '@/features/profile/constants/profile-hub.constants';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function HelpSupportScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(
    SUPPORT_FAQS[0]?.id ?? null,
  );

  function toggleFaq(id: string) {
    hapticSoftTap();
    setExpandedId((current) => (current === id ? null : id));
  }

  function handleContact(action: 'chat' | 'call' | 'email') {
    hapticSoftTap();
    if (action === 'chat') {
      Alert.alert(
        'Live chat',
        'Our support team will be available in-app soon. For now, call or email us and we will help right away.',
      );
      return;
    }
    if (action === 'call') {
      void Linking.openURL(`tel:${SUPPORT_PHONE}`);
      return;
    }
    void Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${strings.appName} Support`)}`,
    );
  }

  return (
    <ProfileSubScreenShell
      title="Help"
      titleConnector=" & "
      accentTitle="Support"
      subtitle="We are here for your orders"
    >
      <View style={[styles.hero, shadows.soft]}>
        <View style={styles.heroIcon}>
          <AppSymbol name="headphones" size={24} tintColor={colors.primary} />
        </View>
        <Text style={styles.heroTitle}>Need assistance?</Text>
        <Text style={styles.heroSubtitle}>
          Reach us anytime between {SUPPORT_HOURS}.
        </Text>
        <View style={styles.heroBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.heroBadgeText}>Support team online</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact us</Text>
        <View style={styles.contactList}>
          {SUPPORT_CONTACT_OPTIONS.map((option, index) => (
            <Pressable
              key={option.id}
              onPress={() => handleContact(option.action)}
              style={[
                styles.contactRow,
                index < SUPPORT_CONTACT_OPTIONS.length - 1 &&
                  styles.contactRowBorder,
              ]}
              accessibilityRole="button"
              accessibilityLabel={option.title}
            >
              <View style={styles.contactIcon}>
                <AppSymbol
                  name={option.icon}
                  size={16}
                  tintColor={colors.primary}
                />
              </View>
              <View style={styles.contactCopy}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
              </View>
              <AppSymbol
                name="chevron.right"
                size={12}
                tintColor={colors.textTertiary}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently asked questions</Text>
        <View style={styles.faqList}>
          {SUPPORT_FAQS.map((faq, index) => {
            const expanded = expandedId === faq.id;
            return (
              <View
                key={faq.id}
                style={[
                  styles.faqItem,
                  index < SUPPORT_FAQS.length - 1 && styles.faqItemBorder,
                ]}
              >
                <Pressable
                  onPress={() => toggleFaq(faq.id)}
                  style={styles.faqQuestion}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  accessibilityLabel={faq.question}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <AppSymbol
                    name={expanded ? 'chevron.up' : 'chevron.down'}
                    size={12}
                    tintColor={colors.textTertiary}
                  />
                </Pressable>
                {expanded ? (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.note}>
        <AppSymbol
          name="info.circle.fill"
          size={16}
          tintColor={colors.primary}
        />
        <Text style={styles.noteText}>
          For order-specific help, keep your order ID handy. You can find it on
          the order details screen.
        </Text>
      </View>
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.16)',
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  heroBadgeText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
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
  contactList: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  contactRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  contactTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  contactSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  faqList: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  faqItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  faqItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  faqQuestionText: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  faqAnswer: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    paddingBottom: spacing.sm,
    paddingRight: spacing.lg,
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
