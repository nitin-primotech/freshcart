import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function CategoriesDeliveryPromo() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/home-hero-basket.png')}
          style={styles.basket}
          contentFit="contain"
          transition={200}
        />

        <View style={styles.copy}>
          <Text style={styles.title}>Free Delivery on orders $35+</Text>
          <Text style={styles.subtitle}>
            Shop from 10,000+ products across 50+ categories
          </Text>
          <Pressable
            style={styles.cta}
            onPress={() => router.push('/(tabs)/categories')}
            accessibilityRole="button"
            accessibilityLabel="Shop now"
          >
            <Text style={styles.ctaLabel}>Shop Now</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.closeBtn}
          onPress={() => setDismissed(true)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Dismiss promotion"
        >
          <AppSymbol
            name="xmark.circle.fill"
            size={14}
            tintColor={colors.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  card: {
    backgroundColor: '#E8F5E9',
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  basket: {
    width: 72,
    height: 72,
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 3,
    paddingRight: spacing.lg,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: spacing.xxs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderCurve: 'continuous',
  },
  ctaLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 13,
    color: colors.textInverse,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
