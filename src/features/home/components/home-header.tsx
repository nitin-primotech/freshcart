import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { selectAddress, useAppStore } from '@/store/app.store';
import {
  openCartSheet,
  selectCartItemCount,
  useCartStore,
} from '@/store/cart.store';
import { selectWishlistCount, useWishlistStore } from '@/store/wishlist.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const LOCATION_GREEN = '#1A4D2E';

function IconBadge({
  count,
  tone,
}: {
  count: number;
  tone: 'danger' | 'success';
}) {
  if (count <= 0) return null;

  return (
    <View
      style={[
        styles.badge,
        tone === 'danger' ? styles.badgeDanger : styles.badgeSuccess,
      ]}
    >
      <Text style={styles.badgeText}>{count > 9 ? '9+' : String(count)}</Text>
    </View>
  );
}

export function HomeHeader() {
  const router = useRouter();
  const address = useAppStore(selectAddress);
  const cartCount = useCartStore(selectCartItemCount);
  const wishlistCount = useWishlistStore(selectWishlistCount);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          style={styles.location}
          onPress={() => router.push('/location')}
          accessibilityRole="button"
          accessibilityLabel={`Deliver to ${address.line2}`}
        >
          <Text style={styles.deliverLabel}>Deliver to</Text>
          <View style={styles.locationRow}>
            <Text
              style={styles.locationLabel}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {address.line2}
            </Text>
            <AppSymbol
              name="chevron.down"
              size={11}
              tintColor={LOCATION_GREEN}
              style={styles.chevron}
            />
          </View>
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => router.push('/(tabs)/wishlist')}
            accessibilityRole="button"
            accessibilityLabel={`Wishlist, ${wishlistCount} saved`}
          >
            <AppSymbol name="heart" size={20} tintColor={colors.textPrimary} />
            <IconBadge count={wishlistCount} tone="danger" />
          </Pressable>

          <Pressable
            style={styles.iconBtn}
            onPress={() => openCartSheet()}
            accessibilityRole="button"
            accessibilityLabel={`Cart, ${cartCount} items`}
          >
            <AppSymbol name="cart" size={20} tintColor={colors.textPrimary} />
            <IconBadge count={cartCount} tone="success" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 44,
  },
  menuBtn: {
    width: 28,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: colors.borderStrong,
    marginLeft: spacing.xs,
    marginRight: spacing.sm,
    flexShrink: 0,
  },
  location: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingRight: spacing.xs,
  },
  deliverLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 13,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  locationLabel: {
    flexShrink: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: LOCATION_GREEN,
  },
  chevron: {
    flexShrink: 0,
    marginLeft: spacing.xxs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: spacing.sm,
    marginLeft: spacing.xs,
  },
  iconBtn: {
    width: 32,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  badgeDanger: {
    backgroundColor: colors.danger,
  },
  badgeSuccess: {
    backgroundColor: colors.success,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textInverse,
    textAlign: 'center',
  },
});
