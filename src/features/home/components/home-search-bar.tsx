import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function HomeSearchBar() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.search}
      onPress={() => router.push('/(tabs)/search')}
      accessibilityRole="button"
      accessibilityLabel="Search for products, brands and more"
    >
      <AppSymbol
        name="magnifyingglass"
        size={18}
        tintColor={colors.textPrimary}
      />
      <Text style={styles.placeholder} numberOfLines={1}>
        Search for products, brands and more...
      </Text>
      <AppSymbol
        name="qrcode.viewfinder"
        size={20}
        tintColor={colors.textPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    gap: spacing.sm,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholder: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textTertiary,
  },
});
