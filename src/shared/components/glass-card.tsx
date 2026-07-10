import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { colors, shadows } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type GlassCardProps = ViewProps & {
  children: ReactNode;
  onPress?: () => void;
  intensity?: number;
  padding?: number;
};

export function GlassCard({
  children,
  onPress,
  intensity = 55,
  padding = spacing.lg,
  style,
  ...rest
}: GlassCardProps) {
  const content = (
    <View
      style={[
        styles.wrapper,
        shadows.glass,
        { padding, borderCurve: 'continuous' },
        style,
      ]}
      {...rest}
    >
      {process.env.EXPO_OS === 'web' ? (
        <View style={styles.webGlass}>{children}</View>
      ) : (
        <BlurView intensity={intensity} tint="light" style={styles.blur}>
          {children}
        </BlurView>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  blur: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  webGlass: {
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
});
