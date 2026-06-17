/**
 * foodRush — Premium design tokens
 */

export const colors = {
  primary: '#D4543C',
  primaryDark: '#B8433A',
  primaryLight: '#F4A99A',
  secondary: '#1C1C1E',
  accent: '#C9A962',
  accentMuted: '#E8DFC8',

  textPrimary: '#1C1C1E',
  textSecondary: '#6B6B70',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textOnDark: '#FAF8F5',
  textOnDarkMuted: 'rgba(255, 255, 255, 0.72)',
  textOnDarkSoft: 'rgba(255, 255, 255, 0.55)',

  background: '#FAF8F5',
  backgroundElevated: '#FFFFFF',
  backgroundMuted: '#F0EBE4',
  backgroundDark: '#141416',

  card: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.72)',
  glassDark: 'rgba(28, 28, 30, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.45)',

  border: '#E8E4DE',
  borderStrong: '#D4CEC6',
  divider: '#EDE8E1',

  success: '#2D6A4F',
  successLight: '#E8F5EE',
  warning: '#D97706',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',

  star: '#F59E0B',
  overlay: 'rgba(0, 0, 0, 0.55)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',

  gradientStart: '#D4543C',
  gradientEnd: '#8B3A32',
  gradientGoldStart: '#C9A962',
  gradientGoldEnd: '#A8844A',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const screens = {
  home: {
    heroOverlay: 'rgba(20, 20, 22, 0.35)',
    promoText: '#FFFFFF',
  },
  restaurant: {
    heroGradient: ['transparent', 'rgba(20,20,22,0.85)'] as [string, string],
  },
  cart: {
    badge: '#D4543C',
  },
  tracking: {
    activeStep: '#D4543C',
    inactiveStep: '#E8E4DE',
  },
} as const;

export const gradients = {
  primary: {
    colors: [colors.gradientStart, colors.gradientEnd] as [string, string],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  gold: {
    colors: [colors.gradientGoldStart, colors.gradientGoldEnd] as [
      string,
      string,
    ],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
  shimmer: {
    colors: ['#F0EBE4', '#FFFFFF', '#F0EBE4'] as [string, string, string],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  },
} as const;

export const shadows = {
  soft: {
    boxShadow: '0 4px 24px rgba(28, 28, 30, 0.08)',
  },
  card: {
    boxShadow: '0 8px 32px rgba(28, 28, 30, 0.1)',
  },
  float: {
    boxShadow: '0 12px 40px rgba(212, 84, 60, 0.28)',
  },
  glass: {
    boxShadow: '0 4px 20px rgba(28, 28, 30, 0.06)',
  },
} as const;

export default colors;
