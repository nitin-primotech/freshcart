import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  fetchCategories,
  fetchRestaurants,
  searchRestaurants,
} from '@/features/catalog/api/catalog.api';
import type {
  Category,
  Restaurant,
} from '@/features/catalog/types/catalog.types';
import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { SearchCategoryStrip } from '@/features/search/components/search-category-strip';
import { SearchCuisineCarousel } from '@/features/search/components/search-cuisine-carousel';
import { SearchRestaurantRow } from '@/features/search/components/search-restaurant-row';
import { SearchSuggestionList } from '@/features/search/components/search-suggestion-list';
import {
  SEARCH_FILTERS,
  type SearchFilterId,
} from '@/features/search/constants/search.constants';
import {
  buildSearchSuggestions,
  type SearchSuggestion,
} from '@/features/search/utils/search-suggestions';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { Shimmer } from '@/shared/components/shimmer';
import { hapticSelection, hapticSoftTap } from '@/shared/haptics/feedback';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { formTextInputProps } from '@/shared/utils/keyboard';
import {
  addRecentSearch,
  selectRecentSearches,
  useAppStore,
} from '@/store/app.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';
import { fonts, typography } from '@/theme/typography';

function applyBrowseFilters(
  restaurants: Restaurant[],
  filter: SearchFilterId | null,
  categoryId: string | null,
): Restaurant[] {
  const list = categoryId
    ? restaurants.filter((restaurant) =>
        restaurant.categoryIds.includes(categoryId),
      )
    : restaurants;

  if (!filter) return list;

  switch (filter) {
    case 'top_rated':
      return [...list].sort((a, b) => b.rating - a.rating);
    case 'fastest':
      return [...list].sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    case 'free_delivery':
      return list.filter((restaurant) => restaurant.isFreeDelivery);
    case 'offers':
      return list.filter(
        (restaurant) => restaurant.offerLabel || restaurant.isPromoted,
      );
  }
}

