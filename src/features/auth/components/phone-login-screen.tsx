import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';

import { AuthContinueButton } from '@/features/auth/components/auth-continue-button';
import { AuthOnboardingShell } from '@/features/auth/components/auth-onboarding-shell';
import { PHONE_ONBOARDING_COPY } from '@/features/auth/constants/auth-onboarding.constants';
import { authScreenStyles } from '@/features/auth/constants/auth-screen.styles';
import { requestOtp } from '@/features/auth/services/auth.service';
import { AppSymbol } from '@/shared/components/app-symbol';
import { useKeyboardHeight } from '@/shared/hooks/use-keyboard-height';
import {
  formTextInputProps,
  keyboardAppearance,
} from '@/shared/utils/keyboard';
import { colors } from '@/theme/colors';

export function PhoneLoginScreen() {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const digits = phone.replace(/\D/g, '');
  const canContinue = digits.length >= 10 && !isLoading;
  const keyboardHeight = useKeyboardHeight();
  const showLegal = keyboardHeight === 0;

  async function handleContinue() {
    setError(null);
    setIsLoading(true);
    try {
      await requestOtp(phone);
      Keyboard.dismiss();
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: digits },
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

  return (
    <AuthOnboardingShell
      copy={PHONE_ONBOARDING_COPY}
      onBack={() => router.back()}
    >
      <View style={authScreenStyles.formHeader}>
        <Text style={authScreenStyles.title}>Enter your mobile number</Text>
        <Text style={authScreenStyles.subtitle}>
          We&apos;ll send you an OTP to verify
        </Text>
      </View>

      <View style={authScreenStyles.inputWrap}>
        <View style={authScreenStyles.inputRow}>
          <View style={authScreenStyles.country}>
            <Text style={authScreenStyles.flag}>🇮🇳</Text>
            <Text style={authScreenStyles.countryCode}>+91</Text>
            <AppSymbol
              name="chevron.down"
              size={14}
              tintColor={colors.textTertiary}
              style={authScreenStyles.countryChevron}
            />
          </View>
          <View style={authScreenStyles.inputDivider} />
          <TextInput
            ref={inputRef}
            value={phone}
            onChangeText={(value) => {
              setPhone(value.replace(/\D/g, '').slice(0, 10));
              setError(null);
            }}
            keyboardType="number-pad"
            keyboardAppearance={keyboardAppearance}
            textContentType="telephoneNumber"
            autoComplete="tel"
            placeholder="Enter mobile number"
            placeholderTextColor={colors.textTertiary}
            style={authScreenStyles.input}
            maxLength={10}
            selectionColor={colors.primary}
            blurOnSubmit
            {...formTextInputProps}
          />
          {phone.length > 0 ? (
            <Pressable
              onPress={clearPhone}
              hitSlop={8}
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
        <Text style={authScreenStyles.error} selectable>
          {error}
        </Text>
      ) : null}

      <AuthContinueButton
        label="Continue"
        onPress={handleContinue}
        disabled={!canContinue}
        loading={isLoading}
        tone="primary"
      />

      <View style={authScreenStyles.safeNote}>
        <AppSymbol name="lock.fill" size={12} tintColor={colors.success} />
        <Text style={authScreenStyles.safeText}>
          Your number is safe with us
        </Text>
      </View>

      {showLegal ? (
        <Text style={authScreenStyles.legal}>
          By continuing you agree to{' '}
          <Text
            style={authScreenStyles.legalLink}
            onPress={() => router.push('/(auth)/terms')}
          >
            terms and conditions
          </Text>{' '}
          and{' '}
          <Text
            style={authScreenStyles.legalLink}
            onPress={() => router.push('/(auth)/privacy')}
          >
            privacy policy
          </Text>
          .
        </Text>
      ) : null}
    </AuthOnboardingShell>
  );
}
