import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LOGIN_HERO } from '@/constants/brand-assets';
import { AuthContinueButton } from '@/features/auth/components/auth-continue-button';
import {
  isValidIndianMobile,
  sanitizeIndianPhoneInput,
} from '@/features/auth/utils/format-indian-phone';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { FreshCartLogo } from '@/shared/components/freshcart-logo';
import { GoogleGIcon } from '@/shared/components/google-g-icon';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { formTextInputProps } from '@/shared/utils/keyboard';
import { signInWithPhone } from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const HERO_BG = '#FAFCF8';
const H_PAD = spacing.lg;
const CONTINUE_BUTTON_HEIGHT = 52;
/** Input gap + Continue height + breathing room above the keyboard. */
const LOGIN_KEYBOARD_BOTTOM_OFFSET =
  spacing.md + CONTINUE_BUTTON_HEIGHT + spacing.lg + spacing.sm;

export function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const digits = sanitizeIndianPhoneInput(phone);
  const canContinue = isValidIndianMobile(digits);

  const systemBottom =
    insets.bottom > 0
      ? insets.bottom
      : process.env.EXPO_OS === 'android'
        ? 56
        : spacing.md;

  function handleContinue() {
    if (!canContinue || loading) return;
    setError(null);
    router.push({
      pathname: '/verify',
      params: { phone: digits },
    });
  }

  async function handleGoogleSignIn() {
    hapticSoftTap();
    setLoading(true);
    try {
      await signInWithPhone('9876543210');
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            <Pressable
              style={styles.countryBtn}
              onPress={hapticSoftTap}
              accessibilityRole="button"
              accessibilityLabel="Country code India plus 91"
            >
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.countryCode}>+91</Text>
              <AppSymbol
                name="chevron.down"
                size={11}
                tintColor={colors.textSecondary}
              />
            </Pressable>
            <View style={styles.inputDivider} />
            <TextInput
              value={phone}
              onChangeText={(value) => {
                setPhone(sanitizeIndianPhoneInput(value));
                if (error) setError(null);
              }}
              placeholder="Mobile number"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
              accessibilityLabel="Mobile number"
              {...formTextInputProps}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AuthContinueButton
            label="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
            loading={loading}
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
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <GoogleGIcon size={20} />
            <Text style={styles.googleLabel}>Continue with Google</Text>
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

            <Text style={styles.legal}>
              By continuing, you agree to our{' '}
              <Text
                style={styles.legalLink}
                onPress={() => router.push('/terms')}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                style={styles.legalLink}
                onPress={() => router.push('/privacy')}
              >
                Privacy Policy.
              </Text>
            </Text>
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
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingRight: spacing.sm,
  },
  flag: {
    fontSize: 20,
    lineHeight: 24,
  },
  countryCode: {
    fontFamily: fonts.poppinsSemibold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.onboardingTitle,
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
  legal: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  legalLink: {
    fontFamily: fonts.poppinsSemibold,
    color: colors.brandGreenDark,
  },
});
