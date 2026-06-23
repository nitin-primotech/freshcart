import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  fetchCategories,
  fetchPromos,
  fetchRestaurants,
} from '@/features/catalog/api/catalog.api';
import type { Restaurant } from '@/features/catalog/types/catalog.types';
import { FilterPills } from '@/features/home/components/filter-pills';
import { FoodCategoryStrip } from '@/features/home/components/food-category-strip';
import { HomeBestOffers } from '@/features/home/components/home-best-offers';
import { HomeHeader } from '@/features/home/components/home-header';
import { HomePopularBrands } from '@/features/home/components/home-popular-brands';
import { HomeRestaurantCarousel } from '@/features/home/components/home-restaurant-carousel';
import { HomeSearchBar } from '@/features/home/components/home-search-bar';
import { OfferCarousel } from '@/features/home/components/offer-carousel';
import { RecommendedSection } from '@/features/home/components/recommended-section';
import { getRecommendedDishes } from '@/features/home/utils/get-recommended-dishes';
import {
  getPersonalizedRestaurants,
  getPersonalizedSectionTitle,
} from '@/features/home/utils/personalize-restaurants';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { ErrorState } from '@/shared/components/error-state';
import { Shimmer } from '@/shared/components/shimmer';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { selectPreferences, useAppStore } from '@/store/app.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';

function filterRestaurants(
  list: Restaurant[],
  filterId: string | null,
): Restaurant[] {
  if (filterId === 'fast') {
    return list.filter((r) => r.isFastDelivery || r.deliveryTimeMax <= 25);
  }
  if (filterId === 'off') {
    return list.filter((r) => r.offerLabel || r.isPromoted);
  }
  return list;
}

function HomeSkeleton() {
  return (
    <View style={styles.skeleton}>
      <Shimmer height={168} borderRadius={14} />
      <Shimmer height={196} borderRadius={14} />
    </View>
  );
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const preferences = useAppStore(selectPreferences);
  const [filterId, setFilterId] = useState<string | null>(null);

  const promosQuery = useSimulatedQuery((signal) => fetchPromos(signal), []);
  const categoriesQuery = useSimulatedQuery(
    (signal) => fetchCategories(signal),
    [],
  );
  const restaurantsQuery = useSimulatedQuery(
    (signal) => fetchRestaurants(signal),
    [],
  );

  const isLoading =
    promosQuery.status === 'loading' ||
    categoriesQuery.status === 'loading' ||
    restaurantsQuery.status === 'loading';
  const hasError =
    promosQuery.status === 'error' ||
    categoriesQuery.status === 'error' ||
    restaurantsQuery.status === 'error';

  const onRefresh = useCallback(() => {
    promosQuery.refetch();
    categoriesQuery.refetch();
    restaurantsQuery.refetch();
  }, [promosQuery, categoriesQuery, restaurantsQuery]);

  const refreshing =
    promosQuery.isRefreshing ||
    categoriesQuery.isRefreshing ||
    restaurantsQuery.isRefreshing;

  const restaurants = filterRestaurants(restaurantsQuery.data ?? [], filterId);
  const personalized = getPersonalizedRestaurants(restaurants, preferences);
  const personalizedTitle =
    filterId === 'fast'
      ? 'Lightning delivery'
      : filterId === 'off'
        ? 'Top offers near you'
        : getPersonalizedSectionTitle(preferences);

  const exploreRestaurants = [...personalized].reverse();
  const recommendedDishes = getRecommendedDishes(
    restaurantsQuery.data ?? [],
    12,
  );
  const topPicksDishes = recommendedDishes.slice(0, 6);
  const morePicksDishes = recommendedDishes.slice(6, 12);

  const bottomPad = tabBarContentPadding(insets.bottom);

  return (
    <View style={styles.root} collapsable={false}>
      <AppStatusBar style="dark" />
      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textPrimary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <HomeHeader />
            <HomeSearchBar />
          </View>
          <OfferCarousel promos={promosQuery.data} />
        </View>

        <View style={styles.body}>
          {categoriesQuery.data ? (
            <FoodCategoryStrip categories={categoriesQuery.data} />
          ) : null}
          {!isLoading && !hasError ? <HomeBestOffers /> : null}
          {!isLoading && !hasError ? (
            <RecommendedSection dishes={topPicksDishes} />
          ) : null}
          {!isLoading && !hasError ? (
            <View style={styles.brandsCluster}>
              <HomePopularBrands />
              <FilterPills activeId={filterId} onSelect={setFilterId} />
            </View>
          ) : null}

          {isLoading ? <HomeSkeleton /> : null}
          {!isLoading && !hasError && morePicksDishes.length > 0 ? (
            <RecommendedSection
              title="Recommended picks"
              dishes={morePicksDishes}
              imageIndexOffset={6}
            />
          ) : null}
          {hasError ? (
            <ErrorState
              message="Could not load restaurants."
              onRetry={onRefresh}
            />
          ) : null}

          {!isLoading && !hasError ? (
            <>
              <HomeRestaurantCarousel
                title={personalizedTitle}
                restaurants={personalized}
              />
              <HomeRestaurantCarousel
                title="Explore for you"
                restaurants={exploreRestaurants}
              />
            </>
          ) : null}
        </View>
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
  header: {
    backgroundColor: colors.background,
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerTop: {
    gap: spacing.md,
  },
  body: {
    backgroundColor: colors.background,
  },
  brandsCluster: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  skeleton: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
