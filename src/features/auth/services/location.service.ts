import locations from '@/features/auth/mocks/locations.json';
import type { LocationSuggestion } from '@/features/auth/types/location.types';

const ALL_LOCATIONS = locations as LocationSuggestion[];

const POPULAR_LOCATION_IDS = [
  'moh-sec-71',
  'moh-phase-7',
  'del-connaught',
  'del-saket',
  'del-dwarka-10',
  'noi-sec-18',
  'noi-sec-62',
  'noi-gn-west',
] as const;

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,#/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandQueryTokens(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];

  const tokens = normalized.split(' ').filter(Boolean);
  const expanded = new Set(tokens);

  for (const token of tokens) {
    if (token === 'sec' || token === 'sector') continue;
    const sectorMatch = token.match(/^sec(?:tor)?(\d+)$/);
    if (sectorMatch) {
      expanded.add(`sector ${sectorMatch[1]}`);
      expanded.add(sectorMatch[1]);
    }
    if (/^\d+$/.test(token)) {
      expanded.add(`sector ${token}`);
    }
  }

  return [...expanded];
}

function getSearchableBlob(location: LocationSuggestion): string {
  return normalizeSearchText(
    [
      location.title,
      location.subtitle,
      location.line1,
      location.line2,
      location.city,
      ...(location.keywords ?? []),
    ].join(' '),
  );
}

function scoreLocation(location: LocationSuggestion, query: string): number {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;

  const title = normalizeSearchText(location.title);
  const subtitle = normalizeSearchText(location.subtitle);
  const blob = getSearchableBlob(location);
  const tokens = expandQueryTokens(query);

  let score = 0;

  if (title === normalizedQuery) score += 120;
  if (title.startsWith(normalizedQuery)) score += 90;
  if (subtitle.startsWith(normalizedQuery)) score += 70;
  if (blob.includes(normalizedQuery)) score += 50;

  for (const token of tokens) {
    if (title === token) score += 40;
    else if (title.startsWith(token)) score += 30;
    else if (title.includes(token)) score += 22;
    else if (subtitle.includes(token)) score += 16;
    else if (blob.includes(token)) score += 10;
  }

  if (normalizedQuery.includes('mohali') && location.city === 'mohali') {
    score += 12;
  }
  if (
    (normalizedQuery.includes('delhi') ||
      normalizedQuery.includes('ncr') ||
      normalizedQuery.includes('new delhi')) &&
    location.city === 'delhi'
  ) {
    score += 12;
  }
  if (
    (normalizedQuery.includes('noida') ||
      normalizedQuery.includes('greater noida')) &&
    location.city === 'noida'
  ) {
    score += 12;
  }

  return score;
}

export function getLocationSuggestions(
  query: string,
  limit = 25,
): LocationSuggestion[] {
  const trimmed = query.trim();

  if (!trimmed) {
    return POPULAR_LOCATION_IDS.map(
      (id) => ALL_LOCATIONS.find((loc) => loc.id === id)!,
    ).filter(Boolean);
  }

  return ALL_LOCATIONS.filter(
    (location) => scoreLocation(location, trimmed) > 0,
  )
    .sort((a, b) => scoreLocation(b, trimmed) - scoreLocation(a, trimmed))
    .slice(0, limit);
}

export function getCurrentLocationSuggestion(): LocationSuggestion {
  return (
    ALL_LOCATIONS.find((loc) => loc.id === 'moh-sec-71') ?? {
      id: 'current-location',
      title: 'Sector 71',
      subtitle: 'SAS Nagar, Mohali, Punjab, India',
      line1: 'Sector 71',
      line2: 'SAS Nagar, Mohali, Punjab, India',
      city: 'mohali',
    }
  );
}
