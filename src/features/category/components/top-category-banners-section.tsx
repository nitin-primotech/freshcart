import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TOP_CATEGORY_BANNERS } from '@/features/category/constants/categories-hub.constants';
import { categoryPath } from '@/features/category/utils/category-path';
import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function TopCategoryBannersSection() {
  const router = useRouter();
  const cardWidth = useCarouselItemWidth({
    visibleCount: 1.35,
    peek: 0.08,
    gap: spacing.sm,
    paddingStart: spacing.md,
    paddingEnd: spacing.md,
  });

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title="Top Categories" />
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {TOP_CATEGORY_BANNERS.map((banner) => (
          <Pressable
            key={banner.id}
            style={[
              styles.card,
              { width: cardWidth, backgroundColor: banner.backgroundColor },
            ]}
            onPress={() => {
              hapticSoftTap();
              router.push(categoryPath(banner.categoryId));
            }}
            accessibilityRole="button"
            accessibilityLabel={`${banner.title}. ${banner.subtitle}`}
          >
            <View style={styles.copy}>
              <Text style={[styles.title, { color: banner.accentColor }]}>
                {banner.title}
              </Text>
              <Text style={styles.subtitle}>{banner.subtitle}</Text>
              <View style={styles.linkRow}>
                <Text style={[styles.link, { color: banner.accentColor }]}>
                  Shop Now
                </Text>
                <AppSymbol
                  name="arrow.right"
                  size={11}
                  tintColor={banner.accentColor}
                  weight="semibold"
                />
              </View>
            </View>
            <Image
              source={{ uri: banner.image }}
              style={styles.art}
              contentFit="contain"
              transition={200}
            />
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
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    gap: spacing.sm,
  },
  card: {
    height: 108,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    zIndex: 1,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 17,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  link: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 13,
  },
  art: {
    width: 88,
    height: 88,
    flexShrink: 0,
  },
});
