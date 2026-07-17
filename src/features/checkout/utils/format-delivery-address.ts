import type { DeliveryAddress } from '@/features/catalog/types/catalog.types';

export function formatDeliveryLine2(input: {
  city: string;
  state?: string;
  zipCode?: string;
}): string {
  const cityState = [input.city.trim(), input.state?.trim() ?? '']
    .filter(Boolean)
    .join(', ');
  return [cityState, input.zipCode?.trim() ?? ''].filter(Boolean).join(' ');
}

export function formatDeliveryAddressDisplay(address: DeliveryAddress): string {
  const parts = [
    address.flatOrHouse?.trim(),
    address.line1?.trim(),
    address.landmark?.trim(),
    address.city?.trim() || address.line2?.trim(),
    address.state?.trim(),
    address.zipCode?.trim(),
  ].filter(Boolean);

  return parts.join(', ');
}

export function isCheckoutAddressComplete(address: DeliveryAddress): boolean {
  const flat = address.flatOrHouse?.trim() ?? '';
  const street = address.line1?.trim() ?? '';
  const city = address.city?.trim() || address.line2?.trim() || '';
  return flat.length >= 1 && street.length >= 2 && city.length >= 2;
}
