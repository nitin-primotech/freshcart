import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DIET_LIFESTYLE_ITEMS } from '@/features/category/constants/categories-hub.constants';
import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function DietLifestyleSection() {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title="Shop by Diet & Lifestyle" />
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {DIET_LIFESTYLE_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            style={styles.item}
            onPress={() => router.push(item.href)}
            accessibilityRole="button"
            accessibilityLabel={item.name}
          >
            <View style={styles.iconCircle}>
              <AppSymbol
                name={item.icon}
                size={20}
                tintColor={colors.primary}
              />
            </View>
            <Text style={styles.label} numberOfLines={2}>
              {item.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
  },
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  item: {
    width: 72,
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textPrimary,
    textAlign: 'center',
    minHeight: 24,
  },
});
