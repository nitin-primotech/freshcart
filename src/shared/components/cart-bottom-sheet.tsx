import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  closeCartSheet,
  removeFromCart,
  selectCartItems,
  selectCartSubtotal,
  selectIsSheetOpen,
  updateCartQuantity,
  useCartStore,
} from '@/store/cart.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function CartBottomSheet() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isOpen = useCartStore(selectIsSheetOpen);
  const items = useCartStore(selectCartItems);
  const subtotal = useCartStore(selectCartSubtotal);

  function handleClose() {
    closeCartSheet();
  }

  function adjustQty(id: string, qty: number) {
    hapticSoftTap();
    updateCartQuantity(id, qty);
  }

  function goCheckout() {
    closeCartSheet();
    router.push('/checkout');
  }

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <Animated.View
        entering={SlideInDown.springify().damping(18)}
        style={[
          styles.sheet,
          shadows.card,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
      >
        <View style={styles.handle} />
        <PremiumText variant="h3" style={styles.title}>
          Your order
        </PremiumText>
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.md }}
        >
          {items.map((line) => (
            <Animated.View
              key={line.item.id}
              entering={FadeIn.duration(250)}
              style={styles.line}
            >
              <Image source={{ uri: line.item.image }} style={styles.thumb} />
              <View style={styles.lineBody}>
                <PremiumText variant="bodyMedium" numberOfLines={1}>
                  {line.item.name}
                </PremiumText>
                <PremiumText variant="caption" color={colors.textSecondary}>
                  ${line.item.price.toFixed(2)}
                </PremiumText>
                <View style={styles.stepper}>
                  <Pressable
                    onPress={() => adjustQty(line.item.id, line.quantity - 1)}
                    style={styles.stepBtn}
                  >
                    <AppSymbol
                      name="minus"
                      size={16}
                      tintColor={colors.textPrimary}
                    />
                  </Pressable>
                  <PremiumText variant="bodyMedium">
                    {line.quantity}
                  </PremiumText>
                  <Pressable
                    onPress={() => adjustQty(line.item.id, line.quantity + 1)}
                    style={styles.stepBtn}
                  >
                    <AppSymbol
                      name="plus"
                      size={16}
                      tintColor={colors.textPrimary}
                    />
                  </Pressable>
                </View>
              </View>
              <Pressable onPress={() => removeFromCart(line.item.id)}>
                <AppSymbol
                  name="trash"
                  size={20}
                  tintColor={colors.textTertiary}
                />
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.row}>
            <PremiumText variant="body" color={colors.textSecondary}>
              Subtotal
            </PremiumText>
            <PremiumText variant="price">${subtotal.toFixed(2)}</PremiumText>
          </View>
          <PremiumButton label="Go to checkout" onPress={goCheckout} />
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '75%',
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    borderCurve: 'continuous',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  list: {
    flex: 1,
    marginTop: spacing.md,
  },
  line: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  lineBody: {
    flex: 1,
    gap: spacing.xxs,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: {
    width: 14,
    height: 14,
  },
  trash: {
    width: 18,
    height: 18,
  },
  footer: {
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
