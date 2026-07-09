import type { StyleProp, ViewStyle } from 'react-native';

import FreshCartLogoAsset from '@/assets/logo/freshcart-logo.svg';

type FreshCartLogoProps = {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function FreshCartLogo({
  width = 200,
  height = 62,
  style,
  accessibilityLabel = 'FreshCart',
}: FreshCartLogoProps) {
  return (
    <FreshCartLogoAsset
      width={width}
      height={height}
      style={style}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
