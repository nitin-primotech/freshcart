import { Pressable, StyleSheet, View } from 'react-native';

import type { SavedAddress } from '@/features/auth/types/location.types';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

type SavedAddressCardProps = {
  address: SavedAddress;
  onPress: () => void;
  onEdit: () => void;
};

export function SavedAddressCard({
  address,
  onPress,
  onEdit,
}: SavedAddressCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        hapticSoftTap();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`Select ${address.label} address`}
    >
      <View style={styles.iconWrap}>
        <AppSymbol name="house.fill" size={18} tintColor={colors.primary} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <PremiumText style={styles.title}>{address.label}</PremiumText>
          {address.isDefault ? (
            <View style={styles.defaultBadge}>
              <PremiumText style={styles.defaultBadgeText}>Default</PremiumText>
            </View>
          ) : null}
        </View>
        <PremiumText style={styles.subtitle} numberOfLines={2}>
          {address.suggestion.line1}, {address.suggestion.line2}
        </PremiumText>
      </View>

      <Pressable
        style={styles.editButton}
        onPress={(event) => {
          event.stopPropagation();
          hapticSoftTap();
          onEdit();
        }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${address.label} address`}
      >
        <AppSymbol
          name="square.and.pencil"
          size={16}
          tintColor={colors.primary}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  title: {
    ...typography.bodyMedium,
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: colors.successLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  defaultBadgeText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
