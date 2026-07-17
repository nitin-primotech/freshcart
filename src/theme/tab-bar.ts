import { spacing } from '@/theme/spacing';

/** Native tab bar height is not measurable; use platform estimates + safe area. */
export const TAB_BAR_ESTIMATE = process.env.EXPO_OS === 'ios' ? 49 : 56;

/** Extra lift for floating NativeTabs pill above the home indicator. */
export const FLOATING_TAB_BAR_EXTRA = process.env.EXPO_OS === 'ios' ? 24 : 16;

/** Product detail footer height (stepper + padding). */
export const PRODUCT_DETAIL_FOOTER_HEIGHT = 72;

export function tabBarContentPadding(bottomInset: number): number {
  return bottomInset + TAB_BAR_ESTIMATE + FLOATING_TAB_BAR_EXTRA + spacing.lg;
}

export function floatingCartBottomOffset(
  bottomInset: number,
  options?: { hasTabBar?: boolean; aboveProductFooter?: boolean },
): number {
  if (options?.aboveProductFooter) {
    return bottomInset + PRODUCT_DETAIL_FOOTER_HEIGHT + spacing.sm;
  }
  if (options?.hasTabBar === false) {
    return bottomInset + spacing.lg;
  }
  return bottomInset + TAB_BAR_ESTIMATE + FLOATING_TAB_BAR_EXTRA + spacing.lg;
}
