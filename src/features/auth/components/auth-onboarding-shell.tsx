import { Image } from 'expo-image';
import { Fragment, type ReactNode } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  type AuthOnboardingCopy,
  resolveAuthIcon,
} from '@/features/auth/constants/auth-onboarding.constants';
import { AppSymbol } from '@/shared/components/app-symbol';
import { keyboardToolbarHeight } from '@/shared/components/keyboard-done-accessory';
import { useKeyboardHeight } from '@/shared/hooks/use-keyboard-height';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type AuthOnboardingShellProps = {
  copy: AuthOnboardingCopy;
  onBack: () => void;
  children: ReactNode;
};

function SpeedLines() {
  return (
    <View style={styles.speedLines} pointerEvents="none">
      {[0, 1, 2].map((index) => (
        <View
          key={`speed-${index}`}
          style={[styles.speedLine, { opacity: 1 - index * 0.22 }]}
        />
      ))}
    </View>
  );
}

function TrustStrip({ items }: { items: AuthOnboardingCopy['trust'] }) {
  return (
    <View style={styles.trustStrip}>
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 ? <View style={styles.trustDivider} /> : null}
          <View style={styles.trustItem}>
            <View style={styles.trustIcon}>
              <AppSymbol
                name={resolveAuthIcon(item.icon)}
                size={16}
                tintColor={colors.success}
              />
            </View>
            <Text style={styles.trustLabel} numberOfLines={2}>
              {item.label}
            </Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

export function AuthOnboardingShell({
  copy,
  onBack,
  children,
}: AuthOnboardingShellProps) {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const isKeyboardVisible = keyboardHeight > 0;

  function dismissKeyboard() {
    Keyboard.dismiss();
  }

  const keyboardLift = isKeyboardVisible
    ? keyboardHeight +
      (process.env.EXPO_OS === 'ios' ? keyboardToolbarHeight : 0) +
      spacing.sm
    : 0;

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <View style={styles.root}>
        {isKeyboardVisible ? (
          <View
            style={[styles.keyboardFill, { height: keyboardLift }]}
            pointerEvents="none"
          />
        ) : null}

        <View style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable
            onPress={onBack}
            style={styles.backBtn}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppSymbol
              name="chevron.left"
              size={22}
              tintColor={colors.textPrimary}
            />
          </Pressable>

          <Image
            source={require('@/assets/images/foodrushlogo.png')}
            style={styles.logo}
            contentFit="contain"
          />

          <View style={styles.headlineWrap}>
            <Text style={styles.headline}>
              {copy.line1}
              {'\n'}
              <Text style={styles.headlineAccent}>{copy.line2}</Text>
            </Text>
            {copy.showSpeedLines ? <SpeedLines /> : null}
          </View>

          <Text style={styles.tagline}>{copy.tagline}</Text>
        </View>

        <View
          style={[
            styles.cardHost,
            isKeyboardVisible && styles.cardHostKeyboard,
            { marginBottom: keyboardLift },
          ]}
        >
          <View
            style={[
              styles.whiteCard,
              isKeyboardVisible && styles.whiteCardKeyboard,
            ]}
          >
            <View style={styles.cardInner}>
              <View style={styles.formBlock}>{children}</View>
            </View>
          </View>
        </View>

        {!isKeyboardVisible ? (
          <View
            style={[
              styles.trustFooter,
              { paddingBottom: Math.max(insets.bottom, spacing.md) },
            ]}
          >
            <TrustStrip items={copy.trust} />
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.backgroundElevated,
    zIndex: 0,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.xs,
    marginBottom: -spacing.xs,
  },
  logo: {
    width: 88,
    height: 88,
  },
  headlineWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: spacing.xs,
    maxWidth: '100%',
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 32,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headlineAccent: {
    color: colors.primary,
  },
  speedLines: {
    marginTop: spacing.sm,
    gap: 3,
    transform: [{ rotate: '-28deg' }],
  },
  speedLine: {
    width: 14,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  cardHost: {
    flex: 1,
    zIndex: 1,
  },
  cardHostKeyboard: {
    backgroundColor: colors.backgroundElevated,
  },
  whiteCard: {
    flex: 1,
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderCurve: 'continuous',
    boxShadow: '0 -8px 24px rgba(28, 28, 30, 0.06)',
  },
  whiteCardKeyboard: {
    boxShadow: 'none',
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    justifyContent: 'flex-start',
  },
  formBlock: {
    gap: spacing.lg,
  },
  trustFooter: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  trustStrip: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  trustDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
    marginVertical: spacing.sm,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxs,
  },
  trustIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
