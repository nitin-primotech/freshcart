import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { hapticSoftTap, hapticSuccess } from '@/shared/haptics/feedback';
import { selectActiveOrder, useOrdersStore } from '@/store/orders.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const ORDER_COMPLETED_LOTTIE = require('@/assets/lottie/order-completed.json');

const TERRACOTTA_COLOR_FILTERS = [
  { keypath: 'Background Circle (Blue)', color: colors.primary },
  { keypath: 'Background(Blue)', color: colors.primary },
  { keypath: 'Glow Mask', color: colors.primaryDark },
  { keypath: 'Tick', color: colors.textInverse },
  { keypath: 'Element 10', color: colors.primary },
  { keypath: 'Element 7', color: colors.primary },
  { keypath: 'Element 8', color: colors.primaryLight },
  { keypath: 'Element 6', color: colors.primaryLight },
  { keypath: 'Element 5', color: colors.primaryLight },
  { keypath: 'Element 9', color: colors.primaryDark },
  { keypath: 'Element 11', color: colors.primaryLight },
  { keypath: 'Element 4', color: colors.primaryDark },
  { keypath: 'Element 3', color: colors.primaryDark },
  { keypath: 'Element 2', color: colors.primary },
  { keypath: 'Element 1', color: colors.primaryLight },
] as const;

export function OrderSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeOrder = useOrdersStore(selectActiveOrder);

  useEffect(() => {
    hapticSuccess();
  }, []);

  function handleTrackOrder() {
    hapticSoftTap();
    if (activeOrder) {
      router.replace(`/order/${activeOrder.id}`);
      return;
    }
    router.replace('/(tabs)/orders');
  }

  function handleGoHome() {
    hapticSoftTap();
    router.replace('/(tabs)');
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
    >
      <Animated.View entering={FadeIn.duration(500)} style={styles.hero}>
        <LottieView
          source={ORDER_COMPLETED_LOTTIE}
          autoPlay
          loop={false}
          speed={1}
          style={styles.lottie}
          colorFilters={[...TERRACOTTA_COLOR_FILTERS]}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(200).duration(450)}
        style={styles.copy}
      >
        <Text style={styles.title}>Your order is placed!</Text>
        <Text style={styles.subtitle}>
          Your chef is firing up the kitchen. We&apos;ll keep you updated every
          step of the way.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(360).duration(450)}
        style={styles.actions}
      >
        <Pressable
          style={styles.primaryBtn}
          onPress={handleTrackOrder}
          accessibilityRole="button"
          accessibilityLabel="Track order"
        >
          <Text style={styles.primaryLabel}>Track order</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryBtn}
          onPress={handleGoHome}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Text style={styles.secondaryLabel}>Back to home</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  hero: {
    alignItems: 'center',
  },
  lottie: {
    width: 240,
    height: 240,
  },
  copy: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  actions: {
    gap: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderCurve: 'continuous',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textInverse,
  },
  secondaryBtn: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.primary,
  },
});
