import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { AppSplash } from '@/features/auth/components/app-splash';
import { getOnboardingHref } from '@/features/auth/utils/onboarding-route';
import {
  selectHydrationStatus as selectAppHydrationStatus,
  selectHasConfirmedAddress,
  selectOnboardingComplete,
  selectOnboardingStep,
  selectUserName,
  useAppStore,
} from '@/store/app.store';
import {
  selectHydrationStatus,
  selectIsAuthenticated,
  useAuthStore,
} from '@/store/auth.store';

const MIN_SPLASH_MS = 1200;

export default function Index() {
  const authHydrationStatus = useAuthStore(selectHydrationStatus);
  const appHydrationStatus = useAppStore(selectAppHydrationStatus);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const onboardingComplete = useAppStore(selectOnboardingComplete);
  const onboardingStep = useAppStore(selectOnboardingStep);
  const userName = useAppStore(selectUserName);
  const hasConfirmedAddress = useAppStore(selectHasConfirmedAddress);
  const [splashDone, setSplashDone] = useState(false);

  const hydrated =
    authHydrationStatus === 'ready' && appHydrationStatus === 'ready';

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!hydrated || !splashDone) {
    return <AppSplash ready={hydrated} />;
  }

  const href = getOnboardingHref({
    isAuthenticated,
    onboardingComplete,
    onboardingStep,
    userName,
    hasConfirmedAddress,
  });

  return <Redirect href={href} />;
}
