import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  fetchCategories,
  fetchRestaurants,
  searchRestaurants,
} from '@/features/catalog/api/catalog.api';
import type { Category } from '@/features/catalog/types/catalog.types';
import { GroceryDealsSection } from '@/features/home/components/grocery-deals-section';
import { RecommendedSection } from '@/features/home/components/recommended-section';
import { getRecommendedDishes } from '@/features/home/utils/get-recommended-dishes';
import { productDetailPath } from '@/features/product/utils/product-path';
import { SearchPopularCategoriesGrid } from '@/features/search/components/search-popular-categories-grid';
import { SearchRecentChipsSection } from '@/features/search/components/search-recent-chips-section';
import { SearchRecentlyViewedSection } from '@/features/search/components/search-recently-viewed-section';
import { SearchRequestBanner } from '@/features/search/components/search-request-banner';
import { SearchScreenHeader } from '@/features/search/components/search-screen-header';
import { SearchSuggestionList } from '@/features/search/components/search-suggestion-list';
import { SearchTopBrandsSection } from '@/features/search/components/search-top-brands-section';
import { SearchTrendingSection } from '@/features/search/components/search-trending-section';
import { resolveSearchDestination } from '@/features/search/utils/resolve-search-destination';
import { searchDishes } from '@/features/search/utils/search-dishes';
import {
  buildSearchSuggestions,
  type SearchSuggestion,
} from '@/features/search/utils/search-suggestions';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { Shimmer } from '@/shared/components/shimmer';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { formTextInputProps } from '@/shared/utils/keyboard';
import {
  addRecentSearch,
  selectRecentSearches,
  useAppStore,
} from '@/store/app.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

export function SearchScreen() {
  const router = useRouter();
  const { q, autoFocus } = useLocalSearchParams<{
    q?: string | string[];
    autoFocus?: string | string[];
  }>();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const recent = useAppStore(selectRecentSearches);
  const [query, setQuery] = useState('');

  const shouldAutoFocus =
    autoFocus === '1' ||
    autoFocus === 'true' ||
    (Array.isArray(autoFocus) && autoFocus[0] === '1');

  useEffect(() => {
    const incoming = Array.isArray(q) ? q[0] : q;
    if (!incoming?.trim()) {
      return;
    }
    setQuery(incoming);
    addRecentSearch(incoming);
  }, [q]);

  useEffect(() => {
    if (!shouldAutoFocus) {
      return;
    }
    const handle = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(handle);
  }, [shouldAutoFocus]);

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
  const showBrowse = !showSuggestions;

  const recommendedDishes = useMemo(
    () => getRecommendedDishes(restaurants, 8),
    [restaurants],
  );
  const recentlyViewed = useMemo(
    () => getRecommendedDishes(restaurants, 6),
    [restaurants],
  );

  const suggestions = useMemo(
    () => buildSearchSuggestions(trimmedQuery, recent, categories, restaurants),
    [trimmedQuery, recent, categories, restaurants],
  );

  const dishResults = useMemo(
    () => (showResults ? searchDishes(trimmedQuery, restaurants, 8) : []),
    [showResults, trimmedQuery, restaurants],
  );

  const navigateFromSearch = useCallback(
    (term: string) => {
      const destination = resolveSearchDestination(
        term,
        categories,
        restaurants,
      );
      addRecentSearch(term);

      switch (destination.type) {
        case 'category':
          router.push(`/category/${destination.categoryId}`);
          return;
        case 'restaurant':
          router.push(`/restaurant/${destination.restaurantId}`);
          return;
        case 'product':
          router.push(
            productDetailPath(destination.restaurantId, destination.itemId),
          );
          return;
        case 'query':
          setQuery(destination.query);
          return;
      }
    },
    [categories, restaurants, router],
  );

  const submit = useCallback(() => {
    if (trimmedQuery.length >= 2) {
      navigateFromSearch(trimmedQuery);
    }
  }, [trimmedQuery, navigateFromSearch]);

  function handleCategorySelect(category: Category) {
    hapticSoftTap();
    router.push(`/category/${category.id}`);
  }

  function handleSuggestionSelect(suggestion: SearchSuggestion) {
    hapticSoftTap();
    if (suggestion.kind === 'category' && suggestion.categoryId) {
      addRecentSearch(suggestion.query);
      router.push(`/category/${suggestion.categoryId}`);
      return;
    }
    if (
      suggestion.kind === 'dish' &&
      suggestion.restaurantId &&
      suggestion.itemId
    ) {
      addRecentSearch(suggestion.query);
      router.push(
        productDetailPath(suggestion.restaurantId, suggestion.itemId),
      );
      return;
    }
    if (suggestion.kind === 'restaurant' && suggestion.restaurantId) {
      addRecentSearch(suggestion.query);
      router.push(`/restaurant/${suggestion.restaurantId}`);
      return;
    }
    navigateFromSearch(suggestion.query);
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
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <SearchScreenHeader />

        <View style={styles.searchWrap}>
          <AppSymbol
            name="magnifyingglass"
            size={18}
            tintColor={colors.textSecondary}
          />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={submit}
            placeholder="Search for products, brands and more..."
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            returnKeyType="search"
            autoFocus={shouldAutoFocus}
            {...formTextInputProps}
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => {
                hapticSoftTap();
                setQuery('');
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
          ) : (
            <>
              <Pressable
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Voice search"
              >
                <AppSymbol
                  name="mic.fill"
                  size={18}
                  tintColor={colors.textSecondary}
                />
              </Pressable>
              <Pressable
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Scan barcode"
              >
                <AppSymbol
                  name="qrcode.viewfinder"
                  size={18}
                  tintColor={colors.primary}
                />
              </Pressable>
            </>
          )}
        </View>

        {isBootLoading ? (
          <View style={styles.loading}>
            <Shimmer height={88} borderRadius={14} />
            <Shimmer height={36} borderRadius={14} />
            <Shimmer height={160} borderRadius={14} />
          </View>
        ) : null}

        {showSuggestions ? (
          <SearchSuggestionList
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
          />
        ) : null}

        {showBrowse && !isBootLoading ? (
          <>
            <SearchRequestBanner />
            <SearchRecentChipsSection
              items={recent}
              onSelect={navigateFromSearch}
            />
            <SearchPopularCategoriesGrid
              categories={categories}
              onSelect={handleCategorySelect}
            />
            <GroceryDealsSection
              title="Recommended for You"
              dishes={recommendedDishes}
              viewAllHref="/(tabs)/categories"
            />
            <SearchTrendingSection />
            <SearchTopBrandsSection />
            <SearchRecentlyViewedSection dishes={recentlyViewed} />
          </>
        ) : null}

        {showResults && dishResults.length > 0 ? (
          <RecommendedSection title="Matching products" dishes={dishResults} />
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
        dishResults.length === 0 ? (
          <EmptyState
            title="No matches"
            message={`Nothing found for "${trimmedQuery}". Try a different search.`}
          />
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
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
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
  loading: {
    gap: spacing.sm,
  },
});
