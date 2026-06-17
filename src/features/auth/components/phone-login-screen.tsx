import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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

import { requestOtp } from '@/features/auth/services/auth.service';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { keyboardAvoidingBehavior } from '@/shared/utils/keyboard';
import { colors, gradients } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

export function PhoneLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleContinue() {
    setError(null);
    setIsLoading(true);
    try {
      await requestOtp(phone);
      Keyboard.dismiss();
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: phone.replace(/\D/g, '') },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  function clearPhone() {
    setPhone('');
    setError(null);
  }

  const digits = phone.replace(/\D/g, '');
  const canContinue = digits.length >= 10 && !isLoading;

  function submitPhone() {
    if (canContinue) {
      void handleContinue();
      return;
    }
    Keyboard.dismiss();
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
        <Pressable
          onPress={() => router.back()}
          style={styles.back}
          hitSlop={12}
        >
          <AppSymbol
            name="chevron.left"
            size={22}
            tintColor={colors.textInverse}
          />
        </Pressable>
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
            Enter your number
          </PremiumText>

          <View style={styles.inputWrap}>
            <PremiumText
              variant="label"
              color={colors.primary}
              style={styles.floatingLabel}
            >
              Mobile Number
            </PremiumText>
            <View style={styles.inputRow}>
              <View style={styles.country}>
                <PremiumText variant="bodyMedium">🇺🇸 +1</PremiumText>
                <AppSymbol
                  name="chevron.down"
                  size={14}
                  tintColor={colors.textPrimary}
                />
              </View>
              <View style={styles.inputDivider} />
              <TextInput
                value={phone}
                onChangeText={(t) => {
                  setPhone(t.replace(/\D/g, '').slice(0, 10));
                  setError(null);
                }}
                keyboardType="number-pad"
                textContentType="telephoneNumber"
                autoComplete="tel"
                placeholder="6502137390"
                placeholderTextColor={colors.textTertiary}
                style={styles.input}
                maxLength={10}
                returnKeyType="done"
                submitBehavior="submit"
                onSubmitEditing={submitPhone}
              />
              {phone.length > 0 ? (
                <Pressable onPress={clearPhone} hitSlop={8}>
                  <AppSymbol
                    name="xmark.circle.fill"
                    size={22}
                    tintColor={colors.textTertiary}
                  />
                </Pressable>
              ) : null}
            </View>
          </View>

          {error ? (
            <PremiumText variant="caption" color={colors.danger} selectable>
              {error}
            </PremiumText>
          ) : null}

          <PremiumButton
            label={isLoading ? 'Sending code…' : 'Continue'}
            onPress={handleContinue}
            disabled={!canContinue}
          />

          <PremiumText
            variant="caption"
            color={colors.textSecondary}
            style={styles.legal}
          >
            By continuing, I accept the{' '}
            <PremiumText variant="captionMedium" color={colors.primary}>
              terms of service
            </PremiumText>{' '}
            &{' '}
            <PremiumText variant="captionMedium" color={colors.primary}>
              privacy policy
            </PremiumText>
            .
          </PremiumText>
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
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  back: {
    marginBottom: spacing.md,
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
    gap: spacing.lg,
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
  country: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  inputDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.h3,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
  legal: {
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.sm,
  },
});
