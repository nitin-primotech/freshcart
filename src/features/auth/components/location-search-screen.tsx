import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthContinueButton } from '@/features/auth/components/auth-continue-button';
import {
  getCurrentLocationSuggestion,
  getLocationSuggestions,
} from '@/features/auth/services/location.service';
import type {
  LocationCity,
  LocationSuggestion,
} from '@/features/auth/types/location.types';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { ScreenBackButton } from '@/shared/components/screen-back-button';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { formTextInputProps } from '@/shared/utils/keyboard';
import { setDeliveryAddressFromSuggestion } from '@/store/app.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const CITY_LABEL: Record<LocationCity, string> = {
  mohali: 'Mohali',
  delhi: 'Delhi',
  noida: 'Noida',
};

const CONFIRM_SHEET_HEIGHT = 220;

export function LocationSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [pendingSelection, setPendingSelection] =
    useState<LocationSuggestion | null>(null);

  const results = useMemo(() => getLocationSuggestions(query), [query]);

  function finishWithSuggestion(suggestion: LocationSuggestion) {
    setDeliveryAddressFromSuggestion(suggestion);
    router.back();
  }

  function selectSuggestion(suggestion: LocationSuggestion) {
    hapticSoftTap();
    Keyboard.dismiss();
    setPendingSelection(suggestion);
  }

  function proceedWithSelection() {
    if (!pendingSelection) return;
    finishWithSuggestion(pendingSelection);
  }

  function useCurrentLocation() {
    hapticSoftTap();
    selectSuggestion(getCurrentLocationSuggestion());
  }

  const listBottomPad =
    insets.bottom +
    spacing.xl +
    (pendingSelection ? CONFIRM_SHEET_HEIGHT + spacing.md : 0);

  const listHeader = (
    <View>
      <View style={styles.header}>
        <ScreenBackButton onPress={() => router.back()} />
        <PremiumText variant="h3">Change delivery location</PremiumText>
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
          placeholder="Search New York, Brooklyn, Queens…"
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

      <Pressable style={styles.actionRow} onPress={useCurrentLocation}>
        <View style={styles.actionIcon}>
          <AppSymbol
            name="location.fill"
            size={20}
            tintColor={colors.primary}
          />
        </View>
        <PremiumText
          variant="bodySmall"
          color={colors.primary}
          style={styles.actionLabel}
        >
          Use my current location
        </PremiumText>
        <AppSymbol name="chevron.right" size={16} tintColor={colors.primary} />
      </Pressable>

      <View style={styles.divider} />

      <PremiumText
        variant="overline"
        color={colors.textTertiary}
        style={styles.sectionLabel}
      >
        {query.trim().length > 0 ? 'Search results' : 'Popular areas'}
      </PremiumText>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.root}>
        <AppStatusBar style="dark" />
        <View style={[styles.content, { paddingTop: insets.top + spacing.md }]}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingBottom: listBottomPad }}
            onScrollBeginDrag={Keyboard.dismiss}
            ListHeaderComponent={listHeader}
            renderItem={({ item }) => {
              const isSelected = pendingSelection?.id === item.id;
              return (
                <Pressable
                  style={[
                    styles.resultRow,
                    isSelected && styles.resultRowSelected,
                  ]}
                  onPress={() => selectSuggestion(item)}
                >
                  <View style={styles.resultIcon}>
                    <AppSymbol
                      name="location.fill"
                      size={18}
                      tintColor={
                        isSelected ? colors.primary : colors.textSecondary
                      }
                    />
                  </View>
                  <View style={styles.resultText}>
                    <View style={styles.resultTitleRow}>
                      <PremiumText
                        variant="bodySmall"
                        style={styles.resultTitle}
                      >
                        {item.title}
                      </PremiumText>
                      <View style={styles.cityPill}>
                        <PremiumText variant="caption" color={colors.primary}>
                          {CITY_LABEL[item.city]}
                        </PremiumText>
                      </View>
                    </View>
                    <PremiumText
                      variant="caption"
                      color={colors.textSecondary}
                      numberOfLines={2}
                    >
                      {item.subtitle}
                    </PremiumText>
                  </View>
                  {isSelected ? (
                    <AppSymbol
                      name="checkmark.circle.fill"
                      size={22}
                      tintColor={colors.primary}
                    />
                  ) : null}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.empty}>
                <PremiumText variant="caption" color={colors.textSecondary}>
                  No locations found. Try a different search.
                </PremiumText>
              </View>
            }
          />
        </View>

        {pendingSelection ? (
          <View style={styles.confirmOverlay} pointerEvents="box-none">
            <Pressable
              style={styles.confirmBackdrop}
              onPress={() => {
                Keyboard.dismiss();
                setPendingSelection(null);
              }}
              accessibilityRole="button"
              accessibilityLabel="Dismiss location confirmation"
            />
            <View
              style={[
                styles.confirmSheet,
                shadows.card,
                { paddingBottom: insets.bottom + spacing.md },
              ]}
            >
              <View style={styles.confirmHandle} />
              <PremiumText variant="overline" color={colors.textTertiary}>
                Confirm delivery location
              </PremiumText>
              <View style={styles.confirmCard}>
                <View style={styles.confirmIcon}>
                  <AppSymbol
                    name="mappin.circle.fill"
                    size={28}
                    tintColor={colors.primary}
                  />
                </View>
                <View style={styles.confirmCopy}>
                  <View style={styles.resultTitleRow}>
                    <PremiumText variant="bodyMedium">
                      {pendingSelection.title}
                    </PremiumText>
                    <View style={styles.cityPill}>
                      <PremiumText variant="caption" color={colors.primary}>
                        {CITY_LABEL[pendingSelection.city]}
                      </PremiumText>
                    </View>
                  </View>
                  <PremiumText
                    variant="caption"
                    color={colors.textSecondary}
                    numberOfLines={2}
                  >
                    {pendingSelection.subtitle}
                  </PremiumText>
                </View>
              </View>
              <AuthContinueButton
                label="Confirm & proceed"
                onPress={proceedWithSelection}
              />
              <Pressable
                onPress={() => setPendingSelection(null)}
                style={styles.changeBtn}
                accessibilityRole="button"
                accessibilityLabel="Choose another location"
              >
                <PremiumText variant="bodySmall" color={colors.primary}>
                  Choose another location
                </PremiumText>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
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
  list: {
    flex: 1,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.lg,
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
    paddingHorizontal: spacing.sm,
    marginHorizontal: -spacing.sm,
    borderRadius: radius.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  resultRowSelected: {
    backgroundColor: colors.successLight,
    borderBottomColor: 'transparent',
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
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  resultTitle: {
    flexShrink: 1,
  },
  cityPill: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  empty: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  confirmOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  confirmBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  confirmSheet: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  confirmHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.xxs,
  },
  confirmCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmIcon: {
    paddingTop: 2,
  },
  confirmCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  changeBtn: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
});
