import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function HomeWelcomePromo() {
  const router = useRouter();

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
          <Text style={styles.title}>Get $10 off on your first order!</Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeLabel}>Use code:</Text>
            <View style={styles.codeBox}>
              <Text style={styles.code}>FRESH10</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.cta}
          onPress={() => router.push('/(tabs)/categories')}
          accessibilityRole="button"
          accessibilityLabel="Shop now with welcome offer"
        >
          <Text style={styles.ctaLabel}>Shop Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
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
    gap: 4,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  codeLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textSecondary,
  },
  codeBox: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  code: {
    fontFamily: fonts.bold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  cta: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: 8,
    borderCurve: 'continuous',
    flexShrink: 0,
  },
  ctaLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 13,
    color: colors.textInverse,
  },
});
