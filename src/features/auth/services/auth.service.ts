import type { AuthSession, PendingOtp } from '@/features/auth/types/auth.types';
import {
  simulateMutation,
  simulateRequest,
} from '@/shared/utils/simulate-request';

export const TOKEN_TTL_MS = 10 * 60 * 1000;
const OTP_TTL_MS = 2 * 60 * 1000;
const DEMO_OTP = '1234';

let pendingOtp: PendingOtp | null = null;

export function getPendingOtpPhone() {
  return pendingOtp?.phone ?? null;
}

export async function requestOtp(phone: string) {
  const normalized = phone.replace(/\D/g, '');
  if (normalized.length < 10) {
    throw new Error('Enter a valid 10-digit mobile number');
  }

  await simulateRequest({ ok: true }, { delayMs: 900 });

  pendingOtp = {
    phone: normalized,
    code: DEMO_OTP,
    expiresAt: Date.now() + OTP_TTL_MS,
  };

  return { phone: normalized, demoHint: DEMO_OTP };
}

export async function verifyOtpAndCreateSession(
  phone: string,
  code: string,
): Promise<AuthSession> {
  const normalized = phone.replace(/\D/g, '');

  await simulateMutation({ ok: true }, { delayMs: 1100 });

  if (!pendingOtp || pendingOtp.phone !== normalized) {
    throw new Error('Session expired. Request a new code.');
  }
  if (pendingOtp.expiresAt < Date.now()) {
    pendingOtp = null;
    throw new Error('OTP expired. Request a new code.');
  }
  if (code.trim() !== pendingOtp.code) {
    throw new Error('Invalid OTP. Use 1234 for this demo.');
  }

  pendingOtp = null;

  return {
    token: `demo_${Date.now()}`,
    phone: normalized,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  };
}

export async function refreshSession(
  session: AuthSession,
): Promise<AuthSession | null> {
  if (session.expiresAt <= Date.now()) return null;
  return session;
}
