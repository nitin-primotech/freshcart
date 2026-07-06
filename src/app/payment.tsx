import { Stack } from 'expo-router';

import { PaymentScreen } from '@/features/checkout/components/payment-screen';

export default function PaymentRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PaymentScreen />
    </>
  );
}
