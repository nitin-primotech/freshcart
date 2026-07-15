import {
  DEFAULT_PHONE_COUNTRY,
  type PhoneCountry,
} from '@/features/auth/types/phone-country.types';

const INDIAN_MOBILE = /^[6-9]\d{9}$/;

export function formatDialCode(callingCode: string): string {
  const trimmed = callingCode.trim();
  return trimmed.startsWith('+') ? trimmed : `+${trimmed}`;
}

export function sanitizePhoneInput(
  value: string,
  country: PhoneCountry = DEFAULT_PHONE_COUNTRY,
): string {
  const digits = value.replace(/\D/g, '');
  const maxLength = country.cca2 === 'IN' ? 10 : 15;
  return digits.slice(0, maxLength);
}

export function isValidPhoneNumber(
  phone: string,
  country: PhoneCountry = DEFAULT_PHONE_COUNTRY,
): boolean {
  if (country.cca2 === 'IN') {
    return INDIAN_MOBILE.test(phone);
  }
  return phone.length >= 6 && phone.length <= 15;
}

export function formatPhoneDisplay(
  phone: string,
  country: PhoneCountry = DEFAULT_PHONE_COUNTRY,
): string {
  const digits = sanitizePhoneInput(phone, country);
  if (country.cca2 === 'IN') {
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return digits;
}

export function phoneCountryFromParams(
  countryCode?: string,
  callingCode?: string,
): PhoneCountry {
  if (!countryCode || countryCode.length !== 2) {
    return DEFAULT_PHONE_COUNTRY;
  }

  return {
    cca2: countryCode.toUpperCase() as PhoneCountry['cca2'],
    callingCode:
      callingCode?.replace(/\D/g, '') || DEFAULT_PHONE_COUNTRY.callingCode,
  };
}
