export type DietaryPreference =
	| "veg"
	| "non_veg"
	| "vegan"
	| "eggetarian"
	| null;

export type UserPreferences = {
	cuisineIds: string[];
	dietary: DietaryPreference;
	skipped: boolean;
};

export const DEFAULT_PREFERENCES: UserPreferences = {
	cuisineIds: [],
	dietary: null,
	skipped: false,
};
