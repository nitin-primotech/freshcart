import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function AppFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.slogan} numberOfLines={2}>
        Freshness delivered in minutes ⚡
      </Text>
      <View style={styles.divider} />
      <Text style={styles.brand}>freshcart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'transparent',
    width: '100%',
  },
  slogan: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 34,
    color: colors.borderStrong,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  divider: {
    width: '85%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
    marginVertical: spacing.xs,
  },
  brand: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.textTertiary,
    textTransform: 'lowercase',
    letterSpacing: -0.5,
  },
});
