import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DIETARY_OPTIONS } from '@/features/auth/constants/personalization';
import type { DietaryPreference } from '@/features/auth/types/onboarding.types';
import { fetchCategories } from '@/features/catalog/api/catalog.api';
import type { Category } from '@/features/catalog/types/catalog.types';
import { resolveCategoryImageUri } from '@/lib/firebase/category-images';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { Shimmer } from '@/shared/components/shimmer';
import { hapticSelection } from '@/shared/haptics/feedback';
import { savePersonalization, skipPersonalization } from '@/store/app.store';
import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

function CategorySkeleton() {
  return (
    <View style={styles.cuisineGrid}>
      {Array.from({ length: 6 }, (_, index) => (
        <Shimmer
          key={index}
          height={108}
          borderRadius={radius.lg}
          style={styles.skeletonCard}
        />
      ))}
    </View>
  );
}

export function PersonalizationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dietary, setDietary] = useState<DietaryPreference>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetchCategories(controller.signal)
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));

    return () => controller.abort();
  }, []);

  function toggleCategory(id: string) {
    hapticSelection();
    setSelectedCategories((prev) =>
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
    savePersonalization(selectedCategories, dietary);
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
            <PremiumText
              variant="caption"
              color={colors.textSecondary}
              style={styles.skipLabel}
            >
              Skip
            </PremiumText>
          </Pressable>
        </View>

        <View style={styles.headerBlock}>
          <PremiumText
            variant="overline"
            color={colors.primary}
            style={styles.eyebrow}
          >
            Personalise your feed
          </PremiumText>
          <PremiumText style={styles.title}>
            What do you love to eat?
          </PremiumText>
          <PremiumText style={styles.subtitle}>
            Pick your favourite categories — we&apos;ll personalise your home
            feed. You can change this anytime.
          </PremiumText>
        </View>

        <PremiumText style={styles.sectionLabel}>Categories</PremiumText>
        {loadingCategories ? (
          <CategorySkeleton />
        ) : categories.length === 0 ? (
          <PremiumText color={colors.textSecondary}>
            Menu categories are loading. You can skip and explore everything.
          </PremiumText>
        ) : (
          <View style={styles.cuisineGrid}>
            {categories
              .filter((category) => resolveCategoryImageUri(category.image))
              .map((category) => {
                const imageUri = resolveCategoryImageUri(category.image);
                const active = selectedCategories.includes(category.id);
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => toggleCategory(category.id)}
                    style={[styles.cuisineCard, active && styles.cuisineActive]}
                  >
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.cuisineImage}
                        contentFit="cover"
                      />
                    ) : null}
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
                      {category.name}
                    </PremiumText>
                  </Pressable>
                );
              })}
          </View>
        )}

        <PremiumText style={styles.sectionLabel}>
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
            selectedCategories.length > 0
              ? 'Save & explore restaurants'
              : 'Continue without picks'
          }
          onPress={selectedCategories.length > 0 ? handleSave : handleSkip}
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
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skip: {
    paddingVertical: spacing.xxs,
  },
  skipLabel: {
    lineHeight: 20,
  },
  headerBlock: {
    gap: spacing.sm,
  },
  eyebrow: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    color: colors.textPrimary,
    maxWidth: '100%',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    maxWidth: '96%',
  },
  offerBanner: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
    borderCurve: 'continuous',
    ...shadows.soft,
  },
  offerTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  offerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  sectionLabel: {
    fontFamily: fonts.displaySemi,
    fontSize: 22,
    lineHeight: 30,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  skeletonCard: {
    width: '48%',
  },
  cuisineCard: {
    width: '48%',
    height: 108,
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
