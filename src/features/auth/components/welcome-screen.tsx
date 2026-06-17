import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PremiumText } from '@/shared/components/premium-text';
import { setOnboardingStep } from '@/store/app.store';
import { colors, gradients } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const STATS = [
  { value: '2M+', label: 'Happy foodies' },
  { value: '50K+', label: 'Orders daily' },
  { value: '120+', label: 'Cities served' },
] as const;

const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
  'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
];

export function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={gradients.primary.colors}
      start={gradients.primary.start}
      end={gradients.primary.end}
      style={styles.root}
    >
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <PremiumText variant="h3" color={colors.primary}>
              FR
            </PremiumText>
          </View>
          <PremiumText variant="h2" color={colors.textInverse}>
            foodRush
          </PremiumText>
        </View>
        <Pressable
          onPress={() => router.push('/(auth)/phone')}
          style={styles.skipBtn}
        >
          <PremiumText variant="captionMedium" color={colors.textInverse}>
            Log in
          </PremiumText>
        </Pressable>
      </View>

      <View style={styles.cards}>
        {CARD_IMAGES.map((uri, i) => (
          <Animated.View
            key={uri}
            entering={FadeInUp.delay(i * 120).duration(500)}
            style={[
              styles.card,
              i === 0 && styles.cardLeft,
              i === 1 && styles.cardCenter,
              i === 2 && styles.cardRight,
            ]}
          >
            <Image
              source={{ uri }}
              style={styles.cardImage}
              contentFit="cover"
            />
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInDown.delay(300).duration(500)}>
        <PremiumText
          variant="h1"
          color={colors.textInverse}
          style={styles.tagline}
        >
          One app for food, grocery, dining & more — in minutes
        </PremiumText>
      </Animated.View>

      <View style={styles.statsBox}>
        {STATS.map((stat, i) => (
          <View key={stat.label} style={styles.statCol}>
            {i > 0 ? <View style={styles.statDivider} /> : null}
            <PremiumText variant="h3" color={colors.textInverse}>
              {stat.value}
            </PremiumText>
            <PremiumText variant="caption" color={colors.textInverse}>
              {stat.label}
            </PremiumText>
          </View>
        ))}
      </View>

      <Pressable
        style={[styles.cta, { marginBottom: insets.bottom + spacing.lg }]}
        onPress={() => {
          setOnboardingStep('phone');
          router.push('/(auth)/phone' as Href);
        }}
      >
        <PremiumText variant="bodyMedium" color={colors.primary}>
          Get started
        </PremiumText>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cards: {
    height: 220,
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: 120,
    height: 170,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.textInverse,
    borderCurve: 'continuous',
  },
  cardLeft: {
    transform: [{ rotate: '-12deg' }, { translateX: -70 }],
  },
  cardCenter: {
    width: 140,
    height: 190,
    zIndex: 2,
  },
  cardRight: {
    transform: [{ rotate: '12deg' }, { translateX: 70 }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    lineHeight: 34,
  },
  statsBox: {
    flexDirection: 'row',
    marginTop: spacing.xxl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingVertical: spacing.lg,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  statDivider: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  cta: {
    marginTop: 'auto',
    backgroundColor: colors.textInverse,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
