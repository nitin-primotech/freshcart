import { Link, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { selectAddress, useAppStore } from '@/store/app.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function HomeHeader() {
  const router = useRouter();
  const address = useAppStore(selectAddress);

  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.location}
        onPress={() => router.push('/location')}
        accessibilityRole="button"
        accessibilityLabel={`Delivery location, ${address.label}`}
      >
        <AppSymbol name="location.fill" size={18} tintColor={colors.primary} />
        <PremiumText
          variant="h3"
          color={colors.textPrimary}
          numberOfLines={1}
          style={styles.locationLabel}
        >
          {address.label}
        </PremiumText>
        <AppSymbol
          name="chevron.down"
          size={11}
          tintColor={colors.textSecondary}
        />
      </Pressable>

      <Link href="/(tabs)/profile" asChild>
        <Pressable
          style={styles.bell}
          accessibilityRole="button"
          accessibilityLabel="Notifications and profile"
        >
          <AppSymbol
            name="bell.fill"
            size={20}
            tintColor={colors.textPrimary}
          />
          <View style={styles.notifDot} />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    marginBottom: spacing.sm,
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: spacing.md,
  },
  locationLabel: {
    flexShrink: 1,
  },
  bell: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
});
