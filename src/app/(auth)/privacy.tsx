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

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <ScreenBackButton onPress={() => router.back()} />
        <PremiumText variant="h3">Privacy Policy</PremiumText>
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
          1. Information We Collect
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          We collect information you provide directly, including your name,
          phone number, email address, delivery addresses, and payment
          information. We also collect usage data such as order history, app
          interactions, and device information.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          2. How We Use Your Information
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          We use your information to process orders, deliver products, provide
          customer support, send order updates, personalize your experience, and
          improve our services. We may also send promotional communications with
          your consent.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          3. Information Sharing
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          We share your information with restaurants and delivery partners to
          fulfill orders. We may share data with payment processors, analytics
          providers, and service providers who assist in our operations. We do
          not sell your personal information to third parties.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          4. Data Security
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. However, no method of
          transmission over the Internet is 100% secure.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          5. Data Retention
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          We retain your information for as long as your account is active or as
          needed to provide services. We may retain certain information as
          required by law or for legitimate business purposes.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          6. Your Rights
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          You have the right to access, correct, or delete your personal
          information. You can manage your preferences through the app settings
          or by contacting our support team.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          7. Location Data
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          We collect and use location data to facilitate deliveries and improve
          service availability. You can disable location services through your
          device settings, though this may affect app functionality.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          8. Children's Privacy
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          foodRush is not intended for use by children under 18. We do not
          knowingly collect personal information from children. If we become
          aware that we have collected information from a child, we will take
          steps to delete it.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          9. Changes to This Policy
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          We may update this Privacy Policy from time to time. We will notify
          you of any material changes by posting the new policy in the app and
          updating the "Last updated" date.
        </PremiumText>

        <PremiumText variant="bodyMedium" style={styles.sectionTitle}>
          10. Contact Us
        </PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          If you have questions about this Privacy Policy, please contact us at
          privacy@foodrush.com.
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
