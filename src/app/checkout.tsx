import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, Pressable } from 'react-native';

import { CheckoutScreen } from '@/features/checkout/components/checkout-screen';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { handleCheckoutBack } from '@/store/cart.store';
import { colors } from '@/theme/colors';

export default function CheckoutRoute() {
  const router = useRouter();

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleCheckoutBack(router);
        return true;
      },
    );
    return () => subscription.remove();
  }, [router]);

  function onBack() {
    hapticSoftTap();
    handleCheckoutBack(router);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Checkout',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={{ marginLeft: 4 }}
            >
              <AppSymbol
                name="chevron.left"
                size={22}
                tintColor={colors.textPrimary}
              />
            </Pressable>
          ),
        }}
      />
      <CheckoutScreen />
    </>
  );
}
