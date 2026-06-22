import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticAddToCart } from '@/shared/haptics/feedback';
import { addToCart } from '@/store/cart.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type CheckoutUpsellCardProps = {
  dish: RecommendedDish;
  width: number;
};

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

export function CheckoutUpsellCard({ dish, width }: CheckoutUpsellCardProps) {
  const { item, restaurantId, restaurantName } = dish;

  function handleAdd() {
    hapticAddToCart();
    addToCart(item, restaurantId, restaurantName);
  }

  return (
    <View style={[styles.card, shadows.soft, { width }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.body}>
        <PremiumText
          variant="captionMedium"
          numberOfLines={2}
          style={styles.name}
        >
          {item.name}
        </PremiumText>
        <View style={styles.footer}>
          <PremiumText variant="captionMedium" color={colors.textPrimary}>
            {formatPrice(item.price)}
          </PremiumText>
          <Pressable
            onPress={handleAdd}
            style={styles.addBtn}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name}`}
          >
            <AppSymbol name="plus" size={14} tintColor={colors.textInverse} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.backgroundElevated,
    borderCurve: 'continuous',
  },
  image: {
    width: '100%',
    height: 88,
    backgroundColor: colors.backgroundMuted,
  },
  body: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  name: {
    minHeight: 36,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
});
