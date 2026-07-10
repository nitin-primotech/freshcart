import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type {
  MenuItem,
  Restaurant,
} from '@/features/catalog/types/catalog.types';
import { formatInr } from '@/features/checkout/utils/format-currency';
import { hapticAddToCart, hapticSoftTap } from '@/shared/haptics/feedback';
import { addToCart } from '@/store/cart.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

import { productDetailPath } from '../utils/product-path';

type ProductBoughtTogetherProps = {
  restaurant: Restaurant;
  items: MenuItem[];
};

export function ProductBoughtTogether({
  restaurant,
  items,
}: ProductBoughtTogetherProps) {
  const router = useRouter();

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Frequently Bought Together</Text>
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          onPress={() => {
            hapticSoftTap();
            router.push(`/restaurant/${restaurant.id}`);
          }}
        >
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((item, index) => (
          <View key={item.id} style={styles.itemWrap}>
            {index > 0 ? <Text style={styles.plus}>+</Text> : null}
            <Pressable
              style={styles.card}
              onPress={() => {
                hapticSoftTap();
                router.push(productDetailPath(restaurant.id, item.id));
              }}
              accessibilityRole="button"
              accessibilityLabel={item.name}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
              />
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.weight}>
                {item.calories ? `${item.calories} cal` : '1 serving'}
              </Text>
              <Text style={styles.price}>{formatInr(item.price)}</Text>
              <Pressable
                style={styles.addBtn}
                onPress={() => {
                  hapticAddToCart();
                  addToCart(item, restaurant.id, restaurant.name);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Add ${item.name}`}
              >
                <Text style={styles.addText}>Add</Text>
              </Pressable>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  viewAll: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primary,
  },
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  itemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  plus: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.textTertiary,
    marginRight: spacing.xxs,
  },
  card: {
    width: 118,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: 4,
  },
  image: {
    width: '100%',
    height: 72,
    borderRadius: 8,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textPrimary,
    minHeight: 28,
  },
  weight: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textPrimary,
  },
  addBtn: {
    marginTop: 4,
    borderRadius: 8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
});
