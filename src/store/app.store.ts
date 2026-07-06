import { create } from 'zustand';

import {
  clearStoredProfile,
  DEFAULT_PROFILE,
  getStoredProfile,
  saveProfile,
} from '@/features/auth/services/profile-storage';
import type { LocationSuggestion } from '@/features/auth/types/location.types';
import type { UserPreferences } from '@/features/auth/types/user-preferences.types';
import { DEFAULT_PREFERENCES } from '@/features/auth/types/user-preferences.types';
import type { DeliveryAddress } from '@/features/catalog/types/catalog.types';
import { filterPersonNameInput } from '@/shared/utils/person-name';

type AppHydrationStatus = 'loading' | 'ready';

type AppState = {
  hydrationStatus: AppHydrationStatus;
  address: DeliveryAddress;
  userName: string;
  preferences: UserPreferences;
  recentSearches: string[];
  profileSavedToken: number | null;
};

export const useAppStore = create<AppState>(() => ({
  hydrationStatus: 'loading',
  address: DEFAULT_PROFILE.address,
  userName: DEFAULT_PROFILE.userName,
  preferences: DEFAULT_PREFERENCES,
  recentSearches: ['Milk', 'Eggs', 'Strawberries'],
  profileSavedToken: null,
}));

async function persistProfile() {
  const state = useAppStore.getState();
  await saveProfile({
    userName: state.userName,
    address: state.address,
    preferences: state.preferences,
  });
}

export async function hydrateAppProfile() {
  const profile = await getStoredProfile();
  useAppStore.setState({
    hydrationStatus: 'ready',
    userName: profile.userName,
    address: profile.address,
    preferences: profile.preferences,
  });
}

export function updateProfileName(name: string) {
  const trimmed = filterPersonNameInput(name).trim();
  if (!trimmed) return;
  useAppStore.setState({ userName: trimmed });
  void persistProfile();
}

export function markProfileSaved() {
  useAppStore.setState({ profileSavedToken: Date.now() });
}

export function clearProfileSavedToast() {
  useAppStore.setState({ profileSavedToken: null });
}

export function setDeliveryAddressFromSuggestion(
  suggestion: LocationSuggestion,
) {
  useAppStore.setState({
    address: {
      label: suggestion.title,
      line1: suggestion.line1,
      line2: suggestion.line2,
    },
  });
  void persistProfile();
}

export async function resetAppProfile() {
  await clearStoredProfile();
  useAppStore.setState({
    userName: DEFAULT_PROFILE.userName,
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
export const selectPreferences = (s: AppState) => s.preferences;
export const selectRecentSearches = (s: AppState) => s.recentSearches;
export const selectProfileSavedToken = (s: AppState) => s.profileSavedToken;
