import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { router, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { getStartupCatalogImageUrls } from '@/features/catalog/startup-images';
import { RootProvider } from '@/providers/root-provider';
import { CartBottomSheet } from '@/shared/components/cart-bottom-sheet';
import { CartDropAnimation } from '@/shared/components/cart-drop-animation';
import { EmptyCartPrompt } from '@/shared/components/empty-cart-prompt';
import { FloatingCartBar } from '@/shared/components/floating-cart-bar';
import { ProfileSavedToast } from '@/shared/components/profile-saved-toast';
import { WishlistSavedToast } from '@/shared/components/wishlist-saved-toast';
import { preloadAppHaptics } from '@/shared/haptics/feedback';
import { hydrateAppProfile } from '@/store/app.store';
import {
  hydrateAuthState,
  selectCustomerKey,
  selectIsAuthenticated,
  useAuthStore,
} from '@/store/auth.store';
import { startCatalogSync, stopCatalogSync } from '@/store/catalog.store';
import { startMerchantSync, stopMerchantSync } from '@/store/merchant.store';
import { startOrdersSync, stopOrdersSync } from '@/store/orders.store';
import { fontAssets } from '@/theme/typography';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts(fontAssets);
  const segments = useSegments();
  const customerKey = useAuthStore(selectCustomerKey);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const [showCartChrome, setShowCartChrome] = useState(false);
  const onLogin = segments[0] === 'login';
  const onVerify = segments[0] === 'verify';
  const onLocation = segments[0] === 'location';
  const onLegal = segments[0] === 'terms' || segments[0] === 'privacy';
  const hideCartRoute =
    segments[0] === 'checkout' ||
    segments[0] === 'search' ||
    segments[0] === 'order-success' ||
    segments[0] === 'order';

  useEffect(() => {
    preloadAppHaptics();
    void Promise.all([hydrateAuthState(), hydrateAppProfile()]);
  }, []);

  useEffect(() => {
    const startupImages = getStartupCatalogImageUrls();
    if (startupImages.length === 0) {
      return;
    }

    void Image.prefetch(startupImages, 'memory-disk').catch(() => false);
  }, []);

  useEffect(() => {
    startCatalogSync();
    startMerchantSync();
    return () => {
      stopCatalogSync();
      stopMerchantSync();
    };
  }, []);

  useEffect(() => {
    startOrdersSync(isAuthenticated ? customerKey : null);
    return () => {
      stopOrdersSync();
    };
  }, [isAuthenticated, customerKey]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Auth Route Protection Guard
  useEffect(() => {
    if (!loaded) return;

    const isAuthRoute =
      segments[0] === 'login' ||
      segments[0] === 'verify' ||
      segments[0] === 'onboarding' ||
      segments[0] === 'terms' ||
      segments[0] === 'privacy' ||
      !segments[0];

    if (isAuthenticated && isAuthRoute) {
      // Clear the stack and direct authenticated user to tabs
      if (router.canGoBack()) {
        router.dismissAll();
      }
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !isAuthRoute && segments[0] !== undefined) {
      // Redirect unauthenticated user trying to access app pages to login
      router.replace('/login');
    }
  }, [isAuthenticated, segments, loaded]);

  useEffect(() => {
    if (
      onLogin ||
      onVerify ||
      onLegal ||
      onLocation ||
      hideCartRoute ||
      !isAuthenticated
    ) {
      setShowCartChrome(false);
      return;
    }
    const handle = requestAnimationFrame(() => {
      setShowCartChrome(true);
    });
    return () => cancelAnimationFrame(handle);
  }, [onLogin, onVerify, onLegal, onLocation, hideCartRoute, isAuthenticated]);

  const tabSegment = segments[0] === '(tabs)' ? segments[1] : undefined;
  const isHomeTab =
    segments[0] === '(tabs)' &&
    tabSegment !== 'profile' &&
    tabSegment !== 'orders' &&
    tabSegment !== 'wishlist';
  const showFloatingCartBar = showCartChrome && isHomeTab;
  const showCartSheet = showCartChrome;

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
            name="onboarding"
            options={{ animation: 'fade', gestureEnabled: false }}
          />
          <Stack.Screen
            name="login"
            options={{
              animation: 'fade',
              gestureEnabled: false,
              animationDuration: 280,
            }}
          />
          <Stack.Screen
            name="verify"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="terms"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="privacy"
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
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="product/[restaurantId]/[itemId]"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="category/[id]"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="wishlist"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="search"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="profile"
            options={{
              headerShown: false,
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
              headerShown: false,
              animation: 'fade',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="order/[id]"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
        </Stack>
        {showCartSheet ? (
          <>
            <CartDropAnimation />
            <WishlistSavedToast />
            <ProfileSavedToast />
            {showFloatingCartBar ? <FloatingCartBar /> : null}
            <CartBottomSheet />
            <EmptyCartPrompt />
          </>
        ) : null}
      </RootProvider>
    </GestureHandlerRootView>
  );
}
