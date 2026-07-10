import type { KeyboardAvoidingViewProps, TextInputProps } from 'react-native';

/** iOS uses padding; Android relies on `softwareKeyboardLayoutMode: resize` in app.json. */
export const keyboardAvoidingBehavior: KeyboardAvoidingViewProps['behavior'] =
  process.env.EXPO_OS === 'ios' ? 'padding' : undefined;

/** Prevent iOS from tinting the system keyboard with app accent colors. */
export const keyboardAppearance: NonNullable<
  TextInputProps['keyboardAppearance']
> = 'light';

/** Linked to `KeyboardDoneAccessory` on iOS. */
export const KEYBOARD_DONE_ACCESSORY_ID = 'foodrush-keyboard-done';

/** Spread onto TextInput — `keyboardAppearance` is iOS-only and can misbehave on Android. */
export const textInputKeyboardProps: Pick<
  TextInputProps,
  'keyboardAppearance'
> = process.env.EXPO_OS === 'ios' ? { keyboardAppearance } : {};

/** iOS Done toolbar above keyboards that lack a return key (e.g. number-pad). */
export const keyboardDoneAccessoryProps: Pick<
  TextInputProps,
  'inputAccessoryViewID'
> =
  process.env.EXPO_OS === 'ios'
    ? { inputAccessoryViewID: KEYBOARD_DONE_ACCESSORY_ID }
    : {};

/** Standard props for form TextInputs — appearance + Done accessory. */
export const formTextInputProps: Pick<
  TextInputProps,
  'keyboardAppearance' | 'inputAccessoryViewID'
> = {
  ...textInputKeyboardProps,
  ...keyboardDoneAccessoryProps,
};
