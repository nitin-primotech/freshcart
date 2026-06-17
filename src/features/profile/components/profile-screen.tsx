import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { GlassCard } from '@/shared/components/glass-card';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import {
  resetAppProfile,
  selectUserName,
  useAppStore,
} from '@/store/app.store';
import {
  clearAuthState,
  selectUserPhone,
  useAuthStore,
} from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { screenTopPadding } from '@/theme/screen-edge';
import { radius, spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';

const MENU_ITEMS = [
  { icon: 'heart.fill', label: 'Favorites' },
  { icon: 'creditcard.fill', label: 'Payment methods' },
  { icon: 'bell.fill', label: 'Notifications' },
  { icon: 'questionmark.circle.fill', label: 'Help & support' },
] as const;

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const phone = useAuthStore(selectUserPhone);
  const userName = useAppStore(selectUserName);

  async function handleLogout() {
    await clearAuthState();
    await resetAppProfile();
    router.replace('/(auth)/welcome');
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />
      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: screenTopPadding(insets.top),
            paddingBottom: tabBarContentPadding(insets.bottom),
          },
        ]}
      >
        <Animated.View entering={FadeInDown.duration(450)} style={styles.hero}>
          <Image
            source="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
            style={styles.avatar}
          />
          <PremiumText variant="h1">{userName ?? 'Alex Morgan'}</PremiumText>
          <PremiumText variant="body" color={colors.textSecondary}>
            Premium member · Since 2024
          </PremiumText>
          {phone ? (
            <PremiumText variant="caption" color={colors.textSecondary}>
              +1 {phone.slice(0, 3)}•••{phone.slice(-4)}
            </PremiumText>
          ) : null}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <PremiumText variant="h2">47</PremiumText>
              <PremiumText variant="caption" color={colors.textSecondary}>
                Orders
              </PremiumText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <PremiumText variant="h2">4.9</PremiumText>
              <PremiumText variant="caption" color={colors.textSecondary}>
                Rating
              </PremiumText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <PremiumText variant="h2">$128</PremiumText>
              <PremiumText variant="caption" color={colors.textSecondary}>
                Saved
              </PremiumText>
            </View>
          </View>
        </Animated.View>

        <GlassCard padding={0}>
          {MENU_ITEMS.map((item, i) => (
            <View
              key={item.label}
              style={[
                styles.menuRow,
                i < MENU_ITEMS.length - 1 && styles.menuBorder,
              ]}
            >
              <AppSymbol
                name={item.icon}
                size={22}
                tintColor={colors.primary}
              />
              <PremiumText variant="bodyMedium" style={styles.menuLabel}>
                {item.label}
              </PremiumText>
              <AppSymbol
                name="chevron.right"
                size={14}
                tintColor={colors.textTertiary}
              />
            </View>
          ))}
        </GlassCard>

        <PremiumButton
          label="Log out"
          variant="secondary"
          onPress={handleLogout}
        />

        <View style={styles.demoBanner}>
          <PremiumText variant="h3">Demo mode</PremiumText>
          <PremiumText variant="caption" color={colors.textSecondary}>
            This is a presentation build with simulated data and payments. No
            backend is connected.
          </PremiumText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    justifyContent: 'space-around',
    ...{
      boxShadow: '0 8px 32px rgba(28, 28, 30, 0.1)',
    },
    borderCurve: 'continuous',
  },
  stat: {
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuLabel: {
    flex: 1,
  },
  demoBanner: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
    borderCurve: 'continuous',
    boxShadow: '0 4px 24px rgba(28, 28, 30, 0.08)',
  },
});
