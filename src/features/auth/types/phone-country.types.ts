import type { CountryCode } from 'react-native-country-picker-modal';

export type PhoneCountry = {
  cca2: CountryCode;
  callingCode: string;
};

export const DEFAULT_PHONE_COUNTRY: PhoneCountry = {
  cca2: 'IN',
  callingCode: '91',
};
