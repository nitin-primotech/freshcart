import { StyleSheet, Text } from 'react-native';

type CountryFlagProps = {
  countryCode: string;
  size?: number;
};

export function countryCodeToFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function CountryFlag({ countryCode, size = 20 }: CountryFlagProps) {
  return (
    <Text
      style={[styles.flag, { fontSize: size, lineHeight: size + 2 }]}
      allowFontScaling={false}
      accessibilityLabel={`${countryCode} flag`}
    >
      {countryCodeToFlagEmoji(countryCode)}
    </Text>
  );
}

const styles = StyleSheet.create({
  flag: {
    textAlign: 'center',
  },
});
