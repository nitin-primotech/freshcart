export type LocationCity = 'mohali' | 'delhi' | 'noida';

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

export type LocationSuggestion = {
  id: string;
  title: string;
  subtitle: string;
  line1: string;
  line2: string;
  city: LocationCity;
  /** Extra tokens for search — sector numbers, landmarks, aliases */
  keywords?: string[];
  coordinates?: LocationCoordinates;
};

export type SavedAddress = {
  id: string;
  label: string;
  isDefault?: boolean;
  suggestion: LocationSuggestion;
};
