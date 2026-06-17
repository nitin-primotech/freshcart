import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootProvider } from '@/providers/root-provider';
import { CartBottomSheet } from '@/shared/components/cart-bottom-sheet';
import { FloatingCartBar } from '@/shared/components/floating-cart-bar';
import { preloadAppHaptics } from '@/shared/haptics/feedback';
import {
  hydrateAppProfile,
  selectOnboardingComplete,
  useAppStore,
} from '@/store/app.store';
import {
  hydrateAuthState,
  selectIsAuthenticated,
  useAuthStore,
} from '@/store/auth.store';
import { fontAssets } from '@/theme/typography';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts(fontAssets);
  const segments = useSegments();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const onboardingComplete = useAppStore(selectOnboardingComplete);
  const [showCartChrome, setShowCartChrome] = useState(false);
  const inAuth = segments[0] === '(auth)';
  const onLocation = segments[0] === 'location';

  useEffect(() => {
    preloadAppHaptics();
    void Promise.all([hydrateAuthState(), hydrateAppProfile()]);
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (inAuth || onLocation || !isAuthenticated || !onboardingComplete) {
      setShowCartChrome(false);
      return;
    }
    const handle = requestAnimationFrame(() => {
      setShowCartChrome(true);
    });
    return () => cancelAnimationFrame(handle);
  }, [inAuth, onLocation, isAuthenticated, onboardingComplete]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            freezeOnBlur: true,
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen
            name="(auth)"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ animation: 'fade', animationTypeForReplace: 'push' }}
          />
          <Stack.Screen
            name="location"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="restaurant/[id]"
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: '',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="checkout"
            options={{
              headerShown: true,
              title: 'Checkout',
              headerBackTitle: 'Back',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="order-success"
            options={{
              presentation: 'modal',
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="order/[id]"
            options={{
              headerShown: true,
              title: 'Track order',
              animation: 'slide_from_right',
            }}
          />
        </Stack>
        {showCartChrome ? (
          <>
            <FloatingCartBar />
            <CartBottomSheet />
          </>
        ) : null}
      </RootProvider>
    </GestureHandlerRootView>
  );
}
