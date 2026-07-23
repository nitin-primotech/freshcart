import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardController } from 'react-native-keyboard-controller';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContinueButton } from '@/features/auth/components/auth-continue-button';
import type { OtpDigitStatus } from '@/features/auth/components/verification-code/animated-code-number';
import { useAnimatedShake } from '@/features/auth/components/verification-code/use-animated-shake';
import { VerificationCode } from '@/features/auth/components/verification-code/verification-code';
import {
  formatDialCode,
  formatPhoneDisplay,
  isValidPhoneNumber,
  phoneCountryFromParams,
  sanitizePhoneInput,
} from '@/features/auth/utils/phone-number';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { AuthKeyboardWrapper } from '@/shared/components/auth-keyboard-wrapper';
import { FreshCartLogo } from '@/shared/components/freshcart-logo';
import { ScreenBackButton } from '@/shared/components/screen-back-button';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  formTextInputProps,
  keyboardAppearance,
} from '@/shared/utils/keyboard';
import { signInWithPhone } from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
/** Android needs extra settle time after login keyboard dismiss + push transition. */
const OTP_FOCUS_DELAY_MS = process.env.EXPO_OS === 'android' ? 450 : 150;

function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function OtpVerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    phone: phoneParam,
    countryCode,
    callingCode,
  } = useLocalSearchParams<{
    phone: string;
    countryCode?: string;
    callingCode?: string;
  }>();
  const phoneCountry = phoneCountryFromParams(countryCode, callingCode);
  const phone = sanitizePhoneInput(phoneParam ?? '', phoneCountry);

  const [code, setCode] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const verificationStatus = useSharedValue<OtpDigitStatus>('inProgress');
  const invisibleInputRef = useRef<TextInput>(null);
  const { shake, rShakeStyle } = useAnimatedShake();

  const codeString = code.join('');
  const canVerify = codeString.length === OTP_LENGTH && !loading;
  const canResend = secondsLeft <= 0 && !resending;

  useEffect(() => {
    if (!isValidPhoneNumber(phone, phoneCountry)) {
      router.replace('/login');
    }
  }, [phone, phoneCountry, router]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const task = InteractionManager.runAfterInteractions(() => {
        timer = setTimeout(() => {
          if (cancelled) return;
          invisibleInputRef.current?.focus();
        }, OTP_FOCUS_DELAY_MS);
      });

      return () => {
        cancelled = true;
        task.cancel();
        if (timer) clearTimeout(timer);
        invisibleInputRef.current?.blur();
      };
    }, []),
  );

  const resetCode = useCallback(() => {
    setTimeout(() => {
      verificationStatus.value = 'inProgress';
      setCode([]);
      invisibleInputRef.current?.clear();
      invisibleInputRef.current?.focus();
    }, 900);
  }, [verificationStatus]);

  const completeSignIn = useCallback(async () => {
    if (!isValidPhoneNumber(phone, phoneCountry) || loading) return;

    verificationStatus.value = 'correct';
    setLoading(true);

    try {
      await signInWithPhone(phone);
      invisibleInputRef.current?.blur();
      await KeyboardController.dismiss({ animated: false });
      if (router.canGoBack()) {
        router.dismissAll();
      }
      router.replace('/(tabs)');
    } catch {
      verificationStatus.value = 'wrong';
      shake();
      resetCode();
      setLoading(false);
    }
  }, [
    loading,
    phone,
    phoneCountry,
    resetCode,
    router,
    shake,
    verificationStatus,
  ]);

  function handleVerifyPress() {
    if (!canVerify) return;
    void completeSignIn();
  }

  function handleTextChange(text: string) {
    if (loading) return;

    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    const nextCode = digits.split('').map((digit) => Number(digit));
    setCode(nextCode);
    verificationStatus.value = 'inProgress';
  }

  async function handleResend() {
    if (!canResend) return;
    hapticSoftTap();
    setResending(true);
    try {
      setSecondsLeft(RESEND_SECONDS);
      resetCode();
    } finally {
      setResending(false);
    }
  }

  function handleEditPhone() {
    hapticSoftTap();
    router.back();
  }

  if (!isValidPhoneNumber(phone, phoneCountry)) {
    return null;
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xs }]}>
        <ScreenBackButton onPress={() => router.back()} />
      </View>

      <AuthKeyboardWrapper style={styles.keyboard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + spacing.xl },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.logo}>
              <FreshCartLogo height={36} />
            </View>
            <Text style={styles.title}>Verify your number</Text>
            <Text style={styles.subtitle}>
              We&apos;ve sent a 6-digit OTP to
            </Text>
            <View style={styles.phoneRow}>
              <Text style={styles.phone}>
                {formatDialCode(phoneCountry.callingCode)}{' '}
                {formatPhoneDisplay(phone, phoneCountry)}
              </Text>
              <Pressable
                onPress={handleEditPhone}
                style={styles.editBtn}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Edit phone number"
              >
                <AppSymbol name="pencil" size={14} tintColor={colors.primary} />
                <Text style={styles.editLabel}>Edit</Text>
              </Pressable>
            </View>
          </View>

          <Animated.View style={[styles.codeWrap, rShakeStyle]}>
            <VerificationCode
              code={code}
              maxLength={OTP_LENGTH}
              status={verificationStatus}
            />
            <TextInput
              ref={invisibleInputRef}
              value={codeString}
              onChangeText={handleTextChange}
              keyboardType="number-pad"
              keyboardAppearance={keyboardAppearance}
              maxLength={OTP_LENGTH}
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              autoFocus
              caretHidden
              showSoftInputOnFocus
              importantForAutofill="yes"
              style={styles.overlayInput}
              accessibilityLabel="OTP input"
              blurOnSubmit={false}
              {...formTextInputProps}
            />
          </Animated.View>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>
              Didn&apos;t receive the code?{' '}
            </Text>
            {canResend ? (
              <Pressable
                onPress={() => void handleResend()}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Resend OTP"
              >
                <Text style={styles.resendLink}>
                  {resending ? 'Sending…' : 'Resend OTP'}
                </Text>
              </Pressable>
            ) : (
              <Text style={styles.resendText}>
                <Text style={styles.resendLink}>Resend OTP</Text>
                {' in '}
                {formatCountdown(secondsLeft)}
              </Text>
            )}
          </View>

          <AuthContinueButton
            label="Verify & Continue"
            onPress={handleVerifyPress}
            disabled={!canVerify}
            loading={loading}
            showTrailingIcon
            inlineArrow
            tone="brand"
          />

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
        </ScrollView>
      </AuthKeyboardWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    alignItems: 'stretch',
    gap: spacing.lg,
  },
  header: {
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  logo: {
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  phone: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  editLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.primary,
  },
  codeWrap: {
    position: 'relative',
    paddingVertical: spacing.sm,
  },
  overlayInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    color: 'transparent',
    fontSize: 1,
  },
  resendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -spacing.xs,
  },
  resendText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  resendLink: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.primary,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  trustText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
