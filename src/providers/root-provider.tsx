import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { type ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AndroidKeyboardDoneBar } from '@/shared/components/keyboard-done-accessory';
import { selectDarkModeEnabled, useAppStore } from '@/store/app.store';
import { colors } from '@/theme/colors';

type RootProviderProps = {
  children: ReactNode;
};

export function RootProvider({ children }: RootProviderProps) {
  const darkModeEnabled = useAppStore(selectDarkModeEnabled);
  const colorScheme = darkModeEnabled ? 'dark' : 'light';

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(
      process.env.EXPO_OS === 'android'
        ? 'transparent'
        : darkModeEnabled
          ? colors.background
          : colors.backgroundElevated,
    ).catch(() => {
      // Activity can be unavailable during fast refresh or backgrounding.
    });
  }, [darkModeEnabled]);

  return (
    <SafeAreaProvider>
      <KeyboardProvider preload={false}>
        <AppStatusBar style={darkModeEnabled ? 'light' : 'dark'} />
        <View style={[styles.shell, darkModeEnabled && styles.shellDark]}>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            {children}
          </ThemeProvider>
          <AndroidKeyboardDoneBar />
        </View>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  shellDark: {
    backgroundColor: '#121212',
  },
});
