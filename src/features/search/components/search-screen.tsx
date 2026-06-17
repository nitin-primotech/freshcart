import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { searchRestaurants } from '@/features/catalog/api/catalog.api';
import type { Restaurant } from '@/features/catalog/types/catalog.types';
import { RestaurantCard } from '@/features/home/components/restaurant-card';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { PremiumText } from '@/shared/components/premium-text';
import { Shimmer } from '@/shared/components/shimmer';
import { hapticSelection } from '@/shared/haptics/feedback';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import {
  addRecentSearch,
  selectRecentSearches,
  useAppStore,
} from '@/store/app.store';
import { colors, shadows } from '@/theme/colors';
import { screenTopPadding } from '@/theme/screen-edge';
import { radius, spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';
import { fonts, typography } from '@/theme/typography';

const FILTERS = ['Top rated', 'Fastest', 'Free delivery'] as const;

function applySearchFilter(
  restaurants: Restaurant[],
  filter: (typeof FILTERS)[number] | null,
): Restaurant[] {
  if (!filter) return restaurants;
  if (filter === 'Top rated') {
    return [...restaurants].sort((a, b) => b.rating - a.rating);
  }
  if (filter === 'Fastest') {
    return [...restaurants].sort(
      (a, b) => a.deliveryTimeMin - b.deliveryTimeMin,
    );
  }
  return restaurants.filter((r) => r.isFreeDelivery);
}

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const recent = useAppStore(selectRecentSearches);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    (typeof FILTERS)[number] | null
  >(null);
  const scale = useSharedValue(1);

  const searchQuery = useSimulatedQuery(
    (signal) => searchRestaurants(query, signal),
    [query],
    { enabled: query.length >= 2 },
  );

  const searchStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onFocus = () => {
    setFocused(true);
    scale.value = withSpring(1.02, { damping: 14 });
  };

  const onBlur = () => {
    setFocused(false);
    scale.value = withSpring(1, { damping: 14 });
  };

  const submit = useCallback(() => {
    if (query.trim().length >= 2) {
      addRecentSearch(query.trim());
    }
  }, [query]);

  const showResults = query.length >= 2;
  const isLoading = showResults && searchQuery.status === 'loading';
  const filteredResults = useMemo(
    () =>
      searchQuery.data ? applySearchFilter(searchQuery.data, activeFilter) : [],
    [searchQuery.data, activeFilter],
  );

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />
      <ScrollView
        style={styles.screen}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: screenTopPadding(insets.top),
            paddingBottom: tabBarContentPadding(insets.bottom),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <PremiumText variant="display" style={styles.title}>
          Search
        </PremiumText>

        <Animated.View
          style={[styles.searchWrap, searchStyle, focused && shadows.card]}
        >
          <AppSymbol
            name="magnifyingglass"
            size={20}
            tintColor={colors.textTertiary}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onFocus={onFocus}
            onBlur={onBlur}
            onSubmitEditing={submit}
            placeholder="Restaurants, cuisines, dishes…"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')}>
              <AppSymbol
                name="xmark.circle.fill"
                size={22}
                tintColor={colors.textTertiary}
              />
            </Pressable>
          ) : null}
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f;
            return (
              <Pressable
                key={f}
                onPress={() => {
                  hapticSelection();
                  setActiveFilter(active ? null : f);
                }}
                style={[styles.filterChip, active && styles.filterActive]}
              >
                <PremiumText
                  variant="captionMedium"
                  color={active ? colors.textInverse : colors.textPrimary}
                >
                  {f}
                </PremiumText>
              </Pressable>
            );
          })}
        </ScrollView>

        {!showResults ? (
          <Animated.View entering={FadeIn.duration(300)} style={styles.recent}>
            <PremiumText variant="h3">Recent</PremiumText>
            {recent.map((term) => (
              <Pressable
                key={term}
                onPress={() => setQuery(term)}
                style={styles.recentRow}
              >
                <AppSymbol
                  name="clock.arrow.circlepath"
                  size={18}
                  tintColor={colors.textTertiary}
                />
                <PremiumText variant="body">{term}</PremiumText>
              </Pressable>
            ))}
          </Animated.View>
        ) : null}

        {isLoading ? (
          <View style={styles.loading}>
            {[1, 2, 3].map((i) => (
              <Shimmer key={i} height={220} borderRadius={24} />
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
        filteredResults.length === 0 ? (
          <EmptyState
            title="No matches"
            message={`Nothing found for "${query}". Try a different search.`}
          />
        ) : null}

        {showResults && filteredResults.length > 0
          ? filteredResults.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} index={i} />
            ))
          : null}
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
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    marginTop: 0,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderCurve: 'continuous',
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    ...typography.body,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  clear: {
    width: 20,
    height: 20,
  },
  filters: {
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  recent: {
    gap: spacing.md,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  recentIcon: {
    width: 18,
    height: 18,
  },
  loading: {
    gap: spacing.lg,
  },
});
