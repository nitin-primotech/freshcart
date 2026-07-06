import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
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

import { fetchCategories } from '@/features/catalog/api/catalog.api';
import { resolveCategoryImageUri } from '@/lib/firebase/category-images';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { ErrorState } from '@/shared/components/error-state';
import { Shimmer } from '@/shared/components/shimmer';
import { useSimulatedQuery } from '@/shared/hooks/use-simulated-query';
import { colors, shadows } from '@/theme/colors';
import { screenTopPadding } from '@/theme/screen-edge';
import { radius, spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';
import { fonts } from '@/theme/typography';

export function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const gap = spacing.md;
  const tileWidth = (width - spacing.md * 2 - gap) / 2;

  const categoriesQuery = useSimulatedQuery(
    (signal) => fetchCategories(signal),
    [],
  );

  const onRefresh = useCallback(() => {
    categoriesQuery.refetch();
  }, [categoriesQuery]);

  const isLoading = categoriesQuery.status === 'loading';
  const hasError = categoriesQuery.status === 'error';

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />
      <View
        style={[styles.header, { paddingTop: screenTopPadding(insets.top) }]}
      >
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Browse all grocery departments</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: tabBarContentPadding(insets.bottom) },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={categoriesQuery.isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {isLoading ? (
          <View style={styles.skeletonRow}>
            <Shimmer height={140} borderRadius={radius.lg} />
            <Shimmer height={140} borderRadius={radius.lg} />
          </View>
        ) : null}

        {hasError ? (
          <ErrorState
            message="Could not load categories."
            onRetry={onRefresh}
          />
        ) : null}

        <View style={styles.tiles}>
          {(categoriesQuery.data ?? []).map((category) => {
            const imageUri = resolveCategoryImageUri(category.image);
            return (
              <Pressable
                key={category.id}
                style={[styles.tile, { width: tileWidth }, shadows.soft]}
                onPress={() => router.push(`/category/${category.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`Browse ${category.name}`}
              >
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    contentFit="cover"
                    transition={200}
                  />
                ) : null}
                <View style={styles.tileOverlay}>
                  <Text style={styles.tileLabel} numberOfLines={2}>
                    {category.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
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
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xxs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  grid: {
    paddingHorizontal: spacing.md,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    height: 140,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.backgroundMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tileOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    padding: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  tileLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.textInverse,
  },
});
