import * as SecureStore from 'expo-secure-store';

import type { AuthSession } from '@/features/auth/types/auth.types';

const SESSION_KEY = 'foodrush.auth.session';

export async function getStoredSession(): Promise<AuthSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function saveSession(session: AuthSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearStoredSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export function isSessionValid(
  session: AuthSession | null,
): session is AuthSession {
  if (!session?.token) return false;
  return session.expiresAt > Date.now();
}
