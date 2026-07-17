export type WalletTransaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
};

export type ProfileOffer = {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  gradient: [string, string];
  icon: string;
  expiresLabel: string;
};

export type MembershipPerk = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export type SupportContactOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: 'chat' | 'call' | 'email';
};

export type SupportFaq = {
  id: string;
  question: string;
  answer: string;
};

export type SavedPaymentMethod = {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  brandId?:
    | 'applePay'
    | 'gpay'
    | 'paypal'
    | 'visa'
    | 'mastercard'
    | 'amex'
    | 'discover';
  isDefault?: boolean;
};

export const WALLET_BALANCE = 250;

export const SUPPORT_HOURS = '8:00 AM – 11:00 PM, every day';

export const SUPPORT_PHONE = '18001234567';

export const SUPPORT_EMAIL = 'help@freshcart.com';

export const SUPPORT_CONTACT_OPTIONS: SupportContactOption[] = [
  {
    id: 'chat',
    title: 'Live chat',
    subtitle: 'Typical reply in under 2 min',
    icon: 'message.fill',
    action: 'chat',
  },
  {
    id: 'call',
    title: 'Call us',
    subtitle: '1800-123-4567',
    icon: 'phone.fill',
    action: 'call',
  },
  {
    id: 'email',
    title: 'Email support',
    subtitle: SUPPORT_EMAIL,
    icon: 'envelope.fill',
    action: 'email',
  },
];

export const SUPPORT_FAQS: SupportFaq[] = [
  {
    id: 'faq-1',
    question: 'How do I track my order?',
    answer:
      'Open the Orders tab or tap Track Order on your profile. You will see live status updates from kitchen to doorstep.',
  },
  {
    id: 'faq-2',
    question: 'Can I cancel or modify an order?',
    answer:
      'You can cancel within a few minutes of placing the order from the order details screen. After the kitchen starts preparing, modifications may not be possible.',
  },
  {
    id: 'faq-3',
    question: 'How do refunds work?',
    answer:
      'Eligible refunds are credited to your FreshCart wallet within 24–48 hours. For payment issues, contact support with your order ID.',
  },
  {
    id: 'faq-4',
    question: 'How do I apply a coupon?',
    answer:
      'Go to checkout before placing your order. Enter your code in the offers section or pick one from Your Offers on your profile.',
  },
  {
    id: 'faq-5',
    question: 'How do I update my delivery address?',
    answer:
      'Tap Manage Addresses on your profile or Edit Profile → Delivery area to change your saved location.',
  },
];

export const SAVED_PAYMENT_METHODS: SavedPaymentMethod[] = [
  {
    id: 'saved-apple-pay',
    label: 'Apple Pay',
    subtitle: 'Default wallet',
    icon: 'apple.logo',
    brandId: 'applePay',
    isDefault: true,
  },
  {
    id: 'saved-card',
    label: 'Visa ending 4242',
    subtitle: '•••• 4242 · Exp 08/27',
    icon: 'creditcard.fill',
    brandId: 'visa',
  },
  {
    id: 'saved-paypal',
    label: 'PayPal',
    subtitle: 'Linked for quick pay',
    icon: 'dollarsign.circle.fill',
    brandId: 'paypal',
  },
];

export function getPlatformSavedPaymentMethods(): SavedPaymentMethod[] {
  if (process.env.EXPO_OS === 'ios') {
    return SAVED_PAYMENT_METHODS;
  }
  return SAVED_PAYMENT_METHODS.filter(
    (method) => method.brandId !== 'applePay',
  ).map((method) => ({
    ...method,
    isDefault: method.brandId === 'visa',
  }));
}

export const WALLET_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    title: 'Cashback on order',
    subtitle: 'Order #FR-2048',
    amount: 45,
    date: '22 Jun 2026',
  },
  {
    id: 'tx-2',
    title: 'Referral bonus',
    subtitle: 'Friend joined FreshCart',
    amount: 100,
    date: '18 Jun 2026',
  },
  {
    id: 'tx-3',
    title: 'Used on checkout',
    subtitle: 'FreshCart order',
    amount: -89,
    date: '15 Jun 2026',
  },
  {
    id: 'tx-4',
    title: 'Welcome credit',
    subtitle: 'New member bonus',
    amount: 194,
    date: '10 Jun 2026',
  },
];

export const PROFILE_OFFERS: ProfileOffer[] = [
  {
    id: 'offer-1',
    title: 'Flat 20% off',
    subtitle: 'On orders above $299',
    code: 'RUSH20',
    gradient: ['#D4543C', '#B8433A'],
    icon: 'tag.fill',
    expiresLabel: 'Expires 30 Jun',
  },
  {
    id: 'offer-2',
    title: 'Free delivery',
    subtitle: 'No minimum order',
    code: 'FREEDEL',
    gradient: ['#2D6A4F', '#1B4332'],
    icon: 'truck.box.fill',
    expiresLabel: 'Expires 15 Jul',
  },
  {
    id: 'offer-3',
    title: '$75 off',
    subtitle: 'First order of the week',
    code: 'WEEK75',
    gradient: ['#7C5CBF', '#5B3F96'],
    icon: 'sparkles',
    expiresLabel: 'Expires 7 Jul',
  },
  {
    id: 'offer-4',
    title: 'Gold exclusive',
    subtitle: 'Extra 10% for members',
    code: 'GOLD10',
    gradient: ['#C9A962', '#A8844A'],
    icon: 'crown.fill',
    expiresLabel: 'Member only',
  },
];

export const MEMBERSHIP_PERKS: MembershipPerk[] = [
  {
    id: 'perk-1',
    title: 'Free delivery',
    subtitle: 'Unlimited on all orders',
    icon: 'truck.box.fill',
  },
  {
    id: 'perk-2',
    title: 'Priority support',
    subtitle: 'Skip the queue for help',
    icon: 'headphones',
  },
  {
    id: 'perk-3',
    title: 'Extra cashback',
    subtitle: '5% back in FreshCart wallet',
    icon: 'wallet.pass.fill',
  },
  {
    id: 'perk-4',
    title: 'Member-only offers',
    subtitle: 'Early access to deals',
    icon: 'tag.fill',
  },
];

export type DeleteAccountImpact = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export const DELETE_ACCOUNT_IMPACT: DeleteAccountImpact[] = [
  {
    id: 'profile',
    title: 'Profile and preferences',
    subtitle: 'Name, delivery area and dietary choices',
    icon: 'person.fill',
  },
  {
    id: 'orders',
    title: 'Order history',
    subtitle: 'Past and active orders on this device',
    icon: 'bag.fill',
  },
  {
    id: 'saved',
    title: 'Saved items',
    subtitle: 'Wishlist, cart and wallet balance',
    icon: 'heart.fill',
  },
  {
    id: 'session',
    title: 'Sign-in session',
    subtitle: 'You will need to verify your phone again',
    icon: 'phone.fill',
  },
];
