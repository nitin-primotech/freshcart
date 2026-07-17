import { create } from 'zustand';

import {
  clearStoredSession,
  createPhoneSession,
  getSessionCustomerKey,
  getStoredSession,
  isSessionValid,
  saveSession,
} from '@/features/auth/services/auth-storage';
import type {
  AuthHydrationStatus,
  AuthSession,
} from '@/features/auth/types/auth.types';
import {
  GoogleSignInCancelledError,
  mapGoogleSignInError,
  sessionFromFirebaseUser,
  signInWithGoogleFirebase,
  signOutFirebaseAuth,
  subscribeToFirebaseAuth,
} from '@/lib/firebase/google-auth';
import { syncProfileNameFromSession } from '@/store/app.store';

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
  } else {
    if (stored) {
      await clearStoredSession();
    }
    useAuthStore.setState({
      hydrationStatus: 'ready',
      session: null,
      isAuthenticated: false,
    });
  }

  subscribeToFirebaseAuth((user) => {
    void (async () => {
      if (!user) {
        const current = useAuthStore.getState().session;
        if (current?.provider === 'google') {
          await clearStoredSession();
          useAuthStore.setState({
            hydrationStatus: 'ready',
            session: null,
            isAuthenticated: false,
          });
        }
        return;
      }

      const session = await sessionFromFirebaseUser(user);
      await saveSession(session);
      syncProfileNameFromSession(session);
      useAuthStore.setState({
        hydrationStatus: 'ready',
        session,
        isAuthenticated: true,
      });
    })();
  });
}

export async function setAuthSession(session: AuthSession) {
  await saveSession(session);
  syncProfileNameFromSession(session);
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

export async function signInWithGoogle(): Promise<AuthSession> {
  const session = await signInWithGoogleFirebase();
  await setAuthSession(session);
  return session;
}

export async function clearAuthState() {
  try {
    await signOutFirebaseAuth();
  } catch (error) {
    console.warn('[auth] Firebase sign-out failed', error);
  }
  await clearStoredSession();
  useAuthStore.setState({
    hydrationStatus: 'ready',
    session: null,
    isAuthenticated: false,
  });
}

export { GoogleSignInCancelledError, mapGoogleSignInError };

export const selectHydrationStatus = (s: AuthState) => s.hydrationStatus;
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectSession = (s: AuthState) => s.session;
export const selectAuthProvider = (s: AuthState) => s.session?.provider ?? null;
export const selectUserPhone = (s: AuthState) => s.session?.phone || null;
export const selectCustomerKey = (s: AuthState) =>
  getSessionCustomerKey(s.session);
export const selectDisplayName = (s: AuthState) =>
  s.session?.displayName || s.session?.email || s.session?.phone || null;
