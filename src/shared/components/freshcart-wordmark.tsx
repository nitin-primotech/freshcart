import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

type FreshCartWordmarkProps = {
  height?: number;
};

export function FreshCartWordmark({ height = 34 }: FreshCartWordmarkProps) {
  const leafSize = Math.round(height * 0.88);
  const fontSize = Math.round(height * 0.62);

  return (
    <View
      style={styles.root}
      accessibilityRole="image"
      accessibilityLabel="FreshCart"
    >
      <Svg
        width={leafSize}
        height={leafSize}
        viewBox="0 0 40 40"
        accessibilityElementsHidden
      >
        <Path
          d="M8 32C8 14 16 4 24 7C21 19 14 28 8 32Z"
          fill={colors.brandGreen}
        />
        <Path
          d="M18 34C18 20 26 12 32 15C29 26 23 34 18 34Z"
          fill={colors.brandGreen}
          opacity={0.9}
        />
      </Svg>
      <Text style={[styles.wordmark, { fontSize, lineHeight: fontSize + 4 }]}>
        <Text style={styles.fresh}>Fresh</Text>
        <Text style={styles.cart}>Cart</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    fontFamily: fonts.poppinsBold,
  },
  fresh: {
    fontFamily: fonts.poppinsBold,
    color: colors.onboardingTitle,
  },
  cart: {
    fontFamily: fonts.poppinsBold,
    color: colors.brandGreen,
  },
});
