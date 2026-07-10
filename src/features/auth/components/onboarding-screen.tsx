import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  type FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { ONBOARDING_SLIDES } from '@/constants/brand-assets';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticPrimaryAction, hapticSoftTap } from '@/shared/haptics/feedback';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type OnboardingSlide = {
  key: string;
  image: number;
  title: string;
  titleAccent: string;
  subtitle: string;
};

const SLIDES: OnboardingSlide[] = [
  {
    key: 'fresh',
    image: ONBOARDING_SLIDES[0],
    title: 'Everything fresh',
    titleAccent: 'starts here',
    subtitle:
      'Create your account and start shopping the best groceries, handpicked and delivered to your doorstep.',
  },
  {
    key: 'browse',
    image: ONBOARDING_SLIDES[1],
    title: 'Everything you need,',
    titleAccent: 'all in one place',
    subtitle:
      'Browse thousands of groceries from trusted stores with easy search and organized categories.',
  },
  {
    key: 'delivery',
    image: ONBOARDING_SLIDES[2],
    title: 'Fast delivery',
    titleAccent: 'you can count on',
    subtitle:
      'Track your order in real time and enjoy reliable delivery whenever you need it.',
  },
];

function AccentUnderline({ width }: { width: number }) {
  return (
    <Svg width={width} height={10} viewBox={`0 0 ${width} 10`} fill="none">
      <Path
        d={`M2 7 C ${width * 0.28} 2, ${width * 0.72} 2, ${width - 2} 7`}
        stroke={colors.brandGreen}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Soft mint footer with a U-shaped top edge (high on sides, scooped in center). */
function MintUCurve({ width, height }: { width: number; height: number }) {
  const scoop = Math.min(height * 0.58, 130);
  const path = [
    `M0 0`,
    `C ${width * 0.2} ${scoop}, ${width * 0.8} ${scoop}, ${width} 0`,
    `L ${width} ${height}`,
    `L 0 ${height}`,
    'Z',
  ].join(' ');

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={StyleSheet.absoluteFill}
    >
      <Path d={path} fill={colors.onboardingCurve} />
    </Svg>
  );
}

export function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height: windowHeight } = useWindowDimensions();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [index, setIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const isNavigatingRef = useRef(false);

  const heroHeight = Math.min(width * (490 / 402), windowHeight * 0.46);
  const isLast = index === SLIDES.length - 1;
  const isFirst = index === 0;
  const curveHeight = 180 + insets.bottom;
  const lastSlideStartX = (SLIDES.length - 2) * width;
  const lastSlideEndX = (SLIDES.length - 1) * width;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const navActionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [lastSlideStartX, lastSlideEndX],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const getStartedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [lastSlideStartX, lastSlideEndX],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const trustStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [lastSlideStartX, lastSlideEndX],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  function finishOnboarding() {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    hapticPrimaryAction();
    router.replace('/login');
  }

  function scrollToIndex(nextIndex: number) {
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setIndex(nextIndex);
  }

  function goNext() {
    if (isLast) {
      finishOnboarding();
      return;
    }
    hapticSoftTap();
    scrollToIndex(index + 1);
  }

  function goBack() {
    if (isFirst) return;
    hapticSoftTap();
    scrollToIndex(index - 1);
  }

  function onMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (nextIndex !== index && nextIndex >= 0 && nextIndex < SLIDES.length) {
      setIndex(nextIndex);
      hapticSoftTap();
    }
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View
        pointerEvents="none"
        style={[styles.curveWrap, { height: curveHeight }]}
      >
        <MintUCurve width={width} height={curveHeight} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => {
            hapticSoftTap();
            finishOnboarding();
          }}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>

      <Animated.FlatList
        ref={listRef}
        style={styles.list}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, itemIndex) => ({
          length: width,
          offset: width * itemIndex,
          index: itemIndex,
        })}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.hero, { height: heroHeight }]}>
              <Image
                source={item.image}
                style={styles.heroImage}
                contentFit="contain"
                contentPosition="top"
                cachePolicy="memory-disk"
              />
            </View>

            <View style={styles.copy}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.accentBlock}>
                <Text style={styles.titleAccent}>{item.titleAccent}</Text>
                <AccentUnderline width={Math.min(width * 0.52, 220)} />
              </View>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom + spacing.xs, spacing.xxl),
          },
        ]}
      >
        <View style={styles.dots}>
          {SLIDES.map((item, dotIndex) => (
            <View
              key={item.key}
              style={[styles.dot, dotIndex === index && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.actionsSlot}>
          <Animated.View
            pointerEvents={isLast ? 'none' : 'box-none'}
            style={[styles.actionsLayer, navActionStyle]}
          >
            <View style={styles.navRow}>
              <Pressable
                onPress={goBack}
                disabled={isFirst || isLast}
                style={[styles.backSide, isFirst && styles.navDisabled]}
                accessibilityRole="button"
                accessibilityLabel="Previous slide"
              >
                <View style={styles.navBtn}>
                  <AppSymbol
                    name="chevron.left"
                    size={18}
                    tintColor={
                      isFirst ? colors.textTertiary : colors.brandGreen
                    }
                  />
                </View>
                <Text
                  style={[styles.navLabel, isFirst && styles.navLabelDisabled]}
                >
                  Back
                </Text>
              </Pressable>

              <Pressable
                onPress={goNext}
                disabled={isLast}
                style={styles.nextSide}
                accessibilityRole="button"
                accessibilityLabel="Next slide"
              >
                <Text style={styles.navLabel}>Next</Text>
                <View style={styles.navBtn}>
                  <AppSymbol
                    name="chevron.right"
                    size={18}
                    tintColor={colors.brandGreen}
                  />
                </View>
              </Pressable>
            </View>
          </Animated.View>

          <Animated.View
            pointerEvents={isLast ? 'box-none' : 'none'}
            style={[styles.actionsLayer, getStartedStyle]}
          >
            <Pressable
              onPress={finishOnboarding}
              disabled={!isLast}
              style={styles.getStartedBtn}
              accessibilityRole="button"
              accessibilityLabel="Get Started"
            >
              <LinearGradient
                colors={[colors.brandGreen, colors.brandGreenDark]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.getStartedFill}
              >
                <Text style={styles.getStartedLabel}>Get Started</Text>
                <View style={styles.getStartedArrow}>
                  <AppSymbol
                    name="arrow.right"
                    size={22}
                    tintColor={colors.textInverse}
                  />
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        <Animated.View
          pointerEvents="none"
          style={[styles.trustRow, trustStyle]}
        >
          <AppSymbol
            name="checkmark.circle.fill"
            size={14}
            tintColor={colors.brandGreen}
          />
          <Text style={styles.trustText}>Secure • Fast • Reliable</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  curveWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xs,
    zIndex: 2,
  },
  skip: {
    fontFamily: fonts.poppinsSemibold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.brandGreen,
  },
  list: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  hero: {
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  copy: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  title: {
    fontFamily: fonts.poppinsBold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.onboardingTitle,
    textAlign: 'center',
  },
  accentBlock: {
    alignItems: 'center',
    marginTop: 2,
  },
  titleAccent: {
    fontFamily: fonts.poppinsBold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.brandGreen,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.onboardingBody,
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    zIndex: 2,
  },
  actionsSlot: {
    height: 56,
    justifyContent: 'center',
  },
  actionsLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.onboardingDot,
  },
  dotActive: {
    backgroundColor: colors.brandGreen,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  backSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 110,
  },
  nextSide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    minWidth: 110,
  },
  navDisabled: {
    opacity: 0.4,
  },
  navLabel: {
    fontFamily: fonts.poppinsSemibold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.onboardingTitle,
  },
  navLabelDisabled: {
    color: colors.textTertiary,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...shadows.soft,
  },
  getStartedBtn: {
    width: '100%',
    borderRadius: radius.full,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  getStartedFill: {
    width: '100%',
    minHeight: 56,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedLabel: {
    fontFamily: fonts.poppinsSemibold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textInverse,
  },
  getStartedArrow: {
    position: 'absolute',
    right: spacing.lg,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 18,
    marginTop: -spacing.xs,
  },
  trustText: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.onboardingBody,
  },
});
