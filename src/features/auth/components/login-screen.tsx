import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardController,
} from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LOGIN_HERO } from '@/constants/brand-assets';
import { AuthContinueButton } from '@/features/auth/components/auth-continue-button';
import { CountryCodePickerButton } from '@/features/auth/components/country-code-picker-button';
import type { PhoneCountry } from '@/features/auth/types/phone-country.types';
import { DEFAULT_PHONE_COUNTRY } from '@/features/auth/types/phone-country.types';
import {
  isValidPhoneNumber,
  sanitizePhoneInput,
} from '@/features/auth/utils/phone-number';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { FreshCartLogo } from '@/shared/components/freshcart-logo';
import { GoogleGIcon } from '@/shared/components/google-g-icon';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { formTextInputProps } from '@/shared/utils/keyboard';
import {
  GoogleSignInCancelledError,
  mapGoogleSignInError,
  signInWithGoogle,
} from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const HERO_BG = '#FAFCF8';
const H_PAD = spacing.lg;
const CONTINUE_BUTTON_HEIGHT = 52;
/** Input gap + Continue height + breathing room above the keyboard. */
const LOGIN_KEYBOARD_BOTTOM_OFFSET = spacing.md + CONTINUE_BUTTON_HEIGHT;

export function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<PhoneCountry>(DEFAULT_PHONE_COUNTRY);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const busy = googleLoading;
  const digits = sanitizePhoneInput(phone, country);
  const canContinue = isValidPhoneNumber(digits, country);
  const phoneMaxLength = country.cca2 === 'IN' ? 10 : 15;

  const systemBottom =
    insets.bottom > 0
      ? insets.bottom
      : process.env.EXPO_OS === 'android'
        ? 56
        : spacing.md;

  const navigateHome = async () => {
    await KeyboardController.dismiss({ animated: false });
    if (router.canGoBack()) {
      router.dismissAll();
    }
    router.replace('/(tabs)');
  };

  async function handleContinue() {
    if (!canContinue || busy) return;
    setError(null);
    // Close login keyboard so OTP autofocus can open a fresh soft keyboard on Android.
    await KeyboardController.dismiss({ animated: false });
    router.push({
      pathname: '/verify',
      params: {
        phone: digits,
        countryCode: country.cca2,
        callingCode: country.callingCode,
      },
    });
  }

  async function handleGoogleSignIn() {
    hapticSoftTap();
    if (busy) return;
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      await navigateHome();
    } catch (err) {
      if (err instanceof GoogleSignInCancelledError) {
        return;
      }
      setError(mapGoogleSignInError(err));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bottomOffset={LOGIN_KEYBOARD_BOTTOM_OFFSET}
        extraKeyboardSpace={spacing.md}
      >
        <View
          style={[styles.topSection, { paddingTop: insets.top + spacing.xl }]}
        >
          <View style={styles.heroVisualAbsolute}>
            <Image
              source={LOGIN_HERO}
              style={styles.heroImage}
              contentFit="cover"
              contentPosition="right center"
              cachePolicy="memory-disk"
              priority="high"
              accessibilityLabel="Fresh groceries bag"
            />
          </View>

          <View style={styles.logo}>
            <FreshCartLogo height={44} />
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>
              {'Fresh\ngroceries,\ndelivered '}
              <Text style={styles.heroAccent}>fast.</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              {'Everything you need,\ndelivered in '}
              <Text style={styles.heroSubtitleAccent}>15–30 mins.</Text>
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.formCard,
            { paddingBottom: systemBottom + spacing.md },
          ]}
        >
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Enter your mobile number</Text>
            <Text style={styles.formSubtitle}>
              We&apos;ll send you a One Time Password (OTP)
            </Text>
          </View>

          <View style={styles.inputWrap}>
            <CountryCodePickerButton
              country={country}
              onSelect={(nextCountry) => {
                setCountry(nextCountry);
                setPhone(sanitizePhoneInput(phone, nextCountry));
                if (error) setError(null);
              }}
            />
            <View style={styles.inputDivider} />
            <TextInput
              value={phone}
              onChangeText={(value) => {
                setPhone(sanitizePhoneInput(value, country));
                if (error) setError(null);
              }}
              placeholder="Mobile number"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={phoneMaxLength}
              style={styles.input}
              accessibilityLabel="Mobile number"
              {...formTextInputProps}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AuthContinueButton
            label="Continue"
            onPress={handleContinue}
            disabled={!canContinue || busy}
            showTrailingIcon
            inlineArrow
            tone="brand"
          />

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or continue with</Text>
            <View style={styles.orLine} />
          </View>

          <Pressable
            style={styles.googleBtn}
            onPress={handleGoogleSignIn}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <GoogleGIcon size={20} />
            <Text style={styles.googleLabel}>
              {googleLoading ? 'Signing in…' : 'Continue with Google'}
            </Text>
          </Pressable>

          <View style={styles.footerBlock}>
            <View style={styles.trustRow}>
              <View style={styles.padlockCircle}>
                <AppSymbol
                  name="lock.fill"
                  size={12}
                  tintColor={colors.brandGreen}
                />
              </View>
              <Text style={styles.trustText}>
                Secure login. We never share your number.
              </Text>
            </View>

            <View style={styles.legalRow}>
              <Text style={styles.legal}>By continuing, you agree to our </Text>
              <Pressable
                onPress={() => router.push('/terms')}
                hitSlop={6}
                android_ripple={{ color: 'transparent' }}
                accessibilityRole="link"
                accessibilityLabel="Terms of Service"
              >
                <Text style={styles.legalLink}>Terms of Service</Text>
              </Pressable>
              <Text style={styles.legal}> and </Text>
              <Pressable
                onPress={() => router.push('/privacy')}
                hitSlop={6}
                android_ripple={{ color: 'transparent' }}
                accessibilityRole="link"
                accessibilityLabel="Privacy Policy"
              >
                <Text style={styles.legalLink}>Privacy Policy.</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    backgroundColor: HERO_BG,
    paddingHorizontal: H_PAD,
    paddingBottom: 80,
    minHeight: 340,
    position: 'relative',
    overflow: 'visible',
  },
  heroVisualAbsolute: {
    position: 'absolute',
    bottom: -5,
    right: 0,
    width: '90%',
    height: 380,
    zIndex: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  logo: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    zIndex: 3,
  },
  heroCopy: {
    width: '58%',
    gap: spacing.md,
    zIndex: 2,
  },
  heroTitle: {
    fontFamily: fonts.poppinsBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.6,
    color: colors.onboardingTitle,
  },
  heroAccent: {
    fontFamily: fonts.poppinsBold,
    color: colors.brandGreen,
  },
  heroSubtitle: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.onboardingBody,
  },
  heroSubtitleAccent: {
    fontFamily: fonts.poppinsSemibold,
    color: colors.brandGreen,
  },
  formCard: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderCurve: 'continuous',
    paddingHorizontal: H_PAD,
    paddingTop: 32,
    marginTop: -32,
    gap: spacing.md,
    boxShadow: '0 -4px 20px rgba(28, 28, 30, 0.04)',
    zIndex: 3,
  },
  formHeader: {
    gap: spacing.xxs,
  },
  formTitle: {
    fontFamily: fonts.poppinsBold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.onboardingTitle,
  },
  formSubtitle: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.onboardingBody,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundElevated,
    boxShadow: '0 4px 18px rgba(28, 28, 30, 0.03)',
  },
  inputDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.borderStrong,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.poppinsMedium,
    fontSize: 16,
    color: colors.onboardingTitle,
    paddingVertical: 0,
    textAlignVertical: 'center',
    ...(process.env.EXPO_OS === 'android' ? { includeFontPadding: false } : {}),
  },
  error: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.danger,
    marginTop: -spacing.xxs,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  orText: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textTertiary,
  },
  googleBtn: {
    minHeight: 52,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  googleLabel: {
    fontFamily: fonts.poppinsSemibold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.onboardingTitle,
  },
  footerBlock: {
    marginTop: 'auto',
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  padlockCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.onboardingCurve,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustText: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  legalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  legal: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  legalLink: {
    fontFamily: fonts.poppinsSemibold,
    fontSize: 11,
    lineHeight: 16,
    color: colors.brandGreenDark,
  },
});
