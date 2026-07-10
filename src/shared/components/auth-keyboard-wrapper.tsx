import type { ReactNode } from 'react';
import { KeyboardAvoidingView, View, type ViewStyle } from 'react-native';

import { keyboardAvoidingBehavior } from '@/shared/utils/keyboard';

type AuthKeyboardWrapperProps = {
  children: ReactNode;
  style?: ViewStyle;
  /** Extra offset for nav headers; auth sheets below a hero should stay at 0. */
  keyboardVerticalOffset?: number;
};

/**
 * iOS: KeyboardAvoidingView. Android: plain View (window resize handles the keyboard).
 * Avoids KAV + resize conflicts that can crash or freeze on TextInput focus.
 */
export function AuthKeyboardWrapper({
  children,
  style,
  keyboardVerticalOffset = 0,
}: AuthKeyboardWrapperProps) {
  if (process.env.EXPO_OS === 'ios') {
    return (
      <KeyboardAvoidingView
        behavior={keyboardAvoidingBehavior}
        style={style}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  return <View style={style}>{children}</View>;
}
