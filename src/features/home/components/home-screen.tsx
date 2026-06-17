import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  fetchPromos,
  fetchRestaurants,
} from '@/features/catalog/api/catalog.api';
import type { Restaurant } from '@/features/catalog/types/catalog.types';
import { FilterPills } from '@/features/home/components/filter-pills';
import { HeroBanner } from '@/features/home/components/hero-banner';
import { HomeHeader } from '@/features/home/components/home-header';
import { HomeSearchBar } from '@/features/home/components/home-search-bar';
import { OfferStrip } from '@/features/home/components/offer-strip';
import { RestaurantTileCard } from '@/features/home/components/restaurant-tile-card';
import { ServiceGrid } from '@/features/home/components/service-grid';
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
import { radius, spacing } from '@/theme/spacing';
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
  const cardWidth = useCarouselItemWidth({
    visibleCount: 2,
    peek: 0.14,
    gap: spacing.md,
    paddingEnd: spacing.lg,
  });

  const promosQuery = useSimulatedQuery((signal) => fetchPromos(signal), []);
  const restaurantsQuery = useSimulatedQuery(
    (signal) => fetchRestaurants(signal),
    [],
  );

  const isLoading =
    promosQuery.status === 'loading' || restaurantsQuery.status === 'loading';
  const hasError =
    promosQuery.status === 'error' || restaurantsQuery.status === 'error';

  const onRefresh = useCallback(() => {
    promosQuery.refetch();
    restaurantsQuery.refetch();
  }, [promosQuery, restaurantsQuery]);

  const refreshing = promosQuery.isRefreshing || restaurantsQuery.isRefreshing;

  const restaurants = filterRestaurants(restaurantsQuery.data ?? [], filterId);
  const personalized = getPersonalizedRestaurants(restaurants, preferences);
  const personalizedTitle = getPersonalizedSectionTitle(preferences);
  const exploreRestaurants = [...personalized].reverse();

  const bottomPad = tabBarContentPadding(insets.bottom);

  return (
    <View style={styles.root} collapsable={false}>
      <AppStatusBar style="light" />
      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textInverse}
          />
        }
      >
        <LinearGradient
          colors={[colors.backgroundDark, '#1A1A22', colors.secondary]}
          locations={[0, 0.55, 1]}
          style={[styles.darkHeader, { paddingTop: insets.top + spacing.lg }]}
        >
          <HomeHeader />
          <ServiceGrid />
          <HomeSearchBar />
          <OfferStrip promos={promosQuery.data} />
        </LinearGradient>

        <View style={styles.body}>
          <HeroBanner promo={promosQuery.data?.[0]} />
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
    backgroundColor: colors.backgroundDark,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  darkHeader: {
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  body: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -spacing.lg,
    paddingTop: spacing.xl,
    boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.12)',
    borderCurve: 'continuous',
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
