import { NativeModules, Platform } from 'react-native';

import type {
  PaymentErrorData,
  PaymentSuccessData,
  RazorpayOptions,
} from 'react-native-razorpay';

import { fetchRazorpayOrderId } from '@/features/checkout/api/razorpay.api';
import {
  RAZORPAY_BRAND,
  RAZORPAY_KEY_ID,
} from '@/features/checkout/constants/razorpay.constants';

export type RazorpayPrefill = {
  name?: string | null;
  email?: string | null;
  contact?: string | null;
};

export class RazorpayUnavailableError extends Error {
  constructor(
    message = 'Razorpay requires a development build and is not available in Expo Go.',
  ) {
    super(message);
    this.name = 'RazorpayUnavailableError';
  }
}

export class RazorpayPaymentCancelledError extends Error {
  constructor() {
    super('Payment cancelled');
    this.name = 'RazorpayPaymentCancelledError';
  }
}

function isRazorpayNativeModuleLinked(): boolean {
  if (Platform.OS === 'web') {
    return false;
  }

  return Boolean(
    NativeModules.RNRazorpayCheckout ?? NativeModules.RazorpayCheckout,
  );
}

async function loadRazorpayCheckout() {
  if (!isRazorpayNativeModuleLinked()) {
    throw new RazorpayUnavailableError();
  }

  const { default: RazorpayCheckout } = await import('react-native-razorpay');
  return RazorpayCheckout;
}

function formatContact(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  return digits.length > 0 ? `+${digits}` : undefined;
}

function isUserCancelled(error: PaymentErrorData): boolean {
  const description = error.description?.toLowerCase() ?? '';
  return (
    error.code === 0 ||
    description.includes('cancelled') ||
    description.includes('canceled')
  );
}

export async function openFoodRushCheckout(input: {
  amountInr: number;
  prefill: RazorpayPrefill;
  description?: string;
}): Promise<PaymentSuccessData> {
  if (Platform.OS === 'web') {
    throw new RazorpayUnavailableError(
      'Razorpay payments require the iOS or Android app (development build).',
    );
  }

  if (!RAZORPAY_KEY_ID) {
    throw new Error('Razorpay key is not configured.');
  }

  const RazorpayCheckout = await loadRazorpayCheckout();

  const amountPaise = Math.max(Math.round(input.amountInr * 100), 100);
  const orderId = await fetchRazorpayOrderId(amountPaise);

  const options: RazorpayOptions = {
    key: RAZORPAY_KEY_ID,
    amount: amountPaise,
    currency: RAZORPAY_BRAND.currency,
    name: RAZORPAY_BRAND.name,
    description: input.description ?? RAZORPAY_BRAND.description,
    image: RAZORPAY_BRAND.logoUrl,
    theme: { color: RAZORPAY_BRAND.themeColor },
    prefill: {
      name: input.prefill.name?.trim() || undefined,
      email: input.prefill.email?.trim() || undefined,
      contact: formatContact(input.prefill.contact),
    },
    notes: {
      app: 'foodRush',
      platform: Platform.OS,
    },
  };

  if (orderId) {
    options.order_id = orderId;
  }

  try {
    return await RazorpayCheckout.open(options);
  } catch (error) {
    const paymentError = error as PaymentErrorData;
    if (paymentError?.code !== undefined && isUserCancelled(paymentError)) {
      throw new RazorpayPaymentCancelledError();
    }
    throw new Error(
      paymentError?.description ?? 'Payment failed. Please try again.',
    );
  }
}
