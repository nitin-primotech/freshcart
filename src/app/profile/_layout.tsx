import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="edit" />
      <Stack.Screen name="wishlist" />
      <Stack.Screen name="addresses" />
      <Stack.Screen name="about" />
      <Stack.Screen name="language" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="offers" />
      <Stack.Screen name="membership" />
      <Stack.Screen name="support" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="delete" />
    </Stack>
  );
}
