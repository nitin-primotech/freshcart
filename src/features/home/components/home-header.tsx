import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { selectAddress, useAppStore } from '@/store/app.store';
import { selectUserPhone, useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function HomeHeader() {
  const router = useRouter();
  const address = useAppStore(selectAddress);
  const phone = useAuthStore(selectUserPhone);

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Pressable
          style={styles.location}
          onPress={() => router.push('/location')}
          accessibilityRole="button"
          accessibilityLabel={`Delivery location, ${address.label}`}
        >
          <AppSymbol
            name="location.fill"
            size={22}
            tintColor={colors.primaryLight}
          />
          <View style={styles.locationText}>
            <View style={styles.locationTitle}>
              <PremiumText variant="h3" color={colors.textInverse}>
                {address.label}
              </PremiumText>
              <AppSymbol
                name="chevron.down"
                size={14}
                tintColor={colors.textInverse}
              />
            </View>
            <PremiumText
              variant="bodySmall"
              color={colors.textOnDarkMuted}
              numberOfLines={1}
            >
              {address.line1}
            </PremiumText>
          </View>
        </Pressable>
        <Link href="/(tabs)/profile" asChild>
          <Pressable style={styles.avatar} accessibilityRole="button">
            <AppSymbol
              name="person.fill"
              size={22}
              tintColor={colors.primary}
            />
          </Pressable>
        </Link>
      </View>
      {phone ? (
        <View style={styles.sessionPill}>
          <PremiumText variant="overline" color={colors.textOnDarkMuted}>
            Signed in
          </PremiumText>
          <PremiumText variant="captionMedium" color={colors.textInverse}>
            +1 {phone.slice(0, 3)} ••• {phone.slice(-4)}
          </PremiumText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    gap: spacing.xxs,
  },
  locationTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    borderCurve: 'continuous',
  },
  sessionPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
});
