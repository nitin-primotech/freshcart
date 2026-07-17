import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export type AppChoiceOption = {
  id: string;
  label: string;
  destructive?: boolean;
};

type AppChoiceModalProps = {
  visible: boolean;
  title: string;
  message?: string;
  options: AppChoiceOption[];
  cancelLabel?: string;
  icon?: string;
  onSelect: (optionId: string) => void;
  onClose: () => void;
};

export function AppChoiceModal({
  visible,
  title,
  message,
  options,
  cancelLabel = 'Cancel',
  icon,
  onSelect,
  onClose,
}: AppChoiceModalProps) {
  function handleClose() {
    hapticSoftTap();
    onClose();
  }

  function handleSelect(optionId: string) {
    hapticSoftTap();
    onSelect(optionId);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable
          style={styles.card}
          onPress={(event) => event.stopPropagation()}
        >
          {icon ? (
            <View style={styles.iconWrap}>
              <AppSymbol name={icon} size={22} tintColor={colors.primary} />
            </View>
          ) : null}
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.subtitle}>{message}</Text> : null}
          <View style={styles.options}>
            {options.map((option, index) => (
              <Pressable
                key={option.id}
                onPress={() => handleSelect(option.id)}
                style={[
                  styles.option,
                  index < options.length - 1 && styles.optionBorder,
                ]}
                accessibilityRole="button"
                accessibilityLabel={option.label}
              >
                <Text
                  style={[
                    styles.optionText,
                    option.destructive && styles.optionTextDestructive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            style={styles.cancelBtn}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
          >
            <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderCurve: 'continuous',
    backgroundColor: colors.accent,
    borderColor: 'rgba(36, 155, 66, 0.14)',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 21,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  options: {
    width: '100%',
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginTop: spacing.xxs,
  },
  option: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.backgroundMuted,
  },
  optionBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  optionText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.primary,
  },
  optionTextDestructive: {
    color: colors.danger,
  },
  cancelBtn: {
    paddingVertical: spacing.xs,
    marginTop: spacing.xxs,
  },
  cancelBtnText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
