import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { selectAddress, useAppStore } from '@/store/app.store';
import {
  openCartSheet,
  selectCartItemCount,
  useCartStore,
} from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function HomeHeader() {
  const router = useRouter();
  const address = useAppStore(selectAddress);
  const cartCount = useCartStore(selectCartItemCount);
  const locationLabel = `${address.line1}, ${address.line2}`;
  const cartBadge = cartCount > 99 ? '99+' : String(cartCount);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          style={styles.location}
          onPress={() => router.push('/location')}
          accessibilityRole="button"
          accessibilityLabel={`Deliver to ${locationLabel}`}
        >
          <View style={styles.pinWrap}>
            <AppSymbol
              name="location.fill"
              size={16}
              tintColor={colors.primary}
              weight="semibold"
            />
          </View>

          <View style={styles.locationCopy}>
            <Text style={styles.deliverLabel}>Deliver to</Text>
            <View style={styles.locationRow}>
              <Text
                style={styles.locationLabel}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {locationLabel}
              </Text>
              <AppSymbol
                name="chevron.down"
                size={11}
                tintColor={colors.textSecondary}
                style={styles.chevron}
              />
            </View>
          </View>
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            style={styles.iconBtn}
            onPress={openCartSheet}
            accessibilityRole="button"
            accessibilityLabel={`Cart, ${cartCount} items`}
          >
            <AppSymbol name="cart" size={20} tintColor={colors.textPrimary} />
            {cartCount > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartBadge}</Text>
              </View>
            ) : null}
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
    minHeight: 44,
    gap: spacing.sm,
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    gap: spacing.xs,
  },
  pinWrap: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationCopy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  deliverLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  locationLabel: {
    flexShrink: 1,
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  chevron: {
    flexShrink: 0,
    marginLeft: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 2,
  },
  iconBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 3,
    right: 1,
    minWidth: 15,
    height: 15,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  cartBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    lineHeight: 10,
    color: colors.textInverse,
  },
});
