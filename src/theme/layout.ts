/**
 * foodRush — Layout
 * ---------------------------------------------------------------------------
 * Screen dimensions and safe-area insets. Keep layout/responsive constants
 * here so `fonts.ts` stays purely about typography.
 *
 *   import { SCREEN_WIDTH, SCREEN_HEIGHT, topInset } from '@/theme/layout';
 *
 * `topInset` is a snapshot of the top safe-area at module load. Prefer
 * `useSafeAreaInsets()` from `react-native-safe-area-context` inside
 * components — use this constant only when a hook is awkward (e.g. in a
 * StyleSheet defined at module scope).
 * ---------------------------------------------------------------------------
 */

import { Dimensions, StatusBar } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

const safeAreaTop = initialWindowMetrics?.insets.top ?? 0;
const statusBarHeight = StatusBar.currentHeight ?? 0;

// Notched devices report >= 40 — trust the OS.
// Non-notched / metrics-missing fallbacks need a small visual pad.
export const topInset =
  safeAreaTop >= 40
    ? safeAreaTop
    : statusBarHeight + (safeAreaTop > 0 ? 30 : 20);
