import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootProvider } from '@/providers/root-provider';
import { CartBottomSheet } from '@/shared/components/cart-bottom-sheet';
import { CartDropAnimation } from '@/shared/components/cart-drop-animation';
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
  const hideCartRoute =
    segments[0] === 'checkout' ||
    segments[0] === 'order-success' ||
    segments[0] === 'order';

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
    if (
      inAuth ||
      onLocation ||
      hideCartRoute ||
      !isAuthenticated ||
      !onboardingComplete
    ) {
      setShowCartChrome(false);
      return;
    }
    const handle = requestAnimationFrame(() => {
      setShowCartChrome(true);
    });
    return () => cancelAnimationFrame(handle);
  }, [inAuth, onLocation, hideCartRoute, isAuthenticated, onboardingComplete]);

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
            headerBackTitle: 'Back',
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen
            name="(auth)"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              title: 'Home',
              animation: 'fade',
              animationTypeForReplace: 'push',
              headerShown: false,
            }}
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
              animation: 'slide_from_right',
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
            <CartDropAnimation />
            <FloatingCartBar />
            <CartBottomSheet />
          </>
        ) : null}
      </RootProvider>
    </GestureHandlerRootView>
  );
}
