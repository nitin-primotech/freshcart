import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export function OrderSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.lottieWrap}>
        <LottieView
          autoPlay
          loop={false}
          style={styles.lottie}
          source={{
            uri: 'https://assets10.lottiefiles.com/packages/lf20_jbrwo3gt.json',
          }}
        />
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(300).duration(500)}
        style={styles.text}
      >
        <PremiumText variant="display" style={styles.title}>
          Order placed!
        </PremiumText>
        <PremiumText
          variant="body"
          color={colors.textSecondary}
          style={styles.sub}
        >
          Your chef is firing up the kitchen. Track your order in the Orders
          tab.
        </PremiumText>
        <PremiumButton
          label="Track order"
          onPress={() => router.replace('/(tabs)/orders')}
        />
        <PremiumButton
          label="Back to home"
          variant="ghost"
          onPress={() => router.replace('/(tabs)')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.xl,
  },
  lottieWrap: {
    alignItems: 'center',
  },
  lottie: {
    width: 220,
    height: 220,
  },
  text: {
    gap: spacing.md,
    alignItems: 'stretch',
  },
  title: {
    textAlign: 'center',
  },
  sub: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
