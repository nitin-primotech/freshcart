import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { type ReactNode, useEffect } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AndroidKeyboardDoneBar } from '@/shared/components/keyboard-done-accessory';
import { colors } from '@/theme/colors';

type RootProviderProps = {
  children: ReactNode;
};

export function RootProvider({ children }: RootProviderProps) {
  const colorScheme = useColorScheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(
      process.env.EXPO_OS === 'android'
        ? 'transparent'
        : colors.backgroundElevated,
    );
  }, []);

  return (
    <SafeAreaProvider>
      <AppStatusBar style="dark" />
      <View style={styles.shell}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          {children}
        </ThemeProvider>
        <AndroidKeyboardDoneBar />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
});
