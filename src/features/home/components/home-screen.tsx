import { useCallback, useMemo, useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
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
import { HomeCollectionsGrid } from '@/features/home/components/home-collections-grid';
import { HomeHeader } from '@/features/home/components/home-header';
import { HomeSearchBar } from '@/features/home/components/home-search-bar';
import { OfferCarousel } from '@/features/home/components/offer-carousel';
import { RecommendedSection } from '@/features/home/components/recommended-section';
import {
  getDishesExcluding,
  getDishesForCategoryIds,
  getRecommendedDishes,
} from '@/features/home/utils/get-recommended-dishes';
import { getPersonalizedSectionTitle } from '@/features/home/utils/personalize-restaurants';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { ErrorState } from '@/shared/components/error-state';
import { MerchantOfflineBanner } from '@/shared/components/merchant-offline-banner';
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
  const searchStuckRef = useRef(false);
  const [searchStuck, setSearchStuck] = useState(false);

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
  const personalizedTitle =
    filterId === 'fast'
      ? 'Lightning delivery'
      : filterId === 'off'
        ? 'Top offers near you'
        : getPersonalizedSectionTitle(preferences, categoriesQuery.data ?? []);

  const recommendedDishes = getRecommendedDishes(restaurants, 12);
  const topPicksDishes = recommendedDishes.slice(0, 6);
  const morePicksDishes = recommendedDishes.slice(6, 12);

  const shownItemIds = useMemo(() => {
    const ids = new Set<string>();
    for (const dish of [...topPicksDishes, ...morePicksDishes]) {
      ids.add(dish.item.id);
    }
    return ids;
  }, [topPicksDishes, morePicksDishes]);

  const preferenceCategoryIds =
    preferences.cuisineIds.length > 0
      ? preferences.cuisineIds
      : (categoriesQuery.data?.slice(0, 2).map((category) => category.id) ??
        []);

  const personalizedDishes = useMemo(() => {
    const fromPrefs = getDishesForCategoryIds(
      restaurants,
      preferenceCategoryIds,
      12,
    );
    return fromPrefs
      .filter((dish) => !shownItemIds.has(dish.item.id))
      .slice(0, 6);
  }, [restaurants, preferenceCategoryIds, shownItemIds]);

  const exploreDishes = useMemo(() => {
    const exclude = new Set(shownItemIds);
    for (const dish of personalizedDishes) {
      exclude.add(dish.item.id);
    }
    return getDishesExcluding(restaurants, exclude, 6);
  }, [restaurants, shownItemIds, personalizedDishes]);

  const mainRestaurantId = restaurantsQuery.data?.[0]?.id;
  const firstCategoryId =
    preferenceCategoryIds[0] ?? categoriesQuery.data?.[0]?.id;
  const restaurantHref = mainRestaurantId
    ? (`/restaurant/${mainRestaurantId}` as const)
    : undefined;
  const categoryHref = firstCategoryId
    ? (`/category/${firstCategoryId}` as const)
    : undefined;

  const bottomPad = tabBarContentPadding(insets.bottom);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const stuck = offsetY > 0;
      if (stuck !== searchStuckRef.current) {
        searchStuckRef.current = stuck;
        setSearchStuck(stuck);
      }
    },
    [],
  );

  return (
    <View style={styles.root} collapsable={false}>
      <AppStatusBar style="dark" />

      <View
        style={[styles.headerBlock, { paddingTop: insets.top + spacing.xs }]}
      >
        <HomeHeader />
      </View>

      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textPrimary}
          />
        }
      >
        <View
          style={[
            styles.stickySearchShell,
            searchStuck
              ? {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                }
              : styles.stickySearchShellIdle,
          ]}
        >
          <HomeSearchBar />
        </View>

        <View style={styles.promoBlock}>
          <MerchantOfflineBanner />
          <OfferCarousel promos={promosQuery.data} />
        </View>

        <View style={styles.body}>
          {categoriesQuery.data ? (
            <FoodCategoryStrip
              categories={categoriesQuery.data}
              moreHref={categoryHref ?? restaurantHref}
            />
          ) : null}
          {!isLoading && !hasError ? <HomeBestOffers /> : null}
          {!isLoading && !hasError ? (
            <RecommendedSection
              dishes={topPicksDishes}
              viewAllHref={restaurantHref}
            />
          ) : null}
          {!isLoading && !hasError ? (
            <View style={styles.brandsCluster}>
              <HomeCollectionsGrid />
              <FilterPills activeId={filterId} onSelect={setFilterId} />
            </View>
          ) : null}

          {isLoading ? <HomeSkeleton /> : null}
          {!isLoading && !hasError && morePicksDishes.length > 0 ? (
            <RecommendedSection
              title="Recommended picks"
              dishes={morePicksDishes}
              viewAllHref={categoryHref ?? restaurantHref}
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
              {personalizedDishes.length > 0 ? (
                <RecommendedSection
                  title={personalizedTitle}
                  dishes={personalizedDishes}
                  viewAllHref={
                    firstCategoryId
                      ? (`/category/${firstCategoryId}` as const)
                      : restaurantHref
                  }
                />
              ) : null}
              {exploreDishes.length > 0 ? (
                <RecommendedSection
                  title="Explore for you"
                  dishes={exploreDishes}
                  viewAllHref={restaurantHref}
                />
              ) : null}
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
  headerBlock: {
    backgroundColor: colors.background,
  },
  stickySearchShell: {
    backgroundColor: colors.background,
    paddingBottom: spacing.xs,
    zIndex: 10,
  },
  stickySearchShellIdle: {
    paddingTop: spacing.sm,
  },
  promoBlock: {
    backgroundColor: colors.background,
    gap: spacing.sm,
    paddingBottom: spacing.xs,
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
