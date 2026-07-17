import { create } from 'zustand';
import {
  clearStoredProfile,
  DEFAULT_PROFILE,
  getStoredProfile,
  saveProfile,
} from '@/features/auth/services/profile-storage';
import type { AuthSession } from '@/features/auth/types/auth.types';
import type { LocationSuggestion } from '@/features/auth/types/location.types';
import type { UserPreferences } from '@/features/auth/types/user-preferences.types';
import { DEFAULT_PREFERENCES } from '@/features/auth/types/user-preferences.types';
import type { DeliveryAddress } from '@/features/catalog/types/catalog.types';
import { DEFAULT_RECENT_LOCATION_IDS } from '@/features/location/constants/location.constants';
import { isUnsetProfileName } from '@/features/profile/utils/profile-identity';
import { filterPersonNameInput } from '@/shared/utils/person-name';

type AppHydrationStatus = 'loading' | 'ready';

type AppState = {
  hydrationStatus: AppHydrationStatus;
  address: DeliveryAddress;
  userName: string;
  preferences: UserPreferences;
  recentSearches: string[];
  recentLocationIds: string[];
  favoriteLocationIds: string[];
  profileSavedToken: number | null;
};

export const useAppStore = create<AppState>(() => ({
  hydrationStatus: 'loading',
  address: DEFAULT_PROFILE.address,
  userName: DEFAULT_PROFILE.userName,
  preferences: DEFAULT_PREFERENCES,
  recentSearches: ['Organic Milk', 'Bananas', 'Chicken Breast'],
  recentLocationIds: [...DEFAULT_RECENT_LOCATION_IDS],
  favoriteLocationIds: [],
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

export function syncProfileNameFromSession(session: AuthSession | null) {
  const sessionName = session?.displayName?.trim();
  if (!sessionName) return;

  const currentName = useAppStore.getState().userName;
  if (!isUnsetProfileName(currentName)) return;

  useAppStore.setState({ userName: filterPersonNameInput(sessionName).trim() });
  void persistProfile();
}

export function updatePreferences(patch: Partial<UserPreferences>) {
  useAppStore.setState({
    preferences: {
      ...useAppStore.getState().preferences,
      ...patch,
    },
  });
  void persistProfile();
}

export function setDarkModeEnabled(enabled: boolean) {
  updatePreferences({ darkMode: enabled });
}

export function setAppLanguage(language: UserPreferences['language']) {
  updatePreferences({ language });
}

export function setNotificationsEnabled(enabled: boolean) {
  updatePreferences({ notificationsEnabled: enabled });
}

export function setPhoneCountry(phoneCountry: UserPreferences['phoneCountry']) {
  updatePreferences({ phoneCountry });
}

export function markProfileSaved() {
  useAppStore.setState({ profileSavedToken: Date.now() });
}

export function clearProfileSavedToast() {
  useAppStore.setState({ profileSavedToken: null });
}

export function updateDeliveryAddress(patch: Partial<DeliveryAddress>) {
  const current = useAppStore.getState().address;
  const next: DeliveryAddress = {
    ...current,
    ...patch,
  };
  useAppStore.setState({ address: next });
  void persistProfile();
}

export function setDeliveryAddressFromSuggestion(
  suggestion: LocationSuggestion,
) {
  const recentLocationIds = useAppStore.getState().recentLocationIds;
  const shouldTrackRecent =
    suggestion.id !== 'home' && suggestion.id !== 'current-location';
  const nextRecent = shouldTrackRecent
    ? [
        suggestion.id,
        ...recentLocationIds.filter((id) => id !== suggestion.id),
      ].slice(0, 6)
    : recentLocationIds;

  useAppStore.setState({
    address: {
      label: suggestion.title,
      line1: suggestion.line1,
      line2: suggestion.line2,
    },
    recentLocationIds: nextRecent,
  });
  void persistProfile();
}

export function toggleFavoriteLocation(id: string) {
  const favoriteLocationIds = useAppStore.getState().favoriteLocationIds;
  const next = favoriteLocationIds.includes(id)
    ? favoriteLocationIds.filter((entry) => entry !== id)
    : [...favoriteLocationIds, id];
  useAppStore.setState({ favoriteLocationIds: next });
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

export function clearRecentSearches() {
  useAppStore.setState({ recentSearches: [] });
}

export const selectHydrationStatus = (s: AppState) => s.hydrationStatus;
export const selectAddress = (s: AppState) => s.address;
export const selectUserName = (s: AppState) => s.userName;
export const selectPreferences = (s: AppState) => s.preferences;
export const selectDarkModeEnabled = (s: AppState) => s.preferences.darkMode;
export const selectAppLanguage = (s: AppState) => s.preferences.language;
export const selectNotificationsEnabled = (s: AppState) =>
  s.preferences.notificationsEnabled;
export const selectPhoneCountry = (s: AppState) => s.preferences.phoneCountry;
export const selectRecentSearches = (s: AppState) => s.recentSearches;
export const selectRecentLocationIds = (s: AppState) => s.recentLocationIds;
export const selectFavoriteLocationIds = (s: AppState) => s.favoriteLocationIds;
export const selectProfileSavedToken = (s: AppState) => s.profileSavedToken;
