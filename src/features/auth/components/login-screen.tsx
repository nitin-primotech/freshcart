import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthContinueButton } from '@/features/auth/components/auth-continue-button';
import {
  isValidIndianMobile,
  sanitizeIndianPhoneInput,
} from '@/features/auth/utils/format-indian-phone';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { AuthKeyboardWrapper } from '@/shared/components/auth-keyboard-wrapper';
import { GoogleGIcon } from '@/shared/components/google-g-icon';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { formTextInputProps } from '@/shared/utils/keyboard';
import { signInWithPhone } from '@/store/auth.store';
import { colors, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const digits = sanitizeIndianPhoneInput(phone);
  const canContinue = isValidIndianMobile(digits);

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

      <View
        style={[
          styles.hero,
          {
            paddingTop: insets.top + spacing.md,
            minHeight: windowHeight * 0.44,
          },
        ]}
      >
        <View style={styles.logoRow}>
          <AppSymbol name="leaf.fill" size={22} tintColor={colors.primary} />
          <AppSymbol
            name="leaf.fill"
            size={18}
            tintColor={colors.primaryLight}
            style={styles.logoLeafSecond}
          />
        </View>

        <View style={styles.heroContent}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>
              Fresh groceries,{'\n'}delivered{' '}
              <Text style={styles.heroAccent}>fast.</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Everything you need, delivered in 15–30 mins.
            </Text>
          </View>

          <Image
            source={require('@/assets/images/login-hero-basket.png')}
            style={styles.heroImage}
            contentFit="cover"
            transition={200}
          />
        </View>
      </View>

      <AuthKeyboardWrapper style={styles.keyboard}>
        <View style={[styles.card, shadows.card]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.cardContent,
              { paddingBottom: insets.bottom + spacing.lg },
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
              label="Continue →"
              onPress={handleContinue}
              disabled={!canContinue}
              loading={loading}
              showTrailingIcon={false}
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
              <GoogleGIcon size={22} />
              <Text style={styles.googleLabel}>Continue with Google</Text>
            </Pressable>

            <View style={styles.trustRow}>
              <AppSymbol
                name="checkmark.shield.fill"
                size={16}
                tintColor={colors.primary}
              />
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
          </ScrollView>
        </View>
      </AuthKeyboardWrapper>
    </View>
  );
}

const CARD_RADIUS = 32;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoLeafSecond: {
    marginLeft: -6,
    marginTop: 4,
    opacity: 0.85,
  },
  heroContent: {
    minHeight: 224,
    justifyContent: 'flex-end',
  },
  heroCopy: {
    width: '54%',
    paddingBottom: spacing.xl,
    zIndex: 1,
  },
  heroTitle: {
    fontFamily: fonts.bold,
    fontSize: 30,
    lineHeight: 36,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  heroAccent: {
    color: colors.primary,
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  heroImage: {
    position: 'absolute',
    right: -spacing.sm,
    bottom: -spacing.sm,
    width: 194,
    height: 214,
    borderRadius: 8,
  },
  keyboard: {
    flex: 1,
  },
  card: {
    flex: 1,
    marginTop: -CARD_RADIUS,
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    borderCurve: 'continuous',
  },
  cardContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  formHeader: {
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  formTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  formSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundElevated,
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
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  inputDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.borderStrong,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  error: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.danger,
    marginTop: -spacing.xs,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  orText: {
    fontFamily: fonts.regular,
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
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  trustText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  legal: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  legalLink: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});
