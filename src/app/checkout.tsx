import { Stack } from 'expo-router';

import { CheckoutScreen } from '@/features/checkout/components/checkout-screen';

export default function CheckoutRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CheckoutScreen />
    </>
  );
}
