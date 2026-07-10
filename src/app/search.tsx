import { Stack } from 'expo-router';

import { SearchScreen } from '@/features/search/components/search-screen';

export default function SearchRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SearchScreen />
    </>
  );
}
