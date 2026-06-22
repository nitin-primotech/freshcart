import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInRight, ZoomIn } from 'react-native-reanimated';

import { colors } from '@/theme/colors';
import { radius } from '@/theme/spacing';

const THUMB_SIZE = 36;
const THUMB_OVERLAP = 14;

type StackSlot = {
  left: number;
  zIndex: number;
};

type CartThumbStackProps = {
  thumbs: { id: string; image: string }[];
  /** Highlight the most recently added item with a pop-in. */
  highlightId?: string | null;
};

function getStackSlots(count: number): StackSlot[] {
  const step = THUMB_SIZE - THUMB_OVERLAP;
  return Array.from({ length: count }, (_, index) => ({
    left: index * step,
    zIndex: index + 1,
  }));
}

export function cartThumbStackWidth(count: number) {
  if (count <= 0) return 0;
  return THUMB_SIZE + (count - 1) * (THUMB_SIZE - THUMB_OVERLAP);
}

export const CART_THUMB_SIZE = THUMB_SIZE;

export function CartThumbStack({ thumbs, highlightId }: CartThumbStackProps) {
  if (thumbs.length === 0) return null;

  const slots = getStackSlots(thumbs.length);

  return (
    <View
      style={[styles.stack, { width: cartThumbStackWidth(thumbs.length) }]}
      pointerEvents="none"
    >
      {thumbs.map((thumb, index) => {
        const slot = slots[index];
        const isHighlight = thumb.id === highlightId;

        return (
          <Animated.View
            key={thumb.id}
            entering={
              isHighlight
                ? ZoomIn.springify().damping(14).stiffness(280)
                : FadeInRight.springify()
                    .damping(16)
                    .stiffness(240)
                    .delay(index * 40)
            }
            style={[
              styles.thumb,
              {
                left: slot.left,
                zIndex: slot.zIndex,
              },
            ]}
          >
            <Image
              source={{ uri: thumb.image }}
              style={styles.image}
              contentFit="cover"
              recyclingKey={thumb.id}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    position: 'relative',
    height: THUMB_SIZE,
    overflow: 'visible',
  },
  thumb: {
    position: 'absolute',
    top: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.textInverse,
    backgroundColor: colors.primaryDark,
    borderCurve: 'continuous',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