export function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recent = useAppStore(selectRecentSearches);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilterId | null>(
    'top_rated',
  );
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const categoriesQuery = useSimulatedQuery(
    (signal) => fetchCategories(signal),
    [],
  );
  const restaurantsQuery = useSimulatedQuery(
    (signal) => fetchRestaurants(signal),
    [],
  );
  const searchQuery = useSimulatedQuery(
    (signal) => searchRestaurants(query, signal),
    [query],
    { enabled: query.trim().length >= 2 },
  );

  const categories = categoriesQuery.data ?? [];
  const restaurants = restaurantsQuery.data ?? [];
  const isBootLoading =
    categoriesQuery.status === 'loading' ||
    restaurantsQuery.status === 'loading';

  const trimmedQuery = query.trim();
  const showSuggestions = trimmedQuery.length >= 1;
  const showResults = trimmedQuery.length >= 2;

  const suggestions = useMemo(
    () => buildSearchSuggestions(trimmedQuery, recent, categories, restaurants),
    [trimmedQuery, recent, categories, restaurants],
  );

  const browseRestaurants = useMemo(
    () => applyBrowseFilters(restaurants, activeFilter, activeCategoryId),
    [restaurants, activeFilter, activeCategoryId],
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.data) return [];
    return applyBrowseFilters(searchQuery.data, activeFilter, activeCategoryId);
  }, [searchQuery.data, activeFilter, activeCategoryId]);

  const submit = useCallback(() => {
    if (trimmedQuery.length >= 2) {
      addRecentSearch(trimmedQuery);
    }
  }, [trimmedQuery]);

  function handleCategorySelect(category: Category | null) {
    setActiveCategoryId(category?.id ?? null);
    if (category) {
      setQuery(category.name);
      addRecentSearch(category.name);
    } else {
      setQuery('');
    }
  }

  function handleCuisineSelect(category: Category) {
    handleCategorySelect(category);
  }

  function handleSuggestionSelect(suggestion: SearchSuggestion) {
    hapticSoftTap();
    if (suggestion.restaurantId) {
      addRecentSearch(suggestion.query);
      router.push(`/restaurant/${suggestion.restaurantId}`);
      return;
    }
    setQuery(suggestion.query);
    addRecentSearch(suggestion.query);
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <ScrollView
        style={styles.screen}
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.sm,
            paddingBottom: tabBarContentPadding(insets.bottom),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Search</Text>

        <View style={styles.searchWrap}>
          <AppSymbol
            name="magnifyingglass"
            size={18}
            tintColor={colors.textTertiary}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submit}
            placeholder="Restaurants, cuisines, dishes..."
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            returnKeyType="search"
            {...formTextInputProps}
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => {
                hapticSoftTap();
                setQuery('');
                setActiveCategoryId(null);
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <AppSymbol
                name="xmark.circle.fill"
                size={18}
                tintColor={colors.textTertiary}
              />
            </Pressable>
          ) : null}
        </View>

        {isBootLoading ? (
          <View style={styles.loading}>
            <Shimmer height={72} borderRadius={14} />
            <Shimmer height={40} borderRadius={14} />
            <Shimmer height={180} borderRadius={14} />
          </View>
        ) : (
          <>
            <SearchCategoryStrip
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelect={handleCategorySelect}
            />

            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {SEARCH_FILTERS.map((filter) => {
                const active = activeFilter === filter.id;
                return (
                  <Pressable
                    key={filter.id}
                    onPress={() => {
                      hapticSelection();
                      setActiveFilter(active ? null : filter.id);
                    }}
                    style={[styles.filterChip, active && styles.filterActive]}
                    accessibilityRole="button"
                    accessibilityLabel={filter.label}
                  >
                    <AppSymbol
                      name={filter.icon}
                      size={12}
                      tintColor={active ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {showSuggestions ? (
              <SearchSuggestionList
                suggestions={suggestions}
                onSelect={handleSuggestionSelect}
              />
            ) : null}

            {!showSuggestions && recent.length > 0 ? (
              <View style={styles.recent}>
                <Text style={styles.sectionTitle}>Recent</Text>
                {recent.map((term) => (
                  <Pressable
                    key={term}
                    onPress={() => {
                      hapticSoftTap();
                      setQuery(term);
                    }}
                    style={styles.recentRow}
                  >
                    <AppSymbol
                      name="clock.arrow.circlepath"
                      size={16}
                      tintColor={colors.textTertiary}
                    />
                    <Text style={styles.recentText}>{term}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {!showSuggestions ? (
              <>
                <View style={styles.section}>
                  <HomeSectionHeader title="Popular cuisines" />
                  <SearchCuisineCarousel
                    categories={categories}
                    restaurants={restaurants}
                    onSelect={handleCuisineSelect}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Recommended for you</Text>
                  <View style={styles.resultList}>
                    {browseRestaurants.map((restaurant) => (
                      <SearchRestaurantRow
                        key={restaurant.id}
                        restaurant={restaurant}
                      />
                    ))}
                  </View>
                </View>
              </>
            ) : null}

            {showResults && searchQuery.status === 'loading' ? (
              <View style={styles.loading}>
                {[1, 2, 3].map((item) => (
                  <Shimmer key={item} height={108} borderRadius={14} />
                ))}
              </View>
            ) : null}

            {showResults && searchQuery.status === 'error' ? (
              <ErrorState
                message="Search failed. Please try again."
                onRetry={searchQuery.refetch}
              />
            ) : null}

            {showResults &&
            searchQuery.status === 'success' &&
            searchResults.length === 0 ? (
              <EmptyState
                title="No matches"
                message={`Nothing found for "${trimmedQuery}". Try a different search.`}
              />
            ) : null}

            {showResults && searchResults.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Results</Text>
                <View style={styles.resultList}>
                  {searchResults.map((restaurant) => (
                    <SearchRestaurantRow
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.textPrimary,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.body,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  filters: {
    gap: spacing.xs,
    paddingVertical: spacing.xxs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: {
    backgroundColor: 'rgba(212, 84, 60, 0.1)',
    borderColor: 'rgba(212, 84, 60, 0.25)',
  },
  filterText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textPrimary,
  },
  filterTextActive: {
    color: colors.primary,
    fontFamily: fonts.semibold,
  },
  recent: {
    gap: spacing.xs,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  recentText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  resultList: {
    gap: spacing.sm,
  },
  loading: {
    gap: spacing.sm,
  },
});
