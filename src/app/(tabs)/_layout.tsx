import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { getOnboardingHref } from '@/features/auth/utils/onboarding-route';
import { AppTabs } from '@/navigation/components/app-tabs';
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

export default function TabsLayout() {
  const router = useRouter();
  const authHydration = useAuthStore(selectHydrationStatus);
  const appHydration = useAppStore(selectAppHydrationStatus);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const onboardingComplete = useAppStore(selectOnboardingComplete);
  const onboardingStep = useAppStore(selectOnboardingStep);
  const userName = useAppStore(selectUserName);
  const hasConfirmedAddress = useAppStore(selectHasConfirmedAddress);

  useEffect(() => {
    if (authHydration !== 'ready' || appHydration !== 'ready') return;
    if (onboardingComplete && isAuthenticated) return;

    const href = getOnboardingHref({
      isAuthenticated,
      onboardingComplete,
      onboardingStep,
      userName,
      hasConfirmedAddress,
    });
    router.replace(href);
  }, [
    authHydration,
    appHydration,
    isAuthenticated,
    onboardingComplete,
    onboardingStep,
    userName,
    hasConfirmedAddress,
    router,
  ]);

  if (
    authHydration === 'loading' ||
    appHydration === 'loading' ||
    !isAuthenticated ||
    !onboardingComplete
  ) {
    return null;
  }

  return <AppTabs />;
}
