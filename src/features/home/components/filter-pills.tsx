import { Pressable, StyleSheet, View } from 'react-native';

import { PremiumText } from '@/shared/components/premium-text';
import { hapticSelection } from '@/shared/haptics/feedback';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const FILTERS = [
  { id: 'off', label: 'MIN $10 OFF', accent: true },
  { id: 'fast', label: '10 MINS DELIVERY', accent: false },
] as const;

type FilterPillsProps = {
  activeId?: string | null;
  onSelect?: (id: string | null) => void;
};

export function FilterPills({ activeId, onSelect }: FilterPillsProps) {
  return (
    <View style={styles.row}>
      {FILTERS.map((f) => {
        const active = activeId === f.id;
        return (
          <Pressable
            key={f.id}
            onPress={() => {
              hapticSelection();
              onSelect?.(active ? null : f.id);
            }}
            style={[
              styles.pill,
              f.accent ? styles.pillAccent : styles.pillNeutral,
              active &&
                (f.accent ? styles.pillAccentActive : styles.pillNeutralActive),
            ]}
          >
            <PremiumText
              variant="label"
              color={
                active
                  ? f.accent
                    ? colors.textInverse
                    : colors.primary
                  : f.accent
                    ? colors.primary
                    : colors.textPrimary
              }
            >
              {f.label}
            </PremiumText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  pill: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  pillAccent: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    ...shadows.soft,
  },
  pillAccentActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillNeutral: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  pillNeutralActive: {
    borderColor: colors.primary,
    backgroundColor: colors.accentMuted,
  },
});
