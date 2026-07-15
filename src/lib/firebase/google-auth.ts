import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  type User,
} from 'firebase/auth';

import type { AuthSession } from '@/features/auth/types/auth.types';
import { getFirebaseAuth } from '@/lib/firebase/client';

const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

let googleConfigured = false;

export class GoogleSignInCancelledError extends Error {
  constructor() {
    super('Google sign-in was cancelled');
    this.name = 'GoogleSignInCancelledError';
  }
}

export function configureGoogleSignIn(): void {
  if (googleConfigured) {
    return;
  }

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  if (!webClientId) {
    throw new Error(
      'Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID. Add the Web client ID from Firebase Google Sign-In.',
    );
  }

  GoogleSignin.configure({
    webClientId,
    iosClientId:
      process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() || undefined,
    offlineAccess: false,
  });
  googleConfigured = true;
}

export async function sessionFromFirebaseUser(
  user: User,
): Promise<AuthSession> {
  const token = await user.getIdToken();
  const phoneDigits = user.phoneNumber?.replace(/\D/g, '').slice(-10) ?? '';
  const isGoogle = user.providerData.some(
    (provider) => provider.providerId === 'google.com',
  );

  return {
    token,
    uid: user.uid,
    phone: phoneDigits ? `+91${phoneDigits}` : '',
    email: user.email ?? undefined,
    displayName: user.displayName ?? undefined,
    photoURL: user.photoURL ?? undefined,
    provider: isGoogle ? 'google' : 'phone',
    expiresAt: Date.now() + TOKEN_TTL_MS,
  };
}

export async function signInWithGoogleFirebase(): Promise<AuthSession> {
  configureGoogleSignIn();
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error(
      'Firebase Auth is not configured. Check EXPO_PUBLIC_FIREBASE_* env vars.',
    );
  }

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) {
    throw new GoogleSignInCancelledError();
  }

  const idToken = response.data.idToken;
  if (!idToken) {
    throw new Error('Google Sign-In did not return an ID token.');
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return sessionFromFirebaseUser(result.user);
}

export async function signOutFirebaseAuth(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth?.currentUser) {
    await firebaseSignOut(auth);
  }

  try {
    configureGoogleSignIn();
    const current = GoogleSignin.getCurrentUser();
    if (current) {
      await GoogleSignin.signOut();
    }
  } catch {
    // Google may not be configured yet on first logout after phone-only login.
  }
}

export function subscribeToFirebaseAuth(
  callback: (user: User | null) => void,
): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function mapGoogleSignInError(error: unknown): string {
  if (error instanceof GoogleSignInCancelledError) {
    return 'Sign-in cancelled';
  }
  if (isErrorWithCode(error)) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return 'Sign-in cancelled';
    }
    if (error.code === statusCodes.IN_PROGRESS) {
      return 'Google sign-in already in progress';
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return 'Google Play Services is unavailable on this device';
    }
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return 'Could not sign in with Google. Try again.';
}
