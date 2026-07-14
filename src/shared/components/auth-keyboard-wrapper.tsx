import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

type AuthKeyboardWrapperProps = {
  children: ReactNode;
  style?: ViewStyle;
  /** Extra offset for nav headers; auth sheets below a hero should stay at 0. */
  keyboardVerticalOffset?: number;
};

/** Keyboard-aware wrapper for auth flows using react-native-keyboard-controller. */
export function AuthKeyboardWrapper({
  children,
  style,
  keyboardVerticalOffset = 0,
}: AuthKeyboardWrapperProps) {
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
