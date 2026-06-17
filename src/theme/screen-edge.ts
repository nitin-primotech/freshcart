import { spacing } from '@/theme/spacing';

/** Top padding for edge-to-edge screens (content below translucent status bar). */
export function screenTopPadding(topInset: number, extra = spacing.sm): number {
  return topInset + extra;
}
