import { colors } from '@/theme/colors';

/** Test key — override with EXPO_PUBLIC_RAZORPAY_KEY_ID in production. */
export const RAZORPAY_KEY_ID =
  process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ?? 'rzp_test_RKgTcc9tht64cZ';

/**
 * Razorpay checkout currency. Test mode supports USD with test API keys.
 * Override with EXPO_PUBLIC_RAZORPAY_CURRENCY if needed.
 */
export const RAZORPAY_CURRENCY =
  process.env.EXPO_PUBLIC_RAZORPAY_CURRENCY ?? 'USD';

/** Used only when EXPO_PUBLIC_RAZORPAY_CURRENCY is INR. */
export const USD_TO_INR_RATE = Number(
  process.env.EXPO_PUBLIC_USD_TO_INR_RATE ?? '83',
);

export const RAZORPAY_BRAND = {
  name: 'FreshCart',
  logoUrl: 'https://freshcart.app/logo.png',
  currency: RAZORPAY_CURRENCY,
  themeColor: colors.primary,
  description: 'FreshCart grocery checkout',
};

/** INR: UPI, cards, netbanking, wallets. USD: cards only (Razorpay test/live). */
export const RAZORPAY_CHECKOUT_CONFIG =
  RAZORPAY_CURRENCY === 'USD'
    ? {
        display: {
          sequence: ['card'],
          preferences: {
            show_default_blocks: true,
          },
        },
      }
    : {
        display: {
          sequence: ['upi', 'card', 'netbanking', 'wallet', 'emi'],
          preferences: {
            show_default_blocks: true,
          },
        },
      };
