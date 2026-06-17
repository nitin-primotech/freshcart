import locations from '@/features/auth/mocks/locations.json';
import type { LocationSuggestion } from '@/features/auth/types/location.types';

const ALL_LOCATIONS = locations as LocationSuggestion[];

export function getLocationSuggestions(query: string): LocationSuggestion[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return ALL_LOCATIONS.slice(0, 6);
  }

  return ALL_LOCATIONS.filter(
    (loc) =>
      loc.title.toLowerCase().includes(trimmed) ||
      loc.subtitle.toLowerCase().includes(trimmed) ||
      loc.line1.toLowerCase().includes(trimmed),
  );
}

export function getCurrentLocationSuggestion(): LocationSuggestion {
  return ALL_LOCATIONS[0];
}
