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
import { HomeHeader } from '@/features/home/components/home-header';
import { OfferCarousel } from '@/features/home/components/offer-carousel';
import { RecommendedSection } from '@/features/home/components/recommended-section';
import { RestaurantTileCard } from '@/features/home/components/restaurant-tile-card';
import { getRecommendedDishes } from '@/features/home/utils/get-recommended-dishes';
import {
  getPersonalizedRestaurants,
  getPersonalizedSectionTitle,
} from '@/features/home/utils/personalize-restaurants';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { ErrorState } from '@/shared/components/error-state';
import { PremiumText } from '@/shared/components/premium-text';
import { Shimmer } from '@/shared/components/shimmer';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { selectPreferences, useAppStore } from '@/store/app.store';
import { colors } from '@/theme/colors';
import { screenTopPadding } from '@/theme/screen-edge';
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

function HomeSkeleton({ cardWidth }: { cardWidth: number }) {
  return (
    <View style={styles.skeleton}>
      <Shimmer height={168} borderRadius={24} />
      <View style={styles.skeletonRow}>
        <Shimmer height={220} width={cardWidth} borderRadius={24} />
        <Shimmer height={220} width={cardWidth} borderRadius={24} />
      </View>
    </View>
  );
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const preferences = useAppStore(selectPreferences);
  const [filterId, setFilterId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const cardWidth = useCarouselItemWidth({
    visibleCount: 2,
    peek: 0.14,
    gap: spacing.md,
    paddingEnd: spacing.lg,
  });

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
  const filteredRestaurants = categoryId
    ? restaurants.filter((r) => r.categoryIds.includes(categoryId))
    : restaurants;
  const personalized = getPersonalizedRestaurants(
    filteredRestaurants,
    preferences,
  );
  const personalizedTitle = getPersonalizedSectionTitle(preferences);
  const exploreRestaurants = [...personalized].reverse();
  const recommendedDishes = getRecommendedDishes(
    restaurantsQuery.data ?? [],
    8,
  );

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
        <View
          style={[styles.header, { paddingTop: screenTopPadding(spacing.xs) }]}
        >
          <HomeHeader />
          <OfferCarousel promos={promosQuery.data} />
        </View>

        <View style={styles.body}>
          {categoriesQuery.data ? (
            <FoodCategoryStrip
              categories={categoriesQuery.data}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />
          ) : null}
          {!isLoading && !hasError ? (
            <RecommendedSection dishes={recommendedDishes} />
          ) : null}
          <FilterPills activeId={filterId} onSelect={setFilterId} />

          {isLoading ? <HomeSkeleton cardWidth={cardWidth} /> : null}

          {hasError ? (
            <ErrorState
              message="Could not load restaurants."
              onRetry={onRefresh}
            />
          ) : null}

          {!isLoading && !hasError ? (
            <>
              <PremiumText variant="sectionTitle" style={styles.sectionTitle}>
                {filterId === 'fast'
                  ? 'Lightning delivery'
                  : filterId === 'off'
                    ? 'Top offers near you'
                    : personalizedTitle}
              </PremiumText>
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
              >
                {personalized.map((r) => (
                  <RestaurantTileCard
                    key={r.id}
                    restaurant={r}
                    width={cardWidth}
                  />
                ))}
              </ScrollView>

              <PremiumText variant="sectionTitle" style={styles.sectionTitle}>
                Explore more
              </PremiumText>
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.carousel}
              >
                {exploreRestaurants.map((r) => (
                  <RestaurantTileCard
                    key={`more-${r.id}`}
                    restaurant={r}
                    width={cardWidth}
                  />
                ))}
              </ScrollView>
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
  },
  body: {
    backgroundColor: colors.background,
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  carousel: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingBottom: spacing.xl,
  },
  skeleton: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
