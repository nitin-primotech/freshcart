import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
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
import {
  keyboardAppearance,
  keyboardAvoidingBehavior,
} from '@/shared/utils/keyboard';
import { colors, gradients } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function PhoneLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
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
    inputRef.current?.focus();
  }

  const digits = phone.replace(/\D/g, '');
  const canContinue = digits.length >= 10 && !isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={keyboardAvoidingBehavior}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={gradients.primary.colors}
          start={gradients.primary.start}
          end={gradients.primary.end}
          style={StyleSheet.flatten([
            styles.hero,
            { paddingTop: insets.top + spacing.lg },
          ])}
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.back}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppSymbol
              name="chevron.left"
              size={22}
              tintColor={colors.textInverse}
            />
          </Pressable>
          <View style={styles.heroLogo}>
            <View style={styles.logoMark}>
              <Image
                source={require('@/assets/images/foodrushlogo.png')}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>
          </View>
          <PremiumText
            variant="bodyMedium"
            color={colors.textInverse}
            style={styles.heroText}
          >
            Restaurant food, rushed to your door
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

        <View style={styles.sheet}>
          <PremiumText variant="h2" style={styles.title}>
            Enter your number
          </PremiumText>

          <View style={styles.inputWrap}>
            <View style={styles.floatingLabel}>
              <PremiumText variant="label" color={colors.primary}>
                Mobile Number
              </PremiumText>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.country}>
                <PremiumText variant="bodyMedium">🇮🇳</PremiumText>
                <PremiumText variant="bodyMedium" style={styles.countryCode}>
                  +91
                </PremiumText>
                <AppSymbol
                  name="chevron.down"
                  size={12}
                  tintColor={colors.textSecondary}
                />
              </View>
              <View style={styles.inputDivider} />
              <TextInput
                ref={inputRef}
                value={phone}
                onChangeText={(t) => {
                  setPhone(t.replace(/\D/g, '').slice(0, 10));
                  setError(null);
                }}
                keyboardType="number-pad"
                keyboardAppearance={keyboardAppearance}
                textContentType="telephoneNumber"
                autoComplete="tel"
                placeholder="10-digit mobile"
                placeholderTextColor={colors.textTertiary}
                style={styles.input}
                maxLength={10}
                selectionColor={colors.textPrimary}
                blurOnSubmit
              />
              {phone.length > 0 ? (
                <Pressable
                  onPress={clearPhone}
                  hitSlop={8}
                  style={styles.clearBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Clear phone number"
                >
                  <AppSymbol
                    name="xmark.circle.fill"
                    size={20}
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

          <View style={styles.spacer} />

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
            <PremiumText
              variant="captionMedium"
              color={colors.primary}
              onPress={() => router.push('/(auth)/terms')}
            >
              terms of service
            </PremiumText>{' '}
            &{' '}
            <PremiumText
              variant="captionMedium"
              color={colors.primary}
              onPress={() => router.push('/(auth)/privacy')}
            >
              privacy policy
            </PremiumText>
            .
          </PremiumText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  scrollContent: {
    flexGrow: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 72,
    height: 72,
  },
  heroText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
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
  sheet: {
    flexGrow: 1,
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
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
    borderCurve: 'continuous',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    minHeight: 64,
    justifyContent: 'center',
  },
  floatingLabel: {
    position: 'absolute',
    top: -11,
    left: spacing.md,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
  },
  country: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingRight: spacing.sm,
  },
  countryCode: {
    fontFamily: fonts.semibold,
  },
  inputDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginRight: spacing.md,
    backgroundColor: colors.borderStrong,
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 24,
    color: colors.textPrimary,
    paddingVertical: 0,
    letterSpacing: 0.5,
  },
  clearBtn: {
    marginLeft: spacing.xs,
  },
  spacer: {
    flex: 1,
  },
  legal: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
