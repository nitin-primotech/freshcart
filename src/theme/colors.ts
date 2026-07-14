/**
 * FreshCart — Premium grocery design tokens
 */

export const colors = {
  primary: '#249B42',
  primaryDark: '#1E7D36',
  primaryLight: '#2CAD4A',
  secondary: '#1C1C1E',
  accent: '#EDF6EF',
  accentMuted: '#F5F9F6',
  brandGreen: '#2CAD4A',
  brandGreenDark: '#249B42',
  onboardingCurve: '#E8F2EB',
  onboardingDot: '#D8D8D8',
  onboardingTitle: '#1A1A1A',
  onboardingBody: '#8A8A8A',

  textPrimary: '#1C1C1E',
  textSecondary: '#6B6B70',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textOnDark: '#FAFAFA',
  textOnDarkMuted: 'rgba(255, 255, 255, 0.72)',
  textOnDarkSoft: 'rgba(255, 255, 255, 0.55)',

  background: '#FFFFFF',
  backgroundElevated: '#FFFFFF',
  backgroundMuted: '#F8FAF8',
  backgroundDark: '#141416',

  card: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.72)',
  glassDark: 'rgba(28, 28, 30, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.45)',

  border: '#E8E8E8',
  borderStrong: '#D4D4D4',
  divider: '#F0F0F0',

  success: '#249B42',
  successLight: '#E6F2E9',
  warning: '#D97706',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',

  star: '#F59E0B',
  overlay: 'rgba(0, 0, 0, 0.55)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',

  gradientStart: '#2CAD4A',
  gradientEnd: '#249B42',
  gradientGoldStart: '#3DB855',
  gradientGoldEnd: '#249B42',

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
    badge: '#249B42',
  },
  tracking: {
    activeStep: '#249B42',
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
    boxShadow: '0 12px 40px rgba(36, 155, 66, 0.28)',
  },
  glass: {
    boxShadow: '0 4px 20px rgba(28, 28, 30, 0.06)',
  },
} as const;

export default colors;
