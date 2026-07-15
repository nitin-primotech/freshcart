import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import CountryPicker, {
  type Country,
  type CountryCode,
} from 'react-native-country-picker-modal';

import { CountryFlag } from '@/features/auth/components/country-flag';
import type { PhoneCountry } from '@/features/auth/types/phone-country.types';
import { formatDialCode } from '@/features/auth/utils/phone-number';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type CountryCodePickerButtonProps = {
  country: PhoneCountry;
  onSelect: (country: PhoneCountry) => void;
};

export function CountryCodePickerButton({
  country,
  onSelect,
}: CountryCodePickerButtonProps) {
  const [visible, setVisible] = useState(false);

  function handleSelect(selected: Country) {
    onSelect({
      cca2: selected.cca2,
      callingCode: selected.callingCode[0] ?? country.callingCode,
    });
    setVisible(false);
  }

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => {
          hapticSoftTap();
          setVisible(true);
        }}
        accessibilityRole="button"
        accessibilityLabel={`Country code ${formatDialCode(country.callingCode)}`}
      >
        <CountryFlag countryCode={country.cca2} size={22} />
        <Text style={styles.callingCode}>
          {formatDialCode(country.callingCode)}
        </Text>
        <AppSymbol
          name="chevron.down"
          size={11}
          tintColor={colors.textSecondary}
        />
      </Pressable>

      <CountryPicker
        countryCode={country.cca2 as CountryCode}
        withFilter
        withFlag
        withCallingCode
        withEmoji
        withModal
        withFlagButton={false}
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={handleSelect}
        preferredCountries={['IN', 'US', 'GB', 'AE', 'SG', 'CA']}
        modalProps={{ animationType: 'slide' }}
        theme={{
          primaryColor: colors.primary,
          onBackgroundTextColor: colors.textPrimary,
          backgroundColor: colors.background,
          fontSize: 16,
          fontFamily: fonts.regular,
          filterPlaceholderTextColor: colors.textTertiary,
          activeOpacity: 0.7,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingRight: spacing.sm,
  },
  callingCode: {
    fontFamily: fonts.poppinsSemibold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.onboardingTitle,
  },
});
