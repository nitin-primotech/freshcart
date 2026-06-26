import { Image } from 'expo-image';
import { type Href, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  WELCOME_FEATURES,
  WELCOME_GALLERY,
} from '@/features/auth/constants/welcome.constants';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticPressIn, hapticPrimaryAction } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

function SpeedLines() {
  return (
    <View style={styles.speedLines} pointerEvents="none">
      {[0, 1, 2].map((index) => (
        <View
          key={`speed-${index}`}
          style={[styles.speedLine, { opacity: 1 - index * 0.22 }]}
        />
      ))}
    </View>
  );
}

function LeafAccent({ side }: { side: 'left' | 'right' }) {
  return (
    <View
      style={[
        styles.leafAccent,
        side === 'left' ? styles.leafLeft : styles.leafRight,
      ]}
      pointerEvents="none"
    >
      <AppSymbol name="leaf.fill" size={72} tintColor={colors.success} />
    </View>
  );
}

function FoodGallery() {
  return (
    <View style={styles.gallery}>
      {WELCOME_GALLERY.map((card) => (
        <View
          key={card.layout}
          style={[
            styles.galleryCard,
            card.layout === 'left' && styles.galleryCardLeft,
            card.layout === 'center' && styles.galleryCardCenter,
            card.layout === 'right' && styles.galleryCardRight,
            { boxShadow: card.glow, transform: [{ rotate: card.rotate }] },
          ]}
        >
          <View style={styles.galleryImageFrame}>
            <Image
              source={card.source}
              style={styles.galleryImage}
              contentFit="contain"
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function FeaturePills() {
  return (
    <View style={styles.featureRow}>
      {WELCOME_FEATURES.map((feature) => (
        <View key={feature.label} style={styles.featurePill}>
          <AppSymbol
            name={feature.icon}
            size={14}
            tintColor={
              feature.tint === 'success' ? colors.success : colors.primary
            }
          />
          <Text style={styles.featureLabel} numberOfLines={2}>
            {feature.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function handleGetStarted() {
    hapticPrimaryAction();
    router.push('/(auth)/phone' as Href);
  }

  return (
    <View style={styles.root}>
      <LeafAccent side="left" />
      <LeafAccent side="right" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.md },
        ]}
      >
        <Image
          source={require('@/assets/images/foodrushlogo.png')}
          style={styles.logo}
          contentFit="contain"
        />

        <View style={styles.headlineWrap}>
          <Text style={styles.headline}>
            Good food,{'\n'}
            <Text style={styles.headlineAccent}>delivered fast</Text>
          </Text>
          <SpeedLines />
        </View>

        <Text style={styles.subheadline}>
          Your favorite restaurant food, rushed to your door
        </Text>

        <FoodGallery />
        <FeaturePills />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) },
        ]}
      >
        <Pressable
          onPress={handleGetStarted}
          onPressIn={hapticPressIn}
          style={styles.cta}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <Text style={styles.ctaLabel}>Get Started</Text>
          <View style={styles.ctaArrow}>
            <AppSymbol
              name="chevron.right"
              size={14}
              tintColor={colors.primary}
            />
          </View>
        </Pressable>

        <Text style={styles.legal}>
          By continuing, you agree to our{' '}
          <Text
            style={styles.legalLink}
            onPress={() => router.push('/(auth)/terms')}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={styles.legalLink}
            onPress={() => router.push('/(auth)/privacy')}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  leafAccent: {
    position: 'absolute',
    top: spacing.xl,
    opacity: 0.1,
    zIndex: 0,
  },
  leafLeft: {
    left: -spacing.lg,
    transform: [{ rotate: '-24deg' }],
  },
  leafRight: {
    right: -spacing.lg,
    transform: [{ rotate: '24deg' }, { scaleX: -1 }],
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
    gap: spacing.lg,
  },
  logo: {
    width: 96,
    height: 96,
  },
  headlineWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: spacing.xs,
    maxWidth: '100%',
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 38,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headlineAccent: {
    color: colors.primary,
  },
  speedLines: {
    marginTop: spacing.sm,
    gap: 3,
    transform: [{ rotate: '-28deg' }],
  },
  speedLine: {
    width: 14,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  subheadline: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    marginTop: -spacing.sm,
  },
  gallery: {
    alignSelf: 'center',
    width: 320,
    height: 220,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    overflow: 'visible',
  },
  galleryCard: {
    position: 'absolute',
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    padding: spacing.xs,
    boxShadow: '0 4px 16px rgba(28, 28, 30, 0.06)',
  },
  galleryCardLeft: {
    left: 0,
    top: spacing.lg,
    width: 118,
    height: 162,
    zIndex: 1,
  },
  galleryCardCenter: {
    left: 92,
    top: 0,
    width: 136,
    height: 188,
    zIndex: 3,
  },
  galleryCardRight: {
    right: 0,
    top: spacing.lg,
    width: 118,
    height: 162,
    zIndex: 2,
  },
  galleryImageFrame: {
    flex: 1,
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.backgroundElevated,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    width: '100%',
  },
  featurePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    boxShadow: '0 4px 16px rgba(28, 28, 30, 0.06)',
  },
  featureLabel: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 9,
    lineHeight: 12,
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  cta: {
    minHeight: 54,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    boxShadow: '0 8px 24px rgba(212, 84, 60, 0.28)',
  },
  ctaLabel: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    lineHeight: 22,
    color: colors.textInverse,
  },
  ctaArrow: {
    position: 'absolute',
    right: spacing.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legal: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  legalLink: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});
