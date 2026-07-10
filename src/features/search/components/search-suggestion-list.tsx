import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SearchSuggestion } from '@/features/search/utils/search-suggestions';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type SearchSuggestionListProps = {
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: SearchSuggestion) => void;
};

export function SearchSuggestionList({
  suggestions,
  onSelect,
}: SearchSuggestionListProps) {
  if (suggestions.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Suggestions</Text>
      {suggestions.map((suggestion, index) => (
        <Pressable
          key={suggestion.id}
          onPress={() => onSelect(suggestion)}
          style={[
            styles.row,
            index < suggestions.length - 1 && styles.rowBorder,
          ]}
          accessibilityRole="button"
          accessibilityLabel={suggestion.label}
        >
          <View style={styles.iconWrap}>
            <AppSymbol
              name={suggestion.icon}
              size={15}
              tintColor={colors.primary}
            />
          </View>
          <View style={styles.copy}>
            <Text style={styles.label}>{suggestion.label}</Text>
            {suggestion.subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {suggestion.subtitle}
              </Text>
            ) : null}
          </View>
          <AppSymbol
            name="chevron.right"
            size={12}
            tintColor={colors.textTertiary}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
});
