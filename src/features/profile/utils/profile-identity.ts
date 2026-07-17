import type { AuthSession } from '@/features/auth/types/auth.types';

export const LEGACY_DEFAULT_PROFILE_NAMES = [
  'Alex Morgan',
  'John Doe',
] as const;

export type ProfileIdentity = {
  name: string;
  needsName: boolean;
  email: string | null;
  phone: string | null;
  avatarUri: string | null;
  initials: string;
  provider: AuthSession['provider'] | null;
  authLabel: string;
};

export function isUnsetProfileName(name: string | null | undefined): boolean {
  const trimmed = name?.trim() ?? '';
  if (!trimmed) return true;
  return LEGACY_DEFAULT_PROFILE_NAMES.includes(
    trimmed as (typeof LEGACY_DEFAULT_PROFILE_NAMES)[number],
  );
}

export function resolveProfileIdentity(input: {
  storedName: string | null | undefined;
  session: AuthSession | null;
}): ProfileIdentity {
  const provider = input.session?.provider ?? null;
  const sessionName = input.session?.displayName?.trim() ?? '';
  const storedName = isUnsetProfileName(input.storedName)
    ? ''
    : (input.storedName?.trim() ?? '');

  const name = storedName || sessionName;
  const needsName = !name;
  const email = input.session?.email?.trim() || null;
  const phone = input.session?.phone?.trim() || null;
  const avatarUri =
    provider === 'google' ? input.session?.photoURL?.trim() || null : null;

  return {
    name,
    needsName,
    email,
    phone,
    avatarUri,
    initials: profileInitialsFromIdentity(name, phone),
    provider,
    authLabel:
      provider === 'google'
        ? 'Signed in with Google'
        : provider === 'phone'
          ? 'Signed in with mobile'
          : 'FreshCart member',
  };
}

export function profileInitialsFromIdentity(
  name: string,
  phone: string | null,
): string {
  if (name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  const digits = phone?.replace(/\D/g, '') ?? '';
  if (digits.length >= 2) {
    return digits.slice(-2);
  }

  return 'FC';
}

export function profileNameLabel(identity: ProfileIdentity): string {
  return identity.needsName ? 'Add your name' : identity.name;
}
