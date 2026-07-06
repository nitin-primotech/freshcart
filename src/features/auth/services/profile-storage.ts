import * as SecureStore from 'expo-secure-store';

import type { UserPreferences } from '@/features/auth/types/user-preferences.types';
import { DEFAULT_PREFERENCES } from '@/features/auth/types/user-preferences.types';
import type { DeliveryAddress } from '@/features/catalog/types/catalog.types';

const PROFILE_KEY = 'freshcart.app.profile';

export type StoredProfile = {
  userName: string;
  address: DeliveryAddress;
  preferences: UserPreferences;
};

const DEFAULT_ADDRESS: DeliveryAddress = {
  label: 'Home',
  line1: '221B Baker Street',
  line2: 'New York, NY 10001',
};

export const DEFAULT_PROFILE: StoredProfile = {
  userName: 'Alex Morgan',
  address: DEFAULT_ADDRESS,
  preferences: DEFAULT_PREFERENCES,
};

export async function getStoredProfile(): Promise<StoredProfile> {
  const raw = await SecureStore.getItemAsync(PROFILE_KEY);
  if (!raw) return DEFAULT_PROFILE;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredProfile>;
    return {
      userName: parsed.userName?.trim() || DEFAULT_PROFILE.userName,
      address: parsed.address ?? DEFAULT_ADDRESS,
      preferences: {
        cuisineIds: parsed.preferences?.cuisineIds ?? [],
        dietary: parsed.preferences?.dietary ?? null,
        skipped: Boolean(parsed.preferences?.skipped),
      },
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function saveProfile(profile: StoredProfile): Promise<void> {
  await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
}

export async function clearStoredProfile(): Promise<void> {
  await SecureStore.deleteItemAsync(PROFILE_KEY);
}
