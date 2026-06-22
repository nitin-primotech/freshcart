export type CheckoutAddress = {
  id: string;
  label: string;
  line1: string;
  line2: string;
};

export type PaymentMethodOption = {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  detail?: string;
};

export const CHECKOUT_OFFICE_ADDRESS: CheckoutAddress = {
  id: 'office',
  label: 'Office',
  line1: '42 Hudson St, Floor 8',
  line2: 'New York, NY 10013',
};

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'card',
    label: 'Mastercard',
    subtitle: 'Default card',
    icon: 'creditcard.fill',
    detail: '•••• 5588',
  },
  {
    id: 'visa',
    label: 'Visa card',
    subtitle: 'Pay with Visa',
    icon: 'creditcard.fill',
    detail: '•••• 9021',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    subtitle: 'Fast & secure checkout',
    icon: 'bag.fill',
  },
  {
    id: 'cod',
    label: 'Cash on delivery',
    subtitle: 'Pay when your order arrives',
    icon: 'bicycle',
  },
];

export function computeOfferDiscount(
  code: string,
  subtotal: number,
): { discount: number; freeDelivery: boolean } {
  switch (code) {
    case 'WELCOME20':
      return { discount: Math.min(subtotal * 0.2, 12), freeDelivery: false };
    case 'NEW10':
      return { discount: subtotal >= 25 ? 10 : 0, freeDelivery: false };
    case 'RUSHFREE':
      return { discount: 0, freeDelivery: true };
    case 'WEEKEND':
      return { discount: Math.min(subtotal * 0.3, 15), freeDelivery: false };
    default:
      return { discount: 0, freeDelivery: false };
  }
}
