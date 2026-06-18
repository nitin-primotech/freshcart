import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import type { RecommendedDish } from '@/features/home/utils/get-recommended-dishes';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticPrimaryAction } from '@/shared/haptics/feedback';
import { addToCart } from '@/store/cart.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type RecommendedDishCardProps = {
  dish: RecommendedDish;
  width: number;
};

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function RecommendedDishCard({ dish, width }: RecommendedDishCardProps) {
  const { item, restaurantId, restaurantName, rating } = dish;

  function handleAdd() {
    hapticPrimaryAction();
    addToCart(item, restaurantId, restaurantName);
  }

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.imageWrap}>
        <Link href={`/restaurant/${restaurantId}`} asChild>
          <Pressable style={styles.imagePress}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          </Pressable>
        </Link>
        <Pressable
          style={styles.addBtn}
          onPress={handleAdd}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Add ${item.name} to cart`}
        >
          <AppSymbol name="plus" size={16} tintColor={colors.textInverse} />
        </Pressable>
      </View>

      <View style={styles.titleRow}>
        <PremiumText
          variant="bodyMedium"
          color={colors.textPrimary}
          numberOfLines={1}
          style={styles.title}
        >
          {item.name}
        </PremiumText>
        <View style={styles.rating}>
          <AppSymbol name="star.fill" size={12} tintColor={colors.star} />
          <PremiumText variant="captionMedium" color={colors.textPrimary}>
            {rating.toFixed(1)}
          </PremiumText>
        </View>
      </View>

      <PremiumText
        variant="bodySmall"
        color={colors.textSecondary}
        numberOfLines={2}
        style={styles.description}
      >
        {item.description}
      </PremiumText>

      <PremiumText variant="price" color={colors.textPrimary}>
        {formatPrice(item.price)}
      </PremiumText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: spacing.md,
  },
  imageWrap: {
    width: '100%',
    height: 140,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundMuted,
    borderCurve: 'continuous',
    ...shadows.soft,
  },
  imagePress: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xxs,
  },
  title: {
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  description: {
    marginBottom: spacing.xs,
    minHeight: 44,
  },
});
