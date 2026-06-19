import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CUISINE_OPTIONS,
  DIETARY_OPTIONS,
} from '@/features/auth/constants/personalization';
import type { DietaryPreference } from '@/features/auth/types/onboarding.types';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticSelection } from '@/shared/haptics/feedback';
import { savePersonalization, skipPersonalization } from '@/store/app.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export function PersonalizationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [dietary, setDietary] = useState<DietaryPreference>(null);

  function toggleCuisine(id: string) {
    hapticSelection();
    setSelectedCuisines((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  function selectDietary(id: DietaryPreference) {
    hapticSelection();
    setDietary((prev) => (prev === id ? null : id));
  }

  function handleSkip() {
    skipPersonalization();
    router.replace('/(tabs)');
  }

  function handleSave() {
    savePersonalization(selectedCuisines, dietary);
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
      >
        <View style={styles.topRow}>
          <Pressable onPress={handleSkip} hitSlop={12} style={styles.skip}>
            <PremiumText variant="bodyMedium" color={colors.textSecondary}>
              Skip
            </PremiumText>
          </Pressable>
        </View>

        <PremiumText variant="overline" color={colors.primary}>
          Personalise your feed
        </PremiumText>
        <PremiumText variant="h1">What do you love to eat?</PremiumText>
        <PremiumText variant="body" color={colors.textSecondary}>
          Pick a few favourites — we&apos;ll personalise your home feed. You can
          change this anytime.
        </PremiumText>

        <View style={styles.offerBanner}>
          <PremiumText variant="label" color={colors.primary}>
            WELCOME OFFER
          </PremiumText>
          <PremiumText variant="h3">₹100 off your first order</PremiumText>
          <PremiumText variant="caption" color={colors.textSecondary}>
            Pick favourites to unlock · 45 min left
          </PremiumText>
        </View>

        <PremiumText variant="sectionTitle" style={styles.sectionLabel}>
          Cuisines
        </PremiumText>
        <View style={styles.cuisineGrid}>
          {CUISINE_OPTIONS.map((cuisine) => {
            const active = selectedCuisines.includes(cuisine.id);
            return (
              <Pressable
                key={cuisine.id}
                onPress={() => toggleCuisine(cuisine.id)}
                style={[styles.cuisineCard, active && styles.cuisineActive]}
              >
                <Image
                  source={{ uri: cuisine.image }}
                  style={styles.cuisineImage}
                  contentFit="cover"
                />
                <View style={styles.cuisineOverlay} />
                {active ? (
                  <View style={styles.checkBadge}>
                    <AppSymbol
                      name="checkmark.circle.fill"
                      size={28}
                      tintColor={colors.textInverse}
                    />
                  </View>
                ) : null}
                <PremiumText
                  variant="captionMedium"
                  color={colors.textInverse}
                  style={styles.cuisineLabel}
                >
                  {cuisine.label}
                </PremiumText>
              </Pressable>
            );
          })}
        </View>

        <PremiumText variant="sectionTitle" style={styles.sectionLabel}>
          Dietary preference
        </PremiumText>
        <View style={styles.dietaryRow}>
          {DIETARY_OPTIONS.map((option) => {
            const active = dietary === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => selectDietary(option.id)}
                style={[styles.dietaryChip, active && styles.dietaryActive]}
              >
                <AppSymbol
                  name={option.icon}
                  size={16}
                  tintColor={active ? colors.textInverse : colors.primary}
                />
                <PremiumText
                  variant="captionMedium"
                  color={active ? colors.textInverse : colors.textPrimary}
                >
                  {option.label}
                </PremiumText>
              </Pressable>
            );
          })}
        </View>

        <PremiumButton
          label={
            selectedCuisines.length > 0
              ? 'Save & explore restaurants'
              : 'Continue without picks'
          }
          onPress={selectedCuisines.length > 0 ? handleSave : handleSkip}
          style={styles.cta}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  skip: {
    paddingVertical: spacing.xxs,
  },
  offerBanner: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xxs,
    marginTop: spacing.sm,
    borderCurve: 'continuous',
    ...shadows.soft,
  },
  sectionLabel: {
    marginTop: spacing.md,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cuisineCard: {
    width: '47%',
    height: 100,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    borderCurve: 'continuous',
  },
  cuisineActive: {
    borderColor: colors.primary,
  },
  cuisineImage: {
    ...StyleSheet.absoluteFill,
  },
  cuisineOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cuisineLabel: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  checkBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  dietaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dietaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dietaryActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cta: {
    marginTop: spacing.lg,
  },
});
