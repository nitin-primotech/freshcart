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
        size={18}
        tintColor={colors.textSecondary}
      />
      <Text style={styles.placeholder} numberOfLines={1}>
        Search 'milk, eggs, fruits...'
      </Text>
      <AppSymbol
        name="barcode.viewfinder"
        size={20}
        tintColor={colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    backgroundColor: colors.backgroundMuted,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: spacing.sm,
    borderCurve: 'continuous',
  },
  placeholder: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textTertiary,
  },
});
