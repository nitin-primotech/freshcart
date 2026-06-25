import { useRouter } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  closeEmptyCartPrompt,
  selectIsEmptyPromptOpen,
  useCartStore,
} from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function EmptyCartPrompt() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isOpen = useCartStore(selectIsEmptyPromptOpen);

  function handleClose() {
    closeEmptyCartPrompt();
  }

  function handleBrowse() {
    hapticSoftTap();
    closeEmptyCartPrompt();
    router.push('/(tabs)');
  }

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable
          style={[styles.card, { marginBottom: insets.bottom + spacing.lg }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.iconWrap}>
            <AppSymbol name="cart" size={22} tintColor={colors.primary} />
          </View>
          <Text style={styles.title}>Your cart is empty</Text>
          <Text style={styles.subtitle}>
            Please add something delicious before checking out.
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={handleBrowse}
            accessibilityRole="button"
          >
            <Text style={styles.primaryBtnText}>Browse menu</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryBtn}
            onPress={handleClose}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryBtnText}>Close</Text>
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
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
  },
  card: {
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
    backgroundColor: 'rgba(212, 84, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
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
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderCurve: 'continuous',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.textInverse,
  },
  secondaryBtn: {
    paddingVertical: spacing.xs,
  },
  secondaryBtnText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
