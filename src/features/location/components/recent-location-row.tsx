import { Pressable, StyleSheet, View } from 'react-native';

import type { LocationSuggestion } from '@/features/auth/types/location.types';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

type RecentLocationRowProps = {
  location: LocationSuggestion;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  isLast?: boolean;
};

export function RecentLocationRow({
  location,
  isFavorite,
  onPress,
  onToggleFavorite,
  isLast = false,
}: RecentLocationRowProps) {
  return (
    <Pressable
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={() => {
        hapticSoftTap();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`Select ${location.title}`}
    >
      <View style={styles.iconWrap}>
        <AppSymbol
          name="clock.arrow.circlepath"
          size={18}
          tintColor={colors.primary}
        />
      </View>

      <View style={styles.body}>
        <PremiumText style={styles.title}>{location.title}</PremiumText>
        <PremiumText style={styles.subtitle} numberOfLines={1}>
          {location.subtitle}
        </PremiumText>
      </View>

      <Pressable
        style={styles.favoriteButton}
        onPress={(event) => {
          event.stopPropagation();
          hapticSoftTap();
          onToggleFavorite();
        }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite
            ? `Remove ${location.title} from favorites`
            : `Save ${location.title} as favorite`
        }
      >
        <AppSymbol
          name={isFavorite ? 'star.fill' : 'star'}
          size={18}
          tintColor={isFavorite ? colors.star : colors.textTertiary}
        />
      </Pressable>

      <AppSymbol
        name="chevron.right"
        size={14}
        tintColor={colors.textTertiary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.bodyMedium,
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
