import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getCurrentLocationSuggestion,
  getLocationById,
  getLocationSuggestions,
} from '@/features/auth/services/location.service';
import type {
  LocationSuggestion,
  SavedAddress,
} from '@/features/auth/types/location.types';
import { AddAddressBanner } from '@/features/location/components/add-address-banner';
import { DeliveryMapPreview } from '@/features/location/components/delivery-map-preview';
import { RecentLocationRow } from '@/features/location/components/recent-location-row';
import { SavedAddressCard } from '@/features/location/components/saved-address-card';
import {
  getSuggestionCoordinates,
  suggestionFromAddress,
} from '@/features/location/utils/location-helpers';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { ScreenBackButton } from '@/shared/components/screen-back-button';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { formTextInputProps } from '@/shared/utils/keyboard';
import {
  selectAddress,
  selectFavoriteLocationIds,
  selectRecentLocationIds,
  setDeliveryAddressFromSuggestion,
  toggleFavoriteLocation,
  useAppStore,
} from '@/store/app.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

export function LocationSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const address = useAppStore(selectAddress);
  const recentLocationIds = useAppStore(selectRecentLocationIds);
  const favoriteLocationIds = useAppStore(selectFavoriteLocationIds);

  const [query, setQuery] = useState('');
  const [mapCenter, setMapCenter] = useState(() =>
    getSuggestionCoordinates(suggestionFromAddress(address)),
  );
  const [detectingLocation, setDetectingLocation] = useState(false);

  const searchResults = useMemo(() => getLocationSuggestions(query), [query]);
  const isSearching = query.trim().length > 0;

  const savedAddresses = useMemo<SavedAddress[]>(
    () => [
      {
        id: 'home',
        label: address.label,
        isDefault: true,
        suggestion: suggestionFromAddress(address),
      },
    ],
    [address],
  );

  const recentLocations = useMemo(
    () =>
      recentLocationIds
        .map((id) => getLocationById(id))
        .filter((location): location is LocationSuggestion =>
          Boolean(location),
        ),
    [recentLocationIds],
  );

  const finishWithSuggestion = useCallback(
    (suggestion: LocationSuggestion) => {
      setDeliveryAddressFromSuggestion(suggestion);
      router.back();
    },
    [router],
  );

  const previewSuggestion = useCallback((suggestion: LocationSuggestion) => {
    setMapCenter(getSuggestionCoordinates(suggestion));
  }, []);

  const handleSelectSuggestion = useCallback(
    (suggestion: LocationSuggestion) => {
      previewSuggestion(suggestion);
      Keyboard.dismiss();
      finishWithSuggestion(suggestion);
    },
    [finishWithSuggestion, previewSuggestion],
  );

  const handleUseCurrentLocation = useCallback(async () => {
    if (detectingLocation) return;
    hapticSoftTap();
    setDetectingLocation(true);
    try {
      const suggestion = await getCurrentLocationSuggestion();
      previewSuggestion(suggestion);
      finishWithSuggestion(suggestion);
    } finally {
      setDetectingLocation(false);
    }
  }, [detectingLocation, finishWithSuggestion, previewSuggestion]);

  const searchList = (
    <FlatList
      data={searchResults}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={false}
      ListEmptyComponent={
        <View style={styles.emptySearch}>
          <PremiumText style={styles.emptySearchText}>
            No locations found. Try sector, landmark, or city name.
          </PremiumText>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.searchResultRow}
          onPress={() => {
            hapticSoftTap();
            handleSelectSuggestion(item);
          }}
          accessibilityRole="button"
          accessibilityLabel={`Select ${item.title}`}
        >
          <View style={styles.searchResultIcon}>
            <AppSymbol
              name="location.fill"
              size={16}
              tintColor={colors.primary}
            />
          </View>
          <View style={styles.searchResultBody}>
            <PremiumText style={styles.searchResultTitle}>
              {item.title}
            </PremiumText>
            <PremiumText style={styles.searchResultSubtitle} numberOfLines={1}>
              {item.subtitle}
            </PremiumText>
          </View>
          <AppSymbol
            name="chevron.right"
            size={14}
            tintColor={colors.textTertiary}
          />
        </Pressable>
      )}
    />
  );

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.sm,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={spacing.lg}
        extraKeyboardSpace={spacing.sm}
      >
        <View style={styles.header}>
          <ScreenBackButton onPress={() => router.back()} />
          <View style={styles.headerCopy}>
            <PremiumText style={styles.title}>
              Select Delivery Location
            </PremiumText>
            <PremiumText style={styles.subtitle}>
              Where should we deliver your order?
            </PremiumText>
          </View>
        </View>

        <View style={styles.searchBar}>
          <AppSymbol
            name="magnifyingglass"
            size={16}
            tintColor={colors.textSecondary}
          />
          <TextInput
            {...formTextInputProps}
            value={query}
            onChangeText={setQuery}
            placeholder="Search area, street or landmark"
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
            returnKeyType="search"
            accessibilityLabel="Search delivery location"
          />
          <Pressable
            onPress={handleUseCurrentLocation}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Locate me"
          >
            {detectingLocation ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <AppSymbol
                name="location.fill"
                size={18}
                tintColor={colors.primary}
              />
            )}
          </Pressable>
        </View>

        <View style={styles.mapSection}>
          <DeliveryMapPreview
            latitude={mapCenter.latitude}
            longitude={mapCenter.longitude}
          />

          <Pressable
            style={styles.currentLocationCard}
            onPress={handleUseCurrentLocation}
            disabled={detectingLocation}
            accessibilityRole="button"
            accessibilityLabel="Use current location"
          >
            <View style={styles.currentLocationIcon}>
              {detectingLocation ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <AppSymbol
                  name="location.fill"
                  size={18}
                  tintColor={colors.primary}
                />
              )}
            </View>
            <View style={styles.currentLocationCopy}>
              <PremiumText style={styles.currentLocationTitle}>
                Use Current Location
              </PremiumText>
              <PremiumText style={styles.currentLocationSubtitle}>
                Detect my accurate location
              </PremiumText>
            </View>
          </Pressable>
        </View>

        {isSearching ? (
          <View style={styles.section}>
            <PremiumText style={styles.sectionTitle}>
              Search Results
            </PremiumText>
            <View style={styles.listCard}>{searchList}</View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <PremiumText style={styles.sectionTitle}>
                  Saved Addresses
                </PremiumText>
                <Pressable
                  onPress={() => router.push('/profile/edit')}
                  accessibilityRole="button"
                  accessibilityLabel="View all saved addresses"
                >
                  <PremiumText style={styles.sectionAction}>
                    View all
                  </PremiumText>
                </Pressable>
              </View>

              {savedAddresses.map((savedAddress) => (
                <SavedAddressCard
                  key={savedAddress.id}
                  address={savedAddress}
                  onPress={() =>
                    handleSelectSuggestion(savedAddress.suggestion)
                  }
                  onEdit={() => router.push('/profile/edit')}
                />
              ))}
            </View>

            <View style={styles.section}>
              <PremiumText style={styles.sectionTitle}>
                Recent Locations
              </PremiumText>
              <View style={styles.listCard}>
                {recentLocations.map((location, index) => (
                  <RecentLocationRow
                    key={location.id}
                    location={location}
                    isFavorite={favoriteLocationIds.includes(location.id)}
                    isLast={index === recentLocations.length - 1}
                    onPress={() => handleSelectSuggestion(location)}
                    onToggleFavorite={() => toggleFavoriteLocation(location.id)}
                  />
                ))}
              </View>
            </View>

            <AddAddressBanner onPress={() => router.push('/profile/edit')} />
          </>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  header: {
    gap: spacing.sm,
  },
  headerCopy: {
    gap: 4,
  },
  title: {
    ...typography.h3,
    fontSize: 18,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    ...typography.bodySmall,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
  mapSection: {
    position: 'relative',
    minHeight: 220,
  },
  currentLocationCard: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: '70%',
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    boxShadow: '0 4px 16px rgba(28, 28, 30, 0.14)',
  },
  currentLocationIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationCopy: {
    flex: 1,
    gap: 1,
  },
  currentLocationTitle: {
    ...typography.captionMedium,
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
  currentLocationSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.bodyMedium,
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
  sectionAction: {
    ...typography.captionMedium,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  searchResultIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultBody: {
    flex: 1,
    gap: 2,
  },
  searchResultTitle: {
    ...typography.bodyMedium,
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
  searchResultSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptySearch: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptySearchText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
