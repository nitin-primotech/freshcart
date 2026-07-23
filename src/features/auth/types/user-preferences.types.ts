export type DietaryPreference =
  | 'veg'
  | 'non_veg'
  | 'vegan'
  | 'eggetarian'
  | null;

export type AppLanguage = 'en' | 'hi';

export type UserPreferences = {
  cuisineIds: string[];
  dietary: DietaryPreference;
  skipped: boolean;
  darkMode: boolean;
  language: AppLanguage;
  notificationsEnabled: boolean;
  phoneCountry: {
    cca2: string;
    callingCode: string;
  };
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  cuisineIds: [],
  dietary: null,
  skipped: false,
  darkMode: false,
  language: 'en',
  notificationsEnabled: true,
  phoneCountry: {
    cca2: 'US',
    callingCode: '1',
  },
};
