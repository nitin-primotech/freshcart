import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { gradients } from '@/theme/colors';
import { radius } from '@/theme/spacing';

type ShimmerProps = ViewProps & {
  height?: number;
  width?: number | `${number}%`;
  borderRadius?: number;
};

export function Shimmer({
  height = 16,
  width = '100%',
  borderRadius = radius.sm,
  style,
  ...rest
}: ShimmerProps) {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 120 }],
  }));

  return (
    <View
      style={[
        styles.base,
        { height, width, borderRadius, borderCurve: 'continuous' },
        style,
      ]}
      {...rest}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={gradients.shimmer.colors}
          start={gradients.shimmer.start}
          end={gradients.shimmer.end}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: '#F0EBE4',
  },
});
