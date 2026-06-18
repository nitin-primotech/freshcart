import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  clearLastAdded,
  selectLastAdded,
  useCartStore,
} from '@/store/cart.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { floatingCartBottomOffset } from '@/theme/tab-bar';

const DROP_SIZE = 52;
const BADGE_OFFSET = spacing.lg + 14;

export function CartDropAnimation() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const lastAdded = useCartStore(selectLastAdded);
  const progress = useSharedValue(0);

  const cartBarCenterY =
    height - floatingCartBottomOffset(insets.bottom) - spacing.md - 22;
  const startY = height * 0.32;

  useEffect(() => {
    if (!lastAdded) return;

    progress.value = 0;
    progress.value = withTiming(
      1,
      {
        duration: 560,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(clearLastAdded)();
        }
      },
    );
  }, [lastAdded?.id, progress]);

  const dropStyle = useAnimatedStyle(() => {
    const t = Math.min(progress.value, 1);
    const y = startY + (cartBarCenterY - startY) * t;

    return {
      position: 'absolute',
      left: BADGE_OFFSET - DROP_SIZE / 2,
      top: y - DROP_SIZE / 2,
      width: DROP_SIZE,
      height: DROP_SIZE,
      transform: [{ scale: 1 - t * 0.42 }, { rotate: `${(1 - t) * -12}deg` }],
      opacity: t < 0.92 ? 1 : 1 - (t - 0.92) / 0.08,
    };
  });

  if (!lastAdded) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.drop, shadows.card, dropStyle]}>
        <Image
          source={{ uri: lastAdded.image }}
          style={styles.image}
          contentFit="cover"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
  },
  drop: {
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.backgroundElevated,
    backgroundColor: colors.backgroundMuted,
    borderCurve: 'continuous',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
