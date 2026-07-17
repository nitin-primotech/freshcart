import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { wishlistPath } from '@/features/wishlist/utils/wishlist-path';
import { isHttpImageUrl } from '@/lib/firebase/category-images';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  clearLastWishlistSaved,
  selectLastWishlistSaved,
  useWishlistStore,
} from '@/store/wishlist.store';
import { colors, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const VISIBLE_MS = 2200;

export function WishlistSavedToast() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lastSaved = useWishlistStore(selectLastWishlistSaved);
  const progress = useSharedValue(0);
  const imageUri = isHttpImageUrl(lastSaved?.image)
    ? lastSaved?.image
    : undefined;

  function openWishlist() {
    hapticSoftTap();
    clearLastWishlistSaved();
    router.push(wishlistPath());
  }

  useEffect(() => {
    if (!lastSaved?.key) return;

    progress.value = 0;
    progress.value = withSequence(
      withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: VISIBLE_MS }),
      withTiming(
        0,
        { duration: 280, easing: Easing.in(Easing.cubic) },
        (done) => {
          if (done) {
            runOnJS(clearLastWishlistSaved)();
          }
        },
      ),
    );
  }, [lastSaved?.key, progress]);

  const toastStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * -14 },
      { scale: 0.97 + progress.value * 0.03 },
    ],
  }));

  if (!lastSaved) return null;

  return (
    <View
      style={[styles.host, { paddingTop: insets.top + spacing.sm }]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={openWishlist}
        accessibilityRole="button"
        accessibilityLabel="View My Wishlist"
        style={styles.pressable}
      >
        <Animated.View style={[styles.toast, shadows.card, toastStyle]}>
          <View style={styles.thumbWrap}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.thumb}
                contentFit="contain"
                transition={200}
              />
            ) : (
              <View style={styles.thumbFallback}>
                <AppSymbol
                  name="heart.fill"
                  size={18}
                  tintColor={colors.primary}
                />
              </View>
            )}
            <View style={styles.thumbHeart}>
              <AppSymbol
                name="heart.fill"
                size={9}
                tintColor={colors.primary}
              />
            </View>
          </View>

          <View style={styles.copy}>
            <Text style={styles.title}>Saved to wishlist</Text>
            <Text style={styles.name} numberOfLines={1}>
              {lastSaved.name}
            </Text>
            <Text style={styles.action}>Tap to view My Wishlist</Text>
          </View>

          <View style={styles.chevronWrap}>
            <AppSymbol
              name="chevron.right"
              size={13}
              tintColor={colors.primary}
              weight="semibold"
            />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 220,
    paddingHorizontal: spacing.md,
  },
  pressable: {
    width: '100%',
  },
  toast: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 72,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.22)',
  },
  thumbWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: '88%',
    height: '88%',
  },
  thumbFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundMuted,
  },
  thumbHeart: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.primary,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  action: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
    marginTop: 1,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
