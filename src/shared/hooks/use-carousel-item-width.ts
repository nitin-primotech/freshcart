import { useWindowDimensions } from 'react-native';

import { spacing } from '@/theme/spacing';

type CarouselWidthOptions = {
  /** Full cards visible on screen (e.g. 2 = two cards fit cleanly) */
  visibleCount: number;
  /** Fraction of the next card peeking in (0–0.5) */
  peek?: number;
  gap?: number;
  paddingStart?: number;
  paddingEnd?: number;
};

export function useCarouselItemWidth({
  visibleCount,
  peek = 0.15,
  gap = spacing.md,
  paddingStart = spacing.lg,
  paddingEnd = spacing.sm,
}: CarouselWidthOptions): number {
  const { width } = useWindowDimensions();
  const gaps = gap * Math.max(visibleCount - 1, 0);
  const available = width - paddingStart - paddingEnd - gaps;
  const slots = visibleCount + peek;
  return Math.max(Math.floor(available / slots), 120);
}
