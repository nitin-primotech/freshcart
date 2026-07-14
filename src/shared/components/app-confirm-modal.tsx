import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type AppConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function AppConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  icon,
  destructive = false,
  onConfirm,
  onClose,
}: AppConfirmModalProps) {
  const accentColor = destructive ? colors.danger : colors.primary;
  const iconBackground = destructive ? colors.dangerLight : colors.accent;
  const iconBorderColor = destructive
    ? 'rgba(220, 38, 38, 0.14)'
    : 'rgba(36, 155, 66, 0.14)';

  function handleClose() {
    hapticSoftTap();
    onClose();
  }

  function handleConfirm() {
    hapticSoftTap();
    onConfirm();
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
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: iconBackground,
                  borderColor: iconBorderColor,
                },
              ]}
            >
              <AppSymbol name={icon} size={22} tintColor={accentColor} />
            </View>
          ) : null}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{message}</Text>
          <Pressable
            style={[
              styles.confirmBtn,
              destructive ? styles.confirmBtnDestructive : null,
            ]}
            onPress={handleConfirm}
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
          >
            <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
          </Pressable>
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
    marginBottom: spacing.sm,
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderCurve: 'continuous',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDestructive: {
    backgroundColor: colors.danger,
  },
  confirmBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textInverse,
  },
  cancelBtn: {
    paddingVertical: spacing.xs,
  },
  cancelBtnText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
