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
      accessibilityLabel="Search groceries"
    >
      <AppSymbol
        name="magnifyingglass"
        size={16}
        tintColor={colors.textSecondary}
      />
      <Text style={styles.placeholder} numberOfLines={1}>
        Search 'milk, eggs, fruits...'
      </Text>
      <AppSymbol
        name="qrcode.viewfinder"
        size={18}
        tintColor={colors.primary}
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
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 9,
    gap: spacing.xs,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 40,
  },
  placeholder: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textTertiary,
  },
});
