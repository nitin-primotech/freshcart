import { useEffect, useState } from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { PremiumText } from '@/shared/components/premium-text';
import { KEYBOARD_DONE_ACCESSORY_ID } from '@/shared/utils/keyboard';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const TOOLBAR_HEIGHT = 44;

function KeyboardDoneToolbar() {
  return (
    <View style={styles.toolbar}>
      <View style={styles.spacer} />
      <Pressable
        onPress={() => Keyboard.dismiss()}
        hitSlop={12}
        style={styles.doneBtn}
        accessibilityRole="button"
        accessibilityLabel="Done"
      >
        <AppSymbol name="checkmark" size={18} tintColor={colors.primary} />
        <PremiumText variant="bodyMedium" color={colors.primary}>
          Done
        </PremiumText>
      </Pressable>
    </View>
  );
}

/** iOS toolbar above the keyboard (required for number-pad). */
export function KeyboardDoneAccessory() {
  if (process.env.EXPO_OS !== 'ios') {
    return null;
  }

  return (
    <InputAccessoryView
      nativeID={KEYBOARD_DONE_ACCESSORY_ID}
      backgroundColor={colors.backgroundElevated}
    >
      <KeyboardDoneToolbar />
    </InputAccessoryView>
  );
}

/** Android floating Done bar — number-pad has no dismiss key. */
export function AndroidKeyboardDoneBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (process.env.EXPO_OS !== 'android') {
      return;
    }

    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (process.env.EXPO_OS !== 'android' || !visible) {
    return null;
  }

  return (
    <View style={styles.androidBar} pointerEvents="box-none">
      <KeyboardDoneToolbar />
    </View>
  );
}

export const keyboardToolbarHeight = TOOLBAR_HEIGHT;

const styles = StyleSheet.create({
  toolbar: {
    height: TOOLBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  spacer: {
    flex: 1,
  },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  androidBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 8,
  },
});
