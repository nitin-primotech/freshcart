import { Pressable, StyleSheet, View } from 'react-native';

import { PremiumText } from '@/shared/components/premium-text';
import { hapticSelection } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const FILTERS = [
  { id: 'off', label: 'MIN $100 OFF', accent: true },
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
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  pill: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  pillAccent: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
  },
  pillAccentActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillNeutral: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillNeutralActive: {
    borderColor: colors.primary,
    backgroundColor: colors.accentMuted,
  },
});
