import * as SecureStore from 'expo-secure-store';

import type { UserPreferences } from '@/features/auth/types/user-preferences.types';
import { DEFAULT_PREFERENCES } from '@/features/auth/types/user-preferences.types';
import type { DeliveryAddress } from '@/features/catalog/types/catalog.types';
import { isUnsetProfileName } from '@/features/profile/utils/profile-identity';

const PROFILE_KEY = 'freshcart.app.profile';

export type StoredProfile = {
  userName: string;
  address: DeliveryAddress;
  preferences: UserPreferences;
};

const DEFAULT_ADDRESS: DeliveryAddress = {
  label: 'Home',
  line1: '221B Baker Street',
  line2: 'New York',
};

export const DEFAULT_PROFILE: StoredProfile = {
  userName: '',
  address: DEFAULT_ADDRESS,
  preferences: DEFAULT_PREFERENCES,
};

export async function getStoredProfile(): Promise<StoredProfile> {
  let raw: string | null = null;
  if (process.env.EXPO_OS === 'web') {
    try {
      raw = localStorage.getItem(PROFILE_KEY);
    } catch {
      // ignore
    }
  } else {
    raw = await SecureStore.getItemAsync(PROFILE_KEY);
  }
  if (!raw) return DEFAULT_PROFILE;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredProfile>;
    return {
      userName: isUnsetProfileName(parsed.userName)
        ? ''
        : (parsed.userName?.trim() ?? ''),
      address: { ...DEFAULT_ADDRESS, ...parsed.address },
      preferences: {
        cuisineIds:
          parsed.preferences?.cuisineIds ?? DEFAULT_PREFERENCES.cuisineIds,
        dietary: parsed.preferences?.dietary ?? DEFAULT_PREFERENCES.dietary,
        skipped: Boolean(parsed.preferences?.skipped),
        darkMode: Boolean(parsed.preferences?.darkMode),
        language: parsed.preferences?.language ?? DEFAULT_PREFERENCES.language,
        notificationsEnabled:
          parsed.preferences?.notificationsEnabled ??
          DEFAULT_PREFERENCES.notificationsEnabled,
        phoneCountry: {
          ...DEFAULT_PREFERENCES.phoneCountry,
          ...parsed.preferences?.phoneCountry,
        },
      },
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function saveProfile(profile: StoredProfile): Promise<void> {
  if (process.env.EXPO_OS === 'web') {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  } else {
    await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(profile));
  }
}

export async function clearStoredProfile(): Promise<void> {
  if (process.env.EXPO_OS === 'web') {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch {
      // ignore
    }
  } else {
    await SecureStore.deleteItemAsync(PROFILE_KEY);
  }
}
