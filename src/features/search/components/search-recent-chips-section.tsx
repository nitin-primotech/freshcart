import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { clearRecentSearches } from '@/store/app.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type SearchRecentChipsSectionProps = {
  items: string[];
  onSelect: (term: string) => void;
};

export function SearchRecentChipsSection({
  items,
  onSelect,
}: SearchRecentChipsSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Searches</Text>
        <Pressable
          onPress={() => {
            hapticSoftTap();
            clearRecentSearches();
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear all recent searches"
        >
          <Text style={styles.clearAll}>Clear all</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((term) => (
          <Pressable
            key={term}
            style={styles.chip}
            onPress={() => {
              hapticSoftTap();
              onSelect(term);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Search ${term}`}
          >
            <AppSymbol
              name="clock.arrow.circlepath"
              size={12}
              tintColor={colors.textSecondary}
            />
            <Text style={styles.chipText}>{term}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  clearAll: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.primary,
  },
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.backgroundMuted,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textPrimary,
  },
});
