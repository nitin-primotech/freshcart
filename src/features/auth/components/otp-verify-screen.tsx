import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { verifyOtpAndCreateSession } from '@/features/auth/services/auth.service';
import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumButton } from '@/shared/components/premium-button';
import { PremiumText } from '@/shared/components/premium-text';
import { keyboardAvoidingBehavior } from '@/shared/utils/keyboard';
import { setAuthSession } from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

const OTP_LENGTH = 4;

export function OtpVerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const code = digits.join('');
  const masked = phone ? `+1 ${phone.slice(0, 3)}•••${phone.slice(-4)}` : '';

  function updateDigit(index: number, value: string) {
    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length > 1) {
      const pasted = digitsOnly.slice(0, OTP_LENGTH).split('');
      const next = [...digits];
      for (let i = 0; i < pasted.length && index + i < OTP_LENGTH; i++) {
        next[index + i] = pasted[i] ?? '';
      }
      setDigits(next);
      setError(null);
      const focusIndex = Math.min(index + pasted.length, OTP_LENGTH - 1);
      inputs.current[focusIndex]?.focus();
      return;
    }

    if (!digitsOnly && value === '') {
      const next = [...digits];
      if (digits[index]) {
        next[index] = '';
        setDigits(next);
        setError(null);
        return;
      }
      if (index > 0) {
        next[index - 1] = '';
        setDigits(next);
        setError(null);
        inputs.current[index - 1]?.focus();
      }
      return;
    }

    const d = digitsOnly.slice(-1);
    const next = [...digits];
    next[index] = d;
    setDigits(next);
    setError(null);
    if (d && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  async function handleVerify() {
    if (!phone || code.length < OTP_LENGTH || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const session = await verifyOtpAndCreateSession(phone, code);
      await setAuthSession(session);
      Keyboard.dismiss();
      for (const input of inputs.current) {
        input?.blur();
      }
      InteractionManager.runAfterInteractions(() => {
        router.replace('/(auth)/name');
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={keyboardAvoidingBehavior}
      keyboardVerticalOffset={insets.top}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.root,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppSymbol
            name="chevron.left"
            size={22}
            tintColor={colors.textPrimary}
          />
        </Pressable>

        <View style={styles.content}>
          <PremiumText variant="h1">Verify OTP</PremiumText>
          <PremiumText variant="body" color={colors.textSecondary}>
            Code sent to {masked}. Demo code:{' '}
            <PremiumText variant="bodyMedium" color={colors.primary}>
              1234
            </PremiumText>
          </PremiumText>

          <View style={styles.otpRow}>
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                value={d}
                onChangeText={(v) => updateDigit(i, v)}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                style={[styles.otpBox, d ? styles.otpBoxFilled : null]}
                selectTextOnFocus
                accessibilityLabel={`Digit ${i + 1} of ${OTP_LENGTH}`}
              />
            ))}
          </View>

          {error ? (
            <PremiumText variant="caption" color={colors.danger} selectable>
              {error}
            </PremiumText>
          ) : null}

          <PremiumButton
            label={isLoading ? 'Verifying…' : 'Verify & continue'}
            onPress={handleVerify}
            disabled={code.length < OTP_LENGTH || isLoading}
          />

          <PremiumText
            variant="caption"
            color={colors.textTertiary}
            style={styles.hint}
          >
            Session stays active for 10 minutes after login.
          </PremiumText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flexGrow: 1,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.lg,
  },
  back: {
    marginBottom: spacing.xl,
  },
  content: {
    gap: spacing.lg,
  },
  otpRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  otpBox: {
    width: 56,
    height: 64,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    textAlign: 'center',
    ...typography.h2,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundMuted,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundElevated,
  },
  hint: {
    textAlign: 'center',
  },
});
