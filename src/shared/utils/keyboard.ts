import type { KeyboardAvoidingViewProps } from 'react-native';

/** iOS uses padding; Android relies on `softwareKeyboardLayoutMode: resize` in app.json. */
export const keyboardAvoidingBehavior: KeyboardAvoidingViewProps['behavior'] =
  process.env.EXPO_OS === 'ios' ? 'padding' : undefined;
