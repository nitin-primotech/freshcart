import { create } from 'zustand';

import {
  clearStoredSession,
  createPhoneSession,
  getStoredSession,
  isSessionValid,
  saveSession,
} from '@/features/auth/services/auth-storage';
import type {
  AuthHydrationStatus,
  AuthSession,
} from '@/features/auth/types/auth.types';

type AuthState = {
  hydrationStatus: AuthHydrationStatus;
  session: AuthSession | null;
  isAuthenticated: boolean;
};

export const useAuthStore = create<AuthState>(() => ({
  hydrationStatus: 'loading',
  session: null,
  isAuthenticated: false,
}));

export async function hydrateAuthState() {
  const stored = await getStoredSession();
  if (isSessionValid(stored)) {
    useAuthStore.setState({
      hydrationStatus: 'ready',
      session: stored,
      isAuthenticated: true,
    });
    return;
  }
  if (stored) {
    await clearStoredSession();
  }
  useAuthStore.setState({
    hydrationStatus: 'ready',
    session: null,
    isAuthenticated: false,
  });
}

export async function setAuthSession(session: AuthSession) {
  await saveSession(session);
  useAuthStore.setState({
    hydrationStatus: 'ready',
    session,
    isAuthenticated: true,
  });
}

export async function signInWithPhone(phoneDigits: string) {
  const session = createPhoneSession(phoneDigits);
  await setAuthSession(session);
}

export async function clearAuthState() {
  await clearStoredSession();
  useAuthStore.setState({
    hydrationStatus: 'ready',
    session: null,
    isAuthenticated: false,
  });
}

export const selectHydrationStatus = (s: AuthState) => s.hydrationStatus;
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectSession = (s: AuthState) => s.session;
export const selectUserPhone = (s: AuthState) => s.session?.phone ?? null;
