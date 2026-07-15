export {
  formatDialCode,
  formatPhoneDisplay,
  isValidPhoneNumber,
  phoneCountryFromParams,
  sanitizePhoneInput,
} from '@/features/auth/utils/phone-number';

/** @deprecated Use sanitizePhoneInput instead */
export function sanitizeIndianPhoneInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

/** @deprecated Use isValidPhoneNumber with India country instead */
export function isValidIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

/** @deprecated Use formatPhoneDisplay instead */
export function formatIndianPhoneDisplay(phone: string): string {
  const digits = sanitizeIndianPhoneInput(phone);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}
