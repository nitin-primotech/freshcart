import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import type { Promo } from '@/features/catalog/types/catalog.types';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const SLIDE_HEIGHT = 128;
const AUTO_ADVANCE_MS = 4500;

const PROMO_DATA = [
  {
    id: 'fresh_produce',
    eyebrowIcon: 'leaf.fill' as const,
    eyebrowText: '100% ORGANIC',
    title: '100% Organic\nFresh Produce',
    subtitle: 'Healthy, handpicked, and naturally delicious',
    ctaText: 'Shop Organic',
    bgImage: require('@/assets/images/banner-slide1.png'),
  },
  {
    id: 'fast_delivery',
    eyebrowIcon: 'bolt.fill' as const,
    eyebrowText: 'EXPRESS DELIVERY',
    title: 'Swift Grocery Delivery\nIn 15–30 mins',
    subtitle: 'Delivered fresh and fast to your door.',
    ctaText: 'Order Now',
    bgImage: require('@/assets/images/banner-slide2.png'),
  },
  {
    id: 'weekend_sale',
    eyebrowIcon: 'tag.fill' as const,
    eyebrowText: 'LIMITED TIME OFFER',
    title: 'Unlock Great\nDaily Discounts!',
    subtitle: 'Save big on your favorite groceries every day',
    ctaText: 'Claim Offer',
    bgImage: require('@/assets/images/banner-slide3.png'),
  },
] as const;

type HomeHeroBannerProps = {
  promos?: Promo[];
};

export function HomeHeroBanner({ promos: _promos }: HomeHeroBannerProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const activeIndexRef = useRef(0);
  const isUserDraggingRef = useRef(false);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const cardWidth = width - spacing.md * 2;

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), PROMO_DATA.length - 1);
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
      scrollRef.current?.scrollTo({ x: clamped * width, animated: true });
    },
    [width],
  );

  const startAutoAdvance = useCallback(() => {
    clearAutoAdvance();
    if (PROMO_DATA.length <= 1) return;
    autoAdvanceTimerRef.current = setInterval(() => {
      if (isUserDraggingRef.current) return;
      const next = (activeIndexRef.current + 1) % PROMO_DATA.length;
      scrollToIndex(next);
    }, AUTO_ADVANCE_MS);
  }, [clearAutoAdvance, scrollToIndex]);

  useEffect(() => {
    startAutoAdvance();
    return clearAutoAdvance;
  }, [clearAutoAdvance, startAutoAdvance]);

  function syncIndexFromOffset(offsetX: number) {
    const index = Math.round(offsetX / width);
    activeIndexRef.current = Math.min(
      Math.max(index, 0),
      PROMO_DATA.length - 1,
    );
    setActiveIndex(activeIndexRef.current);
  }

  function onScrollBeginDrag() {
    isUserDraggingRef.current = true;
    clearAutoAdvance();
  }

  function onScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    syncIndexFromOffset(e.nativeEvent.contentOffset.x);
    isUserDraggingRef.current = false;
    startAutoAdvance();
  }

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
        style={styles.scroller}
      >
        {PROMO_DATA.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            <ImageBackground
              source={slide.bgImage}
              style={[styles.card, { width: cardWidth }]}
              resizeMode="cover"
              imageStyle={{ borderRadius: 14 }}
            >
              <View style={styles.copy}>
                <View style={styles.eyebrow}>
                  <AppSymbol
                    name={slide.eyebrowIcon}
                    size={9}
                    tintColor="#2E7D32"
                    weight="semibold"
                  />
                  <Text style={styles.eyebrowText}>{slide.eyebrowText}</Text>
                </View>

                <Text style={styles.title}>{slide.title}</Text>

                <Text style={styles.subtitle}>{slide.subtitle}</Text>

                <Pressable
                  style={styles.cta}
                  onPress={() => router.push('/(tabs)/categories')}
                  accessibilityRole="button"
                  accessibilityLabel={slide.ctaText}
                >
                  <Text style={styles.ctaLabel}>{slide.ctaText}</Text>
                  <AppSymbol
                    name="arrow.right"
                    size={11}
                    tintColor="#FFFFFF"
                    weight="semibold"
                  />
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {PROMO_DATA.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  scroller: {
    height: SLIDE_HEIGHT,
  },
  slide: {
    height: SLIDE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    height: SLIDE_HEIGHT,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  copy: {
    width: '56%',
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    gap: 2,
    zIndex: 1,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  eyebrowText: {
    fontFamily: fonts.semibold,
    fontSize: 8,
    lineHeight: 10,
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    color: '#1F4A26',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 12,
    color: '#4D5C50',
    marginBottom: spacing.xs,
    marginTop: 2,
  },
  cta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E5C2C',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderCurve: 'continuous',
  },
  ctaLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 13,
    color: '#FFFFFF',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.borderStrong,
  },
  dotActive: {
    width: 14,
    backgroundColor: colors.primary,
  },
});
