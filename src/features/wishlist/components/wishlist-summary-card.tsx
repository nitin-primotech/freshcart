import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppChoiceModal } from '@/shared/components/app-choice-modal';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type WishlistSummaryCardProps = {
  totalCount: number;
  isManaging: boolean;
  onManagePress: () => void;
  onClearPress: () => void;
};

export function WishlistSummaryCard({
  totalCount,
  isManaging,
  onManagePress,
  onClearPress,
}: WishlistSummaryCardProps) {
  const [manageModalVisible, setManageModalVisible] = useState(false);

  function handleManage() {
    hapticSoftTap();
    if (isManaging) {
      onManagePress();
      return;
    }
    setManageModalVisible(true);
  }

  function handleManageChoice(optionId: string) {
    if (optionId === 'edit') {
      onManagePress();
      return;
    }
    if (optionId === 'clear') {
      onClearPress();
    }
  }

  return (
    <>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <AppSymbol name="heart.fill" size={18} tintColor={colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.count}>
            {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
          </Text>
          <Text style={styles.subtitle}>Saved dishes</Text>
        </View>
        <Pressable
          onPress={handleManage}
          style={[styles.manageBtn, isManaging && styles.manageBtnActive]}
          accessibilityRole="button"
          accessibilityLabel={
            isManaging ? 'Done managing wishlist' : 'Manage wishlist'
          }
        >
          <Text
            style={[styles.manageText, isManaging && styles.manageTextActive]}
          >
            {isManaging ? 'Done' : 'Manage'}
          </Text>
        </Pressable>
      </View>

      <AppChoiceModal
        visible={manageModalVisible}
        title="Manage wishlist"
        message="Choose an action"
        icon="heart.fill"
        options={[
          { id: 'edit', label: 'Edit list' },
          { id: 'clear', label: 'Clear all', destructive: true },
        ]}
        onSelect={handleManageChoice}
        onClose={() => setManageModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(212, 84, 60, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.14)',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  count: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  manageBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.backgroundElevated,
  },
  manageBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  manageText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.primary,
  },
  manageTextActive: {
    color: colors.textInverse,
  },
});
