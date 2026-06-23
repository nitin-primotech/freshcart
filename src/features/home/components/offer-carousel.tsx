import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import type { Promo } from '@/features/catalog/types/catalog.types';
import { PremiumText } from '@/shared/components/premium-text';
import { colors, screens, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const FALLBACK_OFFERS: Promo[] = [
  {
    id: 'fallback-1',
    title: '65% OFF',
    subtitle: 'Every 30 mins',
    code: 'RUSH MODE',
    gradient: ['#D4543C', '#8B3A32'],
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
  },
  {
    id: 'fallback-2',
    title: '20% off',
    subtitle: 'First order with code WELCOME20',
    code: 'WELCOME20',
    gradient: ['#C9A962', '#8B6914'],
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  },
  {
    id: 'fallback-3',
    title: 'Free delivery',
    subtitle: 'On orders over $35 this week',
    code: 'RUSHFREE',
    gradient: ['#1C1C1E', '#3D3D42'],
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',
  },
  {
    id: 'fallback-4',
    title: 'Weekend special',
    subtitle: 'Flat 30% off tonight',
    code: 'WEEKEND',
    gradient: ['#D4543C', '#8B3A32'],
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
  },
  {
    id: 'fallback-5',
    title: 'New user deal',
    subtitle: 'Extra $10 off your first order',
    code: 'NEW10',
    gradient: ['#C9A962', '#8B6914'],
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80',
  },
];

const SLIDE_HEIGHT = 176;
const AUTO_ADVANCE_MS = 4000;

type OfferCarouselProps = {
  promos?: Promo[];
};

export function OfferCarousel({ promos }: OfferCarouselProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const activeIndexRef = useRef(0);
  const isUserDraggingRef = useRef(false);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const items = (promos?.length ? promos : FALLBACK_OFFERS).slice(0, 5);
  const cardWidth = width - spacing.lg * 2;

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), items.length - 1);
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
      scrollRef.current?.scrollTo({ x: clamped * width, animated: true });
    },
    [items.length, width],
  );

  const startAutoAdvance = useCallback(() => {
    clearAutoAdvance();
    autoAdvanceTimerRef.current = setInterval(() => {
      if (isUserDraggingRef.current || items.length <= 1) {
        return;
      }
      const next = (activeIndexRef.current + 1) % items.length;
      scrollToIndex(next);
    }, AUTO_ADVANCE_MS);
  }, [clearAutoAdvance, items.length, scrollToIndex]);

  useEffect(() => {
    startAutoAdvance();
    return clearAutoAdvance;
  }, [clearAutoAdvance, startAutoAdvance]);

  function syncIndexFromOffset(offsetX: number) {
    const index = Math.round(offsetX / width);
    const clamped = Math.min(Math.max(index, 0), items.length - 1);
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
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
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
        style={styles.scroller}
        contentContainerStyle={styles.scrollerContent}
      >
        {items.map((item) => (
          <View key={item.id} style={[styles.slide, { width }]}>
            <View style={[styles.card, shadows.card, { width: cardWidth }]}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
                transition={200}
                recyclingKey={item.id}
              />
              <LinearGradient
                colors={['transparent', screens.restaurant.heroGradient[1]]}
                locations={[0.35, 1]}
                style={styles.gradient}
              />
              <View style={styles.content}>
                <View style={styles.codeBadge}>
                  <PremiumText
                    variant="captionMedium"
                    color={colors.textPrimary}
                  >
                    {item.code}
                  </PremiumText>
                </View>
                <PremiumText variant="h3" color={colors.textInverse}>
                  {item.title}
                </PremiumText>
                <PremiumText
                  variant="bodySmall"
                  color={colors.textOnDarkMuted}
                  numberOfLines={1}
                >
                  {item.subtitle}
                </PremiumText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {items.map((item, index) => (
          <View key={item.id} style={styles.dotTrack}>
            <View
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xxs,
  },
  scroller: {
    height: SLIDE_HEIGHT,
  },
  scrollerContent: {
    alignItems: 'center',
  },
  slide: {
    height: SLIDE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    height: SLIDE_HEIGHT,
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {},
  content: {
    justifyContent: 'flex-end',
    padding: spacing.lg,
    gap: spacing.xxs,
  },
  codeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
    marginBottom: spacing.xxs,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xxs,
  },
  dotTrack: {
    width: 18,
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.borderStrong,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.textPrimary,
  },
});
