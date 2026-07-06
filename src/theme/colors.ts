/**
 * FreshCart — Premium grocery design tokens
 */

export const colors = {
  primary: '#2D8B3F',
  primaryDark: '#1A5C2A',
  primaryLight: '#4CAF50',
  secondary: '#1C1C1E',
  accent: '#E8F5E9',
  accentMuted: '#F1F8F2',

  textPrimary: '#1C1C1E',
  textSecondary: '#6B6B70',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textOnDark: '#FAFAFA',
  textOnDarkMuted: 'rgba(255, 255, 255, 0.72)',
  textOnDarkSoft: 'rgba(255, 255, 255, 0.55)',

  background: '#FFFFFF',
  backgroundElevated: '#FFFFFF',
  backgroundMuted: '#F5F5F5',
  backgroundDark: '#141416',

  card: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.72)',
  glassDark: 'rgba(28, 28, 30, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.45)',

  border: '#E8E8E8',
  borderStrong: '#D4D4D4',
  divider: '#F0F0F0',

  success: '#2D8B3F',
  successLight: '#E8F5E9',
  warning: '#D97706',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',

  star: '#F59E0B',
  overlay: 'rgba(0, 0, 0, 0.55)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',

  gradientStart: '#2D8B3F',
  gradientEnd: '#1A5C2A',
  gradientGoldStart: '#4CAF50',
  gradientGoldEnd: '#2D8B3F',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const screens = {
  home: {
    heroOverlay: 'rgba(26, 92, 42, 0.35)',
    promoText: '#FFFFFF',
  },
  restaurant: {
    heroGradient: ['transparent', 'rgba(20,20,22,0.85)'] as [string, string],
  },
  cart: {
    badge: '#2D8B3F',
  },
  tracking: {
    activeStep: '#2D8B3F',
    inactiveStep: '#E8E8E8',
  },
} as const;

export const gradients = {
  primary: {
    colors: [colors.gradientStart, colors.primaryDark] as [string, string],
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
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
    colors: ['#F5F5F5', '#FFFFFF', '#F5F5F5'] as [string, string, string],
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
    boxShadow: '0 12px 40px rgba(45, 139, 63, 0.28)',
  },
  glass: {
    boxShadow: '0 4px 20px rgba(28, 28, 30, 0.06)',
  },
} as const;

export default colors;
