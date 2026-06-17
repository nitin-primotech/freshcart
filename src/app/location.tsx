import { useLocalSearchParams } from 'expo-router';

import { LocationSearchScreen } from '@/features/auth/components/location-search-screen';

export default function LocationRoute() {
  const { onboarding } = useLocalSearchParams<{ onboarding?: string }>();
  return (
    <LocationSearchScreen flow={onboarding === '1' ? 'onboarding' : 'change'} />
  );
}
