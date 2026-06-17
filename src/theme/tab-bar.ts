import { spacing } from '@/theme/spacing';

/** Native tab bar height is not measurable; use platform estimates + safe area. */
export const TAB_BAR_ESTIMATE = process.env.EXPO_OS === 'ios' ? 49 : 56;

export function tabBarContentPadding(bottomInset: number): number {
  return bottomInset + TAB_BAR_ESTIMATE + spacing.lg;
}

export function floatingCartBottomOffset(bottomInset: number): number {
  return bottomInset + TAB_BAR_ESTIMATE + spacing.md;
}
