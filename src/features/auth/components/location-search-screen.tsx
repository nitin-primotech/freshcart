import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getCurrentLocationSuggestion,
  getLocationSuggestions,
} from '@/features/auth/services/location.service';
import type { LocationSuggestion } from '@/features/auth/types/location.types';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { ScreenBackButton } from '@/shared/components/screen-back-button';
import { formTextInputProps } from '@/shared/utils/keyboard';
import { setDeliveryAddressFromSuggestion } from '@/store/app.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

type LocationSearchScreenProps = {
  flow?: 'onboarding' | 'change';
};

export function LocationSearchScreen({
  flow = 'change',
}: LocationSearchScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isOnboarding = flow === 'onboarding';
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const results = useMemo(() => getLocationSuggestions(query), [query]);

  function finishWithSuggestion(suggestion: LocationSuggestion) {
    if (isOnboarding) {
      setDeliveryAddressFromSuggestion(suggestion, { onboarding: true });
      router.replace('/(auth)/personalize' as Href);
      return;
    }
    setDeliveryAddressFromSuggestion(suggestion);
    router.back();
  }

  function useCurrentLocation() {
    const suggestion = getCurrentLocationSuggestion();
    setSelectedLocation(`${suggestion.title}, ${suggestion.subtitle}`);
    setTimeout(() => {
      finishWithSuggestion(suggestion);
    }, 1500);
  }

  function handleBack() {
    if (isOnboarding) {
      router.replace('/(auth)/name' as Href);
    } else {
      router.back();
    }
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />
      <View style={[styles.content, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.header}>
          <ScreenBackButton onPress={handleBack} />
          <PremiumText variant="h2" style={styles.title}>
            {isOnboarding
              ? 'Enter your area or apartment name'
              : 'Change delivery location'}
          </PremiumText>
          {isOnboarding ? (
            <PremiumText variant="caption" color={colors.textSecondary}>
              We deliver to this area — pick the closest match
            </PremiumText>
          ) : null}
        </View>

        <View style={styles.searchWrap}>
          <AppSymbol
            name="magnifyingglass"
            size={20}
            tintColor={colors.textTertiary}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search area, street, landmark…"
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            {...formTextInputProps}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <AppSymbol
                name="xmark.circle.fill"
                size={22}
                tintColor={colors.textTertiary}
              />
            </Pressable>
          ) : null}
        </View>

        <Pressable
          style={styles.actionRow}
          onPress={useCurrentLocation}
          disabled={selectedLocation !== null}
        >
          <View style={styles.actionIcon}>
            <AppSymbol
              name="location.fill"
              size={20}
              tintColor={
                selectedLocation ? colors.textSecondary : colors.primary
              }
            />
          </View>
          {selectedLocation ? (
            <View style={styles.actionText}>
              <PremiumText variant="bodyMedium" color={colors.textPrimary}>
                {selectedLocation}
              </PremiumText>
              <PremiumText variant="caption" color={colors.textSecondary}>
                Setting location…
              </PremiumText>
            </View>
          ) : (
            <PremiumText
              variant="bodyMedium"
              color={colors.primary}
              style={styles.actionLabel}
            >
              Use my current location
            </PremiumText>
          )}
          {!selectedLocation ? (
            <AppSymbol
              name="chevron.right"
              size={16}
              tintColor={colors.primary}
            />
          ) : null}
        </Pressable>

        <View style={styles.divider} />

        <PremiumText
          variant="overline"
          color={colors.textTertiary}
          style={styles.sectionLabel}
        >
          {query.length >= 3 ? 'Search results' : 'Popular areas'}
        </PremiumText>

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.resultRow}
              onPress={() => finishWithSuggestion(item)}
            >
              <View style={styles.resultIcon}>
                <AppSymbol
                  name="location.fill"
                  size={18}
                  tintColor={colors.textSecondary}
                />
              </View>
              <View style={styles.resultText}>
                <PremiumText variant="bodyMedium">{item.title}</PremiumText>
                <PremiumText
                  variant="caption"
                  color={colors.textSecondary}
                  numberOfLines={2}
                >
                  {item.subtitle}
                </PremiumText>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <PremiumText variant="body" color={colors.textSecondary}>
                No locations found. Try a different search.
              </PremiumText>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    lineHeight: 32,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundMuted,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMedium,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  actionIcon: {
    width: 28,
    alignItems: 'center',
  },
  actionLabel: {
    flex: 1,
  },
  actionText: {
    flex: 1,
    gap: spacing.xxs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  sectionLabel: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  resultIcon: {
    width: 28,
    paddingTop: 2,
    alignItems: 'center',
  },
  resultText: {
    flex: 1,
    gap: spacing.xxs,
  },
  empty: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
});
