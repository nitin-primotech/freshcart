import { DEFAULT_PROFILE } from '@/features/auth/services/profile-storage';
import type { AuthSession } from '@/features/auth/types/auth.types';
import type { DeliveryAddress } from '@/features/catalog/types/catalog.types';
import { isCheckoutAddressComplete } from '@/features/checkout/utils/format-delivery-address';
import { resolveProfileIdentity } from '@/features/profile/utils/profile-identity';

export type CheckoutReadinessIssue = 'name' | 'location';

export function isDefaultDeliveryAddress(address: DeliveryAddress): boolean {
  return (
    address.line1 === DEFAULT_PROFILE.address.line1 &&
    address.line2 === DEFAULT_PROFILE.address.line2 &&
    (address.label === DEFAULT_PROFILE.address.label ||
      address.label === 'Home')
  );
}

export function getCheckoutReadinessIssues(input: {
  userName: string;
  address: DeliveryAddress;
  session: AuthSession | null;
}): CheckoutReadinessIssue[] {
  const issues: CheckoutReadinessIssue[] = [];
  const identity = resolveProfileIdentity({
    storedName: input.userName,
    session: input.session,
  });

  if (identity.needsName) {
    issues.push('name');
  }

  if (!isCheckoutAddressComplete(input.address)) {
    issues.push('location');
  }

  return issues;
}

export function needsCheckoutDetails(input: {
  userName: string;
  address: DeliveryAddress;
  session: AuthSession | null;
}): boolean {
  return getCheckoutReadinessIssues(input).length > 0;
}

export const CHECKOUT_DETAILS_ROUTE = '/checkout/details' as const;
