import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  InteractionManager,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';

import { AuthContinueButton } from '@/features/auth/components/auth-continue-button';
import { AuthOnboardingShell } from '@/features/auth/components/auth-onboarding-shell';
import type { OtpDigitStatus } from '@/features/auth/components/verification-code/animated-code-number';
import { useAnimatedShake } from '@/features/auth/components/verification-code/use-animated-shake';
import { VerificationCode } from '@/features/auth/components/verification-code/verification-code';
import { OTP_ONBOARDING_COPY } from '@/features/auth/constants/auth-onboarding.constants';
import { authScreenStyles } from '@/features/auth/constants/auth-screen.styles';
import {
  requestOtp,
  verifyOtpAndCreateSession,
} from '@/features/auth/services/auth.service';
import { formatIndianPhone } from '@/features/auth/utils/format-indian-phone';
import {
  formTextInputProps,
  keyboardAppearance,
} from '@/shared/utils/keyboard';
import { setAuthSession } from '@/store/auth.store';

const OTP_LENGTH = 4;
const CORRECT_OTP = 1234;

export function OtpVerifyScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const verificationStatus = useSharedValue<OtpDigitStatus>('inProgress');
  const invisibleInputRef = useRef<TextInput>(null);
  const { shake, rShakeStyle } = useAnimatedShake();

  const masked = phone ? formatIndianPhone(phone) : '';
  const codeString = code.join('');
  const canVerify = codeString.length === OTP_LENGTH && !isLoading;

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        invisibleInputRef.current?.focus();
      }, 400);
      return () => clearTimeout(timer);
    }, []),
  );

  const resetCode = useCallback(() => {
    setTimeout(() => {
      verificationStatus.value = 'inProgress';
      setCode([]);
      invisibleInputRef.current?.clear();
    }, 1000);
  }, [verificationStatus]);

  const onWrongCode = useCallback(() => {
    verificationStatus.value = 'wrong';
    shake();
    resetCode();
  }, [resetCode, shake, verificationStatus]);

  const onCorrectCode = useCallback(async () => {
    if (!phone || isLoading) return;
    verificationStatus.value = 'correct';
    setIsLoading(true);

    try {
      const session = await verifyOtpAndCreateSession(phone, codeString);
      await setAuthSession(session);
      Keyboard.dismiss();
      InteractionManager.runAfterInteractions(() => {
        router.replace('/(auth)/name');
      });
    } catch {
      verificationStatus.value = 'wrong';
      shake();
      resetCode();
      setIsLoading(false);
    }
  }, [
    phone,
    codeString,
    isLoading,
    resetCode,
    router,
    shake,
    verificationStatus,
  ]);

  const handleVerifyPress = useCallback(() => {
    if (codeString.length !== OTP_LENGTH || isLoading) return;
    if (codeString === CORRECT_OTP.toString()) {
      void onCorrectCode();
      return;
    }
    onWrongCode();
  }, [codeString, isLoading, onCorrectCode, onWrongCode]);

  function handleTextChange(text: string) {
    if (isLoading) return;

    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newCode = digits.split('').map((d) => Number(d));
    setCode(newCode);
    verificationStatus.value = 'inProgress';
  }

  async function handleResend() {
    if (!phone || isResending) return;
    setIsResending(true);
    try {
      await requestOtp(phone);
      resetCode();
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthOnboardingShell
      copy={OTP_ONBOARDING_COPY}
      onBack={() => router.back()}
    >
      <View style={authScreenStyles.formHeader}>
        <Text style={authScreenStyles.title}>Enter OTP</Text>
        <Text style={authScreenStyles.subtitle}>
          Code sent to{' '}
          <Text style={authScreenStyles.phoneHighlight}>{masked}</Text>
        </Text>
      </View>

      <Pressable
        onPress={() => invisibleInputRef.current?.focus()}
        accessibilityRole="button"
        accessibilityLabel="OTP input"
      >
        <Animated.View style={[authScreenStyles.codeWrap, rShakeStyle]}>
          <VerificationCode
            code={code}
            maxLength={OTP_LENGTH}
            status={verificationStatus}
          />
        </Animated.View>
      </Pressable>

      <AuthContinueButton
        label={isLoading ? 'Verifying…' : 'Verify & continue'}
        onPress={handleVerifyPress}
        disabled={!canVerify}
        loading={isLoading}
        tone="primary"
      />

      <Pressable
        onPress={() => void handleResend()}
        hitSlop={8}
        style={authScreenStyles.resendRow}
        accessibilityRole="button"
        accessibilityLabel="Resend OTP"
      >
        <Text style={authScreenStyles.resendText}>
          Didn&apos;t get it?{' '}
          <Text style={authScreenStyles.resendLink}>
            {isResending ? 'Sending…' : 'Resend'}
          </Text>
        </Text>
      </Pressable>

      <TextInput
        ref={invisibleInputRef}
        value={codeString}
        onChangeText={handleTextChange}
        autoFocus
        keyboardType="number-pad"
        keyboardAppearance={keyboardAppearance}
        maxLength={OTP_LENGTH}
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        caretHidden
        showSoftInputOnFocus
        style={authScreenStyles.invisibleInput}
        accessibilityLabel="OTP input"
        blurOnSubmit={false}
        {...formTextInputProps}
      />
    </AuthOnboardingShell>
  );
}
