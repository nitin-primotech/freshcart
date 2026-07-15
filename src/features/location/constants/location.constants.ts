import type { LocationCoordinates } from '@/features/auth/types/location.types';

/** Default map pin when no coordinates are known (Manhattan). */
export const DEFAULT_MAP_CENTER: LocationCoordinates = {
  latitude: 40.741,
  longitude: -73.9896,
};

export const LOCATION_COORDINATES: Record<string, LocationCoordinates> = {
  'moh-sec-71': { latitude: 30.7046, longitude: 76.7179 },
  'noi-sec-62': { latitude: 28.624, longitude: 77.367 },
  'noi-sec-18': { latitude: 28.5706, longitude: 77.3215 },
  'noi-gn-west': { latitude: 28.4744, longitude: 77.503 },
  'del-connaught': { latitude: 28.6315, longitude: 77.2167 },
  'del-saket': { latitude: 28.5244, longitude: 77.2066 },
  home: DEFAULT_MAP_CENTER,
};

export const DEFAULT_RECENT_LOCATION_IDS = [
  'noi-sec-62',
  'noi-sec-18',
] as const;
