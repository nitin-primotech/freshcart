import { Image } from 'expo-image';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CartItem } from '@/features/catalog/types/catalog.types';
import { formatInr } from '@/features/checkout/utils/format-currency';
import { formatOrderId } from '@/features/orders/constants/orders.constants';
import { isHttpImageUrl } from '@/lib/firebase/category-images';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type OrderItemsModalProps = {
  visible: boolean;
  orderId: string;
  items: CartItem[];
  onClose: () => void;
};

export function OrderItemsModal({
  visible,
  orderId,
  items,
  onClose,
}: OrderItemsModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Items in {formatOrderId(orderId)}</Text>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <AppSymbol
                name="xmark.circle.fill"
                size={22}
                tintColor={colors.textTertiary}
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            {items.map((line) => {
              const imageUri = isHttpImageUrl(line.item.image)
                ? line.item.image
                : undefined;
              return (
                <View
                  key={`${line.restaurantId}:${line.item.id}`}
                  style={styles.row}
                >
                  <View style={styles.thumbWrap}>
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.thumb}
                        contentFit="contain"
                        cachePolicy="memory-disk"
                        transition={150}
                      />
                    ) : (
                      <View style={styles.thumbFallback}>
                        <AppSymbol
                          name="bag.fill"
                          size={16}
                          tintColor={colors.textTertiary}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.copy}>
                    <Text style={styles.name} numberOfLines={2}>
                      {line.item.name}
                    </Text>
                    <Text style={styles.meta}>
                      Qty {line.quantity} · {formatInr(line.item.price)} each
                    </Text>
                  </View>
                  <Text style={styles.lineTotal}>
                    {formatInr(line.item.price * line.quantity)}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: '70%',
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderCurve: 'continuous',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  thumbWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.backgroundMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundMuted,
  },
  thumbFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textSecondary,
  },
  lineTotal: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textPrimary,
  },
});
