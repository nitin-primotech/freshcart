import { colors } from '@/theme/colors';

/** Test key — override with EXPO_PUBLIC_RAZORPAY_KEY_ID in production. */
export const RAZORPAY_KEY_ID =
  process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ?? 'rzp_test_RKgTcc9tht64cZ';

/**
 * UPI, wallets, and netbanking only appear for INR.
 * USD/international checkouts typically show cards only.
 */
export const RAZORPAY_CURRENCY =
  process.env.EXPO_PUBLIC_RAZORPAY_CURRENCY ?? 'INR';

/** Converts displayed USD cart totals to INR for Razorpay when currency is INR. */
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

/** Show UPI, cards, netbanking, wallets, and EMI (subject to dashboard activation). */
export const RAZORPAY_CHECKOUT_CONFIG = {
  display: {
    sequence: ['upi', 'card', 'netbanking', 'wallet', 'emi'],
    preferences: {
      show_default_blocks: true,
    },
  },
};
