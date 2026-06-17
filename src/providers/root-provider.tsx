import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { type ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStatusBar } from '@/shared/components/app-status-bar';

type RootProviderProps = {
  children: ReactNode;
};

export function RootProvider({ children }: RootProviderProps) {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (process.env.EXPO_OS === 'android') {
      void SystemUI.setBackgroundColorAsync('transparent');
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AppStatusBar style="dark" />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {children}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
