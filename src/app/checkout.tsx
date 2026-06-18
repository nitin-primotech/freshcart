import { CheckoutScreen } from '@/features/checkout/components/checkout-screen';

export const options = {
  title: 'Checkout',
  headerBackTitle: 'Back',
  headerBackButtonDisplayMode: 'minimal' as const,
};

export default function CheckoutRoute() {
  return <CheckoutScreen />;
}
