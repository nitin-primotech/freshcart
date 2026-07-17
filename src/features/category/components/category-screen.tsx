import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  fetchCategoryById,
  fetchRestaurantsByCategory,
} from '@/features/catalog/api/catalog.api';
import { getCategoryDishes } from '@/features/category/utils/get-category-dishes';
import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { RestaurantTileCard } from '@/features/home/components/restaurant-tile-card';
import { TopPicksProductCard } from '@/features/home/components/top-picks-product-card';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import {
  SCREEN_BACK_BUTTON_SIZE,
  ScreenBackButton,
} from '@/shared/components/screen-back-button';
import { Shimmer } from '@/shared/components/shimmer';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { useCarouselItemWidth } from '@/shared/hooks/use-carousel-item-width';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { colors } from '@/theme/colors';
import { screenTopPadding } from '@/theme/screen-edge';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function CategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoryId = id ?? '';

  const categoryQuery = useSimulatedQuery(
    (signal) => fetchCategoryById(categoryId, signal),
    [categoryId],
    { enabled: Boolean(categoryId) },
  );
  const restaurantsQuery = useSimulatedQuery(
    (signal) => fetchRestaurantsByCategory(categoryId, signal),
    [categoryId],
    { enabled: Boolean(categoryId) },
  );

  const isLoading =
    categoryQuery.status === 'loading' || restaurantsQuery.status === 'loading';
  const hasError =
    categoryQuery.status === 'error' || restaurantsQuery.status === 'error';

  const onRefresh = useCallback(() => {
    categoryQuery.refetch();
    restaurantsQuery.refetch();
  }, [categoryQuery, restaurantsQuery]);

  const refreshing =
    categoryQuery.isRefreshing || restaurantsQuery.isRefreshing;

  const restaurants = restaurantsQuery.data ?? [];
  const dishes = getCategoryDishes(restaurants, categoryId);
  const categoryName = categoryQuery.data?.name ?? 'Category';

  const dishCardWidth = useCarouselItemWidth({
    visibleCount: 2.2,
    peek: 0.03,
    gap: spacing.md,
    paddingEnd: spacing.md,
  });

  const restaurantCardWidth = width - spacing.md * 2;

  function onBack() {
    hapticSoftTap();
    router.back();
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />
      <View
        style={[styles.topBar, { paddingTop: screenTopPadding(insets.top) }]}
      >
        <ScreenBackButton onPress={onBack} />
        <Text style={styles.title} numberOfLines={1}>
          {categoryName}
        </Text>
        <View style={styles.backSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.textPrimary}
          />
        }
      >
        {isLoading ? (
          <View style={styles.skeleton}>
            <Shimmer height={180} borderRadius={14} />
            <Shimmer height={200} borderRadius={14} />
          </View>
        ) : null}

        {hasError ? (
          <ErrorState message="Could not load category." onRetry={onRefresh} />
        ) : null}

        {!isLoading && !hasError ? (
          <>
            {dishes.length > 0 ? (
              <View style={styles.section}>
                <HomeSectionHeader title={`Popular ${categoryName}`} />
                <ScrollView
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dishRow}
                >
                  {dishes.map((dish) => (
                    <TopPicksProductCard
                      key={`${dish.restaurantId}-${dish.item.id}`}
                      dish={dish}
                      width={dishCardWidth}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.section}>
              <HomeSectionHeader title="Restaurants" />
              {restaurants.length === 0 ? (
                <EmptyState
                  title="Nothing here yet"
                  message={`No restaurants found for ${categoryName.toLowerCase()}.`}
                />
              ) : (
                <View style={styles.restaurantList}>
                  {restaurants.map((restaurant) => (
                    <RestaurantTileCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      width={restaurantCardWidth}
                    />
                  ))}
                </View>
              )}
            </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backSpacer: {
    width: SCREEN_BACK_BUTTON_SIZE,
    height: SCREEN_BACK_BUTTON_SIZE,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  content: {
    paddingTop: spacing.sm,
  },
  section: {
    marginTop: spacing.md,
  },
  dishRow: {
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  restaurantList: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  skeleton: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
});
