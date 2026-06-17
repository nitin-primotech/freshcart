import * as SecureStore from 'expo-secure-store';

import type {
  DietaryPreference,
  OnboardingStep,
  UserPreferences,
} from '@/features/auth/types/onboarding.types';
import { DEFAULT_PREFERENCES } from '@/features/auth/types/onboarding.types';
import type { DeliveryAddress } from '@/features/catalog/types/catalog.types';

const PROFILE_KEY = 'foodrush.app.profile';

export type StoredProfile = {
  userName: string | null;
  onboardingComplete: boolean;
  onboardingStep: OnboardingStep;
  hasConfirmedAddress: boolean;
  address: DeliveryAddress;
  preferences: UserPreferences;
};

const DEFAULT_ADDRESS: DeliveryAddress = {
  label: 'West Village',
  line1: '14th St · Station Plaza',
  line2: 'New York, NY 10011',
};

export const DEFAULT_PROFILE: StoredProfile = {
  userName: null,
  onboardingComplete: false,
  onboardingStep: 'welcome',
  hasConfirmedAddress: false,
  address: DEFAULT_ADDRESS,
  preferences: DEFAULT_PREFERENCES,
};

export async function getStoredProfile(): Promise<StoredProfile> {
  const raw = await SecureStore.getItemAsync(PROFILE_KEY);
  if (!raw) return DEFAULT_PROFILE;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredProfile>;
    return {
      userName: parsed.userName ?? null,
      onboardingComplete: Boolean(parsed.onboardingComplete),
      onboardingStep: parsed.onboardingStep ?? 'welcome',
      hasConfirmedAddress: Boolean(parsed.hasConfirmedAddress),
      address: parsed.address ?? DEFAULT_ADDRESS,
      preferences: {
        cuisineIds: parsed.preferences?.cuisineIds ?? [],
        dietary: (parsed.preferences?.dietary ?? null) as DietaryPreference,
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
