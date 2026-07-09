import { useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchCategories } from '@/features/catalog/api/catalog.api';
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

const GRID_COLUMNS = 5;
const GRID_GAP = 8;

function CategoriesGridSkeleton({ tileWidth }: { tileWidth: number }) {
  return (
    <View style={styles.skeletonGrid}>
      {Array.from({ length: 10 }).map((_, index) => (
        <View key={`cat-skel-${index}`} style={{ width: tileWidth }}>
          <Shimmer height={92} borderRadius={10} />
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

        <View style={styles.section}>
          <HomeSectionHeader title="All Categories" />
          {isLoading ? <CategoriesGridSkeleton tileWidth={tileWidth} /> : null}

          {hasError ? (
            <ErrorState
              message="Could not load categories."
              onRetry={onRefresh}
            />
          ) : null}

          {!isLoading && !hasError ? (
            <View style={styles.grid}>
              {categories.map((category) => (
                <CategoryGridTile
                  key={category.id}
                  category={category}
                  width={tileWidth}
                />
              ))}
            </View>
          ) : null}
        </View>

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
