import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { keyboardAvoidingBehavior } from '@/shared/utils/keyboard';
import { setUserName } from '@/store/app.store';
import { colors, gradients } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

export function NameEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const canContinue = name.trim().length >= 2;

  function handleContinue() {
    if (!canContinue) return;
    Keyboard.dismiss();
    setUserName(name.trim());
    router.replace('/location?onboarding=1' as Href);
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.primary.colors}
        style={StyleSheet.flatten([
          styles.hero,
          { paddingTop: insets.top + spacing.lg },
        ])}
      >
        <View style={styles.heroLogo}>
          <View style={styles.logoMark}>
            <PremiumText variant="h3" color={colors.primary}>
              FR
            </PremiumText>
          </View>
        </View>
        <PremiumText
          variant="bodyMedium"
          color={colors.textInverse}
          style={styles.heroText}
        >
          One app for food, grocery, dining & more in minutes!
        </PremiumText>
        <View style={styles.heroImages}>
          <Image
            source="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80"
            style={styles.heroThumb}
            contentFit="cover"
          />
          <Image
            source="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&q=80"
            style={StyleSheet.flatten([
              styles.heroThumb,
              styles.heroThumbCenter,
            ])}
            contentFit="cover"
          />
          <Image
            source="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80"
            style={styles.heroThumb}
            contentFit="cover"
          />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={keyboardAvoidingBehavior}
        style={styles.sheetContainer}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={StyleSheet.flatten([
            styles.sheet,
            { paddingBottom: insets.bottom + spacing.lg },
          ])}
        >
          <PremiumText variant="h2" style={styles.title}>
            What&apos;s your name?
          </PremiumText>

          <View style={styles.inputWrap}>
            <PremiumText
              variant="label"
              color={colors.primary}
              style={styles.floatingLabel}
            >
              Enter Full Name
            </PremiumText>
            <View style={styles.inputRow}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Sam Lee"
                placeholderTextColor={colors.textTertiary}
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="name"
                autoComplete="name"
                returnKeyType="done"
                submitBehavior="submit"
                onSubmitEditing={handleContinue}
              />
              {name.length > 0 ? (
                <Pressable onPress={() => setName('')} hitSlop={8}>
                  <AppSymbol
                    name="xmark.circle.fill"
                    size={22}
                    tintColor={colors.textTertiary}
                  />
                </Pressable>
              ) : null}
            </View>
          </View>

          <PremiumButton
            label="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  heroLogo: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  heroImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroThumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.textInverse,
  },
  heroThumbCenter: {
    width: 88,
    height: 88,
  },
  sheetContainer: {
    flex: 1,
    marginTop: -spacing.xxl,
  },
  sheet: {
    flexGrow: 1,
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.xl,
    borderCurve: 'continuous',
  },
  title: {
    marginTop: spacing.sm,
  },
  inputWrap: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: spacing.md,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.xxs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.h3,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
});
