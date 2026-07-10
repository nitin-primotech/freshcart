import { useCallback, useMemo } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchCategories } from '@/features/catalog/api/catalog.api';
import type { Category } from '@/features/catalog/types/catalog.types';
import { CategoriesDeliveryPromo } from '@/features/category/components/categories-delivery-promo';
import { CategoryGridTile } from '@/features/category/components/category-grid-tile';
import { DietLifestyleSection } from '@/features/category/components/diet-lifestyle-section';
import { TopCategoryBannersSection } from '@/features/category/components/top-category-banners-section';
import { HomeHeader } from '@/features/home/components/home-header';
import { HomeSearchBar } from '@/features/home/components/home-search-bar';
import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { ErrorState } from '@/shared/components/error-state';
import { Shimmer } from '@/shared/components/shimmer';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';

const GRID_COLUMNS = 4;
const GRID_GAP = 12;

const SECTIONS = [
  {
    title: 'Grocery & Kitchen',
    categoryIds: [
      'cat-fruits-veg',
      'cat-dairy-eggs',
      'cat-bakery',
      'cat-meat-seafood',
      'cat-pantry',
      'cat-canned',
      'cat-organic',
      'cat-gluten-free',
      'cat-international',
    ],
  },
  {
    title: 'Snacks & Drinks',
    categoryIds: ['cat-snacks', 'cat-beverages', 'cat-cereals', 'cat-frozen'],
  },
  {
    title: 'Household & Pets',
    categoryIds: ['cat-household', 'cat-cleaning', 'cat-pet', 'cat-flowers'],
  },
  {
    title: 'Health, Baby & Personal Care',
    categoryIds: ['cat-personal-care', 'cat-baby', 'cat-health'],
  },
];

function CategoriesGridSkeleton({ tileWidth }: { tileWidth: number }) {
  return (
    <View style={styles.skeletonGrid}>
      {Array.from({ length: 8 }).map((_, index) => (
        <View
          key={`cat-skel-${index}`}
          style={{ width: tileWidth, marginBottom: spacing.sm }}
        >
          <Shimmer height={tileWidth} borderRadius={16} />
          <View
            style={{
              height: 10,
              borderRadius: 4,
              marginTop: 6,
              backgroundColor: colors.divider,
            }}
          />
        </View>
      ))}
    </View>
  );
}

export function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const contentWidth = width - spacing.md * 2;
  const tileWidth =
    (contentWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  const categoriesQuery = useSimulatedQuery(
    (signal) => fetchCategories(signal),
    [],
  );

  const onRefresh = useCallback(() => {
    categoriesQuery.refetch();
  }, [categoriesQuery]);

  const isLoading = categoriesQuery.status === 'loading';
  const hasError = categoriesQuery.status === 'error';
  const categories = categoriesQuery.data ?? [];

  const categoriesMap = useMemo(() => {
    const map = new Map<string, Category>();
    for (const cat of categories) {
      map.set(cat.id, cat);
    }
    return map;
  }, [categories]);

  const sectionedData = useMemo(() => {
    if (categories.length === 0) return [];

    const groupedIds = new Set(SECTIONS.flatMap((sec) => sec.categoryIds));
    const fallbackItems = categories.filter((cat) => !groupedIds.has(cat.id));

    const sections = SECTIONS.map((sec) => {
      const items = sec.categoryIds
        .map((id) => categoriesMap.get(id))
        .filter((cat): cat is Category => !!cat);
      return {
        title: sec.title,
        items,
      };
    }).filter((sec) => sec.items.length > 0);

    if (fallbackItems.length > 0) {
      sections.push({
        title: 'Other Categories',
        items: fallbackItems,
      });
    }

    return sections;
  }, [categories, categoriesMap]);

  return (
    <View style={styles.root} collapsable={false}>
      <AppStatusBar style="dark" />

      <View
        style={[styles.headerBlock, { paddingTop: insets.top + spacing.xs }]}
      >
        <HomeHeader />
        <View style={styles.searchWrap}>
          <HomeSearchBar placeholder="Search for products, categories..." />
        </View>
      </View>

      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: tabBarContentPadding(insets.bottom),
        }}
        refreshControl={
          <RefreshControl
            refreshing={categoriesQuery.isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <CategoriesDeliveryPromo />

        {isLoading ? (
          <View style={styles.section}>
            <HomeSectionHeader title="All Categories" />
            <CategoriesGridSkeleton tileWidth={tileWidth} />
          </View>
        ) : null}

        {hasError ? (
          <View style={styles.section}>
            <ErrorState
              message="Could not load categories."
              onRetry={onRefresh}
            />
          </View>
        ) : null}

        {!isLoading && !hasError
          ? sectionedData.map((section) => (
              <View key={section.title} style={styles.section}>
                <HomeSectionHeader title={section.title} />
                <View style={styles.grid}>
                  {section.items.map((category) => (
                    <CategoryGridTile
                      key={category.id}
                      category={category}
                      width={tileWidth}
                    />
                  ))}
                </View>
              </View>
            ))
          : null}

        {!isLoading && !hasError ? (
          <>
            <DietLifestyleSection />
            <TopCategoryBannersSection />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBlock: {
    backgroundColor: colors.background,
    zIndex: 2,
    elevation: 2,
  },
  searchWrap: {
    paddingTop: spacing.xs,
    paddingBottom: 2,
  },
  section: {
    marginTop: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: GRID_GAP,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: GRID_GAP,
  },
});
