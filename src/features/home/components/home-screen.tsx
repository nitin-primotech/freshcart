import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  ToastAndroid,
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
import { HomeHeroBanner } from '@/features/home/components/home-hero-banner';
import { HomeSearchBar } from '@/features/home/components/home-search-bar';
import { HomeWelcomePromo } from '@/features/home/components/home-welcome-promo';
import { PopularBrandsSection } from '@/features/home/components/popular-brands-section';
import { PopularNearYouSection } from '@/features/home/components/popular-near-you-section';
import { RecommendedForYouSection } from '@/features/home/components/recommended-for-you-section';
import { TopPicksByCustomersSection } from '@/features/home/components/top-picks-by-customers-section';
import { WhyShopWithUs } from '@/features/home/components/why-shop-with-us';
import {
  getDishesExcluding,
  getRecommendedDishes,
} from '@/features/home/utils/get-recommended-dishes';
import { AppFooter } from '@/shared/components/app-footer';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { ErrorState } from '@/shared/components/error-state';
import { Shimmer } from '@/shared/components/shimmer';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

function HomeSkeleton() {
  return (
    <View style={styles.skeleton}>
      <Shimmer height={168} borderRadius={16} />
      <Shimmer height={120} borderRadius={16} />
    </View>
  );
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const searchStuckRef = useRef(false);
  const [searchStuck, setSearchStuck] = useState(false);

  useEffect(() => {
    if (process.env.EXPO_OS !== 'android') return;

    let backPressCount = 0;
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (router.canGoBack()) {
          return false; // Allow standard back navigation for pushed screens
        }

        if (backPressCount === 0) {
          backPressCount += 1;
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
          setTimeout(() => {
            backPressCount = 0;
          }, 2000);
          return true; // Block default exit
        }
        BackHandler.exitApp();
        return true;
      },
    );

    return () => subscription.remove();
  }, []);

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
  const categoryHref = '/(tabs)/categories' as const;

  const recommendedDishes = getRecommendedDishes(restaurants, 30);
  const dealDishes = recommendedDishes.slice(0, 8);
  const dealIds = new Set(dealDishes.map((d) => d.item.id));
  const popularDishes = getDishesExcluding(restaurants, dealIds, 6, 0);
  const popularIds = new Set([
    ...dealIds,
    ...popularDishes.map((d) => d.item.id),
  ]);
  const recommendedForYou = getDishesExcluding(restaurants, popularIds, 6, 0);
  const topPicks = getDishesExcluding(restaurants, new Set(), 12, 0);

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
        <View style={styles.searchWrap}>
          <HomeSearchBar />
        </View>
      </View>

      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 90 }}
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
            styles.stickyChipsShell,
            searchStuck
              ? {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                }
              : null,
          ]}
        >
          <DeliveryFeatureChips />
        </View>

        <View style={styles.promoBlock}>
          <HomeHeroBanner promos={promosQuery.data} />
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
              <PopularBrandsSection />
              <RecommendedForYouSection
                dishes={recommendedForYou}
                viewAllHref={viewAllHref}
              />
              <WhyShopWithUs />
              <TopPicksByCustomersSection
                dishes={topPicks}
                viewAllHref={viewAllHref}
              />
              <HomeWelcomePromo />
            </>
          ) : null}

          {hasError ? (
            <ErrorState
              message="Could not load products."
              onRetry={onRefresh}
            />
          ) : null}
          <AppFooter />
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
    zIndex: 2,
    elevation: 2,
  },
  searchWrap: {
    paddingTop: spacing.xs,
    paddingBottom: 2,
  },
  stickyChipsShell: {
    backgroundColor: colors.background,
    paddingBottom: spacing.xxs,
    zIndex: 10,
  },
  promoBlock: {
    backgroundColor: colors.background,
    paddingTop: spacing.xxs,
    paddingBottom: spacing.sm,
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
