export type AuthSession = {
  token: string;
  phone: string;
  expiresAt: number;
};

export type AuthHydrationStatus = 'loading' | 'ready';

export type PendingOtp = {
  phone: string;
  code: string;
  expiresAt: number;
};
