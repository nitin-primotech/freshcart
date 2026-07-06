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
import { DeliveryFeatureChips } from '@/features/home/components/delivery-feature-chips';
import { FoodCategoryStrip } from '@/features/home/components/food-category-strip';
import { GroceryDealsSection } from '@/features/home/components/grocery-deals-section';
import { HomeHeader } from '@/features/home/components/home-header';
import { HomeSearchBar } from '@/features/home/components/home-search-bar';
import { OfferCarousel } from '@/features/home/components/offer-carousel';
import { PopularNearYouSection } from '@/features/home/components/popular-near-you-section';
import { getRecommendedDishes } from '@/features/home/utils/get-recommended-dishes';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { ErrorState } from '@/shared/components/error-state';
import { MerchantOfflineBanner } from '@/shared/components/merchant-offline-banner';
import { Shimmer } from '@/shared/components/shimmer';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';

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

  const restaurants = restaurantsQuery.data ?? [];
  const storeId = restaurants[0]?.id ?? 'freshcart';
  const firstCategoryId = categoriesQuery.data?.[0]?.id;
  const categoryHref = firstCategoryId
    ? (`/category/${firstCategoryId}` as const)
    : undefined;

  const recommendedDishes = getRecommendedDishes(restaurants, 16);
  const dealDishes = recommendedDishes.slice(0, 6);
  const popularDishes = recommendedDishes.slice(6, 12);

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

  const viewAllHref = useMemo(
    () => (storeId ? (`/restaurant/${storeId}` as const) : undefined),
    [storeId],
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
            tintColor={colors.primary}
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
          <DeliveryFeatureChips />
        </View>

        <View style={styles.promoBlock}>
          <MerchantOfflineBanner />
          <OfferCarousel promos={promosQuery.data} />
        </View>

        <View style={styles.body}>
          {categoriesQuery.data ? (
            <FoodCategoryStrip
              categories={categoriesQuery.data}
              moreHref={categoryHref}
            />
          ) : null}

          {isLoading ? <HomeSkeleton /> : null}

          {!isLoading && !hasError ? (
            <>
              <GroceryDealsSection
                dishes={dealDishes}
                viewAllHref={viewAllHref}
              />
              <PopularNearYouSection
                dishes={popularDishes}
                viewAllHref={viewAllHref}
              />
            </>
          ) : null}

          {hasError ? (
            <ErrorState
              message="Could not load products."
              onRetry={onRefresh}
            />
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
    paddingBottom: spacing.xxs,
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
  skeleton: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
