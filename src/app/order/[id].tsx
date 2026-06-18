import { OrderTrackingScreen } from '@/features/orders/components/order-tracking-screen';

export const options = {
  title: 'Track order',
  headerBackTitle: 'Back',
  headerBackButtonDisplayMode: 'minimal' as const,
};

export default function OrderTrackingRoute() {
  return <OrderTrackingScreen />;
}
