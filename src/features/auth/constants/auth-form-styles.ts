import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export const AUTH_INPUT_MIN_HEIGHT = 56;
export const AUTH_INPUT_ROW_MIN_HEIGHT = 28;

export const authFormStyles = StyleSheet.create({
  inputWrap: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    minHeight: AUTH_INPUT_MIN_HEIGHT,
    justifyContent: 'center',
  },
  floatingLabel: {
    position: 'absolute',
    top: -11,
    left: spacing.md,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: AUTH_INPUT_ROW_MIN_HEIGHT,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 17,
    lineHeight: 22,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  inputDivider: {
    width: StyleSheet.hairlineWidth,
    height: AUTH_INPUT_ROW_MIN_HEIGHT,
    marginRight: spacing.md,
    backgroundColor: colors.borderStrong,
  },
});
