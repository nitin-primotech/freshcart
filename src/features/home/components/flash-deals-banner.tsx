import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  deriveDiscountPercent,
  deriveMrp,
  formatUsd,
} from '@/features/checkout/utils/format-currency';
import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type FlashDealsBannerProps = {
  dishes: RecommendedDish[];
};

function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function FlashDealsBanner({ dishes }: FlashDealsBannerProps) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(2 * 3600 + 18 * 60 + 45);
  const items = dishes.slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.banner}>
        <View style={styles.left}>
          <Text style={styles.title}>FLASH DEALS</Text>
          <Text style={styles.subtitle}>Limited time deals on top picks</Text>
          <Text style={styles.timer}>
            Ends in {formatCountdown(secondsLeft)}
          </Text>
          <Pressable
            style={styles.cta}
            onPress={() => router.push('/(tabs)/offers')}
            accessibilityRole="button"
            accessibilityLabel="Shop flash deals"
          >
            <Text style={styles.ctaLabel}>Shop Now</Text>
            <AppSymbol
              name="arrow.right"
              size={12}
              tintColor={colors.textInverse}
              weight="semibold"
            />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealsRow}
        >
          {items.map((dish) => {
            const mrp = deriveMrp(dish.item.price);
            const discount = deriveDiscountPercent(dish.item.price, mrp);

            return (
              <View key={dish.item.id} style={styles.dealCard}>
                {discount > 0 ? (
                  <View style={styles.dealBadge}>
                    <Text style={styles.dealBadgeText}>-{discount}%</Text>
                  </View>
                ) : null}
                <Image
                  source={{ uri: dish.item.image }}
                  style={styles.dealImage}
                  contentFit="contain"
                  transition={200}
                />
                <Text style={styles.dealPrice}>
                  {formatUsd(dish.item.price)}
                </Text>
                {discount > 0 ? (
                  <Text style={styles.dealMrp}>{formatUsd(mrp)}</Text>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  banner: {
    backgroundColor: '#6D28D9',
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    overflow: 'hidden',
  },
  left: {
    width: 148,
    gap: spacing.xxs,
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textInverse,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: 'rgba(255,255,255,0.82)',
  },
  timer: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: '#FDE68A',
    marginTop: spacing.xs,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  ctaLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textInverse,
  },
  dealsRow: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  dealCard: {
    width: 72,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.md,
    borderCurve: 'continuous',
    padding: spacing.xs,
    alignItems: 'center',
    position: 'relative',
  },
  dealBadge: {
    position: 'absolute',
    top: spacing.xxs,
    left: spacing.xxs,
    zIndex: 1,
    backgroundColor: colors.danger,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: radius.full,
  },
  dealBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    lineHeight: 10,
    color: colors.textInverse,
  },
  dealImage: {
    width: 52,
    height: 52,
    marginTop: spacing.sm,
    backgroundColor: 'transparent',
  },
  dealPrice: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 13,
    color: colors.textPrimary,
    marginTop: spacing.xxs,
  },
  dealMrp: {
    fontFamily: fonts.regular,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
});
