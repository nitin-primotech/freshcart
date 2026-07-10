import { Redirect } from 'expo-router';

import {
  selectHydrationStatus as selectAppHydrationStatus,
  useAppStore,
} from '@/store/app.store';
import {
  selectHydrationStatus,
  selectIsAuthenticated,
  useAuthStore,
} from '@/store/auth.store';

export default function Index() {
  const authHydrationStatus = useAuthStore(selectHydrationStatus);
  const appHydrationStatus = useAppStore(selectAppHydrationStatus);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const hydrated =
    authHydrationStatus === 'ready' && appHydrationStatus === 'ready';

  if (!hydrated) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}
