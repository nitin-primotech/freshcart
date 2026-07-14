import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSymbol } from '@/shared/components/app-symbol';
import {
  clearProfileSavedToast,
  selectProfileSavedToken,
  useAppStore,
} from '@/store/app.store';
import { colors, shadows } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const VISIBLE_MS = 1800;
const ENTER_MS = 260;

/** Show toast on edit screen, then navigate back after this delay. */
export const PROFILE_SAVED_NAV_DELAY_MS = ENTER_MS + VISIBLE_MS;

export function ProfileSavedToast() {
  const insets = useSafeAreaInsets();
  const profileSavedToken = useAppStore(selectProfileSavedToken);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!profileSavedToken) return;

    progress.value = 0;
    progress.value = withSequence(
      withTiming(1, { duration: ENTER_MS, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: VISIBLE_MS }),
      withTiming(
        0,
        { duration: 280, easing: Easing.in(Easing.cubic) },
        (done) => {
          if (done) {
            runOnJS(clearProfileSavedToast)();
          }
        },
      ),
    );
  }, [profileSavedToken, progress]);

  const toastStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * -18 },
      { scale: 0.94 + progress.value * 0.06 },
    ],
  }));

  if (!profileSavedToken) return null;

  return (
    <View style={styles.host} pointerEvents="none">
      <Animated.View
        style={[
          styles.toast,
          shadows.card,
          toastStyle,
          { marginTop: insets.top + spacing.sm },
        ]}
      >
        <View style={styles.iconWrap}>
          <AppSymbol
            name="checkmark.circle.fill"
            size={22}
            tintColor={colors.success}
          />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Profile edited successfully</Text>
          <Text style={styles.subtitle}>Your changes have been saved</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFill,
    zIndex: 220,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    maxWidth: '92%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: 'rgba(36, 155, 66, 0.18)',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
