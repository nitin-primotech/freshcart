import { type Href, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';

import { AuthContinueButton } from '@/features/auth/components/auth-continue-button';
import { AuthOnboardingShell } from '@/features/auth/components/auth-onboarding-shell';
import { NAME_ONBOARDING_COPY } from '@/features/auth/constants/auth-onboarding.constants';
import { authScreenStyles } from '@/features/auth/constants/auth-screen.styles';
import { AppSymbol } from '@/shared/components/app-symbol';
import { formTextInputProps } from '@/shared/utils/keyboard';
import { setUserName } from '@/store/app.store';
import { colors } from '@/theme/colors';

export function NameEntryScreen() {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [name, setName] = useState('');

  const trimmed = name.trim();
  const canContinue = trimmed.length >= 2;

  function handleContinue() {
    if (!canContinue) return;
    Keyboard.dismiss();
    setUserName(trimmed);
    router.replace('/location?onboarding=1' as Href);
  }

  return (
    <AuthOnboardingShell
      copy={NAME_ONBOARDING_COPY}
      onBack={() => router.back()}
    >
      <View style={authScreenStyles.formHeader}>
        <Text style={authScreenStyles.title}>What&apos;s your name?</Text>
        <Text style={authScreenStyles.subtitle}>Add your name to continue</Text>
      </View>

      <View style={authScreenStyles.inputWrap}>
        <View style={authScreenStyles.inputRow}>
          <AppSymbol
            name="person.fill"
            size={18}
            tintColor={colors.textTertiary}
          />
          <TextInput
            ref={inputRef}
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            placeholderTextColor={colors.textTertiary}
            style={authScreenStyles.input}
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="name"
            autoComplete="name"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            selectionColor={colors.primary}
            {...formTextInputProps}
          />
          {name.length > 0 ? (
            <Pressable
              onPress={() => setName('')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear name"
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

      <AuthContinueButton
        label="Continue"
        onPress={handleContinue}
        disabled={!canContinue}
        tone="primary"
      />

      <View style={authScreenStyles.safeNote}>
        <AppSymbol name="lock.fill" size={12} tintColor={colors.success} />
        <Text style={authScreenStyles.safeText}>
          Your details are safe with us
        </Text>
      </View>
    </AuthOnboardingShell>
  );
}
