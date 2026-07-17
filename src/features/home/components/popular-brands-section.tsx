import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { POPULAR_BRANDS } from '@/features/home/constants/popular-brands';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type PopularBrandsSectionProps = {
  title?: string;
  cardWidth?: number;
  logoSize?: number;
  rowGap?: number;
};

export function PopularBrandsSection({
  title = 'Shop by Brands',
  cardWidth = 64,
  logoSize = 52,
  rowGap = spacing.sm,
}: PopularBrandsSectionProps) {
  const router = useRouter();

  function openBrand(searchQuery: string) {
    hapticSoftTap();
    router.push({
      pathname: '/search',
      params: { q: searchQuery },
    });
  }

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title={title} href="/(tabs)/categories" />
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.row, { gap: rowGap }]}
      >
        {POPULAR_BRANDS.map((brand) => (
          <Pressable
            key={brand.id}
            style={[styles.card, { width: cardWidth }]}
            onPress={() => openBrand(brand.searchQuery)}
            accessibilityRole="button"
            accessibilityLabel={`Shop ${brand.name}`}
          >
            <View
              style={[
                styles.logoWrap,
                {
                  width: logoSize,
                  height: logoSize,
                  borderRadius: logoSize / 2,
                },
              ]}
            >
              <Image
                source={brand.image}
                style={styles.logo}
                contentFit="contain"
                transition={200}
              />
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {brand.name}
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
  },
  card: {
    alignItems: 'center',
    gap: 4,
  },
  logoWrap: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    overflow: 'hidden',
  },
  logo: {
    width: 36,
    height: 36,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
