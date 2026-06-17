import { create } from 'zustand';

import {
  clearStoredProfile,
  DEFAULT_PROFILE,
  getStoredProfile,
  saveProfile,
} from '@/features/auth/services/profile-storage';
import type { LocationSuggestion } from '@/features/auth/types/location.types';
import type {
  DietaryPreference,
  OnboardingStep,
  UserPreferences,
} from '@/features/auth/types/onboarding.types';
import { DEFAULT_PREFERENCES } from '@/features/auth/types/onboarding.types';
import type { DeliveryAddress } from '@/features/catalog/types/catalog.types';

type AppHydrationStatus = 'loading' | 'ready';

type AppState = {
  hydrationStatus: AppHydrationStatus;
  address: DeliveryAddress;
  userName: string | null;
  onboardingComplete: boolean;
  onboardingStep: OnboardingStep;
  hasConfirmedAddress: boolean;
  preferences: UserPreferences;
  recentSearches: string[];
};

export const useAppStore = create<AppState>(() => ({
  hydrationStatus: 'loading',
  address: DEFAULT_PROFILE.address,
  userName: null,
  onboardingComplete: false,
  onboardingStep: 'welcome',
  hasConfirmedAddress: false,
  preferences: DEFAULT_PREFERENCES,
  recentSearches: ['Sushi', 'Pizza', 'Healthy bowls'],
}));

async function persistProfile() {
  const state = useAppStore.getState();
  await saveProfile({
    userName: state.userName,
    onboardingComplete: state.onboardingComplete,
    onboardingStep: state.onboardingStep,
    hasConfirmedAddress: state.hasConfirmedAddress,
    address: state.address,
    preferences: state.preferences,
  });
}

export async function hydrateAppProfile() {
  const profile = await getStoredProfile();
  useAppStore.setState({
    hydrationStatus: 'ready',
    userName: profile.userName,
    onboardingComplete: profile.onboardingComplete,
    onboardingStep: profile.onboardingStep,
    hasConfirmedAddress: profile.hasConfirmedAddress,
    address: profile.address,
    preferences: profile.preferences,
  });
}

export function setOnboardingStep(step: OnboardingStep) {
  useAppStore.setState({ onboardingStep: step });
  void persistProfile();
}

export function setUserName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  useAppStore.setState({ userName: trimmed, onboardingStep: 'location' });
  void persistProfile();
}

export function setDeliveryAddressFromSuggestion(
  suggestion: LocationSuggestion,
  options?: { onboarding?: boolean },
) {
  useAppStore.setState({
    address: {
      label: suggestion.title,
      line1: suggestion.line1,
      line2: suggestion.line2,
    },
    ...(options?.onboarding
      ? { hasConfirmedAddress: true, onboardingStep: 'personalize' as const }
      : {}),
  });
  void persistProfile();
}

export function savePersonalization(
  cuisineIds: string[],
  dietary: DietaryPreference,
) {
  useAppStore.setState({
    preferences: { cuisineIds, dietary, skipped: false },
    onboardingStep: 'done',
    onboardingComplete: true,
  });
  void persistProfile();
}

export function skipPersonalization() {
  useAppStore.setState({
    preferences: { ...DEFAULT_PREFERENCES, skipped: true },
    onboardingStep: 'done',
    onboardingComplete: true,
  });
  void persistProfile();
}

export async function resetAppProfile() {
  await clearStoredProfile();
  useAppStore.setState({
    userName: null,
    onboardingComplete: false,
    onboardingStep: 'welcome',
    hasConfirmedAddress: false,
    address: DEFAULT_PROFILE.address,
    preferences: DEFAULT_PREFERENCES,
  });
}

export function addRecentSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const current = useAppStore
    .getState()
    .recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
  useAppStore.setState({
    recentSearches: [trimmed, ...current].slice(0, 6),
  });
}

export const selectHydrationStatus = (s: AppState) => s.hydrationStatus;
export const selectAddress = (s: AppState) => s.address;
export const selectUserName = (s: AppState) => s.userName;
export const selectOnboardingComplete = (s: AppState) => s.onboardingComplete;
export const selectOnboardingStep = (s: AppState) => s.onboardingStep;
export const selectHasConfirmedAddress = (s: AppState) => s.hasConfirmedAddress;
export const selectPreferences = (s: AppState) => s.preferences;
export const selectRecentSearches = (s: AppState) => s.recentSearches;
