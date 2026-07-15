export type AuthProvider = 'phone' | 'google';

export type AuthSession = {
  token: string;
  /** E.164 or +91… for phone auth; empty for Google-only. */
  phone: string;
  expiresAt: number;
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  provider?: AuthProvider;
};

export type AuthHydrationStatus = 'loading' | 'ready';
