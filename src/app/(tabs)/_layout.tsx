import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { AppTabs } from '@/navigation/components/app-tabs';
import {
  selectHydrationStatus as selectAppHydrationStatus,
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

  useEffect(() => {
    if (authHydration !== 'ready' || appHydration !== 'ready') return;
    if (isAuthenticated) return;
    router.replace('/login');
  }, [authHydration, appHydration, isAuthenticated, router]);

  if (
    authHydration === 'loading' ||
    appHydration === 'loading' ||
    !isAuthenticated
  ) {
    return null;
  }

  return <AppTabs />;
}
