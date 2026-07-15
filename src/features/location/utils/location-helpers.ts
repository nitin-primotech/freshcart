import type { LocationSuggestion } from '@/features/auth/types/location.types';
import type { DeliveryAddress } from '@/features/catalog/types/catalog.types';
import {
  DEFAULT_MAP_CENTER,
  LOCATION_COORDINATES,
} from '@/features/location/constants/location.constants';

export function getSuggestionCoordinates(suggestion: LocationSuggestion): {
  latitude: number;
  longitude: number;
} {
  return (
    suggestion.coordinates ??
    LOCATION_COORDINATES[suggestion.id] ??
    DEFAULT_MAP_CENTER
  );
}

export function suggestionFromAddress(
  address: DeliveryAddress,
): LocationSuggestion {
  return {
    id: 'home',
    title: address.label,
    subtitle: `${address.line1}, ${address.line2}`,
    line1: address.line1,
    line2: address.line2,
    city: 'delhi',
    coordinates: LOCATION_COORDINATES.home,
    keywords: [address.label, address.line1, address.line2],
  };
}

export function enrichSuggestionCoordinates(
  suggestion: LocationSuggestion,
): LocationSuggestion {
  if (suggestion.coordinates) return suggestion;
  const coordinates = LOCATION_COORDINATES[suggestion.id];
  return coordinates ? { ...suggestion, coordinates } : suggestion;
}
