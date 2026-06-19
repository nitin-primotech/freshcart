import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PremiumText } from '@/shared/components/premium-text';
import {
  SCREEN_BACK_BUTTON_SIZE,
  ScreenBackButton,
} from '@/shared/components/screen-back-button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export default function TermsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <ScreenBackButton onPress={() => router.back()} />
        <PremiumText variant="h3">Terms of Service</PremiumText>
        <View style={styles.backSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <PremiumText variant="body" color={colors.textSecondary}>
          Last updated: June 2026
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          1. Acceptance of Terms
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          By accessing or using foodRush ("the App"), you agree to be bound by
          these Terms of Service. If you do not agree to these terms, please do
          not use the App.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          2. Use of the App
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          foodRush provides a platform for ordering food, groceries, and dining
          services. You must be at least 18 years old to use this service. You
          are responsible for maintaining the confidentiality of your account
          credentials.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          3. Orders & Payments
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          All orders are subject to availability. Prices may vary based on
          location and demand. Payment is processed securely through our
          third-party payment partners. You agree to pay all charges incurred
          under your account.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          4. Delivery
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          Estimated delivery times are provided for convenience and may vary.
          foodRush is not liable for delays caused by circumstances beyond our
          control, including weather, traffic, or restaurant preparation times.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          5. Cancellations & Refunds
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          Orders may be cancelled within a limited window after placement.
          Refunds are processed in accordance with our refund policy. Contact
          support for any billing disputes.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          6. User Conduct
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          You agree not to misuse the App, engage in fraudulent activities, or
          violate any applicable laws. We reserve the right to suspend or
          terminate accounts that violate these terms.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          7. Privacy
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          Your use of the App is also governed by our Privacy Policy, which
          describes how we collect, use, and share your personal information.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          8. Limitation of Liability
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          foodRush shall not be liable for any indirect, incidental, special, or
          consequential damages arising from your use of the App. Our total
          liability shall not exceed the amount paid by you in the last 12
          months.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          9. Changes to Terms
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          We may update these terms from time to time. Continued use of the App
          after changes constitutes acceptance of the revised terms.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          10. Contact
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          For questions about these Terms of Service, please contact us at
          support@foodrush.com.
        </PremiumText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backSpacer: {
    width: SCREEN_BACK_BUTTON_SIZE,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    marginTop: spacing.sm,
  },
});
