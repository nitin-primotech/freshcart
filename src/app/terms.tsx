import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppStatusBar } from '@/shared/components/app-status-bar';
import { ScreenBackButton } from '@/shared/components/screen-back-button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export default function TermsRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <AppStatusBar style="dark" />
      <View style={styles.header}>
        <ScreenBackButton onPress={() => router.back()} />
        <Text style={styles.title}>Terms of Service</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.body}>
          FreshCart is a demo grocery application. By using the app you agree to
          use it for demonstration purposes only. Orders, payments, and delivery
          are simulated and not binding.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.lg,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
