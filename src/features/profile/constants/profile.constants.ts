import type { OrderTabId } from '@/features/orders/constants/orders.constants';

export type ProfileOrderShortcut = {
  id: OrderTabId;
  label: string;
  icon: string;
};

export const PROFILE_ORDER_SHORTCUTS: ProfileOrderShortcut[] = [
  { id: 'all', label: 'All Orders', icon: 'bag.fill' },
  { id: 'ongoing', label: 'Ongoing', icon: 'clock' },
  { id: 'completed', label: 'Completed', icon: 'shippingbox.fill' },
  { id: 'cancelled', label: 'Cancelled', icon: 'xmark.circle.fill' },
  { id: 'returned', label: 'Returned', icon: 'arrow.2.circlepath' },
];

export type ProfileWalletStat = {
  id: string;
  label: string;
  value: string;
  icon: string;
  href?: string;
};

export const PROFILE_WALLET_STATS: ProfileWalletStat[] = [
  {
    id: 'freshcash',
    label: 'FreshCash',
    value: '$24.50',
    icon: 'wallet.pass.fill',
    href: '/profile/wallet',
  },
  {
    id: 'coupons',
    label: 'Coupons',
    value: '8 Available',
    icon: 'tag.fill',
    href: '/profile/offers',
  },
  {
    id: 'rewards',
    label: 'Rewards',
    value: '120 Points',
    icon: 'star.fill',
  },
  {
    id: 'club',
    label: 'Club Access',
    value: 'Active',
    icon: 'crown.fill',
    href: '/profile/membership',
  },
];

export type ProfileLinkItem = {
  id: string;
  title: string;
  icon: string;
  href?: string;
  trailing?: string;
  toggle?: boolean;
};

export const PROFILE_ACCOUNT_ITEMS: ProfileLinkItem[] = [
  {
    id: 'wishlist',
    title: 'My Wishlist',
    icon: 'heart.fill',
    href: '/(tabs)/wishlist',
  },
  {
    id: 'addresses',
    title: 'Addresses',
    icon: 'location.fill',
    href: '/profile/addresses',
  },
  {
    id: 'payments',
    title: 'Payment Methods',
    icon: 'creditcard.fill',
    href: '/profile/payments',
  },
  {
    id: 'saved-cards',
    title: 'Saved Cards',
    icon: 'wallet.pass.fill',
    href: '/profile/payments',
  },
  {
    id: 'club',
    title: 'FreshCart Club',
    icon: 'crown.fill',
    href: '/profile/membership',
  },
];

export const PROFILE_SUPPORT_ITEMS: ProfileLinkItem[] = [
  {
    id: 'help',
    title: 'Help Center',
    icon: 'questionmark.circle.fill',
    href: '/profile/support',
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: 'headphones',
    href: '/profile/support',
  },
  {
    id: 'about',
    title: 'About FreshCart',
    icon: 'info.circle.fill',
    href: '/profile/about',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: 'shield.fill',
    href: '/privacy',
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    icon: 'doc.text.fill',
    href: '/terms',
  },
];

export const PROFILE_AVATAR_URI =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop';

export function formatProfilePhone(
  phone: string | null,
  callingCode = '91',
): string {
  if (!phone?.trim()) return `+${callingCode} 98765 43210`;
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    const local = digits.slice(-10);
    return `+${callingCode} ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return `+${callingCode} ${phone}`;
}

export function profileEmailFromName(name: string): string {
  const slug = name.trim().toLowerCase().replace(/\s+/g, '.');
  return `${slug || 'john.doe'}@example.com`;
}

export function profileInitials(name: string | null): string {
  if (!name?.trim()) return 'JD';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function profileDisplayName(name: string | null): string {
  return name?.trim() || 'John Doe';
}
