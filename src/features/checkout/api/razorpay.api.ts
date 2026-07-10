import { RAZORPAY_CURRENCY } from '@/features/checkout/constants/razorpay.constants';

/**
 * Creates a Razorpay order on your backend (requires secret key server-side).
 * Set EXPO_PUBLIC_API_URL and implement POST /payments/razorpay/order → { id: string }.
 */
export async function fetchRazorpayOrderId(
  amountPaise: number,
): Promise<string | null> {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/payments/razorpay/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountPaise,
        currency: RAZORPAY_CURRENCY,
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { id?: string };
    return data.id ?? null;
  } catch {
    return null;
  }
}
