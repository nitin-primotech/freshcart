import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { POPULAR_BRANDS } from '@/features/home/constants/popular-brands';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const LOGO_SIZE = 68;

export function HomePopularBrands() {
  const router = useRouter();

  return (
    <View>
      <HomeSectionHeader
        title="Popular Brands"
        onViewAll={() => router.push('/(tabs)/search')}
      />
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {POPULAR_BRANDS.map((brand) => (
          <Pressable
            key={brand.id}
            style={styles.item}
            onPress={() => router.push('/(tabs)/search')}
            accessibilityRole="button"
            accessibilityLabel={brand.name}
          >
            <View style={styles.logoRing}>
              <Image
                source={brand.image}
                style={styles.logo}
                contentFit="contain"
                transition={200}
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  item: {
    alignItems: 'center',
  },
  logoRing: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  logo: {
    width: '88%',
    height: '88%',
  },
});
